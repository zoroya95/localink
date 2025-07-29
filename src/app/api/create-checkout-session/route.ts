// pages/api/create-checkout-session/route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from "stripe";
import { getCurrentSession } from '@/actions/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const session = await getCurrentSession();
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { priceId } = req.body;

  if (!priceId || typeof priceId !== 'string') {
    return res.status(400).json({ error: 'Valid price ID is required' });
  }

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/subscriptions`,
      customer_email: session.user.email || undefined,
      client_reference_id: session.user.id.toString(), // ✅ cast en string
    });

    if (!checkoutSession.url) {
      throw new Error('Failed to create checkout session');
    }

    return res.status(303).json({ url: checkoutSession.url });
  } catch (err) {
    console.error('Checkout session error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    return res.status(500).json({ error: errorMessage });
  }
}

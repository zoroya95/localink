// pages/api/stripe-webhook/route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import {prisma} from '../../../db/prisma';
import { Readable } from 'stream';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});


export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable: Readable) {
  const chunks: Buffer[] = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  let event: Stripe.Event;

  try {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'] as string;

    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed.', err);
    return res.status(400).send(`Webhook Error: ${errorMessage}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const rawUserId = session.client_reference_id;
    const userId = rawUserId ? Number(rawUserId) : null;

    if (!userId || !Number.isInteger(userId)) {
      console.warn('Invalid or missing client_reference_id:', rawUserId);
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        console.warn(`User not found with ID ${userId}`);
        return res.status(404).json({ error: 'User not found' });
      }

      // Récupérer les produits achetés
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id
      );

      const priceId = lineItems.data[0]?.price?.id;

      let subscriptionLevel: string | null = null;

      if (priceId === process.env.STRIPE_PRICE_ID_PRO) {
        subscriptionLevel = 'pro';
      } else if (priceId === process.env.STRIPE_PRICE_ID_PREMIUM) {
        subscriptionLevel = 'premium';
      } else {
        console.warn('Price ID non reconnu:', priceId);
      }

      await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionLevel,
          stripeCustomerId: session.customer as string,
        },
      });

      console.log(`✅ Abonnement mis à jour pour l'utilisateur ${user.email}`);
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  return res.status(200).json({ received: true });
}

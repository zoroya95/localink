import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function POST(req: Request) {
  try {
    const { priceId } = await req.json();
    if (!priceId)
      return NextResponse.json({ error: 'priceId requis' }, { status: 400 });

    // Récupère le prix Stripe
    const price = await stripe.prices.retrieve(priceId);
    if (!price.product)
      return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });

    // Récupère le produit Stripe
    const product = await stripe.products.retrieve(
      typeof price.product === 'string' ? price.product : price.product.id
    );

    return NextResponse.json({
      price: {
        id: price.id,
        unit_amount: price.unit_amount,
        currency: price.currency,
        recurring: price.recurring,
      },
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
      },
    });
  } catch (error: unknown) {
    console.error('Stripe webhook error:', error);

    const message =
      error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

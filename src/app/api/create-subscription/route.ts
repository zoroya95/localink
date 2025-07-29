import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-06-30.basil',
});

export async function POST(req: NextRequest) {
    try {
        const { email, paymentMethodId, priceId, quantity } = await req.json();

        // créer un client Stripe
        const customer = await stripe.customers.create({
            email,
            payment_method: paymentMethodId,
            invoice_settings: {
                default_payment_method: paymentMethodId,
            },
        });

        // créer un abonnement
        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: priceId, quantity: quantity ?? 1 }],
            expand: ['latest_invoice.payment_intent'],
        });

        return NextResponse.json(subscription, { status: 200 });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

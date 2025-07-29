"use client";

import { useState } from 'react';
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'next/navigation';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Separator } from '@/components/ui/separator';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm() {
    // States
    const [email, setEmail] = useState('');
    const [country, setCountry] = useState('France');
    const [postalCode, setPostalCode] = useState('');
    const [planType, setPlanType] = useState<'mensuel' | 'annuel'>('mensuel');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [stripeInfo, setStripeInfo] = useState<any>(null);
    const [stripeLoading, setStripeLoading] = useState(false);
    const [step, setStep] = useState<'onboarding' | 'payment'>('onboarding');
    const [onboardingError, setOnboardingError] = useState<string | null>(null);
    const [cardName, setCardName] = useState('');
    const [cardNumberError, setCardNumberError] = useState<string | null>(null);
    const [cardNameError, setCardNameError] = useState<string | null>(null);
    const [cardExpiryError, setCardExpiryError] = useState<string | null>(null);
    const [cardCvcError, setCardCvcError] = useState<string | null>(null);

    const router = useRouter();
    const stripe = useStripe();
    const elements = useElements();

    // Stripe IDs
    const priceIdMensuel = 'price_1RoApRAkgFpt9TxPEDkJ1HRG';
    const priceIdAnnuel = 'price_1RoAqVAkgFpt9TxPOnSb3gvs'; 
    const tvaRate = 0.2;
    const priceId = planType === 'mensuel' ? priceIdMensuel : priceIdAnnuel;

    // Fetch Stripe infos
    React.useEffect(() => {
        setStripeLoading(true);
        fetch('/api/stripe-product-info', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ priceId }),
        })
            .then(res => res.json())
            .then(data => {
                setStripeInfo(data);
                setStripeLoading(false);
            })
            .catch(() => setStripeLoading(false));
    }, [priceId]);

    // Price Calculations
    const unitPrice = stripeInfo?.price?.unit_amount ? stripeInfo.price.unit_amount / 100 : 0;
    const currency = stripeInfo?.price?.currency?.toUpperCase() === 'EUR' ? '€' : (stripeInfo?.price?.currency?.toUpperCase() || 'EUR');
    const subTotal = unitPrice;
    const tva = subTotal * tvaRate;
    const total = subTotal + tva;

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setCardNumberError(null);
        setCardNameError(null);
        setCardExpiryError(null);
        setCardCvcError(null);

        if (!stripe || !elements) {
            setError('Stripe n\'est pas encore prêt.');
            setLoading(false);
            return;
        }

        let hasError = false;
        if (!cardName.trim()) {
            setCardNameError('Entrer un nom de titulaire de carte valide');
            hasError = true;
        }
        if (cardNumberError || cardExpiryError || cardCvcError) {
            hasError = true;
        }
        if (hasError) {
            setLoading(false);
            return;
        }

        try {
            const cardNumberElement = elements.getElement(CardNumberElement);
            if (!cardNumberElement) {
                setCardNumberError('Entrer un numéro de carte bancaire valide');
                setLoading(false);
                return;
            }
            const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardNumberElement,
                billing_details: { name: cardName },
            });

            if (paymentMethodError) {
                setError(paymentMethodError.message ? paymentMethodError.message : 'Une erreur est survenue');
                setLoading(false);
                return;
            }

            const response = await fetch('/api/create-subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    country,
                    postalCode,
                    paymentMethodId: paymentMethod.id,
                    priceId: planType === 'mensuel' ? priceIdMensuel : priceIdAnnuel,
                    quantity: 1,
                }),
            });

            const subscription = await response.json();

            if (subscription.status === 'active') {
                router.push('/success');
            } else {
                setError('L\'abonnement n\'a pas pu être créé.');
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-3xl shadow-2xl p-8 border border-blue-100">
                {/* Colonne gauche : récapitulatif commande */}
                <div className="border-r border-gray-100 pr-8 flex flex-col justify-between">
                    <div>
                        <h2 className="font-bold text-blue-500 mb-6 text-base">Récapitulatif de la commande</h2>
                        {stripeLoading ? (
                            <div className="flex justify-center items-center h-full w-full min-h-[300px]">
                                <svg className="animate-spin h-8 w-8 text-blue-400" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                </svg>
                            </div>
                        ) : stripeInfo && stripeInfo.product ? (
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <div className="text-4xl font-extrabold text-blue-600 flex items-baseline justify-end">
                                        <span className="mr-2">{total.toFixed(2)} {currency}</span>
                                        <span className="text-base text-gray-400 font-normal">TVA incluse</span>
                                    </div>
                                    <div className='text-gray-500 text-sm text-right'>
                                        puis {total.toFixed(2)} {currency} {planType === 'mensuel' ? 'mensuel' : 'annuel'}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="font-semibold text-gray-700">{stripeInfo.product.name}</div>
                                    <div className="text-gray-500 text-sm">{stripeInfo.product.description}</div>
                                </div>
                                <div className="flex flex-row justify-between items-center mb-2">
                                    <span className="text-gray-700">
                                        Qté: <span className="font-medium">{stripeInfo.product.quantity || 1}</span>
                                    </span>
                                </div>
                                <Separator className="my-2" />
                                <div className="space-y-2">
                                    <div className="flex flex-row justify-between items-center">
                                        <span className="text-gray-700">Sous-total :</span>
                                        <span className="font-medium">{subTotal.toFixed(2)} {currency}</span>
                                    </div>
                                    <div className="flex flex-row justify-between items-center">
                                        <span className="text-gray-700">TVA :</span>
                                        <span className="font-medium">{tva.toFixed(2)} {currency}</span>
                                    </div>
                                    <div className="flex flex-row justify-between items-center text-lg font-semibold mt-2">
                                        <span className="text-gray-900">Dû aujourd&apos;hui :</span>
                                        <span className="text-blue-500">{total.toFixed(2)} {currency}</span>
                                    </div>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex flex-row justify-between items-center text-lg font-bold mt-4">
                                    <span className="text-gray-900">À payer :</span>
                                    <span className="text-blue-500">{total.toFixed(2)} {currency}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-red-500">Impossible de charger les infos Stripe</div>
                        )}
                    </div>
                </div>
                {/* Colonne droite : onboarding puis paiement */}
                <div className="pl-12 flex flex-col h-full justify-between">
                    <div className="flex items-center justify-center mb-8 gap-2 select-none">
                        {step === 'onboarding' ? (
                            <span className="text-blue-500 font-bold cursor-default">Vos coordonnées</span>
                        ) : (
                            <button
                                type="button"
                                className="text-gray-900 font-bold underline underline-offset-2 hover:text-blue-600 transition-colors cursor-pointer"
                                onClick={() => setStep('onboarding')}
                            >
                                Vos coordonnées
                            </button>
                        )}
                        <span className="mx-1 text-gray-400">&gt;</span>
                        <span className={step === 'payment' ? 'text-blue-500 font-bold' : 'text-gray-400'}>Paiement</span>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                    {step === 'onboarding' && (
                        
                        <form className="space-y-8" onSubmit={e => {
                            e.preventDefault();
                            setOnboardingError(null);
                            if (!email || !country || !postalCode) {
                                setOnboardingError('Veuillez remplir tous les champs.');
                                return;
                            }
                            setStep('payment');
                        }}>
                            <div className="flex justify-start mb-6">
                                <span className="text-sm text-gray-400 max-w-xs">
                                Nous recueillons ces informations afin de lutter contre la fraude et de garantir que votre paiement est sécurisé.
                                </span>
                            </div>
                            <input
                                type="email"
                                placeholder="Votre email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="block w-full px-3 py-2 border border-blue-200 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                            />
                            <input
                                type="text"
                                placeholder="Pays"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                required
                                className="block w-full px-3 py-2 border border-blue-200 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                            />
                            <input
                                type="text"
                                placeholder="Code postal"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                                required
                                className="block w-full px-3 py-2 border border-blue-200 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                            />
                            <div className="flex justify-center mt-4">
                            <button
                                type="submit"
                                className="flex-1 flex justify-center py-2 px-4 border cursor-pointer border-transparent rounded-2xl shadow-sm text-base font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                            >
                                Continuer
                            </button>
                            </div>
                            {onboardingError && <div className="mt-2 text-center text-red-600">{onboardingError}</div>}
                        </form>
                    )}
                    {step === 'payment' && (
                        <form onSubmit={handleSubmit} className="space-y-8 flex flex-col h-full justify-between">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-gray-700 mb-2">Numéro de carte</label>
                                    <div
                                        style={{
                                            border: cardNumberError ? '1px solid #e53e3e' : '1px solid #FBBF24',
                                            borderRadius: '1rem',
                                            padding: '0.5rem 0.75rem',
                                            boxShadow: '0 1px 2px 0 rgba(0,0,0,0.02)',
                                            marginBottom: '0.25rem',
                                            background: '#fff',
                                        }}
                                    >
                                        <CardNumberElement
                                            options={{
                                                showIcon: false,
                                                style: {
                                                    base: {
                                                        fontSize: '16px',
                                                        color: '#1a202c',
                                                        '::placeholder': { color: '#a0aec0' },
                                                    },
                                                    invalid: { color: '#e53e3e' },
                                                },
                                            }}
                                            onChange={e => {
                                                if (e.error) setCardNumberError('Entrer un numéro de carte bancaire valide');
                                                else if (!e.complete) setCardNumberError('Entrer un numéro de carte bancaire valide');
                                                else setCardNumberError(null);
                                            }}
                                        />
                                    </div>
                                    {cardNumberError && <div className="text-red-600 text-sm mb-2">{cardNumberError}</div>}
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">Nom figurant sur la carte</label>
                                    <input
                                        type="text"
                                        placeholder="Nom sur la carte"
                                        required
                                        className={`block w-full px-3 py-2 border rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 mb-2 ${cardNameError ? 'border-red-600' : 'border-blue-200'}`}
                                        value={cardName}
                                        onChange={e => {
                                            setCardName(e.target.value);
                                            if (e.target.value.trim()) setCardNameError(null);
                                            else setCardNameError('Entrer un nom de titulaire de carte valide');
                                        }}
                                    />
                                    {cardNameError && <div className="text-red-600 text-sm mb-2">{cardNameError}</div>}
                                </div>
                                <div className="flex gap-6">
                                    <div className="flex-1">
                                        <label className="block text-gray-700 mb-2">Date d&apos;expiration</label>
                                        <div
                                            className={`block w-full px-3 py-2 border rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${cardExpiryError ? 'border-red-600' : 'border-blue-200'}`}
                                        >
                                            <CardExpiryElement
                                                options={{
                                                    style: {
                                                        base: {
                                                            fontSize: '16px',
                                                            color: '#1a202c',
                                                            '::placeholder': { color: '#a0aec0' },
                                                        },
                                                        invalid: { color: '#e53e3e' },
                                                    },
                                                }}
                                                onChange={e => {
                                                    if (e.error) setCardExpiryError("Entrer une date d'expiration valide");
                                                    else if (!e.complete) setCardExpiryError("Entrer une date d'expiration valide");
                                                    else setCardExpiryError(null);
                                                }}
                                            />
                                        </div>
                                        {cardExpiryError && <div className="text-red-600 text-sm mb-2">{cardExpiryError}</div>}
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-gray-700 mb-2">Code sécurité</label>
                                        <div
                                            className={`block w-full px-3 py-2 border rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${cardCvcError ? 'border-red-600' : 'border-blue-200'}`}
                                        >
                                            <CardCvcElement
                                                options={{
                                                    style: {
                                                        base: {
                                                            fontSize: '16px',
                                                            color: '#1a202c',
                                                            '::placeholder': { color: '#a0aec0' },
                                                        },
                                                        invalid: { color: '#e53e3e' },
                                                    },
                                                }}
                                                onChange={e => {
                                                    if (e.error) setCardCvcError('Entrer un cryptogramme visuel valide');
                                                    else if (!e.complete) setCardCvcError('Entrer un cryptogramme visuel valide');
                                                    else setCardCvcError(null);
                                                }}
                                            />
                                        </div>
                                        {cardCvcError && <div className="text-red-600 text-sm mb-2">{cardCvcError}</div>}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4 mt-8 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setStep('onboarding')}
                                    className="px-6 py-2 rounded-2xl border border-blue-200 text-blue-500 bg-white hover:bg-blue-50 font-semibold shadow-sm transition-colors duration-200"
                                >
                                    Retour coordonnées
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 rounded-2xl border border-transparent shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                                >
                                    {loading ? 'Chargement...' : "S'abonner maintenant"}
                                </button>
                            </div>
                            {error && <div className="mt-4 text-center text-red-600">{error}</div>}
                        </form>
                    )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm />
        </Elements>
    );
}
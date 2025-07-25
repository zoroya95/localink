"use client"

import React, { useActionState } from 'react'
import { Loader2 } from "lucide-react"
import Link from 'next/link'
import { AnimatedTestimonialsDemo } from '@/app/[locale]/(landing)/sections/AnimatedTestimonialsDemo'

const initialState = {
    message: '',
    field: undefined as string | undefined,
}

type SignInState = {
    message: string | undefined;
    field?: string;
};

type SignInProps = {
    action: (prevState: any, formData: FormData) => Promise<SignInState>
}

const SignIn = ({ action }: SignInProps) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [state, formAction, isPending] = useActionState(action, initialState);
    return (
        <div className="min-h-screen h-screen w-screen bg-gray-50 flex items-center justify-center">
            <div className="w-full h-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 bg-white shadow-2xl rounded-2xl overflow-hidden">
                {/* Colonne gauche : d'avis */}
                <div className="flex flex-col justify-center items-center bg-gradient-to-br from-orange-400 to-orange-500 p-0 text-white relative h-full w-full">
                    <div className="flex flex-1 w-full h-full items-center justify-center">
                        <AnimatedTestimonialsDemo />
                    </div>
                </div>

                {/* Colonne droite : formulaire de connexion */}
                <div className="flex flex-col justify-center items-center p-8 h-full w-full">
                    <h2 className="mb-2 text-3xl font-extrabold text-orange-400 text-center">Se connecter</h2>
                    <p className="mb-6 text-center text-base text-gray-600">Découvrez où se classe votre entreprise sur Google et obtenez des conseils pratiques pour vous améliorer.</p>
                    {/* Bouton Google */}
                    <button
                        type="button"
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 mb-4 border border-gray-300 rounded-2xl shadow-sm text-base font-medium bg-white cursor-pointer text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:text-orange-500 transition-colors duration-200"
                        style={{ height: '48px' }}
                        onClick={() => window.location.href = '/auth/google'}
                    >
                        {/* Remplacer par <Image src="/google/googlee.svg" ... /> si disponible */}
                        <svg width="20" height="20" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.73 1.22 9.24 3.22l6.91-6.91C36.16 2.34 30.4 0 24 0 14.98 0 6.73 5.06 2.69 12.44l8.51 6.62C13.13 13.13 18.18 9.5 24 9.5z" /><path fill="#34A853" d="M46.1 24.5c0-1.54-.14-3.03-.39-4.47H24v8.47h12.44c-.54 2.77-2.18 5.12-4.64 6.7l7.19 5.59C43.98 36.16 46.1 30.77 46.1 24.5z" /><path fill="#FBBC05" d="M11.2 28.06c-1.01-2.77-1.01-5.77 0-8.54l-8.51-6.62C.98 16.77 0 20.26 0 24c0 3.74.98 7.23 2.69 10.1l8.51-6.04z" /><path fill="#EA4335" d="M24 48c6.4 0 12.16-2.11 16.55-5.77l-7.19-5.59c-2.01 1.35-4.59 2.13-7.36 2.13-5.82 0-10.87-3.63-13.13-8.56l-8.51 6.04C6.73 42.94 14.98 48 24 48z" /></g></svg>
                        Se connecter avec Google
                    </button>
                    <div className="flex items-center w-full my-4">
                        <div className="flex-1 h-px bg-gray-300" />
                        <span className="px-3 text-sm text-gray-500 bg-white font-medium">ou continuez avec</span>
                        <div className="flex-1 h-px bg-gray-300" />
                    </div>

                    <form action={formAction} className="space-y-6 w-full max-w-md">
                        <div>
                            <div className="mt-1 relative">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-base"
                                    placeholder="Entrer votre email"
                                />
                            </div>
                            {/* Affichage de l'erreur email */}
                            {state?.field === 'email' && state?.message && (
                                <p className="mb-2 text-sm text-red-600">{state.message}</p>
                            )}
                        </div>
                        <div>
                            <div className="mt-1 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-base pr-10"
                                    placeholder="Entrer votre mot de passe"
                                />
                                <button
                                    type="button"
                                    tabIndex={-1}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500"
                                    onClick={() => setShowPassword(v => !v)}
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M9.88 9.88A3 3 0 0012 15a3 3 0 002.12-5.12M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12C3.5 7.5 7.5 4.5 12 4.5c4.5 0 8.5 3 9.75 7.5-.5 1.5-1.5 3-3 4.5M3 3l18 18" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12C3.5 7.5 7.5 4.5 12 4.5c4.5 0 8.5 3 9.75 7.5-1.25 4.5-5.25 7.5-9.75 7.5-4.5 0-8.5-3-9.75-7.5z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {/* Affichage de l'erreur mot de passe */}
                            {state?.field === 'password' && state?.message && (
                                <p className="mb-2 text-sm text-red-600">{state.message}</p>
                            )}
                        </div>
                        <div className="flex items-center justify-end">
                            <div className="text-sm">
                                <Link href="/auth/forgot-password" className="font-medium text-orange-600 hover:text-orange-500">Mot de passe oublié ?</Link>
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full flex justify-center py-2 px-4 border cursor-pointer border-transparent rounded-md shadow-sm text-base font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                                        Connexion en cours...
                                    </>
                                ) : "Se connecter"}
                            </button>
                        </div>
                    </form>
                    {/* Affichage des erreurs générales au-dessus du formulaire */}
                    {state?.message && !state?.field && (
                        <p className="mb-4 text-center text-sm text-red-600">{state.message}</p>
                    )}
                    <p className="mt-4 text-xs text-gray-500 text-center">
                        En vous connectant, vous acceptez nos{' '}
                        <Link href="/terms" className="text-orange-600 hover:underline">conditions d'utilisation</Link>{' '}et{' '}
                        <Link href="/privacy" className="text-orange-600 hover:underline">politique de confidentialité</Link>.
                    </p>
                    <div className="mt-8 w-full">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Nouveau ?</span>
                            </div>
                        </div>
                        <div className="mt-6">
                            <p className="text-sm text-gray-600 text-center">
                                Pas encore de compte ?{' '}
                                <Link
                                    href="/auth/sign-up"
                                    className="text-orange-600 cursor-pointer hover:underline hover:text-orange-700"
                                >
                                    Créer un compte
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignIn
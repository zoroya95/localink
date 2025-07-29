"use client"

import React, { useActionState } from 'react'
import { Loader2 } from "lucide-react"
import Link from 'next/link'
import { AnimatedTestimonialsDemo } from '@/app/[locale]/(landing)/sections/AnimatedTestimonialsDemo'
import { useI18n } from '@/locales/client'

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
    const t = useI18n();

    return (
        <div className="min-h-screen h-screen w-screen bg-gray-50 flex items-center justify-center">
            <div className="w-full h-full  mx-auto grid grid-cols-1 md:grid-cols-2 bg-white  overflow-hidden">
                {/* Colonne gauche : d'avis */}
                <div className="flex flex-col justify-center items-center bg-gradient-to-br from-blue-500 to-blue-500 p-0 text-white relative h-full w-full">
                    <div className="flex flex-1 w-full h-full items-center justify-center">
                        <AnimatedTestimonialsDemo />
                    </div>
                </div>

                {/* Colonne droite : formulaire de connexion */}
                <div className="flex flex-col justify-center items-center p-8 h-full w-full">
                    <h2 className="mb-2 text-3xl font-extrabold text-blue-500 text-center">{t("landing.signin.title")}</h2>
                    <p className="mb-6 text-center text-base text-gray-600">{t("landing.signin.subtitle")}</p>
                    

                    <form action={formAction} className="space-y-6 w-full max-w-md">
                        <div>
                            <div className="mt-1 relative">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                                    placeholder={t("landing.signin.input_mail")}
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
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base pr-10"
                                    placeholder={t("landing.signin.input_password")}
                                />
                                <button
                                    type="button"
                                    tabIndex={-1}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500"
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
                                <Link href="/auth/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">{t("landing.signin.forget_password")}</Link>
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full flex justify-center py-2 px-4 border cursor-pointer border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                                        Connexion en cours...
                                    </>

                                ) : `${t("landing.signin.sign_in")}`}
                            </button>
                        </div>
                    </form>
                    {/* Affichage des erreurs générales au-dessus du formulaire */}
                    {state?.message && !state?.field && (
                        <p className="mb-4 text-center text-sm text-red-600">{state.message}</p>
                    )}
                    <p className="mt-4 text-xs text-gray-500 text-center">
                        {t("landing.signin.info.title_1")}{' '}
                        <Link href="/terms" className="text-blue-600 hover:underline">{t("landing.signin.info.condi_utilisation")}</Link>{' '}{t("landing.signin.info.title_2")}{' '}
                        <Link href="/privacy" className="text-blue-600 hover:underline">{t("landing.signin.info.politic_confidential")}</Link>.
                    </p>
                    <div className="mt-8 w-full">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">{t("landing.signin.new")}</span>
                            </div>
                        </div>
                        <div className="mt-6">
                            <p className="text-sm text-gray-600 text-center">
                                {t("landing.signin.not_have_account")}{' '}
                                <Link
                                    href="/auth/sign-up"
                                    className="text-blue-600 cursor-pointer hover:underline hover:text-blue-700"
                                >
                                    {t("landing.signin.not_have_account_signup")}
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
"use client"

import React, { useActionState } from 'react'
import { Loader2 } from "lucide-react"
import Link from 'next/link'
import Image from 'next/image'
import { AnimatedTestimonialsDemo } from '@/app/[locale]/(landing)/sections/AnimatedTestimonialsDemo'
import { useI18n } from '@/locales/client'

const initialState = {
    message: '',
}

type SignUpProps = {
    action: (prevState: any, formData: FormData) => Promise<{ message: string | undefined }>
}

const SignUp = ({ action }: SignUpProps) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirm, setShowConfirm] = React.useState(false);
    const [state, formAction, isPending] = useActionState(action, initialState);
    const t = useI18n();

    return (
        <div className="min-h-screen h-screen w-screen bg-gray-50 flex items-center justify-center">
            <div className="w-full h-full  mx-auto grid grid-cols-1 md:grid-cols-2 bg-white overflow-hidden">
                {/* Colonne gauche : d'avis */}
                <div className="flex flex-col justify-center items-center bg-gradient-to-br from-blue-500 to-blue-500 p-0 text-white relative h-full w-full">
                    <div className="flex flex-1 w-full h-full items-center justify-center">
                        <AnimatedTestimonialsDemo />
                    </div>
                </div>
                {/* Colonne droite : formulaire d'inscription */}
                <div className="flex flex-col justify-center items-center p-8 h-full w-full">
                    <h2 className="mb-2 text-3xl font-extrabold text-blue-500 text-center">{t("landing.signup.title")}</h2>
                    <p className="mb-6 text-center text-base text-gray-600">{t("landing.signup.subtitle")}</p>
                    
                    <form action={formAction} className="space-y-6 w-full max-w-md">
                        {/* Message d'erreur général */}
                        {state?.message && !state.message.toLowerCase().includes('email') && !state.message.toLowerCase().includes('password') && (
                            <p className="mb-2 text-center text-sm text-red-600">{state.message}</p>
                        )}
                        <div>
                            {/* Erreur email */}
                            {state?.message && state.message.toLowerCase().includes('email') && (
                                <p className="mb-1 text-sm text-red-600">{state.message}</p>
                            )}
                            <div className="mt-1 relative">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-blue-500 sm:text-base"
                                    placeholder={t("landing.signup.input_mail")}
                                />
                            </div>
                        </div>
                        <div>
                            {/* Erreur mot de passe */}
                            {state?.message && state.message.toLowerCase().includes('password') && (
                                <p className="mb-1 text-sm text-red-600">{state.message}</p>
                            )}
                            <div className="mt-1 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    required
                                    minLength={8}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base pr-10"
                                    placeholder={t("landing.signup.input_password")}
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
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full flex justify-center py-2 px-4 border cursor-pointer border-transparent rounded-2xl shadow-sm text-base font-medium text-white bg-blue-500 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                                        Inscription en cours...
                                    </>
                                ) : `${t("landing.signup.sign_up")}`}
                            </button>
                        </div>
                        <p className="mt-4 text-xs text-gray-500 text-center">
                            {t("landing.signup.info.title_1")}{' '}
                            <Link href="/terms" className="text-blue-500 hover:underline">{t("landing.signup.info.condi_utilisation")}</Link>{' '}{t("landing.signup.info.title_2")}{' '}
                            <Link href="/privacy" className="text-blue-500 hover:underline">{t("landing.signup.info.politic_confidential")}</Link>.
                        </p>
                    </form>
                    <div className="mt-8 w-full">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">{t("landing.signup.i_signup")}</span>
                            </div>
                        </div>
                        <div className="mt-6">
                            <p className="text-sm text-gray-600 text-center">
                                {t("landing.signup.you_have_account")}{' '}
                                <Link
                                    href="/auth/sign-in"
                                    className="text-blue-500 cursor-pointer hover:underline hover:text-blue-500"
                                >
                                    {t("landing.signup.you_have_account_signin")}
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default SignUp
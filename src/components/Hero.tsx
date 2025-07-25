"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import LocalVisibilityRanking from "./LocalVisibilityRanking"

const Hero = () => {
    return (
        <section className="relative flex items-center min-h-[80vh] bg-gradient-to-b from-blue-50 to-white">
            <div className="container mx-auto px-4 py-12 flex flex- items-center justify-center">
                <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center space-y-8">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                        <span className="text-blue-500 drop-shadow">LocalAdd</span>
                        <span className="text-gray-900"> : Votre allié pour dominer la visibilité locale</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        Gérez tous vos canaux digitaux (Google, réseaux sociaux, annuaires...) en un seul clic.<br />
                        <strong>Multipliez votre visibilité</strong>, convertissez plus de clients et contrôlez votre réputation en ligne grâce à l'automatisation intelligente.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                        <Button size="lg" asChild className="bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:from-orange-500 hover:to-orange-700 transition-all border-0 text-lg">
                            <Link href="/demo">
                                Essai gratuit 14 jours
                            </Link>
                        </Button>
                        <Button variant="outline" size="lg" asChild className="border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-600 font-semibold px-8 py-4 rounded-xl text-lg">
                            <Link href="#fonctionnalites">
                                Voir la démo
                            </Link>
                        </Button>
                    </div>

                </div>

                <div className="w-full max-w-md mx-auto mt-8">
                    <LocalVisibilityRanking />
                </div>
            </div>
        </section>
    )
}

export default Hero
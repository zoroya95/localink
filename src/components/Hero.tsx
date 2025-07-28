"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
    return (
        <section className="relative flex items-center min-h-[70vh] bg-gradient-to-b from-blue-50 to-white">
            <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center">
                <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center space-y-8">
                    
                    {/* Titre principal percutant */}
                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                            Boostez votre visibilité locale
                        </span><br />
                        avec la puissance des cartes Google
                    </h1>

                    {/* Sous-titre explicatif */}
                    <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
                        Notre solution génère automatiquement des fichiers KML optimisés pour créer 
                        <span className="font-semibold text-blue-600"> des milliers de positions, routes et polylines</span> 
                        qui améliorent radicalement votre présence sur Google My Maps.
                    </p>

                    {/* CTA avec statistiques impressionnantes */}
                    <div className="flex flex-col sm:flex-row gap-6 w-full justify-center items-center">
                        <Button size="lg" asChild className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-lg">
                            <Link href="/demo">
                                Essai gratuit 14 jours →
                            </Link>
                        </Button>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <div className="flex -space-x-2">
                                {[1,2,3].map((item) => (
                                    <div key={item} className="h-8 w-8 rounded-full bg-blue-100 border-2 border-white"></div>
                                ))}
                            </div>
                            <span>+500 entreprises nous font déjà confiance</span>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default Hero;
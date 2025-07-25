"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function PartnersSection() {
    const [count, setCount] = useState(0);
    const targetCount = 5000;

    // Animation du compteur
    useEffect(() => {
        const duration = 2500; // 2.5 secondes
        const increment = targetCount / (duration / 16);
        const timer = setInterval(() => {
            setCount((prev) => {
                const newCount = Math.min(prev + increment, targetCount);
                if (newCount >= targetCount) clearInterval(timer);
                return Math.floor(newCount);
            });
        }, 16);
        return () => clearInterval(timer);
    }, []);

    // Logos des partenaires
    const partners = [
        { id: 1, logo: "/entreprise/bilo.png", alt: "Entreprise 1" },
        { id: 2, logo: "/entreprise/claudia.png", alt: "Entreprise 2" },
        { id: 3, logo: "/entreprise/pocfly.png", alt: "Entreprise 3" },
        { id: 4, logo: "/entreprise/savoie.png", alt: "Entreprise 4" },
        { id: 5, logo: "/entreprise/claudia.png", alt: "Entreprise 5" },
        { id: 6, logo: "/entreprise/pocfly.png", alt: "Entreprise 6" },
    ];

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold text-blue-500 mb-6">
                    Nos partenaires satisfaits
                </h2>
                <div className="text-5xl font-bold  mb-8">
                    Plus de{" "}
                    <span className="count text-blue-600">
                        {count.toLocaleString()}
                    </span>{" "}
                    points de vente satisfaits
                </div>
                {/* Grille de logos */}
                <div className="flex flex-wrap justify-center gap-16 mt-12">
                    {partners.map((partner) => (
                        <div
                            key={partner.id}
                            className="w-32 h-32 relative    flex items-center justify-center hover:scale-105 hover:border-blue-500 transition-all group"
                        >
                            <Image
                                src={partner.logo}
                                alt={partner.alt}
                                fill
                                className="object-contain grayscale group-hover:grayscale-0 group-hover:drop-shadow-lg transition-all duration-300"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, MapPin, Route, Layers, Eye, Users, BarChart } from "lucide-react";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import LocaleSelectLanguage from "@/app/[locale]/LocaleSelectLanguage";
import Image from "next/image";
import Features from "./Features";
import { useI18n } from "@/locales/client";

const navLinks = [
    {
        name: "Fonctionnalités",
        href: "#fonctionnalites",
        items: [
            { 
                title: "Génération KML", 
                href: "#kml", 
                description: "Créez des fichiers KML optimisés pour Google My Maps",
                icon: <Layers className="w-5 h-5 mr-2 text-blue-500" />
            },
            { 
                title: "Visibilité en ligne", 
                href: "#visibilite", 
                description: "Analysez et améliorez votre présence cartographique",
                icon: <Eye className="w-5 h-5 mr-2 text-blue-500" />
            },
            { 
                title: "Positions & Routes", 
                href: "#positions", 
                description: "Gérez vos points géographiques et itinéraires",
                icon: <MapPin className="w-5 h-5 mr-2 text-blue-500" />
            },
            { 
                title: "Gestion Clients", 
                href: "#clients", 
                description: "Suivi complet de votre portefeuille clients",
                icon: <Users className="w-5 h-5 mr-2 text-blue-500" />
            },
            { 
                title: "Analytics", 
                href: "#analytics", 
                description: "Statistiques détaillées sur votre visibilité",
                icon: <BarChart className="w-5 h-5 mr-2 text-blue-500" />
            },
            { 
                title: "Polylignes", 
                href: "#polylignes", 
                description: "Créez des tracés complexes pour une couverture réaliste",
                icon: <Route className="w-5 h-5 mr-2 text-blue-500" />
            }
        ]
    },
    {
        name: "Tarifs",
        href: "/pricing",
    },
];

const Header = () => {
    const [open, setOpen] = useState(false);
    const t = useI18n();

    return (
        <header className="w-full border-b bg-background/80 backdrop-blur sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto flex items-center justify-between py-2 px-4 md:px-10">
                
                   <Link 
                            href="/" 
                            className="flex items-center "
                            aria-label="Localink - Retour à l'accueil"
                        >
                            <Image
                                src="/logo/localink.png"
                                alt="Logo Localink"
                                width={140}  // augmente à ta guise : 120, 160, etc.
                                height={140}
                                className="object-contain drop-shadow-md"
                                priority
                            />
                        </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6">
                    <Features />
                            
                    <Link href="/pricing">
                
                        {t("landing.header.features.price")}
                        
                    </Link>
                </nav>
                {/* Actions */}
                <div className="hidden md:flex items-center gap-2 lg:gap-3">
                    <div className="relative">
                        <LocaleSelectLanguage />
                    </div>
                    <Link href="/auth/sign-in">
                        <Button variant="outline" size="sm" className="border-blue-500 text-blue-500 cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition-colors font-semibold px-5 py-2 rounded-lg shadow-none">{t("landing.header.signin")}</Button>
                    </Link>
                    <Link href="/auth/sign-in">
                        <Button size="sm" className="bg-gradient-to-r cursor-pointer from-blue-400 to-blue-600 text-white font-bold px-5 py-2 rounded-lg shadow-md hover:from-blue-500 hover:to-blue-700 transition-all border-0">{t("landing.header.cta")}</Button>
                    </Link>
                </div>

                {/* Mobile menu button */}
                <button
                    className="md:hidden p-2 rounded-lg hover:bg-blue-50 focus:outline-none border border-blue-100"
                    onClick={() => setOpen((v) => !v)}
                    aria-label="Ouvrir le menu"
                >
                    <Menu className="size-7 text-blue-500" />
                </button>
            </div>

            {/* Mobile Nav */}
            {open && (
                <div className="md:hidden bg-background border-t px-4 pb-4 animate-in fade-in slide-in-from-top-4 shadow-lg rounded-b-xl">
                    <nav className="flex flex-col gap-2 mt-2">
                        {navLinks.map((link) => (
                            <div key={link.name}>
                                <Link
                                    href={link.href}
                                    className="text-lg font-semibold text-muted-foreground hover:text-blue-500 transition-colors py-2 block rounded-lg px-2"
                                    onClick={() => setOpen(false)}
                                >
                                    {link.name}
                                </Link>
                                {link.items && (
                                    <div className="ml-4 mt-1 flex flex-col gap-1">
                                        {link.items.map((item) => (
                                            <Link
                                                key={item.title}
                                                href={item.href}
                                                className="flex items-center text-base font-medium text-muted-foreground/80 hover:text-blue-500 transition-colors py-2 rounded px-2"
                                                onClick={() => setOpen(false)}
                                            >
                                                {item.icon}
                                                <div>
                                                    <div className="font-semibold">{item.title}</div>
                                                    <div className="text-sm text-gray-500">{item.description}</div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>
                    <div className="flex flex-col gap-2 mt-4">
                        <Link href="/auth/sign-in" onClick={() => setOpen(false)}>
                            <Button variant="outline" className="w-full border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-600 font-semibold rounded-lg">Se connecter</Button>
                        </Link>
                        <Link href="/auth/sign-in" onClick={() => setOpen(false)}>
                            <Button className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold rounded-lg hover:from-blue-500 hover:to-blue-700 border-0">Essai gratuit</Button>
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
};

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a"> & { icon?: React.ReactNode }
>(({ className, title, children, icon, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className="flex items-start space-x-3 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-50 focus:bg-blue-50"
                    {...props}
                >
                    <div className="flex-shrink-0">
                        {icon}
                    </div>
                    <div>
                        <div className="text-sm font-medium leading-none text-gray-900">{title}</div>
                        <p className="mt-1 text-sm leading-snug text-gray-600">
                            {children}
                        </p>
                    </div>
                </a>
            </NavigationMenuLink>
        </li>
    );
});
ListItem.displayName = "ListItem";

export default Header;
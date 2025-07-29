import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Logo et description */}
                    <div className="col-span-2">
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
                        <p className="mt-4 text-sm text-gray-500">
                            La solution tout-en-un pour connecter les commerces locaux avec leurs clients.
                        </p>
                        <div className="mt-6 flex space-x-6">
                            {['Youtube', 'LinkedIn', 'Instagram'].map((item) => (
                                <a 
                                    key={item} 
                                    href="#" 
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <span className="sr-only">{item}</span>
                                    {item}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                            Navigation
                        </h3>
                        <ul className="mt-4 space-y-4">
                            {['Tarifs', 'Témoignages', 'Nouveautés'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Entreprise */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                            Entreprise
                        </h3>
                        <ul className="mt-4 space-y-4">
                            {['À propos', 'Partenaires TPE/PME', 'Partenaires Enseignes'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bas de footer */}
                <div className="mt-12 border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-400 hover:text-gray-500 text-sm">
                            Mentions légales
                        </a>
                        <a href="#" className="text-gray-400 hover:text-gray-500 text-sm">
                            Confidentialité
                        </a>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <p className="text-gray-500 text-sm">
                            &copy; {new Date().getFullYear()} Localink. Tous droits réservés.
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <select className="bg-transparent text-gray-500 text-sm border-0 focus:ring-0">
                            {['Français', 'English', 'Italiano', 'Español', 'Português'].map((lang) => (
                                <option key={lang} value={lang}>{lang}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
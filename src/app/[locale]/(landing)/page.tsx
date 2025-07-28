"use client";

import Hero from "@/components/Hero";
import PartnersSection from "./sections/PartnersSection";
import { AnimatedTestimonialsDemo } from "./sections/AnimatedTestimonialsDemo";
import PresentationYoutube from "@/components/layout/PresentationYoutube";
import CallToAction from "@/components/layout/CallToAction";
import {
  FaMapMarkerAlt,
  FaUsers,
  FaStar,
  FaChartLine,
  FaShieldAlt,
  FaRegSmile,
} from "react-icons/fa";

const AdvantagesSection = () => {
  const advantages = [
    {
      icon: <FaMapMarkerAlt className="h-10 w-10 text-blue-500 mb-4" />,
      title: "Visibilité locale optimisée",
      desc: "Améliorez votre présence sur les cartes et moteurs de recherche grâce à des liens courts et ciblés.",
    },
    {
      icon: <FaChartLine className="h-10 w-10 text-blue-500 mb-4" />,
      title: "Suivi en temps réel",
      desc: "Analysez les clics, les zones de partage et l'engagement local via des statistiques simples et précises.",
    },
    {
      icon: <FaUsers className="h-10 w-10 text-blue-500 mb-4" />,
      title: "Partage simplifié",
      desc: "Générez et diffusez des liens locaux adaptés à chaque public, en quelques clics.",
    },
    {
      icon: <FaStar className="h-10 w-10 text-blue-500 mb-4" />,
      title: "Réputation renforcée",
      desc: "Valorisez les retours de vos clients et boostez votre image de marque locale.",
    },
    {
      icon: <FaShieldAlt className="h-10 w-10 text-blue-500 mb-4" />,
      title: "Sécurité & confidentialité",
      desc: "Vos données sont protégées selon les normes les plus strictes, pour une tranquillité totale.",
    },
    {
      icon: <FaRegSmile className="h-10 w-10 text-blue-500 mb-4" />,
      title: "Support réactif & humain",
      desc: "Bénéficiez d'une assistance experte, à l'écoute de vos besoins locaux.",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          Pourquoi choisir <span className="text-blue-500">Localink</span> ?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {advantages.map((adv, idx) => (
            <div
              key={idx}
              className="bg-blue-50 rounded-xl p-8 shadow flex flex-col items-center hover:scale-[1.03] transition-transform duration-200"
            >
              {adv.icon}
              <h3 className="font-semibold text-lg mb-2 text-center">{adv.title}</h3>
              <p className="text-gray-600 text-center text-base">{adv.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <AdvantagesSection />
      <PartnersSection />
      <AnimatedTestimonialsDemo />
      <PresentationYoutube />
      <CallToAction />
    </div>
  );
}
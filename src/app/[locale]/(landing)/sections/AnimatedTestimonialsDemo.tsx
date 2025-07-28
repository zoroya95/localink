"use client";

import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { FaMapMarkerAlt, FaRoute, FaLayerGroup, FaGoogle } from "react-icons/fa";

export function AnimatedTestimonialsDemo() {
  const testimonials = [
    {
      quote:
        "En 3 mois, notre visibilité sur Google Maps a explosé grâce aux 15 000 points stratégiques générés par Localink. Notre trafic local a augmenté de 220%.",
      name: "Marc Dubois",
      designation: "Directeur de chaîne hôtelière",
      src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      stats: [
        { icon: <FaGoogle className="text-blue-500" />, value: "+220% trafic" },
        { icon: <FaMapMarkerAlt className="text-blue-500" />, value: "15k points" }
      ]
    },
    {
      quote:
        "Le système de routes virtuelles a donné une crédibilité incroyable à notre réseau de distribution. Nos partenaires sont impressionnés par notre couverture géographique.",
      name: "Sophie Lambert",
      designation: "Responsable logistique",
      src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      stats: [
        { icon: <FaRoute className="text-blue-500" />, value: "45 routes générées" },
        { icon: <FaLayerGroup className="text-blue-500" />, value: "3 couches KML" }
      ]
    },
    {
      quote:
        "Avant Localink, nos 12 agences étaient invisibles sur Maps. Maintenant, nous dominons les recherches locales avec un maillage territorial parfait.",
      name: "Thomas Leroy",
      designation: "Directeur d'agences immobilières",
      src: "https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      stats: [
        { icon: <FaMapMarkerAlt className="text-blue-500" />, value: "12 agences visibles" },
        { icon: <FaGoogle className="text-blue-500" />, value: "Top 3 recherches" }
      ]
    },
    {
      quote:
        "La génération automatique de polylignes a transformé notre petite entreprise en acteur régional crédible en 6 semaines seulement.",
      name: "Amélie Chen",
      designation: "Fondatrice de Chen Logistics",
      src: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      stats: [
        { icon: <FaRoute className="text-blue-500" />, value: "28 polylignes" },
        { icon: <FaGoogle className="text-blue-500" />, value: "+180% leads" }
      ]
    },
    {
      quote:
        "Notre KML personnalisé avec 8 000 points de vente virtuels nous a permis de décrocher un contrat majeur avec un distributeur national.",
      name: "David Moreau",
      designation: "PDG de Moreau Distribution",
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      stats: [
        { icon: <FaMapMarkerAlt className="text-blue-500" />, value: "8k points" },
        { icon: <FaLayerGroup className="text-blue-500" />, value: "5 couches stratégiques" }
      ]
    }
  ];

  return <AnimatedTestimonials testimonials={testimonials} />;
}
"use client"

import Hero from "@/components/Hero";
import React from "react";
import PartnersSection from "./sections/PartnersSection";
import { AnimatedTestimonialsDemo } from "./sections/AnimatedTestimonialsDemo";
import PresentationYoutube from "@/components/layout/PresentationYoutube";
import CallToAction from "@/components/layout/CallToAction";


const AdvantagesSection = () => (
  <section className="py-16 bg-white">
    <div className="max-w-5xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-center text-blue-500 mb-8">Pourquoi choisir LocalAdd ?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-blue-50 rounded-xl p-6 shadow flex flex-col items-center">
          <svg width="40" height="40" fill="none" viewBox="0 0 24 24" className="mb-4 text-blue-500"><circle cx="12" cy="12" r="10" fill="currentColor" /></svg>
          <h3 className="font-semibold text-lg mb-2">Visibilité locale</h3>
          <p className="text-gray-600 text-center">Augmentez votre présence sur Google et touchez plus de clients dans votre zone.</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-6 shadow flex flex-col items-center">
          <svg width="40" height="40" fill="none" viewBox="0 0 24 24" className="mb-4 text-blue-500"><rect x="4" y="4" width="16" height="16" fill="currentColor" /></svg>
          <h3 className="font-semibold text-lg mb-2">Gestion simplifiée</h3>
          <p className="text-gray-600 text-center">Centralisez vos informations et gérez vos avis clients facilement.</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-6 shadow flex flex-col items-center">
          <svg width="40" height="40" fill="none" viewBox="0 0 24 24" className="mb-4 text-blue-500"><polygon points="12,2 22,22 2,22" fill="currentColor" /></svg>
          <h3 className="font-semibold text-lg mb-2">Support expert</h3>
          <p className="text-gray-600 text-center">Notre équipe vous accompagne pour maximiser vos résultats.</p>
        </div>
      </div>
    </div>
  </section>
);


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
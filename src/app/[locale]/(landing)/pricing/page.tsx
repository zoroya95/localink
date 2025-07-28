"use client"

import { Check, Zap, MapPin, Search, Globe, BarChart2, BadgeCheck, Rocket, Shield, Infinity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import FAQSection from '@/components/layout/FAQSection'
import HighlightText from '@/components/layout/HighlightText'

export default function PricingPage() {
  const plans = [
    {
      name: "Gratuit",
      price: "0$",
      period: "/mois",
      description: "Pour tester et découvrir la puissance de l’outil.",
      cta: "S’enregistrer",
      popular: false,
      features: [
        "3 Clients sauvegardés",
        "200 points maximum par carte",
        "3 itinéraires maximum par carte"
      ]
    },
    {
      name: "Professionnel",
      price: "39.99$",
      period: "/mois",
      description: "Idéal pour les indépendants et les petites entreprises.",
      cta: "Choisissez le plan Pro",
      popular: true,
      features: [
        "50 clients sauvegardés",
        "2 500 Nombre maximum de points par carte",
        "20 itinéraires maximum par carte",
        "Assistance par e-mail"
      ]
    },
    {
      name: "Premium",
      price: "99.99$",
      period: "/mois",
      description: "Pour les agences et les gros utilisateurs.",
      cta: "Passez au Premium",
      popular: false,
      features: [
        "Clients Unlimited",
        "Points illimités",
        "50 itinéraires maximum par carte",
        "Assistance prioritaire"
      ]
    }
  ]

  const features = [
    {
      icon: <MapPin className="w-5 h-5 text-blue-500" />,
      title: "Visibilité multi-plateformes",
      description: "Synchronisation sur 50+ annuaires et apps locales"
    },
    {
      icon: <Search className="w-5 h-5 text-blue-500" />,
      title: "SEO local optimisé",
      description: "Améliorez votre classement dans les recherches 'près de moi'"
    },
    {
      icon: <Zap className="w-5 h-5  text-blue-500" />,
      title: "Gestion centralisée",
      description: "Contrôlez toutes vos fiches depuis un seul dashboard"
    },
    {
      icon: <Globe className="w-5 h-5 text-blue-500" />,
      title: "Mises à jour automatiques",
      description: "Modifications propagées instantanément partout"
    },
    {
      icon: <BarChart2 className="w-5 h-5 text-blue-500" />,
      title: "Analytics complets",
      description: "Suivez vos performances et votre réputation"
    },
    {
      icon: <Shield className="w-5 h-5 text-blue-500" />,
      title: "Gestion des avis",
      description: "Centralisez et répondez à tous vos avis clients"
    }
  ]

  return (
    <main className="py-16 px-4 sm:px-6 lg:px-8" aria-label="Tarification">
      <div className="max-w-7xl mx-auto">
        {/* Hero section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Une tarification simple et adaptée à  <HighlightText variant={"fancy-slant"} color='blue'>votre croissance</HighlightText>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
           Choisissez le plan qui correspond à vos ambitions.
          </p>
        </div>

        {/* Pricing plans */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative rounded-2xl shadow-lg overflow-hidden border ${
                plan.popular 
                  ? "border-blue-500 ring-2 ring-blue-200" 
                  : "border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-sm font-bold transform translate-x-2 -translate-y-2 rotate-6">
                  RECOMMANDÉ
                </div>
              )}
              
              <div className="p-8 bg-white">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h2>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <div className="flex items-baseline mb-6">
                  <span className="text-5xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="ml-1 text-lg text-gray-500">
                    {plan.period}
                  </span>
                </div>
                
                <Button 
                  className={`w-full py-6 text-lg cursor-pointer ${
                    plan.popular 
                      ? "bg-blue-500 hover:bg-blue-600 text-white" 
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  {plan.cta}
                </Button>
              </div>

              <div className="border-t border-gray-200 bg-gray-50 p-8">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                  Ce qui est inclus
                </h3>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Feature comparison */}
        <div className="mt-24 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Fonctionnalités incluses
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Nos solutions</h3>
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    {feature.icon}
                    <span className="ml-3">
                      <strong className="text-gray-900">{feature.title}</strong>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="md:col-span-1 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Découverte</h3>
              <ul className="space-y-4">
                {features.map((_, index) => (
                  <li key={index} className="h-12 flex items-center justify-center">
                    {index < 4 ? <Check className="text-green-500" /> : <span className="text-gray-400">—</span>}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="md:col-span-1 text-center bg-blue-50 rounded-lg pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Pro</h3>
              <ul className="space-y-4">
                {features.map((_, index) => (
                  <li key={index} className="h-12 flex items-center justify-center">
                    <Check className="text-green-500" />
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="md:col-span-1 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Enterprise</h3>
              <ul className="space-y-4">
                {features.map((_, index) => (
                  <li key={index} className="h-12 flex items-center justify-center">
                    <BadgeCheck className="text-blue-500" />
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="md:col-span-1 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Premium</h3>
              <ul className="space-y-4">
                {features.map((_, index) => (
                  <li key={index} className="h-12 flex items-center justify-center">
                    <Rocket className="text-purple-500" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <FAQSection />
      </div>
    </main>
  )
}
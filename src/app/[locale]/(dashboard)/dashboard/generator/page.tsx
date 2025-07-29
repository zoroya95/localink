"use client";

import { useState, FormEvent, useEffect } from "react";
import { useSearchParams, useRouter } from 'next/navigation';

export default function KMLGeneratorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Utilisez un seul état formData pour tous les champs
  const [formData, setFormData] = useState({
    nomEntreprise: '',
    urlEntreprise: '',
    urlMyBusiness: '',
    telEntreprise: '',
    motsCles: '',
    adresseDepart: '',
    nombrePoints: 100,
    nombreCercles: 5,
    nombreItineraires: 10
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGuideModal, setShowGuideModal] = useState(false);

  // Effet pour le pré-remplissage
  useEffect(() => {
    const loadClientData = () => {
      // 1. Vérifiez d'abord sessionStorage
      const savedData = sessionStorage.getItem('currentClientData');
      if (savedData) {
        try {
          const clientData = JSON.parse(savedData);
          setFormData(prev => ({
            ...prev,
            nomEntreprise: clientData.nomEntreprise || '',
            urlEntreprise: clientData.urlEntreprise || '',
            urlMyBusiness: clientData.urlMyBusiness || '',
            telEntreprise: clientData.telEntreprise || '',
            motsCles: clientData.motsCles || '',
            adresseDepart: clientData.adresseDepart || ''
          }));
          sessionStorage.removeItem('currentClientData');
        } catch (err) {
          console.error("Erreur de parsing des données client:", err);
        }
      }
    };

    loadClientData();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-kml", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), // Utilisez formData ici
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Une erreur est survenue lors de la génération.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      const contentDisposition = response.headers.get("content-disposition");
      let fileName = "carte-seo.kml";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+?)"/);
        if (match) fileName = match[1];
      }
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour gérer les changements de tous les champs
  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      {/* Header Branding */}
      <header className="w-full py-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-blue-600 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3m15.364-6.364a9 9 0 11-12.728 0" />
            </svg>
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            KML Generator Pro
          </h1>
          <p className="text-base md:text-lg text-gray-600 font-medium max-w-md text-center">
            Générez des fichiers KML optimisés pour booster votre SEO local en quelques clics
          </p>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 px-4 pb-12">
        {/* Info button */}
        <button
          onClick={() => setShowGuideModal(true)}
          className="md:hidden fixed bottom-6 right-6 z-10 w-14 h-14 rounded-full bg-blue-600 shadow-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        {/* Main Card */}
        <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white text-center">
            <div className="flex items-center justify-between">
              <div className="flex-1 text-left">
                <button
                  onClick={() => setShowGuideModal(true)}
                  className="hidden md:flex items-center gap-1 text-sm hover:underline"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Voir le guide
                </button>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">Générateur KML Premium</h2>
                <p className="text-sm opacity-90">Remplissez le formulaire pour créer votre fichier</p>
              </div>
              <div className="flex-1"></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
            {/* Section Entreprise */}
            <section className="space-y-6">
              <h2 className="flex items-center text-xl font-bold text-gray-800 mb-2 gap-3">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </span>
                <span>Informations de l'entreprise</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Tous les champs utilisent maintenant formData et handleChange */}
                <div className="space-y-1">
                  <label htmlFor="nom_entreprise" className="block text-sm font-medium text-gray-700">
                    Nom de l'entreprise *
                  </label>
                  <input
                    type="text"
                    id="nom_entreprise"
                    value={formData.nomEntreprise}
                    onChange={(e) => handleChange('nomEntreprise', e.target.value)}
                    placeholder="Ex: Plomberie Dupont"
                    className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-4 py-2.5 transition-all"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="url_entreprise" className="block text-sm font-medium text-gray-700">
                    Site web *
                  </label>
                  <input
                    type="url"
                    id="url_entreprise"
                    value={formData.urlEntreprise}
                    onChange={(e) => handleChange('urlEntreprise', e.target.value)}
                    placeholder="Ex: https://www.plomberie-dupont.fr"
                    className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-4 py-2.5 transition-all"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="url_mybusiness" className="block text-sm font-medium text-gray-700">
                    URL Google MyBusiness *
                  </label>
                  <input
                    type="url"
                    id="url_mybusiness"
                    value={formData.urlMyBusiness}
                    onChange={(e) => handleChange('urlMyBusiness', e.target.value)}
                    placeholder="Ex: https://g.co/jfjf/bjedbbd"
                    className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-4 py-2.5 transition-all"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="tel_entreprise" className="block text-sm font-medium text-gray-700">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    id="tel_entreprise"
                    value={formData.telEntreprise}
                    onChange={(e) => handleChange('telEntreprise', e.target.value)}
                    placeholder="Ex: 01 23 45 67 89"
                    className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-4 py-2.5 transition-all"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="adresse_depart" className="block text-sm font-medium text-gray-700">
                    Adresse de référence *
                  </label>
                  <input
                    type="text"
                    id="adresse_depart"
                    value={formData.adresseDepart}
                    onChange={(e) => handleChange('adresseDepart', e.target.value)}
                    placeholder="Ex: 10 Rue de Paris, 75001 Paris"
                    className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-4 py-2.5 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="mots_cles" className="block text-sm font-medium text-gray-700">
                  Mots-clés SEO * <span className="text-xs text-gray-500">(séparés par des point-virgules)</span>
                </label>
                <textarea
                  id="mots_cles"
                  rows={3}
                  value={formData.motsCles}
                  onChange={(e) => handleChange('motsCles', e.target.value)}
                  placeholder="Ex: plombier paris; dépannage plomberie; chauffagiste 75"
                  className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-4 py-2.5 transition-all"
                  required
                />
              </div>
            </section>

            {/* Section Paramètres */}
            <section className="space-y-6">
              <h2 className="flex items-center text-xl font-bold text-gray-800 mb-2 gap-3">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <span>Paramètres avancés</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-1">
                  <label htmlFor="nombre_points" className="block text-sm font-medium text-gray-700">
                    Points de localisation
                  </label>
                  <input
                    type="number"
                    id="nombre_points"
                    value={formData.nombrePoints}
                    onChange={(e) => handleChange('nombrePoints', Number(e.target.value))}
                    min="1"
                    max="500"
                    className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-4 py-2.5 transition-all"
                    required
                  />
                  <p className="text-xs text-gray-500">Entre 1 et 500 points</p>
                </div>

                <div className="space-y-1">
                  <label htmlFor="nombre_cercles" className="block text-sm font-medium text-gray-700">
                    Zones de couverture
                  </label>
                  <input
                    type="number"
                    id="nombre_cercles"
                    value={formData.nombreCercles}
                    onChange={(e) => handleChange('nombreCercles', Number(e.target.value))}
                    min="1"
                    max="20"
                    className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-4 py-2.5 transition-all"
                    required
                  />
                  <p className="text-xs text-gray-500">Entre 1 et 20 cercles</p>
                </div>

                <div className="space-y-1">
                  <label htmlFor="nombre_itineraires" className="block text-sm font-medium text-gray-700">
                    Itinéraires
                  </label>
                  <input
                    type="number"
                    id="nombre_itineraires"
                    value={formData.nombreItineraires}
                    onChange={(e) => handleChange('nombreItineraires', Number(e.target.value))}
                    min="0"
                    max="50"
                    className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-4 py-2.5 transition-all"
                    required
                  />
                  <p className="text-xs text-gray-500">Entre 0 et 50 itinéraires</p>
                </div>
              </div>
            </section>

            {/* Submit et messages */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3.5 px-6 rounded-xl shadow-lg text-white font-semibold text-lg tracking-wide focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all
                ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-blue-300"
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Génération en cours...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Générer mon fichier KML
                  </span>
                )}
              </button>

              {isLoading && (
                <div className="w-full mt-3">
                  <div className="relative h-1.5 rounded-full bg-gray-200 overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full animate-pulse w-2/3"></div>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm w-full text-center border border-red-200 flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Guide Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={() => setShowGuideModal(false)}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            {/* Modal container */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Guide d'utilisation
                      </h3>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        onClick={() => setShowGuideModal(false)}
                      >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="mt-2">
                      <ul className="space-y-4 text-gray-600 text-sm">
                        <li className="flex items-start gap-3">
                          <span className="mt-1 inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex-shrink-0">1</span>
                          <span>Renseignez les informations de votre entreprise (nom, site web, téléphone et adresse de référence). Ces informations seront utilisées dans le fichier KML généré.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="mt-1 inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex-shrink-0">2</span>
                          <span>Ajoutez vos mots-clés SEO principaux, séparés par des point-virgules. Ces mots-clés seront utilisés pour optimiser les balises dans le fichier KML.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="mt-1 inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex-shrink-0">3</span>
                          <span>Configurez les paramètres de génération : nombre de points de localisation, zones de couverture (cercles) et itinéraires à générer.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="mt-1 inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex-shrink-0">4</span>
                          <span>Cliquez sur "Générer mon fichier KML" pour créer et télécharger votre fichier. Vous pourrez ensuite l'importer dans Google My Business et Google Maps.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowGuideModal(false)}
                >
                  J'ai compris
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}















{/** 

import { useState, FormEvent } from "react";

export default function KMLGeneratorPage() {
  const [nomEntreprise, setNomEntreprise] = useState(""); 
  const [urlEntreprise, setUrlEntreprise] = useState("");
  const [telEntreprise, setTelEntreprise] = useState("");
  const [motsCles, setMotsCles] = useState("");
  const [adresseDepart, setAdresseDepart] = useState("");
  const [nombrePoints, setNombrePoints] = useState(100);
  const [nombreCercles, setNombreCercles] = useState(5);
  const [nombreItineraires, setNombreItineraires] = useState(10);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-kml", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomEntreprise,
          urlEntreprise,
          telEntreprise,
          motsCles,
          adresseDepart,
          nombrePoints,
          nombreCercles,
          nombreItineraires,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Une erreur est survenue lors de la génération.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      const contentDisposition = response.headers.get("content-disposition");
      let fileName = "carte-seo.kml";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+?)"/);
        if (match) fileName = match[1];
      }
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br  flex flex-col">
      {/* Header Branding 
      <header className="w-full py-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <span className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-blue-500 shadow-lg">
            {/* Heroicon Globe Alt 
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3m15.364-6.364a9 9 0 11-12.728 0" />
            </svg>
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">KML Generator SaaS</h1>
          <p className="text-base md:text-lg text-gray-500 font-medium">Créez des fichiers KML pour Google Maps, boostez votre SEO local.</p>
        </div>
      </header>
      {/* Main layout 
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8">
        {/* Sidebar Guide (visible on desktop, collapsible on mobile) 
        <aside className="hidden md:flex flex-col bg-white/60 backdrop-blur-lg shadow-xl rounded-2xl p-6 h-fit w-72 mr-2">
          <h2 className="text-lg font-bold text-indigo-700 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 17l4 4 4-4m-4-5v9" />
            </svg>
            Guide utilisateur
          </h2>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li>Remplissez les informations de votre entreprise.</li>
            <li>Sélectionnez les paramètres de génération.</li>
            <li>Cliquez sur <span className="font-bold text-indigo-600">Télécharger le Fichier KML</span>.</li>
            <li>Utilisez le fichier pour Google Maps ou SEO local.</li>
          </ul>
          <div className="mt-6 text-xs text-gray-400">
            Besoin d’aide ? <a href="#" className="underline hover:text-indigo-500">Contactez le support</a>
          </div>
        </aside>
        {/* Main Card 
        <div className="w-full max-w-xl mx-auto bg-white/80 rounded-2xl shadow-2xl backdrop-blur-lg border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section Entreprise 
            <section>
              <h2 className="flex items-center text-xl md:text-2xl font-bold text-blue-700 mb-6 gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700">
                  {/* Heroicon Office Building 
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 21V7a2 2 0 012-2h14a2 2 0 012 2v14" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 21v-6h6v6" />
                  </svg>
                </span>
                Informations entreprise
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="nom_entreprise" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de l'entreprise
                  </label>
                  <input
                    type="text"
                    id="nom_entreprise"
                    value={nomEntreprise}
                    onChange={(e) => setNomEntreprise(e.target.value)}
                    placeholder="Mon Entreprise"
                    className="block w-full rounded-lg border  border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 p-2 transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="url_entreprise" className="block text-sm font-medium text-gray-700 mb-1">
                    URL du site web
                  </label>
                  <input
                    type="url"
                    id="url_entreprise"
                    value={urlEntreprise}
                    onChange={(e) => setUrlEntreprise(e.target.value)}
                    placeholder="https://mon-site.com"
                    className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 p-2 transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="tel_entreprise" className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="tel_entreprise"
                    value={telEntreprise}
                    onChange={(e) => setTelEntreprise(e.target.value)}
                    placeholder="0123456789"
                    className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 p-2 transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="adresse_depart" className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse de départ
                  </label>
                  <input
                    type="text"
                    id="adresse_depart"
                    value={adresseDepart}
                    onChange={(e) => setAdresseDepart(e.target.value)}
                    placeholder="Tour Eiffel, Paris, France"
                    className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 p-2 transition-all"
                    required
                  />
                </div>
              </div>
              <div className="mt-6">
                <label htmlFor="mots_cles" className="block text-sm font-medium text-gray-700 mb-1">
                  Mots-clés SEO <span className="text-xs text-gray-400">(séparés par un point-virgule)</span>
                </label>
                <textarea
                  id="mots_cles"
                  rows={3}
                  value={motsCles}
                  onChange={(e) => setMotsCles(e.target.value)}
                  placeholder="Plombier;Chauffagiste;Dépannage"
                  className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 p-2 transition-all"
                  required
                />
              </div>
            </section>
            {/* Section Paramètres 
            <section>
              <h2 className="flex items-center text-xl md:text-2xl font-bold text-indigo-700 mb-6 gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700">
                  {/* Heroicon Cog 
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </span>
                Paramètres de génération
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="nombre_points" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de points
                  </label>
                  <input
                    type="number"
                    id="nombre_points"
                    value={nombrePoints}
                    onChange={(e) => setNombrePoints(Number(e.target.value))}
                    min="1"
                    max="500"
                    placeholder="100"
                    className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 p-2 transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="nombre_cercles" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de cercles
                  </label>
                  <input
                    type="number"
                    id="nombre_cercles"
                    value={nombreCercles}
                    onChange={(e) => setNombreCercles(Number(e.target.value))}
                    min="1"
                    max="20"
                    placeholder="5"
                    className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 p-2 transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="nombre_itineraires" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre d'itinéraires
                  </label>
                  <input
                    type="number"
                    id="nombre_itineraires"
                    value={nombreItineraires}
                    onChange={(e) => setNombreItineraires(Number(e.target.value))}
                    min="0"
                    max="50"
                    placeholder="10"
                    className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 p-2 transition-all"
                    required
                  />
                </div>
              </div>
            </section>
            {/* Submit 
            <div className="flex flex-col items-center">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full md:w-1/2 py-3 px-4 rounded-xl shadow-lg text-white font-semibold text-lg tracking-wide focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 transition-all
                ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Génération en cours...
                  </span>
                ) : (
                  "Télécharger le Fichier KML"
                )}
              </button>
              {/* Progress bar 
              {isLoading && (
                <div className="w-full md:w-1/2 mt-2">
                  <div className="relative h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div className="absolute top-0 left-0 h-2 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full animate-pulse w-2/3"></div>
                  </div>
                </div>
              )}
              {/* Error 
              {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm w-full text-center border border-red-100 shadow-sm">
                  {error}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
      {/* Footer 
      <footer className="w-full text-center py-4 text-gray-400 text-xs mt-8">
        © {new Date().getFullYear()} KML Generator SaaS — par Franck Tchassi
      </footer>
    </main>
  );
}   */}
"use client";

import { useState, FormEvent } from "react";

export default function KMLGeneratorPage() {
  const [nomEntreprise, setNomEntreprise] = useState("Mon Entreprise");
  const [urlEntreprise, setUrlEntreprise] = useState("https://example.com");
  const [telEntreprise, setTelEntreprise] = useState("0123456789");
  const [motsCles, setMotsCles] = useState("Plombier;Chauffagiste;Dépannage");
  const [adresseDepart, setAdresseDepart] = useState("Tour Eiffel, Paris, France");
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
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-100 to-indigo-200 flex flex-col">
      {/* Header Branding */}
      <header className="w-full py-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <span className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-blue-500 shadow-lg">
            {/* Heroicon Globe Alt */}
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3m15.364-6.364a9 9 0 11-12.728 0" />
            </svg>
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">KML Generator SaaS</h1>
          <p className="text-base md:text-lg text-gray-500 font-medium">Créez des fichiers KML pour Google Maps, boostez votre SEO local.</p>
        </div>
      </header>
      {/* Main layout */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8">
        {/* Sidebar Guide (visible on desktop, collapsible on mobile) */}
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
        {/* Main Card */}
        <div className="w-full max-w-xl mx-auto bg-white/80 rounded-2xl shadow-2xl backdrop-blur-lg border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section Entreprise */}
            <section>
              <h2 className="flex items-center text-xl md:text-2xl font-bold text-blue-700 mb-6 gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700">
                  {/* Heroicon Office Building */}
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
                    className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 p-2 transition-all"
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
            {/* Section Paramètres */}
            <section>
              <h2 className="flex items-center text-xl md:text-2xl font-bold text-indigo-700 mb-6 gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700">
                  {/* Heroicon Cog */}
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
            {/* Submit */}
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
              {/* Progress bar */}
              {isLoading && (
                <div className="w-full md:w-1/2 mt-2">
                  <div className="relative h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div className="absolute top-0 left-0 h-2 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full animate-pulse w-2/3"></div>
                  </div>
                </div>
              )}
              {/* Error */}
              {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm w-full text-center border border-red-100 shadow-sm">
                  {error}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
      {/* Footer */}
      <footer className="w-full text-center py-4 text-gray-400 text-xs mt-8">
        © {new Date().getFullYear()} KML Generator SaaS — par Franck Tchassi
      </footer>
    </main>
  );
}
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';

type Client = {
  id: number;
  nomEntreprise: string;
  adresseDepart: string;
  urlEntreprise: string;
  telEntreprise: string;
  motsCles: string;
  createdAt: Date;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchClients = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/clients');
      
      if (!response.ok) {
        throw new Error(response.status === 401 
          ? 'Authentification requise' 
          : 'Erreur lors du chargement des clients');
      }
      
      const data = await response.json();
      setClients(data.map((client: Client) => ({
  ...client,
  createdAt: new Date(client.createdAt)
})));
      
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleLoadClient = async (client: Client) => {
  try {
    // Solution optimale : Stockage temporaire + ID dans l'URL
    sessionStorage.setItem('currentClientData', JSON.stringify(client));
    router.push(`/dashboard/generator?clientId=${client.id}&prefill=true`);
  } catch (error) {
    console.error('Erreur:', error);
    toast.error('Erreur lors du chargement du client');
  }
};

  const handleDeleteClient = async (clientId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce client définitivement ?")) {
      return;
    }

    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(response.status === 404 
          ? 'Client introuvable' 
          : 'Échec de la suppression');
      }

      setClients(prev => prev.filter(c => c.id !== clientId));
      toast.success('Client supprimé avec succès');
      
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      toast.error(message);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Mes Clients</h1>
          <Link
            href="/dashboard/generator"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors w-full sm:w-auto text-center"
          >
            + Nouveau KML
          </Link>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            {clients.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {clients.map((client) => (
                  <li key={client.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {client.nomEntreprise}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {client.adresseDepart}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          Créé le {formatDate(client.createdAt)}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                        <button
                          onClick={() => handleLoadClient(client)}
                          className="px-3 py-1.5 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                          aria-label={`Utiliser ${client.nomEntreprise}`}
                        >
                          Utiliser
                        </button>
                        <button
                          onClick={() => handleDeleteClient(client.id)}
                          className="px-3 py-1.5 text-sm font-medium bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                          aria-label={`Supprimer ${client.nomEntreprise}`}
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun client</h3>
                <p className="mt-1 text-gray-500">
                  Commencez par créer votre premier fichier KML.
                </p>
                <div className="mt-6">
                  <Link
                    href="/dashboard/generator"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                  >
                    + Créer un KML
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
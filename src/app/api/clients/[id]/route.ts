import { NextResponse, NextRequest } from 'next/server'; // Importez NextRequest si vous l'utilisez
import { prisma } from '@/db/prisma';
import { validateSessionToken } from '@/actions/auth';
import { parse } from 'cookie';

// Définissez une interface pour les paramètres de la route
// Cela rend le typage du deuxième argument plus clair et réutilisable.
interface RouteContext {
  params: {
    id: string; // 'id' correspond au nom de votre dossier dynamique [id]
  };
}

export async function GET(
  request: NextRequest, // Il est recommandé d'utiliser NextRequest si vous accédez aux cookies, headers, etc.
  context: RouteContext // Utilisez l'interface définie pour typer explicitement le contexte
) {
  try {
    // Authentification
    const cookies = parse(request.headers.get('cookie') || '');
    const token = cookies.session;

    if (!token) {
      return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
    }

    const sessionResult = await validateSessionToken(token);
    if (!sessionResult.user?.id) {
      return NextResponse.json({ error: "Session invalide" }, { status: 401 });
    }

    const { id } = context.params; // Accédez aux paramètres via l'objet context

    // Validation de l'ID
    if (!id) { // Le check `if (!params?.id)` devient `if (!id)`
      return NextResponse.json({ error: "ID client manquant" }, { status: 400 });
    }

    const clientId = Number(id); // Utilisez 'id' directement
    if (isNaN(clientId)) {
      return NextResponse.json({ error: "ID client invalide" }, { status: 400 });
    }

    // Récupération du client
    const client = await prisma.client.findUnique({
      where: {
        id: clientId,
        userId: sessionResult.user.id
      },
      select: {
        id: true,
        nomEntreprise: true,
        urlEntreprise: true,
        telEntreprise: true,
        motsCles: true,
        adresseDepart: true,
        urlMyBusiness: true,
        createdAt: true
      }
    });

    if (!client) {
      return NextResponse.json({ error: "Client non trouvé" }, { status: 404 });
    }

    return NextResponse.json(client);

  } catch (error) {
    console.error('Erreur GET /api/clients/[id]:', error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
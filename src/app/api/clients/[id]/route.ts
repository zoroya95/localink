import { NextResponse } from 'next/server';
import { prisma } from '@/db/prisma';
import { validateSessionToken } from '@/actions/auth';
import cookie from 'cookie';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Authentification
    const cookies = cookie.parse(request.headers.get('cookie') || '');
    const token = cookies.session;

    if (!token) {
      return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
    }

    const sessionResult = await validateSessionToken(token);
    if (!sessionResult.user?.id) {
      return NextResponse.json({ error: "Session invalide" }, { status: 401 });
    }

    // Validation de l'ID
    if (!params?.id) {
      return NextResponse.json({ error: "ID client manquant" }, { status: 400 });
    }

    const clientId = Number(params.id);
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
"use server";

import { prisma } from "../db/prisma";
import { generateSessionToken, createSession, setSessionTokenCookie } from "./auth";

interface GoogleUserData {
  googleId: string;
  name: string;
  email?: string;
}

export async function getUserFromGoogleId(googleId: string) {
  return await prisma.user.findUnique({
    where: { googleId }
  });
}

export async function createGoogleUser(userData: GoogleUserData) {
  if (!userData.email) {
    throw new Error("Email requis pour les utilisateurs Google");
  }

  return await prisma.user.create({
    data: {
      googleId: userData.googleId,
      name: userData.name,
      email: userData.email,
      passwordHash: "", // Champ obligatoire mais vide
      role: "USER" // Champ obligatoire dans votre schéma
    }
  });
}

export async function handleGoogleAuth(googleId: string, name: string, email?: string) {
  try {
    // 1. Vérifier si l'utilisateur existe
    let user = await getUserFromGoogleId(googleId);

    // 2. Créer l'utilisateur si nécessaire
    if (!user) {
      if (!email) throw new Error("Email requis pour la création");
      
      user = await createGoogleUser({
        googleId,
        name,
        email
      });
    }

    // 3. Créer une session
    const sessionToken = await generateSessionToken();
    const session = await createSession(sessionToken, user.id);
    await setSessionTokenCookie(sessionToken, session.expiresAt);

    return user;
  } catch (error) {
    console.error("Erreur dans handleGoogleAuth:", error);
    throw error;
  }
}
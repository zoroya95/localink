import { google } from "../../../../../actions/oauth";
import { setSessionTokenCookie, createSession, generateSessionToken } from "../../../../../actions/auth";
import { handleGoogleAuth } from "../../../../../actions/auth-google";
import { cookies } from "next/headers";
import { decodeIdToken } from "arctic";
import type { OAuth2Tokens } from "arctic";

interface GoogleClaims {
  sub: string;
  name?: string;
  email?: string;
  picture?: string;
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  // Correction: Ajoutez await devant cookies()
  const cookieStore = await cookies();
  const storedState = cookieStore.get("google_oauth_state")?.value;
  const codeVerifier = cookieStore.get("google_code_verifier")?.value;

  // Validation basique
  if (!code || !state || !storedState || !codeVerifier || state !== storedState) {
    return new Response(null, { status: 400 });
  }

  try {
    // 1. Échanger le code contre un token
    const tokens = await google.validateAuthorizationCode(code, codeVerifier);
    
    // 2. Décoder le token ID
    const claims = decodeIdToken(tokens.idToken()) as GoogleClaims;
    
    // 3. Gérer l'authentification
    await handleGoogleAuth(
      claims.sub,
      claims.name || "Utilisateur Google",
      claims.email
    );

    // 4. Redirection après connexion réussie
    return new Response(null, {
      status: 302,
      headers: { Location: "/" }
    });

  } catch (error) {
    console.error("Erreur d'authentification Google:", error);
    return new Response(null, { 
      status: 302, 
      headers: { Location: "/login?error=google_auth_failed" }
    });
  }
}
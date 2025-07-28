"use server";

import { prisma } from "../db/prisma";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";

import type { User, Session } from "../../generated/prisma";

import { cookies } from "next/headers";
import { cache } from "react";


// Password reset
import { randomBytes } from "crypto";

export const requestPasswordReset = async (email: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return { success: false, error: "Utilisateur introuvable" };
    }
    // Générer un token unique
    const token = encodeHexLowerCase(randomBytes(32));
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1h
    await prisma.passwordReset.create({
        data: {
            token,
            userId: user.id,
            expiresAt,
        }
    });
    // Ici, envoyer le token par email à l'utilisateur (à implémenter côté front/service email)
    return { success: true, token };
};

export const verifyPasswordResetToken = async (token: string) => {
    const reset = await prisma.passwordReset.findUnique({ where: { token } });
    if (!reset || reset.used || reset.expiresAt < new Date()) {
        return { valid: false };
    }
    return { valid: true, userId: reset.userId };
};

export const resetPassword = async (token: string, newPassword: string) => {
    const reset = await prisma.passwordReset.findUnique({ where: { token } });
    if (!reset || reset.used || reset.expiresAt < new Date()) {
        return { success: false, error: "Token invalide ou expiré" };
    }
    const passwordHash = await hashPassword(newPassword);
    await prisma.user.update({
        where: { id: reset.userId },
        data: { passwordHash }
    });
    await prisma.passwordReset.update({
        where: { token },
        data: { used: true }
    });
    return { success: true };
};



export async function generateSessionToken(): Promise<string> {
    const bytes = new Uint8Array(20);
    crypto.getRandomValues(bytes);
    const token = encodeBase32LowerCaseNoPadding(bytes);
    return token;
}

export async function createSession(token: string, userId: number | null = null): Promise<Session> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const session: Session = {
        id: sessionId,
        userId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    };
    await prisma.session.create({
        data: session
    });
    return session;
}


export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const result = await prisma.session.findUnique({
        where: { id: sessionId },
        include: { user: true }
    });

    // Cas où la session n'existe pas
    if (!result) {
        return { session: null, user: null };
    }

    const { user, ...session } = result;

    // Vérification d'expiration
    if (Date.now() >= session.expiresAt.getTime()) {
        await prisma.session.delete({ where: { id: sessionId } });
        return { session: null, user: null };
    }

    // Prolongation de session si nécessaire
    if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
        const newExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
        await prisma.session.update({
            where: { id: session.id },
            data: { expiresAt: newExpiresAt }
        });
        session.expiresAt = newExpiresAt;
    }

    // Gestion du cas où user est null
    if (!user) {
        await prisma.session.delete({ where: { id: sessionId } });
        return { session: null, user: null };
    }

    const safeUser = {
        ...user,
        passwordHash: undefined
    };

    return { session, user: safeUser };
}

export async function invalidateSession(sessionId: string): Promise<void> {
    await prisma.session.delete({ where: { id: sessionId } });
}

export async function invalidateAllSessions(userId: number): Promise<void> {
    await prisma.session.deleteMany({
        where: {
            userId: userId
        }
    });
}

export type SessionValidationResult =
    | { session: Session; user: Omit<User, "passwordHash"> }
    | { session: Session; user: null }
    | { session: null; user: null };



//cookie
export async function setSessionTokenCookie(token: string, expiresAt: Date): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set("session", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        expires: expiresAt,
        path: "/"
    });
}

export async function deleteSessionTokenCookie(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set("session", "", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 0,
        path: "/"
    });
}


export const getCurrentSession = cache(async (): Promise<SessionValidationResult> => {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value ?? null;
    if (token === null) {
        return { session: null, user: null };
    }
    const result = await validateSessionToken(token);
    return result;
});



// User register, login, logout
export const hashPassword = async (password: string) => {
    return encodeHexLowerCase(sha256(new TextEncoder().encode(password)));
}

export const verifyPassword = async (password: string, hash: string) => {
    const passwordHash = await hashPassword(password);
    return passwordHash === hash;
}

export const registerUser = async (email: string, password: string, storeName?: string) => {
    const passwordHash = await hashPassword(password);
    try {
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                // storeName si vous souhaitez le gérer
            }
        });

        const safeUser = {
            ...user,
            passwordHash: undefined,
        }

        return {
            user: safeUser,
            error: null
        }
    } catch (e) {
        return {
            user: null,
            error: "Failled to register User"
        }
    }
}

export const loginUser = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({
        where: {
            email: email,
        }
    });

    if (!user) {
        return {
            user: null,
            error: "User not found",
        }
    }

    const passwordValid = await verifyPassword(password, user.passwordHash);
    if (!passwordValid) {
        return {
            user: null,
            error: "Invalid password",
        }
    }

    const token = await generateSessionToken();
    const session = await createSession(token, user.id);

    await setSessionTokenCookie(token, session.expiresAt);

    const safeUser = {
        ...user,
        passwordHash: undefined,
    }

    return {
        user: safeUser,
        error: null
    }
}

export const logoutUser = async () => {
    const session = await getCurrentSession();
    if (session.session?.id) {
        await invalidateSession(session.session.id)
    }
    await deleteSessionTokenCookie();
}
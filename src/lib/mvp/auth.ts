"use client";

/**
 * Autenticação simulada dos MVPs (Módulo 5).
 * Em produção, substituir por OIDC/Keycloak (ver docs/API.md).
 */

export interface DemoUser {
  name: string;
  email: string;
  role: string;
  organization: string;
}

const STORAGE_KEY = "gwdc-session";

export const DEMO_CREDENTIALS = {
  email: "demo@gwdc.gw",
  password: "demo1234",
};

const DEMO_USER: DemoUser = {
  name: "Fatumata Correia",
  email: DEMO_CREDENTIALS.email,
  role: "Diretora de Operações",
  organization: "GW Digital Company",
};

/** Autentica com credenciais de demonstração (aceita qualquer usuário com senha válida). */
export function signIn(email: string, password: string): DemoUser {
  if (!email.includes("@") || password.length < 6) {
    throw new Error("Credenciais inválidas. Use demo@gwdc.gw / demo1234");
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_USER));
  return DEMO_USER;
}

/** Encerra a sessão local. */
export function signOut(): void {
  window.localStorage.removeItem(STORAGE_KEY);
}

/** Retorna o usuário da sessão atual ou null. */
export function getSession(): DemoUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DemoUser) : null;
  } catch {
    return null;
  }
}

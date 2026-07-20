"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSessionToken, getSessionCookieName, isValidPassword } from "@/lib/session";

export type LoginState = {
  error?: string;
};

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const password = formData.get("password");

  if (typeof password !== "string" || password.length === 0) {
    return { error: "Ingresa una contraseña." };
  }

  if (!isValidPassword(password)) {
    return { error: "Contraseña incorrecta." };
  }

  const cookieStore = await cookies();
  cookieStore.set(getSessionCookieName(), createSessionToken(), {
    httpOnly: true,
    // Solo se marca como "Secure" si el sitio corre bajo HTTPS (variable
    // COOKIE_SECURE=true en el entorno). Mientras el sitio esté en HTTP
    // (ej. el subdominio *.sslip.io sin certificado propio), el navegador
    // descarta silenciosamente cualquier cookie "Secure", lo que hacía
    // que la sesión de admin nunca se guardara y el login pareciera un
    // bucle infinito.
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/admin");
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(getSessionCookieName());
  redirect("/admin/login");
}

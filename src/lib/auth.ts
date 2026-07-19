import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionCookieName, isValidSessionToken } from "@/lib/session";

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;
  return isValidSessionToken(token);
}

export async function requireAdmin(): Promise<void> {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    redirect("/admin/login");
  }
}

import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "admin_session";
const SESSION_VALUE = "authenticated";

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET no está configurado");
  }
  return secret;
}

export function getSessionCookieName(): string {
  return COOKIE_NAME;
}

export function createSessionToken(): string {
  return createHmac("sha256", getSecret()).update(SESSION_VALUE).digest("hex");
}

export function isValidSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const expected = createSessionToken();
  const tokenBuffer = Buffer.from(token);
  const expectedBuffer = Buffer.from(expected);
  if (tokenBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(tokenBuffer, expectedBuffer);
}

export function isValidPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error("ADMIN_PASSWORD no está configurado");
  }
  const passwordBuffer = Buffer.from(password);
  const adminBuffer = Buffer.from(adminPassword);
  if (passwordBuffer.length !== adminBuffer.length) return false;
  return timingSafeEqual(passwordBuffer, adminBuffer);
}

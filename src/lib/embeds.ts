/**
 * Detección y validación de enlaces de redes/video que se pueden insertar
 * como "embed" dentro del cuerpo de una noticia. Solo guardamos el
 * proveedor + la URL original (nunca HTML/script pegado por el usuario),
 * y el HTML real del embed se genera siempre desde código de confianza
 * (ver RichContent.tsx), nunca desde texto guardado en la base de datos.
 */

export type EmbedProvider = "youtube" | "twitter" | "instagram" | "tiktok" | "facebook";

const PROVIDER_HOSTNAMES: Record<EmbedProvider, string[]> = {
  youtube: ["youtube.com", "www.youtube.com", "youtu.be", "m.youtube.com"],
  twitter: ["twitter.com", "www.twitter.com", "x.com", "www.x.com"],
  instagram: ["instagram.com", "www.instagram.com"],
  tiktok: ["tiktok.com", "www.tiktok.com"],
  facebook: ["facebook.com", "www.facebook.com", "fb.watch", "m.facebook.com"],
};

export function detectEmbedProvider(rawUrl: string): EmbedProvider | null {
  let hostname: string;
  try {
    hostname = new URL(rawUrl.trim()).hostname.toLowerCase();
  } catch {
    return null;
  }

  for (const provider of Object.keys(PROVIDER_HOSTNAMES) as EmbedProvider[]) {
    if (PROVIDER_HOSTNAMES[provider].includes(hostname)) {
      return provider;
    }
  }

  return null;
}

/**
 * Extrae el ID de video de una URL de YouTube en cualquiera de sus formas
 * comunes (watch?v=, youtu.be/, /shorts/, /embed/). Devuelve null si no
 * se reconoce el formato, para no construir un iframe con una URL inválida.
 */
export function extractYouTubeVideoId(rawUrl: string): string | null {
  let url: URL;
  try {
    url = new URL(rawUrl.trim());
  } catch {
    return null;
  }

  if (url.hostname === "youtu.be") {
    const id = url.pathname.slice(1);
    return id || null;
  }

  if (url.pathname.startsWith("/shorts/")) {
    return url.pathname.replace("/shorts/", "").split("/")[0] || null;
  }

  if (url.pathname.startsWith("/embed/")) {
    return url.pathname.replace("/embed/", "").split("/")[0] || null;
  }

  const v = url.searchParams.get("v");
  return v || null;
}

export const EMBED_PROVIDER_LABELS: Record<EmbedProvider, string> = {
  youtube: "YouTube",
  twitter: "X / Twitter",
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook: "Facebook",
};

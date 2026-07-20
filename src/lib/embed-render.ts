import type { EmbedProvider } from "@/lib/embeds";
import { extractYouTubeVideoId } from "@/lib/embeds";

/**
 * Construye el HTML de cada tipo de embed. El HTML nunca viene del
 * contenido guardado por el usuario — solo la URL se guarda ahí; este
 * código (de confianza, no editable desde el admin) es el único que
 * genera el <iframe>/<blockquote> real.
 */
export function buildEmbedMarkup(provider: EmbedProvider, url: string): string {
  switch (provider) {
    case "youtube": {
      const videoId = extractYouTubeVideoId(url);
      if (!videoId) {
        return fallbackLink(url, "Ver video en YouTube");
      }
      return `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:0.375rem;">
        <iframe
          src="https://www.youtube-nocookie.com/embed/${videoId}"
          style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>`;
    }
    case "twitter":
      return `<blockquote class="twitter-tweet"><a href="${url}"></a></blockquote>`;
    case "instagram":
      return `<blockquote class="instagram-media" data-instgrm-permalink="${url}"><a href="${url}">Ver publicación en Instagram</a></blockquote>`;
    case "tiktok": {
      const videoId = url.match(/\/video\/(\d+)/)?.[1];
      return `<blockquote class="tiktok-embed" cite="${url}" ${videoId ? `data-video-id="${videoId}"` : ""}><section><a href="${url}">Ver video en TikTok</a></section></blockquote>`;
    }
    case "facebook":
      return `<div class="fb-post" data-href="${url}">${fallbackLink(url, "Ver publicación en Facebook")}</div>`;
    default:
      return fallbackLink(url, "Ver enlace");
  }
}

function fallbackLink(url: string, label: string): string {
  return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-red-600 underline">${label}</a>`;
}

const EMBED_SCRIPTS: Record<EmbedProvider, string | null> = {
  youtube: null, // no necesita script externo, es solo un iframe
  twitter: "https://platform.twitter.com/widgets.js",
  instagram: "https://www.instagram.com/embed.js",
  tiktok: "https://www.tiktok.com/embed.js",
  facebook: "https://connect.facebook.net/es_LA/sdk.js#xfbml=1&version=v19.0",
};

const loadedScripts = new Set<string>();

/**
 * Carga (una sola vez por página) el script oficial de cada plataforma
 * para que renderice el embed, y llama a su función de "reprocesar" si el
 * script ya estaba cargado de antes (ej. varios tweets en la misma
 * noticia, o al navegar entre noticias sin recargar la página completa).
 */
export function ensureEmbedScript(provider: EmbedProvider): void {
  const src = EMBED_SCRIPTS[provider];
  if (!src) return;

  const win = window as unknown as {
    twttr?: { widgets?: { load?: () => void } };
    instgrm?: { Embeds?: { process?: () => void } };
    FB?: { XFBML?: { parse?: () => void } };
  };

  if (loadedScripts.has(src)) {
    if (provider === "twitter") win.twttr?.widgets?.load?.();
    if (provider === "instagram") win.instgrm?.Embeds?.process?.();
    if (provider === "facebook") win.FB?.XFBML?.parse?.();
    if (provider === "tiktok") reloadTikTokScript(src);
    return;
  }

  loadedScripts.add(src);
  const script = document.createElement("script");
  script.src = src;
  script.async = true;
  document.body.appendChild(script);
}

// TikTok no expone una función pública para reprocesar embeds nuevos, así
// que si su script ya estaba cargado, lo volvemos a insertar para forzar
// que detecte los blockquotes agregados después de la primera carga.
function reloadTikTokScript(src: string): void {
  document.querySelectorAll(`script[src="${src}"]`).forEach((el) => el.remove());
  const script = document.createElement("script");
  script.src = src;
  script.async = true;
  document.body.appendChild(script);
}

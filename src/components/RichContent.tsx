"use client";

import { useEffect, useRef } from "react";
import { buildEmbedMarkup, ensureEmbedScript } from "@/lib/embed-render";
import type { EmbedProvider } from "@/lib/embeds";

const KNOWN_PROVIDERS: EmbedProvider[] = [
  "youtube",
  "twitter",
  "instagram",
  "tiktok",
  "facebook",
];

function isEmbedProvider(value: string | null): value is EmbedProvider {
  return !!value && (KNOWN_PROVIDERS as string[]).includes(value);
}

/**
 * Renderiza el HTML ya sanitizado de una noticia y, después de montar,
 * reemplaza cada marcador de embed (<div data-embed data-embed-url>) por
 * el HTML real de esa plataforma, generado por código propio (nunca por
 * texto guardado en la base de datos) y carga el script oficial de cada
 * proveedor para que el embed se vea completo (no solo el enlace).
 */
export function RichContent({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const embedEls = container.querySelectorAll<HTMLElement>("[data-embed]");
    const providersUsed = new Set<EmbedProvider>();

    embedEls.forEach((el) => {
      const provider = el.getAttribute("data-embed");
      const url = el.getAttribute("data-embed-url");
      if (!isEmbedProvider(provider) || !url) return;

      el.innerHTML = buildEmbedMarkup(provider, url);
      el.className = "my-6";
      providersUsed.add(provider);
    });

    providersUsed.forEach((provider) => ensureEmbedScript(provider));
  }, [html]);

  return (
    <div
      ref={containerRef}
      className="prose prose-lg max-w-none text-gray-800 dark:prose-invert dark:text-gray-200"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

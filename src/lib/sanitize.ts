import DOMPurify from "isomorphic-dompurify";

/**
 * Lista blanca estricta de lo que el editor de noticias puede producir.
 * Cualquier otra etiqueta o atributo (incluido cualquier <script>) se
 * elimina. Los divs de embed solo pueden llevar data-embed/data-embed-url
 * — nunca contienen el HTML real de terceros (eso se genera aparte, ver
 * embed-render.ts, con código de confianza, no con lo guardado en la DB).
 */
const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "h2",
  "h3",
  "ul",
  "ol",
  "li",
  "a",
  "img",
  "div",
];

const ALLOWED_ATTR = ["href", "target", "rel", "src", "alt", "data-embed", "data-embed-url"];

export function sanitizeArticleHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
  });
}

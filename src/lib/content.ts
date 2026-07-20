/**
 * Convierte contenido viejo (texto plano, párrafos separados por línea en
 * blanco, como se guardaba antes del editor enriquecido) a HTML
 * equivalente. Si el contenido ya parece HTML (creado con el editor
 * nuevo), se deja tal cual. Se usa tanto al cargar un artículo viejo en
 * el editor como al mostrarlo en el sitio público.
 */
export function plainTextToHtml(text: string): string {
  if (!text) return "";
  if (/<[a-z][\s\S]*>/i.test(text)) {
    return text;
  }
  return text
    .split(/\n\n+/)
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br>")}</p>`)
    .join("");
}

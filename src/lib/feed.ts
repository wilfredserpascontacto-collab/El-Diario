import { prisma } from "@/lib/prisma";

/**
 * Cuántas noticias crónologicamente contiguas se consumen de la base de
 * datos por cada página del muro. El resultado final puede tener más
 * elementos que esto si se necesita "relleno" para romper una racha de
 * categoría (ver interleaveByCategory).
 */
export const FEED_PAGE_SIZE = 12;

export type FeedCursor = {
  publishedAt: string; // ISO string
  id: number;
};

export type FeedArticleSummary = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string | null;
  publishedAt: Date | null;
  categoryId: number;
  category: { name: string; slug: string };
};

export type FeedPage = {
  items: FeedArticleSummary[];
  nextCursor: FeedCursor | null;
  lastCategoryId: number | null;
};

function cursorWhere(cursor: FeedCursor | null) {
  if (!cursor) return {};

  const publishedAt = new Date(cursor.publishedAt);

  return {
    OR: [
      { publishedAt: { lt: publishedAt } },
      { publishedAt, id: { lt: cursor.id } },
    ],
  };
}

/**
 * Intercala un lote cronológico de noticias para que nunca se repitan dos
 * de la misma categoría seguidas. Si el lote se queda sin alternativas
 * (ej. un día donde solo se publicó de una categoría), toma prestada la
 * noticia más reciente de otra categoría como "relleno" para romper la
 * racha, rotando entre las categorías disponibles para no repetir siempre
 * el mismo relleno.
 */
export function interleaveByCategory(
  batch: FeedArticleSummary[],
  fillerByCategory: FeedArticleSummary[],
  initialLastCategoryId: number | null
): { items: FeedArticleSummary[]; lastCategoryId: number | null } {
  const pool = [...batch];
  const result: FeedArticleSummary[] = [];
  let lastCategoryId = initialLastCategoryId;
  let fillerRotation = 0;

  while (pool.length > 0) {
    let index = pool.findIndex((a) => a.categoryId !== lastCategoryId);

    if (index === -1) {
      // Todo lo que queda en este lote es de la misma categoría que la
      // última noticia mostrada. Buscamos un relleno de otra categoría.
      const fillerCandidates = fillerByCategory.filter(
        (a) => a.categoryId !== lastCategoryId
      );

      if (fillerCandidates.length > 0) {
        const filler = fillerCandidates[fillerRotation % fillerCandidates.length];
        fillerRotation += 1;
        result.push(filler);
        lastCategoryId = filler.categoryId;
        continue;
      }

      // No existe ninguna otra categoría con noticias publicadas nunca
      // (caso extremo, ej. solo existe una categoría con contenido).
      index = 0;
    }

    const [chosen] = pool.splice(index, 1);
    result.push(chosen);
    lastCategoryId = chosen.categoryId;
  }

  return { items: result, lastCategoryId };
}

/**
 * Trae la siguiente página del muro (ya intercalada por categoría).
 * `lastCategoryId` es la categoría de la última noticia mostrada al
 * usuario en la página anterior, para que la regla de "no repetir
 * categoría seguida" también se respete entre cargas del scroll infinito.
 */
export async function getFeedPage(
  cursor: FeedCursor | null,
  lastCategoryId: number | null
): Promise<FeedPage> {
  const batch = await prisma.article.findMany({
    where: { published: true, ...cursorWhere(cursor) },
    orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
    take: FEED_PAGE_SIZE,
    include: { category: true },
  });

  if (batch.length === 0) {
    return { items: [], nextCursor: null, lastCategoryId };
  }

  const fillerByCategory = await prisma.article.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    distinct: ["categoryId"],
    include: { category: true },
  });

  const { items, lastCategoryId: newLastCategoryId } = interleaveByCategory(
    batch,
    fillerByCategory,
    lastCategoryId
  );

  const last = batch[batch.length - 1];
  const nextCursor: FeedCursor | null =
    batch.length < FEED_PAGE_SIZE
      ? null
      : {
          publishedAt: (last.publishedAt ?? last.createdAt).toISOString(),
          id: last.id,
        };

  return { items, nextCursor, lastCategoryId: newLastCategoryId };
}

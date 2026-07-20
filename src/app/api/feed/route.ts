import { NextRequest, NextResponse } from "next/server";
import { getFeedPage, type FeedCursor } from "@/lib/feed";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const cursorPublishedAt = searchParams.get("cursorPublishedAt");
  const cursorId = searchParams.get("cursorId");
  const lastCategoryIdParam = searchParams.get("lastCategoryId");

  const cursor: FeedCursor | null =
    cursorPublishedAt && cursorId
      ? { publishedAt: cursorPublishedAt, id: Number(cursorId) }
      : null;

  const lastCategoryId = lastCategoryIdParam ? Number(lastCategoryIdParam) : null;

  const page = await getFeedPage(cursor, lastCategoryId);

  return NextResponse.json({
    items: page.items.map((article) => ({
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      coverImageUrl: article.coverImageUrl,
      publishedAt: article.publishedAt ? article.publishedAt.toISOString() : null,
      category: {
        name: article.category.name,
        slug: article.category.slug,
      },
    })),
    nextCursor: page.nextCursor,
    lastCategoryId: page.lastCategoryId,
  });
}

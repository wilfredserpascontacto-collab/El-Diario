import { Feed } from "@/components/Feed";
import { getFeedPage } from "@/lib/feed";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const page = await getFeedPage(null, null);

  const items = page.items.map((article) => ({
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    coverImageUrl: article.coverImageUrl,
    publishedAt: article.publishedAt ? article.publishedAt.toISOString() : null,
    category: {
      name: article.category.name,
      slug: article.category.slug,
    },
  }));

  return (
    <Feed
      initialItems={items}
      initialNextCursor={page.nextCursor}
      initialLastCategoryId={page.lastCategoryId}
    />
  );
}

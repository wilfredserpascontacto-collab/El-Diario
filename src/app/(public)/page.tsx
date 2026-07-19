import { ArticleCard } from "@/components/ArticleCard";
import { getFeaturedArticles, getRecentArticles } from "@/lib/articles";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, recent] = await Promise.all([
    getFeaturedArticles(3),
    getRecentArticles(9),
  ]);

  const featuredSlugs = new Set(featured.map((article) => article.slug));
  const recentWithoutFeatured = recent.filter(
    (article) => !featuredSlugs.has(article.slug)
  );

  return (
    <div className="flex flex-col gap-10">
      {featured.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-50">
            Destacadas
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {featured.map((article, index) => (
              <div key={article.slug} className={index === 0 ? "md:col-span-2 md:row-span-2" : ""}>
                <ArticleCard article={article} size={index === 0 ? "large" : "normal"} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-50">
          Últimas noticias
        </h2>
        {recentWithoutFeatured.length === 0 ? (
          <p className="text-gray-500">Todavía no hay más noticias publicadas.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {recentWithoutFeatured.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

import { ArticleCard } from "@/components/ArticleCard";
import { searchArticles } from "@/lib/articles";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = query ? await searchArticles(query) : [];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
        {query ? (
          <>
            Resultados para &ldquo;{query}&rdquo;
          </>
        ) : (
          "Buscar noticias"
        )}
      </h1>

      {!query && (
        <p className="text-gray-500">Escribe una palabra clave para buscar noticias.</p>
      )}

      {query && results.length === 0 && (
        <p className="text-gray-500">No se encontraron noticias que coincidan con tu búsqueda.</p>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {results.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

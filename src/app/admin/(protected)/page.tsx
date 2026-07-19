import Link from "next/link";
import { getAllArticlesForAdmin } from "@/lib/articles";
import { deleteArticle, toggleFeatured, togglePublished } from "./actions";
import { DeleteArticleForm } from "@/components/admin/DeleteArticleForm";

export default async function AdminDashboardPage() {
  const articles = await getAllArticlesForAdmin();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Noticias</h1>
        <Link
          href="/admin/articulos/nuevo"
          className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Nueva noticia
        </Link>
      </div>

      {articles.length === 0 ? (
        <p className="text-gray-500">Todavía no has creado ninguna noticia.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500 dark:border-gray-800 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3">Categoría</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr
                  key={article.id}
                  className="border-b border-gray-100 last:border-0 dark:border-gray-900"
                >
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                    {article.title}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {article.category.name}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-medium ${
                          article.published
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        {article.published ? "Publicada" : "Borrador"}
                      </span>
                      {article.featured && (
                        <span className="rounded bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                          Destacada
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <Link
                        href={`/admin/articulos/${article.id}/editar`}
                        className="font-medium text-red-600 hover:underline"
                      >
                        Editar
                      </Link>
                      <form action={togglePublished}>
                        <input type="hidden" name="id" value={article.id} />
                        <button type="submit" className="text-gray-600 hover:underline dark:text-gray-400">
                          {article.published ? "Despublicar" : "Publicar"}
                        </button>
                      </form>
                      <form action={toggleFeatured}>
                        <input type="hidden" name="id" value={article.id} />
                        <button type="submit" className="text-gray-600 hover:underline dark:text-gray-400">
                          {article.featured ? "Quitar destacado" : "Destacar"}
                        </button>
                      </form>
                      <DeleteArticleForm id={article.id} action={deleteArticle} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

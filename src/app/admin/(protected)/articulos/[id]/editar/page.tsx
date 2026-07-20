import { notFound } from "next/navigation";
import { getAllCategories, getArticleById } from "@/lib/articles";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { updateArticle } from "../../../actions";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const articleId = Number(id);
  const [article, categories] = await Promise.all([
    getArticleById(articleId),
    getAllCategories(),
  ]);

  if (!article) {
    notFound();
  }

  const boundUpdateArticle = updateArticle.bind(null, articleId);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Editar noticia</h1>
      <ArticleForm
        action={boundUpdateArticle}
        categories={categories}
        submitLabel="Guardar cambios"
        initialValues={{
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          content: article.content,
          coverImageUrl: article.coverImageUrl,
          categoryId: article.categoryId,
          published: article.published,
        }}
      />
    </div>
  );
}

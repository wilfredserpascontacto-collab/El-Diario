import { getAllCategories } from "@/lib/articles";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { createArticle } from "../../actions";

export default async function NewArticlePage() {
  const categories = await getAllCategories();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Nueva noticia</h1>
      <ArticleForm action={createArticle} categories={categories} submitLabel="Crear noticia" />
    </div>
  );
}

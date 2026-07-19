import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticleBySlug } from "@/lib/articles";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || !article.published) {
    return { title: "Noticia no encontrada" };
  }

  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || !article.published) {
    notFound();
  }

  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <Link
          href={`/categoria/${article.category.slug}`}
          className="w-fit rounded bg-red-600 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white"
        >
          {article.category.name}
        </Link>
        <h1 className="mt-3 text-3xl font-black leading-tight text-gray-900 dark:text-gray-50 sm:text-4xl">
          {article.title}
        </h1>
        {article.publishedAt && (
          <time className="mt-2 block text-sm text-gray-500">
            {new Intl.DateTimeFormat("es", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(article.publishedAt)}
          </time>
        )}
      </div>

      {article.coverImageUrl && (
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-900">
          <Image
            src={article.coverImageUrl}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 768px, 100vw"
            priority
          />
        </div>
      )}

      <div className="flex flex-col gap-4 text-lg leading-relaxed text-gray-800 dark:text-gray-200">
        {article.content.split("\n\n").map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}

import Image from "next/image";
import Link from "next/link";

type ArticleCardProps = {
  article: {
    slug: string;
    title: string;
    excerpt: string;
    coverImageUrl: string | null;
    publishedAt: Date | null;
    category: { name: string; slug: string };
  };
  size?: "large" | "normal";
};

export function ArticleCard({ article, size = "normal" }: ArticleCardProps) {
  const isLarge = size === "large";

  return (
    <Link
      href={`/noticia/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition hover:shadow-md dark:border-gray-800 dark:bg-gray-950"
    >
      <div
        className={`relative w-full overflow-hidden bg-gray-100 dark:bg-gray-900 ${
          isLarge ? "aspect-[16/9]" : "aspect-[4/3]"
        }`}
      >
        {article.coverImageUrl ? (
          <Image
            src={article.coverImageUrl}
            alt={article.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes={isLarge ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
            Sin imagen
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="w-fit rounded bg-red-600 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
          {article.category.name}
        </span>
        <h3
          className={`font-bold leading-snug text-gray-900 group-hover:underline dark:text-gray-50 ${
            isLarge ? "text-2xl" : "text-lg"
          }`}
        >
          {article.title}
        </h3>
        <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
          {article.excerpt}
        </p>
        {article.publishedAt && (
          <time className="mt-auto pt-2 text-xs text-gray-400">
            {new Intl.DateTimeFormat("es", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(article.publishedAt)}
          </time>
        )}
      </div>
    </Link>
  );
}

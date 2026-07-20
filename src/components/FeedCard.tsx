import Image from "next/image";
import Link from "next/link";

export type FeedCardArticle = {
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string | null;
  publishedAt: string | null;
  category: { name: string; slug: string };
};

export function FeedCard({ article }: { article: FeedCardArticle }) {
  return (
    <Link
      href={`/noticia/${article.slug}`}
      className="group flex flex-col gap-3 border-b border-gray-200 py-6 first:pt-0 dark:border-gray-800"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-md bg-gray-100 dark:bg-gray-900">
        {article.coverImageUrl ? (
          <Image
            src={article.coverImageUrl}
            alt={article.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
            sizes="(min-width: 640px) 500px, 100vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
            Sin imagen
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="w-fit rounded bg-red-600 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
          {article.category.name}
        </span>
        <h2 className="text-lg font-bold leading-snug text-gray-900 group-hover:underline dark:text-gray-50">
          {article.title}
        </h2>
        <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
          {article.excerpt}
        </p>
        {article.publishedAt && (
          <time className="text-xs text-gray-400">
            {new Intl.DateTimeFormat("es", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(new Date(article.publishedAt))}
          </time>
        )}
      </div>
    </Link>
  );
}

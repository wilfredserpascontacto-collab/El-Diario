import Link from "next/link";
import { Suspense } from "react";
import { getAllCategories } from "@/lib/articles";
import { SearchBar } from "@/components/SearchBar";

export async function Header() {
  const categories = await getAllCategories();

  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-2xl font-black tracking-tight text-gray-900 dark:text-gray-50">
            El Diario<span className="text-red-600">.</span>
          </Link>
          <Suspense fallback={<div className="h-9 w-full max-w-xs" />}>
            <SearchBar />
          </Suspense>
        </div>
        <nav className="flex flex-wrap gap-4 overflow-x-auto text-sm font-medium text-gray-700 dark:text-gray-300">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categoria/${category.slug}`}
              className="whitespace-nowrap transition hover:text-red-600"
            >
              {category.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

"use client";

import { useSearchParams } from "next/navigation";

export function SearchBar() {
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("q") ?? "";

  return (
    <form action="/buscar" method="GET" className="flex w-full max-w-xs">
      <input
        type="search"
        name="q"
        defaultValue={currentQuery}
        placeholder="Buscar noticias..."
        className="w-full rounded-l border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
      />
      <button
        type="submit"
        className="rounded-r bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
      >
        Buscar
      </button>
    </form>
  );
}

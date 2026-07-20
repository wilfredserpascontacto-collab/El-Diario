"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FeedCard, type FeedCardArticle } from "@/components/FeedCard";
import type { FeedCursor } from "@/lib/feed";

type FeedProps = {
  initialItems: FeedCardArticle[];
  initialNextCursor: FeedCursor | null;
  initialLastCategoryId: number | null;
};

export function Feed({ initialItems, initialNextCursor, initialLastCategoryId }: FeedProps) {
  const [items, setItems] = useState(initialItems);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [lastCategoryId, setLastCategoryId] = useState(initialLastCategoryId);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !nextCursor) return;
    loadingRef.current = true;
    setLoading(true);

    try {
      const params = new URLSearchParams({
        cursorPublishedAt: nextCursor.publishedAt,
        cursorId: String(nextCursor.id),
      });
      if (lastCategoryId !== null) {
        params.set("lastCategoryId", String(lastCategoryId));
      }

      const response = await fetch(`/api/feed?${params.toString()}`);
      const data = await response.json();

      setItems((prev) => [...prev, ...data.items]);
      setNextCursor(data.nextCursor);
      setLastCategoryId(data.lastCategoryId);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [nextCursor, lastCategoryId]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "600px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col">
      {items.map((article, index) => (
        <FeedCard key={`${article.slug}-${index}`} article={article} />
      ))}

      {nextCursor && (
        <div ref={sentinelRef} className="py-6 text-center text-sm text-gray-400">
          {loading ? "Cargando más noticias..." : ""}
        </div>
      )}

      {!nextCursor && items.length > 0 && (
        <p className="py-6 text-center text-sm text-gray-400">
          Ya viste todas las noticias publicadas.
        </p>
      )}

      {items.length === 0 && (
        <p className="py-6 text-center text-gray-500">
          Todavía no hay noticias publicadas.
        </p>
      )}
    </div>
  );
}

import { prisma } from "@/lib/prisma";

export function getAllCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export function getRecentArticles(limit = 12) {
  return prisma.article.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
    include: { category: true },
  });
}

export async function getArticlesByCategory(categorySlug: string) {
  return prisma.article.findMany({
    where: { published: true, category: { slug: categorySlug } },
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  });
}

export function getArticleBySlug(slug: string) {
  return prisma.article.findUnique({
    where: { slug },
    include: { category: true },
  });
}

export function searchArticles(query: string) {
  if (!query.trim()) return Promise.resolve([]);
  return prisma.article.findMany({
    where: {
      published: true,
      OR: [
        { title: { contains: query } },
        { excerpt: { contains: query } },
        { content: { contains: query } },
      ],
    },
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  });
}

export function getAllArticlesForAdmin() {
  return prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
}

export function getArticleById(id: number) {
  return prisma.article.findUnique({ where: { id } });
}

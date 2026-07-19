"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/slug";

export type ArticleFormState = {
  error?: string;
};

function readArticleFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const coverImageUrl = String(formData.get("coverImageUrl") ?? "").trim();
  const categoryId = Number(formData.get("categoryId"));
  const published = formData.get("published") === "on";
  const featured = formData.get("featured") === "on";
  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug = slugify(slugInput || title);

  return { title, excerpt, content, coverImageUrl, categoryId, published, featured, slug };
}

export async function createArticle(
  _prevState: ArticleFormState,
  formData: FormData
): Promise<ArticleFormState> {
  await requireAdmin();

  const { title, excerpt, content, coverImageUrl, categoryId, published, featured, slug } =
    readArticleFields(formData);

  if (!title || !excerpt || !content || !categoryId || !slug) {
    return { error: "Completa todos los campos obligatorios." };
  }

  const existing = await prisma.article.findUnique({ where: { slug } });
  if (existing) {
    return { error: "Ya existe una noticia con ese slug. Usa uno distinto." };
  }

  await prisma.article.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      coverImageUrl: coverImageUrl || null,
      categoryId,
      published,
      featured,
      publishedAt: published ? new Date() : null,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateArticle(
  id: number,
  _prevState: ArticleFormState,
  formData: FormData
): Promise<ArticleFormState> {
  await requireAdmin();

  const { title, excerpt, content, coverImageUrl, categoryId, published, featured, slug } =
    readArticleFields(formData);

  if (!title || !excerpt || !content || !categoryId || !slug) {
    return { error: "Completa todos los campos obligatorios." };
  }

  const existing = await prisma.article.findUnique({ where: { slug } });
  if (existing && existing.id !== id) {
    return { error: "Ya existe otra noticia con ese slug. Usa uno distinto." };
  }

  const current = await prisma.article.findUniqueOrThrow({ where: { id } });

  await prisma.article.update({
    where: { id },
    data: {
      title,
      slug,
      excerpt,
      content,
      coverImageUrl: coverImageUrl || null,
      categoryId,
      published,
      featured,
      publishedAt: published ? (current.publishedAt ?? new Date()) : null,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/noticia/${slug}`);
  redirect("/admin");
}

export async function deleteArticle(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = Number(formData.get("id"));
  await prisma.article.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function togglePublished(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = Number(formData.get("id"));
  const article = await prisma.article.findUniqueOrThrow({ where: { id } });

  await prisma.article.update({
    where: { id },
    data: {
      published: !article.published,
      publishedAt: !article.published ? (article.publishedAt ?? new Date()) : article.publishedAt,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function toggleFeatured(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = Number(formData.get("id"));
  const article = await prisma.article.findUniqueOrThrow({ where: { id } });

  await prisma.article.update({
    where: { id },
    data: { featured: !article.featured },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

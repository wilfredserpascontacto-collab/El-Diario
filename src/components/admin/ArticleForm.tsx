"use client";

import { useActionState } from "react";
import type { ArticleFormState } from "@/app/admin/(protected)/actions";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

type Category = { id: number; name: string };

type ArticleFormProps = {
  action: (state: ArticleFormState, formData: FormData) => Promise<ArticleFormState>;
  categories: Category[];
  submitLabel: string;
  initialValues?: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImageUrl: string | null;
    categoryId: number;
    published: boolean;
  };
};

const initialState: ArticleFormState = {};

export function ArticleForm({ action, categories, submitLabel, initialValues }: ArticleFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <label className="flex flex-col gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
        Título *
        <input
          type="text"
          name="title"
          required
          defaultValue={initialValues?.title}
          className="rounded border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
        Slug (URL) — déjalo vacío para generarlo desde el título
        <input
          type="text"
          name="slug"
          defaultValue={initialValues?.slug}
          placeholder="ej: mi-noticia-de-ejemplo"
          className="rounded border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
        Categoría *
        <select
          name="categoryId"
          required
          defaultValue={initialValues?.categoryId ?? ""}
          className="rounded border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        >
          <option value="" disabled>
            Selecciona una categoría
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
        URL de imagen de portada
        <input
          type="url"
          name="coverImageUrl"
          defaultValue={initialValues?.coverImageUrl ?? ""}
          placeholder="https://..."
          className="rounded border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
        Extracto *
        <textarea
          name="excerpt"
          required
          rows={2}
          defaultValue={initialValues?.excerpt}
          className="rounded border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        />
      </label>

      <div className="flex flex-col gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
        Contenido *
        <RichTextEditor name="content" initialContent={initialValues?.content} />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            name="published"
            defaultChecked={initialValues?.published}
            className="h-4 w-4"
          />
          Publicada
        </label>
      </div>

      {state.error && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded bg-red-600 px-5 py-2 font-medium text-white hover:bg-red-700 disabled:opacity-60"
      >
        {pending ? "Guardando..." : submitLabel}
      </button>
    </form>
  );
}

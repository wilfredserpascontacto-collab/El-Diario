"use client";

export function DeleteArticleForm({
  id,
  action,
}: {
  id: number;
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!confirm("¿Eliminar esta noticia? Esta acción no se puede deshacer.")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-red-600 hover:underline">
        Eliminar
      </button>
    </form>
  );
}

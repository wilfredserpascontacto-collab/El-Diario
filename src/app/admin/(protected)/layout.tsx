import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logout } from "@/app/admin/login/actions";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-lg font-bold text-gray-900 dark:text-gray-50">
              Panel de administración
            </Link>
            <Link
              href="/admin/articulos/nuevo"
              className="text-sm font-medium text-red-600 hover:underline"
            >
              Nueva noticia
            </Link>
            <Link href="/" className="text-sm text-gray-500 hover:underline">
              Ver sitio
            </Link>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="text-sm font-medium text-gray-600 hover:text-red-600 dark:text-gray-300"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}

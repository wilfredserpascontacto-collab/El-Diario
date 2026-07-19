import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-gray-200 bg-white py-8 text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 sm:flex-row">
        <p>&copy; {new Date().getFullYear()} El Diario. Todos los derechos reservados.</p>
        <Link href="/admin" className="hover:text-red-600">
          Panel de administración
        </Link>
      </div>
    </footer>
  );
}

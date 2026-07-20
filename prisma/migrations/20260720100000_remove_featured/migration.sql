-- Elimina el concepto de "destacada": ya no se usa selección manual,
-- la portada ahora es un muro cronológico intercalado por categoría.
ALTER TABLE "Article" DROP COLUMN "featured";

"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import { Embed } from "./EmbedNode";
import { detectEmbedProvider } from "@/lib/embeds";
import { plainTextToHtml } from "@/lib/content";

type RichTextEditorProps = {
  name: string;
  initialContent?: string;
};

export function RichTextEditor({ name, initialContent = "" }: RichTextEditorProps) {
  const [html, setHtml] = useState(() => plainTextToHtml(initialContent));

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false },
      }),
      ImageExtension,
      Embed,
    ],
    content: plainTextToHtml(initialContent),
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[300px] rounded-b border border-t-0 border-gray-300 px-3 py-2 focus:outline-none dark:border-gray-700 dark:prose-invert dark:bg-gray-900 dark:text-gray-100",
      },
    },
    onUpdate: ({ editor }) => {
      setHtml(editor.getHTML());
    },
  });

  if (!editor) {
    return (
      <div className="min-h-[340px] animate-pulse rounded border border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900" />
    );
  }

  const addImage = () => {
    const url = window.prompt(
      "URL de la imagen (ej. la que copiaste de tu banco de imágenes en Cloudinary):"
    );
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = window.prompt("URL del enlace:");
    if (url) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  };

  const addEmbed = () => {
    const url = window.prompt(
      "Pega el enlace de YouTube, X/Twitter, Instagram, TikTok o Facebook:"
    );
    if (!url) return;

    const provider = detectEmbedProvider(url);
    if (!provider) {
      window.alert(
        "No reconocí ese enlace como de YouTube, X/Twitter, Instagram, TikTok o Facebook. Revisa que sea la URL completa (con https://)."
      );
      return;
    }

    editor.chain().focus().setEmbed({ provider, url }).run();
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center gap-1 rounded-t border border-gray-300 bg-gray-50 p-1.5 dark:border-gray-700 dark:bg-gray-900">
        <ToolbarButton
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          label="Título"
        />
        <ToolbarButton
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          label="Subtítulo"
        />
        <Divider />
        <ToolbarButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          label="Negrita"
        />
        <ToolbarButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          label="Cursiva"
        />
        <Divider />
        <ToolbarButton
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          label="Lista"
        />
        <ToolbarButton active={editor.isActive("link")} onClick={addLink} label="Enlace" />
        <Divider />
        <ToolbarButton onClick={addImage} label="Imagen" />
        <ToolbarButton onClick={addEmbed} label="Insertar embed" />
      </div>

      <EditorContent editor={editor} />

      <input type="hidden" name={name} value={html} readOnly />
    </div>
  );
}

function ToolbarButton({
  onClick,
  label,
  active = false,
}: {
  onClick: () => void;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded px-2 py-1 text-xs font-medium ${
        active
          ? "bg-red-600 text-white"
          : "text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800"
      }`}
    >
      {label}
    </button>
  );
}

function Divider() {
  return <div className="mx-1 h-5 w-px bg-gray-300 dark:bg-gray-700" />;
}

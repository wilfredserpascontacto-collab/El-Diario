import { Node, mergeAttributes } from "@tiptap/core";

export interface EmbedOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    embed: {
      setEmbed: (options: { provider: string; url: string }) => ReturnType;
    };
  }
}

/**
 * Nodo de embed para el editor de noticias. Solo guarda {provider, url}
 * como atributos de un <div data-embed data-embed-url>. Nunca guarda HTML
 * ni <script> de terceros — eso se genera en el sitio público a partir de
 * código propio (ver RichContent.tsx), nunca desde el texto almacenado.
 */
export const Embed = Node.create<EmbedOptions>({
  name: "embed",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addOptions() {
    return { HTMLAttributes: {} };
  },

  addAttributes() {
    return {
      provider: { default: null },
      url: { default: null },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-embed]",
        getAttrs: (element) => {
          if (typeof element === "string") return false;
          return {
            provider: element.getAttribute("data-embed"),
            url: element.getAttribute("data-embed-url"),
          };
        },
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-embed": node.attrs.provider,
        "data-embed-url": node.attrs.url,
      }),
    ];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement("div");
      dom.setAttribute("data-embed", node.attrs.provider);
      dom.setAttribute("data-embed-url", node.attrs.url);
      dom.className =
        "my-4 flex items-center gap-2 rounded border border-dashed border-gray-300 bg-gray-50 p-3 text-sm text-gray-600";
      dom.textContent = `📎 Embed de ${node.attrs.provider}: ${node.attrs.url}`;
      return { dom };
    };
  },

  addCommands() {
    return {
      setEmbed:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});

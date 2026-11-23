// astro.config.mjs
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// code.language-mermaid を <pre class="mermaid"> に変換するフック
function rehypeMermaid() {
  return (tree) => {
    const visit = (node) => {
      const codeEl = node.children?.[0];
      const classes = codeEl?.properties?.className;
      const isMermaid = Array.isArray(classes)
        ? classes.includes('language-mermaid')
        : classes === 'language-mermaid';

      if (node.type === 'element' && node.tagName === 'pre' && codeEl?.tagName === 'code' && isMermaid) {
        node.properties = { className: ['mermaid'] };
        node.children = codeEl.children;
        return;
      }
      if (node.children) {
        node.children.forEach(visit);
      }
    };
    visit(tree);
  };
}

export default defineConfig({
  site: 'https://seclib.net',
  integrations: [mdx(), sitemap()],
  markdown: {
    syntaxHighlight: {
      type: 'shiki',
      excludeLangs: ['mermaid'],
    },
    rehypePlugins: [rehypeMermaid],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
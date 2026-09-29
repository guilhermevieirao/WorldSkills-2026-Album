import { defineConfig } from 'vite';

// a página é index.html + src/ (módulos JS e CSS); public/ vai para o ar como está (dados, fotos, prévias).
// Depois do build, scripts/generate-pages.mjs acrescenta em dist/ as páginas de cada figurinha,
// o 404, o sitemap, o robots.txt e o llms.txt.
export default defineConfig({
  json: { stringify: true },
  build: { outDir: 'dist', emptyOutDir: true },
});

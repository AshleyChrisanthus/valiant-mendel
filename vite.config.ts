import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import path from 'node:path';

function devHtmlRewritePlugin() {
  return {
    name: 'dev-html-rewrite',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        if (req.url === '/' || req.url === '/index.html') {
          req.url = '/index.dev.html';
        }
        next();
      });
    }
  };
}

export default defineConfig({
  build: {
    rollupOptions: {
      input: path.resolve(process.cwd(), 'index.dev.html')
    }
  },
  plugins: [
    devHtmlRewritePlugin(),
    react(),
    tailwindcss(),
    viteSingleFile()
  ]
});

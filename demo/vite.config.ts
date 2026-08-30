import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

/* La démo consomme le design system depuis ses sources : ce qui est vérifié à
   l'écran est exactement ce qui est publié. */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      /* Les clés les plus spécifiques d'abord : Vite retient la première qui
         préfixe la requête. */
      /* LE MONTAGE DE LA VITRINE. Une seule entrée : socle + marque, comme une app.
         Pour essayer une autre marque sans toucher au socle, repointez l'import de
         `brand-entry.css` — c'est la seule ligne concernée. */
      'virtual:ds-entry': fileURLToPath(new URL('./brand-yunary-entry.css', import.meta.url)),
      '@yunary/ds/core.css': fileURLToPath(new URL('../src/styles/core.css', import.meta.url)),
      '@yunary/ds/brand-yunary.css': fileURLToPath(new URL('../src/styles/brand-yunary.css', import.meta.url)),
      '@yunary/ds/brand-content.css': fileURLToPath(new URL('../src/styles/brand-content.css', import.meta.url)),
      '@yunary/ds/brand-content': fileURLToPath(new URL('../src/brand-content.tsx', import.meta.url)),
      '@yunary/ds/theme.css': fileURLToPath(new URL('../src/styles/theme.css', import.meta.url)),
      '@yunary/ds': fileURLToPath(new URL('../src/index.ts', import.meta.url)),
    },
  },
  server: {
    /* 5273 par defaut. PORT permet au harness d'assigner un port libre quand une
       autre instance de la vitrine tourne deja. */
    port: Number(process.env.PORT) || 5273,
    open: false,
    fs: {
      /* Les polices auto-hébergées d'un projet vivent dans le paquet
         (src/styles/assets/fonts/), au-dessus de la racine de la démo. */
      allow: [fileURLToPath(new URL('..', import.meta.url))],
    },
  },
});

import { defineConfig } from 'tsup';

export default defineConfig({
  /* Deux points d'entrée : le socle, et l'extension métier optionnelle. Séparés pour que
     `import '@yunary/ds'` n'embarque ni les tracés de plateforme ni la grille. */
  entry: ['src/index.ts', 'src/brand-content.tsx'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  target: 'es2020',
  external: ['react', 'react-dom', 'lucide-react', 'tailwind-merge'],
});

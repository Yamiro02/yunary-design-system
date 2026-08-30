import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
/* Les fondations en JS, la couche Tailwind en CSS (voir styles.css) — le montage
   exact d'une app consommatrice.
   `virtual:ds-entry` est résolu à la construction par vite.config.ts, sur le montage
   de la vitrine : socle + marque, via `demo/brand-entry.css`. Pour essayer une autre
   marque, on repointe l'import de ce fichier — aucune ligne du socle ne change. */
import 'virtual:ds-entry';
import './styles.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

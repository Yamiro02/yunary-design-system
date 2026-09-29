/// <reference types="vite/client" />

/* `virtual:ds-entry` est un alias résolu dans vite.config.ts vers le montage de la vitrine
   — brand-yunary-entry.css, qui monte le socle puis la marque.
   TypeScript ne peut pas le résoudre seul : on le lui déclare. */
declare module 'virtual:ds-entry';

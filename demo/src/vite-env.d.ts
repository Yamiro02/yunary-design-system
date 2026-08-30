/// <reference types="vite/client" />

/* `virtual:ds-entry` est un alias résolu dans vite.config.ts vers l'un des trois montages
   — brand-entry.css, qui monte le socle puis la marque du projet.
   TypeScript ne peut pas le résoudre seul : on le lui déclare. */
declare module 'virtual:ds-entry';

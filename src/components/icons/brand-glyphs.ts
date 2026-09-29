import { createLucideIcon, type LucideIcon } from 'lucide-react';

/**
 * L'ICÔNE DE MARQUE DU SET, DESSINÉE ICI — et pas importée de lucide.
 *
 * POURQUOI. lucide-react ne livre plus d'icônes de marque à partir de sa version 1 (GitHub,
 * YouTube, X…) : ces logos sont des marques déposées et lucide a cessé de les redistribuer.
 * Un import de MODULE de `Github` casserait donc le bundle du paquet chez toute app en
 * lucide 1, même une app qui ne s’en sert jamais, et le peer `lucide-react: ">=0.400"`
 * mentirait.
 *
 * CE QUE ÇA N’EST PAS. Aucune bibliothèque d’icônes n’est ajoutée. Ce fichier ne porte que
 * les COORDONNÉES du dessin — relevées sur lucide 0.469, la dernière version à le livrer —
 * reconstruites par `createLucideIcon`, l’usine que lucide expose toujours. Le résultat est
 * un `LucideIcon` ordinaire : il traverse le même `Glyph`, hérite des mêmes règles de taille
 * et d’épaisseur, et rien ne change pour l’appelant.
 *
 * CE QUE ÇA COÛTE. Ce dessin est à nous : si GitHub change son logo, c’est ici qu’on le met
 * à jour. Aucune mise à jour de lucide ne le fera.
 */

export const Github: LucideIcon = createLucideIcon('Github', [
  ['path', { d: 'M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4', key: 'tonef' }],
  ['path', { d: 'M9 18c-4.51 2-5-2-7-2', key: '9comsn' }],
]);

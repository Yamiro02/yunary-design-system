import { createLucideIcon, type LucideIcon } from 'lucide-react';

/**
 * LES TROIS ICÔNES DE MARQUE, DESSINÉES ICI — et pas importées de lucide.
 *
 * POURQUOI. lucide-react a RETIRÉ toutes ses icônes de marque en v1 : GitHub, YouTube,
 * Instagram, X… Ce n’est pas une régression, c’est une décision juridique — ces logos sont
 * des marques déposées et lucide a cessé de les redistribuer. Le socle en employait trois,
 * en import de MODULE : le bundle du paquet cassait donc chez toute app en lucide v1, même
 * une app qui ne s’en sert jamais. Le peer `lucide-react: ">=0.400"` était devenu un
 * mensonge, et le symptôme arrivait au build de l’app, jamais ici.
 *
 * CE QUE ÇA N’EST PAS. Aucune bibliothèque d’icônes n’a été ajoutée. Ce fichier ne porte que
 * les COORDONNÉES des trois dessins — relevées sur lucide 0.469, la dernière version à les
 * livrer — reconstruites par `createLucideIcon`, l’usine que lucide expose toujours. Le
 * résultat est un `LucideIcon` ordinaire : il traverse le même `Glyph`, hérite des mêmes
 * règles de taille et d’épaisseur, et rien ne change pour l’appelant.
 *
 * CE QUE ÇA COÛTE. Ces trois dessins sont désormais à nous : si une de ces marques change
 * son logo, c’est ici qu’on le met à jour. Aucune mise à jour de lucide ne le fera plus.
 */

export const Github: LucideIcon = createLucideIcon('Github', [
  ['path', { d: 'M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4', key: 'tonef' }],
  ['path', { d: 'M9 18c-4.51 2-5-2-7-2', key: '9comsn' }],
]);

export const Youtube: LucideIcon = createLucideIcon('Youtube', [
  ['path', { d: 'M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17', key: '1q2vi4' }],
  ['path', { d: 'm10 15 5-3-5-3z', key: '1jp15x' }],
]);

export const Instagram: LucideIcon = createLucideIcon('Instagram', [
  ['rect', { width: '20', height: '20', x: '2', y: '2', rx: '5', ry: '5', key: '2e1cvw' }],
  ['path', { d: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z', key: '9exkf1' }],
  ['line', { x1: '17.5', x2: '17.51', y1: '6.5', y2: '6.5', key: 'r4j83e' }],
]);

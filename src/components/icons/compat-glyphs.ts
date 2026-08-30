import { createLucideIcon, type LucideIcon } from 'lucide-react';

/**
 * LES GLYPHES DESSINÉS ICI POUR CAUSE DE COMPATIBILITÉ DE PEER.
 *
 * À NE PAS CONFONDRE AVEC `brand-glyphs.ts`, qui existe pour une raison JURIDIQUE : lucide a
 * retiré les logos de marque et ne les redistribue plus. Ici la raison est différente et
 * purement mécanique — le NOM du glyphe n'est pas stable sur toute la plage du peer.
 *
 * LE DÉFAUT QUE ÇA FERME. `package.json` déclare `lucide-react: ">=0.400"`. Le glyphe de la
 * maison s'appelle `House` depuis son renommage, et `Home` avant. Les deux noms coexistent sur
 * la version installée ici (0.469), mais PAS sur toute la plage :
 *   · une app en 0.4xx d'avant le renommage n'expose que `Home` ;
 *   · une app future peut voir disparaître l'alias `Home`.
 * Un import nommé qui n'existe pas n'est pas une erreur d'exécution rattrapable : Rollup
 * refuse le module, et c'est le `vite build` de l'APP qui casse — jamais le nôtre. Le peer
 * serait un mensonge, exactement comme il l'était avant le sous-lot des icônes de marque.
 *
 * CE QUE ÇA N'EST PAS. Aucune bibliothèque ajoutée. Ce fichier ne porte que les COORDONNÉES du
 * dessin — relevées au caractère près sur lucide-react 0.469.0, clés comprises — reconstruites
 * par `createLucideIcon`, l'usine que lucide expose de façon stable. Le résultat est un
 * `LucideIcon` ordinaire : il traverse le même `Glyph` que les autres, hérite des mêmes règles
 * de taille et d'épaisseur, et rien ne change pour l'appelant.
 *
 * CE QUE ÇA COÛTE. Ce dessin est à nous : une refonte du glyphe chez lucide ne nous parviendra
 * plus. C'est le prix à payer pour que le peer dise la vérité.
 */

export const House: LucideIcon = createLucideIcon('House', [
  ['path', { d: 'M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8', key: '5wwlr5' }],
  ['path', { d: 'M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', key: '1d0kgt' }],
]);

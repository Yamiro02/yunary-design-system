/**
 * ══════════════════════════════════════════════════════════════════════════════
 * IDENTITÉ TEXTUELLE
 * ══════════════════════════════════════════════════════════════════════════════
 * Le SEUL endroit du paquet où le nom de la marque est écrit en dur. `Logo`, `Navbar`,
 * `Footer`, `Sidebar` et `Avatar` lisent d'ici : vous changez ces trois constantes, tout
 * le système suit.
 *
 *   npm run rebrand -- "@votre-scope/ds" "Votre Nom"
 *
 * réécrit ce fichier pour vous.
 *
 * CES TROIS CONSTANTES PORTENT L'IDENTITÉ DU DÉPÔT, et c'est le bon défaut : les apps qui
 * installent le paquet n'ont rien à passer.
 *
 * UN PROJET CLIENT copie le dossier et les remplace — `npm run rebrand` le fait, ou vous
 * les éditez à la main. C'est l'un des trois gestes de GETTING-STARTED.md.
 *
 * Ces constantes ne sont que des DÉFAUTS : chaque composant garde sa prop, qui l'emporte.
 * Une app multi-marques passe la sienne à chaque appel sans toucher à ce fichier.
 * ══════════════════════════════════════════════════════════════════════════════
 */

/** Nom complet — libellés d'accessibilité, aria-label, alt d'avatar. */
export const BRAND_NAME = "Yunary";

/** Initiales — variante `monogram` du logo, repli de l'Avatar. 1 à 3 lettres. */
export const BRAND_MONOGRAM = "Y";

/**
 * Le mot-marque, ligne par ligne. Une seule entrée = variantes `wordmark` et `stacked`
 * identiques. Deux entrées (`['Ma', 'Marque']`) = `stacked` empile les deux lignes,
 * `wordmark` les rend sur une seule.
 */
export const BRAND_WORDMARK_LINES: readonly string[] = ["Yunary"];

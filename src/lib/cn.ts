import { extendTailwindMerge } from 'tailwind-merge';

/**
 * Composition de classes du design system.
 *
 * `twMerge` nu classe `text-control`, `text-heading`… comme des COULEURS : mis en
 * conflit avec une vraie couleur (`text-foreground`), le palier de taille serait
 * supprimé du DOM. On lui apprend donc les paliers du DS comme groupe `font-size`.
 *
 * `PALIERS_TYPO` est exporté : une app consommatrice qui construit son propre `cn`
 * doit réutiliser CETTE liste, sinon elle réintroduit le bug de son côté. Le plus
 * simple est de ne pas le reconstruire du tout et d'appeler `makeCn`.
 */
export const PALIERS_TYPO = [
  'display-xl', 'display', 'heading-xl', 'heading', 'subheading',
  'heading-sm', 'body-lg', 'body', 'body-sm', 'control', 'caption', 'eyebrow', 'chip',
] as const;

const twMerge = extendTailwindMerge({
  extend: { classGroups: { 'font-size': [{ text: [...PALIERS_TYPO] }] } },
});

export type ClassValue = string | false | null | undefined;

export function cn(...classes: ClassValue[]): string {
  return twMerge(classes.filter(Boolean).join(' '));
}

/**
 * `cn` étendu aux paliers typo d'une app.
 *
 * Une app qui ajoute ses propres paliers (`text-tab`, `text-hero`…) doit les
 * déclarer à `tailwind-merge`, faute de quoi ils repassent COULEURS et
 * disparaissent du DOM au premier conflit — exactement le bug que `cn` corrige
 * pour les paliers du DS. `makeCn` évite de réécrire la configuration à côté :
 * les paliers du DS sont déjà dedans, seuls les paliers de l'app sont à donner.
 *
 *   const cn = makeCn(['tab', 'hero']);   // sans le préfixe `text-`
 *
 * `cn` reste le raccourci pour le cas courant : aucun palier supplémentaire.
 */
export function makeCn(paliersSupplementaires: string[]) {
  const merge = extendTailwindMerge({
    extend: {
      classGroups: {
        'font-size': [{ text: [...PALIERS_TYPO, ...paliersSupplementaires] }],
      },
    },
  });
  return (...classes: ClassValue[]): string => merge(classes.filter(Boolean).join(' '));
}

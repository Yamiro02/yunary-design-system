import type { HTMLAttributes, JSX } from 'react';
import { cn } from '../../lib/cn';
import { BRAND_MONOGRAM, BRAND_NAME } from '../../brand';

/**
 * Portrait détouré, avec un halo de marque optionnel derrière les épaules.
 * Sans `src`, il retombe sur un monogramme en sourdine. Le PNG détouré appartient à
 * l'app consommatrice : déposez-le chez elle et passez son chemin en `src`.
 *
 * Le monogramme de repli était écrit EN DUR en JSX — deux initiales de marque dans un
 * composant du socle. Le balayage de la palette de recette ne pouvait pas le voir : il lit
 * le CSS calculé, pas le texte rendu par React. Il vient désormais de `src/brand.ts`, et la
 * prop `initials` l'emporte.
 */
export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Cut-out portrait (transparent PNG). */
  src?: string;
  /** Texte alternatif. Défaut : `BRAND_NAME` de `src/brand.ts`. */
  alt?: string;
  /** Le monogramme de repli, sans `src`. Défaut : `BRAND_MONOGRAM` de `src/brand.ts`. */
  initials?: string;
  /** Longueur CSS, toujours en rem. */
  size?: string;
  halo?: boolean;
}

/* Le halo reprend les arrêts du dégradé de marque (--brand-via, --brand-to) adoucis
   par color-mix — l'idiome des jetons dérivés du socle (tokens/derives.css) : aucun
   littéral de couleur ici, tout suit la marque montée. */
const AVATAR_HALO =
  'radial-gradient(closest-side, color-mix(in srgb, var(--brand-via) 42%, transparent) 0%, '
  + 'color-mix(in srgb, var(--brand-to) 16%, transparent) 55%, transparent 78%)';

export function Avatar({
  src, alt = BRAND_NAME, initials = BRAND_MONOGRAM, size = '4rem', halo = true,
  className = '', style, ...rest
}: AvatarProps): JSX.Element {
  return (
    <span
      className={cn(className)}
      style={{ position: 'relative', display: 'inline-flex', width: size, height: size, ...style }}
      {...rest}
    >
      {halo ? (
        <span aria-hidden="true" style={{
          position: 'absolute', inset: '-35%', borderRadius: 'var(--radius-pill)', background: AVATAR_HALO,
        }} />
      ) : null}
      {src ? (
        <img src={src} alt={alt} style={{
          position: 'relative', width: '100%', height: '100%', objectFit: 'cover',
          objectPosition: 'top center', borderRadius: 'var(--radius-pill)',
        }} />
      ) : (
        <span aria-label={alt} role="img" style={{
          position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '100%', height: '100%', borderRadius: 'var(--radius-pill)',
          background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--text-muted)',
          fontFamily: 'var(--font-display)', fontSize: 'calc(' + size + ' * 0.34)',
          letterSpacing: 'var(--tracking-heading)',
        }}>{initials}</span>
      )}
    </span>
  );
}

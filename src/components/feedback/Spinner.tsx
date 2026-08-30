import type { CSSProperties, HTMLAttributes, JSX } from 'react';
import { cn } from '../../lib/cn';

/** Rotating loading ring in currentColor. Lives inside Button via its `loading` prop. */
export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * sm 1rem · md 1.25rem · lg 1.5rem — aligned on the Icon sizes. A CSS length is also
   * accepted. OMISE, c'est la voie normale : le créneau décide (`--ds-icon-size`, repli
   * 1.25rem = md), exactement comme pour Icon — le spinner qui remplit un créneau doit
   * rendre la MÊME taille que l'icône qu'il remplace.
   */
  size?: 'sm' | 'md' | 'lg' | string;
}

const SIZES: Record<string, string> = { sm: '1rem', md: '1.25rem', lg: '1.5rem' };

export function Spinner({ size, className = '', style, ...rest }: SpinnerProps): JSX.Element {
  /* Même mécanisme que Glyph (v0.3.0) : pas de défaut de paramètre écrit inline — le
     défaut vit dans le repli CSS, où un créneau peut le battre. `size` passé écrit la
     propriété et gagne : la surcharge au site d'appel reste possible. */
  const taille = size !== undefined
    ? ({ '--ds-icon-size': SIZES[size] || size } as CSSProperties)
    : undefined;
  return (
    <span
      role="status"
      aria-label="Chargement"
      className={cn('ds-spinner', className)}
      style={taille || style ? { ...taille, ...style } : undefined}
      {...rest}
    />
  );
}

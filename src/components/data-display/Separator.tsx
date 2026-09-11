import type { HTMLAttributes, JSX, ReactNode } from 'react';
import { cn } from '../../lib/cn';

/** Thin rule from --border. With `label`, renders the text centred on the line. */
export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  /** Centred caption on the line (horizontal only). */
  label?: ReactNode;
  /**
   * LE FILET DE BORD À BORD D'UNE CARTE (v0.1.4). Enfant DIRECT d'une `Card`, le filet annule
   * le `--card-pad` (ou `--card-pad-lg`) en marge négative et va du bord gauche au bord droit,
   * sans déborder de la boîte de bordure — aucun `overflow` à poser. Hors d'une carte, ou dans
   * un bloc imbriqué, la prop est sans effet : le pad à annuler n'est pas le sien.
   */
  bleed?: boolean;
}

export function Separator({
  orientation = 'horizontal', label, bleed = false, className = '', ...rest
}: SeparatorProps): JSX.Element {
  const cls = cn('ds-sep', orientation === 'vertical' && 'ds-sep--vertical', label ? 'ds-sep--label' : '', bleed && 'ds-sep--bleed', className);
  return <div role="separator" aria-orientation={orientation} className={cls} {...rest}>{label || null}</div>;
}

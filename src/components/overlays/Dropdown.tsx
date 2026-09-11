import type { HTMLAttributes, JSX, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../icons/Icon';

/** Menu panel, radius lg, --shadow-lg. Items highlight on --surface-alt ; the checked one carries
 *  the selected-element convention (--accent, --primary-readable, same weight, check at the end). */
export interface DropdownItem {
  label?: ReactNode;
  icon?: ReactNode;
  hint?: ReactNode;
  danger?: boolean;
  separator?: boolean;
  /**
   * L'ITEM COCHÉ (v0.1.4) — un menu de CHOIX (tri, filtre « Tous les réseaux ») et non
   * d'actions : `role="menuitemradio"` + `aria-checked`, plaque --accent, texte
   * --primary-readable à la MÊME graisse que les autres, coche en fin de ligne. `undefined`
   * (défaut) rend un `menuitem` d'action, sans coche : les deux se mélangent dans un même menu.
   */
  checked?: boolean;
  onSelect?: () => void;
  /** Classes en plus sur le <button> de l'item — les aides d'état de la vitrine
   *  (`is-hover`…) passent par ici. */
  className?: string;
}

export interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  items?: DropdownItem[];
  /** Render in flow instead of absolutely positioned. */
  inline?: boolean;
  /**
   * L'ANCRAGE (v0.1.4). Flottant, le panneau se pose JUSTE SOUS son déclencheur, dans un parent
   * en `position: relative` — c'est à l'app de le poser sur l'enveloppe du bouton, le composant
   * ne peut pas le faire pour un parent. `start` (défaut) aligne les bords gauches, `end` les
   * bords droits — le menu d'un bouton en bout de ligne. Sans `top`/`left`, un `absolute` reste à
   * sa place statique, à DROITE du bouton dans un `inline-flex` : c'est ce que rendait la 0.1.3.
   */
  align?: 'start' | 'end';
}

export function Dropdown({ items = [], inline = false, align = 'start', className = '', ...rest }: DropdownProps): JSX.Element {
  return (
    <div
      className={cn('ds-dropdown', !inline && 'ds-dropdown--floating', !inline && align === 'end' && 'ds-dropdown--end', className)}
      role="menu"
      {...rest}
    >
      {items.map((it, i) => it.separator
        ? <hr key={i} className="ds-dropdown__sep" />
        : (
          <button
            key={i}
            type="button"
            role={it.checked === undefined ? 'menuitem' : 'menuitemradio'}
            aria-checked={it.checked === undefined ? undefined : it.checked}
            onClick={it.onSelect}
            className={cn('ds-dropdown__item', it.danger && 'ds-dropdown__item--danger', it.className)}
          >
            {it.icon}
            <span className="ds-dropdown__label">{it.label}</span>
            {it.hint ? <span className="ds-dropdown__hint">{it.hint}</span> : null}
            {/* La coche ne rend que sur l'item coché : un item de choix non coché garde sa
                place à droite libre, la plaque suffit à dire lequel est pris. */}
            {it.checked ? <span className="ds-dropdown__check" aria-hidden="true"><Icon name="check" size="1rem" /></span> : null}
          </button>
        ))}
    </div>
  );
}

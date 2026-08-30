import type { HTMLAttributes, JSX, ReactNode } from 'react';
import { cn } from '../../lib/cn';

/** Menu panel, radius 2xl, --shadow-lg. Items highlight on --accent. */
export interface DropdownItem {
  label?: ReactNode;
  icon?: ReactNode;
  hint?: ReactNode;
  danger?: boolean;
  separator?: boolean;
  onSelect?: () => void;
  /** Classes en plus sur le <button> de l'item — les aides d'état de la vitrine
   *  (`is-hover`…) passent par ici. */
  className?: string;
}

export interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  items?: DropdownItem[];
  /** Render in flow instead of absolutely positioned. */
  inline?: boolean;
}

export function Dropdown({ items = [], inline = false, className = '', ...rest }: DropdownProps): JSX.Element {
  return (
    <div className={cn('ds-dropdown', !inline && 'ds-dropdown--floating', className)} role="menu" {...rest}>
      {items.map((it, i) => it.separator
        ? <hr key={i} className="ds-dropdown__sep" />
        : (
          <button
            key={i}
            type="button"
            role="menuitem"
            onClick={it.onSelect}
            className={cn('ds-dropdown__item', it.danger && 'ds-dropdown__item--danger', it.className)}
          >
            {it.icon}
            <span style={{ flex: 1 }}>{it.label}</span>
            {it.hint ? <span className="ds-dropdown__hint">{it.hint}</span> : null}
          </button>
        ))}
    </div>
  );
}

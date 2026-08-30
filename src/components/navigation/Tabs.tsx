import type { HTMLAttributes, JSX, ReactNode } from 'react';
import { cn } from '../../lib/cn';

/**
 * Segmented tab group on the control rail. The bar ALWAYS contrasts with its host
 * surface: --secondary on the page; inside a Card the bar deduces --background by itself
 * (patterns.css) — set `onCard` only for other containers that need the recessed regime.
 * Rectangle radii (0.875rem bar · --radius-sm tab) — never a pill, never blended in.
 */
export interface TabItem { value: string; label: ReactNode }

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items?: TabItem[];
  value?: string;
  onChange?: (value: string) => void;
  /** The bar sits on a Card — swaps the background to --background for contrast. */
  onCard?: boolean;
}

export function Tabs({ items = [], value, onChange, onCard = false, className = '', ...rest }: TabsProps): JSX.Element {
  return (
    <div className={cn('ds-tabs', onCard && 'ds-tabs--on-card', className)} role="tablist" {...rest}>
      {items.map(it => (
        <button
          key={it.value}
          type="button"
          role="tab"
          className="ds-tab"
          aria-selected={value === it.value}
          onClick={() => onChange && onChange(it.value)}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

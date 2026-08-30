import { forwardRef } from 'react';
import type { JSX, SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../icons/Icon';

/** Native select on the shared control rail, with a Lucide chevron.
 *  `forwardRef` : la ref atteint le <select> natif (react-hook-form, focus programmatique). */
export interface SelectOption { value: string; label: string }

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options?: SelectOption[];
  invalid?: boolean;
  /** 'page' (default) = sits directly on the layout (fill --secondary) · 'card' = inside a card (fill --background). */
  surface?: 'page' | 'card';
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select({
  options = [], invalid = false, surface = 'page', className = '', ...rest
}: SelectProps, ref): JSX.Element {
  return (
    <span className="ds-select">
      <select
        ref={ref}
        className={cn('ds-input', surface === 'card' && 'ds-input--on-card', invalid && 'is-error', className)}
        aria-invalid={invalid || undefined}
        {...rest}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {/* Sans taille : le créneau du déclencheur rend 1rem (patterns.css, v0.3.0). */}
      <Icon name="chevron-down" className="ds-select__chev" />
    </span>
  );
});
Select.displayName = 'Select';

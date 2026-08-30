import { forwardRef } from 'react';
import type { InputHTMLAttributes, JSX, ReactNode } from 'react';
import { cn } from '../../lib/cn';

/** Binary toggle. Track 2.75rem x 1.625rem, pill radius, knob 1.25rem.
 *  `forwardRef` : la ref atteint l'<input> natif du switch (react-hook-form). */
export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: ReactNode;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch({
  label, disabled = false, className = '', ...rest
}: SwitchProps, ref): JSX.Element {
  return (
    <label className={cn('ds-switch', disabled && 'is-disabled', className)}>
      <input ref={ref} type="checkbox" role="switch" disabled={disabled} {...rest} />
      <span className="ds-switch__track"><span className="ds-switch__knob" /></span>
      {label ? <span>{label}</span> : null}
    </label>
  );
});
Switch.displayName = 'Switch';

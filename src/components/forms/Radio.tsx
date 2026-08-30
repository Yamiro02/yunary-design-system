import { forwardRef } from 'react';
import type { InputHTMLAttributes, JSX, ReactNode } from 'react';
import { cn } from '../../lib/cn';

/** Radio in a group — the only circular control in the system.
 *  `forwardRef` : la ref atteint l'<input type="radio"> natif (react-hook-form). */
export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: ReactNode;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio({
  label, disabled = false, className = '', ...rest
}: RadioProps, ref): JSX.Element {
  return (
    <label className={cn('ds-choice', disabled && 'is-disabled', className)}>
      <input ref={ref} type="radio" disabled={disabled} {...rest} />
      <span className="ds-choice__box ds-choice__box--radio"><span className="ds-choice__dot" /></span>
      {label ? <span>{label}</span> : null}
    </label>
  );
});
Radio.displayName = 'Radio';

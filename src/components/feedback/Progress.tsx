import type { HTMLAttributes, JSX } from 'react';
import { cn } from '../../lib/cn';

/** Thin progress bar: accent-tinted rail, --primary fill. Indeterminate = sliding bar. */
export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** 0–max. Ignored when indeterminate. */
  value?: number;
  max?: number;
  indeterminate?: boolean;
  /** Accessible name. */
  label?: string;
}

export function Progress({
  value, max = 100, indeterminate = false, label, className = '', style, ...rest
}: ProgressProps): JSX.Element {
  const pct = indeterminate ? 0 : Math.min(100, Math.max(0, ((value ?? 0) / max) * 100));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={indeterminate ? undefined : (value ?? 0)}
      aria-label={label}
      className={cn('ds-progress', indeterminate && 'ds-progress--indeterminate', className)}
      style={style}
      {...rest}
    >
      <span className="ds-progress__bar" style={indeterminate ? undefined : { width: pct + '%' }} />
    </div>
  );
}

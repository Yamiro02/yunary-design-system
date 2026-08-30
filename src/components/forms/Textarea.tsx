import { forwardRef } from 'react';
import type { JSX, TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

/** Multi-line field. Auto height (no min-height), vertical resize only.
 *  `forwardRef` : la ref atteint le <textarea> natif (react-hook-form, focus programmatique). */
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
  rows?: number;
  /** 'page' (default) = sits directly on the layout (fill --secondary) · 'card' = inside a card (fill --background). */
  surface?: 'page' | 'card';
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({
  invalid = false, rows = 4, surface = 'page', className = '', ...rest
}: TextareaProps, ref): JSX.Element {
  const cls = cn('ds-input', 'ds-textarea', surface === 'card' && 'ds-input--on-card', invalid && 'is-error', className);
  return <textarea ref={ref} className={cls} rows={rows} aria-invalid={invalid || undefined} {...rest} />;
});
Textarea.displayName = 'Textarea';

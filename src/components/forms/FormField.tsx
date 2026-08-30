import type { JSX, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../icons/Icon';

/**
 * Label + control + help/error wrapper. An error replaces the help text and is
 * always colour + icon + text — never colour alone.
 */
export interface FormFieldProps {
  label?: ReactNode;
  htmlFor?: string;
  help?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  className?: string;
  children?: ReactNode;
}

export function FormField({
  label, htmlFor, help, error, required = false, className = '', children,
}: FormFieldProps): JSX.Element {
  return (
    <div className={cn('ds-field', className)}>
      {label ? (
        <label className="ds-label" htmlFor={htmlFor}>
          {label}{required ? <span className="ds-label__required"> *</span> : null}
        </label>
      ) : null}
      {children}
      {error ? (
        <span className="ds-error"><Icon name="circle-alert" size="0.875rem" strokeWidth={2.5} />{error}</span>
      ) : help ? <span className="ds-help">{help}</span> : null}
    </div>
  );
}

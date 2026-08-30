import type { HTMLAttributes, JSX, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Icon, type IconName } from '../icons/Icon';

/** Transient notification on --popover with --shadow-lg. Always colour + icon + text. */
export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: 'success' | 'danger' | 'warning' | 'info';
  title: ReactNode;
  description?: ReactNode;
  onClose?: () => void;
}

const TONE_ICONS: Record<string, IconName> = {
  success: 'check', danger: 'x', warning: 'triangle-alert', info: 'info',
};

export function Toast({
  tone = 'info', title, description, onClose, className = '', ...rest
}: ToastProps): JSX.Element {
  const t: string = TONE_ICONS[tone] ? tone : 'info';
  return (
    <div className={cn('ds-toast', className)} role="status" {...rest}>
      <span className={`ds-toast__icon ds-toast__icon--${t}`}>
        <Icon name={TONE_ICONS[t]} size="0.9375rem" strokeWidth={2.5} />
      </span>
      <div className="ds-toast__body">
        <span className="ds-toast__title">{title}</span>
        {description ? <span className="ds-toast__desc">{description}</span> : null}
      </div>
      {onClose ? (
        <button type="button" className="ds-toast__close" aria-label="Fermer" onClick={onClose}>
          <Icon name="x" size="1rem" />
        </button>
      ) : null}
    </div>
  );
}

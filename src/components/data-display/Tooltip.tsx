import type { JSX, ReactNode } from 'react';
import { cn } from '../../lib/cn';

/** Ink bubble on hover/focus (cream bubble in dark). Short label only, no rich content. */
export interface TooltipProps {
  content: ReactNode;
  placement?: 'top' | 'bottom';
  /** Force the bubble open — for specimen cards and screenshots. */
  open?: boolean;
  className?: string;
  children?: ReactNode;
}

export function Tooltip({
  content, placement = 'top', open, className = '', children,
}: TooltipProps): JSX.Element {
  const cls = cn('ds-tooltip', placement === 'bottom' && 'ds-tooltip--bottom', open && 'is-open', className);
  return (
    <span className={cls} tabIndex={0}>
      {children}
      <span className="ds-tooltip__bubble" role="tooltip">{content}</span>
    </span>
  );
}

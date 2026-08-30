import type { HTMLAttributes, JSX, ReactNode } from 'react';
import { cva } from 'class-variance-authority';
import { Icon, type IconName } from '../icons/Icon';

/** Inline, persistent message inside a page or a card. Always colour + icon + text. */
export interface BannerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: 'danger' | 'warning' | 'success' | 'info';
  title?: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
}

const BANNER_ICONS: Record<string, IconName> = {
  danger: 'triangle-alert', warning: 'triangle-alert', success: 'circle-check', info: 'info',
};

const banner = cva('ds-banner', {
  variants: {
    tone: {
      danger: 'ds-banner--danger',
      warning: 'ds-banner--warning',
      success: 'ds-banner--success',
      info: 'ds-banner--info',
    },
  },
  defaultVariants: { tone: 'info' },
});

export function Banner({
  tone = 'info', title, children, action, className = '', ...rest
}: BannerProps): JSX.Element {
  return (
    <div className={[banner({ tone }), className].filter(Boolean).join(' ')} role="note" {...rest}>
      <Icon name={BANNER_ICONS[tone]} size="1.125rem" strokeWidth={2} className="ds-banner__icon" />
      <div className="ds-banner__main">
        {title ? <span className="ds-banner__title">{title}</span> : null}
        {children ? <span className="ds-banner__text">{children}</span> : null}
      </div>
      {action}
    </div>
  );
}

import type { ElementType, HTMLAttributes, JSX, ReactNode } from 'react';
import { cva } from 'class-variance-authority';

/**
 * The signature surface: tinted --card fill, 1px --border, generous padding, tinted shadow.
 * Never pure white. Interactive cards lift translateY(-2px) to --shadow-md on hover.
 * Passing any header slot renders the header block; passing none renders exactly as before.
 */
/* Omit<'title'> : l'attribut HTML `title` est une string, notre slot est un ReactNode.
   Même traitement que EmptyStateProps, qui a le même conflit depuis la v0.1.0. */
export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** default = static · interactive = clickable (lift on hover) · feature = --grad-soft wash + orange border. */
  variant?: 'default' | 'interactive' | 'feature';
  /** md = radius lg / padding 1.5rem · lg = radius xl / padding 1.75rem. */
  size?: 'md' | 'lg';
  /** Removes padding and clips children — for cards with a full-bleed media top. */
  flush?: boolean;
  /** Header slot — gradient caps line above the title. */
  eyebrow?: ReactNode;
  /** Header slot — pass a <Pastille size="carte">. */
  icon?: ReactNode;
  /** Header slot — display face, casse et graisse selon --heading-transform / --heading-weight, jamais sous 1.125rem. */
  title?: ReactNode;
  /** Header slot — one muted line under the title. */
  subtitle?: ReactNode;
  /** Header slot — trailing control (IconButton, Button, chevron), pushed right. */
  action?: ReactNode;
  /** sm = --text-heading-sm (default) · lg = --text-subheading. */
  titleSize?: 'sm' | 'lg';
  /** normal = --space-4 gutter under the header · airy = --space-6, for a card of blocks. */
  headerGap?: 'normal' | 'airy';
  as?: keyof JSX.IntrinsicElements;
  children?: ReactNode;
}

const card = cva('ds-card', {
  variants: {
    variant: { default: '', interactive: 'ds-card--interactive', feature: 'ds-card--feature' },
    size: { md: '', lg: 'ds-card--lg' },
    flush: { true: 'ds-card--flush', false: '' },
  },
  defaultVariants: { variant: 'default', size: 'md', flush: false },
});

export function Card({
  variant = 'default', size = 'md', as, flush = false,
  eyebrow, icon, title, subtitle, action, titleSize = 'sm', headerGap = 'normal',
  className = '', children, ...rest
}: CardProps): JSX.Element {
  const Tag = (as ?? 'div') as ElementType;
  const cls = [card({ variant, size, flush }), className].filter(Boolean).join(' ');
  /* Aucun slot passé = aucun noeud d'en-tête émis. C'est la condition de non-régression :
     le DOM d'une Card sans en-tête est identique à celui d'avant la v0.4. */
  const hasHeader = Boolean(eyebrow || icon || title || subtitle || action);
  return (
    <Tag className={cls} {...rest}>
      {hasHeader ? (
        /* L'alignement est DÉCIDÉ ICI, jamais au site d'appel (v0.4.0) : titre simple
           -> centré ; titre + sous-titre -> --stacked (flex-start), l'action s'aligne
           sur le titre au lieu de flotter entre les deux lignes. Voir la règle au-dessus de .ds-card__header dans patterns.css. */
        <div className={[
          'ds-card__header',
          subtitle ? 'ds-card__header--stacked' : '',
          headerGap === 'airy' ? 'ds-card__header--airy' : '',
        ].filter(Boolean).join(' ')}>
          {icon}
          {(eyebrow || title || subtitle) ? (
            <div className="ds-card__header-main">
              {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
              {title ? (
                <h3 className={['ds-card__title', titleSize === 'lg' ? 'ds-card__title--lg' : ''].filter(Boolean).join(' ')}>
                  {title}
                </h3>
              ) : null}
              {subtitle ? <div className="ds-card__subtitle">{subtitle}</div> : null}
            </div>
          ) : null}
          {action ? <div className="ds-card__action">{action}</div> : null}
        </div>
      ) : null}
      {children}
    </Tag>
  );
}

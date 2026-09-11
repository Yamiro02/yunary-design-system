import type { HTMLAttributes, JSX, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Card } from '../data-display/Card';
import { Pastille } from '../data-display/Pastille';

/**
 * LA CARTE D'ÉTAT HÉROS — l'attente, l'indisponible, l'erreur, le cas limite (v0.1.4).
 * Promue à la troisième demande : l'audit d'onboarding de la coque (`AuditStateCard`), puis trois
 * écrans de Creator (Générateur vide, échec de génération, audit non évaluable).
 *
 * Ce n'est PAS `EmptyState` : celui-là est un emplacement VIDE en pointillés qui invite à
 * remplir ; celle-ci est une carte PLEINE (`Card lg`) qui explique un état — pastille HÉROS
 * outlined et carrée, titre en subheading, corps muted, un appoint libre (`children` : une barre
 * de progression, une ligne de rassurance) et une action optionnelle.
 *
 * Deux tons, deux rôles ARIA : `brand` (« attends, c'est normal ») annonce en `status`, `danger`
 * (« c'est nous, pas toi ») en `alert`. L'état se lit et s'annonce.
 */
export interface StateCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** brand (défaut) : l'attente, le cas limite normal · danger : l'erreur, l'indisponible. */
  tone?: 'brand' | 'danger';
  /** Le glyphe de la pastille héros — un `<Icon />` nu, la pastille l'enveloppe. */
  icon: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Un ou plusieurs boutons, centrés sous l'appoint. */
  action?: ReactNode;
  /** L'appoint entre le corps et l'action : progression, badge, ligne de rassurance. */
  children?: ReactNode;
}

export function StateCard({
  tone = 'brand', icon, title, description, action, className = '', children, ...rest
}: StateCardProps): JSX.Element {
  return (
    <Card
      size="lg"
      role={tone === 'danger' ? 'alert' : 'status'}
      className={cn('ds-state-card', className)}
      {...rest}
    >
      {/* Outlined, carrée : la pastille de marque des maquettes du 11/09, partout. */}
      <Pastille size="heros" tone={tone} outlined>{icon}</Pastille>
      <div className="ds-state-card__main">
        <h3 className="ds-state-card__title">{title}</h3>
        {description ? <p className="ds-state-card__desc">{description}</p> : null}
      </div>
      {children}
      {action ? <div className="ds-state-card__action">{action}</div> : null}
    </Card>
  );
}

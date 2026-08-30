import type { HTMLAttributes, JSX, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Pastille } from '../data-display/Pastille';

/** Dashed-border empty slot: <Pastille size="panneau" tone="brand" outlined> tile, titre H4 en face display, one next step. */
export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Un glyphe nu — la Pastille par défaut (panneau · brand · outlined) l'enveloppe. */
  icon?: ReactNode;
  /**
   * LA TUILE COMPLÈTE, quand celle par défaut ne convient pas — v0.3.0 : la Pastille était FIGÉE, aucun moyen d'en changer le ton ou la
   * taille. Passer ici sa propre <Pastille> (ou tout nœud) ; `icon` est alors ignoré.
   */
  tile?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({
  icon, tile, title, description, action, className = '', ...rest
}: EmptyStateProps): JSX.Element {
  return (
    <div className={cn('ds-empty', className)} {...rest}>
      {tile ?? (icon ? <Pastille size="panneau" tone="brand" outlined>{icon}</Pastille> : null)}
      <div className="ds-empty__main">
        <h4 className="ds-empty__title">{title}</h4>
        {description ? <p className="ds-empty__desc">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

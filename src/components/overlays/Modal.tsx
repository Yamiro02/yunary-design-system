import type { JSX, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../icons/Icon';
import { Pastille } from '../data-display/Pastille';
import { Button } from '../actions/Button';
import { useModalSurface } from './useModalSurface';

/**
 * Dialog on --popover, radius 2xl, --shadow-lg, over a 45% ink scrim with blur(2px).
 * Width 23.75rem at 64rem and up; UNDER 64rem the same modal becomes a bottom sheet
 * (full width, top corners radius-2xl, grip, enter from the bottom) — CSS only, same component.
 * Three phases in ONE dialog: confirm → loading → result.
 *
 * MODAL SURFACE — focus moved in on open, focus trapped, Escape closes, focus restored to the
 * opener on close (hook `useModalSurface`, shared with ActionSheet). phase="loading" keeps the
 * trap and kills Escape, the scrim click and the close button.
 */
export interface ModalResult {
  status: 'success' | 'error';
  title?: ReactNode;
  /** Comes from the caller — design for one to three lines, not a single word. */
  message?: ReactNode;
  /** Renders « Réessayer » next to « Fermer ». Error only. */
  onRetry?: () => void;
}

export interface ModalProps {
  open?: boolean;
  /** Optional icon tile top-left — pass an <Icon />; the tile itself is a <Pastille size="dialogue">. */
  icon?: ReactNode;
  /** Tile tint: danger (default) · brand · neutral · warning · success. */
  iconVariant?: 'danger' | 'brand' | 'neutral' | 'warning' | 'success';
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  /** Ignored while phase="loading": Escape, scrim click and the close button are all inert. */
  onClose?: () => void;
  /**
   * LA CROIX ET LES GESTES DE FUITE SONT DÉCOUPLÉS — v0.3.0. `onClose` seul rendait les TROIS d'un bloc : croix, Échap, clic-voile.
   * `closeButton={false}` retire la croix en gardant Échap et le voile ;
   * `dismissable={false}` fait l'inverse — la croix reste le seul geste de fermeture,
   * pour une modale à saisie qu'un clic à côté ne doit pas jeter. Les deux à `true`
   * (défaut) : comportement historique, rien ne bouge.
   */
  closeButton?: boolean;
  /** Escape and scrim click call onClose. Default true. */
  dismissable?: boolean;
  /** confirm (default) · loading = nothing dismisses · result = success or error in the same dialog. */
  phase?: 'confirm' | 'loading' | 'result';
  /** Result payload — required when phase="result". */
  result?: ModalResult;
  /** Render the panel without the fixed scrim — for specimen cards. */
  inline?: boolean;
  className?: string;
  children?: ReactNode;
}

type TileTone = 'danger' | 'brand' | 'neutral' | 'warning' | 'success';
const TILE_TONE: Record<string, TileTone> = {
  danger: 'danger', brand: 'brand', neutral: 'neutral', warning: 'warning', success: 'success',
};

export function Modal({
  open = true, icon, iconVariant = 'danger', title, description, footer,
  onClose, closeButton = true, dismissable = true, inline = false,
  phase = 'confirm', result, className = '', children,
}: ModalProps): JSX.Element | null {
  const locked = phase === 'loading';
  /* initialFocus 'container' : le panneau porte role="dialog", aria-modal et un nom accessible,
     donc y poser le focus fait annoncer la modale ET lire son contenu. Sur une confirmation
     destructive, le TEXTE doit être entendu avant l'action — or la croix « Fermer » précède le
     titre dans l'ordre du DOM, un focus sur le premier focusable y atterrirait. */
  /* `dismissable={false}` prive le hook de onClose : Échap ne ferme plus — le piège de
     focus, le verrou de défilement et la restitution du focus, eux, ne bougent pas. */
  const panelRef = useModalSurface({
    open, locked, onClose: dismissable ? onClose : undefined, inline, initialFocus: 'container',
  });

  if (!open) return null;

  const isResult = phase === 'result';
  const r = result ?? ({} as ModalResult);
  const resultTone: TileTone = r.status === 'error' ? 'danger' : 'success';

  const closeBtn = onClose && closeButton ? (
    <button
      type="button"
      className="ds-modal__close"
      aria-label="Fermer"
      disabled={locked}
      onClick={locked ? undefined : onClose}
    >
      <Icon name="x" size="1.125rem" />
    </button>
  ) : null;

  const panel = (
    <div
      ref={panelRef}
      className={cn('ds-modal', className)}
      role="dialog"
      aria-modal="true"
      aria-busy={locked || undefined}
      aria-label={typeof title === 'string' ? title : undefined}
    >
      <span className="ds-grip" aria-hidden="true" />
      {isResult ? (
        <>
          <div className="ds-modal__head ds-modal__head--end">{closeBtn}</div>
          <div className="ds-modal__result">
            <Pastille size="dialogue" tone={resultTone}>
              {/* Sans taille : le créneau de la pastille de dialogue rend 1.5rem
                  (patterns.css, v0.3.0). */}
              <Icon name={r.status === 'error' ? 'circle-x' : 'circle-check'} />
            </Pastille>
            {r.title ? <h3>{r.title}</h3> : null}
            {r.message ? <p className="ds-modal__desc ds-modal__desc--block">{r.message}</p> : null}
          </div>
          <div className="ds-modal__foot ds-modal__foot--center">
            {footer || (
              <>
                <Button variant="secondary" onClick={onClose}>Fermer</Button>
                {r.status === 'error' && r.onRetry ? (
                  <Button variant={iconVariant === 'danger' ? 'danger' : 'primary'} onClick={r.onRetry}>
                    Réessayer
                  </Button>
                ) : null}
              </>
            )}
          </div>
        </>
      ) : (
        <>
          {(icon || closeBtn) ? (
            <div className="ds-modal__head">
              {icon ? <Pastille size="dialogue" tone={TILE_TONE[iconVariant] ?? 'danger'}>{icon}</Pastille> : null}
              {closeBtn}
            </div>
          ) : null}
          {title ? <h3 className="ds-modal__title">{title}</h3> : null}
          {(description || children) ? (
            <div className="ds-modal__desc">
              {description ? <p className="ds-modal__text">{description}</p> : null}
              {children}
            </div>
          ) : null}
          {footer ? <div className="ds-modal__foot">{footer}</div> : null}
        </>
      )}
    </div>
  );

  if (inline) return panel;
  /* Le rang du voile (--z-modal, au-dessus du tiroir mobile) et son position:fixed
     vivent dans .ds-scrim — plus aucun style inline à surcharger. */
  return (
    <div className="ds-scrim" onClick={locked || !dismissable ? undefined : onClose}>
      <div onClick={e => e.stopPropagation()} className="ds-modal-wrap">
        <div className="ds-modal-slot">{panel}</div>
      </div>
    </div>
  );
}

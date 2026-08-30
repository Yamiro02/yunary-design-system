import { useEffect } from 'react';
import type { JSX, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { useModalSurface } from './useModalSurface';

/* Remplacé par le bundler de l'app (Vite, webpack…), donc le bloc disparaît en
   production. `declare` local plutôt qu'une dépendance @types/node ajoutée au paquet. */
declare const process: { env: { NODE_ENV?: string } };

const DESKTOP = '(min-width:64.0625rem)';

/**
 * The « ⋯ » menu on mobile: a bottom sheet of actions, cancel built in.
 * DOCTRINE — Dropdown is desktop only. Under 64rem a « ⋯ » menu ALWAYS opens as an
 * ActionSheet, never as a Dropdown. Not two competing components: the same gesture on
 * two screen sizes. Every row is at least --control-md tall (the system's touch rail).
 *
 * MODAL SURFACE — ActionSheet reuses Modal's behaviour (useModalSurface), it never rolls its own:
 * focus moved into the sheet on open, focus trapped inside it, Escape closes, focus restored to
 * the opener on close, role="dialog" + aria-modal. On mobile this sheet is the only thing on screen.
 *
 * PAS DE FILET — v0.8.0. La feuille n'émet plus aucun <hr>, et l'item `separator` a disparu
 * avec lui. Un menu de bureau (Dropdown) garde le sien : il est dense, survolé à la souris,
 * et le filet y sépare l'action destructrice du reste. Une feuille du bas est haute, aérée,
 * parcourue au pouce — le rythme des lignes suffit, et l'action destructrice se signale déjà
 * par sa couleur.
 *
 * ABOVE 64 rem — a rule, not a side effect: an ActionSheet NEVER opens as a modal surface
 * (`.ds-scrim--sheet` is display:none above 64 rem). It exists there only as an inline specimen
 * with `panel`: a 20rem panel, four corners at radius 2xl, full border, no grip, no scrim.
 */
export interface ActionSheetItem {
  label?: ReactNode;
  icon?: ReactNode;
  /** Destructive row — --destructive text. */
  danger?: boolean;
  onSelect?: () => void;
  /** Classes en plus sur le <button> de l'item — les aides d'état de la vitrine
   *  (`is-hover`…) passent par ici. */
  className?: string;
}

export interface ActionSheetProps {
  open?: boolean;
  title?: ReactNode;
  subtitle?: ReactNode;
  /** Optional caption above the cancel rule — consequences, quota, warning. */
  note?: ReactNode;
  items?: ActionSheetItem[];
  cancelLabel?: string;
  onCancel?: () => void;
  /** Render the sheet without the fixed scrim — for specimen cards. */
  inline?: boolean;
  /**
   * Desktop specimen presentation: a 20rem panel instead of a full-width sheet.
   * IMPLIES `inline` — a panel is not a sheet, and a panel dropped inside a scrim that CSS
   * hides above 64 rem would render nothing at all.
   */
  panel?: boolean;
  className?: string;
}

export function ActionSheet({
  open = true, title, subtitle, note, items = [], cancelLabel = 'Annuler',
  onCancel, inline = false, panel: asPanel = false, className = '',
}: ActionSheetProps): JSX.Element | null {
  /* `panel` implique `inline` : voir la doc de la prop. */
  const estInline = inline || asPanel;
  const panelRef = useModalSurface({ open, onClose: onCancel, inline: estInline, initialFocus: 'first' });

  /* Filet de développement. La règle CSS « pas d'ActionSheet modale au-dessus de 64 rem » est
     tenue par `display:none`, donc muette : sans cet avertissement, un clic sur ⋯ ne produirait
     RIEN et la recherche commencerait par le composant. */
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    if (asPanel && !inline) {
      console.warn(
        '[ds] ActionSheet: `panel` implique `inline` — le panneau est rendu dans le flux, sans voile. '
        + 'Passe `inline` explicitement pour lever cet avertissement.',
      );
    }
    if (!open || estInline) return;
    if (typeof window === 'undefined' || !window.matchMedia(DESKTOP).matches) return;
    console.warn(
      '[ds] ActionSheet modale montée au-dessus de 64 rem : elle est INVISIBLE par construction '
      + '(.ds-scrim--sheet est en display:none). Doctrine ⋯ : sous 64 rem un menu ⋯ ouvre une '
      + 'ActionSheet, au-dessus il ouvre un Dropdown. Pour un spécimen desktop, passe `inline panel`.',
    );
  }, [open, estInline, asPanel, inline]);

  if (!open) return null;

  const panel = (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal={estInline ? undefined : 'true'}
      aria-label={typeof title === 'string' ? title : 'Actions'}
      className={cn('ds-actionsheet', asPanel && 'ds-actionsheet--panneau', className)}
    >
      <span className="ds-grip" aria-hidden="true" />
      {(title || subtitle) ? (
        <div className="ds-actionsheet__head">
          {title ? <span className="ds-actionsheet__title">{title}</span> : null}
          {subtitle ? <span className="ds-actionsheet__subtitle">{subtitle}</span> : null}
        </div>
      ) : null}
      {items.map((it, i) => (
        <button
          key={i}
          type="button"
          onClick={it.onSelect}
          className={cn('ds-actionsheet__item', it.danger && 'ds-actionsheet__item--danger', it.className)}
        >
          {it.icon}<span style={{ flex: 1 }}>{it.label}</span>
        </button>
      ))}
      {note ? <div className="ds-actionsheet__note">{note}</div> : null}
      <button type="button" className="ds-actionsheet__item ds-actionsheet__cancel" onClick={onCancel}>
        {cancelLabel}
      </button>
    </div>
  );

  if (estInline) return panel;
  return (
    <div className="ds-scrim ds-scrim--sheet" onClick={onCancel}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%' }}>{panel}</div>
    </div>
  );
}

import { forwardRef, useEffect, useId, useRef, useState } from 'react';
import type { HTMLAttributes, JSX, KeyboardEvent as ReactKeyboardEvent, ReactNode, Ref } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../icons/Icon';
import { Calendar } from './Calendar';

/**
 * Input-styled trigger (calendar icon) + Calendar in a popover (Dropdown mechanics:
 * outside click / Escape close). Single date. Same surface rule as Input.
 *
 * `forwardRef` : la ref externe est COMPOSÉE avec la ref interne (détection de clic
 * extérieur) sur le <span> racine — on n'a pas remplacé l'une par l'autre.
 * Le composant ne rend aucun champ natif visible : un <input type="hidden"> porte
 * `name` et la date au format ISO (YYYY-MM-DD), pour qu'une soumission de <form>
 * emporte la valeur. Pour react-hook-form, l'intégration se fait par <Controller> —
 * le composant est contrôlé (`value` / `onChange(Date)`).
 */
export interface DatePickerProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'onChange'> {
  value?: Date;
  onChange?: (date: Date) => void;
  placeholder?: string;
  /** BCP 47 tag. Default 'fr-FR'. */
  locale?: string;
  min?: Date;
  max?: Date;
  disabledDates?: Date[];
  /** 'page' (default) = on the layout (fill --secondary) · 'card' = inside a card (fill --background). */
  surface?: 'page' | 'card';
  invalid?: boolean;
  disabled?: boolean;
  /** Nom du champ soumis par le <form>. Sans lui, pas d'input caché : rien n'est soumis. */
  name?: string;
  /**
   * LE DÉCLENCHEUR COMPOSABLE — v0.3.1 — forme arbitrée : des props à étaler, pas de l'état seul.
   *
   * Un render-prop qui rend de l'état seul (`{open, toggle}`) ne suffit pas : le socle
   * NE TIENDRAIT PLUS L'ÉLÉMENT — pas de ref, donc pas de retour de focus sur Échap et
   * sur sélection ; pas de prise, donc pas d'ARIA. La forme éprouvée rend des PROPS À
   * ÉTALER : l'appelant dessine ce qu'il veut et étale `triggerProps` sur SON élément —
   * le socle récupère sa ref et pose l'ARIA lui-même, qui cesse d'être la charge de
   * l'app. Sans l'étalement, rien de tout ça ne marche : c'est le contrat.
   *
   * L'élément rendu doit être focusable — idéalement un `<button type="button">`.
   * `onKeyDown` n'ouvre que sur ArrowDown/ArrowUp (la convention des déclencheurs de
   * sélection) : Entrée et Espace passent par le `click` NATIF du bouton — les gérer
   * aussi au clavier doublerait la bascule. `disabled` reste la charge de l'appelant
   * sur son propre élément.
   */
  trigger?: (api: DatePickerTriggerApi) => ReactNode;
}

/** Ce que reçoit le render-prop `trigger` de DatePicker. */
export interface DatePickerTriggerApi {
  open: boolean;
  value?: Date;
  /** À étaler tel quel sur l'élément déclencheur — ref, clic, clavier, ARIA. */
  triggerProps: {
    /**
     * REF DE RAPPEL, ET C'EST CE QUI REND L'ÉTALEMENT NU POSSIBLE. Un `RefObject<HTMLElement>`
     * n'est pas assignable au `ref` d'un `<button>` — `HTMLElement` n'est pas `HTMLButtonElement`,
     * et un objet de ref est INVARIANT sur son contenu. L'appelant aurait dû caster, et la doc
     * aurait dû montrer le cast alors qu'elle présente l'étalement nu comme LE contrat.
     * Une ref de RAPPEL, elle, est contravariante sur son paramètre : `(node: HTMLElement | null)`
     * accepte n'importe quelle balise, et le socle continue de tenir l'élément.
     */
    ref: (node: HTMLElement | null) => void;
    onClick: () => void;
    onKeyDown: (e: ReactKeyboardEvent<HTMLElement>) => void;
    'aria-haspopup': 'dialog';
    'aria-expanded': boolean;
    'aria-controls'?: string;
  };
}

/* La date au format de soumission — local, pas UTC : toISOString() décalerait d'un
   jour les dates saisies après 22h en Europe. */
function iso(d: Date): string {
  const p = (n: number): string => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export const DatePicker = forwardRef<HTMLSpanElement, DatePickerProps>(function DatePicker({
  value, onChange, placeholder = 'Choisir une date', locale = 'fr-FR', min, max,
  disabledDates, surface = 'page', invalid = false, disabled = false, name, trigger,
  className = '', ...rest
}: DatePickerProps, refExterne: Ref<HTMLSpanElement>): JSX.Element {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement | null>(null);
  /* HTMLElement, plus HTMLButtonElement : avec `trigger`, l'élément est celui de
     l'appelant — la ref ne présume plus de sa balise, elle ne sert qu'au focus. */
  const triggerRef = useRef<HTMLElement | null>(null);
  const popId = useId();
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    /* Échap rend le focus au déclencheur : le popover disparaît sous le focus, qui
       repartirait sinon du début du document. Le clic extérieur, lui, ne le vole pas —
       l'utilisateur vient de cliquer ailleurs. */
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); triggerRef.current?.focus(); } };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open]);
  const fmt = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' });
  const poserRefs = (node: HTMLSpanElement | null): void => {
    ref.current = node;
    if (typeof refExterne === 'function') refExterne(node);
    else if (refExterne) (refExterne as { current: HTMLSpanElement | null }).current = node;
  };
  /* UN SEUL JEU DE PROPS DE DÉCLENCHEUR — étalé par le bouton par défaut ET donné tel
     quel au render-prop `trigger` : les deux chemins ne peuvent pas diverger, c'est le
     point (même construction que `rendreEntree` dans Sidebar). */
  const triggerProps: DatePickerTriggerApi['triggerProps'] = {
    ref: (node: HTMLElement | null): void => { triggerRef.current = node; },
    onClick: () => setOpen(o => !o),
    onKeyDown: (e: ReactKeyboardEvent<HTMLElement>) => {
      if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) { e.preventDefault(); setOpen(true); }
    },
    'aria-haspopup': 'dialog',
    'aria-expanded': open,
    /* Pointer un id non rendu serait un lien mort pour le lecteur d'écran : la prop
       n'existe que quand le popover existe. */
    'aria-controls': open ? popId : undefined,
  };
  return (
    <span className={cn('ds-datepicker', className)} ref={poserRefs} {...rest}>
      {trigger ? trigger({ open, value, triggerProps }) : (
        <button
          {...triggerProps}
          type="button"
          disabled={disabled}
          className={cn('ds-input', 'ds-datepicker__trigger', surface === 'card' && 'ds-input--on-card', invalid && 'is-error')}
        >
          <span className={value ? '' : 'ds-datepicker__ph'}>{value ? fmt.format(value) : placeholder}</span>
          {/* Sans taille : le créneau du déclencheur rend 1rem (patterns.css, v0.3.0). */}
          <Icon name="calendar" />
        </button>
      )}
      {name ? <input type="hidden" name={name} value={value ? iso(value) : ''} /> : null}
      {open ? (
        <span id={popId} className="ds-datepicker__pop" role="dialog" aria-label="Choisir une date">
          <Calendar
            bare
            value={value}
            min={min}
            max={max}
            disabledDates={disabledDates}
            locale={locale}
            onChange={d => { onChange && onChange(d); setOpen(false); triggerRef.current?.focus(); }}
          />
        </span>
      ) : null}
    </span>
  );
});
DatePicker.displayName = 'DatePicker';

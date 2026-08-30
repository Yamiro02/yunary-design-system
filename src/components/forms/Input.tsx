import { forwardRef } from 'react';
import type { InputHTMLAttributes, JSX } from 'react';
import { cn } from '../../lib/cn';

/**
 * Single-line text field on the shared control rail, aligned with Button and the Select trigger.
 * Focus = the border turns --ring — ONE border, never an extra ring. Never a pill.
 * `forwardRef` : la ref atteint l'<input> natif — c'est ce qui rend le champ utilisable
 * avec une bibliothèque de formulaires (register() de react-hook-form pose une ref).
 */
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  /** Red border + 3px destructive ring. Always pair with an error message. */
  invalid?: boolean;
  /** 'page' (default) = sits directly on the layout (fill --secondary, like navbar/tabs/search) · 'card' = inside a card (fill --background). */
  surface?: 'page' | 'card';
  /**
   * L'unité du champ — « kg », « € », « min » — posée DANS le champ, à droite, en
   * sourdine (v0.3.0). Trois caractères au plus : le
   * padding réservé est fixe (--space-7) ; plus long, c'est un suffixe de libellé, pas
   * une unité. `aria-hidden` : c'est au libellé du FormField de la nommer.
   */
  unit?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({
  size = 'md', invalid = false, surface = 'page', unit, className = '', ...rest
}: InputProps, ref): JSX.Element {
  // surface: 'page' (default) = the input sits directly on the layout (fill --secondary) · 'card' = inside a card (fill --background).
  // Since the surface-inference rule in patterns.css, a field inside a Card, Modal, ActionSheet, Dropdown or DatePicker pop deduces --background by itself — the prop is only needed for other containers.
  /* Le rail passe par des classes, jamais par un style inline : `--control-sm`
     aliase `--control-md` depuis le rail unique, mais la classe reste pour l'API
     et pour le jour où le rail redivergerait. */
  const cls = cn(
    'ds-input',
    size !== 'md' && 'ds-input--' + size,
    surface === 'card' && 'ds-input--on-card',
    invalid && 'is-error',
    className,
  );
  const champ = <input ref={ref} className={cls} aria-invalid={invalid || undefined} {...rest} />;
  if (!unit) return champ;
  /* L'enveloppe n'existe QUE si `unit` est passé : sans elle, le DOM d'hier — un <input>
     nu — ne bouge pas d'un nœud. */
  return (
    <span className="ds-input-unit">
      {champ}
      <span className="ds-input-unit__label" aria-hidden="true">{unit}</span>
    </span>
  );
});
Input.displayName = 'Input';

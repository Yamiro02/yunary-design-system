import { forwardRef, useEffect, useRef } from 'react';
import type { InputHTMLAttributes, JSX, ReactNode, Ref } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../icons/Icon';

/** Checkbox with a Lucide check (stroke-width 3). Box radius = half of --radius-sm.
 *  `forwardRef` : la ref atteint l'<input type="checkbox"> natif (react-hook-form).
 *  `indeterminate` : l'état « à moitié coché » d'une case d'en-tête de sélection multiple.
 *  C'est une PROPRIÉTÉ DOM, pas un attribut — elle se pose via une ref, composée avec la
 *  ref externe. Rendu : un trait (minus) à la place de la coche, aria-checked="mixed". */
export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: ReactNode;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox({
  label, checked, defaultChecked, indeterminate = false, disabled = false, className = '', ...rest
}: CheckboxProps, refExterne: Ref<HTMLInputElement>): JSX.Element {
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);
  const poserRefs = (node: HTMLInputElement | null): void => {
    inputRef.current = node;
    if (node) node.indeterminate = indeterminate;
    if (typeof refExterne === 'function') refExterne(node);
    else if (refExterne) (refExterne as { current: HTMLInputElement | null }).current = node;
  };
  return (
    <label className={cn('ds-choice', indeterminate && 'is-indeterminate', disabled && 'is-disabled', className)}>
      <input
        ref={poserRefs}
        type="checkbox"
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        aria-checked={indeterminate ? 'mixed' : undefined}
        {...rest}
      />
      <span className="ds-choice__box">
        <Icon name={indeterminate ? 'minus' : 'check'} size="0.8125rem" strokeWidth={3} />
      </span>
      {label ? <span>{label}</span> : null}
    </label>
  );
});
Checkbox.displayName = 'Checkbox';

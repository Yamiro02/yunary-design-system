import { useEffect, useState } from 'react';
import type { HTMLAttributes, JSX } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../icons/Icon';

/**
 * Month view, Monday-first, fr locale by default. Native Date + Intl only.
 * Selected day = --primary fill; today = --primary bold. Single date — no range.
 */
export interface CalendarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: Date;
  onChange?: (date: Date) => void;
  min?: Date;
  max?: Date;
  disabledDates?: Date[];
  /** BCP 47 tag. Default 'fr-FR'. */
  locale?: string;
  /** Strips the card chrome (used inside DatePicker's popover). */
  bare?: boolean;
}

const strip = (d?: Date | null): Date | null =>
  d ? new Date(d.getFullYear(), d.getMonth(), d.getDate()) : null;
const key = (d?: Date | null): string =>
  d ? d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate() : '';

export function Calendar({
  value, onChange, min, max, disabledDates = [], locale = 'fr-FR', bare = false, className = '', ...rest
}: CalendarProps): JSX.Element {
  const today = strip(new Date())!;
  const [view, setView] = useState(() => { const b = value || today; return new Date(b.getFullYear(), b.getMonth(), 1); });
  useEffect(() => { if (value) setView(new Date(value.getFullYear(), value.getMonth(), 1)); }, [key(value)]);
  const fmtMonth = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' });
  const fmtDay = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  // Monday-first headers — 2024-01-01 is a Monday
  const heads = Array.from({ length: 7 }, (_, i) => fmtDay.format(new Date(2024, 0, 1 + i)).replace('.', ''));
  const offset = (new Date(view.getFullYear(), view.getMonth(), 1).getDay() + 6) % 7;
  const count = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const badKeys = new Set(disabledDates.map(d => key(strip(d))));
  const lo = strip(min), hi = strip(max);
  const isDisabled = (d: Date) => (!!lo && d < lo) || (!!hi && d > hi) || badKeys.has(key(d));
  const move = (m?: number, y?: number) => setView(v => new Date(v.getFullYear() + (y || 0), v.getMonth() + (m || 0), 1));
  const selKey = key(strip(value));
  return (
    <div className={cn('ds-cal', bare && 'ds-cal--bare', className)} {...rest}>
      <div className="ds-cal__head">
        <button type="button" className="ds-cal__nav" aria-label="Année précédente" onClick={() => move(0, -1)}><Icon name="chevrons-left" size="1rem" /></button>
        <button type="button" className="ds-cal__nav" aria-label="Mois précédent" onClick={() => move(-1, 0)}><Icon name="chevron-left" size="1rem" /></button>
        <span className="ds-cal__label" aria-live="polite">{fmtMonth.format(view)}</span>
        <button type="button" className="ds-cal__nav" aria-label="Mois suivant" onClick={() => move(1, 0)}><Icon name="chevron-right" size="1rem" /></button>
        <button type="button" className="ds-cal__nav" aria-label="Année suivante" onClick={() => move(0, 1)}><Icon name="chevrons-right" size="1rem" /></button>
      </div>
      <div className="ds-cal__grid" role="grid">
        {heads.map(h => <span key={h} className="ds-cal__wd">{h}</span>)}
        {Array.from({ length: offset }, (_, i) => <span key={'b' + i} />)}
        {Array.from({ length: count }, (_, i) => {
          const d = new Date(view.getFullYear(), view.getMonth(), i + 1);
          const k = key(d);
          const cls = cn('ds-cal__day', k === selKey && 'is-selected', k === key(today) && 'is-today');
          return (
            <button
              key={k}
              type="button"
              className={cls}
              disabled={isDisabled(d)}
              aria-pressed={k === selKey || undefined}
              onClick={() => onChange && onChange(d)}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

import type { CSSProperties, ReactNode } from 'react';
import { Card } from '@yunary/ds';

/* Échafaudage de la vitrine — assemblé uniquement avec les composants du DS et
   les utilitaires du preset (qui ne résolvent que vers des var(--…)). */

export function Section({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-space-4">
      <div className="flex flex-col gap-space-1">
        <h2>{title}</h2>
        {note ? <p className="caption">{note}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function Block({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <Card className="flex flex-col gap-space-4">
      <div className="flex flex-col gap-space-1">
        <span className="eyebrow">{label}</span>
        {hint ? <span className="caption">{hint}</span> : null}
      </div>
      <div className="flex flex-col gap-space-4">{children}</div>
    </Card>
  );
}

export function Row({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-space-2">
      {label ? <span className="chip text-text-muted">{label}</span> : null}
      <div className="flex flex-wrap items-center gap-space-3">{children}</div>
    </div>
  );
}

export function Stack({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-space-2">
      {label ? <span className="chip text-text-muted">{label}</span> : null}
      <div className="flex flex-col gap-space-3">{children}</div>
    </div>
  );
}

export function Grid({ cols = 3, children }: { cols?: 2 | 3 | 4; children: ReactNode }) {
  const map = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-2 lg:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' };
  return <div className={`grid grid-cols-1 gap-space-5 ${map[cols]}`}>{children}</div>;
}

/** Pastille de couleur — la valeur affichée est le nom du token, jamais un littéral. */
export function Swatch({ token, name, border }: { token: string; name?: string; border?: boolean }) {
  const style: CSSProperties = { background: `var(${token})` };
  return (
    <div className="flex min-w-0 flex-col gap-space-2">
      <span
        className={`h-space-7 w-full rounded-md ${border ? 'border border-border' : ''}`}
        style={style}
      />
      <span className="mono text-caption text-text-muted truncate">{name ?? token}</span>
    </div>
  );
}

/** Ligne de spécification : le nom du token, puis son aperçu. */
export function Spec({ token, children }: { token: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-space-2">
      <span className="mono text-caption text-text-muted">{token}</span>
      <div className="flex min-w-0 flex-wrap items-center gap-space-3">{children}</div>
    </div>
  );
}

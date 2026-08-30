import type { JSX, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Logo } from '../brand/Logo';

/** Site footer: mark, location line, link columns, social row. */
export interface FooterColumn { title: string; links: { label: string; href?: string }[] }

export interface FooterProps {
  columns?: FooterColumn[];
  social?: ReactNode;
  /** La marque. Défaut : le `Logo` du paquet. Un projet passe la sienne. */
  brand?: ReactNode;
  /** Force la couleur des lettres du `Logo` par défaut — voir `LogoProps.letters`.
   *  Sans effet si vous passez votre propre `brand`. */
  letters?: 'dark' | 'light';
  /**
   * Ligne de lieu / signature, sous la marque. Le point médian sert de séparateur.
   * AUCUNE valeur par défaut : elle portait une ville en dur, dans un composant du SOCLE —
   * un projet ne pouvait pas la retirer sans passer une chaîne vide. Omise, la ligne n'est
   * pas rendue du tout.
   */
  note?: string;
  className?: string;
}

export function Footer({
  columns = [], social, brand, letters, note, className = '',
}: FooterProps): JSX.Element {
  return (
    <footer className={cn('ds-footer', className)}>
      <div className="page ds-footer__inner">
        <div className="ds-footer__brand">
          {brand ?? <Logo variant="wordmark" letters={letters} height="1.25rem" />}
          {note ? <p className="ds-footer__note">{note}</p> : null}
        </div>
        <div className="ds-footer__cols">
          {columns.map(col => (
            <div key={col.title} className="ds-footer__col">
              <span className="eyebrow">{col.title}</span>
              {col.links.map(l => (
                <a key={l.label} href={l.href || '#'} className="ds-footer__link">
                  {l.label}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
      {social ? (
        <div className="page ds-footer__social">
          {social}
        </div>
      ) : null}
    </footer>
  );
}

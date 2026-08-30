import { useEffect, useState } from 'react';
import type { JSX, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Logo } from '../brand/Logo';
import { BRAND_NAME } from '../../brand';

/**
 * Sticky top bar: logo left, links centre, CTA right. Sits on --secondary with a
 * hairline bottom border AT ALL TIMES — it is a control detached from the layout,
 * never transparent. On scroll it tints (color-mix on --secondary), adds
 * backdrop-filter blur(10px) and a shadow. Blur is the only place the system uses
 * backdrop-filter. No glassmorphism anywhere else.
 */
export interface NavLink { label: string; href?: string; active?: boolean }

export interface NavbarProps {
  links?: NavLink[];
  cta?: ReactNode;
  /**
   * La marque, à gauche. Défaut : le `Logo` du paquet, à la bonne hauteur.
   * Un projet passe la sienne ici — mot-marque, image, ce qu'il veut — sans ouvrir le socle.
   */
  brand?: ReactNode;
  /** Cible du lien de marque. Défaut '#'. */
  homeHref?: string;
  /** Libellé accessible du lien de marque. Défaut : `BRAND_NAME` de `src/brand.ts`, suivi
   *  de « — accueil ». Aucun nom n'est écrit en dur ici. */
  homeLabel?: string;
  /** Force la couleur des lettres du `Logo` par défaut — voir `LogoProps.letters`.
   *  Sans effet si vous passez votre propre `brand`. */
  letters?: 'dark' | 'light';
  /** Force the scrolled state (specimen cards / screenshots). */
  scrolled?: boolean;
  className?: string;
  /** Rendu dans l'emplacement de DROITE, juste AVANT `cta` — pour poser une action de plus
   *  (bascule de thème, sélecteur de langue) sans avoir à remplacer le CTA. */
  children?: ReactNode;
}

export function Navbar({
  links = [], cta, brand, homeHref = '#', homeLabel = BRAND_NAME + ' — accueil', letters,
  scrolled: forced, className = '', children,
}: NavbarProps): JSX.Element {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    if (forced !== undefined) return;
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [forced]);
  const isScrolled = forced !== undefined ? forced : scrolled;
  return (
    <header className={cn('ds-navbar', isScrolled && 'is-scrolled', className)}>
      <div className="page ds-navbar__inner">
        <a href={homeHref} aria-label={homeLabel}>
          {brand ?? <Logo variant="wordmark" letters={letters} height="1.375rem" />}
        </a>
        <nav className="ds-navbar__links">
          {links.map(l => (
            <a key={l.label} href={l.href || '#'} className={cn('ds-navlink', l.active && 'is-active')}>{l.label}</a>
          ))}
        </nav>
        <div className="ds-navbar__cta">{children}{cta}</div>
      </div>
    </header>
  );
}

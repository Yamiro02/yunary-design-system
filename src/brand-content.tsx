/**
 * ══════════════════════════════════════════════════════════════════════════════
 * EXTENSION MÉTIER — le pendant JavaScript de `brand-content.css`.
 * OPTIONNELLE. Une app d'interface ne l'importe pas.
 *
 *     import { HaloHot, ContentIcon } from '@yunary/ds/brand-content';
 *     // et, côté CSS de l'app :
 *     @import "@yunary/ds/brand-content.css";
 *
 * Rien ici ne sert à faire un écran. Ces deux-là servent à fabriquer un VISUEL :
 * une vignette YouTube, une carte de motion design, un export social. Ils lisent les
 * trois jetons du contrat de `brand-content.css` — sans ce CSS, ils rendent des boîtes
 * vides, et c'est le comportement voulu : un manque doit se voir.
 * ══════════════════════════════════════════════════════════════════════════════
 */
import type { LucideIcon } from 'lucide-react';
import { Instagram, Youtube } from './components/icons/brand-glyphs';
import type { CSSProperties, JSX } from 'react';
import { Glyph, type GlyphProps } from './components/icons/Icon';
import { Halo, type HaloProps } from './components/brand/Halo';

/**
 * Le halo CHAUD des miniatures — l'ancien `<Halo hot />`. Il ne pouvait pas rester une
 * prop du socle : c'était la seule prop d'un composant d'interface à lire un jeton métier.
 */
export interface HaloHotProps extends Omit<HaloProps, 'placement'> {}

export function HaloHot({ style, ...rest }: HaloHotProps): JSX.Element {
  const base: CSSProperties = { background: 'var(--gradient-thumbnail)', ...style };
  return <Halo style={base} {...rest} />;
}

/**
 * Les icônes de PLATEFORME. Elles ont quitté `Icon` : un design system générique n'a
 * aucune raison d'embarquer YouTube et Instagram, et leurs tracés pesaient dans le
 * bundle de toute app qui importait `Icon`, qu'elle s'en serve ou non.
 * `github` est resté dans `Icon` : c'est une plateforme de développement, présente à peu
 * près partout dans un produit technique.
 */
export type ContentIconName = 'youtube' | 'instagram';

const CONTENT_ICONS: Record<ContentIconName, LucideIcon> = {
  'youtube': Youtube,
  'instagram': Instagram,
};

export interface ContentIconProps extends Omit<GlyphProps, 'glyph'> { name: ContentIconName }

export function ContentIcon({ name, ...rest }: ContentIconProps): JSX.Element | null {
  const glyph = CONTENT_ICONS[name];
  return glyph ? <Glyph glyph={glyph} {...rest} /> : null;
}

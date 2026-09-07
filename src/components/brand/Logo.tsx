import type { CSSProperties, HTMLAttributes, JSX, ReactNode } from 'react';
import { cn } from '../../lib/cn';
/* BRAND_MONOGRAM n'est plus importé : l'icône vectorielle remplace le monogramme TEXTUEL,
   et le libellé accessible de la variante `monogram` retombe sur le mot-marque complet. */
import { BRAND_WORDMARK_LINES } from '../../brand';

/**
 * La marque Yunary — MARK VECTORIEL (livrable optionnel n° 6 du portage).
 *
 * Le mark CSS du socle (capitales + pastille carrée en dégradé) est remplacé par
 * l'icône Yunary : le Y en squircle, dégradé de marque, posé DEVANT le mot-marque —
 * l'ordre du lockup officiel. L'icône est inline (aucune requête, aucun asset à
 * résoudre par le bundler) et garde ses couleurs propres sur tous les fonds ; seules
 * les LETTRES s'inversent avec la surface, comme avant.
 *
 * L'API du socle est CONSERVÉE : `variant` / `letters` / `height` / `wordmark` /
 * `monogram` / `dot` / `label`. `dot` garde son contrat (undefined = le mark par
 * défaut — ici l'icône ; false = aucun ; un nœud = le vôtre) mais le mark se place
 * désormais AVANT les lettres. `variant="monogram"` rend l'icône seule.
 *
 * LE LOCKUP (v0.1.1) : dans `wordmark` et `stacked`, l'icône est PLUS GRANDE que le mot —
 * 44 px d'icône pour un mot à 30 px sur les maquettes d'auth, soit LOCKUP_MARK_SCALE fois
 * le corps des lettres — et centrée verticalement sur lui. `height` calibre le MOT (sa
 * valeur n'a pas bougé d'une version à l'autre) ; l'icône en découle. En `monogram`,
 * l'icône seule garde exactement sa taille d'avant (les maquettes C1 la posent ainsi).
 *
 * Le fichier de marque neutralise la pastille du socle (.ds-logo__dot{display:none})
 * pour qu'aucun rendu par défaut ne la réintroduise.
 */
export interface LogoProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'wordmark' | 'stacked' | 'monogram';
  /** Force la couleur des LETTRES : dark = lettres sombres, light = lettres claires.
   *  Omise, elles suivent --foreground. L'icône, elle, ne s'inverse jamais. */
  letters?: 'dark' | 'light';
  /** Longueur CSS, toujours en rem — hauteur totale de la marque. */
  height?: string;
  /** Le mot-marque. Défaut : BRAND_WORDMARK_LINES de src/brand.ts. */
  wordmark?: string | readonly string[];
  /** Conservé pour l'API — le monogramme TEXTUEL n'est plus rendu (l'icône le remplace),
   *  mais il reste le libellé accessible de la variante monogram. */
  monogram?: string;
  /** Le mark. false le retire ; un nœud le remplace. Défaut : l'icône Yunary. */
  dot?: ReactNode | false;
  /** Libellé accessible. Défaut : le mot-marque, mots joints par une espace. */
  label?: string;
}

/* Le ratio du lockup officiel : icône 44 px pour un mot-marque à 1,875 rem (maquettes
   A1-A4 du Hub). Une seule constante, lue par le seul rendu qui compose icône + mot. */
const LOCKUP_MARK_SCALE = 44 / 30;

/** L'icône Yunary, inline — viewBox du fichier maître logos/yunary-icon.svg. */
function IconMark({ style }: { style?: CSSProperties }): JSX.Element {
  return (
    <svg
      viewBox="558 478 580 580"
      aria-hidden="true"
      focusable="false"
      style={{ height: '1em', width: 'auto', display: 'block', flex: 'none', ...style }}
    >
      <defs>
        <linearGradient id="yunary-mark-grad" gradientUnits="userSpaceOnUse" x1="620" y1="530" x2="1075" y2="1006">
          <stop offset="0" stopColor="#F5A524" />
          <stop offset="0.5" stopColor="#F08029" />
          <stop offset="1" stopColor="#E84C3D" />
        </linearGradient>
      </defs>
      <g transform="matrix(1,0,0,0.94827,0,39.75)">
        <path fill="url(#yunary-mark-grad)" d="M725.655 502.39C732.272 501.455 751.087 501.791 758.221 501.79L816.931 501.779L914.699 501.755C936.184 501.759 965.165 500.705 985.671 504.61C1006.43 508.726 1025.99 517.503 1042.87 530.28C1073.93 553.662 1094.33 588.526 1099.49 627.066C1101.73 643.825 1101.01 664.789 1100.97 682L1100.77 761.754L1100.92 853.637C1100.93 873.473 1101.84 898.208 1098.36 917.305C1094 940.174 1084.4 961.722 1070.31 980.255C1044.79 1013.34 1010.7 1029.67 970.236 1034.72C957.384 1035.8 937.853 1035.4 924.688 1035.39L850.666 1035.26L772.815 1035.22C752.212 1035.19 727.668 1036.05 707.749 1032.14C686.605 1027.84 666.737 1018.73 649.692 1005.5C619.711 982.086 600.265 947.718 595.634 909.962C593.428 892.863 594.078 871.115 594.098 853.51L594.158 772.971L594.068 687.991C594.014 665.718 592.829 640.699 596.964 618.982C601.284 596.366 610.926 575.104 625.092 556.953C651.186 523.62 684.421 507.471 725.655 502.39Z" />
        <path fill="#fff" d="M697.045 676.212C700.269 675.97 703.779 675.889 706.988 676.408C710.39 676.958 713.447 678.296 716.397 680.027C729.912 687.954 818.762 747.738 823.404 754.613C828.281 761.835 830.197 769.617 828.477 778.279C827.43 783.557 825.059 787.761 821.533 791.747C810.817 803.862 780.342 822.075 765.66 832.107C752.435 841.423 728.442 860.481 714.991 865.988C679.709 880.435 671.801 848.473 672.854 822.487C674.457 782.908 671.646 746.627 672.926 707.429C673.509 689.572 681.783 681.828 697.045 676.212Z" />
        <path fill="#fff" d="M839.772 669.323C861.003 669.296 990.072 667.147 1000.4 670.417C1005.6 672.066 1010.09 677.029 1012.16 681.951C1014.16 686.724 1014.25 691.547 1012.29 696.336C1009.32 703.607 1004.63 706.495 997.797 709.451L893.233 709.438C876.014 709.459 852.204 710.126 835.564 709.005C816.781 697.805 817.589 675.414 839.772 669.323Z" />
        <path fill="#fff" d="M912.133 749.1C932.954 747.342 975.993 748.815 998.147 749.567C1002.46 749.713 1008.12 754.698 1010.5 758.755C1013.44 763.666 1014.23 769.57 1012.68 775.08C1010.55 782.888 1005.49 786.136 998.991 789.664C976.371 792.059 948.76 788.349 926.268 790.094C895.564 792.476 886.656 761.222 912.133 749.1Z" />
        <path fill="#fff" d="M838.574 828.375C859.848 828.646 992.853 825.956 1003.05 830.861C1007.76 833.124 1011.05 837.211 1012.53 842.187C1014.06 847.355 1013.63 853.409 1011.03 858.166C1007.83 864.012 1002.92 866.641 996.814 868.456C977.567 868.706 842.343 870.225 834.001 866.492C829.395 864.431 825.818 860.247 824.097 855.562C822.164 850.3 822.16 843.833 824.77 838.797C827.789 832.97 832.653 830.354 838.574 828.375Z" />
      </g>
    </svg>
  );
}

export function Logo({
  variant = 'wordmark', letters, height = '1.75rem',
  wordmark = BRAND_WORDMARK_LINES, monogram, dot, label,
  className = '', style, ...rest
}: LogoProps): JSX.Element {
  const words = typeof wordmark === 'string' ? [wordmark] : [...wordmark];
  const name = label ?? words.join(' ');
  const accessible = monogram ?? name;
  const color = letters === 'light' ? 'var(--tone-light)' : letters === 'dark' ? 'var(--tone-dark)' : 'var(--foreground)';
  /* dot === undefined = le mark par défaut (l'icône) ; false = aucun ; sinon le nœud fourni. */
  /* Lockup : l'icône fait LOCKUP_MARK_SCALE fois le corps du mot, écart 0,33 em (10 px pour
     un mot à 30 px sur la maquette). Elle est centrée sur le mot par le conteneur. */
  const mark = dot === false ? null
    : dot === undefined ? <IconMark style={{ height: LOCKUP_MARK_SCALE + 'em', marginRight: '0.33em' }} />
    : dot;
  const base: CSSProperties = { fontSize: 'calc(' + height + ' * 1.25)', color, ...style };

  if (variant === 'monogram') {
    return (
      <span className={cn('ds-logo', className)} style={base} aria-label={accessible} role="img" {...rest}>
        {dot === false || dot === undefined ? <IconMark /> : dot}
      </span>
    );
  }
  if (variant === 'stacked') {
    return (
      <span
        className={cn('ds-logo', className)}
        style={{ ...base, flexDirection: 'column', alignItems: 'flex-start', gap: '0.08em' }}
        aria-label={name}
        {...rest}
      >
        {mark}
        {words.map((w) => <span key={w}>{w}</span>)}
      </span>
    );
  }
  /* `.ds-logo` aligne en bas (flex-end) — juste pour une pastille posée sur la ligne de base ;
     une icône plus haute que le mot se centre, comme sur les maquettes. */
  return (
    <span className={cn('ds-logo', className)} style={{ ...base, alignItems: 'center' }} aria-label={name} {...rest}>
      {mark}{words.join(' ')}
    </span>
  );
}

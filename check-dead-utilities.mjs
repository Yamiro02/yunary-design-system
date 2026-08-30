#!/usr/bin/env node
/**
 * Filet des CLASSES MORTES — aucune classe écrite ne doit appartenir à une échelle que
 * `theme.css` a supprimée.
 *
 * LE DÉFAUT QU'IL FERME, ET POURQUOI IL EST MUET. `theme.css` pose `--text-*: initial`,
 * `--tracking-*: initial` et `--radius-*: initial` pour vider les échelles natives de
 * Tailwind avant d'écrire celles du système. C'est VOULU — seuls les paliers sémantiques
 * du DS existent, une régression casse au lieu de dériver. Mais la conséquence est qu'une
 * classe native survivante ne produit **aucune règle** : elle n'est pas en erreur, elle
 * est INERTE. Ni tsc, ni le lint, ni le build, ni le navigateur ne le disent. Le nœud
 * hérite simplement de son parent, et l'écran est juste faux.
 *
 * Deux défauts réels, attestés, dans deux apps différentes :
 *   · `tracking-widest` écrit pour traduire `var(--tracking-display)`. Ce ne sont pas
 *     deux valeurs voisines, c'est le SIGNE INVERSE : le socle pose -0.02em (une display
 *     est serrée), le plus large de l'échelle native vaut +0.1em. Il n'existe aucune
 *     valeur « proche » à choisir. Il s'est vu à l'œil, aucun contrôle ne l'a attrapé ;
 *   · `tracking-normal` écrit pour « remettre à zéro ». Il disait vrai jusqu'à la
 *     0.2.0 ; depuis, l'échelle native est supprimée ENTIÈRE, `normal` compris. La
 *     classe ne remet plus rien à zéro, elle laisse hériter. Une remise à zéro s'écrit
 *     désormais en littéral : `tracking-[0em]`.
 *
 * ⚠️ LA LISTE DES CLASSES MORTES EST DÉRIVÉE, JAMAIS RECOPIÉE. C'est le point de
 * conception de ce garde. Elle se calcule à chaque appel :
 *
 *     mortes(ns) = entrées NATIVES de `--ns-*`  −  entrées que notre theme.css redéclare
 *
 * Une liste en dur périmerait au premier changement de `theme.css` — et un garde périmé
 * qui reste vert est exactement le défaut qu'on essaie d'empêcher, une couche plus haut.
 *
 * ⚠️ CE QUI SURVIT, ET QU'IL NE FAUT PAS FAIRE TOMBER. La dérivation le donne
 * gratuitement, mais c'est le premier endroit où un garde naïf produit des faux positifs,
 * donc c'est ÉPINGLÉ dans le jumeau de falsification plus bas :
 *   · `text-primary`, `text-muted` — l'utilitaire `text-` lit DEUX espaces de noms, les
 *     tailles (`--text-*`) et les couleurs (`--color-*`). Seule l'échelle de TAILLES est
 *     morte. Les couleurs rendent ;
 *   · `text-shadow-lg` — `--text-shadow-*` est un espace de noms À PART, que
 *     `--text-*: initial` ne touche pas (Tailwind résout le plus long). Mesuré ;
 *   · `rounded-full`, `rounded-none` — ce sont des VALEURS STATIQUES de l'utilitaire, pas
 *     des entrées de l'espace de noms `--radius-*`. Elles ne peuvent donc pas mourir avec
 *     lui. Mesuré aussi.
 *
 * NÉ DANS UNE APP, versé au squelette. Il vivait dans les tests d'architecture d'une app
 * consommatrice, sous vitest, avec sa liste native écrite à la main. La version du
 * squelette la DÉRIVE, et **une app peut pointer le garde sur son propre `src/`** —
 * c'est la moitié de l'intérêt de le tenir ici. Un design system né de ce gabarit
 * l'emporte avec lui : chaque projet l'a à son premier commit.
 *
 * Usage : node check-dead-utilities.mjs [dossier…]      (défaut : src demo/src)
 *         THEME=<chemin> TAILWIND_THEME=<chemin> node check-dead-utilities.mjs src
 */
import fs from 'node:fs';
import path from 'node:path';

const RACINES = process.argv.slice(2).length ? process.argv.slice(2) : ['src', 'demo/src'];
const EXTENSIONS = /\.(?:tsx?|jsx?|mjs)$/;

/* Le socle depuis sa racine, ou depuis une app qui l'a installé. */
const THEME = process.env.THEME || [
  'src/styles/theme.css',
  'node_modules/@acme/ds/src/styles/theme.css',
].find(p => fs.existsSync(p));
const AMONT = process.env.TAILWIND_THEME || 'node_modules/tailwindcss/theme.css';

/* ══════════════════════════════════════════════════════════════════════════════
 * ESPACE DE NOMS → UTILITAIRES. La seule table écrite à la main, et elle est courte.
 * ══════════════════════════════════════════════════════════════════════════════
 * Elle ne dit pas QUELLES classes sont mortes — ça, c'est dérivé. Elle dit seulement
 * comment un espace de noms s'écrit en utilitaire, ce que le CSS ne porte nulle part.
 * Même forme, et même prix, que la table de `check-utility-collisions.mjs` : ajouter un
 * `--x-*: initial` à theme.css demande d'ajouter sa ligne ici. Le garde le RÉCLAME (il
 * échoue), il ne l'ignore pas en silence.
 *
 * `sous` : les espaces de noms PLUS LONGS que `--<ns>-*: initial` ne touche pas, parce
 * que Tailwind résout le plus long. `--text-shadow-lg` appartient à `text-shadow`, pas à
 * `text` — sans cette ligne le garde condamnerait `text-shadow-lg`, qui rend.
 */
const NAMESPACES = {
  text: { prefixes: ['text'], sous: ['shadow'] },
  tracking: { prefixes: ['tracking'], sous: [] },
  radius: {
    prefixes: [
      'rounded', 'rounded-t', 'rounded-r', 'rounded-b', 'rounded-l',
      'rounded-tl', 'rounded-tr', 'rounded-br', 'rounded-bl',
      'rounded-s', 'rounded-e', 'rounded-ss', 'rounded-se', 'rounded-ee', 'rounded-es',
    ],
    sous: [],
  },
};

/* ══════════════════════════════════════════════════════════════════════════════
 * LA DÉRIVATION.
 * ══════════════════════════════════════════════════════════════════════════════ */

/** Les entrées `--<ns>-<entrée>` déclarées dans une feuille, hors modificateurs. */
function entrees(css, ns, sous) {
  const out = new Set();
  for (const m of css.matchAll(new RegExp(`^\\s*--${ns}-([a-z0-9-]+)\\s*:`, 'gim'))) {
    const nom = m[1];
    /* `--text-sm--line-height` est un MODIFICATEUR du palier, pas un palier : il ne
       produit aucune classe. Le `--` interne le trahit, et c'est le seul signe — la
       capture le ramasse parce que le tiret fait partie d'un nom d'entrée légitime
       (`display-xl`, `heading-sm`). Sans cette ligne, le garde condamnait onze classes
       que personne n'écrira jamais, et son décompte mentait. */
    if (nom.includes('--')) continue;
    if (sous.some(s => nom === s || nom.startsWith(s + '-'))) continue;
    out.add(nom);
  }
  return out;
}

/** L'entrée NUE — `--radius: …` sans suffixe. Elle porte l'utilitaire nu (`rounded`). */
function aEntreeNue(css, ns) {
  return new RegExp(`^\\s*--${ns}\\s*:`, 'im').test(css);
}

function deriver(notre, amont) {
  const resets = [...notre.matchAll(/^\s*--([a-z-]+)-\*\s*:\s*initial\s*;/gim)].map(m => m[1]);
  const inconnus = resets.filter(ns => !NAMESPACES[ns]);
  if (inconnus.length) {
    console.error(`\n✗ classes mortes — theme.css vide ${inconnus.map(n => `\`--${n}-*\``).join(', ')},`
      + ` que ce garde ne sait pas traduire en utilitaire.\n`
      + `  Ajoute sa ligne à NAMESPACES (espace de noms -> préfixes d'utilitaire). C'est le\n`
      + `  prix d'une table courte, et c'est le bon : un garde qui ignore en silence un\n`
      + `  espace de noms neuf laisse passer exactement ce qu'il est là pour attraper.\n`);
    process.exit(1);
  }
  /* classe morte -> l'espace de noms qui l'a tuée (pour le message d'erreur) */
  const mortes = new Map();
  for (const ns of resets) {
    const { prefixes, sous } = NAMESPACES[ns];
    const vivantes = entrees(notre, ns, sous);
    for (const entree of entrees(amont, ns, sous)) {
      if (vivantes.has(entree)) continue;
      for (const p of prefixes) mortes.set(`${p}-${entree}`, ns);
    }
    if (aEntreeNue(amont, ns) && !aEntreeNue(notre, ns))
      for (const p of prefixes) mortes.set(p, ns);
  }
  return mortes;
}

/* ══════════════════════════════════════════════════════════════════════════════
 * LE JUMEAU DE FALSIFICATION — il tourne à chaque appel, avant le scan.
 * ══════════════════════════════════════════════════════════════════════════════
 * Deux moitiés, et les deux comptent.
 *   1 · la DÉRIVATION rend bien ce qu'une compilation Tailwind réelle rend muet, et
 *       épargne bien ce qu'elle rend. Chaque ligne ci-dessous a été mesurée sur
 *       tailwindcss 4.3.3, pas déduite.
 *   2 · le RÉDUCTEUR de variantes ramène `md:text-sm` et `!text-sm` à `text-sm`.
 * Un garde qui rend une liste vide passe au vert en ne prouvant rien ; celui-ci le dit.
 */
const ATTENDU_MORT = ['text-sm', 'text-base', 'text-lg', 'text-2xl', 'text-9xl',
  'tracking-normal', 'tracking-widest', 'tracking-tighter',
  'rounded', 'rounded-3xl', 'rounded-4xl', 'rounded-t-3xl', 'rounded-tl'];
const ATTENDU_VIVANT = ['text-primary', 'text-muted', 'text-heading', 'text-body-sm',
  'text-shadow-lg', 'tracking-display', 'tracking-chip',
  'rounded-full', 'rounded-none', 'rounded-lg', 'rounded-pill'];
const REDUCTIONS = [
  ['md:text-sm', 'text-sm'], ['!text-sm', 'text-sm'], ['dark:hover:text-sm', 'text-sm'],
  ['text-sm/6', 'text-sm'], ['text-[0.9375rem]', 'text-[0.9375rem]'],
  ['lg:text-[color:red]', 'text-[color:red]'],
];

/** Retire les variantes (`md:`, `hover:`), le `!` important et le modificateur `/…`. */
function classeNue(classe) {
  let c = classe;
  let avant;
  do { avant = c; c = c.replace(/^[a-zA-Z0-9@_.-]+(?:\[[^\]]*\])?:/, ''); } while (c !== avant);
  c = c.replace(/^!/, '');
  if (!c.includes('[')) c = c.replace(/\/[^/]*$/, '');
  return c;
}

function seProuver(mortes) {
  const ratés = [];
  for (const c of ATTENDU_MORT) if (!mortes.has(c)) ratés.push(`« ${c} » devrait être DÉRIVÉE MORTE, elle ne l'est pas`);
  for (const c of ATTENDU_VIVANT) if (mortes.has(c)) ratés.push(`« ${c} » est VIVANTE (mesuré), le garde la condamne`);
  for (const [ecrite, attendue] of REDUCTIONS) {
    const obtenue = classeNue(ecrite);
    if (obtenue !== attendue) ratés.push(`« ${ecrite} » se réduit en « ${obtenue} », attendu « ${attendue} »`);
  }
  if (!ratés.length) return;
  console.error('\n✗ classes mortes — LA DÉRIVATION NE SE PROUVE PLUS :\n');
  for (const r of ratés) console.error('    · ' + r);
  console.error(`
  Ces cas sont MESURÉS sur une compilation Tailwind réelle, pas déduits. S'ils tombent,
  c'est que theme.css, la table NAMESPACES ou l'amont ont bougé — et que la dérivation ne
  décrit plus ce qui rend. Répare la dérivation ; ne retire pas les cas qui la prouvent.
`);
  process.exit(1);
}

/* ══════════════════════════════════════════════════════════════════════════════
 * LE LECTEUR DE CLASSES — ce que le fichier ÉCRIT dans un className, pas sa prose.
 * ══════════════════════════════════════════════════════════════════════════════
 * Une recherche de sous-chaîne échouerait sur theme.css lui-même, dont les commentaires
 * citent `text-sm` et `tracking-widest` pour EXPLIQUER la règle. Un garde qui condamne sa
 * propre documentation se fait désactiver.
 */
function valeurApres(src, i) {
  while (i < src.length && /\s/.test(src[i])) i++;
  if (src[i] === '"' || src[i] === "'") {
    const q = src[i]; const j = src.indexOf(q, i + 1);
    return j < 0 ? null : [src.slice(i + 1, j)];
  }
  if (src[i] === '{') {
    let p = 0, j = i;
    for (; j < src.length; j++) {
      if (src[j] === '{') p++;
      else if (src[j] === '}') { p--; if (p === 0) break; }
    }
    const bloc = src.slice(i + 1, j);
    return [...bloc.matchAll(/'([^']*)'|"([^"]*)"|`([^`$\\]*)`/g)].map(m => m[1] ?? m[2] ?? m[3]);
  }
  return null;
}

function classesEcrites(src) {
  const out = new Map();
  for (const m of src.matchAll(/\bclassName=|\bclass=/g)) {
    const valeurs = valeurApres(src, m.index + m[0].length);
    if (!valeurs) continue;
    const ligne = src.slice(0, m.index).split('\n').length;
    for (const v of valeurs)
      for (const classe of v.split(/\s+/).filter(Boolean)) {
        if (!out.has(classe)) out.set(classe, new Set());
        out.get(classe).add(ligne);
      }
  }
  return out;
}

function fichiers(racine) {
  const out = [];
  if (!fs.existsSync(racine)) return out;
  for (const e of fs.readdirSync(racine, { withFileTypes: true })) {
    const complet = path.join(racine, e.name);
    if (e.isDirectory()) { if (e.name !== 'node_modules' && e.name !== 'dist') out.push(...fichiers(complet)); }
    else if (EXTENSIONS.test(e.name)) out.push(complet);
  }
  return out;
}

/* ── verdict ──────────────────────────────────────────────────────────────── */
if (!THEME) {
  console.error(`\n✗ classes mortes — theme.css introuvable. Pose THEME=<chemin>.\n`);
  process.exit(1);
}
/* `tailwindcss` est un peer OPTIONNEL : sans lui, l'échelle native est inconnue et il n'y
   a rien à dériver. Même arbitrage que check-preflight-drift.mjs — un garde bloquant sur
   un paquet facultatif casserait la CI pour la mauvaise raison. En CI il est installé. */
if (!fs.existsSync(AMONT)) {
  console.log(`⚠ classes mortes — tailwindcss n'est pas installé (${AMONT}) :`
    + ` l'échelle native est inconnue, rien n'a été vérifié.`);
  process.exit(0);
}

const notre = fs.readFileSync(THEME, 'utf8');
const amont = fs.readFileSync(AMONT, 'utf8');
const mortes = deriver(notre, amont);
seProuver(mortes);

const cibles = RACINES.flatMap(fichiers);
if (!cibles.length) {
  console.error(`\n✗ classes mortes — aucun fichier lu dans : ${RACINES.join(', ')}\n`
    + `  Un scanner qui ne lit rien passe au vert en ne prouvant rien.\n`);
  process.exit(1);
}

const erreurs = [];
for (const f of cibles) {
  for (const [classe, lignes] of classesEcrites(fs.readFileSync(f, 'utf8'))) {
    const nue = classeNue(classe);
    const ns = mortes.get(nue);
    if (ns) erreurs.push(`${f}:${[...lignes].join(',')} — « ${classe} » : \`--${ns}-*\` est vidé par theme.css`);
  }
}

if (erreurs.length) {
  console.error(`\n✗ classes mortes — ${erreurs.length} classe(s) qui ne rendent RIEN :\n`);
  for (const e of erreurs) console.error('    · ' + e);
  console.error(`
  Ces classes ne sont pas en erreur, elles sont INERTES : aucune règle n'est émise, le
  nœud hérite de son parent, et rien ne le signale. Prends le palier du système
  (text-body, tracking-display, rounded-lg…) ou écris la valeur en littéral
  (\`tracking-[0em]\`) quand aucun palier ne dit ce que tu veux.
`);
  process.exit(1);
}
console.log(`✓ classes mortes — ${mortes.size} classes dérivées mortes`
  + ` (${[...new Set(mortes.values())].map(n => `--${n}-*`).join(' ')}),`
  + ` aucune écrite dans ${cibles.length} fichiers · dérivation prouvée sur`
  + ` ${ATTENDU_MORT.length + ATTENDU_VIVANT.length + REDUCTIONS.length} cas mesurés`);

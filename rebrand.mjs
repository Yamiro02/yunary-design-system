#!/usr/bin/env node
/**
 * ══════════════════════════════════════════════════════════════════════════════
 * REBRAND — renomme le paquet, l'identité textuelle et le fichier de marque, en une
 * commande. C'est le geste 1 de GETTING-STARTED, celui qui prend une minute.
 * ══════════════════════════════════════════════════════════════════════════════
 *
 *   npm run rebrand -- "@monscope/ds" "Ma Marque"
 *   npm run rebrand -- "@monscope/ds" "Ma Marque" --monogram MM
 *
 * Ce qu'il touche :
 *   · le nom du paquet : toutes les références au nom courant dans le code, le CSS,
 *     les configs et la prose (package.json et demo/package.json compris)
 *   · src/brand.ts — nom, monogramme, lignes du mot-marque
 *   · la DESCRIPTION de package.json et le TITRE de la vitrine (demo/index.html)
 *   · la VERSION, remise à 0.1.0, et la ligne d'installation du README — au premier
 *     rebrand seulement. Sans ça, un design system tout neuf s'annonce à la version du
 *     template et son README envoie installer le dépôt du TEMPLATE : ses utilisateurs
 *     recevraient le paquet de quelqu'un d'autre.
 *
 * Il ne crée AUCUN fichier de marque : la marque se fabrique ensuite, en copiant
 * src/styles/brand-example.css et en repeignant chaque valeur (GETTING-STARTED, étape 3).
 *
 * Ce qu'il NE touche PAS, et c'est volontaire, ce sont des choix de design :
 *   · les valeurs de la palette → le fichier de marque que vous écrivez ensuite
 *   · les polices et le régime de titrage → même fichier
 *   · le préfixe de classes `ds-` → déjà générique, aucune raison d'en changer
 *
 * IDEMPOTENT. Relancé, il ne fait rien de plus : il lit le nom COURANT dans package.json
 * plutôt que de supposer un point de départ.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const EXT = new Set(['.ts', '.tsx', '.js', '.mjs', '.css', '.json', '.html', '.md']);
const SKIP = new Set(['node_modules', 'dist', '.git', '.claude']);

const args = process.argv.slice(2);
const flagAt = args.indexOf('--monogram');
const monogramFlag = flagAt !== -1 ? args[flagAt + 1] : null;
/* `flagAt + 1` ne doit exclure un index que si le drapeau est réellement présent : sans ce
   garde-fou, flagAt = -1 ferait tomber le premier argument positionnel. */
const valueAt = flagAt === -1 ? -1 : flagAt + 1;
const positional = args.filter((a, i) => !a.startsWith('--') && i !== valueAt);
const [nextPkg, nextName] = positional;

if (!nextPkg || !nextName) {
  console.error(`
Usage :
  npm run rebrand -- "@monscope/ds" "Ma Marque" [--monogram MM]

  1er argument   nom npm du paquet   ex. @monscope/ds
  2e argument    nom de la marque    ex. "Ma Marque"
  --monogram     initiales (1 à 3 lettres). Déduit du nom si absent.
`);
  process.exit(1);
}

/* Le scope est OBLIGATOIRE. Un nom nu comme `ds` est une sous-chaîne de `.ds-btn`,
   `ds-card`… : un second rebrand le remplacerait dans toutes les classes du CSS et des
   composants. Le remplacement est borné par des frontières de mot plus bas, mais un nom
   court sans scope resterait un piège — on le refuse d'entrée. */
if (!/^@[a-z0-9-]+\/[a-z0-9-]+$/.test(nextPkg)) {
  console.error(`✗ « ${nextPkg} » n'est pas un nom npm SCOPÉ (@scope/nom, minuscules et tirets). Le scope est obligatoire.`);
  process.exit(1);
}

const pkgPath = join(ROOT, 'package.json');
const currentPkg = JSON.parse(readFileSync(pkgPath, 'utf8')).name;

const monogram = (monogramFlag
  || nextName.split(/\s+/).map(w => w[0]).join('').slice(0, 3)
).toUpperCase();

const words = nextName.split(/\s+/);
const wordmarkLines = words.length === 2 ? words : [nextName];

/* Le slug de la marque, pour nommer son fichier : minuscules, tirets, sans accent. */
const slug = nextName.normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');


/* ── 1 · Références au paquet ─────────────────────────────────────────────── */
/* Remplacement À FRONTIÈRES, jamais un split/join nu : un nom sans frontière matcherait
   à l'intérieur des identifiants (`.ds-btn` pour un paquet nommé `ds` — mesuré : 740
   remplacements corrompus dans 56 fichiers) ou comme préfixe d'un nom plus long. Le seul
   dérivé suffixé légitime est le nom de la démo, `<pkg>-demo` : il est traité par son
   propre motif, AVANT le motif exact. */
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const MOTIF_PKG_DEMO = new RegExp('(?<![\\w@/-])' + esc(currentPkg + '-demo') + '(?![\\w-])', 'g');
const MOTIF_PKG = new RegExp('(?<![\\w@/-])' + esc(currentPkg) + '(?![\\w-])', 'g');
let touched = 0;
if (currentPkg !== nextPkg) {
  (function walk(dir) {
    for (const entry of readdirSync(dir)) {
      if (SKIP.has(entry)) continue;
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) { walk(full); continue; }
      if (!EXT.has(extname(entry))) continue;
      const before = readFileSync(full, 'utf8');
      if (!before.includes(currentPkg)) continue;
      const after = before
        .replace(MOTIF_PKG_DEMO, nextPkg + '-demo')
        .replace(MOTIF_PKG, nextPkg);
      if (after !== before) { writeFileSync(full, after); touched++; }
    }
  })(ROOT);
}

/* ── 1 bis · Version et ligne d'installation ──────────────────────────────────
   Seulement au PREMIER rebrand — celui où le nom du paquet change. Relancé ensuite, il ne
   doit pas remettre à 0.1.0 un dépôt qui a publié. */
let versionRemise = false;
if (currentPkg !== nextPkg) {
  const brut = readFileSync(pkgPath, 'utf8');
  const remis = brut.replace(/("version"\s*:\s*")[^"]+(")/, '$10.1.0$2');
  if (remis !== brut) { writeFileSync(pkgPath, remis); versionRemise = true; }

  /* La DESCRIPTION du paquet et le TITRE de la vitrine nomment la marque d'origine : ce
     sont deux chaînes que le client verrait sans jamais penser à les chercher. */
  const desc = readFileSync(pkgPath, 'utf8').replace(
    /("description"\s*:\s*")[^"]*(")/, `$1Design system ${nextName} — jetons, couche Tailwind v4 et primitives React.$2`);
  writeFileSync(pkgPath, desc);
  const html = join(ROOT, 'demo/index.html');
  if (existsSync(html)) writeFileSync(html, readFileSync(html, 'utf8')
    .replace(/<title>[^<]*<\/title>/, `<title>${nextName} — Design System</title>`));

  const rd = join(ROOT, 'README.md');
  const avantRd = readFileSync(rd, 'utf8');
  /* Le compte et le dépôt, on ne peut pas les deviner : on pose un gabarit qui SE VOIT. */
  const apresRd = avantRd.replace(/^npm i .*#v[\d.]+\s*$/m,
    'npm i github:<votre-compte>/<votre-depot>#v0.1.0');
  if (apresRd !== avantRd) writeFileSync(rd, apresRd);
}

/* ── 2 · Identité textuelle ───────────────────────────────────────────────── */
const brandTs = join(ROOT, 'src/brand.ts');
writeFileSync(brandTs, readFileSync(brandTs, 'utf8')
  .replace(/export const BRAND_NAME = .*;/, `export const BRAND_NAME = ${JSON.stringify(nextName)};`)
  .replace(/export const BRAND_MONOGRAM = .*;/, `export const BRAND_MONOGRAM = ${JSON.stringify(monogram)};`)
  .replace(/export const BRAND_WORDMARK_LINES: readonly string\[\] = .*;/,
           `export const BRAND_WORDMARK_LINES: readonly string[] = ${JSON.stringify(wordmarkLines)};`));


/* ── Compte rendu ─────────────────────────────────────────────────────────── */
const ligne = (ok, txt) => `${ok ? '✓' : '·'} ${txt}`;
console.log(`
${ligne(currentPkg !== nextPkg, `Paquet     ${currentPkg}  →  ${nextPkg}${touched ? `      (${touched} fichier${touched > 1 ? 's' : ''})` : '      (déjà à ce nom)'}`)}
${ligne(true, `Marque     ${nextName}`)}
${ligne(true, `Monogramme ${monogram}`)}
${ligne(true, `Wordmark   ${JSON.stringify(wordmarkLines)}`)}
${ligne(versionRemise, `Version    remise à 0.1.0${versionRemise ? ', README à v0.1.0 — le compte et le dépôt sont à renseigner' : '   (inchangée — ce n\'est pas le premier rebrand)'}`)}

Il reste l'essentiel, et le script ne peut pas le faire à votre place : ÉCRIRE LA MARQUE.

  1. supprimez  le fichier de marque du dépôt d'origine, sa doc, et le contenu de
                src/styles/assets/fonts/   — la liste exacte est dans GETTING-STARTED.md
  2. copiez     src/styles/brand-example.css en src/styles/brand-${slug}.css et
                repeignez chaque valeur — le gabarit src/styles/brand.template.css
                porte le contrat, jeton par jeton : gardez-le ouvert à côté
  3. montez-la  dans le montage de la vitrine (demo/*-entry.css) et dans vos apps :
                @import "core.css" puis @import votre marque

Puis :  TOKENS=src/styles/brand-${slug}.css node check-contrast.mjs
        npm run demo                 http://localhost:5273

Le détail est dans GETTING-STARTED.md.
`);

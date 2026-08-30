#!/usr/bin/env node
/**
 * Filet de RÉFÉRENCE DE JETON — tout `var(--x)` lu doit correspondre à un `--x:` déclaré.
 *
 * LE DÉFAUT QU'IL FERME. Un portage a livré un `patterns.css` qui lisait
 * `var(--text-body-sm)` en TREIZE endroits sans que le jeton soit déclaré nulle part.
 * Ce qui rend le défaut méchant : un `var()` non résolu ne rend pas la déclaration
 * « ignorée », il la rend INVALIDE AT COMPUTED-VALUE TIME — ce qui, pour `font-size`,
 * signifie `inherit`. `.ds-btn--sm` héritait donc le corps de texte du parent (16px) au
 * lieu du `--text-control` de `.ds-btn` (15px) : le bouton `size="sm"` rendait plus GROS
 * qu'un `md`. La prop faisait l'inverse de son nom, et rien ne le signalait.
 *
 * POURQUOI LES HUIT AUTRES GARDES NE PEUVENT PAS LE VOIR. Ils mesurent des VALEURS
 * (contraste, surfaces, substitution, littéraux) ou une COMPLÉTUDE DE LISTE (contrat,
 * catalogue). Aucun ne vérifie que ce que le CSS *lit* existe.
 *
 * LE PIÈGE, et il est central : `theme.css` est EXCLU du balayage des déclarations. Le pont
 * Tailwind y écrit des lignes auto-référentielles — `--text-body-sm: var(--text-body-sm)` —
 * qui n'ont de sens que dans un `@theme inline`, où la variable n'est jamais émise. Un
 * scanner naïf y voit une déclaration et conclut que le jeton existe : le garde passerait
 * au VERT sur le bug exact qu'il doit attraper. Deux protections, pas une — le fichier est
 * exclu, ET toute déclaration dont la valeur vaut exactement `var(--<même-nom>)` est
 * ignorée, où qu'elle soit.
 *
 * CE QU'IL NE FAIT PAS, ET NE DOIT PAS FAIRE : pas de détection de jeton MORT (déclaré,
 * jamais lu). Les alias historiques sont déclarés exprès sans consommateur, et un contrat
 * de marque contient légitimement des jetons qu'aucune règle du socle ne lit. Un garde qui
 * crie sur eux se fera désactiver, et emportera l'autre moitié avec lui.
 *
 * L'ÉCHAPPATOIRE, convention maison, raison OBLIGATOIRE :
 *
 *     /* @tokenref-assume: --app-header-h — fourni par l'application hôte, pas par le système *\/
 *
 * ET SA JUMELLE, pour un REPLI délibéré — `var(--x, repli)` où le repli EST la décision,
 * pas une béquille :
 *
 *     /* @tokenref-fallback: --border — le repli fait tenir un socle monté sans marque *\/
 *
 * Sans elle, le garde répéterait à chaque `lint` qu'un repli « pérennise le trou » sur une
 * ligne où c'est faux. Un garde qui a tort une fois par jour finit par être ignoré, et il
 * emporte l'autre moitié avec lui.
 *
 * Usage : node check-token-refs.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

/* ---------- où sont les DÉCLARATIONS ----------
   Le socle, la marque, le gabarit et l'extension métier. Un jeton déclaré uniquement dans
   `.dark` compte comme déclaré : ce garde vérifie l'EXISTENCE, pas la couverture par thème
   — c'est le métier de check-dark-substitution.mjs. */
const STYLES = 'src/styles';
const EXCLUS_DECLARATION = new Set(['theme.css']);   /* voir LE PIÈGE, en tête */

function fichiersDeDeclaration() {
  const out = [];
  const tokens = path.join(STYLES, 'tokens');
  if (fs.existsSync(tokens))
    for (const n of fs.readdirSync(tokens).sort())
      if (n.endsWith('.css')) out.push(path.join(tokens, n));
  for (const n of fs.readdirSync(STYLES).sort()) {
    if (!n.endsWith('.css') || EXCLUS_DECLARATION.has(n)) continue;
    if (n === 'core.css' || /^brand.*\.css$/.test(n)) out.push(path.join(STYLES, n));
  }
  return out;
}

/* ---------- où sont les RÉFÉRENCES ----------
   Les deux fichiers de règles du socle, et les composants : un style inline lit des jetons
   lui aussi, et personne ne pense à l'y chercher. */
function fichiersDeReference() {
  const out = [path.join(STYLES, 'patterns.css'), path.join(STYLES, 'tokens', 'base.css')]
    .filter(f => fs.existsSync(f));
  const racine = 'src/components';
  if (fs.existsSync(racine)) (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name < b.name ? -1 : 1)) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p); else if (/\.(jsx|tsx)$/.test(e.name)) out.push(p);
    }
  })(racine);
  return out;
}

/* Les commentaires sont BLANCHIS, pas retirés : la prose n'est pas du code, mais les
   numéros de ligne du rapport doivent rester ceux du fichier. */
const sansCommentaires = src =>
  src.replace(/\/\*[\s\S]*?\*\//g, c => c.replace(/[^\n]/g, ' '));

/* ---------- 1 · les déclarations ---------- */
const DECLAREES = new Set();
const AUTO = [];   /* les lignes auto-référentielles, pour le rapport */
const DECLS = fichiersDeDeclaration();
if (!DECLS.length) {
  console.error(`\n✗ token-refs — aucun fichier de déclaration trouvé sous ${STYLES}/.
  Un garde qui ne lit aucune déclaration croirait TOUT manquant, ou pire, ne mesurerait rien.\n`);
  process.exit(1);
}
for (const f of DECLS) {
  const src = sansCommentaires(fs.readFileSync(f, 'utf8'));
  for (const m of src.matchAll(/(?:^|[;{}])\s*(--[\w-]+)\s*:\s*([^;{}]*)/g)) {
    const nom = m[1], valeur = m[2].trim();
    if (valeur === `var(${nom})`) { AUTO.push(`${nom} — ${f}`); continue; }
    DECLAREES.add(nom);
  }
}

/* ---------- 2 · les échappatoires écrites ---------- */
const ASSUMEES = new Map();      /* nom -> raison — le jeton vient d'ailleurs */
const REPLIS_OK = new Map();     /* nom -> raison — le repli est la décision */
const SANS_RAISON = [];
for (const f of new Set([...DECLS, ...fichiersDeReference()])) {
  const src = fs.readFileSync(f, 'utf8');
  for (const [motif, cible] of [[/@tokenref-assume:[ \t]*(--[\w-]+)[ \t]*(?:—|-)?[ \t]*([^\n*]*)/g, ASSUMEES],
                                [/@tokenref-fallback:[ \t]*(--[\w-]+)[ \t]*(?:—|-)?[ \t]*([^\n*]*)/g, REPLIS_OK]]) {
    for (const m of src.matchAll(motif)) {
      const raison = m[2].trim();
      if (!raison) { SANS_RAISON.push(`${m[1]} — ${f}`); continue; }
      cible.set(m[1], raison);
    }
  }
}

/* ---------- 3 · les références ---------- */
const refs = new Map();          /* nom -> [{ fichier, ligne, fallback }] */
for (const f of fichiersDeReference()) {
  const lignes = sansCommentaires(fs.readFileSync(f, 'utf8')).split('\n');
  lignes.forEach((l, i) => {
    for (const m of l.matchAll(/var\(\s*(--[\w-]+)\s*([,)])/g)) {
      if (!refs.has(m[1])) refs.set(m[1], []);
      refs.get(m[1]).push({ fichier: f, ligne: i + 1, fallback: m[2] === ',' });
    }
  });
}

/* ---------- verdict ----------
   Groupé PAR NOM : un --text-body-sm manquant sur 13 sites est UN défaut, pas treize. */
const manquants = [];
const béquilles = [];
const assuméesVues = new Set();

for (const nom of [...refs.keys()].sort()) {
  const sites = refs.get(nom);
  const avecFallback = sites.filter(s => s.fallback);
  if (avecFallback.length && !REPLIS_OK.has(nom)) béquilles.push({ nom, sites: avecFallback, déclaré: DECLAREES.has(nom) });
  if (DECLAREES.has(nom)) continue;
  if (ASSUMEES.has(nom)) { assuméesVues.add(nom); continue; }
  const durs = sites.filter(s => !s.fallback);
  if (!durs.length) continue;   /* uniquement lu avec un repli : la béquille suffit, elle est signalée */
  manquants.push({ nom, sites: durs });
}

for (const l of AUTO)
  console.warn(`⚠ token-refs — déclaration auto-référentielle ignorée : ${l}`);
for (const l of SANS_RAISON)
  console.warn(`⚠ token-refs — @tokenref-assume SANS RAISON, donc sans effet : ${l}`);
for (const nom of ASSUMEES.keys())
  if (!assuméesVues.has(nom))
    console.warn(`⚠ token-refs — @tokenref-assume « ${nom} » ne correspond à aucune référence manquante — nom inexact, ou jeton déclaré depuis ?`);
for (const b of béquilles)
  console.warn(`⚠ fallback — var(${b.nom}, …) sur ${b.sites.length} site(s) : ${b.sites.slice(0, 3).map(s => `${s.fichier}:${s.ligne}`).join(', ')}`
    + `${b.sites.length > 3 ? `, +${b.sites.length - 3}` : ''}`
    + `\n            ${b.déclaré ? 'Le jeton existe' : 'LE JETON N\'EXISTE PAS'} — un repli masque un jeton absent, c'est la béquille qui pérennise le trou.`);

if (manquants.length) {
  const sites = manquants.reduce((n, m) => n + m.sites.length, 0);
  console.error(`\n✗ token-refs — ${manquants.length} jeton(s) LU(S) sans être déclaré(s), sur ${sites} site(s) :\n`);
  for (const m of manquants) {
    console.error(`    ${m.nom}  —  ${m.sites.length} référence(s)`);
    for (const s of m.sites) console.error(`      ${s.fichier}:${s.ligne}`);
  }
  console.error(`
  Un var() non résolu ne rend pas la déclaration ignorée : il la rend INVALIDE at
  computed-value time, et la propriété retombe sur sa valeur héritée. Un font-size hérite,
  une couleur hérite — le composant rend quelque chose de plausible et de faux.

  Deux issues, pas trois :
    · déclarer le jeton là où il appartient — tokens/*.css pour une mesure du socle,
      le fichier de marque (et le § OBLIGATOIRE de brand.template.css) pour une identité ;
    · ou ASSUMER, si le jeton est fourni par l'APPLICATION HÔTE et non par le système :

          /* @tokenref-assume: <le nom exact> — <qui le fournit, et pourquoi pas nous> */

      La raison est obligatoire : sans elle l'échappatoire est ignorée.
`);
  process.exit(1);
}

const n = refs.size;
console.log(`✓ token-refs — ${n} jetons lus par ${fichiersDeReference().length} fichiers, tous déclarés`
  + `${ASSUMEES.size ? ` (${assuméesVues.size} assumé(s) par écrit)` : ''}`
  + `${REPLIS_OK.size ? ` · ${REPLIS_OK.size} repli(s) délibéré(s)` : ''}`
  + `${béquilles.length ? ` · ${béquilles.length} lu(s) avec un repli` : ''}`);
process.exit(0);

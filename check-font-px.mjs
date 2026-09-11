#!/usr/bin/env node
/**
 * Filet des TAILLES DE POLICE EN PIXELS — aucune classe arbitraire `text-[…px]`.
 *
 * LE DÉFAUT QU'IL FERME, et il est structurel, pas une préférence de style.
 * `app-scale.css` change la taille de la RACINE par palier de largeur d'écran — mesuré à
 * 16,48px sur un poste de travail, pas 16. Toute l'interface suit, PARCE QU'ELLE EST EN
 * REM. Une taille arbitraire en pixels posée au milieu ne suit pas : elle reste à sa
 * valeur pendant que ses voisines grandissent, et elle rétrécit visuellement à chaque
 * palier. **Le défaut est invisible sur l'écran où on l'a écrit** — c'est ce qui le rend
 * méchant : il ne se voit que chez quelqu'un d'autre, sur une autre largeur.
 *
 * Toute valeur px d'une maquette se convertit en rem (÷ 16). `text-[0.9375rem]` passe.
 *
 * POURQUOI LES AUTRES GARDES NE PEUVENT PAS LE VOIR. `check-literals.sh` lit le CSS du
 * socle, pas le JSX. `check-token-refs.mjs` vérifie que les `var()` existent. Aucun ne
 * regarde ce qu'une app ÉCRIT dans un `className`.
 *
 * NÉ DANS UNE APP, versé au squelette. Il vivait dans les tests d'architecture d'une app
 * consommatrice, sous vitest. Ici il n'a besoin d'aucun framework : treize gardes de cette
 * forme tournent déjà à chaque `npm run lint`, et surtout **une app peut le pointer sur
 * son propre `src/`** — c'est la moitié de l'intérêt de le tenir au socle. Un design
 * system né de ce gabarit l'emporte avec lui, à son premier commit.
 *
 * Usage : node check-font-px.mjs [dossier…]        (défaut : src demo/src)
 *         node check-font-px.mjs src               depuis une app consommatrice
 */
import fs from 'node:fs';
import path from 'node:path';

const RACINES = process.argv.slice(2).length ? process.argv.slice(2) : ['src', 'demo/src'];
const EXTENSIONS = /\.(?:tsx?|jsx?|mjs)$/;

/* ══════════════════════════════════════════════════════════════════════════════
 * LE MOTIF, et son jumeau de falsification.
 * ══════════════════════════════════════════════════════════════════════════════
 * Il attrape la classe arbitraire sous toutes ses formes : entière, décimale, et
 * préfixée par une bande responsive (`md:`) ou par `!`. Il n'est PAS ancré : la classe
 * peut porter un modificateur d'interligne (`text-[13px]/1.4`).
 */
const MOTIF_PX = /text-\[[^\]]*\d(?:\.\d+)?px\]/;

/* LE JUMEAU DE FALSIFICATION, ET IL TOURNE À CHAQUE APPEL. Un motif qui ne matche plus
   rien rendrait un garde toujours vert, donc décoratif — c'est le mode de panne d'un
   contrôle de forme, et il est silencieux. Le garde se prouve donc AVANT de scanner.
   ⚠️ Les exemples sont ASSEMBLÉS, pas écrits en clair : ce fichier vit à la racine, hors
   des dossiers scannés par défaut, mais rien n'empêche quelqu'un de pointer le garde sur
   `.` — et il se signalerait lui-même. La discipline coûte trois lignes. */
const PX = 'px';
const FALSIFICATION = [
  /* reconnaît une violation… */
  [`text-[15${PX}]`, true],
  [`md:text-[15.5${PX}]`, true],
  [`text-[13${PX}]/1.4`, true],
  /* …et laisse passer ce qui est légitime. */
  ['text-heading', false],
  ['text-[0.9375rem]', false],
  ['text-[clamp(1rem,2vw,2.5rem)]', false],
  /* Une marge arbitraire en px n'est PAS l'objet de ce garde : la règle porte sur les
     TAILLES DE POLICE, celles qui doivent suivre la racine. */
  [`p-[15${PX}]`, false],
];

function seProuver() {
  const ratés = FALSIFICATION.filter(([classe, attendu]) => MOTIF_PX.test(classe) !== attendu);
  if (!ratés.length) return;
  console.error('\n✗ tailles en px — LE MOTIF NE SE RECONNAÎT PLUS LUI-MÊME :\n');
  for (const [classe, attendu] of ratés)
    console.error(`    · « ${classe} » devrait ${attendu ? 'ÊTRE' : 'NE PAS être'} reconnu, il l'est${attendu ? ' pas' : ''}.`);
  console.error(`
  Un garde qu'on n'a jamais vu échouer ne garde rien. Répare le motif — ou, si la règle
  a changé, change les deux ENSEMBLE : le motif et les cas qui le prouvent.
`);
  process.exit(1);
}

/* ══════════════════════════════════════════════════════════════════════════════
 * LE LECTEUR DE CLASSES — ce que le fichier ÉCRIT dans un className.
 * ══════════════════════════════════════════════════════════════════════════════
 * Pas une recherche de sous-chaîne sur le fichier entier : la PROSE en contient. Un
 * commentaire qui explique la règle en citant `text-[15px]` ferait échouer le garde sur
 * sa propre documentation, et on désactiverait le garde plutôt que la prose.
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
    /* Les LITTÉRAUX du bloc : `cn('a', cond && 'b')` en porte deux. Les gabarits à
       interpolation sont ignorés — leur contenu n'est pas connu à la lecture. */
    return [...bloc.matchAll(/'([^']*)'|"([^"]*)"|`([^`$\\]*)`/g)].map(m => m[1] ?? m[2] ?? m[3]);
  }
  return null;
}

/** classe -> Set(ligne) */
export function classesEcrites(src) {
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
seProuver();

const cibles = RACINES.flatMap(fichiers);
if (!cibles.length) {
  console.error(`\n✗ tailles en px — aucun fichier lu dans : ${RACINES.join(', ')}\n`
    + `  Un scanner qui ne lit rien rend une liste vide et passe au vert en ne prouvant\n`
    + `  rien. Vérifie le chemin — c'est le premier argument.\n`);
  process.exit(1);
}

const erreurs = [];
for (const f of cibles) {
  for (const [classe, lignes] of classesEcrites(fs.readFileSync(f, 'utf8')))
    if (MOTIF_PX.test(classe))
      erreurs.push(`${f}:${[...lignes].join(',')} — « ${classe} »`);
}

if (erreurs.length) {
  console.error(`\n✗ tailles en px — ${erreurs.length} taille(s) de police en pixels :\n`);
  for (const e of erreurs) console.error('    · ' + e);
  console.error(`
  Convertis en rem (÷ 16) : 15px devient text-[0.9375rem]. Mieux : prends le palier
  nommé du socle s'il existe (text-body, text-control, text-caption…), il porte déjà son
  interligne et son interlettrage.
  La raison : app-scale.css fait varier la taille de la RACINE par palier d'écran. Ce qui
  est en rem suit, ce qui est en px reste — et ça ne se voit pas sur l'écran où on l'écrit.
`);
  process.exit(1);
}
console.log(`✓ tailles en px — ${cibles.length} fichiers lus, aucune taille de police en pixels`
  + ` · motif prouvé sur ${FALSIFICATION.length} cas`);

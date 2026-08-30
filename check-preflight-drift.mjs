#!/usr/bin/env node
/**
 * Filet de DÉRIVE DU PREFLIGHT — la copie versée suit-elle encore son amont ?
 *
 * LE DÉFAUT QU'IL FERME. `src/styles/tokens/preflight.css` est une COPIE de
 * `tailwindcss/preflight.css`, figée à une version, et son en-tête prescrit une
 * PROCÉDURE ÉCRITE : « pour suivre une montée de Tailwind, recopie le fichier d'amont et
 * refais la même coupe ». Ce dépôt a déjà établi qu'une procédure écrite ne tient pas —
 * c'est littéralement pourquoi `check-version.mjs` existe, après trois oublis de suite.
 * Le onzième mois, Tailwind passe en 4.5, la copie ne bouge pas, et personne ne le sait.
 *
 * IL N'ÉCHOUE JAMAIS — `exit 0` dans tous les cas, et c'est délibéré. Une montée de
 * Tailwind est LÉGITIME : l'arbitrage entre « on recopie » et « on reste » est humain, il
 * dépend de ce que change la nouvelle version. Et surtout, `tailwindcss` est un peer
 * OPTIONNEL : un garde bloquant sur un paquet facultatif casserait la CI d'une machine qui
 * ne l'a pas installé, pour la mauvaise raison. Sa valeur est de RENDRE LA DÉRIVE VISIBLE,
 * pas de l'interdire.
 *
 * LA VERSION ATTENDUE EST LUE DANS L'EN-TÊTE DE LA COPIE, pas écrite ici : un numéro noté
 * à deux endroits est un numéro qui divergera.
 *
 * Usage : node check-preflight-drift.mjs
 */
import fs from 'node:fs';

const COPIE = 'src/styles/tokens/preflight.css';
const AMONT = 'node_modules/tailwindcss/preflight.css';
const PKG = 'node_modules/tailwindcss/package.json';

const fin = (n = 0) => process.exit(n);

if (!fs.existsSync(COPIE)) {
  console.warn(`⚠ preflight — ${COPIE} est absent : le socle n'a plus de reset versé.`);
  fin();
}

const brut = fs.readFileSync(COPIE, 'utf8');

/* 1 · notre en-tête, c'est-à-dire le PREMIER bloc de commentaire du fichier. Tout ce qui
      suit doit être la copie d'amont, à la coupe près. */
const finEntete = brut.indexOf('*/');
if (finEntete < 0 || !brut.trimStart().startsWith('/*')) {
  console.warn(`⚠ preflight — ${COPIE} ne commence pas par l'en-tête du socle : impossible de savoir ce qui est copié et ce qui est à nous.`);
  fin();
}
const entete = brut.slice(0, finEntete + 2);
const copie = brut.slice(finEntete + 2);

/* 2 · la version attendue, lue dans cet en-tête — source de vérité unique. */
const mv = /version\s+(\d+\.\d+\.\d+)/.exec(entete);
if (!mv) {
  console.warn(`⚠ preflight — aucune version d'amont lisible dans l'en-tête de ${COPIE}.
  Le garde ne peut pas dire à quoi comparer. Écris « version X.Y.Z » dans l'en-tête.`);
  fin();
}
const attendue = mv[1];

/* 3 · le peer est OPTIONNEL : son absence n'est pas une dérive. */
if (!fs.existsSync(AMONT) || !fs.existsSync(PKG)) {
  console.log(`⚠ preflight — tailwindcss n'est pas installé, dérive non vérifiée (copie figée à ${attendue}).`);
  fin();
}

/* 4 · la version réellement installée. */
let installee = '?';
try { installee = JSON.parse(fs.readFileSync(PKG, 'utf8')).version; } catch { /* illisible */ }

/* 5 · la comparaison porte sur les RÈGLES, pas sur la prose. Les commentaires sont
      retirés des deux côtés : la copie annote les deux blocs d'amont où la coupe a eu
      lieu, et une annotation n'est pas une dérive. Ce qui compte est qu'aucune
      DÉCLARATION n'ait bougé — c'est elle qui rend à l'écran. */
const sansCommentaires = src => src.replace(/\/\*[\s\S]*?\*\//g, '');
/* `--theme(…)` s'étale sur plusieurs lignes : on retire aussi la continuation, jusqu'à la
   parenthèse fermante de l'appel. */
function retirerTheme(src) {
  const out = [];
  let profondeur = 0;
  for (const l of src.split('\n')) {
    if (profondeur > 0) {
      for (const c of l) { if (c === '(') profondeur++; else if (c === ')') profondeur--; }
      if (profondeur <= 0) profondeur = 0;
      continue;
    }
    if (l.includes('--theme(')) {
      for (const c of l.slice(l.indexOf('--theme(') + 7)) { if (c === '(') profondeur++; else if (c === ')') profondeur--; }
      if (profondeur < 0) profondeur = 0;
      continue;
    }
    out.push(l);
  }
  return out.join('\n');
}

/* Les SIX COUPES CONNUES : les déclarations bâties sur `--theme(…)`, que seul le
   compilateur Tailwind résout. On les retire d'amont avant de comparer — c'est exactement
   la coupe que décrit l'en-tête de la copie. */
const norm = src => retirerTheme(sansCommentaires(src))
  .split('\n').map(l => l.replace(/\s+$/, '')).filter(l => l !== '')
  .join('\n').trim();

const a = norm(fs.readFileSync(AMONT, 'utf8'));
const b = norm(copie);

if (a === b && installee === attendue) {
  console.log(`✓ preflight — conforme à tailwindcss ${attendue} (six coupes connues)`);
  fin();
}

console.log(`⚠ preflight — LA COPIE VERSÉE A DÉRIVÉ DE SON AMONT.

    copie  ${COPIE}  ->  figée à ${attendue}
    amont  ${AMONT}  ->  installé ${installee}`);

if (a !== b) {
  const la = a.split('\n'), lb = b.split('\n');
  const ecarts = [];
  for (let i = 0; i < Math.max(la.length, lb.length) && ecarts.length < 6; i++) {
    if (la[i] !== lb[i]) ecarts.push(`    ligne ${i + 1}\n      amont : ${la[i] ?? '(rien)'}\n      copie : ${lb[i] ?? '(rien)'}`);
  }
  console.log(`\n  Le CONTENU diverge (${la.length} lignes d'amont, ${lb.length} en copie) :\n\n${ecarts.join('\n')}`);
} else {
  console.log(`\n  Le contenu est identique : seul le NUMÉRO de version diverge.`);
}

console.log(`
  La marche à suivre, et elle est manuelle EXPRÈS — arbitre d'abord si la montée vaut
  d'être suivie, puis :
    1. recopier ${AMONT} dans ${COPIE} ;
    2. refaire la coupe — retirer les six déclarations bâties sur \`--theme(…)\` :
       font-family / font-feature-settings / font-variation-settings sur \`html,:host\`
       et sur \`code,kbd,samp,pre\` ;
    3. remettre l'en-tête du socle en tête de fichier, et y écrire « version ${installee} » ;
    4. relancer le relevé avant/après de la vitrine : une montée de preflight peut
       déplacer un contrôle sans rien casser.
`);
fin();

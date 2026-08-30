#!/usr/bin/env node
/**
 * Filet de COMPLÉTUDE DU CONTRAT — deux règles, une par régime du gabarit.
 *
 * `brand.template.css` a DEUX moitiés, séparées par le marqueur `@section:facultatif`, et
 * elles ne se contrôlent pas de la même façon parce qu'elles ne se comportent pas pareil.
 *
 * RÈGLE 1 — § OBLIGATOIRE (au-dessus du marqueur) ≡ la marque du dépôt.
 *   C'est l'identité : couleurs, polices, dégradés, lueurs. Aucun repli. Si un jeton est
 *   ajouté à la marque sans être ajouté au gabarit, le contrat naît incomplet — un client
 *   qui le remplit consciencieusement livre un système où une variable n'existe pas, la
 *   propriété devient invalide et ça casse à l'écran, mais chez LUI, pas ici. L'inverse
 *   compte aussi : un jeton resté au gabarit après avoir disparu de la marque fait remplir
 *   une valeur que plus personne ne lit.
 *   Même jeu de noms en `:root`, aux jetons MÉTIER près — ceux du bloc optionnel, qui ne
 *   servent qu'à `brand-content.css`. En `.dark`, le gabarit porte le MINIMUM : tout ce
 *   qu'il déclare doit exister dans la marque, mais une marque peut en redéclarer davantage.
 *
 * RÈGLE 2 — § FACULTATIF (sous le marqueur) ⊆ les jetons du socle.
 *   C'est la forme : arrondis, rail de contrôles, dimensions de composants. Chacun a un
 *   DÉFAUT dans `src/styles/tokens/`, et le fichier de marque ne fait que le redéclarer.
 *   Le contrôle ne peut donc pas les exiger de la marque — elle a le droit de n'en déclarer
 *   aucun, c'est même le cas normal. Ce qu'il vérifie est l'autre bout : que chaque jeton
 *   PROPOSÉ existe bien dans le socle. Sinon le gabarit invite à régler une variable que
 *   personne ne lit — un bouton qui ne branche rien, et c'est pire qu'un bouton absent.
 *
 * FORMAT ATTENDU du § FACULTATIF : une déclaration par ligne, commentée ou non, la ligne
 * commençant par `--jeton:` ou par `/* --jeton:`. C'est ce qui permet de livrer la section
 * entièrement commentée — son état normal — tout en la contrôlant.
 *
 * COMMENT LE METTRE EN DÉFAUT, pour vérifier qu'il tient encore :
 *   règle 1 :  supprimer une ligne de jeton du `:root` du gabarit, au-dessus du marqueur
 *   règle 2 :  ajouter `/* --navbar-hauteur:4.5rem; *\/` sous le marqueur
 * Les deux doivent sortir 1 et nommer le jeton fautif.
 *
 * Usage : node check-contract.mjs
 */
import fs from 'node:fs';

const GABARIT = 'src/styles/brand.template.css';
const MARQUEUR = '@section:facultatif';
const SOCLE = ['src/styles/tokens/scales.css', 'src/styles/tokens/typography.css'];

/* La marque à confronter au contrat : celle du dépôt, quelle qu'elle soit. Elle était codée
   en dur sur un nom de marque, et le contrôle PLANTAIT sur une pile Node dans la copie d'un
   client — qui commence justement par supprimer ce fichier. Or c'est là que le contrat
   compte le plus : c'est le fichier qu'on vient d'écrire. */
const MARQUE = (() => {
  const dir = 'src/styles';
  const marques = fs.readdirSync(dir)
    .filter(n => /^brand-.*\.css$/.test(n) && n !== 'brand-content.css' && n !== 'brand.template.css')
    .sort();
  if (!marques.length) {
    console.error(`\n✗ contrat — aucune marque dans ${dir}/ : il n'y a rien à confronter au gabarit.
  Écrivez votre fichier de marque à partir de ${GABARIT}, puis relancez.\n`);
    process.exit(1);
  }
  /* S'il y en a plusieurs, on prend la première par ordre alphabétique et on le DIT :
     un contrôle qui choisit en silence est un contrôle qu'on ne peut pas relire. */
  if (marques.length > 1) console.warn(`⚠ contrat — ${marques.length} marques présentes, comparaison sur ${marques[0]}.`);
  return dir + '/' + marques[0];
})();

/* Les jetons MÉTIER : commentés dans le gabarit, et déclarés par la marque de référence
   puisqu'elle sert d'exemple complet. On les lit dans le CONTRAT écrit en tête de
   `brand-content.css` — pas dans une liste tenue ici, qui divergerait. */
const METIER = new Set(
  [...fs.readFileSync('src/styles/brand-content.css', 'utf8')
      .matchAll(/^ {5}(--[\w-]+) {2,}/gm)].map(m => m[1]));
if (!METIER.size) {
  console.error(`\n✗ contrat — aucun jeton métier lu dans l'en-tête de brand-content.css.
  Le contrôle comparerait alors le gabarit et la marque en incluant les jetons optionnels,
  et signalerait des divergences qui n'en sont pas. Vérifie le format de cet en-tête.\n`);
  process.exit(1);
}

/* Le gabarit se coupe en deux sur le marqueur. Un marqueur absent, ou en double, rendrait
   le découpage arbitraire : on refuse au lieu de deviner. */
const gabaritSrc = fs.readFileSync(GABARIT, 'utf8');
const morceaux = gabaritSrc.split(MARQUEUR);
if (morceaux.length !== 2) {
  console.error(`\n✗ contrat — ${GABARIT} porte ${morceaux.length - 1} marqueur(s) \`${MARQUEUR}\`, il en faut exactement 1.
  C'est lui qui sépare le § OBLIGATOIRE du § FACULTATIF, et les deux ne se contrôlent pas
  de la même façon. Sans lui, le contrôle ne peut pas savoir ce qu'il doit exiger.\n`);
  process.exit(1);
}
const [OBLIGATOIRE, FACULTATIF] = morceaux;

function noms(src, fichier) {
  src = src.replace(/\/\*[\s\S]*?\*\//g, '');
  const bloc = sel => {
    const i = src.indexOf(sel + '{');
    if (i < 0) throw new Error(`${fichier} : bloc ${sel} introuvable`);
    const s = src.slice(i + sel.length + 1);
    let d = 1, j = 0;
    while (d > 0) { if (s[j] === '{') d++; if (s[j] === '}') d--; j++; }
    return s.slice(0, j - 1);
  };
  const lire = t => new Set([...t.matchAll(/(--[\w-]+)\s*:/g)].map(m => m[1]));
  return { root: lire(bloc(':root')), dark: lire(bloc('.dark')) };
}

const g = noms(OBLIGATOIRE, GABARIT), m = noms(fs.readFileSync(MARQUE, 'utf8'), MARQUE);
const diff = (a, b) => [...a].filter(x => !b.has(x));

const erreurs = [];

/* ---------- RÈGLE 1 ---------- */
/* Les jetons MÉTIER sont commentés dans le gabarit — c'est leur état normal, ils sont
   optionnels — et déclarés par la marque de référence, qui sert d'exemple complet. Les
   compter comme manquants ferait échouer un contrat correct. */
const manquantsGabarit = diff(m.root, g.root).filter(n => !METIER.has(n));
const enTropGabarit = diff(g.root, m.root).filter(n => !METIER.has(n));
const darkManquants = diff(g.dark, m.dark);

if (manquantsGabarit.length) erreurs.push(
  [`${manquantsGabarit.length} jeton(s) déclaré(s) par ${MARQUE} et ABSENT(S) du § OBLIGATOIRE`,
   manquantsGabarit,
   `Un client qui remplit le gabarit livrera un système où ces variables n'existent pas.\n      Ajoute-les à ${GABARIT}, avec le commentaire qui dit ce qu'elles doivent tenir.`]);
if (enTropGabarit.length) erreurs.push(
  [`${enTropGabarit.length} jeton(s) au § OBLIGATOIRE que ${MARQUE} ne déclare plus`,
   enTropGabarit,
   `Le gabarit fait remplir une valeur que plus rien ne lit. Retire-les, ou déclare-les\n      dans la marque par défaut si elles ont encore un emploi.`]);
if (darkManquants.length) erreurs.push(
  [`${darkManquants.length} jeton(s) que le contrat demande en .dark et que ${MARQUE} n'y redéclare pas`,
   darkManquants,
   `Le gabarit porte le MINIMUM à redéclarer en thème sombre : la marque par défaut doit\n      au moins le tenir.`]);

/* ---------- RÈGLE 2 ---------- */
/* Une déclaration par ligne, commentée ou non. La prose du § n'est jamais lue : une ligne
   d'explication ne commence pas par `--` ni par `/* --`. */
const proposes = [...new Set(
  [...FACULTATIF.matchAll(/^\s*(?:\/\*\s*)?(--[\w-]+)\s*:/gm)].map(x => x[1]))];
if (!proposes.length) {
  console.error(`\n✗ contrat — aucun jeton lu sous \`${MARQUEUR}\` dans ${GABARIT}.
  Soit le § FACULTATIF est vide, soit ses lignes ne sont plus au format attendu :
  une déclaration par ligne, la ligne commençant par \`--jeton:\` ou par \`/* --jeton:\`.\n`);
  process.exit(1);
}
const declaresSocle = new Set();
for (const f of SOCLE) {
  const src = fs.readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  for (const x of src.matchAll(/(--[\w-]+)\s*:/g)) declaresSocle.add(x[1]);
}
const orphelins = proposes.filter(n => !declaresSocle.has(n));
if (orphelins.length) erreurs.push(
  [`${orphelins.length} jeton(s) du § FACULTATIF qui n'existe(nt) pas dans le socle`,
   orphelins,
   `Le § FACULTATIF ne fait que REDÉCLARER des défauts du socle. Un jeton qui n'y est pas\n      déclaré n'est lu par personne : le gabarit propose de régler une variable morte.\n      Déclare-le dans ${SOCLE.join(' ou ')}, ou retire-le du gabarit.`]);

if (erreurs.length) {
  console.error(`\n✗ contrat — ${GABARIT} ne tient pas :\n`);
  for (const [titre, liste, remede] of erreurs) {
    console.error(`    ${titre} :`);
    console.error(`      ${liste.join(' ')}`);
    console.error(`      ${remede}\n`);
  }
  process.exit(1);
}
console.log(`✓ contrat — OBLIGATOIRE : ${g.root.size} jetons au gabarit, ${m.root.size} à la marque par défaut `
  + `(+${METIER.size} métier optionnels) · .dark : ${g.dark.size} exigés, ${m.dark.size} déclarés`);
console.log(`✓ contrat — FACULTATIF : ${proposes.length} jetons de forme proposés, tous déclarés dans le socle`);

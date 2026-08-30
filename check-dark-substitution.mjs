/**
 * Filet anti-SUBSTITUTION FIGÉE entre `:root` et `.dark`.
 *
 * LE DÉFAUT QU'IL FERME. Un jeton dont la valeur contient `var(Y)` est substitué sur
 * l'élément où il est DÉCLARÉ, pas sur celui où il est employé — puis le résultat, déjà
 * résolu, est hérité. Un jeton déclaré en `:root` seulement, dont la valeur référence un
 * jeton qui, lui, change en `.dark`, fige donc la valeur CLAIRE et l'emporte telle quelle
 * dans toute section sombre.
 *
 *     :root { --muted-foreground:#6b6966;
 *             --pill-neutral-bg: color-mix(in srgb, var(--muted-foreground) 12%, transparent) }
 *     .dark { --muted-foreground:#b0aea9 }        <-- --pill-neutral-bg n'est pas redéclaré
 *
 *     <div class="dark">  ->  --pill-neutral-bg vaut encore le mix du gris CLAIR.
 *
 * Ni erreur, ni avertissement : la variable existe, elle a une valeur, elle est simplement
 * fausse. Rien dans `tsc`, dans tsup, dans Vite ni dans check-contrast.mjs ne peut la voir.
 *
 * CE QUE LA VITRINE NE PEUT PAS MONTRER — l'apprentissage qui a coûté le diagnostic.
 * Quand `.dark` est posé sur `<html>`, `:root` et `.dark` matchent LE MÊME ÉLÉMENT : la
 * substitution s'y fait contre les valeurs sombres et tout est correct. Le défaut n'existe
 * QUE dans une section `.dark` IMBRIQUÉE au milieu d'une page claire. La vitrine bascule
 * `<html>`, donc la vitrine ne l'a jamais montré et ne le montrera jamais. Aucune recette
 * visuelle ne remplace ce contrôle. Trouvé au sous-lot 2 en comparant un ratio calculé à un
 * ratio lu au `getComputedStyle` : ils divergeaient d'exactement 1,0.
 *
 * LA RÈGLE. Tout jeton déclaré en `:root` dont la valeur contient `var(Y)`, où Y est
 * redéclaré en `.dark`, DOIT être redéclaré en `.dark` lui aussi — la même expression suffit,
 * ce qui compte est l'élément porteur. La dépendance est TRANSITIVE : si A vaut var(B) et
 * que B devient sensible au thème, A l'est aussi.
 *
 * NB — la règle ne regarde PAS si les deux valeurs de Y diffèrent aujourd'hui. `--primary`
 * peut valoir la même chose dans les deux thèmes chez une marque et pas chez la suivante.
 * Le contrôle est volontairement strict.
 *
 * UNE MARQUE À LA FOIS. Le dépôt n'en porte plus qu'une — la marque d'exemple — mais la
 * règle reste : analyser plusieurs marques ensemble produirait de faux positifs (un jeton
 * déclaré par l'une, un `var()` redéclaré en `.dark` par l'autre, et le contrôle
 * signalerait une violation qui n'existe dans aucun montage réel). Chaque marque trouvée
 * est donc confrontée au SOCLE SEUL, séparément. `brand.template.css` est ignoré (valeurs
 * vides) et les `*-entry.css` aussi (des montages, pas des marques).
 *
 * Usage : node check-dark-substitution.mjs   (STYLES=<dossier> pour un autre arbre de styles)
 */
import fs from 'node:fs';
import path from 'node:path';

/* DEUX DOSSIERS SCANNÉS. `demo/` a déjà porté une marque de recette à côté de celle de
   `src/styles` : ne scanner qu'un dossier perdrait une marque sans rien dire. Le SOCLE,
   lui, ne vit que dans le premier — les fichiers de `demo/` ne servent que de marques. */
const DIRS = (process.env.STYLES || 'src/styles,demo').split(',').filter(d => fs.existsSync(d));

/* Les écarts TOLÉRÉS. Chaque entrée est une dette datée, pas une dispense.
   Une entrée qui n'a plus de raison d'être doit disparaître avec son jeton. */
const EXCEPTIONS = {
  /* VIDE, et c'est l'état normal. Les deux seules entrées qu'il ait jamais portées étaient
     des alias non publiés, supprimés au sous-lot 6 : l'exception est morte avec le jeton,
     comme sa note l'annonçait. Une entrée ajoutée ici doit dire POURQUOI et JUSQU'À QUAND. */
};

/* ---------- inventaire ---------- */
const tous = [];
for (const racine of DIRS) (function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (['node_modules', 'dist', 'src'].includes(e.name)) continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p); else if (e.name.endsWith('.css')) tous.push(p);
  }
})(racine);

const estGabarit = f => path.basename(f) === 'brand.template.css';
/* `brand-content.css` porte le préfixe mais n'est PAS une marque : c'est l'extension
   métier, de la structure sans valeurs. Elle appartient au socle de chaque lot. */
const estExtension = f => path.basename(f) === 'brand-content.css';
/* `brand-entry.css` porte le préfixe mais n'est qu'un MONTAGE : deux @import, zéro jeton. */
const estMontage = f => /-entry\.css$/.test(path.basename(f));
const estMarque = f => /^brand-.*\.css$/.test(path.basename(f))
  && !estGabarit(f) && !estExtension(f) && !estMontage(f);
const SOCLE = tous.filter(f => !estMarque(f) && !estGabarit(f) && !estMontage(f));
const MARQUES = tous.filter(estMarque);
/* Aucun fichier de marque sous DIR : on analyse ce qu'il y a, en un seul lot — c'est le
   cas d'un STYLES= qui pointe sur un dossier ne contenant qu'une palette. */
const LOTS = MARQUES.length
  ? MARQUES.map(m => ({ nom: path.basename(m), files: [...SOCLE, m] }))
  : [{ nom: DIR, files: tous }];

// `.dark .ds-x{` ne matche pas : entre le sélecteur et `{` il n'y a que des blancs.
const SELECTOR = /(:root|\.dark)\s*\{/g;

function lire(files) {
  const ROOT = new Map(), DARK = new Map();   // jeton -> [{valeur, fichier}]
  let nRoot = 0, nDark = 0;
  for (const f of files) {
    const src = fs.readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    SELECTOR.lastIndex = 0;
    let m;
    while ((m = SELECTOR.exec(src))) {
      const s = src.slice(SELECTOR.lastIndex);
      let d = 1, j = 0;
      while (d > 0 && j < s.length) { if (s[j] === '{') d++; if (s[j] === '}') d--; j++; }
      const body = s.slice(0, j - 1);
      const into = m[1] === ':root' ? ROOT : DARK;
      if (m[1] === ':root') nRoot++; else nDark++;
      for (const dcl of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
        if (!into.has(dcl[1])) into.set(dcl[1], []);
        into.get(dcl[1]).push({ valeur: dcl[2].trim(), fichier: f });
      }
    }
  }
  return { ROOT, DARK, nRoot, nDark };
}

/* ---------- le garde-fou du garde-fou ---------- */
const sonde = lire(tous);
if (sonde.nRoot === 0 || sonde.nDark === 0 || sonde.ROOT.size === 0 || sonde.DARK.size === 0) {
  console.error(`
✗ substitution — le contrôle n'a rien à contrôler, ce qui est un ÉCHEC, pas un succès.
    dossier scanné : ${DIR}   fichiers .css : ${tous.length}
    blocs :root : ${sonde.nRoot} (${sonde.ROOT.size} jetons)   blocs .dark : ${sonde.nDark} (${sonde.DARK.size} jetons)
  Un thème sombre déclaré autrement qu'en \`.dark{…}\` — media query, attribut, autre classe —
  rend ce contrôle aveugle : il passerait au vert sur un dépôt entièrement cassé. Adapte le
  script au nouveau porteur de thème, ne le laisse pas vert à vide.
`);
  process.exit(1);
}

/* ---------- une marque à la fois ---------- */
let codeSortie = 0;
const déjàDit = new Set();

for (const lot of LOTS) {
  const { ROOT, DARK } = lire(lot.files);

  /* sensibilité au thème, transitive */
  const sensibles = new Set(DARK.keys());
  for (let change = true; change;) {
    change = false;
    for (const [nom, decls] of ROOT) {
      if (sensibles.has(nom)) continue;
      for (const d of decls)
        for (const r of d.valeur.matchAll(/var\((--[\w-]+)\)/g))
          if (sensibles.has(r[1])) { sensibles.add(nom); change = true; }
    }
  }

  const violations = [];
  for (const [nom, decls] of ROOT) {
    if (DARK.has(nom)) continue;
    for (const d of decls) {
      const refs = [...d.valeur.matchAll(/var\((--[\w-]+)\)/g)]
        .map(r => r[1]).filter(y => sensibles.has(y));
      if (refs.length) { violations.push({ nom, ...d, refs: [...new Set(refs)] }); break; }
    }
  }

  const dures = violations.filter(v => !(v.nom in EXCEPTIONS));
  const tolérées = violations.filter(v => v.nom in EXCEPTIONS);
  const périmées = Object.keys(EXCEPTIONS).filter(n => !violations.some(v => v.nom === n));

  if (dures.length) {
    codeSortie = 1;
    console.error(`\n✗ substitution — ${lot.nom} : ${dures.length} jeton(s) figent la valeur CLAIRE dans une section .dark imbriquée :\n`);
    for (const v of dures) {
      console.error(`    ${v.nom}   (${v.fichier})`);
      console.error(`      valeur     : ${v.valeur}`);
      for (const y of v.refs) {
        const l = ROOT.get(y)?.[0]?.valeur ?? '(non déclaré en :root)';
        const dk = DARK.get(y)?.[0]?.valeur ?? '(sensible par transitivité)';
        console.error(`      dépend de  : ${y}   clair ${l}   sombre ${dk}`);
      }
      console.error('');
    }
    console.error(`  Correctif : redéclarer le jeton dans le bloc \`.dark\` DE CE FICHIER DE MARQUE — la
  MÊME EXPRESSION suffit, ce qui compte est l'élément qui porte la déclaration, pas la
  valeur écrite.

      .dark{ ${dures[0].nom}:${dures[0].valeur}; }

  Ou, si le jeton est un alias en sursis : l'inscrire dans EXCEPTIONS de ce fichier AVEC la
  date de sa mort. Pas sans.
`);
    continue;
  }
  /* Ces jetons-là sont du SOCLE : les répéter à chaque marque serait du bruit. */
  for (const v of tolérées) if (!déjàDit.has(v.nom)) { déjàDit.add(v.nom); console.warn(`⚠ substitution — ${v.nom} toléré — ${EXCEPTIONS[v.nom]}`); }
  for (const n of périmées) if (!déjàDit.has('périmée:' + n)) { déjàDit.add('périmée:' + n); console.warn(`⚠ substitution — l'exception ${n} ne correspond plus à aucune violation, retire-la d'EXCEPTIONS.`); }
  console.log(`✓ substitution — ${lot.nom} : ${ROOT.size} jetons :root · ${DARK.size} .dark · ${sensibles.size} sensibles au thème · aucun ne fige la valeur claire${tolérées.length ? ` (${tolérées.length} toléré${tolérées.length > 1 ? 's' : ''})` : ''}`);
}

process.exit(codeSortie);

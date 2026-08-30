/**
 * L'échelle des surfaces — l'effondrement, MESURÉ, à chaque `npm run lint`.
 *
 * LE DÉFAUT QU'IL FERME. Un portage a livré un thème sombre où card, popover,
 * secondary et muted portaient LA MÊME valeur. Tout passait au vert — types,
 * collisions, substitution, contraste — parce qu'aucun de ces contrôles ne compare
 * une surface à sa PORTEUSE. Résultat : neuf sites invisibles. Les rayures de table
 * ne rayaient rien, le champ désactivé était un trou, le dropdown ne flottait pas,
 * le badge accent perdait sa plaque. Un écart de luminance de 1,000 est strictement
 * invisible, et cinq gris quasi identiques se ressemblent parfaitement sur une
 * maquette : seul un contrôle qui MESURE peut l'attraper.
 *
 * LA RÈGLE. Les surfaces qui se COMPOSENT doivent se distinguer : muted sur card,
 * secondary sur card, popover sur card, accent sur card, card sur background,
 * surface-alt sur ses porteuses. Chaque paire doit tenir un écart de luminance
 * minimal, dans les DEUX thèmes. --accent bénéficie d'une échappatoire de CHROMA :
 * une plaque teintée peut se distinguer par la teinte à luminance proche — c'est son
 * rôle. Une paire qui échoue DOIT être déclarée `@surface-assume:` DANS LE FICHIER
 * DE MARQUE, avec sa raison. Sinon le build tombe.
 *
 * Usage : node check-surfaces.mjs            (toutes les marques du dépôt)
 *         TOKENS=<chemin> node check-surfaces.mjs   (une marque isolée)
 */
import fs from 'node:fs';
import path from 'node:path';

/* ---------- mesure ---------- */
const hex = h => { h = h.replace('#', ''); if (h.length === 3) h = [...h].map(c => c + c).join('');
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
const lin = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = h => { const [r, g, b] = hex(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const dist = (a, b) => { const p = hex(a), q = hex(b);
  return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]); };

/* ---------- les paires du système ----------
   [surface, porteuse, seuil, chroma?]  ·  chroma = une distance RVB qui suffit à
   distinguer la paire même sous le seuil de luminance (réservé à la plaque --accent). */
const PAIRES = [
  ['--card',        '--background', 1.04, 0,  'la carte sur la page'],
  ['--muted',       '--card',       1.04, 0,  'rayures de table, champ désactivé'],
  ['--secondary',   '--card',       1.04, 0,  'champ, barre d\'onglets, pagination dans une carte'],
  ['--popover',     '--card',       1.03, 0,  'dropdown / modale au-dessus d\'une carte'], // 1,03 : la surface flottante porte AUSSI une ombre et une bordure
  ['--accent',      '--card',       1.04, 12, 'plaque de badge et de bandeau sur une carte'],
  ['--surface-alt', '--card',       1.03, 0,  'survol, rail de progression, shimmer sur une carte'],
  ['--surface-alt', '--secondary',  1.03, 0,  'survol d\'un contrôle secondaire'],
];

/* ---------- lecture des marques (même contrat que check-contrast.mjs) ---------- */
const DOSSIERS = (process.env.STYLES || 'src/styles,demo').split(',');
function marquesLivrées() {
  const out = [];
  for (const d of DOSSIERS) {
    if (!fs.existsSync(d)) continue;
    for (const n of fs.readdirSync(d).sort()) {
      if (!/^brand-.*\.css$/.test(n)) continue;
      if (n === 'brand-content.css' || n === 'brand.template.css') continue;
      if (/-entry\.css$/.test(n)) continue;
      out.push(path.join(d, n));
    }
  }
  return out;
}
const CIBLES = process.env.TOKENS ? [process.env.TOKENS] : marquesLivrées();
if (!CIBLES.length) {
  console.error(`\n✗ surfaces — aucune marque trouvée dans ${DOSSIERS.join(', ')}.\n`);
  process.exit(1);
}

function lireMarque(fichier) {
  const brut = fs.readFileSync(fichier, 'utf8');
  const src = brut.replace(/\/\*[\s\S]*?\*\//g, '');
  const block = sel => { const i = src.indexOf(sel + '{');
    if (i < 0) throw new Error(`${fichier} : bloc ${sel} introuvable`);
    const s = src.slice(i + sel.length + 1); let d = 1, j = 0;
    while (d > 0) { if (s[j] === '{') d++; if (s[j] === '}') d--; j++; }
    return s.slice(0, j - 1); };
  const parse = t => Object.fromEntries([...t.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(m => [m[1], m[2].trim()]));
  const assumées = Object.fromEntries(
    [...brut.matchAll(/@surface-assume:[ \t]*(.+?)[ \t]*\r?\n([\s\S]*?)\*\//g)]
      .map(m => [m[1].trim(), m[2].replace(/\s+/g, ' ').trim()]));
  return { ROOT: parse(block(':root')), DARK: parse(block('.dark')), assumées };
}

function resolve(v, scope, fichier, d = 0) {
  if (d > 12) throw new Error(`${fichier} : référence circulaire : ${v}`);
  v = String(v).trim();
  const m = /^var\((--[\w-]+)\)$/.exec(v);
  if (m) { const next = scope[m[1]];
    if (next === undefined) throw new Error(`${fichier} : jeton ${m[1]} absent`);
    return resolve(next, scope, fichier, d + 1); }
  if (!/^#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?$/.test(v))
    throw new Error(`${fichier} : ${v} n'est pas un hexa simple — une surface du contrat doit l'être`);
  return v;
}

/* ---------- verdict ---------- */
const F = r => r.toFixed(3);
let échec = false;
for (const cible of CIBLES) {
  const { ROOT, DARK, assumées } = lireMarque(cible);
  const nom = path.basename(cible);
  const restants = new Set(Object.keys(assumées));
  const manques = [];
  for (const theme of ['clair', 'sombre']) {
    const scope = theme === 'sombre' ? { ...ROOT, ...DARK } : ROOT;
    for (const [a, b, seuil, chroma, site] of PAIRES) {
      const clé = `${a} / ${b} — ${theme}`;
      const ca = resolve(scope[a], scope, cible), cb = resolve(scope[b], scope, cible);
      const r = ratio(ca, cb), dc = dist(ca, cb);
      const ok = r >= seuil || (chroma > 0 && dc >= chroma);
      if (ok) {
        if (assumées[clé] !== undefined) {
          console.warn(`⚠ surfaces — ${nom} : « ${clé} » tient désormais (${F(r)}) — retire son @surface-assume.`);
          restants.delete(clé);
        }
        continue;
      }
      if (assumées[clé] !== undefined) { restants.delete(clé); continue; }
      manques.push(`  ✗ ${clé} : ${ca} sur ${cb} — écart ${F(r)}${r < 1.001 ? ' (STRICTEMENT INVISIBLE)' : ''} < ${seuil}
    ${site}. Corrige la valeur, ou assume par écrit :
    /* @surface-assume: ${clé}
       <pourquoi cet écart tient quand même (ombre portée, bordure, teinte…)> */`);
    }
  }
  for (const clé of restants)
    console.warn(`⚠ surfaces — ${nom} : @surface-assume « ${clé} » ne correspond à aucune paire mesurée — clé inexacte ?`);
  if (manques.length) {
    échec = true;
    console.error(`\n✗ surfaces — ${nom} : ${manques.length} paire(s) effondrée(s)\n\n${manques.join('\n\n')}\n`);
  } else {
    const n = Object.keys(assumées).length;
    console.log(`✓ surfaces — ${nom} : échelle tenue dans les deux thèmes${n ? ` (${n} écart(s) assumé(s) par écrit)` : ''}`);
  }
}
process.exit(échec ? 1 : 0);

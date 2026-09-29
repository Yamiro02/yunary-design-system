# Fabriquer le design system d'un client à partir de ce dépôt

Ce dépôt est un **squelette de design system**. Il est bâti en deux couches qui ne se
mélangent pas — un **socle** générique, et une **marque** — de sorte qu'on en fabrique un
autre en remplaçant la seconde. La marque livrée, `brand-yunary.css`, fait s'afficher la
vitrine ; le socle, lui, est neutre : aucune couleur, aucune police, aucun nom.

**Le lecteur de ce document est un agent** — Claude Design, à qui on donne le dépôt et le
brief d'un client. Il vaut aussi pour un humain : les étapes et leurs points de vérification
sont les mêmes.

---

## Le résultat visé

Un dossier **indépendant pour toujours**. Pas de dépendance à ce dépôt, pas de jeton d'accès
à un dépôt privé, pas de mise à jour à suivre. Le client possède tout son code.

C'est pour ça qu'on **copie le dossier** au lieu d'installer le paquet. Des apps qui
partagent un socle, elles, l'installent — ce sont deux usages différents et ils n'ont pas
les mêmes besoins.

---

## Ce à quoi on ne touche JAMAIS

Le socle. Il est générique, il ne porte aucune couleur, aucune police, aucun nom.

```
src/styles/core.css · src/styles/theme.css · src/styles/patterns.css
src/styles/tokens/base.css · tokens/typography.css · tokens/scales.css · tokens/derives.css
src/components/**  ·  src/index.ts  ·  les check-*.mjs et check-literals.sh
```

Il n'y a **aucune exception** : tout ce qui porte de l'identité — couleurs, polices,
rayons compris — se déclare dans le fichier de marque, jamais dans le socle. Les rayons
se REDÉCLARENT côté marque (étape 4), le socle ne bouge pas.

---

## 0 · Copier, installer, voir tourner *(5 min)*

Copiez le dossier. Puis :

```bash
npm run setup
```

```bash
npm run demo
```

→ `http://localhost:5273`

**Vérification :** neuf onglets, une bascule Clair / Sombre / Côte à côte, un interrupteur
« Échelle d'app », et le mark de la **marque livrée** en haut à gauche.

C'est encore SON design system. Les étapes qui suivent le remplacent par celui du
client.

---

## 1 · Mettre la marque livrée de côté *(1 min)*

**Attention à l'ordre : l'étape 3 part d'une COPIE de `brand-yunary.css`.** Faites cette
copie d'abord — ou gardez la marque livrée montée le temps d'écrire la vôtre et ne la
supprimez qu'à la fin : la vitrine reste visible pendant tout le travail, ce qui aide à
comparer.

Le moment venu, **deux choses, et c'est tout** :

```bash
rm src/styles/brand-yunary.css
```

```bash
rm -f src/styles/assets/fonts/*
```

La première est la palette livrée — ses couleurs, ses dégradés, ses lueurs, ses
`@font-face`. La seconde vide le dossier des polices auto-hébergées (Onest, DM Sans,
DM Mono) : celles du projet viendront à la place.

Retirez aussi son entrée d'`exports` dans `package.json` :

```
"./brand-yunary.css": "./src/styles/brand-yunary.css",
```

Un export qui pointe sur un fichier absent est pire que le fichier.

**Vérification :** si vous supprimez avant d'avoir remonté le montage de l'étape 3, la
vitrine ne démarre plus — `demo/brand-yunary-entry.css` importe un fichier qui n'existe pas. C'est
le comportement attendu, et c'est la raison d'être des deux couches : un manque casse, il
ne dérive pas.

---

## 2 · Renommer le paquet et l'identité *(1 min)*

```bash
npm run rebrand -- "@client/ds" "Nom Du Client"
```

Il renomme le paquet partout, réécrit `src/brand.ts` — nom, monogramme, mot-marque —, remet
la version à `0.1.0`, met la ligne d'installation du README sur un gabarit d'URL, et change
le titre de la vitrine.

**Il ne crée aucun fichier de marque.** La marque se fabrique à l'étape 3, en copiant
`brand-yunary.css` puis en repeignant chaque valeur.

Idempotent, relançable sans dégât. `--monogram XY` force les initiales.

**Vérification :** `grep -ril "acme" .` ne sort plus que des fichiers de prose que vous
réécrivez à l'étape 7 — jamais `src/`.

---

## 3 · Écrire la marque *(20 min)* — **c'est le vrai travail**

Copiez `src/styles/brand-yunary.css` en `src/styles/brand-<client>.css` : partir de la
marque livrée donne tous les emplacements dans le bon ordre, avec leurs commentaires —
et comme on repeint chaque valeur, on n'hérite d'aucune couleur. Gardez
[`src/styles/brand.template.css`](src/styles/brand.template.css) ouvert à côté : **c'est le
contrat** — il dit ce que chaque jeton doit tenir, et il se suffit à lui-même.

**55 jetons obligatoires** en `:root`, dont **au moins 32** à redéclarer en `.dark`.

Puis, tout en bas du gabarit, une **§ FACULTATIF** de 35 jetons de **forme** — les sept
arrondis, le rail de contrôles et les dimensions de composants : hauteur de navbar,
largeur de tiroir, arrondi de barre d'onglets, taille de case à cocher. Elle ne se comporte
**pas** comme le § 3, et c'est voulu :

|  | § 3 · identité | § 4 · forme |
|---|---|---|
| Couleurs, polices, dégradés, lueurs | oui | — |
| Arrondis, rail, dimensions | — | oui |
| Si vous en oubliez un | **ça casse à l'écran** | **ça retombe sur le socle** |
| Pourquoi | un repli livrerait la couleur de quelqu'un d'autre | `4.5rem` n'est la marque de personne |

Le § 4 est livré **entièrement commenté**, chaque ligne portant la valeur du socle. Vous
décommentez uniquement ce que vous changez. Une marque qui n'y touche pas rend exactement ce
que rend le socle — c'est le cas normal. `brand-yunary.css` n'y redéclare que le padding de
carte, la largeur de barre latérale et le titre de page.

Les cinq points qui coûtent une demi-journée si on les rate :

1. **`--card` doit se détacher de `--background`.** S'ils sont identiques, toutes les cartes
   disparaissent.
2. **`--text-muted` sur `--card`** est le couple qui casse le contraste. En clair **et** en
   sombre.
3. **`--primary` n'est jamais une couleur de texte.** C'est un remplissage : posé comme texte
   sur une surface claire, il n'atteint pas 4,5:1. Le contenu — texte et icône — prend
   `--primary-readable`. Idem `--destructive-readable`.
4. **`--heading-transform` et `--heading-weight` découlent de la face display.** Une
   condensée à capitales veut `uppercase` + `var(--weight-regular)` ; une grotesque
   classique, `none` + `var(--weight-bold)`. Une serif rendue en capitales 400 n'est le
   choix de personne.
5. **Un jeton dont la valeur contient `var()` doit être redéclaré dans `.dark`** s'il dépend
   d'un jeton qui change de thème. Sinon il fige la valeur claire dans toute section sombre
   imbriquée.

Déposez les `.woff2` du client dans `src/styles/assets/fonts/` et posez les `@font-face` en
tête de votre fichier de marque.

Puis montez-le. Renommez `demo/brand-yunary-entry.css` en `demo/brand-<client>-entry.css`,
mettez à jour son second `@import` et l'alias correspondant dans `demo/vite.config.ts` :

```css
@import '../src/styles/core.css';
@import '../src/styles/brand-<client>.css';
```

Et `demo/src/identity.ts` porte le **contenu** de la vitrine — nom affiché, lieu, prénom
d'exemple. Ce ne sont pas des jetons, `rebrand` n'y touche pas : mettez-les au client.

**Vérification :**

```bash
TOKENS=src/styles/brand-<client>.css node check-contrast.mjs
```

```bash
node check-dark-substitution.mjs
```

```bash
node check-contract.mjs
```

Les trois en `✓`. Puis `npm run demo`, onglet **Fondations**, mode **Côte à côte** : chaque
pastille se distingue de sa voisine, dans les deux thèmes.

---

## 4 · Les rayons *(2 min)* — dans le fichier de marque

Le réglage d'identité le plus visible après la couleur. Trois options :

- tels quels — doux, orienté outil
- divisés par ~2 — technique, dense
- multipliés par ~1.4 — grand public

Les rayons se **redéclarent dans le fichier de marque** — voir le § 4.1 de
`brand.template.css`, qui liste les sept paliers avec leurs défauts en commentaire (une
ligne décommentée, par exemple `--radius-lg:0.125rem;`, suffit). Le socle
(`tokens/scales.css`) porte les défauts et **ne se touche pas** : ce document ne vous
demande d'ouvrir aucun fichier du socle.

Gardez la **progression** : un élément imbriqué a toujours un rayon plus petit que son
contenant.

**Vérification :** onglet **Fondations** › Rayons. Chaque cran se voit.

---

## 5 · Le logo *(5 min)*

Par défaut, le mark est rendu **en CSS** : capitales de la face display + un point carré
arrondi en dégradé. Il s'inverse tout seul avec le thème et ne coûte aucune requête. Son
mot-marque et son monogramme viennent de `src/brand.ts`, que `rebrand` a déjà rempli.

Si le mot-marque du client n'est pas en capitales alors que son titrage l'est, ajoutez dans
son fichier de marque : `.ds-logo{text-transform:none}`.

S'il a un logo vectoriel : remplacez le corps de
[`Logo.tsx`](src/components/brand/Logo.tsx) par le SVG — en gardant l'API `variant`,
`letters`, `height`.

**Vérification :** onglet **Marque**. Les trois variantes rendent, le mark reste net de 1rem
à 2.5rem, et les lettres s'inversent avec le thème.

---

## 6 · La recette *(20 min)*

Déroulez la démo onglet par onglet, en **Côte à côte**, et regardez les **états** : survol,
focus, pressé, désactivé. C'est l'étape qu'on est tenté de sauter, et celle qui rapporte le
plus — un jeton oublié dans `.dark` se voit ici en trois secondes.

```bash
npm run lint
```

Enchaîne le typecheck et les gardes du dépôt : jetons, version, contrat, collisions
d'utilitaires, substitution figée, contraste, surfaces, catalogue…

**Vérification :** `✓` sur toutes les lignes.

---

## 7 · Réécrire les documents qui parlent encore d'ici

Ils sont à vous maintenant, ils ne se suppriment pas :

| Fichier | Ce qu'il devient |
|---|---|
| `README.md` | la vitrine du paquet du client |
| `CHANGELOG.md` | reparti de sa `0.1.0` |
| `docs/accessibilite.md` | la méthode vaut, les ratios non — régénérez les tableaux avec `node check-contrast.mjs --table` |
| `docs/DESIGN.md` | la charte du client, à remplir |

---

## 8 · Publier

```bash
npm run build
```

```bash
git init && git add -A && git commit -m "design system initial"
```

Renseignez le compte et le dépôt dans la ligne d'installation du `README.md` — `rebrand` y a
laissé un gabarit — **puis** :

```bash
git tag -a v0.1.0 -m "v0.1.0" && git push --follow-tags
```

```bash
node check-version.mjs
```

Il vérifie que `package.json`, la ligne du README et le tag disent le même numéro. **Les
trois d'un coup, jamais l'un sans les autres.**

Dans l'app qui le consomme :

```ts
// src/main.tsx — les fondations, en JS. DEUX imports, jamais un.
import '@client/ds/core.css';
import '@client/ds/brand-<client>.css';
```

```css
/* src/styles.css — la couche Tailwind, en CSS, jamais depuis le JS */
@import "@client/ds/theme.css";
```

> **Il n'y a pas de preset.** `theme.css` porte lui-même les `@import "tailwindcss/…"` :
> l'app ne doit **pas** écrire `@import "tailwindcss";` de son côté, elle chargerait
> Tailwind deux fois — et le second preflight arriverait APRÈS le reset du design system
> et l'écraserait. Le socle, lui, PORTE son preflight : il est versé dans le dépôt et
> chargé par `core.css` juste avant son propre reset, dans le même fichier, pour que
> l'ordre soit garanti. Il n'y a rien à ajouter de ton côté.

---

## Ensuite

- **Ajouter un composant** → il rejoint sa famille dans `src/components/`, s'exporte depuis
  `src/index.ts`, et **apparaît dans la démo** le jour même. Avant, passez-le par les quatre
  tests de [`GOVERNANCE.md`](GOVERNANCE.md).
- **Ajouter un jeton** → `tokens/*.css` s'il décrit une mesure, le **fichier de marque** s'il
  décrit une couleur ou une police. Il s'expose dans `theme.css`, s'ajoute au contrat
  (`brand.template.css`) et à `demo/src/pages/Foundations.tsx`.
- **Un composant qui connaît le métier du client** ne vit pas ici. Test : s'il a besoin de
  savoir ce que fait le produit, il part dans l'app.

# Catalogue d'usage des composants

Le second fichier qu'un agent lit, après `PORTAGE.md`, avant d'écrire un écran.
Une section par composant : à quoi il sert, quand ne PAS l'utiliser, un exemple minimal
qui compile, et les états qu'il sait rendre.

Ce document est **gardé par `check-catalogue.mjs`** : chaque composant exporté par
`src/index.ts` doit avoir sa section ici, chaque section doit correspondre à un export
réel, et chaque `<Icon name="…">` cité doit exister dans le type `IconName`. Si vous
ajoutez un composant, ajoutez sa section — le build vous le rappellera.

Les exemples supposent les imports depuis la racine du paquet :

```tsx
import { Button, Card, Icon } from '@yunary/ds';
```

**➜ Les pièges du socle sont rassemblés dans [`PIEGES.md`](PIEGES.md)** — un par section,
avec ce qui casse, pourquoi la panne est muette, la parade, et le garde qui l'attrape quand
il y en a un. Ce qui suit en reprend l'essentiel au fil des composants ; la page en est la
version complète, et c'est elle qu'on lit avant d'écrire un écran.

**⚠️ LA DOCTRINE, avant les cas particuliers : aucune valeur du socle ne doit être hors
de portée de l'appelant.** Trois formes d'un même mal, toutes constatées en usage réel :

1. la valeur est **battue par la cascade** — `.accent`, `.mono` : la couche des
   utilitaires ou des composants gagne toujours, la panne est muette ;
2. la valeur est **hors d'atteinte de la cascade** — un défaut de design écrit en style
   inline, un nœud sans classe : aucun sélecteur ne peut viser la valeur, même en
   théorie ;
3. la valeur est **atteignable mais non prévue pour varier** — les quatre mesures de
   `.ds-logo__dot` : une classe parfaitement ciblable, mais rien ne dit que ces valeurs
   sont censées varier, donc la seule façon d'en changer est de les recopier.

Même issue à chaque fois : le projet recopie ou surcharge, et le socle ne le sait pas.
C'est la doctrine du socle prise à revers — il fournit les VALEURS, l'app écrit les NOMS.
Le premier réflexe de revue, sur tout nouveau composant comme sur tout écran : **cette
valeur, l'appelant peut-il la reprendre ?** Si non, elle est mal placée, quel que soit le
moyen. Et la forme 3 impose la seconde question : **si oui, le sait-il ?** — une valeur
reprise en aveugle est une valeur recopiée.

**La règle du style inline** — elle décide où une valeur a le droit de vivre :

- **Légitime** quand la valeur vient de l'appelant à chaque rendu — `Skeleton`, `Avatar`,
  `Logo`, `Progress` : la prop EST la valeur, il n'y a rien à redéfinir.
- **Illégitime** dès qu'il porte un **défaut**. Un défaut est un arbitrage de design ;
  l'écrire inline le range au seul endroit du langage que la cascade n'atteint pas.
  `Glyph` et `Spinner` faisaient exactement ça — corrigé en v0.3.0 : le défaut vit dans
  le repli de `var(--ds-icon-size, 1.25rem)`, côté cascade, où un créneau peut le battre.
- **Sans excuse** quand il n'y a même pas de prop — l'astérisque de `FormField`, le hint
  de `Dropdown` : une décision du socle qu'aucun sélecteur ne pouvait viser. Corrigés
  (`.ds-label__required`, `.ds-dropdown__hint`).

**⚠️ Les utilitaires de marque perdent contre les composants.** Les huit de
`tokens/base.css` — `.display`, `.display-xl`, `.eyebrow`, `.chip`, `.accent`, `.mono`,
`.caption`, `.prose` — vivent en `layer(base)` ; les redéclarations de `patterns.css`
vivent en `layer(components)` et gagnent toujours sur le même nœud, quelle que soit la
spécificité. `.mono` posé sur un nœud qu'une règle `.ds-*` typographie ne rend rien, en
silence. **La parade** : l'utilitaire Tailwind équivalent sur le même jeton — `font-mono`
lit `--font-mono` et vit en `layer(utilities)`, il gagne. On ne déplace pas la couche.

**⚠️ Deux classes CSS pièges, avant tout écran : `.accent` et `.eyebrow`.** Elles peignent
le dégradé de marque dans le texte par quatre déclarations solidaires (`background`,
`background-clip: text`, `color: transparent`, `width: fit-content`) en `layer(base)` — un
utilitaire posé sur le même nœud vit en `layer(utilities)` et gagne toujours, sans rien
casser à l'écran. **Dangereux** : couleur, fond, `background-clip`, dimension (`text-*` de
couleur, `bg-*`, `w-*`…) — le dégradé meurt en silence. **Sans risque** : la typographie
(`font-*`, paliers `text-heading`…, `leading-*`). La mise en page va sur un span externe.

---

# actions

## Button

L'action du système. `primary` porte le dégradé de marque et la lueur : c'est LE CTA de la
vue — un seul par écran. Tout le reste est `secondary`, `ghost` ou `danger`.

**Ne pas l'utiliser** pour une action icône seule (c'est `IconButton`), ni pour un lien de
navigation dans du texte (un `<a>` suffit).

```tsx
<Button variant="primary" size="lg" iconRight={<Icon name="arrow-right" />}>On build une app</Button>
<Button variant="secondary" icon={<Icon name="play" />}>Voir la démo</Button>
<Button variant="ghost" size="sm">Annuler</Button>
<Button variant="danger" icon={<Icon name="triangle-alert" />}>Supprimer</Button>
<Button loading>Génération…</Button>
<Button as="a" href="/inscription">S'inscrire</Button>
<Button variant="secondary" surface="card">Dans un conteneur qui n'est pas une Card</Button>
```

- Props : `variant` (`primary·secondary·ghost·danger`) · `size` (`sm·md·lg`) · `surface`
  (`auto·page·card`) · `icon` / `iconRight` · `loading` (spinner + désactivé) · `fullWidth`
  · `as` / `href`.
- **`surface` déclare à la main la surface qui porte le bouton**, jumelle de celle
  d'`Input`. Le squelette ne DÉDUIT rien : `secondary` porte `--secondary` partout, et
  `auto` (défaut) est donc l'état normal. `card` force `--background`, pour un conteneur
  qui n'a que l'apparence d'une carte. `page` force `--secondary` — inerte tant que
  `patterns.css` ne déduit pas la surface, indispensable le jour où il le fait : une
  déduction ne prévoit qu'un bouton posé SUR une carte, jamais sur un panneau imbriqué
  dedans. Sans effet sur `ghost`, `primary` et `danger`.
- Rayon toujours `--radius-md`. **Jamais un pill** — le pill est réservé aux badges.
- Rail partagé : min-height 3rem (2.75rem sous 64rem). `lg` (3.25rem) = CTA de héros.
- **Les icônes ne se dimensionnent pas au site d'appel** : le créneau du bouton s'en
  charge (sm 1rem · md 1.125rem, via `--ds-icon-size` — voir la section Icon). Le spinner
  de `loading` prend la même taille que l'icône qu'il remplace.
- États rendus : repos, hover (lueur + translateY), pressé, focus-visible, désactivé,
  loading.

## IconButton

Bouton carré à icône seule — copier, fermer, basculer. `label` est **obligatoire** : il
devient `aria-label` et `title`.

**Ne pas l'utiliser** quand un libellé texte est possible : un bouton qui peut dire ce
qu'il fait le dit.

```tsx
<IconButton label="Copier le prompt"><Icon name="copy" /></IconButton>
<IconButton label="Fermer" variant="secondary" size="sm"><Icon name="x" /></IconButton>
<IconButton label="Boutique" variant="accent" as="a" href="/boutique"><Icon name="external-link" /></IconButton>
```

- Props : `variant` (`primary·secondary·ghost·danger·accent`, défaut `ghost`) · `size`
  (`sm·md·lg`) · `surface` (`auto·page·card`) · `label` (requis) · `as` / `href`.
- `surface` a le même rôle et les mêmes valeurs que sur `Button` — voir sa section.
- **`variant="accent"`** (v0.3.0) : fond `--accent`, sans bordure, icône `--primary` —
  l'état « sélectionné doux » d'un lien-icône ou d'un raccourci. Ne pas le recomposer
  avec `is-active` (une aide de démo) et un style inline : c'est cette fraude que la
  variante remplace.
- **`as="a"` + `href`** (v0.3.0) : un lien-icône reste un LIEN — clic-milieu, « ouvrir
  dans un onglet », annonce correcte au lecteur d'écran. Jumeau du `as` de `Button`.
- L'icône ne se dimensionne pas au site d'appel : le créneau s'en charge (sm 1rem ·
  md 1.125rem) — voir la section Icon.
- Carré sur son propre rail (`--icon-control-*`), rayon `--radius-md`, jamais un pill.
- États rendus : repos, hover, pressé (`aria-pressed` = actif), focus-visible, désactivé.

---

# brand

## Avatar

Portrait **détouré** (PNG transparent) avec halo de marque derrière les épaules. Sans
`src`, il retombe sur un monogramme en sourdine — jamais une image cassée.

**Ne pas l'utiliser** pour une vignette de contenu ou une image pleine : c'est un
portrait, posé bas, jamais centré derrière un titre.

```tsx
<Avatar src="/portrait-cutout.png" size="4rem" />
<Avatar size="3rem" halo={false} />
```

- Props : `src` · `alt` · `initials` (monogramme de repli) · `size` (longueur CSS, rem) ·
  `halo` (défaut `true`).
- Les défauts (`alt`, `initials`) viennent de `src/brand.ts`.

## Halo

L'atmosphère radiale de la marque. À poser dans une section `position:relative`, derrière
le contenu. Ancré en bas par défaut — jamais plein écran, jamais un grand aplat dégradé.

**Ne pas l'utiliser** pour une miniature ou une carte de motion : ce halo-là est `HaloHot`,
sur le sous-chemin optionnel `@yunary/ds/brand-content`.

```tsx
<section style={{ position: 'relative', overflow: 'hidden' }}>
  <Halo placement="bottom" />
  <div style={{ position: 'relative' }}>…</div>
</section>
```

- Props : `placement` (`bottom·top·center`) · `intensity` (0–1, multiplicateur d'opacité).
- Les dégradés viennent des utilitaires `.halo*` de `tokens/base.css` — aucune valeur ici.

## Logo

La marque, rendue **en CSS** : capitales de `--font-display` + pastille carrée arrondie en
dégradé avec lueur. La pastille garde le dégradé sur tous les fonds ; seules les lettres
s'inversent avec le thème. Les défauts (mot-marque, monogramme) viennent de `src/brand.ts`.

**Ne pas** fausse-grasser, contourer ni interlettrer le mot-marque : sa casse et sa
graisse suivent `--heading-transform` / `--heading-weight`, comme tout le titrage.

```tsx
<Logo variant="wordmark" height="1.75rem" />
<Logo variant="wordmark" letters="light" height="1.75rem" />
<Logo variant="monogram" height="2.5rem" />
<Logo wordmark="Acme" dot={false} />
```

- Props : `variant` (`wordmark·stacked·monogram`) · `letters` (`dark·light` — force la
  couleur des lettres ; omise, elles suivent `--foreground`) · `height` · `wordmark` ·
  `monogram` · `dot` (`false` = sans pastille ; un nœud la remplace) · `label`.
- En HTML nu, le même mark existe en `.ds-logo` / `.ds-logo__dot` (tokens/base.css).

---

# data-display

## Badge

Pill de statut ou de catégorie. Les tons sémantiques portent toujours **couleur + icône +
texte**, jamais la couleur seule.

**Ne pas l'utiliser** comme bouton ni comme métrique : un badge ne se clique pas.

```tsx
<Badge tone="success" icon={<Icon name="circle-check" size="0.875rem" strokeWidth={2.5} />}>En ligne</Badge>
<Badge tone="danger" icon={<Icon name="circle-alert" size="0.875rem" strokeWidth={2.5} />}>Échec</Badge>
<Badge tone="outline">Brouillon</Badge>
<Badge tone="neutral" pad="dense">v0.1.0</Badge>
```

- Props : `tone` (`coral·amber·danger·warning·success·neutral·accent·outline`, défaut
  `neutral`) · `pad` (`md·dense`) · `icon`.
- Le rayon pill est légal ici — jamais sur un bouton, un champ ou une barre d'onglets.

## Card

LA surface du système — tout ce qui n'est pas une section de page se pose sur une Card.
Fond `--card`, bordure 1px, ombre teintée. Jamais du blanc pur. L'en-tête à slots
(`eyebrow` / `icon` / `title` / `subtitle` / `action`) ne rend AUCUN nœud si aucun slot
n'est passé.

**Ne pas** imbriquer une Card dans une Card, ni poser une grille de cartes avec un gap
sous 1.5rem.

```tsx
<Card>Contenu</Card>
<Card variant="interactive" onClick={() => ouvrir()}>Card cliquable</Card>
<Card variant="feature" size="lg">Mise en avant — lavis --grad-soft + bordure de marque</Card>
<Card icon={<Pastille size="carte"><Icon name="rocket" /></Pastille>}
  title="Déployer" subtitle="En un clic" action={<IconButton label="Options"><Icon name="ellipsis" /></IconButton>}>
  Contenu sous l'en-tête
</Card>
<Card flush><img src="/cover.png" alt="" style={{ width: '100%' }} /></Card>
```

- Props : `variant` (`default·interactive·feature`) · `size` (`md·lg`) · `flush` (sans
  padding, media plein bord) · slots d'en-tête `eyebrow` / `icon` / `title` / `subtitle` /
  `action` · `titleSize` (`sm·lg`) · `headerGap` (`normal·airy`) · `as`.
- **L'alignement de l'en-tête est décidé par le socle, jamais par une prop** (v0.4.0) :
  titre simple → rangée **centrée** — icône, titre et action partagent un axe, la langue du design ; titre **et** sous-titre → `flex-start` —
  l'action s'aligne sur la ligne du haut au lieu de flotter entre les deux. `baseline`
  est écarté : il exigeait une retouche par instance. Ne recomposez pas l'en-tête à la
  main pour choisir un alignement — c'est le composant qui le sait.
- États rendus : repos ; `interactive` ajoute hover (levée + `--shadow-md`), pressé,
  focus-visible.

## Pastille

La tuile d'icône du système — l'unique porteur carré-ou-rond teinté. Ses tailles sont
nommées par **contexte**, jamais par mesure : un site d'appel n'écrit jamais un rem.

**Ne pas l'utiliser** comme bouton (elle ne se clique pas) ni réinventer une tuile d'icône
en div : c'est exactement ce que ce composant remplace.

```tsx
<Pastille size="carte"><Icon name="terminal" /></Pastille>
<Pastille size="dialogue" tone="danger"><Icon name="triangle-alert" /></Pastille>
<Pastille size="panneau" tone="brand" outlined><Icon name="folder" /></Pastille>
<Pastille size="heros" shape="round" tone="inverse"><Icon name="rocket" size="1.5rem" /></Pastille>
<Pastille size="dialogue" tone="brand-solid"><Icon name="plus" /></Pastille>
```

- Props : `size` (`carte` 2.25 · `dialogue` 2.625 · `panneau` 3.25 · `heros` 4 · `ecran`
  5rem — le rayon suit la taille) · `shape` (`square·round`) · `tone` (`brand` ·
  `brand-solid` + les 6 paires sémantiques + `inverse`) · `outlined` (contour 1px
  currentColor à 22 %).
- L'icône ne se dimensionne pas au site d'appel : le créneau s'en charge — `dialogue` et
  `panneau` rendent 1.5rem, `carte` le repli 1.25rem. Seules `heros` et `ecran` attendent
  encore une taille explicite.
- **`tone="brand-solid"` porte le dégradé PLEIN**, avec son glyphe en
  `--primary-foreground` : la tuile de marque affirmée, là où `brand` est la tuile douce.
  `size="dialogue"` en fait le jumeau exact d'un `IconButton` `md` — même 2,625 rem, même
  `--radius-md` — mais en `<span>`, donc **posable dans un `<label>` ou une zone cliquable,
  là où un vrai `<button>` imbriqué est du contenu interactif invalide dont le navigateur
  ne transmet pas l'activation.**
- ⚠️ `brand-solid` ne porte **aucune lueur**, et c'est délibéré : dans ce système la lueur
  marque ce qui se **presse**, et seuls `.ds-btn--primary` et `.ds-icon-btn--primary` la
  portent. Une `Pastille` ne se clique jamais. Un appelant qui veut le halo l'ajoute
  lui-même, en le sachant.
- C'est elle qui rend la tuile du `Modal` et celle de l'`EmptyState`.

## Separator

Filet 1px `--border` entre deux blocs. Avec `label`, la légende est centrée sur la ligne.

**Ne pas l'utiliser** pour structurer une liste dense (l'espacement suffit) ni dans un
menu de bureau (`Dropdown` a son item `separator`). Une `ActionSheet` n'en porte PAS : une
feuille du bas est aérée et parcourue au pouce, le rythme des lignes suffit.

```tsx
<Separator />
<Separator label="Ou" />
<Separator orientation="vertical" />
```

- Props : `orientation` (`horizontal·vertical`) · `label` (horizontal uniquement).

## Table

Table de données composable pour les UIs d'outil : `Table > THead/TBody > Tr > Th/Td`.
`framed` lui donne son propre cadre (1px `--border`, radius-lg, fond `--card`, en-tête sur
`--background`) — pas de Card autour. `columns`, `striped`, `hoverable` se composent.

**Ne pas** rendre une table vide : c'est `EmptyState` À LA PLACE de la table, jamais un
état vide dans la table.

```tsx
<Table framed columns hoverable>
  <THead><Tr><Th>Build</Th><Th>Statut</Th></Tr></THead>
  <TBody><Tr><Td>App de lecture</Td><Td><Badge tone="success">En ligne</Badge></Td></Tr></TBody>
</Table>
```

- Props de `Table` : `striped` · `hoverable` · `framed` · `columns`. `THead`, `TBody`,
  `Tr`, `Th`, `Td` acceptent leurs attributs HTML natifs.
- États rendus : lignes au repos, alternées (`striped`), survolées (`hoverable`).

## Tooltip

Bulle d'encre au survol et au focus (bulle claire en thème sombre). Un libellé court —
jamais du contenu riche.

**Ne pas l'utiliser** pour de l'information indispensable : ce qui doit être lu vit dans
la page, pas dans une bulle.

```tsx
<Tooltip content="Copier le prompt">
  <IconButton label="Copier le prompt"><Icon name="copy" /></IconButton>
</Tooltip>
```

- Props : `content` · `placement` (`top·bottom`) · `open` (force la bulle ouverte — cartes
  spécimens et captures).
- États rendus : fermé, ouvert au survol, ouvert au focus clavier, forcé (`open`).

---

# feedback

## Banner

Message persistant, dans une page ou une Card. Toujours couleur + icône + texte.

**Ne pas l'utiliser** pour du feedback transitoire (c'est `Toast`) ni pour une erreur de
champ (c'est `FormField error`).

```tsx
<Banner tone="warning" title="Ce tuto date de mars">La CLI a changé depuis — la méthode reste bonne.</Banner>
<Banner tone="info" title="Nouvelle série en ligne" action={<Button variant="secondary" size="sm">Voir</Button>} />
```

- Props : `tone` (`danger·warning·success·info`, défaut `info`) · `title` · `children`
  (corps) · `action` (contrôle à droite).

## EmptyState

Emplacement vide en pointillés : tuile `Pastille panneau brand outlined`, titre H4 en face
display, une description courte, et **le prochain geste**. Toujours donner au lecteur la
suite.

**Ne pas l'utiliser** pour une erreur (c'est `Banner` ou `Modal` result) ni pour un
chargement (c'est `Skeleton`).

```tsx
<EmptyState icon={<Icon name="folder" />} title="Aucun build ici"
  description="Choisis une série pour voir les vidéos correspondantes."
  action={<Button variant="secondary">Voir tout</Button>} />
<EmptyState tile={<Pastille size="dialogue" tone="neutral"><Icon name="search" /></Pastille>}
  title="Aucun résultat" description="Essaie un autre mot-clé." />
```

- Props : `icon` (glyphe nu — la Pastille par défaut l'enveloppe) · `tile` (v0.3.0 : la
  tuile complète, quand `panneau brand outlined` ne convient pas ; `icon` est alors
  ignoré) · `title` (requis) · `description` · `action`.

## Progress

Barre fine : rail `--surface-alt`, remplissage `--brand-gradient` — depuis la v0.6.0, la
barre remplie porte le dégradé de marque, jamais l'aplat (la piste, elle, reste un creux).
Déterminée (0–max) ou indéterminée (barre glissante).

**Ne pas l'utiliser** pour une attente sans notion d'avancement dans un contrôle — c'est
`Spinner` (ou `Button loading`).

```tsx
<Progress value={64} label="Progression du build" />
<Progress indeterminate label="Chargement" />
```

- Props : `value` · `max` (défaut 100) · `indeterminate` · `label` (nom accessible).
- ARIA : `role="progressbar"` + `aria-valuenow` (omis en indéterminé).

## Skeleton

Silhouette de chargement sur `--muted`, shimmer discret. Dimensions en chaînes CSS (rem
ou %) — c'est le style inline **légitime** au sens de la règle générale en tête de ce
fichier : la valeur vient de l'appelant à chaque rendu, il n'y a aucun défaut de design à
reprendre. (La même règle rend illégitime un défaut écrit inline — c'était le cas de
`Glyph` et `Spinner` avant la v0.3.0.)

**Ne pas l'utiliser** après le premier rendu : un skeleton qui persiste est un bug
d'affichage, pas un état.

```tsx
<Skeleton width="12rem" height="1.25rem" />
<Skeleton height="9rem" radius="var(--radius-lg)" />
```

- Props : `width` (défaut 100 %) · `height` (défaut 0.75rem) · `radius` (défaut
  `--radius-sm`).

## SkeletonCard

Un skeleton en forme de carte média (16/9 + lignes) — un par emplacement de grille pendant
qu'une grille de cartes charge.

```tsx
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--space-5)' }}>
  {[0, 1, 2].map(i => <SkeletonCard key={i} />)}
</div>
```

- Props : `media` (le bloc 16/9, défaut `true`) · `lines` (défaut 2).

## Spinner

Anneau de chargement en `currentColor`, tailles alignées sur Icon (1 / 1.25 / 1.5rem).

**Ne pas le poser** dans un `Button` : la prop `loading` du bouton le fait, et désactive
le bouton avec.

```tsx
<Spinner size="sm" />
<Spinner size="1.5rem" />
```

- Props : `size` (`sm·md·lg` ou longueur CSS — omise, le créneau décide, comme pour
  Icon : même propriété `--ds-icon-size`, même repli 1.25rem).
- ARIA : `role="status"`, `aria-label="Chargement"`.

## Toast

Notification transitoire, en bas à droite du viewport, sur `--card` avec `--shadow-lg`.
Toujours couleur + icône + texte. Le texte d'erreur est concret, jamais dramatisé.

**Ne pas l'utiliser** pour un message qui doit rester lisible (c'est `Banner`) ni pour une
confirmation bloquante (c'est `Modal`).

```tsx
<Toast tone="success" title="Prompt copié" description="Colle-le dans Claude Code." onClose={() => fermer()} />
<Toast tone="danger" title="Ça a planté, on réessaie ?" description="Le build n'a pas pu démarrer." />
```

- Props : `tone` (`success·danger·warning·info`, défaut `info`) · `title` (requis) ·
  `description` · `onClose` (rend la croix).
- Tuile d'icône 1.5rem radius-sm, glyphes à stroke-width 2.5 (check / x / triangle-alert /
  info).

---

# forms

## Calendar

Vue mois, lundi d'abord, locale `fr-FR` par défaut. `Date` natif + `Intl` uniquement —
aucune dépendance. Date unique, pas de plage.

**Ne pas l'utiliser** posé nu dans un formulaire : c'est `DatePicker` qui l'y emmène, en
popover.

```tsx
<Calendar value={date} onChange={setDate} min={new Date()} />
<Calendar />
```

- Props : `value` · `onChange(Date)` · `min` / `max` · `disabledDates` · `locale` · `bare`
  (sans le cadre — l'usage interne du DatePicker).
- États rendus : jour au repos, survolé, sélectionné (aplat `--primary`), aujourd'hui
  (`--primary-readable` gras), désactivé, focus-visible.
- **Pas de plage.** En attendant un mode plage (périmètre envisagé : deux mois,
  surlignage des jours intermédiaires, présélections externes),
  un calendrier fait main peut émettre lui-même les classes du socle et hériter de ses
  espacements, de sa typo et de ses états au lieu de les réinventer : `.ds-cal` (cadre,
  ou `.ds-cal--bare`), `.ds-cal__head` / `.ds-cal__label` / `.ds-cal__nav`,
  `.ds-cal__grid` / `.ds-cal__wd` / `.ds-cal__day` et ses états `.is-today` /
  `.is-selected` / `:disabled`. Ces classes sont un contrat de rendu — le socle les
  garde stables tant que la parade est nécessaire.

## Checkbox

Case à cocher avec libellé. `forwardRef` : la ref atteint l'`<input>` natif —
`register()` de react-hook-form se branche directement.

**Ne pas l'utiliser** pour un choix exclusif (c'est `Radio`) ni pour un réglage à effet
immédiat (c'est `Switch`).

```tsx
<Checkbox label="Je veux recevoir le prompt du build" defaultChecked />
<Checkbox label="Sélection partielle" indeterminate />
<Checkbox label="Option indisponible" disabled />
```

- Props : `label` · `indeterminate` (case d'en-tête de sélection multiple : propriété DOM
  posée par ref, trait `minus` à la place de la coche, `aria-checked="mixed"`) + les
  attributs natifs (`checked`, `defaultChecked`, `onChange`, `disabled`…).
- États rendus : décochée, cochée, indéterminée, hover, focus-visible, désactivée.

## DatePicker

Déclencheur façon Input (même règle de `surface`) + `Calendar` en popover. Clic extérieur
ou Échap pour fermer — Échap et la sélection rendent le focus au déclencheur. Avec `name`,
un `<input type="hidden">` porte la date en ISO (`YYYY-MM-DD`) pour la soumission de
`<form>`. Avec react-hook-form : passer par `<Controller>` (composant contrôlé).

**Ne pas l'utiliser** pour une plage de dates — le système n'en a pas.

```tsx
<DatePicker value={date} onChange={setDate} placeholder="Choisir une date" />
<DatePicker surface="card" name="echeance" value={date} onChange={setDate} />
<DatePicker invalid value={date} onChange={setDate} />
<DatePicker value={date} onChange={setDate}
  trigger={({ value, triggerProps }) => (
    <button type="button" className="ds-btn ds-btn--secondary" {...triggerProps}>
      {value ? value.toLocaleDateString('fr-FR') : 'Choisir une date'}
      <Icon name="calendar" />
    </button>
  )} />
```

- Props : `value` · `onChange(Date)` · `placeholder` · `locale` · `min` / `max` ·
  `disabledDates` · `surface` (`page·card`) · `invalid` · `disabled` · `name` ·
  `trigger`.
- **`trigger` — le déclencheur composable** (v0.3.1). Un render-prop qui reçoit
  `{ open, value, triggerProps }` et rend l'élément de son choix en **étalant
  `triggerProps`** dessus — ref, clic, clavier, ARIA. C'est l'étalement qui est le
  contrat : par lui le socle garde la ref (retour de focus sur Échap et sur sélection)
  et pose l'ARIA lui-même (`aria-haspopup` / `aria-expanded` / `aria-controls`), qui
  cesse d'être la charge de l'app. L'élément doit être **focusable et recevoir `ref`** —
  un `<button type="button">` nu, pas un composant sans `forwardRef` (le `Button` du
  socle n'en a pas : la ref s'y perdrait, et le retour de focus avec).
  **L'étalement est nu : aucun cast.** `triggerProps.ref` est une ref de RAPPEL
  (`(node: HTMLElement | null) => void`), donc assignable au `ref` de n'importe quelle
  balise. Un objet de ref sur `HTMLElement` ne l'aurait pas été — l'appelant aurait dû
  écrire `ref={triggerProps.ref as Ref<HTMLButtonElement>}`, et l'exemple ci-dessus
  n'aurait pas compilé. `disabled` reste
  la charge de l'appelant sur son élément. Sans `trigger`, rien ne change : le bouton
  façon Input d'hier, qui étale les mêmes `triggerProps` — les deux chemins ne peuvent
  pas diverger.
- États rendus : vide, rempli, ouvert, invalide, désactivé, focus-visible.

## FormField

Enveloppe libellé + contrôle + aide/erreur. Une erreur **remplace** le texte d'aide et
porte toujours couleur + icône + texte.

**Ne pas** poser un libellé à la main au-dessus d'un champ : c'est ce composant qui tient
l'anatomie.

```tsx
<FormField label="Ton email" htmlFor="mail" help="Un build décortiqué par semaine. Zéro spam.">
  <Input id="mail" placeholder="ton@email.com" />
</FormField>
<FormField label="Ton email" htmlFor="mail2" error="Ça a planté, on réessaie ?">
  <Input id="mail2" invalid defaultValue="pas-un-email" />
</FormField>
```

- Props : `label` · `htmlFor` · `help` · `error` · `required` (astérisque `--primary`).

## Input

Champ texte sur le rail de contrôle partagé, bordure 1.5px. Focus = la bordure passe en
`--ring` — UNE bordure, jamais un anneau en plus. Jamais un pill. `forwardRef` sur
l'`<input>` natif.

**Ne pas l'utiliser** pour du texte multi-lignes (c'est `Textarea`).

```tsx
<Input placeholder="ton@email.com" />
<Input surface="card" placeholder="Dans une Card" />
<Input invalid defaultValue="pas-un-email" />
<Input size="lg" placeholder="CTA de héros" />
<Input unit="kg" inputMode="decimal" placeholder="72" />
```

- Props : `size` (`sm·md·lg`) · `invalid` · `surface` (`page` = fond `--secondary`, posé
  à même le layout · `card` = fond `--background`, dans une Card) · `unit` + attributs
  natifs.
- **`unit`** (v0.3.0) : l'unité — « kg », « € », « min » — posée DANS le champ, à
  droite, en sourdine. **Trois caractères au plus** ; plus long, c'est un suffixe de
  libellé, pas une unité. Elle est `aria-hidden` : le libellé du `FormField` la nomme.
- États rendus : repos, focus, invalide, désactivé — sur les deux surfaces.

## Radio

Bouton radio — le seul contrôle circulaire du système. Toujours dans un groupe `name`.
`forwardRef` sur l'`<input>` natif.

**Ne pas l'utiliser** pour plus de ~5 options (c'est `Select`) ni pour un choix multiple
(c'est `Checkbox`).

```tsx
<Radio name="niveau" value="debutant" label="Je débute" defaultChecked />
<Radio name="niveau" value="avance" label="Je code déjà" />
```

- Props : `label` + attributs natifs (`name`, `value`, `checked`, `onChange`,
  `disabled`…).
- États rendus : au repos, sélectionné, hover, focus-visible, désactivé.

## Select

Select **natif** sur le rail 3rem, avec un chevron Lucide. Même silhouette qu'Input et
Button md. `forwardRef` sur le `<select>` natif.

**Ne pas** le remplacer par un menu custom : le natif gagne au clavier et au tactile.

```tsx
<Select options={[{ value: 'build', label: 'Build' }, { value: 'tuto', label: 'Tuto' }]} defaultValue="build" />
<Select options={[{ value: 'a', label: 'A' }]} invalid />
```

- Props : `options` (`{value, label}[]`) · `invalid` · `surface` (`page·card`) + attributs
  natifs.
- États rendus : repos, focus, invalide, désactivé — sur les deux surfaces.

## Switch

Bascule binaire à effet **immédiat** — jamais suivie d'un bouton Enregistrer. `forwardRef`
sur l'`<input>` natif.

**Ne pas l'utiliser** dans un formulaire soumis d'un bloc (c'est `Checkbox`).

```tsx
<Switch label="Thème sombre" defaultChecked />
<Switch label="Notifications" disabled />
```

- Props : `label` + attributs natifs (`checked`, `onChange`, `disabled`…). Rendu
  `role="switch"`.
- États rendus : off, on, hover (piste teintée vers `--primary`), focus-visible,
  désactivé.

## Textarea

Champ multi-lignes. Hauteur automatique — jamais de min-height. Redimensionnement
vertical uniquement. Même règle de `surface` que l'Input. `forwardRef` sur le
`<textarea>` natif.

```tsx
<Textarea rows={5} placeholder="Décris ton idée d'app en deux phrases." />
<Textarea rows={3} invalid defaultValue="Trop court" />
```

- Props : `invalid` · `rows` (défaut 4) · `surface` (`page·card`) + attributs natifs.
- États rendus : repos, focus, invalide, désactivé.

---

# icons

## Icon

LE système d'icônes : Lucide, exclusivement. Jamais un emoji, jamais un SVG dessiné à la
main. 48 glyphes typés (`IconName`) — un nom hors du type est une erreur TypeScript, et
c'est voulu.

**Ne pas** chercher `youtube` ou `instagram` ici : les icônes de PLATEFORME vivent dans
`ContentIcon`, sur le sous-chemin optionnel `@yunary/ds/brand-content`. Et jamais
`sparkles` : l'étoile-éclair est bannie du set.

**La taille vient du CRÉNEAU, plus du site d'appel — v0.3.0.** Une icône sans `size` lit
`var(--ds-icon-size, 1.25rem)` ; les créneaux du socle posent la propriété par une règle
CSS (bouton sm 1rem · bouton et IconButton md 1.125rem · badge dense 0.75rem · pastille
dialogue et panneau 1.5rem · déclencheurs de champ 1rem — les défauts du socle, dans
patterns.css). **Ne passez `size` que pour une correction optique** — une croix ouverte
lit plus petit qu'un aplat, on la remonte d'un cran — ou hors de tout créneau : passée,
elle gagne sur la règle. Un projet pose son propre créneau en ciblant le `svg` lui-même
(`.ma-tuile svg { --ds-icon-size: 1.5rem }`) — jamais le conteneur : la propriété est
enregistrée `inherits: false`, une règle de conteneur est inerte, et c'est voulu.

```tsx
<Icon name="circle-check" strokeWidth={2} />
<Icon name="arrow-right" size="1rem" style={{ color: 'var(--primary-readable)' }} />
```

**Ce que le catalogue ne couvre pas se passe en `glyph`.** Lucide compte ~1500 tracés ;
le catalogue en cure 48 glyphes. Pour le reste, l'app importe le tracé et le socle lui applique
ses propres règles — même grille, même épaisseur. Plus besoin de publier une version du
design system pour une icône.

```tsx
import { ShoppingBag } from 'lucide-react';

<Icon glyph={ShoppingBag} />
```

- Props : `name` (`IconName`) **ou** `glyph` (tracé lucide), jamais les deux — ils sont
  mutuellement exclusifs, et le TYPE l'impose : passer les deux, ou aucun, est une erreur
  de compilation. · `size` (longueur CSS, toujours rem — omise, le créneau décide) ·
  `strokeWidth` (2 standard · 2.5 dans les pills et les toasts · 3 pour la coche).
- **`name` reste la voie normale** : le catalogue est relu, documenté, et garantit qu'un
  nom existe. `glyph` est la porte de sortie, pas le chemin par défaut — un besoin qui
  revient dans DEUX apps mérite d'entrer au catalogue.
- `glyph` n'autorise PAS un SVG maison : le rendu reste celui du socle. Ce qui s'ouvre,
  c'est le choix du tracé dans lucide, pas la liberté graphique.
- La couleur suit `currentColor`. Les actions destructives prennent `trash-2`.

---

# navigation

## AppShell

Le squelette d'app-outil : grille `[Sidebar | contenu]`. Sous 64rem, la sidebar devient un
tiroir piloté par `open`/`onClose` de `Sidebar`.

**Ne pas l'utiliser** pour un site de contenu (c'est `Navbar` + `Footer`).

```tsx
<AppShell sidebar={<Sidebar sections={sections} open={menuOpen} onClose={() => setMenuOpen(false)} />}>
  {contenu}
</AppShell>
```

- Props : `sidebar` (un `<Sidebar>`) · `responsive` (défaut `true` ; `false` fige la
  double colonne desktop).

## Footer

Pied de site : marque, ligne de signature optionnelle, colonnes de liens, rangée sociale.

```tsx
<Footer
  note="Busan · Corée du Sud"
  columns={[{ title: 'Séries', links: [{ label: 'Build' }, { label: 'Tuto' }] }]}
  social={<IconButton label="GitHub"><Icon name="github" /></IconButton>}
/>
```

- Props : `columns` (`{title, links:[{label, href?}]}[]`) · `social` · `brand` (défaut :
  le `Logo` du paquet) · `letters` · `note` (ligne de lieu/signature — AUCUN défaut :
  omise, la ligne n'est pas rendue ; le point médian `·` sert de séparateur).

## Navbar

Barre de site sticky : logo à gauche, liens au centre, CTA à droite. Toujours sur
`--secondary` avec filet bas — un contrôle détaché du layout, jamais transparent. Au
scroll : teinte + blur + ombre. C'est le SEUL endroit du système qui emploie
`backdrop-filter` — pas de glassmorphism ailleurs.

```tsx
<Navbar
  links={[{ label: 'Vidéos', active: true }, { label: 'Séries' }, { label: 'À propos' }]}
  cta={<Button size="sm">La newsletter</Button>}
/>
```

- Props : `links` (`{label, href?, active?}[]`) · `cta` · `brand` (défaut : le `Logo`) ·
  `homeHref` / `homeLabel` · `letters` · `scrolled` (force l'état scrollé — spécimens) ·
  `children` (rendu dans l'emplacement de DROITE, juste **avant** `cta` : une action de plus
  — bascule de thème, sélecteur de langue — sans remplacer le CTA).
- États rendus : repos, scrollée, lien au repos / survolé / actif.

## Pagination

Pagination contrôlée sur une barre `--secondary` (même traitement que Tabs). Ellipse
au-delà de 7 pages ; la page courante reçoit le traitement de l'onglet actif.

```tsx
<Pagination page={page} pageCount={12} onPageChange={setPage} />
```

- Props : `page` (1-based) · `pageCount` · `onPageChange`.
- États rendus : page au repos, survolée, courante (`aria-current="page"`), flèches
  désactivées aux bornes, focus-visible.

## Sidebar

Navigation d'app sur `--secondary` : marque en tête, sections titrées, item actif, pied
(Avatar + nom). Repliable en icônes seules, persisté en localStorage. Sous 64rem : tiroir
`open`/`onClose`, voile compris.

```tsx
<Sidebar
  sections={[{ title: 'Outils', items: [
    { label: 'Accueil', icon: <Icon name="house" />, active: true },
    { label: 'Contenu', icon: <Icon name="video" /> },
  ] }]}
  footer={<Avatar size="2rem" />}
/>
```

- Props : `sections` (`{title?, items:[{label, icon?, href?, active?, onClick?}]}[]`) ·
  `footer` · `footerItems` · `brand` / `brandCollapsed` · `collapsible` (défaut `true`) ·
  `defaultCollapsed` · `storageKey` · `open` / `onClose` (tiroir mobile) · `staticLayout`
  · `linkAs`.
- Chaque section est un **groupe** (v0.3.0) : les groupes se séparent par le gap de la
  nav (16px), avec ou sans titre — deux sections sans titre ne se collent plus.
- États rendus : dépliée, repliée, item au repos / survolé / actif, tiroir ouvert.

## Tabs

Groupe d'onglets segmenté sur le rail de contrôle. La barre contraste TOUJOURS avec sa
surface porteuse : `--secondary` sur la page, `onCard` bascule sur `--background`.
Rectangle (barre 0.875rem · onglet `--radius-sm`) — jamais un pill, jamais fondu dans le
fond.

**Ne pas l'utiliser** pour de la navigation entre pages (c'est `Navbar` ou `Sidebar`) :
Tabs filtre un contenu en place.

```tsx
<Tabs value={tab} onChange={setTab}
  items={[{ value: 'all', label: 'Tout' }, { value: 'build', label: 'Build' }]} />
<Tabs onCard value={tab} onChange={setTab} items={[{ value: 'all', label: 'Tout' }]} />
```

- Props : `items` (`{value, label}[]`) · `value` / `onChange` (contrôlé) · `onCard`.
- États rendus : onglet au repos, survolé, sélectionné (`aria-selected`), focus-visible.

---

# overlays

## ActionSheet

Le menu « ⋯ » sur mobile : une feuille basse d'actions, Annuler intégré, chaque ligne au
moins `--control-md` (le rail tactile). Surface modale complète : focus piégé, Échap
ferme, focus rendu au déclencheur, défilement verrouillé.

**DOCTRINE ⋯ — ne pas l'ouvrir au-dessus de 64rem** : `.ds-scrim--sheet` y est en
`display:none`, une ActionSheet modale y est invisible par construction (le composant le
signale en console en développement). Au-dessus de 64rem, le même geste ouvre un
`Dropdown`. En spécimen desktop : `inline panel`.

```tsx
<ActionSheet
  open={sheet}
  onCancel={() => setSheet(false)}
  items={[
    { label: 'Copier le lien', icon: <Icon name="copy" size="1rem" />, onSelect: () => setSheet(false) },
    { label: 'Supprimer', icon: <Icon name="trash-2" size="1rem" />, danger: true },
  ]}
/>
<ActionSheet inline panel items={[{ label: 'Copier le lien' }]} />
```

- Props : `open` · `title` / `subtitle` (en-tête optionnel) · `note` (légende de
  conséquence au-dessus d'Annuler) · `items`
  (`{label, icon?, danger?, onSelect?, className?}[]`) · `cancelLabel` ·
  `onCancel` · `inline` (sans voile) · `panel` (spécimen desktop 20rem — implique
  `inline`).
- **Pas de séparateur** (v0.8.0) : l'item `separator` a été retiré, la feuille n'émet plus
  aucun `<hr>`. C'est `Dropdown` qui garde le sien.
- États rendus : fermée, ouverte (feuille), item au repos / survolé / danger, panneau
  desktop.

## Dropdown

Menu contextuel — **desktop only**. Sous 64rem, un menu « ⋯ » ouvre TOUJOURS une
`ActionSheet` : même geste, deux tailles d'écran. Panneau sur `--popover`, items éclairés
sur `--surface-alt`.

**Ne pas l'utiliser** comme select de formulaire (c'est `Select`).

```tsx
<Dropdown items={[
  { label: 'Copier le lien', icon: <Icon name="copy" size="1rem" /> },
  { label: 'Ouvrir la vidéo', icon: <Icon name="play" size="1rem" />, hint: '⏎' },
  { separator: true },
  { label: 'Supprimer', icon: <Icon name="trash-2" size="1rem" />, danger: true },
]} />
<Dropdown inline items={[{ label: 'Spécimen dans le flux' }]} />
```

- Props : `items` (`{label, icon?, hint?, danger?, separator?, onSelect?, className?}[]`)
  · `inline` (rendu dans le flux, sans positionnement absolu).
- États rendus : item au repos, survolé, danger, séparateur.

## Modal

Dialogue de confirmation ou de tâche focalisée, sur `--popover`, au-dessus d'un voile
encre flouté. **Trois phases dans UN dialogue** : `confirm` → `loading` (rien ne ferme :
Échap, voile et croix inertes) → `result` (succès ou erreur, avec « Réessayer »). Sous
64rem, la MÊME modale devient une feuille basse — CSS seul. Focus piégé, Échap ferme,
focus rendu au déclencheur.

**Ne pas l'utiliser** pour du feedback passif (c'est `Toast` ou `Banner`) ni pour un menu
d'actions (c'est `Dropdown` / `ActionSheet`).

```tsx
<Modal
  open={open}
  onClose={() => setOpen(false)}
  icon={<Icon name="triangle-alert" />}
  title="Supprimer ce build ?"
  description="Cette action est définitive."
  footer={<>
    <Button variant="ghost" onClick={() => setOpen(false)}>Annuler</Button>
    <Button variant="danger">Supprimer</Button>
  </>}
/>
<Modal inline phase="result" onClose={() => setOpen(false)}
  result={{ status: 'success', title: 'Build supprimé', message: 'Les fichiers ont été retirés.' }} />
```

- Props : `open` · `icon` + `iconVariant` (`danger·brand·neutral·warning·success` — la
  tuile est une `Pastille dialogue`) · `title` / `description` / `children` · `footer` ·
  `onClose` · `closeButton` · `dismissable` · `phase` (`confirm·loading·result`) ·
  `result` (`{status, title?, message?, onRetry?}`) · `inline` (spécimen sans voile).
- **La croix et les gestes de fuite sont découplés** (v0.3.0) : `closeButton={false}`
  retire la croix en gardant Échap et le clic-voile ; `dismissable={false}` fait
  l'inverse — la croix devient le seul geste de fermeture, pour une modale à saisie
  qu'un clic à côté ne doit pas jeter. Les deux à `true` par défaut : rien ne bouge.
- Un champ dans une modale : voir le spécimen « Avec un champ contrôlé » de la vitrine —
  le piège de focus tient la frappe.
- États rendus : les trois phases, avec et sans icône, succès et erreur, feuille basse
  sous 64rem.

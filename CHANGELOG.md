# Journal des versions — @yunary/ds

La procédure est dans [`GOVERNANCE.md`](GOVERNANCE.md), et `node check-version.mjs` vérifie
que **trois endroits disent le même numéro** : `package.json`, la ligne d'installation du
README, et le tag git. Les trois d'un coup, jamais l'un sans les autres — un tag manquant fait
échouer le `npm i …#v0.1.0` chez celui qui installe, et le README ment sans le savoir.

Ce journal repart de la **0.1.0** de Yunary. Il ne reprend pas celui du gabarit dont ce paquet
est né : l'historique d'un autre design system n'apprend rien sur celui-ci. Le millésime du
gabarit d'origine est noté ci-dessous, une fois, parce qu'une copie n'emporte pas l'historique
git — sans ça, deux portages faits à six mois d'écart seraient indiscernables.

Une ligne par décision, et c'est le **pourquoi** qui compte.

---

## 0.1.3 — proportions v1 : échelle d'app 100 / 115 %, titre de page 36 px

Un constat de Julien (11/09/2026), l'app refondue posée à côté de la v1 sur le même écran : **trop
grosse et trop aérée**. Deux causes, deux retours à la valeur de la v1. Aucune rupture d'API ; le
rendu de toute app qui importe `app-scale.css` change, c'est le but.

- **`app-scale.css` : les proportions de la v1.** Racine à **100 %**, et **115 % à partir de
  2240 px** — le seul palier, celui de `legacy-v1/app/src/index.css`. Les quatre bandes
  (103 / 112 / 126 / 130 %) visaient une largeur effective proche de la maquette 1440 sur tout
  écran ; à l'usage elles grossissaient tout ce que la v1 montrait à l'échelle 1. La maquette
  reste la référence de dessin, elle ne dicte plus un zoom. Le garde-fou desktop suit :
  `min-width: 1100px` (1100 × 1,00), toujours sous `@media (min-width: 64rem)`. Sur un écran
  courant, une app rend désormais **exactement** ce que rend le site : la différence ne se voit
  plus qu'au-delà de 2240 px.
- **Le titre de page revient à 36 px** (`--text-heading-xl: 2.25rem`, la valeur de la v1 ; le
  socle dit 40). Réglé **dans la marque**, pas dans le socle : le 40 est le défaut du gabarit, le
  36 est un choix de Yunary — même mécanisme que `--card-pad` ou `--sidebar-w` (redéclaration en
  `:root` après `core.css`). Le piège, et il est écrit à côté de la ligne : le palier mobile
  (28 px sous 64 rem) vit dans une media query du socle, qu'une redéclaration nue aurait écrasée —
  la media query est **répétée dans `brand-yunary.css`**, le mobile ne bouge pas. Le gabarit
  `brand.template.css` gagne un § 4.4 qui propose ce seul palier, avec le piège ; les autres
  paliers ne sont pas proposés, exprès.
- **`grid-cards-<rôle>` : la grille de cartes en auto-fill, sortie du `BACKLOG.md`.** Creator
  (vidéos, `grid-cols-[repeat(auto-fill,minmax(15rem,1fr))]`) et le Hub (outils,
  `repeat(auto-fill, minmax(min(var(--container-dialog), 100%), 1fr))` en style inline) écrivaient
  la même formule chacun de leur côté. Le choix retenu, entre « un jeton par usage » et « un
  utilitaire paramétrable » : **l'utilitaire paramétré par un rôle de largeur**. `@utility
  grid-cards-*` lit `--value(--container-*)` et pose
  `grid-template-columns: repeat(auto-fill, minmax(min(<rôle>, 100%), 1fr))` — `grid-cards-tile`
  pour Creator, `grid-cards-dialog` pour le Hub, dont le jeton existait déjà. Un jeton par usage
  aurait fixé une largeur par nom (`grid-cols-cards` = 15 rem, et un second pour 27,5) alors que
  la largeur est déjà nommée par son rôle : un seul mécanisme, aucune valeur en double, et un
  futur usage choisit un rôle au lieu d'inventer une mesure. Il ne pose pas `display: grid`,
  comme `grid-cols-*` : `grid grid-cards-tile gap-space-5`. Le `min(…, 100%)` empêche une carte
  de déborder d'un conteneur plus étroit qu'elle.
- **`--container-tile` : 15 rem (240 px), la largeur MINIMALE d'une tuile de grille** — le
  sixième rôle de `--container-*`, et le premier qui soit un minimum plutôt qu'un maximum de
  colonne. Le `BACKLOG.md` proposait `--container-card` : renommé, parce que « card » aurait
  désigné la largeur du composant `Card`, qui n'en a pas. Génère `max-w-tile` par construction,
  sans emploi prévu.
- **`BACKLOG.md`** : les huit demandes remontées par les lots Creator et Hub sont versées
  (carte d'état héros au seuil de promotion, hôte de toasts, tuile cochable, barre d'étapes
  segmentée, en-tête accentué de `Table`, icône de tête sur `Input`, `as` de `Card`, mesures de
  mise en page sans jeton) ; la famille (b) de cette dernière — la grille auto-fill — en sort.
- Démo : la page Fondations rend `--container-tile` et un spécimen des deux grilles, classes
  écrites en clair pour que `check-classes.mjs` prouve que l'utilitaire paramétré émet sa règle.
  `docs/PIEGES.md` § 4 et l'en-tête de `check-font-px.mjs` parlent du nouveau palier.

---

## 0.1.2 — la carte de dialogue, la graisse qui suit le palier, la Sidebar alignée

- **`--container-dialog` : 27,5 rem (440 px), la carte centrée d'auth ou de dialogue.** Les
  maquettes A1-A3 posent une carte à 440 px ; le rôle le plus étroit du socle était `narrow`
  (30 rem, message centré, état vide), jugé trop large à l'écran par Julien sur les quatre
  écrans d'auth (08/09/2026). Un rôle de plus plutôt qu'un `narrow` resserré, qui aurait bougé
  les blocs de l'onboarding et du bilan d'audit qui l'emploient. Utilitaire `max-w-dialog`.
- **Le titre de page reprend son 800.** Nouveau jeton de marque `--heading-xl-weight` (défaut du
  gabarit : `var(--heading-weight)` ; Yunary : `var(--weight-extrabold)`, 800 ajouté à l'échelle
  des graisses avec l'utilitaire `font-extrabold`). Lu par `h1`, `.display`, `.display-xl` et par
  les paliers `text-heading-xl` / `text-display*` ; les paliers `text-heading`, `text-subheading`
  et `text-heading-sm` portent désormais `--heading-weight` — **la graisse suit le palier, plus la
  balise**. Constat de Julien sur l'onboarding (08/09/2026) : la v1 titrait ses pages en Onest 800,
  le DS avait tout ramené à 700.
- **`.eyebrow` passe de 600 à 700**, dégradé conservé — la v1 le posait en gras, et le dégradé
  clippé allège déjà un 12 px.
- **`Sidebar` : une entrée peut être `disabled` et porter un `badge`** (« Yunary Metrics ·
  Bientôt » de la coque) — grisée, inerte, l'appoint poussé à droite et masqué en replié. Le
  bloc `ds-sidebar__footnav` est encadré de deux filets et respire de `--space-3`, comme le
  maître HubSidebar ; le pied qui le suit ne redouble pas le filet. Le libellé d'une entrée cède
  (ellipse) avant son appoint ; en tiroir, la bascule de repli est masquée.
- **`Sidebar` : l'en-tête et le pied n'ont plus de gouttière propre.** `.ds-sidebar__head` et
  `.ds-sidebar__foot` portaient un `padding-inline` de `--space-2` que la nav n'avait pas : le logo
  et les cartes du pied (crédits, compte) rendaient plus étroits que les entrées, et le logo se
  décalait à droite de leurs icônes — constat de Julien sur le Hub (08/09/2026). Le maître
  `HubSidebar` aligne tout sur les mêmes bords ; c'est le **contenu** du slot qui porte son retrait,
  comme une entrée porte le sien. Un `footer` « avatar + nom » nu perd donc 8 px de retrait.

---

## 0.1.1 — le lockup du logo et l'échelle d'app ouverte aux apps

Deux manques remontés par le lot de refonte visuelle des écrans (08/09/2026), sortis du
`BACKLOG.md`. Aucune rupture d'API.

- **`Logo` : l'icône est plus grande que le mot.** En `wordmark` et `stacked`, l'icône fait
  désormais 44/30 du corps des lettres et se centre sur elles — le lockup des maquettes d'auth
  (icône 44 px, mot 1,875 rem). Le composant rendait les deux à la même taille, et le mot
  sortait trop gros. `height` garde sa valeur pour le mot : seul le mark grandit chez les
  appelants existants. `monogram` ne bouge pas (les maquettes C1 le posent tel quel).
- **`app-scale.css` : le garde-fou `min-width` passe sous `@media (min-width: 64rem)`.** Posé
  hors media query, il forçait un défilement horizontal sur téléphone, ce qui interdisait le
  module à toute app publique avec du mobile — le Hub restait donc sans échelle et rendait
  « petit » sur grand écran à côté des autres apps. Les quatre bandes de zoom ne changent pas.
  Le module n'est plus « outils internes desktop uniquement » : ce sont les apps qui
  l'importent, jamais le site public, les e-mails ni les slides.
- **Le lien texte se souligne au survol.** `a:where(:hover){text-decoration:underline}` dans
  `tokens/base.css`, à spécificité de type : les composants rendus en `<a>` qui posent
  `text-decoration:none` dans leur classe (`.ds-btn`, `.ds-navlink`, `.ds-sidenav`) ne bougent
  pas. Décision de Julien sur l'écran de connexion, valable pour tout lien texte de l'écosystème.
  Corollaire pour les apps : ne pas poser `no-underline` sur un lien texte, il neutraliserait le
  survol.

---

## 0.1.0 — le design system Yunary

Premier lot. Le socle du gabarit (millésime **v0.6.0**) est repris **sans modification**, et la
marque Yunary est écrite en face.

### La marque

- **`src/styles/brand-yunary.css`** — les 54 jetons du contrat en `:root`, 32 redéclarés en
  `.dark`, plus les 3 jetons métier. Encre et crème, dégradé ambre `#f5a524` → orange `#f08029`
  → corail `#e84c3d`.
- **L'échelle des surfaces a été refaite, pas transposée.** Le design system Yunary précédent
  empilait plusieurs surfaces sur la même valeur — `card`, `popover` et `muted` sur `#faf7f2` en
  clair, cinq surfaces sur `#2b2a28` en sombre. Tout ce qui se pose SUR une carte y disparaissait
  en thème sombre. Six crans distincts dans les deux thèmes, mesurés par `check-surfaces.mjs`,
  avec **2 écarts assumés** (`--secondary` / `--card`, le régime de contrôles posés à même la
  page).
- **Les jumeaux lisibles ont été créés** : `--primary-readable` et `--destructive-readable`
  n'existaient pas. Le corail de remplissage ne tient pas 4,5:1 en texte sur la crème ; liens,
  libellés actifs et messages d'erreur passent par les jumeaux, mesurés de 5,16 à 7,11.
- **Le contraste est mesuré, et les renoncements sont écrits.** 53 paires × 2 thèmes : 36
  conformes, **17 écarts assumés**, chacun déclaré dans le fichier de marque avec sa raison. Le
  détail est dans [`docs/accessibilite.md`](docs/accessibilite.md).
- **Les polices sont auto-hébergées.** Onest 700/800, DM Sans 400/500/600/700, DM Mono 400/500 —
  16 `.woff2` dans `src/styles/assets/fonts/`, deux sous-ensembles par graisse avec leur
  `unicode-range`. Pas de Google Fonts : une police qui ne charge pas ne dégrade pas « un peu »,
  elle change toute la mise en page. Le rendu est le même hors ligne.

### Les deux écarts au socle

Le socle ne s'ouvre pas — sauf aux deux endroits que le contrat de portage prévoit.

- **`patterns.css`** — 9 traitements Yunary changent une **règle**, pas seulement une valeur :
  rayon des contrôles dérivé de la hauteur (`hauteur ÷ 3`), onglet et page actifs sur la plaque
  `--accent`, pastille de marque sur `--pill-coral-bg`, toast et bandeau centrés, retraits de
  sidebar au bord optique de 24 px. Aucune classe renommée, aucune structure de DOM touchée : la
  vitrine et les composants lisent ces noms-là.
- **`Logo.tsx`** — mark **vectoriel** (le Y en squircle, dégradé de marque) en SVG inline, à la
  place de la pastille CSS du socle. API `variant` / `letters` / `height` / `wordmark` /
  `monogram` / `dot` / `label` conservée. Le monogramme *textuel* n'est plus rendu — l'icône le
  remplace — donc `BRAND_MONOGRAM` n'est plus lu par le composant, et le libellé accessible de
  la variante `monogram` retombe sur le mot-marque complet.

### Deux gardes recalés

`check-contrast.mjs` mesurait des jetons que `patterns.css` ne pose plus. Quand une règle change
de jeton, le garde doit suivre — sinon il valide une couleur qui n'est plus à l'écran.

- `.ds-cal__day.is-today` mesure `--primary`, et non le jumeau lisible.
- `.ds-pastille--brand — icône` mesure `--primary` sur `--pill-coral-bg` composité, et non
  l'ancien `--grad-soft`.

Les deux écarts que la correction met au jour (2,85 et 3,25) sont assumés par écrit : ce sont des
marqueurs graphiques, jamais seuls porteurs du sens.

### L'extension métier est montée

`brand-content.css` est importé par la vitrine et les 3 jetons `--tone-deep`,
`--gradient-thumbnail`, `--shadow-accent-hot` sont déclarés — la page Marque rend `HaloHot`. Ce
sont des surfaces d'**export** — miniatures, cartes motion — jamais un fond d'interface. Une app
Yunary qui n'en fait pas ne les importe pas et ne perd rien.

### Ce qui reste à faire avant de publier

`git init`, puis le tag `v0.1.0`, puis renseigner le compte et le dépôt dans la ligne
d'installation du README — `check-version.mjs` avertit tant que le dépôt n'est pas lisible.

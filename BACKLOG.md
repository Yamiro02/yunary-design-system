# Backlog — demandes d'évolution du design system

Ce que les apps et la coque ont dû composer elles-mêmes faute d'un composant du socle.
Une ligne par manque : qui le demande, ce qui a été fait en attendant, pour que la montée de
version du DS sache exactement quoi remplacer. Rien ici n'est versionné : une entrée sort
de cette liste quand le composant entre au socle, avec sa ligne de CHANGELOG.

| Manque | Demandé par | Solution provisoire | Ce que le socle devra remplacer |
|---|---|---|---|
| **Tab bar mobile** (navigation basse, 2 à 5 destinations, cible tactile, état actif) | shell | tiroir de `Sidebar` sous 64rem + barre haute `IconButton menu` (`AppLayout`) | la barre haute et le tiroir en mode `native` de `AppLayout` |
| **SegmentedControl** (choix unique pleine largeur, `role="radiogroup"`, hover / selected / focus-visible) | shell | `SegmentedControl` composé aux jetons dans `src/layout/SegmentedControl.tsx` — les `Tabs` n'ont ni `fullWidth` ni la sémantique de choix | `SegmentedControl` du shell, tel quel |
| **Chip cochable** (`ChoiceChip` : pilule à bordure 1.5px, coche quand cochée, `aria-pressed`, variante italique) | shell | `ChoiceChip` composé aux jetons dans `src/profil/ChoiceChip.tsx` — la maquette pose une pilule interactive, que la règle « pilule = badges seulement » ne prévoit pas | `ChoiceChip` du shell |
| **Tuile radio** (radio + libellé dans une tuile à bordure, sélection `border-primary bg-accent`, grille) | shell | `label` tuile autour du `Radio` du DS dans `src/profil/NicheCard.tsx` | la tuile, en gardant `Radio` dedans |
| **Slot d'icône sur `Input`** (icône de fin, ex. cadenas d'un champ verrouillé) | shell | `Input readOnly disabled` + `FormField help`, sans cadenas (Paramètres › Infos › e-mail) | l'aide textuelle reste, l'icône s'ajoute |
| **Mode photo ronde sans halo sur `Avatar`** (photo utilisateur, initiales de repli en dégradé de marque) | shell | avatar composé dans `src/layout/AccountCard.tsx`, repli `Avatar halo={false}` | l'avatar composé du shell |
| **`ContentIcon` sans TikTok** (`@yunary/ds/brand-content` ne connaît qu'Instagram et YouTube) | shell | `InstagramMark` et `TikTokMark` en SVG inline dans `src/auth/BrandMarks.tsx` du shell, à côté des marques Google et Apple | les deux glyphes réseau, remplacés par `ContentIcon` quand il couvrira TikTok |
| **Slot de préfixe sur `Input`** (préfixe fixe en tête de champ, ex. « @ » d'un pseudo — `unit` n'est qu'un suffixe) | hub | `Input` sous un `span` absolu « @ » + `pl-*` dans `apps/hub/src/pages/onboarding/CompteStep.tsx` (onboarding 1/5) | un `prefix` jumeau de `unit`, à gauche, `aria-hidden` |
| **Lockup du `Logo` : icône plus grande que le mot** (maquettes A1-A4 et OnboardShell : icône 44 px pour un mot-marque à 1,875 rem, soit ≈ 1,47× — le composant rend les deux à 1 em, le mot sort trop gros) | shell (pages d'auth), hub (onboarding) | `Logo variant="wordmark" height="2.25rem"` tel quel, mot trop grand, constaté par Julien le 08/09/2026 | le ratio du lockup dans `IconMark` (≈ 1,47 em, centré sur le mot) ou une prop de lockup — puis montée de version dans le shell et le Hub |
| **`app-scale.css` inutilisable par une app publique avec du mobile** (le module porte `body{min-width:1133px}` hors media query : importé par le Hub, il forcerait un défilement horizontal sur téléphone) | hub | le Hub n'importe pas le module : aucun zoom par palier d'écran, l'interface rend « petite » sur grand écran comparée aux autres apps — constaté par Julien le 08/09/2026 | le garde-fou `min-width` sous `@media (min-width: 64rem)` (ou un second point d'entrée sans garde), pour que le Hub et Creator puissent importer l'échelle |

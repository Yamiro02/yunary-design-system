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

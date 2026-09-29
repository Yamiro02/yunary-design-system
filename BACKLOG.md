# Backlog — demandes d'évolution du design system

Ce que les apps et la coque ont dû composer elles-mêmes faute d'un composant du socle.
Une ligne par manque : qui le demande, ce qui a été fait en attendant, pour que la montée de
version du DS sache exactement quoi remplacer. Rien ici n'est versionné : une entrée sort
de cette liste quand le composant entre au socle, avec sa ligne de CHANGELOG.

**Convention des maquettes, valable pour toute demande ci-dessous :** la pastille de marque
est **outlined** partout (`Pastille tone="brand" outlined`, carrée) — état vide, carte d'état
héros, en-tête de carte. Une composition qui la pose pleine ou ronde s'écarte des maquettes,
pas l'inverse. Consignée dans `docs/DESIGN.md` § 6.

| Manque | Demandé par | Solution provisoire | Ce que le socle devra remplacer |
|---|---|---|---|
| **Tab bar mobile** (navigation basse, 2 à 5 destinations, cible tactile, état actif) | shell | tiroir de `Sidebar` sous 64rem + barre haute `IconButton menu` (`AppLayout`) | la barre haute et le tiroir d'`AppLayout` sous 64rem |
| **SegmentedControl** (choix unique pleine largeur, `role="radiogroup"`, hover / selected / focus-visible) | shell | `SegmentedControl` composé aux jetons dans `src/layout/SegmentedControl.tsx` — les `Tabs` n'ont ni `fullWidth` ni la sémantique de choix | `SegmentedControl` du shell, tel quel |
| **Slot d'icône sur `Input`** (icône de fin, ex. cadenas d'un champ verrouillé) | shell | `Input readOnly disabled` + `FormField help`, sans cadenas (Paramètres › Infos › e-mail) | l'aide textuelle reste, l'icône s'ajoute |
| **Mode photo ronde sans halo sur `Avatar`** (photo utilisateur, initiales de repli en dégradé de marque) | shell | avatar composé dans `src/layout/AccountCard.tsx`, repli `Avatar halo={false}` | l'avatar composé du shell |
| **Slot de préfixe sur `Input`** (préfixe fixe en tête de champ, ex. « @ » d'un pseudo — `unit` n'est qu'un suffixe) | hub | `Input` sous un `span` absolu « @ » + `pl-*` dans `apps/hub/src/pages/parcours/ToiPage.tsx` | un `prefix` jumeau de `unit`, à gauche, `aria-hidden` |
| **`Modal` à corps défilant avec plafond de hauteur** — besoin GÉNÉRIQUE : n'importe quel contenu long (formulaire à plusieurs sections, texte légal, liste, iframe tierce) le rencontre. La modale n'a aucun plafond : un contenu plus haut que la fenêtre déborde du voile sans défiler, feuille mobile comprise. Attendu : le panneau plafonné à la hauteur du voile (`max-height` dans `.ds-scrim`, marges comprises), en-tête et pied fixes, **corps** (`.ds-modal__desc`) en `overflow-y:auto` avec `min-height:0` pour que la colonne flex se contracte — par défaut, sans prop | shell (le paiement embarqué, plus haut que 800 px sur mobile) | `PaymentView` fixe la hauteur de son contenu à `h-[min(80dvh,58.75rem)]` et fait défiler ses colonnes — valeurs hors jeton admises par Julien, à titre provisoire | le corps défilant natif de `Modal` ; la coque retire alors sa hauteur fixe |
| **Rôle de colonne à 560 px** (`--container-form`, entre `narrow` 480 et `read` 720 : la colonne d'un formulaire court centré — Toi, retour de paiement) | hub · shell | `max-w-[35rem]` dans `apps/hub/src/components/onboarding/OnboardShell.tsx` (`column="form"`) et dans `SubscriptionResultView` du shell (écran de retour de paiement, écart validé par Julien le 25/09/2026), valeurs assumées, documentées sur place | un rôle `--container-form: 35rem` + `max-w-form`, `basis-form` |
| **Keyframes d'entrée** (apparition « remontée + fondu » 560 ms, « pop » d'une pastille 420 ms, tracé d'un trait SVG en `stroke-dashoffset`, sur `--ease-standard` ; délais neutralisés sous `prefers-reduced-motion`, le socle ne réduit que les durées) — l'écran de retour de paiement (maquette « Yunary Hub Dashboard », `yreveal.js`) | shell | `Reveal` et `AnimatedCheck` dans `src/abonnement/motion.tsx` du shell, via `element.animate` (aucune CSS dans la coque), easing lu sur `--ease-standard`, durées de la maquette en dur ; validé par Julien le 25/09/2026 | des `@keyframes ds-rise / ds-pop / ds-draw` + utilitaires, ou des jetons de durée d'entrée ; la coque garde ses composants et lit les jetons |
| **Voile interne à un panneau** (un voile posé DANS une modale, au-dessus de son contenu : l'attente 3D Secure) — le voile du DS (`.ds-scrim`) est `fixed` et couvre la page | shell | `BankConfirmOverlay` : `absolute inset-0` + `bg-[color-mix(in_srgb,var(--tone-dark)_35%,transparent)]`, la recette du voile du DS à 35 % comme la maquette | un jeton `--scrim-inner` (ou une classe `.ds-scrim--inner`) |

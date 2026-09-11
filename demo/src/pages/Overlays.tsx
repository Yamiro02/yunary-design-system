import { useState } from 'react';
import { ActionSheet, Button, Dropdown, FormField, Icon, Input, Modal } from '@yunary/ds';
import { Block, Row, Section } from '../ui';

const MENU = [
  { label: 'Copier le lien', icon: <Icon name="copy" size="1rem" /> },
  { label: 'Ouvrir la vidéo', icon: <Icon name="play" size="1rem" /> },
  { label: 'Voir les stats', icon: <Icon name="trending-up" size="1rem" /> },
];

export function OverlaysPage() {
  const [open, setOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [sheet, setSheet] = useState(false);
  const [analyseOpen, setAnalyseOpen] = useState(false);
  const [reseauOpen, setReseauOpen] = useState(false);
  const [reseau, setReseau] = useState<'all' | 'ig' | 'tt'>('all');
  const RESEAUX = [
    { value: 'all' as const, label: 'Tous les réseaux' },
    { value: 'ig' as const, label: 'Instagram' },
    { value: 'tt' as const, label: 'TikTok' },
  ];
  const [phase, setPhase] = useState<'confirm' | 'loading' | 'result'>('confirm');
  const [statut, setStatut] = useState<'success' | 'error'>('success');
  const ouvrir = (p: 'confirm' | 'loading' | 'result', s?: 'success' | 'error') => {
    setPhase(p);
    if (s) setStatut(s);
    setOpen(true);
  };

  return (
    <div className="flex flex-col gap-space-7">
      <Section title="Modal" note="Panneau sur --popover, rayon 2xl, --shadow-lg, au-dessus d'un scrim --tone-dark à 45 % avec blur(2px). Largeur 23.75rem au-dessus de 64 rem ; en dessous, la MÊME modale devient une feuille basse — pleine largeur, coins hauts arrondis, poignée, entrée par le bas. Aucun JS de point de rupture : c'est du CSS.">
        <Block label="En vrai" hint="Le focus entre dans le panneau, y est piégé, Échap ferme, le focus revient au déclencheur, et le défilement de la page est verrouillé tant que la modale est ouverte. Réduis la fenêtre sous 1024 px pour la voir en feuille basse.">
          <Row>
            <Button variant="danger" onClick={() => ouvrir('confirm')}>Supprimer ce build</Button>
          </Row>
          <Row label="ouvrir directement dans une phase — en loading, rien ne ferme">
            <Button variant="secondary" size="sm" onClick={() => ouvrir('loading')}>loading</Button>
            <Button variant="secondary" size="sm" onClick={() => ouvrir('result', 'success')}>result succès</Button>
            <Button variant="secondary" size="sm" onClick={() => ouvrir('result', 'error')}>result erreur</Button>
          </Row>
          <Modal
            open={open}
            phase={phase}
            onClose={() => setOpen(false)}
            icon={<Icon name="triangle-alert" />}
            title={phase === 'loading' ? 'Suppression en cours' : 'Supprimer ce build ?'}
            description={phase === 'loading' ? 'Ne ferme pas cette fenêtre.' : 'Cette action est définitive.'}
            result={{
              status: statut,
              title: statut === 'error' ? 'La suppression a échoué' : 'Build supprimé',
              message: statut === 'error'
                ? 'Le service n’a pas répondu dans le délai imparti. Les fichiers sont intacts et le build reste disponible : réessaie dans un instant, ou vérifie la connexion avant de relancer.'
                : 'Les fichiers et la configuration ont été retirés du projet.',
              onRetry: statut === 'error' ? () => ouvrir('confirm') : undefined,
            }}
            footer={phase === 'result' ? undefined : (
              phase === 'loading'
                ? <><Button variant="ghost" disabled>Annuler</Button><Button variant="danger" loading>Suppression…</Button></>
                : <><Button variant="ghost" onClick={() => setOpen(false)}>Annuler</Button><Button variant="danger" onClick={() => ouvrir('loading')}>Supprimer</Button></>
            )}
          />
        </Block>

        <Block label="Les trois phases" hint="confirm → loading → result, dans UN seul dialogue. En loading rien ne ferme : Échap, clic dehors et croix sont inertes, le piège de focus tient toujours.">
          <div className="flex flex-wrap gap-space-5">
            <Modal inline iconVariant="danger" icon={<Icon name="trash-2" />}
              title="Supprimer ce build ?" description="Cette action est définitive."
              footer={<><Button variant="ghost" size="sm">Annuler</Button><Button variant="danger" size="sm">Supprimer</Button></>} />
            <Modal inline phase="loading" iconVariant="danger" icon={<Icon name="trash-2" />}
              onClose={() => undefined}
              title="Suppression en cours" description="Ne ferme pas cette fenêtre."
              footer={<><Button variant="ghost" size="sm" disabled>Annuler</Button><Button variant="danger" size="sm" loading>Suppression…</Button></>} />
            <Modal inline phase="result" onClose={() => undefined}
              result={{ status: 'success', title: 'Build supprimé', message: 'Les fichiers et la configuration ont été retirés du projet.' }} />
            <Modal inline phase="result" iconVariant="danger" onClose={() => undefined}
              result={{
                status: 'error',
                title: 'La suppression a échoué',
                message: 'Le service n’a pas répondu dans le délai imparti. Les fichiers sont intacts et le build reste disponible : réessaie dans un instant, ou vérifie la connexion avant de relancer.',
                onRetry: () => undefined,
              }} />
          </div>
        </Block>

        <Block label="Variantes de tuile d'icône" hint="La tuile est une <Pastille size=&quot;dialogue&quot;>. neutral lit la paire --pill-neutral-* comme Badge, Banner et Toast — une seule source sémantique.">
          <div className="flex flex-wrap gap-space-5">
            <Modal inline iconVariant="danger" icon={<Icon name="triangle-alert" />}
              title="Supprimer ce build ?" description="Cette action est définitive."
              footer={<><Button variant="ghost" size="sm">Annuler</Button><Button variant="danger" size="sm">Supprimer</Button></>} />
            <Modal inline iconVariant="brand" icon={<Icon name="rocket" />}
              title="Lancer le build ?" description="Claude Code va créer le projet et installer les dépendances."
              footer={<><Button variant="ghost" size="sm">Plus tard</Button><Button size="sm">Lancer</Button></>} />
            <Modal inline iconVariant="neutral" icon={<Icon name="info" />}
              title="À propos de cette série" description="Trois vidéos pour construire ton premier outil interne."
              footer={<Button variant="secondary" size="sm">Compris</Button>} />
            <Modal inline iconVariant="warning" icon={<Icon name="clock" />}
              title="Quota bientôt atteint" description="Il te reste deux exports ce mois-ci."
              footer={<Button variant="secondary" size="sm">Compris</Button>} />
            <Modal inline iconVariant="success" icon={<Icon name="circle-check" />}
              title="Déploiement terminé" description="Ton outil est en ligne."
              footer={<Button variant="secondary" size="sm">Voir</Button>} />
          </div>
        </Block>

        <Block label="Sans icône, avec fermeture" hint="Sans pastille, le titre partage la ligne de la croix, centré verticalement (v0.1.4) — la croix seule laissait le titre 46-56 px sous le bord.">
          <Modal inline onClose={() => undefined} title="Ta session a expiré" description="Reconnecte-toi pour reprendre là où tu en étais."
            footer={<Button size="sm">Se reconnecter</Button>} />
        </Block>

        <Block label="size=lg — la modale à formulaire" hint="32,5 rem (--modal-w-lg), la maquette 02 de Creator. md (23,75 rem) reste la confirmation et le résultat. Sous 64 rem, les deux sont la même feuille en pleine largeur.">
          <Row>
            <Button variant="primary" icon={<Icon name="plus" />} onClick={() => setAnalyseOpen(true)}>Analyser une vidéo</Button>
          </Row>
          <Modal
            open={analyseOpen}
            size="lg"
            onClose={() => setAnalyseOpen(false)}
            title="Analyser une vidéo"
            footer={<><Button variant="secondary" onClick={() => setAnalyseOpen(false)}>Annuler</Button><Button onClick={() => setAnalyseOpen(false)}>Lancer l'analyse</Button></>}
          >
            <FormField label="Lien de la vidéo" htmlFor="demo-analyse" help="Instagram et TikTok · YouTube arrive bientôt">
              <Input id="demo-analyse" type="url" placeholder="Colle le lien d'un Reel Instagram ou d'un TikTok" />
            </FormField>
          </Modal>
          <Modal inline size="lg" onClose={() => undefined} title="Analyser une vidéo"
            footer={<><Button variant="secondary" size="sm">Annuler</Button><Button size="sm">Lancer l'analyse</Button></>}>
            <FormField label="Lien de la vidéo" htmlFor="demo-analyse-inline" help="Instagram et TikTok · YouTube arrive bientôt">
              <Input id="demo-analyse-inline" type="url" placeholder="Colle le lien d'un Reel Instagram ou d'un TikTok" />
            </FormField>
          </Modal>
        </Block>

        <Block label="Croix et gestes de fuite découplés" hint="closeButton={false} retire la croix en gardant Échap et le clic-voile ; dismissable={false} fait l'inverse — la croix devient le seul geste de fermeture, pour une saisie qu'un clic à côté ne doit pas jeter. Défauts à true : comportement historique.">
          <div className="flex flex-wrap gap-space-4">
            <Modal inline onClose={() => undefined} closeButton={false} title="Sans croix"
              description="Échap et le clic-voile ferment toujours — la croix seule a disparu."
              footer={<Button variant="secondary" size="sm">Fermer</Button>} />
            <Modal inline onClose={() => undefined} dismissable={false} title="Croix seule"
              description="Échap et le clic-voile sont inertes : on ne jette pas une saisie d'un clic à côté."
              footer={<Button size="sm">Enregistrer</Button>} />
          </div>
        </Block>

        <Block label="Avec un champ contrôlé" hint="Le cas de recette du focus : chaque frappe re-rend le parent (état contrôlé) ET recrée la lambda onClose. Si l'effet du piège de focus se relançait à chaque rendu, le focus sauterait du champ après chaque caractère — tape plusieurs caractères d'affilée pour le vérifier. Échap ferme et rend le focus au bouton déclencheur.">
          <Row>
            <Button variant="secondary" onClick={() => setRenameOpen(true)}>Renommer le projet</Button>
          </Row>
          <Modal
            open={renameOpen}
            onClose={() => setRenameOpen(false)}
            title="Renommer le projet"
            description="Le nom apparaît dans la sidebar et sur la page d'accueil."
            footer={
              <>
                <Button variant="ghost" onClick={() => setRenameOpen(false)}>Annuler</Button>
                <Button onClick={() => setRenameOpen(false)} disabled={projectName.trim() === ''}>Renommer</Button>
              </>
            }
          >
            <FormField label="Nom du projet" htmlFor="demo-rename">
              <Input
                id="demo-rename"
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
                placeholder="mon-outil-interne"
                surface="card"
              />
            </FormField>
          </Modal>
        </Block>
      </Section>

      <Section title="ActionSheet" note="Le menu ⋯ sur mobile : une feuille basse d'actions, Annuler intégré. Chaque ligne fait au moins --control-md — le rail tactile, non négociable.">
        <Block label="La doctrine ⋯" hint="Dropdown est desktop only. Sous 64 rem, un menu ⋯ ouvre TOUJOURS une ActionSheet, jamais un Dropdown. Ce ne sont pas deux composants concurrents : c'est le même geste sur deux tailles d'écran. Au-dessus de 64 rem, .ds-scrim--sheet est en display:none — une ActionSheet modale y est impossible par construction, et le composant le signale en console en développement.">
          <Row>
            <Button variant="secondary" onClick={() => setSheet(true)}>Ouvrir le menu ⋯</Button>
          </Row>
          <ActionSheet
            open={sheet}
            onCancel={() => setSheet(false)}
            items={[...MENU.map(m => ({ ...m, onSelect: () => setSheet(false) })),
              { label: 'Supprimer', icon: <Icon name="trash-2" size="1rem" />, danger: true, onSelect: () => setSheet(false) }]}
          />
        </Block>

        <Block label="inline panel — la forme desktop" hint="Au-dessus de 64 rem elle n'existe qu'en spécimen : 20rem, quatre coins au rayon 2xl, bordure complète, sans poignée, sans voile.">
          <Row>
            <ActionSheet inline panel items={MENU} />
            <ActionSheet inline panel items={[
              { label: 'Item au repos', icon: <Icon name="file-text" size="1rem" /> },
              { label: 'Item survolé', icon: <Icon name="file-text" size="1rem" />, className: 'is-hover' },
              { label: 'Ligne cochée', icon: <Icon name="file-text" size="1rem" />, checked: true },
              { label: 'Supprimer la vidéo', icon: <Icon name="trash-2" size="1rem" />, danger: true }]} />
            <ActionSheet inline panel
              title="Vidéo 3 — le déploiement"
              subtitle="Publiée le 24 septembre"
              note="La suppression retire aussi la miniature et les sous-titres. Elle est définitive."
              items={[...MENU,
                { label: 'Supprimer la vidéo', icon: <Icon name="trash-2" size="1rem" />, danger: true }]} />
          </Row>
        </Block>
      </Section>

      <Section title="Dropdown" note="Panneau de menu, rayon lg, --shadow-lg. Les items s'éclairent sur --surface-alt ; l'item coché porte la convention de l'élément sélectionné. DESKTOP ONLY — sous 64 rem, c'est l'ActionSheet ci-dessus qui prend le relais.">
        <Block label="Ancré sous son déclencheur — align=end" hint="Flottant, le panneau se pose juste sous le bouton, dans un parent position:relative (à poser par l'app). align=end colle les bords droits — le menu d'un bouton en bout de ligne. Avant la 0.1.4, sans top/left, il s'ouvrait À DROITE du bouton. Un menu de CHOIX : checked pose role=menuitemradio + aria-checked, texte --primary (corail) sur --accent à la même graisse, coche en currentColor en fin de ligne, rail de 44 px.">
          <div className="flex justify-end">
            <span className="relative inline-flex">
              <Button variant="secondary" iconRight={<Icon name="chevron-down" />} aria-haspopup="menu" aria-expanded={reseauOpen} onClick={() => setReseauOpen(o => !o)}>
                {RESEAUX.find(r => r.value === reseau)?.label}
              </Button>
              {reseauOpen ? (
                <Dropdown align="end" items={RESEAUX.map(r => ({
                  label: r.label, checked: r.value === reseau,
                  onSelect: () => { setReseau(r.value); setReseauOpen(false); },
                }))} />
              ) : null}
            </span>
          </div>
        </Block>

        <Block label="inline — rendu dans le flux" hint="Posé à côté de l'ActionSheet ci-dessus, la parenté se voit : mêmes lignes, mêmes tons. Le Dropdown garde son filet — dense, survolé à la souris — là où la feuille du bas l'a perdu. Le troisième mélange choix cochés et action : les deux coexistent dans un même menu.">
          <Row>
            <Dropdown inline items={[
              { label: 'Copier le lien', icon: <Icon name="copy" size="1rem" /> },
              { label: 'Ouvrir la vidéo', icon: <Icon name="play" size="1rem" />, hint: '⏎' },
              { label: 'Voir les stats', icon: <Icon name="trending-up" size="1rem" /> },
              { separator: true },
              { label: 'Supprimer', icon: <Icon name="trash-2" size="1rem" />, danger: true },
            ]} />
            <Dropdown inline items={[
              { label: 'Item au repos', icon: <Icon name="file-text" size="1rem" /> },
              { label: 'Item survolé', icon: <Icon name="file-text" size="1rem" />, className: 'is-hover' },
              { separator: true },
              { label: 'Action risquée', icon: <Icon name="triangle-alert" size="1rem" />, danger: true },
            ]} />
            <Dropdown inline items={[
              { label: 'Tous les réseaux', checked: true },
              { label: 'Instagram', checked: false },
              { label: 'TikTok', checked: false, className: 'is-hover' },
              { separator: true },
              { label: 'Réinitialiser les filtres', icon: <Icon name="x" size="1rem" /> },
            ]} />
          </Row>
        </Block>
      </Section>

    </div>
  );
}

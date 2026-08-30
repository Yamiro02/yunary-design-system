import { Badge, Button, Card, EmptyState, Icon, IconButton, Input, Pastille, Separator, Table, TBody, Td, Th, THead, Tooltip, Tr } from '@yunary/ds';
import { Block, Grid, Row, Section, Stack } from '../ui';

const TONES = ['coral', 'amber', 'danger', 'warning', 'success', 'neutral', 'accent', 'outline'] as const;
const TAILLES = ['carte', 'dialogue', 'panneau', 'heros', 'ecran'] as const;
const TONS_PASTILLE = ['brand', 'brand-solid', 'coral', 'amber', 'success', 'warning', 'danger', 'neutral', 'inverse'] as const;

export function DataDisplayPage() {
  return (
    <div className="flex flex-col gap-space-7">
      <Section title="Card" note="La surface signature : fond --card teinté, bordure 1px, rayon lg ou xl, ombre teintée. Jamais une card blanche.">
        <Block label="Variantes" hint="Les gaps de grille entre cards sont ≥ 1.5rem.">
          <Grid cols={3}>
            <Card>
              <h4>Card par défaut</h4>
              <p className="caption">Statique, --shadow-sm au repos.</p>
            </Card>
            <Card variant="interactive">
              <h4>Card interactive</h4>
              <p className="caption">translateY(-2px) vers --shadow-md au survol.</p>
            </Card>
            <Card variant="feature">
              <h4>Card feature</h4>
              <p className="caption">Lavis --grad-soft et bordure teintée de --primary.</p>
            </Card>
          </Grid>
        </Block>

        <Block label="États d'une card interactive">
          <Grid cols={3}>
            <Card variant="interactive" className="is-hover"><h4>Hover</h4><p className="caption">--shadow-md</p></Card>
            <Card variant="interactive" className="is-active"><h4>Press</h4><p className="caption">retour à --shadow-sm</p></Card>
            <Card variant="interactive" className="is-focus"><h4>Focus</h4><p className="caption">anneau 3px --ring</p></Card>
          </Grid>
        </Block>

        <Block label="Tailles et flush" hint="md = rayon lg / padding 1.5rem · lg = rayon xl / padding 1.75rem.">
          <Grid cols={3}>
            <Card size="md"><h4>Taille md</h4><p className="caption">--card-pad</p></Card>
            <Card size="lg"><h4>Taille lg</h4><p className="caption">--card-pad-lg</p></Card>
            <Card flush>
              <span className="block h-space-8 bg-grad-soft" />
              <div className="p-card-pad">
                <h4>Flush</h4>
                <p className="caption">Média pleine largeur, padding porté par le contenu.</p>
              </div>
            </Card>
          </Grid>
        </Block>

        <Block label="En-tête à slots" hint="eyebrow · icon · title · subtitle · action, tous optionnels. Aucun slot passé = AUCUN noeud d'en-tête émis. L'ALIGNEMENT est décidé par le socle, jamais par une prop : titre simple = rangée centrée ; titre + sous-titre = flex-start, l'action s'aligne sur le titre au lieu de flotter entre les deux lignes.">
          <Grid cols={2}>
            <Card
              icon={<Pastille size="carte" tone="brand"><Icon name="terminal" /></Pastille>}
              title="Titre simple — rangée centrée"
              action={<IconButton size="sm" label="Actions"><Icon name="ellipsis" /></IconButton>}
            >
              <p className="caption">Le cas majoritaire : icône, titre et action partagent un axe.</p>
            </Card>
            <Card
              eyebrow="Build"
              icon={<Pastille size="carte" tone="brand"><Icon name="rocket" /></Pastille>}
              title="Premier outil interne"
              subtitle="Créé il y a deux jours"
              action={<IconButton size="sm" label="Actions"><Icon name="ellipsis" /></IconButton>}
            >
              <p className="caption">Avec un sous-titre : flex-start — l'action tient la ligne du haut.</p>
            </Card>
            <Card
              size="lg"
              titleSize="lg"
              headerGap="airy"
              eyebrow="Série"
              title="Trois vidéos, un outil"
              subtitle="Du zéro au premier déploiement"
            >
              <Stack>
                <p className="caption">titleSize=&quot;lg&quot; passe le titre en --text-subheading.</p>
                <p className="caption">headerGap=&quot;airy&quot; ouvre la gouttière à --space-6, pour une carte à blocs.</p>
              </Stack>
            </Card>
          </Grid>
        </Block>
      </Section>

      <Section title="Pastille" note="La tuile d'icône du système — une seule pour toutes les tuiles teintées. Les tailles sont nommées PAR CONTEXTE, jamais par mesure : un site d'appel n'écrit jamais un rem.">
        <Block label="Tailles" hint="carte 2.25 · dialogue 2.625 · panneau 3.25 · héros 4 · écran 5rem. Le rayon suit la taille : sm · md · lg · xl · 2xl.">
          <Row>
            {TAILLES.map(t => (
              <div key={t} className="flex flex-col items-center gap-space-2">
                <Pastille size={t}><Icon name="rocket" size="1.25rem" /></Pastille>
                <span className="mono text-caption text-text-muted">{t}</span>
              </div>
            ))}
          </Row>
          <Row label="shape=&quot;round&quot; — le rayon passe à --radius-pill">
            {TAILLES.map(t => <Pastille key={t} size={t} shape="round"><Icon name="user" size="1.25rem" /></Pastille>)}
          </Row>
        </Block>

        <Block label="Tons" hint="brand (--grad-soft) + les 6 paires sémantiques + inverse. Les mêmes paires que Badge, Banner et Toast — une seule source.">
          <Row>
            {TONS_PASTILLE.map(t => (
              <div key={t} className="flex flex-col items-center gap-space-2">
                <Pastille tone={t}><Icon name="circle-check" size="1.25rem" /></Pastille>
                <span className="mono text-caption text-text-muted">{t}</span>
              </div>
            ))}
          </Row>
          <Row label="outlined — le filet 1px currentColor à 22 %, celui d'EmptyState, généralisé">
            {TONS_PASTILLE.map(t => <Pastille key={t} tone={t} outlined><Icon name="zap" size="1.25rem" /></Pastille>)}
          </Row>
        </Block>
      </Section>

      <Section title="Badge" note="Le rayon pill est légal ici. Les tons sémantiques portent toujours une icône + du texte.">
        <Block label="Tous les tons">
          <Row>
            <Badge tone="success" icon={<Icon name="circle-check" size="0.875rem" strokeWidth={2.5} />}>En ligne</Badge>
            <Badge tone="danger" icon={<Icon name="circle-alert" size="0.875rem" strokeWidth={2.5} />}>Échec</Badge>
            <Badge tone="warning" icon={<Icon name="triangle-alert" size="0.875rem" strokeWidth={2.5} />}>À vérifier</Badge>
            <Badge tone="coral" icon={<Icon name="zap" size="0.875rem" strokeWidth={2.5} />}>Nouveau</Badge>
            <Badge tone="amber" icon={<Icon name="clock" size="0.875rem" strokeWidth={2.5} />}>Bientôt</Badge>
            <Badge tone="accent" icon={<Icon name="rocket" size="0.875rem" strokeWidth={2.5} />}>Mis en avant</Badge>
            <Badge tone="neutral">Brouillon</Badge>
            <Badge tone="outline">Archivé</Badge>
          </Row>
          <Row label="sans icône">
            {TONES.map(t => <Badge key={t} tone={t}>{t}</Badge>)}
          </Row>
        </Block>

        <Block label="Rembourrages" hint="md = --badge-h (29 px), la hauteur historique, figée pour non-régression · dense = --badge-h-dense (24 px), celle qui s'aligne sur une pilule d'état de la même rangée. Icône 0.875rem en md, 0.75rem en dense.">
          <Row label="md — posé à côté d'un Button sm et d'un Input sm">
            <Badge tone="success" icon={<Icon name="circle-check" size="0.875rem" strokeWidth={2.5} />}>En ligne</Badge>
            <Button size="sm" variant="secondary">Action</Button>
            <Input size="sm" defaultValue="Champ sm" style={{ width: '9rem' }} />
          </Row>
          <Row label="dense — même rangée, alignement retrouvé">
            <Badge pad="dense" tone="success" icon={<Icon name="circle-check" size="0.75rem" strokeWidth={2.5} />}>En ligne</Badge>
            <Badge pad="dense" tone="coral" icon={<Icon name="zap" size="0.75rem" strokeWidth={2.5} />}>Nouveau</Badge>
            <Badge pad="dense" tone="neutral">Brouillon</Badge>
          </Row>
        </Block>
      </Section>

      <Section title="Separator" note="Filet fin en --border. Avec label, le texte est centré sur la ligne.">
        <Block label="Orientations et libellé">
          <Stack>
            <Separator />
            <Separator label="ou" />
            <Separator label="Publié le 24 septembre" />
          </Stack>
          <Row label="vertical">
            <span className="flex h-space-6 items-center gap-space-4">
              <span className="caption">Build</span>
              <Separator orientation="vertical" />
              <span className="caption">Tuto</span>
              <Separator orientation="vertical" />
              <span className="caption">Coulisses</span>
            </span>
          </Row>
        </Block>
      </Section>

      <Section title="Table" note="Composable : Table > THead/TBody > Tr > Th/Td. L'état vide se rend À LA PLACE de la table, jamais dedans.">
        <Block label="Simple, rayée, survolable">
          <Table hoverable striped>
            <THead>
              <Tr><Th>Vidéo</Th><Th>Série</Th><Th>Publiée</Th><Th>Statut</Th></Tr>
            </THead>
            <TBody>
              <Tr><Td>Construire une app en un week-end</Td><Td>Build</Td><Td>il y a 3 j</Td><Td><Badge tone="success" icon={<Icon name="circle-check" size="0.875rem" strokeWidth={2.5} />}>En ligne</Badge></Td></Tr>
              <Tr><Td>Cadrer une idée en une phrase</Td><Td>Tuto</Td><Td>il y a 9 j</Td><Td><Badge tone="success" icon={<Icon name="circle-check" size="0.875rem" strokeWidth={2.5} />}>En ligne</Badge></Td></Tr>
              <Tr><Td>Le prompt que j'utilise tous les jours</Td><Td>Build</Td><Td>il y a 16 j</Td><Td><Badge tone="neutral">Brouillon</Badge></Td></Tr>
              <Tr><Td>Ce que Claude Code ne sait pas faire</Td><Td>Coulisses</Td><Td>il y a 24 j</Td><Td><Badge tone="warning" icon={<Icon name="triangle-alert" size="0.875rem" strokeWidth={2.5} />}>À revoir</Badge></Td></Tr>
            </TBody>
          </Table>
        </Block>
        <Block label="Sans option">
          <Table>
            <THead><Tr><Th>Palier</Th><Th>Valeur</Th></Tr></THead>
            <TBody>
              <Tr><Td>Rayon des contrôles</Td><Td className="mono">--radius-md</Td></Tr>
              <Tr><Td>Rail de hauteur</Td><Td className="mono">--control-md</Td></Tr>
            </TBody>
          </Table>
        </Block>
        <Block label="framed" hint="Contour autonome : bordure 1px --border, rayon lg, fond --card, en-tête sur --background. Plus besoin de l'envelopper dans une Card flush.">
          <Table framed>
            <THead><Tr><Th>Série</Th><Th>Vidéos</Th><Th>Dernière</Th></Tr></THead>
            <TBody>
              <Tr><Td>Build</Td><Td>14</Td><Td>il y a 3 j</Td></Tr>
              <Tr><Td>Tuto</Td><Td>9</Td><Td>il y a 9 j</Td></Tr>
              <Tr><Td>Coulisses</Td><Td>4</Td><Td>il y a 24 j</Td></Tr>
            </TBody>
          </Table>
        </Block>
        <Block label="framed columns" hint="Les séparateurs verticaux rendent la structure des colonnes lisible.">
          <Table framed columns>
            <THead><Tr><Th>Série</Th><Th>Vidéos</Th><Th>Dernière</Th></Tr></THead>
            <TBody>
              <Tr><Td>Build</Td><Td>14</Td><Td>il y a 3 j</Td></Tr>
              <Tr><Td>Tuto</Td><Td>9</Td><Td>il y a 9 j</Td></Tr>
              <Tr><Td>Coulisses</Td><Td>4</Td><Td>il y a 24 j</Td></Tr>
            </TBody>
          </Table>
        </Block>
        <Block label="framed columns striped hoverable" hint="Les quatre options se composent librement.">
          <Table framed columns striped hoverable>
            <THead><Tr><Th>Vidéo</Th><Th>Série</Th><Th>Publiée</Th><Th>Statut</Th></Tr></THead>
            <TBody>
              <Tr><Td>Construire une app en un week-end</Td><Td>Build</Td><Td>il y a 3 j</Td><Td><Badge tone="success" icon={<Icon name="circle-check" size="0.875rem" strokeWidth={2.5} />}>En ligne</Badge></Td></Tr>
              <Tr><Td>Cadrer une idée en une phrase</Td><Td>Tuto</Td><Td>il y a 9 j</Td><Td><Badge tone="success" icon={<Icon name="circle-check" size="0.875rem" strokeWidth={2.5} />}>En ligne</Badge></Td></Tr>
              <Tr><Td>Le prompt que j'utilise tous les jours</Td><Td>Build</Td><Td>il y a 16 j</Td><Td><Badge tone="neutral">Brouillon</Badge></Td></Tr>
              <Tr><Td>Ce que Claude Code ne sait pas faire</Td><Td>Coulisses</Td><Td>il y a 24 j</Td><Td><Badge tone="warning" icon={<Icon name="triangle-alert" size="0.875rem" strokeWidth={2.5} />}>À revoir</Badge></Td></Tr>
            </TBody>
          </Table>
        </Block>
        <Block label="État vide" hint="La table disparaît, l'EmptyState prend sa place.">
          <EmptyState
            icon={<Icon name="folder" size="1.5rem" />}
            title="Aucune vidéo"
            description="Publie ton premier build pour voir la liste se remplir."
          />
        </Block>
      </Section>

      <Section title="Tooltip" note="Bulle --tone-dark au survol et au focus ; elle s'inverse en --tone-light-alt en thème sombre. Libellé court uniquement.">
        <Block label="Placement et ouverture forcée">
          <Row>
            <Tooltip content="Copier le prompt">
              <IconButton label="Copier"><Icon name="copy" /></IconButton>
            </Tooltip>
            <Tooltip content="Ouvrir la vidéo" placement="bottom">
              <IconButton label="Lire"><Icon name="play" /></IconButton>
            </Tooltip>
          </Row>
          <Row label="open — pour la recette">
            <span className="inline-flex pt-space-6">
              <Tooltip content="Copier le prompt" open>
                <IconButton label="Copier" variant="secondary"><Icon name="copy" /></IconButton>
              </Tooltip>
            </span>
            <span className="inline-flex pb-space-6">
              <Tooltip content="Ouvrir la vidéo" placement="bottom" open>
                <IconButton label="Lire" variant="secondary"><Icon name="play" /></IconButton>
              </Tooltip>
            </span>
          </Row>
        </Block>
      </Section>
    </div>
  );
}

import { useState } from 'react';
import { ContentIcon } from '@yunary/ds/brand-content';
import { IDENTITY } from '../identity';
import { AppShell, Avatar, Button, Footer, Icon, IconButton, Navbar, Pagination, Sidebar, Tabs, Logo } from '@yunary/ds';
import { Block, Row, Section } from '../ui';

const LINKS = [{ label: 'Vidéos', active: true }, { label: 'Séries' }, { label: 'À propos' }];
const SERIES = [
  { value: 'all', label: 'Tout' },
  { value: 'build', label: 'Build' },
  { value: 'tuto', label: 'Tuto' },
  { value: 'coulisses', label: 'Coulisses' },
];

export function NavigationPage() {
  const [tab, setTab] = useState('build');
  const [page, setPage] = useState(4);
  const [longPage, setLongPage] = useState(12);

  return (
    <div className="flex flex-col gap-space-7">
      <Section title="Navbar" note="Posée sur --secondary avec une bordure basse en permanence — c'est un contrôle détaché du layout, jamais transparent. Au scroll elle se teinte, prend un blur(10px) et une ombre. Seul endroit du système qui utilise backdrop-filter.">
        <Block label="Au repos">
          <div className="overflow-x-auto rounded-xl border border-border">
            <Navbar homeLabel={`${IDENTITY.personne} — accueil`} brand={<Logo variant="wordmark" wordmark={IDENTITY.wordmark} height="1.375rem" />} scrolled={false} links={LINKS} cta={<Button size="sm">La newsletter</Button>} />
          </div>
        </Block>
        <Block label="État scrollé" hint="Teinte color-mix sur --secondary + blur + ombre.">
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <Navbar homeLabel={`${IDENTITY.personne} — accueil`} brand={<Logo variant="wordmark" wordmark={IDENTITY.wordmark} height="1.375rem" />} scrolled links={LINKS} cta={<Button size="sm">La newsletter</Button>} />
          </div>
        </Block>
        <Block label="Tons du logo" hint="Sans la prop letters, les lettres suivent --foreground : sur une surface sombre elles s'éclaircissent toutes seules. letters ne sert qu'à forcer.">
          <div className="dark overflow-x-auto rounded-xl border border-border bg-background">
            <Navbar homeLabel={`${IDENTITY.personne} — accueil`} brand={<Logo variant="wordmark" wordmark={IDENTITY.wordmark} height="1.375rem" />} scrolled links={LINKS} cta={<Button size="sm">La newsletter</Button>} />
          </div>
          <div className="dark overflow-x-auto rounded-xl border border-border bg-background">
            <Navbar homeLabel={`${IDENTITY.personne} — accueil`} brand={<Logo variant="wordmark" wordmark={IDENTITY.wordmark} letters="dark" height="1.375rem" />} scrolled letters="dark" links={LINKS} cta={<Button size="sm">La newsletter</Button>} />
          </div>
          <p className="caption">Le premier suit la surface ; le second force letters=&quot;dark&quot; sur fond sombre, pour montrer ce que fait la prop.</p>
        </Block>
      </Section>

      <Section title="Tabs" note="Groupe d'onglets sur --secondary. L'onglet actif porte LA convention de l'élément sélectionné du socle : plaque --accent, texte --primary (le corail de la v1, écart de contraste assumé dans la marque — v0.1.5), même graisse que ses voisins — celle de l'entrée de Sidebar, de la page courante, de l'item de menu coché. Jamais noir gras.">
        <Block label="Interactif">
          <Row><Tabs items={SERIES} value={tab} onChange={setTab} /></Row>
          <p className="caption">Onglet actif : {SERIES.find(s => s.value === tab)?.label}</p>
        </Block>
        <Block label="onCard" hint="La barre contraste avec sa surface porteuse ET l'onglet actif contraste avec la barre : il descend d'un cran de surface, jamais au niveau de la barre. Sur la page : barre --secondary, actif --background. Sur une card : barre --background, actif --card. Vérifie les deux en clair ET en sombre — en sombre, --card et --secondary valent tous les deux #2b2a28, un actif en --card y serait invisible.">
          <Row label="sur la page (défaut)"><Tabs items={SERIES} value="build" onChange={() => undefined} /></Row>
          <Row label="sur une card — onCard">
            <span className="inline-flex rounded-lg border border-border bg-card p-space-4">
              <Tabs onCard items={SERIES} value="build" onChange={() => undefined} />
            </span>
          </Row>
        </Block>
        <Block label="États">
          <Row label="sélection sur chaque item">
            <Tabs items={SERIES} value="all" onChange={() => undefined} />
          </Row>
          <Row label="survol forcé sur le deuxième item">
            <div className="ds-tabs">
              <button type="button" className="ds-tab" aria-selected="true">Tout</button>
              <button type="button" className="ds-tab is-hover">Build</button>
              <button type="button" className="ds-tab">Tuto</button>
            </div>
          </Row>
        </Block>
      </Section>

      <Section title="Pagination" note="Contrôlée. Barre --secondary, même traitement que les onglets ; la page courante reprend l'onglet actif. Au-delà de 7 pages, une ellipsis en icône — jamais le caractère.">
        <Block label="Peu de pages">
          <Row><Pagination page={page} pageCount={5} onPageChange={setPage} /></Row>
          <p className="caption">Page {page} sur 5.</p>
        </Block>
        <Block label="Beaucoup de pages" hint="Ellipsis des deux côtés selon la position.">
          <Row><Pagination page={longPage} pageCount={40} onPageChange={setLongPage} /></Row>
          <Row label="première page"><Pagination page={1} pageCount={40} onPageChange={() => undefined} /></Row>
          <Row label="dernière page"><Pagination page={40} pageCount={40} onPageChange={() => undefined} /></Row>
        </Block>
        <Block label="Page unique" hint="Les deux flèches sont désactivées.">
          <Row><Pagination page={1} pageCount={1} onPageChange={() => undefined} /></Row>
        </Block>
      </Section>

      <Section title="AppShell et Sidebar" note="Le squelette des outils internes : grille [barre latérale | contenu]. La barre est sur --secondary, repliable en icônes seules, et l'état est persisté en localStorage. L'entrée active : plaque --accent, libellé --primary (corail, v0.1.5), graisse inchangée, icône en currentColor — le rendu de la v1, plus de surface-alt + gras + icône --brand-via.">
        <Block label="Complet" hint="responsive={false} et staticLayout épinglent la mise en page à deux colonnes pour la vitrine. Chaque section est un groupe : 16px les séparent, avec ou sans titre — le dernier groupe, sans titre, ne se colle plus au précédent.">
          <div className="overflow-hidden rounded-xl border border-border">
            <AppShell
              responsive={false}
              sidebar={
                <Sidebar
                  brand={<Logo variant="wordmark" wordmark={IDENTITY.wordmark} height="1.25rem" />}
                  brandCollapsed={<Logo variant="monogram" wordmark={IDENTITY.wordmark} height="1.5rem" />}
                  staticLayout
                  storageKey="ds-demo-sidebar"
                  sections={[
                    { title: 'Pilotage', items: [
                      { label: 'Accueil', icon: <Icon name="house" />, active: true },
                      { label: 'Vidéos', icon: <Icon name="video" /> },
                      { label: 'Séries', icon: <Icon name="folder" /> },
                    ] },
                    { title: 'Perso', items: [
                      { label: 'Sport', icon: <Icon name="dumbbell" /> },
                    ] },
                    { items: [
                      { label: 'Réglages', icon: <Icon name="settings" /> },
                    ] },
                  ]}
                  footer={
                    <span className="flex items-center gap-space-3">
                      <Avatar size="2rem" halo={false} initials={IDENTITY.monogram} alt={IDENTITY.personne} />
                      <span className="flex flex-col">
                        <span className="text-caption font-semibold">{IDENTITY.personne}</span>
                        <span className="caption">{IDENTITY.lieu}</span>
                      </span>
                    </span>
                  }
                />
              }
            >
              <div className="flex flex-col gap-space-4 p-space-5">
                <h3>Accueil</h3>
                <p className="caption">Le contenu de l'outil vit ici. Replie la barre avec le bouton en tête pour voir le mode icônes seules — l'état est retenu.</p>
                <Row><Button size="sm" icon={<Icon name="plus" />}>Nouveau build</Button></Row>
              </div>
            </AppShell>
          </div>
        </Block>
        <Block label="Sidebar repliée" hint="defaultCollapsed force l'état initial sans toucher au localStorage.">
          <div className="overflow-hidden rounded-xl border border-border">
            <AppShell
              responsive={false}
              sidebar={
                <Sidebar
                  brand={<Logo variant="wordmark" wordmark={IDENTITY.wordmark} height="1.25rem" />}
                  brandCollapsed={<Logo variant="monogram" wordmark={IDENTITY.wordmark} height="1.5rem" />}
                  staticLayout
                  defaultCollapsed
                  collapsible={false}
                  storageKey="ds-demo-sidebar-collapsed"
                  sections={[{ items: [
                    { label: 'Accueil', icon: <Icon name="house" />, active: true },
                    { label: 'Vidéos', icon: <Icon name="video" /> },
                    { label: 'Réglages', icon: <Icon name="settings" /> },
                  ] }]}
                />
              }
            >
              <div className="p-space-5"><p className="caption">Mode icônes seules : le libellé est masqué, il passe en title.</p></div>
            </AppShell>
          </div>
        </Block>
      </Section>

      <Section title="Footer" note={`La ligne de localisation utilise le point médian : ${IDENTITY.lieu}. Elle n'a plus de valeur par défaut : le socle en portait une, codée en dur, et un projet ne pouvait pas la retirer.`}>
        <Block label="Complet" hint="Comme la Navbar, le logo suit --foreground sans tone.">
          <div className="overflow-x-auto rounded-xl border border-border">
            <Footer
              brand={<Logo variant="wordmark" wordmark={IDENTITY.wordmark} height="1.25rem" />}
              note={IDENTITY.lieu}
              columns={[
                { title: 'Séries', links: [{ label: 'Build' }, { label: 'Tuto' }, { label: 'Coulisses' }] },
                { title: 'Ressources', links: [{ label: 'La newsletter' }, { label: 'Les prompts' }] },
                { title: 'Marque', links: [{ label: 'À propos' }, { label: 'Contact' }] },
              ]}
              social={<>
                <IconButton label="YouTube"><ContentIcon name="youtube" /></IconButton>
                <IconButton label="Instagram"><ContentIcon name="instagram" /></IconButton>
                <IconButton label="GitHub"><Icon name="github" /></IconButton>
              </>}
            />
          </div>
        </Block>
      </Section>
    </div>
  );
}

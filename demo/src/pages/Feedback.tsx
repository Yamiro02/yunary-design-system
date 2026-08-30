import { useState } from 'react';
import { Banner, Button, EmptyState, Icon, Pastille, Progress, Skeleton, SkeletonCard, Spinner, Toast } from '@yunary/ds';
import { Block, Grid, Row, Section, Stack } from '../ui';

export function FeedbackPage() {
  const [closed, setClosed] = useState(false);

  return (
    <div className="flex flex-col gap-space-7">
      <Section title="Toast" note="Retour transitoire, en bas à droite du viewport. Toujours couleur + icône + texte.">
        <Block label="Tons">
          <Stack>
            <Toast tone="success" title="Prompt copié" description="Colle-le dans Claude Code." />
            <Toast tone="danger" title="Ça a planté, on réessaie ?" description="Le build n'a pas pu démarrer." />
            <Toast tone="warning" title="Version de la CLI ancienne" description="Mets à jour avant de relancer." />
            <Toast tone="info" title="Build en file d'attente" description="Ça démarre dans quelques secondes." />
          </Stack>
        </Block>
        <Block label="Avec fermeture">
          {closed
            ? <Button variant="secondary" size="sm" onClick={() => setClosed(false)}>Réafficher le toast</Button>
            : <Toast tone="success" title="Prompt copié" description="Colle-le dans Claude Code." onClose={() => setClosed(true)} />}
        </Block>
      </Section>

      <Section title="Banner" note="Message inline persistant, dans une page ou une card.">
        <Block label="Tons">
          <Stack>
            <Banner tone="info" title="Nouvelle série en ligne">Trois vidéos pour construire ton premier outil interne.</Banner>
            <Banner tone="warning" title="Ce tuto date de mars">La CLI a changé depuis — la méthode reste bonne.</Banner>
            <Banner tone="success" title="Build terminé">Ton app tourne en local sur le port 5173.</Banner>
            <Banner tone="danger" title="Ça a planté, on réessaie ?">La commande s'est arrêtée avant la fin.</Banner>
          </Stack>
        </Block>
        <Block label="Avec action">
          <Banner tone="warning" title="Ce tuto date de mars" action={<Button size="sm" variant="secondary">Voir la mise à jour</Button>}>
            La CLI a changé depuis — la méthode reste bonne.
          </Banner>
        </Block>
      </Section>

      <Section title="EmptyState" note="Nommer le vide et donner l'étape suivante. Bordure pointillée, tuile d'icône en lavis de dégradé.">
        <Grid cols={2}>
          <Block label="Complet">
            <EmptyState
              icon={<Icon name="folder" />}
              title="Aucun build ici"
              description="Choisis une série pour voir les vidéos correspondantes."
              action={<Button variant="secondary">Voir tout</Button>}
            />
          </Block>
          <Block label="Sans action">
            <EmptyState
              icon={<Icon name="search" />}
              title="Rien ne correspond"
              description="Essaie un autre mot-clé, ou repars de la liste complète."
            />
          </Block>
          <Block label="Tuile composée" hint="tile remplace la Pastille par défaut (panneau brand outlined) quand elle ne convient pas — icon est alors ignoré.">
            <EmptyState
              tile={<Pastille size="dialogue" tone="neutral"><Icon name="search" /></Pastille>}
              title="Aucun résultat"
              description="Essaie un autre mot-clé."
            />
          </Block>
        </Grid>
      </Section>

      <Section title="Spinner" note="Anneau en currentColor. C'est lui que Button affiche quand loading est vrai.">
        <Block label="Tailles">
          <Row>
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
            <Spinner size="2.5rem" />
          </Row>
          <Row label="couleur — suit currentColor">
            <span style={{ color: 'var(--primary)' }}><Spinner size="lg" /></span>
            <span style={{ color: 'var(--text-muted)' }}><Spinner size="lg" /></span>
            <span style={{ color: 'var(--destructive)' }}><Spinner size="lg" /></span>
          </Row>
        </Block>
        <Block label="Dans un bouton" hint="loading remplace l'icône de tête et désactive le bouton.">
          <Row>
            <Button loading>Génération…</Button>
            <Button variant="secondary" loading>Génération…</Button>
            <Button variant="ghost" size="sm" loading>Chargement</Button>
            <Button variant="danger" size="lg" loading>Suppression…</Button>
          </Row>
        </Block>
      </Section>

      <Section title="Progress" note="Rail teinté --accent, valeur en --primary. Indéterminé = barre qui glisse.">
        <Block label="Valeurs">
          <Stack>
            <Progress value={0} label="Aucune progression" />
            <Progress value={35} label="Build en cours" />
            <Progress value={72} label="Build en cours" />
            <Progress value={100} label="Build terminé" />
          </Stack>
        </Block>
        <Block label="Indéterminé" hint="Quand la durée est inconnue.">
          <Progress indeterminate label="Analyse du projet" />
        </Block>
        <Block label="Échelle personnalisée" hint="value et max.">
          <Progress value={3} max={5} label="Étape 3 sur 5" />
        </Block>
      </Section>

      <Section title="Skeleton" note="Placeholder de chargement sur --muted, shimmer de 1.4s.">
        <Block label="Formes">
          <Stack>
            <Skeleton width="12rem" height="1.25rem" />
            <Skeleton width="20rem" height="0.75rem" />
            <Skeleton height="9rem" radius="var(--radius-lg)" />
            <Skeleton width="5.5rem" height="1.125rem" radius="var(--radius-pill)" />
          </Stack>
        </Block>
        <Block label="SkeletonCard" hint="Une par emplacement de grille pendant le chargement.">
          <Grid cols={3}>
            <SkeletonCard />
            <SkeletonCard lines={3} />
            <SkeletonCard media={false} lines={4} />
          </Grid>
        </Block>
      </Section>
    </div>
  );
}

import { Avatar, Halo, Logo } from '@yunary/ds';
import { IDENTITY } from '../identity';
import { Block, Grid, Row, Section } from '../ui';

export function BrandPage() {
  return (
    <div className="flex flex-col gap-space-7">
      <Section title="Logo" note="Le mark est rendu en CSS : --font-display + point carré arrondi en --brand-gradient-diagonal, avec --shadow-logo-dot. Casse et graisse suivent --heading-transform / --heading-weight, comme le titrage. Le point garde le dégradé sur tous les fonds ; seules les lettres s'inversent.">
        <Block label="Variantes">
          <Row label="wordmark"><Logo variant="wordmark" wordmark={IDENTITY.wordmark} height="1.75rem" /></Row>
          <Row label="stacked"><Logo variant="stacked" wordmark={IDENTITY.wordmark} height="1.75rem" /></Row>
          <Row label="monogram"><Logo variant="monogram" wordmark={IDENTITY.wordmark} height="2.5rem" /></Row>
        </Block>
        <Block label="Tailles" hint="height pilote la hauteur du mark ; la taille de police en découle.">
          <Row>
            <Logo variant="wordmark" wordmark={IDENTITY.wordmark} height="1rem" />
            <Logo variant="wordmark" wordmark={IDENTITY.wordmark} height="1.375rem" />
            <Logo variant="wordmark" wordmark={IDENTITY.wordmark} height="1.75rem" />
            <Logo variant="wordmark" wordmark={IDENTITY.wordmark} height="2.5rem" />
          </Row>
        </Block>
        <Block label="Tons" hint="letters='dark' force les lettres sombres, letters='light' les force claires. Sans la prop, elles suivent --foreground et s'inversent avec la surface.">
          <Grid cols={2}>
            <div className="flex items-center justify-center rounded-xl border border-border p-space-6" style={{ background: 'var(--tone-light)' }}>
              <Logo variant="wordmark" wordmark={IDENTITY.wordmark} letters="dark" height="1.75rem" />
            </div>
            <div className="flex items-center justify-center rounded-xl border border-border p-space-6" style={{ background: 'var(--tone-dark)' }}>
              <Logo variant="wordmark" wordmark={IDENTITY.wordmark} letters="light" height="1.75rem" />
            </div>
          </Grid>
        </Block>
      </Section>

      <Section title="Halo" note="Dégradé radial chaud, ancré en bas, jamais plein écran. À poser dans une section position:relative, derrière le contenu.">
        <Grid cols={3}>
          <div className="relative overflow-hidden rounded-xl border border-border bg-card p-space-6">
            <Halo placement="bottom" />
            <div className="relative flex flex-col gap-space-2">
              <span className="eyebrow">placement</span>
              <h4>bottom</h4>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-xl border border-border bg-card p-space-6">
            <Halo placement="top" />
            <div className="relative flex flex-col gap-space-2">
              <span className="eyebrow">placement</span>
              <h4>top</h4>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-xl border border-border bg-card p-space-6">
            <Halo placement="center" />
            <div className="relative flex flex-col gap-space-2">
              <span className="eyebrow">placement</span>
              <h4>center</h4>
            </div>
          </div>
        </Grid>
        <Block label="intensity" hint="Multiplicateur d'opacité de 0 à 1.">
          <Grid cols={3}>
            {[0.35, 0.7, 1].map(i => (
              <div key={i} className="relative overflow-hidden rounded-xl border border-border bg-card p-space-6">
                <Halo intensity={i} />
                <span className="relative mono text-caption text-text-muted">intensity={i}</span>
              </div>
            ))}
          </Grid>
        </Block>
      </Section>

      <Section title="Avatar" note="Les portraits sont toujours des découpes, placées bas, halo derrière les épaules. Aucun portrait n'est fourni : sans src, le composant retombe sur le monogramme muté.">
        <Block label="Tailles et halo">
          <Row>
            <Avatar size="2.5rem" initials={IDENTITY.monogram} alt={IDENTITY.personne} />
            <Avatar size="3rem" initials={IDENTITY.monogram} alt={IDENTITY.personne} />
            <Avatar size="4rem" initials={IDENTITY.monogram} alt={IDENTITY.personne} />
            <Avatar size="6rem" initials={IDENTITY.monogram} alt={IDENTITY.personne} />
          </Row>
          <Row label="halo={false}">
            <Avatar size="3rem" halo={false} />
            <Avatar size="4rem" halo={false} />
          </Row>
        </Block>
      </Section>

    </div>
  );
}

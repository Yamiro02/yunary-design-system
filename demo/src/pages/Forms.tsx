import { useState } from 'react';
import { IDENTITY } from '../identity';
import { Badge, Calendar, CheckTile, Checkbox, DatePicker, FormField, Icon, Input, Radio, RadioTile, Select, Switch, Textarea } from '@yunary/ds';
import { Block, Grid, Row, Section, Stack } from '../ui';

/* Une vignette IMAGE de recette : un SVG en data-URI (aucun fichier, aucune requête), au format
   vertical d'une vidéo pour que le `cover` ait quelque chose à rogner. */
const VIGNETTE = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 160"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5a4a3f"/><stop offset="1" stop-color="#1f1e1c"/></linearGradient></defs><rect width="90" height="160" fill="url(#g)"/><circle cx="45" cy="60" r="22" fill="#f08029" opacity=".9"/><rect x="18" y="104" width="54" height="8" rx="4" fill="#f6f2ec" opacity=".8"/><rect x="26" y="120" width="38" height="6" rx="3" fill="#f6f2ec" opacity=".5"/></svg>',
);

const SERIES = [
  { value: 'build', label: 'Build' },
  { value: 'tuto', label: 'Tuto' },
  { value: 'coulisses', label: 'Coulisses' },
];

export function FormsPage() {
  const [checked, setChecked] = useState(true);
  const [niveau, setNiveau] = useState('debutant');
  const [sortie, setSortie] = useState<'hooks' | 'structure' | 'both'>('both');
  const [sombre, setSombre] = useState(true);
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 8, 24));

  return (
    <div className="flex flex-col gap-space-7">
      <Section title="Input" note="Rail de contrôle partagé, bordure 1.5px. Le focus se lit sur la bordure seule, qui passe en --ring — jamais d'anneau en plus. Jamais un pill.">
        <Block label="Tailles">
          <Stack>
            <Input size="sm" placeholder="Petite — 2.375rem" />
            <Input size="md" placeholder="ton@email.com" />
            <Input size="lg" placeholder="Grande — 3.25rem" />
          </Stack>
        </Block>
        <Block label="États">
          <Stack>
            <Input placeholder="Repos" />
            <Input className="is-focus" defaultValue="Focus" />
            <Input invalid defaultValue="pas-un-email" />
            <Input disabled defaultValue="Indisponible" />
          </Stack>
        </Block>
        <Block label="Surfaces" hint="page (défaut) = le champ est posé à même le layout, fond --secondary — comme la navbar, les onglets et la recherche · card = dans une card, fond --background.">
          <Stack>
            <Input surface="page" placeholder="surface=page (défaut)" />
            <Input surface="card" placeholder="surface=card" />
          </Stack>
        </Block>
        <Block label="Unité" hint="unit pose l'unité dans le champ, à droite, en sourdine — trois caractères au plus. aria-hidden : c'est le libellé du FormField qui la nomme.">
          <Stack>
            <Input unit="kg" inputMode="decimal" placeholder="72" />
            <Input unit="€" inputMode="decimal" placeholder="49" />
            <Input unit="min" inputMode="numeric" invalid defaultValue="beaucoup" />
          </Stack>
        </Block>
      </Section>

      <Section title="Textarea" note="Hauteur automatique — jamais de min-height. Redimensionnement vertical uniquement. Même règle de surface que l'Input.">
        <Block label="Repos, focus, erreur, désactivé">
          <Stack>
            <Textarea rows={3} placeholder="Décris ton idée d'app en deux phrases." />
            <Textarea rows={2} className="is-focus" defaultValue="Focus" />
            <Textarea rows={2} invalid defaultValue="Trop court" />
            <Textarea rows={2} disabled defaultValue="Indisponible" />
            <Textarea rows={2} surface="card" defaultValue="surface=card" />
          </Stack>
        </Block>
      </Section>

      <Section title="Select" note="Select natif sur le rail 3rem, avec un chevron Lucide.">
        <Block label="Repos, focus, erreur, désactivé">
          <Stack>
            <Select options={SERIES} defaultValue="build" />
            <Select options={SERIES} className="is-focus" defaultValue="tuto" />
            <Select options={SERIES} invalid defaultValue="build" />
            <Select options={SERIES} disabled defaultValue="build" />
            <Select options={SERIES} surface="card" defaultValue="coulisses" />
          </Stack>
        </Block>
      </Section>

      <Section title="Checkbox, Radio, Switch" note="Case 1.25rem, radio 1.25rem à point 0.625rem, switch 2.75 × 1.625rem à knob 1.25rem.">
        <Grid cols={3}>
          <Block label="Checkbox">
            <Stack>
              <Checkbox label="Je veux recevoir le prompt du build" checked={checked} onChange={e => setChecked(e.target.checked)} />
              <Checkbox label="Non coché" defaultChecked={false} />
              <Checkbox label="Indéterminée — sélection partielle" indeterminate />
              <Checkbox label="Hover" className="is-hover" />
              <Checkbox label="Focus" className="is-focus" defaultChecked />
              <Checkbox label="Option indisponible" disabled />
              <Checkbox label="Cochée et désactivée" disabled defaultChecked />
            </Stack>
          </Block>
          <Block label="Radio" hint="Toujours dans un groupe nommé.">
            <Stack>
              <Radio name="niveau" value="debutant" label="Je débute" checked={niveau === 'debutant'} onChange={() => setNiveau('debutant')} />
              <Radio name="niveau" value="avance" label="Je code déjà" checked={niveau === 'avance'} onChange={() => setNiveau('avance')} />
              <Radio name="niveau-demo" value="hover" label="Hover" className="is-hover" />
              <Radio name="niveau-demo" value="focus" label="Focus" className="is-focus" defaultChecked />
              <Radio name="niveau-off" value="off" label="Indisponible" disabled />
            </Stack>
          </Block>
          <Block label="Switch" hint="Bascule instantanée — pas de bouton Enregistrer.">
            <Stack>
              <Switch label="Thème sombre" checked={sombre} onChange={e => setSombre(e.target.checked)} />
              <Switch label="Non activé" />
              <Switch label="Hover" className="is-hover" />
              <Switch label="Focus" className="is-focus" defaultChecked />
              <Switch label="Indisponible" disabled />
              <Switch label="Activé et indisponible" disabled defaultChecked />
            </Stack>
          </Block>
        </Grid>
      </Section>

      <Section title="ChoiceTile — CheckTile et RadioTile" note="La tuile cochable : UNE anatomie pour tous les choix en tuile. Fond --background, radius md, filet 1,5 px ; cochée : filet --primary + plaque --accent, le titre reste en encre à sa graisse. La tuile est le label : toute sa surface coche, clavier et formulaire sont ceux de l'input natif, le contrôle du socle rend dedans.">
        <Grid cols={2}>
          <Block label="RadioTile — choix unique" hint="Dans un role=radiogroup, même name. La méta (le coût) en fin de ligne. Maquette S2 de Creator.">
            <div role="radiogroup" aria-label="Que veux-tu générer ?" className="flex flex-col gap-space-3">
              <RadioTile name="sortie" value="hooks" checked={sortie === 'hooks'} onChange={() => setSortie('hooks')}
                title="Des hooks" meta="Dès 2 crédits par modèle"
                description="Plusieurs ouvertures pour ton script, calées sur des modèles qui ont fait leurs preuves." />
              <RadioTile name="sortie" value="structure" checked={sortie === 'structure'} onChange={() => setSortie('structure')}
                title="Une structure" meta="Dès 8 crédits par structure"
                description="Ton script réorganisé, beat par beat, sur une structure qui tient l'attention." />
              <RadioTile name="sortie" value="both" checked={sortie === 'both'} onChange={() => setSortie('both')}
                title="Les deux" meta="Dès 10 crédits"
                description="Les hooks et la structure d'un coup : la vidéo complète, prête à tourner." />
            </div>
          </Block>
          <Block label="CheckTile — choix multiple, avec média" hint="La vignette (media) est collée aux bords haut, bas et gauche : la tuile perd son padding vertical, la zone de contenu le reprend (1 rem), la vignette s'étire à la hauteur de la rangée (au moins 6,5 rem) et le rognage de la tuile lui donne le rayon — maquettes S3a / S3b (v0.1.8). Le titre tient sur une ligne, en ellipse. Vignette dégradé, vignette image (<img> en cover), puis cochée / non cochée / désactivée.">
            <div className="flex flex-col gap-space-3">
              <CheckTile name="modele" value="miroir" defaultChecked title="Question miroir"
                description="« Tu fais ça aussi, toi, quand… ? »"
                media={<span className="flex-1 bg-brand-gradient" />}
                meta={<Badge tone="amber">Template Yunary</Badge>} />
              <CheckTile name="modele" value="chiffre" title="Le chiffre qui pique — un titre de modèle assez long pour dépasser la largeur de la tuile et finir en ellipse"
                description="« 87 % des vidéos meurent avant la troisième seconde. »"
                media={<img src={VIGNETTE} alt="" />}
                meta={<Badge tone="accent">Importé</Badge>}>
                <span className="inline-flex items-center gap-space-2 text-caption font-semibold text-primary-readable"><Icon name="video" size="0.875rem" />Issu de « Le déploiement »</span>
              </CheckTile>
              <CheckTile name="modele" value="off" disabled title="Plafond atteint"
                description="Décoche un modèle pour en choisir un autre."
                media={<span className="flex-1 bg-tone-dark-soft" />}
                meta={<Badge tone="neutral">Bientôt</Badge>} />
            </div>
          </Block>
          <Block label="États" hint="Repos, survol (filet --input, contrôle --primary), cochée, focus-visible (anneau sur la tuile, pas sur la case), désactivée.">
            <div className="flex flex-col gap-space-3">
              <CheckTile name="etat" value="a" title="Repos" description="Filet --border sur --background." />
              <CheckTile name="etat" value="b" title="Survol" description="Le filet passe à --input, la case à --primary." className="is-hover" />
              <CheckTile name="etat" value="c" title="Cochée" description="Filet --primary, plaque --accent." defaultChecked />
              <CheckTile name="etat" value="d" title="Focus" description="L'anneau est porté par la tuile." className="is-focus" />
              <CheckTile name="etat" value="e" title="Désactivée" description="Inerte, à 50 %." disabled />
            </div>
          </Block>
        </Grid>
      </Section>

      <Section title="DatePicker" note="Déclencheur façon Input (même règle de surface) + Calendar en popover. Clic extérieur ou Échap pour fermer. Date unique, pas de plage.">
        <Block label="Vide, rempli, surfaces, états">
          <Stack>
            <DatePicker value={date} onChange={setDate} />
            <DatePicker />
            <DatePicker surface="card" value={date} onChange={setDate} />
            <DatePicker invalid value={date} onChange={setDate} />
            <DatePicker disabled />
          </Stack>
        </Block>
        <Block label="Déclencheur composé" hint="trigger rend l'élément de l'app, qui ÉTALE triggerProps — le socle garde la ref (retour de focus sur Échap et sélection) et pose l'ARIA. Un élément qui reçoit ref : un <button> nu, pas un composant sans forwardRef.">
          <Stack>
            <DatePicker
              value={date}
              onChange={setDate}
              trigger={({ value, triggerProps }) => (
                <button
                  type="button"
                  className="ds-btn ds-btn--secondary"
                  /* Contenu de démo, pas une règle du socle : la date choisie passe en medium,
                     le placeholder garde le semibold du bouton. */
                  style={value ? { fontWeight: 'var(--weight-medium)' } : undefined}
                  {...triggerProps}
                >
                  {value ? value.toLocaleDateString('fr-FR') : 'Choisir une date'}
                  <Icon name="calendar" />
                </button>
              )}
            />
          </Stack>
        </Block>
      </Section>

      <Section title="Calendar" note="Vue mois, lundi d'abord, locale fr-FR. Date natif et Intl uniquement — aucune dépendance.">
        <Grid cols={3}>
          <Block label="Par défaut">
            <Calendar value={date} onChange={setDate} />
          </Block>
          <Block label="Bornes et dates désactivées" hint="min, max et disabledDates.">
            <Calendar
              value={date}
              onChange={setDate}
              min={new Date(2026, 7, 1)}
              max={new Date(2026, 9, 31)}
              disabledDates={[new Date(2026, 8, 12), new Date(2026, 8, 13)]}
            />
          </Block>
          <Block label="Aujourd'hui" hint="Sans value, la vue s'ouvre sur le mois courant et le jour du jour est marqué (.is-today).">
            <Calendar />
          </Block>
        </Grid>
      </Section>

      <Section title="FormField" note="Une erreur remplace le texte d'aide et porte toujours couleur + icône + texte.">
        <Grid cols={2}>
          <Block label="Aide">
            <FormField label="Ton email" htmlFor="mail-help" help="Un build décortiqué par semaine. Zéro spam.">
              <Input id="mail-help" placeholder="ton@email.com" />
            </FormField>
          </Block>
          <Block label="Erreur">
            <FormField label="Ton email" htmlFor="mail-err" error="Ça a planté, on réessaie ?">
              <Input id="mail-err" invalid defaultValue="pas-un-email" />
            </FormField>
          </Block>
          <Block label="Obligatoire">
            <FormField label="Ton prénom" htmlFor="prenom" required help="Utilisé uniquement dans l'email.">
              <Input id="prenom" placeholder={IDENTITY.prenom} />
            </FormField>
          </Block>
          <Block label="Composé">
            <FormField label="Ta série" htmlFor="serie" help="Tu peux changer d'avis à tout moment.">
              <Select id="serie" options={SERIES} defaultValue="build" />
            </FormField>
          </Block>
        </Grid>
        <Row label="rail partagé — bouton md, input et select s'alignent à 3rem">
          <Input placeholder="ton@email.com" />
          <Select options={SERIES} defaultValue="build" />
        </Row>
      </Section>
    </div>
  );
}

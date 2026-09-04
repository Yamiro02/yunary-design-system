import { useState } from 'react';
import { IDENTITY } from '../identity';
import { Calendar, Checkbox, DatePicker, FormField, Icon, Input, Radio, Select, Switch, Textarea } from '@yunary/ds';
import { Block, Grid, Row, Section, Stack } from '../ui';

const SERIES = [
  { value: 'build', label: 'Build' },
  { value: 'tuto', label: 'Tuto' },
  { value: 'coulisses', label: 'Coulisses' },
];

export function FormsPage() {
  const [checked, setChecked] = useState(true);
  const [niveau, setNiveau] = useState('debutant');
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

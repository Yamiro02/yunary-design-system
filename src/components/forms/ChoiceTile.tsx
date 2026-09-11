import { forwardRef } from 'react';
import type { InputHTMLAttributes, JSX, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../icons/Icon';

/**
 * LA TUILE COCHABLE — une seule anatomie pour tous les choix en tuile (v0.1.4) : la niche de la
 * coque, les sorties et les modèles de Creator en composaient cinq versions. Fond --background,
 * radius md, filet 1,5 px ; cochée : filet --primary + plaque --accent (la convention de
 * l'élément sélectionné — le titre RESTE en encre, à sa graisse).
 *
 * LA TUILE EST LE <label>. Toute sa surface coche ; le clavier, le focus et le formulaire sont
 * ceux de l'<input> natif — `name`, `value`, `required`, la ref de react-hook-form arrivent
 * dessus. Le contrôle du socle (la case ou le rond de `.ds-choice`) rend DEDANS, dans un `<span>`
 * et non un second `<label>` : un label imbriqué est du HTML invalide. Pas de `role="checkbox"`
 * sur un `<button>` — la sémantique est celle de l'input.
 *
 * Colonnes : [média optionnel] contrôle · contenu · méta. `media` (la vignette d'une vidéo,
 * maquettes S3a / S3b) colle aux bords haut, bas et gauche : la tuile perd son padding vertical,
 * la zone de contenu le reprend (1 rem), le titre passe en ellipse.
 *
 * `CheckTile` et `RadioTile` sont les deux formes nommées ; `ChoiceTile` est la générique, avec
 * `kind`. Un `RadioTile` va dans un `role="radiogroup"` avec le même `name`, comme un `Radio`.
 */
export interface ChoiceTileProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'title'> {
  /** checkbox (défaut) — choix multiple · radio — choix unique dans un groupe (même `name`). */
  kind?: 'checkbox' | 'radio';
  /** Le libellé du choix — body/600, pas un titre de section. */
  title: ReactNode;
  /** Une ligne ou deux sous le titre, en --text-secondary. */
  description?: ReactNode;
  /** La méta en fin de ligne : un coût, un compteur, un badge. */
  meta?: ReactNode;
  /**
   * Un média collé aux bords haut, bas et gauche (vignette 6 rem de large, hauteur de la rangée,
   * au moins 6,5 rem) — un `<img>` (rendu en cover), ou un `<span>` à fond. Le padding vertical
   * passe alors sur la zone de contenu et le titre tient sur une ligne, en ellipse (v0.1.8).
   */
  media?: ReactNode;
  /** Sous la description : une ligne d'origine, un badge, un « pourquoi ». */
  children?: ReactNode;
}

export const ChoiceTile = forwardRef<HTMLInputElement, ChoiceTileProps>(function ChoiceTile({
  kind = 'checkbox', title, description, meta, media, children, disabled = false,
  className = '', ...rest
}: ChoiceTileProps, ref): JSX.Element {
  /* `className` va sur la tuile (le <label>), comme sur Checkbox et Radio — jamais sur l'input. */
  return (
    <label className={cn('ds-tile', Boolean(media) && 'ds-tile--media', disabled && 'is-disabled', className)}>
      {media ? <span className="ds-tile__media" aria-hidden="true">{media}</span> : null}
      {/* Le contrôle du socle : l'input y est RÉEL (exposé, focusable), seule la boîte est
          décorative. `.ds-choice` lit l'état de l'input frère, comme dans Checkbox ; l'anneau
          de focus est porté par la tuile, pas par la boîte. */}
      <span className="ds-choice">
        <input ref={ref} type={kind} disabled={disabled} {...rest} />
        {kind === 'radio'
          ? <span className="ds-choice__box ds-choice__box--radio" aria-hidden="true"><span className="ds-choice__dot" /></span>
          : <span className="ds-choice__box" aria-hidden="true"><Icon name="check" size="0.8125rem" strokeWidth={3} /></span>}
      </span>
      <span className="ds-tile__main">
        <span className="ds-tile__title">{title}</span>
        {description ? <span className="ds-tile__desc">{description}</span> : null}
        {children}
      </span>
      {meta ? <span className="ds-tile__meta">{meta}</span> : null}
    </label>
  );
});
ChoiceTile.displayName = 'ChoiceTile';

export type CheckTileProps = Omit<ChoiceTileProps, 'kind'>;
export type RadioTileProps = Omit<ChoiceTileProps, 'kind'>;

/** La tuile à case — choix multiple. */
export const CheckTile = forwardRef<HTMLInputElement, CheckTileProps>(function CheckTile(props, ref) {
  return <ChoiceTile ref={ref} kind="checkbox" {...props} />;
});
CheckTile.displayName = 'CheckTile';

/** La tuile à rond — choix unique, dans un `role="radiogroup"` au même `name`. */
export const RadioTile = forwardRef<HTMLInputElement, RadioTileProps>(function RadioTile(props, ref) {
  return <ChoiceTile ref={ref} kind="radio" {...props} />;
});
RadioTile.displayName = 'RadioTile';

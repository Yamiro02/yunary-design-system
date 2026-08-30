#!/usr/bin/env bash
# Aucune VALEUR littérale — couleur, ombre, dégradé, durée — hors des fichiers de marque
# et de jetons. Un `linear-gradient(var(--x), var(--y))` est de la STRUCTURE : il ne
# compte pas. Ce qui compte est un #hex, un rgb()/hsl(), ou une durée écrite en clair.
set -u
SOCLE="src/styles/core.css src/styles/patterns.css src/styles/tokens/base.css
       src/styles/tokens/derives.css src/styles/tokens/preflight.css
       src/styles/theme.css src/styles/brand-content.css"
n=0
for f in $SOCLE; do
  # commentaires retirés : la prose n'est pas du code
  out=$(perl -0pe 's{/\*.*?\*/}{}gs' "$f" \
        | grep -nE '#[0-9a-fA-F]{3,8}\b|rgba?\([0-9]|hsla?\([0-9]|[0-9]+ms|(^|[^0-9a-zA-Z_.-])[0-9]+(\.[0-9]+)?s([^0-9a-zA-Z_%-]|$)' \
        | grep -v '0\.01ms')          # neutralisation prefers-reduced-motion, pas une durée de design
  if [ -n "$out" ]; then n=$((n+1)); echo "✗ $f"; echo "$out" | sed 's/^/    /'; fi
done
if [ "$n" -eq 0 ]; then
  echo "✓ littéraux — aucune valeur de couleur, d'ombre, de dégradé ou de durée dans les"
  echo "              7 fichiers du socle. Elles vivent toutes dans tokens/scales.css,"
  echo "              tokens/typography.css et les fichiers de marque."
fi
exit "$n"

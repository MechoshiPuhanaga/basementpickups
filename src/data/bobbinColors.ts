/**
 * Canonical bobbin-color tokens and their human-readable labels.
 *
 * The data model and the enquiry flow speak in these **name tokens** — never
 * hex. Hex values are only an approximation of the real bobbin colors and live
 * solely in the DS `Swatch` atom's CSS module (which maps `data-color="<token>"`
 * to a fill). Keep the token set here in sync with that CSS and with
 * `STANDARD_BOBBIN_COLORS` in `pickups.ts`.
 *
 * `bobbinColorLabel` is the single source for turning a token into display text,
 * so product specs, JSON-LD, and (later) the enquiry message all read the same
 * human-readable names instead of hex.
 */
export const BOBBIN_COLOR_LABELS: Record<string, string> = {
  black: 'Black',
  white: 'White',
  cream: 'Cream',
  coral: 'Coral',
  red: 'Red',
  blue: 'Blue',
  'light-blue': 'Light blue',
  pink: 'Pink',
  green: 'Green',
  orange: 'Orange',
};

export function bobbinColorLabel(token: string): string {
  return BOBBIN_COLOR_LABELS[token] ?? token;
}

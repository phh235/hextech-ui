# Hextech UI brand kit

Approved mark: **H1 / Hexcore**. Original armored H with a faceted teal crystal, gold face shading and edge highlights.

- marks/: shaded color, flat color, solid black and solid white SVGs.
- wordmarks/: horizontal outlined wordmarks for light/dark backgrounds and monochrome use.
- stacked/: vertical signatures in the same four versions.
- png/: transparent marks (128–2048 px), horizontal (640–2560 px) and stacked exports.
- favicons/: 16/32/48/64 px PNGs, multi-size ICO and 180/192/512 px app tiles.
- social/: 1200 × 630 share images and 1080 × 1080 square assets in light/dark.
- palette.json: exact brand colors; licenses/: project and Geist font notices.

Use color-dark on a dark surface, color-light on a light surface, black on light, and white on dark. PNGs are transparent except app tiles and social images. Lettering is outlined; the exported SVGs do not require an installed font.

Keep clear space of at least one crystal width (3/32 of the mark size). Minimum recommended width: 24 px for shaded color, 16 px for monochrome. Keep the H/crystal proportions, use a plain background and preserve the wordmark spacing. Shading is part of the color artwork, not an external drop shadow.

The canonical mark is apps/web/app/icon.svg. Outlined Geist SemiBold lettering is in docs/branding/source/wordmark-type.svg. Regenerate exports from the repository root with node scripts/generate-brand.mjs (uses the existing Playwright dev dependency).

Brand artwork is original project source. Geist outlines retain SIL OFL 1.1 attribution. Independent project; no affiliation with Riot Games.

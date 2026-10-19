# Interaction sound assets

These four OGG files were supplied by the project maintainer, who confirmed permission to redistribute them on 2026-10-19. Their filenames are retained as supplied. This records the maintainer's permission statement; it does not assert authorship or place third-party audio under the code's MIT license.

Website mapping:

- `sfx-clash-button-circlegold-hover.ogg`: Hextech button mouse entry.
- `sfx-clash-button-circlegold-click.ogg`: Hextech button/link activation, including keyboard activation.
- `sfx-clash-dropdown-click.ogg`: Hextech Select, Combobox, MultipleSelect and Menu triggers/items, including popup portals.
- `sfx-clash-grid-click.ogg`: Hextech tab and calendar-day activation.

The website header/sidebar has a persistent sound toggle. These assets are not bundled into component packages or the source registry. Playback is lazy, bounded to four voices and tolerates browser autoplay restrictions. Hover audio may require an initial user gesture. Disabled/pending controls stay silent; touch has no hover audio.

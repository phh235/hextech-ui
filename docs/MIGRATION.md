# Migration notes

## OLUI identifiers

The working product and package identifiers are Hextech UI / `@hextech-ui/*`. Historical names in attribution are intentional. The documentation origin is https://hextech-ui.vercel.app; npm scope and registry namespace publishing permissions remain separate release requirements.

## LoL Math / React Aria

This is an independently implemented API, not a drop-in adapter. Base UI uses its own Root/Trigger/Popup composition, `open/value/checked` contracts and state attributes. Read [compatibility contracts](COMPATIBILITY.md) before migrating.

Calendars accept Gregorian ISO days; times use native HH:mm strings. Tree and collection IDs are strings. TokenField uses immutable segments and an optional Lexical core. Rich interactive tables are `DataTable`; native `Table` parts are an original extension. Charts use a current optional engine and explicit subpath. Generic layout classes are not compatibility exports. Drag and Drop is not distributed. React Aria collection integration is not promised.

## Source / package styling

Registry source installs helpers and four style files; import them after Tailwind v4. Packed consumers import `@hextech-ui/react/styles.css`. ThemeScope propagates explicit modes/custom properties across library portals. It does not copy arbitrary ancestor CSS or layout styles into a portal.

## Release state

Version `0.0.0-phase.1` remains a private development identifier, not a published package version. Consume through the tested local registry, workspace or packed artifacts until ownership/rights/release approval is complete.

## Selection fidelity correction — 2026-10-17

Autocomplete is now backed by Base UI Autocomplete rather than aliased to selection-only Combobox. Its controlled value is free text; optional object suggestions complete text. Choose Combobox when a committed item is required. The compatibility reexport from the combobox entry points to the corrected free-text component.

Combobox and MultipleSelect accept generic object records, stable key/label getters, custom rendering, disabled choices, native key serialization and size variants. Refreshed immutable records retain identity and display current labels. Duplicate IDs and unreadable object labels reject clearly. Primitive namespaces expose current Base UI parts for custom grouped/inline/virtualized compositions.

Escape closes an open popup. Closed Escape preserves committed values/text by default; clearOnEscape explicitly opts into clearing. This wrapper policy intentionally differs from Base UI's closed-Escape clear default and avoids removing selections as a side effect of dismissal. Explicit clear/chip controls remain available.

## Table loading and transfer outcomes — 2026-10-18

`TableLoadMoreItem` is a semantic row for an existing table body. Supply `colSpan`, `hasMore`, a changing `loadKey` and an abort-aware `onLoadMore`. It observes its actual scroll root, permits one automatic request per progress key and keeps a manual retry/action when observation is unavailable or progress stalls. `DataTable` reuses it; `autoLoadMore` is opt-in there, and `scrollAreaClassName` bounds the viewport. Its grid total remains unknown while more server data may exist. The library does not fetch or persist application data.

The previous Drag and Drop hook was removed from source distribution, exports and documentation. Historical transfer results do not describe a current public API.

Copied component recipes are complete TypeScript client modules. Registry component files are converted for JavaScript by the actual shadcn CLI. In the tested JavaScript Next fixture, recipe types are erased separately while JSX is retained; do the equivalent when adapting a TypeScript recipe to JavaScript.

# Isolated Tailwind utilities

Hextech controls now use names such as `text-hx-primary`, `text-hx-sm` and `font-hx-sans`. The default `hextech-tailwind.css` adds these utilities without replacing the host app's normal aliases. Component APIs and the shared class override helper remain available.

Existing projects that intentionally use normal utilities for a full Hextech theme can also import the installed `hextech-tailwind-global.css`. This is an explicit compatibility/global-theme option; omit it for a mixed shadcn/Hextech app. Update copied Hextech component files together with their styles, then follow [Using with shadcn](../apps/web/content/docs/shadcn.mdx) for separate directories and scoped themes.

The default Hextech length scale is the configurable `--hextech-ui-rem: 16px`, so a host font change does not silently change control geometry. Adjust the token explicitly when a region should scale; ThemeScope passes explicit custom variables into its portals.

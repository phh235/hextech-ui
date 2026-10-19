# Hextech UI foundation architecture

## Boundaries

The product/repository identifier is `hextech-ui`; filesystem paths are contributor-specific. `apps/web` owns Next.js and registry delivery. Shared packages do not import application code or Next.js. Tokens, themes, and utilities are independent of React. A future Vue adapter can consume the same CSS and specifications without sharing React behavior.

`@hextech-ui/*` is a proposed scope, not verified publishing permission. Each package is private and guarded. ESM output uses `.mjs` and declarations `.d.mts`, matching tsdown's actual output. Dependencies remain external and React remains a peer; only deliberately listed files enter package tarballs. `tsdown` was selected because it is maintained in the Rolldown ecosystem and supports ESM, declarations, dependency externalization, and the installed Node 24 runtime.

The React package now exports the canonical component/hook catalog and deliberate block subpaths. Heavy editor/table/chart/virtualizer engines use optional peers and explicit imports. Internal fixtures remain excluded from npm/catalog exports. Every public entry has a consumer contract and declaration output.

## One source for two distribution channels

Canonical components belong in `packages/react/src/components`, utilities in `packages/utils/src`, and themes/tokens in their CSS packages. Registry entries reference those exact files; npm builds use deliberate package entry points. Consumer alias rewrites are performed by the official shadcn CLI. Registry items declare their own runtime dependencies and never require the whole React package simply to install source.

The registry references canonical components, hooks, helpers and blocks. Source metadata includes `registry:ui`, `registry:lib`, `registry:hook`, `registry:style` and five actual `registry:block` items. Internal fixture sources are used only by installation checks and the noindex verification page. Registry and npm share the class utility, state helpers and original styles.

The root registry is built by the pinned official CLI to `apps/web/public/r`. A small post-build step substitutes the configured origin for local registry dependencies and homepage metadata. No schema or source transformer is reimplemented. Schema validation imports the CLI's current schemas and checks content equality against canonical files. The public origin defaults to https://hextech-ui.vercel.app and can be overridden with `NEXT_PUBLIC_SITE_URL`; local preview installs default to port 3000.

## Base UI wrapping contract

Use the supported subpath import, for example `@base-ui/react/toggle`. Prefer composable Root/Trigger/Popup parts where applicable. Preserve primitive behavior, controlled/uncontrolled state, native props, refs, focus management, state attributes, and accessible names. Styling belongs to Hextech UI; behavior belongs to Base UI. Do not introduce a parallel accessibility primitive library.

Keep interactive modules behind `use client`. Theme the document root and isolate application stacking. `ThemeScope` additionally propagates explicit modes and custom properties across body portals; layout styles stay on the original wrapper. Original local forms and complex examples wait for client readiness to prevent pre-hydration interactions being discarded.

## Tokens, themes, variants, behavior, motion, sound, blocks

Tokens are named values. The Hextech theme assigns semantic colors/effects in dark and light color modes. Variants are component visual choices, behavior is accessible interaction, motion is temporal visual feedback, sound is optional audio feedback, and blocks compose components. These responsibilities are not combined into one configuration object.

`--hextech-ui-*` CSS variables are canonical. Tokens define typography, spacing, borders, radii, control sizes, opacity, durations, easing, and transitions. Theme CSS defines semantic colors, shadow, and glow. Tailwind v4's `@theme inline` maps the variables to utilities. Explicit cascade layer ordering keeps accessibility overrides after theme values. Consumer unlayered CSS can override tokens after imports. Theme/color mode attributes are stable and shared by docs and consumers.

## Documentation and previews

Fumadocs MDX/Core provides typed content, syntax highlighting, source loading, table of contents and search indexing. Native Fumadocs UI, installed through its documented Base UI package alias, owns the website layout, navigation, buttons, search and code controls. The shell spans the viewport while the reading column stays centered and bounded. Pages statically render; search uses the local content source through `/api/search`.

Public previews contain Preview/Code tabs with complete copied examples. Installation commands appear separately. State and width selectors belong only to noindex internal verification fixtures. The approved homepage hero uses canonical Hextech buttons and gold/teal headings, followed by a responsive component showcase. ThemeScope keeps both color modes consistent inside demos and portals. Storybook remains the external visual reference; local docs and browser fixtures exercise the implementation.

## Motion and audio policy

Simple transitions use CSS. Reduced-motion media queries remove nonessential animation. Hosts may set `data-hextech-ui-reduced-sensory="true"`. Complex motion can use optional Web Animations or Motion adapters later; no animation dependency is mandatory.

Audio is muted by default. Pure utilities clamp volume and decide whether user-initiated playback is allowed. A future browser-only adapter must wait for a direct user gesture, lazy-load authorized audio, handle rejected playback, observe mute/volume changes, cancel stale playback, avoid overlap spam, and avoid creating audio objects during SSR. Reduced sensory preference suppresses audio; reduced motion alone does not silently imply an audio preference. No engine or media files are shipped in this phase.

## Verification and release gates

Unit tests cover policy and architectural boundaries. The registry smoke suite serves the built Next app and invokes the actual CLI in isolated TS/JS consumers, checking aliases, dependencies, and compiler parsing. JavaScript output is checked as JavaScript, not held to TypeScript's implicit-any rules. Package checks use publint plus actual packed installs, strict type checking, plain JS imports, SSR, and CSS resolution. Browser tests cover route rendering, accessibility, responsive overflow, navigation, search, copy, persistence, and Base UI keyboard state.

Publishing remains blocked pending scope ownership, name/trademark review, dependency/asset licenses, semver policy, provenance, changelogs, and release automation. No deployment, domain registration, remote change, or publication occurs in foundation setup or rebranding.

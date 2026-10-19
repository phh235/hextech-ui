# Third-party notices and provenance

## Hextech UI additions

Hextech UI's additions, including its Base UI integration, documentation, original geometric SVG mark and Open Graph composition, are covered by the root MIT license. The same license is included in each package. This license does not replace the licenses of upstream materials or dependencies.

## LoL Math UI

Hextech UI is an independent adaptation of [LoL Math UI](https://ui.lolmath.net/), rebuilt by [phh235](https://github.com/phh235). Credit for the original component visual design and interaction reference belongs to LoL Math's authors and contributors. Hextech UI adapts that work to Base UI and a shadcn-compatible source registry, with its own documentation and branding.

- Original project: [lolmath/lolmath, packages/ui](https://github.com/lolmath/lolmath/tree/main/packages/ui).
- Inspected source: commit [a9620c406d857470b732151c295aa8eb2aa72be7](https://github.com/lolmath/lolmath/tree/a9620c406d857470b732151c295aa8eb2aa72be7/packages/ui), package `@lolmath/ui` 9.7.0.
- Declared author: `lolmath.net`. Declared license: **ISC**, as recorded in the upstream [package metadata](https://github.com/lolmath/lolmath/blob/a9620c406d857470b732151c295aa8eb2aa72be7/packages/ui/package.json).

Upstream code and styles, where reused or adapted, retain their ISC license rather than becoming solely MIT-licensed Hextech UI work. Preserve upstream copyright and permission notices with redistributed copies. The inspected source tree and published 9.7.0 tarball do not include a standalone license/copyright notice for this package; an upstream notice must be confirmed before publishing copied source. This record does not invent a copyright holder, year or missing notice.

No upstream font binaries, raster images, audio or character assets are bundled. The replacement fonts retain their own licenses below.

## Distribution of notices

This project-wide provenance notice is included in each packed Hextech UI package at `dist/THIRD_PARTY_NOTICES.md`. Registry components install it through the shared theme foundation at `licenses/hextech-ui/THIRD_PARTY_NOTICES.md` in the consuming project. Keep this notice with copied or adapted materials. Including it does not resolve the outstanding upstream copyright/permission notice confirmation above.

## Official shadcn registry-template inspection

Inspected <https://github.com/shadcn-ui/registry-template> on 2026-10-17, default branch `main`, commit `906f859db0125965cba71c51da1707c0a4c6d045`.

The inspected tree has no LICENSE or COPYING file, and GitHub returned no detected license. No upstream application source, demo source, branding assets, or README text was copied into this project. Hextech UI implements the workflow described by the official registry documentation using original source and standard configuration. The lack of a template license is not treated as permission to relicense its source. This is the reason the template was not cloned or copied wholesale.

The independently installed `shadcn` CLI package declares the MIT license and remains a development dependency with its original license files. It builds the registry; it is not shipped as part of the React runtime.

## Runtime and documentation dependencies

The documentation interface uses official Fumadocs UI 16.17.5, installed as `fumadocs-ui: npm:@fumadocs/base-ui@16.17.5` using the [documented Base UI option](https://www.fumadocs.dev/docs/ui/component-library). Its MIT notice (Copyright (c) 2023 Fuma) is retained in the installed distribution. It provides the website layout, sidebar, contents navigation, search dialog, typography and code-block controls. It is a documentation-app dependency and is not added to the reusable React package or registry component dependencies.

Installed packages retain their own copyright and license notices. The lockfile records exact transitive versions. Direct library runtime dependencies are `@base-ui/react` (MIT), `clsx` (MIT), and `tailwind-merge` (MIT). React and React DOM (MIT) are peer dependencies of the React package and are never bundled. Next.js (MIT), Fumadocs Core/MDX (MIT), Zod (MIT), and Tailwind CSS (MIT) support the documentation app.

The build externalizes package dependencies; their source is not copied into the Hextech UI package artifacts. Package managers install their original distributions with their notices. For a complete installed dependency license inventory, run `pnpm licenses list --json` from the root. Review that inventory and the distributed files again before any public release; this notice is not a legal clearance opinion.

The production inventory executed on Windows during verification also reports these transitive materials. Their original distributions and license files are retained; they are not relicensed under the Hextech UI MIT license:

| Installed material                               | Reported license                 | Role                                                                     |
| ------------------------------------------------ | -------------------------------- | ------------------------------------------------------------------------ |
| `@img/sharp-win32-x64` 0.35.5                    | Apache-2.0 AND LGPL-3.0-or-later | Next.js native image tooling; platform-specific distribution             |
| `lightningcss` and Windows native adapter 1.33.0 | MPL-2.0                          | CSS processing tooling                                                   |
| `caniuse-lite` 1.0.30001816                      | CC-BY-4.0                        | Browser support data; installed package metadata lists author Ben Briggs |

Other platforms may select different native adapters. Review redistribution, attribution, and source-availability obligations for the actual release artifacts before publication.

## Name and visual references

League of Legends, Riot Games, and associated marks belong to their respective owners. The term Hextech is associated with Riot Games intellectual property. No license to those trademarks is granted by the source-code MIT license. The project name, domain, npm scope, and registry namespace have not been legally cleared or verified as owned.

Hextech UI is an independent, community-driven project inspired by League of Legends. It is not affiliated with or endorsed by Riot Games.

## Optional engines and transitive notices (release preparation)

Optional React subpaths use Lexical/@lexical plain-text/history 0.52.0, TanStack Table 9.3.1, TanStack Charts 1.1.0 and TanStack Virtual 3.14.21. Their distributions retain original MIT licenses. Chart grammar is reexported from the engine, not copied. D3 transitive modules retain their own BSD-family notices. These engines are absent from the basic button bundle and are not bundled into the Hextech package.

The installed tooling/docs tree also contains MPL-2.0 Lightning CSS, CC-BY-4.0 caniuse data and the platform-specific sharp distribution declaring Apache-2.0 AND LGPL-3.0-or-later. The actual `@img/sharp-win32-x64` README enumerates embedded libraries with additional licenses (including LGPLv3, MPL, BSD-like and patent terms). These binaries are not part of the React tarball. A deployment or binary redistribution must review and preserve the appropriate platform distribution/source/notice obligations separately; root package license metadata alone does not settle them.

Package metadata alone is not an exhaustive review of vendored binaries, fonts or every transitive file. Dependencies with only license declarations require notice verification before copying or redistributing their source.

## GitHub repository mark

Website repository buttons use the official GitHub Octicons `mark-github-16` SVG path, retrieved from `https://raw.githubusercontent.com/primer/octicons/main/icons/mark-github-16.svg` on 2026-10-18. It is MIT licensed, Copyright (c) 2026 GitHub Inc. The complete notice is retained at `apps/web/public/icons/octicons-LICENSE.txt`. GitHub's mark identifies the repository link; it does not imply sponsorship or endorsement. This icon is a website asset, not part of the reusable component package.

## Licensed interface fonts

The component theme imports Latin weights 500/700/900 from `@fontsource/cinzel` 5.3.0 and 400/500/600/700 from `@fontsource/barlow` 5.3.0. Both distributions declare SIL OFL 1.1 and retain their original `LICENSE` files. Cinzel (Copyright 2020 The Cinzel Project Authors) substitutes for Beaufort; Barlow (Copyright 2017 The Barlow Project Authors) substitutes for Spiegel. The user approved licensed substitutes. Font names in fallback stacks do not bundle the proprietary fonts. Theme npm and registry dependencies include the Fontsource packages. The standalone React CSS build copies 14 unmodified WOFF/WOFF2 files plus both original OFL notices into `dist/fonts/` and uses relative URLs so the tarball works outside the workspace. Those fonts retain their own licenses, separate from MIT component source.

Documentation serves unmodified Latin Geist Sans and Geist Mono WOFF2 files copied from the installed Next 16.4.2 distribution. The upstream [Geist OFL notice](https://github.com/vercel/geist-font/blob/main/OFL.txt), Copyright 2024 The Geist Project Authors, is preserved verbatim at `apps/web/public/fonts/Geist-OFL.txt`. The fonts remain OFL-1.1, separate from the MIT application code. The source font files and their notices are retained together in `apps/web/public/fonts/`.

Documentation code uses @fontsource/jetbrains-mono 5.3.0 (JetBrains Mono), Copyright 2020 The JetBrains Mono Project Authors, under SIL OFL 1.1. The complete upstream notice is retained at apps/web/public/fonts/JetBrainsMono-OFL.txt. Fumadocs renders code with the bundled Catppuccin Latte/Mocha Shiki themes.

## Sonner

The optional Sonner entrypoint uses `sonner` 2.0.8 (MIT), Copyright (c) 2023 Emil Kowalski. Its original license is retained in the installed package at `sonner/LICENSE.md`. The engine is externalized from the library build and is not reimplemented or relicensed. Hextech notification indicators are original SVGs; no upstream Riot artwork is included.

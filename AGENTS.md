# Contributor and agent instructions

Hextech UI is a React component library and documentation site. Work from the existing repository root; do not scaffold a nested project. Read this file before editing. Apply instructions in a more specific `AGENTS.md` to its subtree, including `apps/web/AGENTS.md`.

## Working agreement

- Follow the maintainer's current request; preserve unrelated changes and Git history.
- Keep this work local. Do not commit, push, publish packages, deploy, change repository visibility, buy domains or submit external PRs without an explicit request.
- The configured GitHub destination is private: https://github.com/phh235/hextech-ui. A website link is not authorization to write to it.
- Do not reset Git, force-push, recursively remove work or replace the project to simplify a change.
- Keep credentials in ignored server environment files. Never print API keys or put them in client bundles, docs, fixtures or commits.
- Do not add runtime agent configuration, invoke screen-reader software or delegate to other agents unless the maintainer requests it.

## Filesystem boundary

- Keep implementation and source changes inside this repository, including its maintained documentation, scripts, tests and configuration. Full Access does not expand the authorized task or this filesystem boundary.
- Before running a command that creates, edits, moves, renames or deletes files outside the repository, notify the maintainer of the resolved absolute target path, the intended action, its purpose and its expected effect. This includes temporary verification checkouts outside the repository.
- Obtain explicit approval before deleting, moving, renaming or overwriting existing files or directories outside the repository. Permission to work on this project is not permission to clean up other folders.
- Prefer ignored directories inside the repository for generated reports and temporary work. If a tool writes to an external dependency or browser cache, disclose that effect before running it when relevant to the task.
- Resolve and verify target paths before filesystem mutations, especially recursive operations. Account for symlinks and junctions so a path inside the repository cannot silently redirect a change outside it.

## Architecture

| Path                                                   | Responsibility                                                 |
| ------------------------------------------------------ | -------------------------------------------------------------- |
| `apps/web`                                             | Next.js App Router, Fumadocs, documentation chat and previews  |
| `packages/react/src/components`                        | Canonical component implementations                            |
| `packages/react/src/hooks`                             | Collection and asynchronous data hooks                         |
| `packages/react/src/lib`                               | Shared behavior, styles and theme helpers                      |
| `packages/tokens`, `packages/themes`, `packages/utils` | Tokens, themes and shared utilities                            |
| `registry`, `registry.json`                            | shadcn-compatible source distribution                          |
| `scripts`                                              | Registry generation, docs generation and consumer verification |
| `tests`                                                | Unit, browser, accessibility and visual checks                 |
| `docs/audits`                                          | Ignored local verification evidence and resumable handoff      |

Registry and package builds share canonical source. Library modules must not import Next.js or the docs app. Use pnpm workspaces and Turborepo, React, TypeScript, Tailwind CSS v4 and Base UI; preserve the established architecture.

## Product rules

- Use native Fumadocs layouts, navigation, buttons, tabs, search and code blocks for the website. Hextech controls belong in component previews and copied examples. The maintainer-approved homepage hero also uses canonical Hextech ButtonLink controls and gold/teal gradient headings; keep the surrounding website chrome native.
- Support light and dark modes, including portal content. Keep the docs shell full width and its reading column bounded and centered.
- Public component pages have Preview/Code only; no Example/State/Width selector toolbar. Variant controls may exist in explicit noindex internal verification fixtures.
- Keep Foundation immediately after Get Started and component navigation alphabetical. Avoid duplicate sidebar menus.
- Installation is a concise consumer setup guide. Contributor, packaging and audit commands belong in maintainer documentation.
- Link repository Markdown references to their GitHub files. Do not invent public release URLs, star counts, download totals or ownership claims.
- Focus on UI components; existing blocks remain outside current feature development and promotion.
- Match the LoL Math reference's supported hover, held press, focus and disabled states. Do not add press translation, hover lift, shadows or decorative motion absent from the reference.
- Use original or licensed assets. Cinzel/Barlow are approved substitutes for proprietary reference fonts. No Riot font, raster or audio redistribution.

## Before changing a subsystem

Read the relevant guide:

- [Components and distribution](.agents/rules/components.md)
- [Documentation and website](.agents/rules/documentation.md)
- [Verification and handoff](.agents/rules/verification.md)

Inspect actual source and package versions first. Verify APIs with installed documentation and official primary references. For Next.js, read the relevant guide under `apps/web/node_modules/next/dist/docs/` before implementing changes.

## Commands

Use Node.js 24.11+ below 25 and pnpm 10.34.7, as declared in `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
```

After manifest or example changes, regenerate with `pnpm catalog:docs` and `pnpm registry:build`. Use the smallest meaningful checks during iteration. `pnpm check` is the full integration pipeline; do not represent an unrun command as passed. Integration smoke tests reserve port 3000; restore the local preview afterward.

## Definition of done

Deliver a focused, reviewable change with current examples, relevant passing checks and explicit remaining limits. Preserve screenshots before intentional baseline updates. Record commands and outcomes in `docs/audits/` when extending a phase or changing acceptance evidence. Do not claim pixel/API parity, screen-reader acceptance, source-security coverage or release readiness from compilation or automated scans alone.

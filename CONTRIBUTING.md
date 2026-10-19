# Contributing to Hextech UI

Read [AGENTS.md](AGENTS.md) and the applicable [.agents rules](.agents/README.md) before making changes. [CLAUDE.md](CLAUDE.md) imports the same shared guidance.

Use Node 24 LTS (24.11 or later, below 25) and pnpm 10.34.7. Preserve the existing monorepo, one lockfile, unrelated work and source provenance. No automatic publication is configured.

## Source changes

Implement once in canonical `packages/react/src/components`, `hooks` or `blocks`. Update its manifest, npm export, registry dependencies, usage/example, docs and meaningful behavior coverage together. Registry consumers must not require the Hextech UI npm package. Never maintain a separate JS implementation: test actual CLI conversion.

Use Base UI for supported behavior. For specialized gaps, justify the semantic implementation or optional maintained engine. Keep Next.js and docs code out of the library. Keep heavyweight engines on explicit optional subpaths. Preserve controlled state, labels, refs, portals, keyboard/touch interaction and focus. Hydrated examples must not accept input before their handlers exist.

Style with semantic CSS variables and Tailwind v4. Maintain class override precedence, reduced motion, contrast and forced-color boundaries. Theme scopes must propagate explicit tokens to portals. Use original or clearly licensed assets and preserve required notices.

## Local setup

```sh
pnpm install --frozen-lockfile
pnpm dev
```

The site and local registry run at `http://127.0.0.1:3000`. Build, unit tests and browser checks work without an environment file or API key. Documentation chat is optional: copy `apps/web/.env.example` to the ignored `apps/web/.env.local` and configure only the services you need. Keep server credentials out of `NEXT_PUBLIC_*` variables.

## Verify

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium firefox webkit
pnpm check
```

The full suite uses local ports 3000, 3100, 3201, 4178 and 4179. Stop the development server before running it. Actual CLI and package installation requires network access. Never replace a failed check with an unverified success claim. Keep generated consumers, dependencies and build output out of source control. Record exact outcomes and acceptance limits in the audit reports.

Screenshot baselines in `tests/visual/` were captured on Windows. Run `pnpm test:visual` locally on Windows; the regular cross-browser suite does not require platform-specific screenshot comparisons. GitHub Actions are intentionally disabled. Run the relevant checks locally and include their actual outcomes in your pull request. Preserve and review baseline changes deliberately.

## What belongs in Git

Keep maintained source, `scripts/`, tests and portable fixtures, the lockfile, licenses, documentation, brand assets and shared `AGENTS.md` / `CLAUDE.md` / `.agents/` guidance. Do not commit environment files, local editor/agent configuration, deployment links, build output, generated registries, downloaded reference source, screenshots from test runs or personal work plans. The shared `.env.example` contains names and safe defaults only.

Verification runs write to ignored `.artifacts/` and `docs/audits/`. Reference comparison fixtures live in `tests/fixtures/references/`; they remain available in a fresh clone. See [maintaining](docs/MAINTAINING.md) and the [release checklist](docs/RELEASE_CHECKLIST.md).

## Rights and release

Keep LoL Math's original design credit and the upstream ISC declaration separate from Hextech UI's MIT additions. Confirm and preserve the copyright/permission notice for the adapted upstream sources before making a repository, package or registry public. See [third-party notices](THIRD_PARTY_NOTICES.md); a successful build does not settle source rights.

The documentation origin is https://hextech-ui.vercel.app. Npm scope and registry namespace publishing permissions, and naming/trademark questions, remain release requirements. Keep `private: true` and publication guards. Deployment, package publication, repository renaming, directory submissions and domain changes require approval. Do not bundle Riot assets or infer asset rights from a package license.

Hextech UI is independent and is not affiliated with or endorsed by Riot Games.

# Maintaining Hextech UI

Start with [contributor guidance](../CONTRIBUTING.md), the [architecture](architecture/foundation.md) and [roadmap](ROADMAP.md). Record verification from actual commands and preserve failed-run evidence. Local audit reports and work plans are ignored; reusable source, tests and reference fixtures belong in Git.

## Add or change a component

1. Record upstream scope and rights when it is a migration; distinguish original extensions.
2. Implement in the canonical React source; add manifest/API/usage and deliberate package exports.
3. Keep external engines optional and exclude them from the root barrel. Add their exact registry dependencies.
4. Generate component references with `pnpm catalog:docs`, then format. Blocks have a separate manifest and canonical source.
5. Run appropriate behavior tests, real CLI installs, strict documented-example compilation and packed exports. Update browser/visual evidence when behavior or styling changes.

Labeled form controls use an 8px gap between their visible label and control by default. TextField inherits Field spacing; temporal fields with hidden labels keep their embedded layout. Compose bare Input, Textarea and Select controls in an 8px label group. Pages should inherit these defaults rather than adding their own spacing overrides.

Public documentation install commands use `shadcn@latest`. Integration fixtures use the pinned development dependency for reproducible verification.

Toast and Sonner share the same status icon colors: Success/Info use the theme notification accent (blue), Warning/default use primary gold, and Error uses the same destructive token as buttons. Keep text, frames and custom icon overrides independent.

## Builds and previews

Use `pnpm dev` for local editing. It builds workspace dependencies, watches the React and utilities packages, and starts the Next.js development server on port 3000. `pnpm start` serves a production build and does not update when source files change.

### Vercel Services

The root `vercel.json` explicitly defines the existing Next.js application as the `web` service at `apps/web`. Public traffic at `/` and all subpaths routes to that service, including `/docs`, `/r`, `/api/search` and `/api/chat`. There is no independent root Vite application: Vite is a development dependency used by verification consumers. Do not add a public Vite service for the workspace root.

When importing this Services project, use the repository root (`./`) so Vercel reads that configuration. Service install/build commands run the workspace's frozen install and full build from the monorepo root; this prepares the library packages and generated registry before Next.js builds. The development command uses Turbo's loose environment mode so the port supplied by `vercel dev` reaches Next.js.

Run `vercel dev -L` from the repository root to exercise Services locally without linking to a cloud project. Stop an existing port-3000 server first, or use `vercel dev -L --listen 127.0.0.1:3400` from a separate checkout. A separate checkout also avoids two Next.js processes sharing the same development output directory.

No bindings are needed: search, documentation and optional chat use routes in this same Next.js service. OpenRouter is an external provider, configured through the server-only `OPENROUTER_API_KEY` and optional `OPENROUTER_MODEL`; it is not a Vercel internal service. Keep optional chat unconfigured when it is not needed. Never copy local environment files into Git or set a service binding URL manually.

Vercel Services is in Beta. Confirm service names, public routing and any new bindings before changing the deployment topology. For a conventional single-project import instead of Services, import only `apps/web` as a Next.js application and retain an equivalent workspace build; the root Services configuration is intended for the Services import flow.

`pnpm build` generates the registry and builds packages/docs. The canonical origin defaults to https://hextech-ui.vercel.app and can be overridden with `NEXT_PUBLIC_SITE_URL`. Registry previews use port 3000 unless `NEXT_PUBLIC_REGISTRY_URL` is configured; Vercel builds default to the canonical public origin for install commands too. `NEXT_PUBLIC_REPOSITORY_URL` controls GitHub links. These values, Vercel environment markers and the optional Google verification token participate in build cache keys. Use only controlled, approved destinations. Registry scripts run from the repository root and do not automatically load the app’s local environment file. For a public registry build outside Vercel, explicitly set `NEXT_PUBLIC_REGISTRY_URL` to the approved public origin; `registry:prepare-directory` also requires `NEXT_PUBLIC_SITE_URL`. Local production previews are allowed; production deployment is a separate action.

The standalone package CSS includes component, helper and retained block classes without a global preflight reset. Components own their essential geometry; consumers may apply their own reset. The theme imports licensed Cinzel/Barlow from pinned Fontsource dependencies. Keep their OFL notices; documentation Geist and JetBrains Mono files retain separate OFL notices. See [third-party notices](../THIRD_PARTY_NOTICES.md) and the retained notices in `apps/web/public/fonts/`.

Website chrome uses default Fumadocs components. The maintainer-approved homepage hero also uses canonical Hextech ButtonLink actions and gold/teal gradient headings. Keep other Hextech components inside preview scopes. `pnpm catalog:docs` generates the minimal component pages and formatted examples; run it after changing the example factory. Keep OpenRouter credentials only in ignored server environment configuration. Reassess server routes when adding provider integrations. Review shared rate limiting, authentication/access policy and provider spending limits before public deployment; the current in-memory request guard is local protection.

Homepage hero links use the app-local `HeroButtonLink` adapter: Next.js Link handles client navigation and prefetching, while canonical `buttonVariants` supplies the Hextech styling. Keep Next.js imports out of the reusable library; its framework-independent ButtonLink remains a standard anchor. Next.js prefetching runs in production, so an uncompiled route may still take time to open during local development.

Homepage previews live in `apps/web/components/home/`, with their responsive column layout in `featured-components.tsx`. Keep controls canonical, inherit the document theme for site previews, and import chart/table/notification engines through their optional subpaths. The root Fumadocs theme provider restores the saved mode before paint; site previews must not introduce a server-rendered dark ThemeScope that changes only after hydration. Use explicit ThemeScope boundaries for independently themed library consumers. The showcase uses a single component frame per demo. Keep the README preview image current after homepage layout changes.

## Search and social metadata

Page titles, descriptions, canonical URLs and social cards are generated on the server. The shared 1200×630 OG image is original brand artwork. Keep sitemap URLs aligned with canonical URLs; internal fixtures, registry JSON and machine-readable copies use noindex metadata/headers while remaining crawlable. Vercel preview builds are noindex. An optional `GOOGLE_SITE_VERIFICATION` token is supported, but Search Console verification and sitemap submission are separate maintainer actions. A successful local check does not establish live deployment, indexing or ranking.

## Evidence

`THIRD_PARTY_NOTICES.md` is the canonical project-wide provenance record. Package `prepack` hooks copy it into each tarball; the shared registry theme installs it into the consumer's `licenses/hextech-ui/` directory. Edit the canonical file rather than generated copies, and verify actual packed/CLI installs after changing notice distribution. A copied provenance record does not settle an unresolved upstream notice or permission question.

Review license declarations against the installed lockfile and preserve the original dependency notices. Keep generated audit reports and downloaded reference code in ignored local directories.

Consumer reports include source digests where implemented so stale install evidence is not presented as current. Tarballs must install without workspace links. Do not infer tree shaking from export metadata: the bundle check builds both root and subpath imports with optional peers absent.

Preview clipboard, generated docs and installed/packed examples use the same complete client-module factory. Compile against actual installed artifacts, then exercise representative recipes through a Next server/client boundary in JS and TS. A passing JSX parse alone does not prove runtime behavior. Check syntax contrast in both color modes, including comments and object property names.

When changing asynchronous data or table loading contracts, retain rejected/stalled/aborted cases and actual pointer/keyboard/touch behavior. Automatic loading must require fresh visibility after progress. Keep old failed logs and image hashes when regenerating evidence. Do not update runtime sources during an aggregate verification run.

Distinguish source-security reviews from dependency advisory checks. Preserve failed or incomplete review results, and reassess current production and development dependency risks for each release.

## Releases

Follow `RELEASE_CHECKLIST.md`. Keep publication guards until the final approval. Retain dependency notices, file-level asset decisions and the Riot independence disclaimer. Do not push, publish, submit a directory PR or change domains as an incidental build step.

## Component reference ownership

`pnpm catalog:docs` updates only the marked generated reference in existing component pages. Keep authored usage sections outside those markers; regeneration preserves them. The API table comes from the canonical component manifest. Update it whenever the public contract changes.

Named examples live in `apps/web/components/examples/`. The generator copies their actual source into `usage-example-sources.json`, translating package imports to registry paths. Render them with UsagePreview and register the component in its example map. Do not maintain separate snippets. Markdown export uses the same source and retains authored guidance.

## Local verification and release

GitHub Actions workflows have been removed at the maintainer’s request. Run `pnpm check` locally before a release, plus `pnpm test:visual` on Windows when reviewing screenshots. Issue and PR templates collect reproducible reports and real validation outcomes; they do not trigger remote jobs. Keep existing screenshot baselines unless an intentional reviewed change requires an update.

Packages remain private and publishing stays blocked. Prepare release metadata only after the source, registry, tarballs and deployment pass their checks. The missing upstream LoL Math copyright/permission notice remains a release requirement; do not invent that notice or treat attribution alone as confirmation.

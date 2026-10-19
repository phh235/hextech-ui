# Registry Directory submission preparation

Official rules checked 2026-10-17: [Registry Directory](https://ui.shadcn.com/docs/registry/registry-index). A registry must be public/open source, conform to the schema, use flat catalog/item endpoints, and omit embedded file content from catalog declarations. Namespaces are reviewed through the official directory repository workflow; a consumer mapping alone is not directory registration.

The local build now generates a public catalog without internal fixtures. Individual internal JSON endpoints remain only for integration checks, have noindex response headers and are excluded from public catalog navigation. Schema validation also checks that public catalog declarations contain no `content` fields.

Before preparing a submission:

1. Resolve the working name/rights questions and establish the actual public repository and controlled HTTPS origin.
2. Obtain deployment approval, deploy the reviewed build, and verify direct endpoint installation from independent consumers.
3. Set `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_REGISTRY_URL` to the approved public origin, run `pnpm registry:build`, then run `pnpm registry:prepare-directory`. It refuses a missing/local/non-HTTPS origin and creates a local artifact only.
4. Confirm namespace control/availability. Prepare the directory entry in the current official `apps/v4/registry/directory.json` shape and run the official `pnpm validate:registries` in a separate reference checkout.
5. Present the concrete entry, catalog, endpoint results and PR body for approval. Submit no external PR automatically.

Suggested description: “Original League-inspired React components and local UI blocks, built with Base UI and Tailwind CSS v4. Editable source, JS/TS consumers, semantic tokens and optional advanced engines. Independent; not endorsed by Riot Games.”

The public repository, origin and namespace are intentionally not invented here. No submission or approval is claimed.

# Registry source map

`registry.json` references canonical package sources directly; it does not require a duplicate implementation here. `cn` lives in `packages/utils/src/cn.ts`. The verification component lives in `packages/react/src/internal/` and is excluded from all npm exports. The hook here is internal test infrastructure.

Catalog components live in `packages/react/src/components/`, hooks in `packages/react/src/hooks/`, and original composed blocks in `packages/react/src/blocks/`. Manifest generation references those canonical files. Use `registry:ui`, `registry:hook`, `registry:lib`, `registry:style` and `registry:block` for their actual purposes. Internal items retain `meta.internal` and individual test endpoints, but are omitted from the public catalog. They are not finished products.

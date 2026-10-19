# Components and distribution

- Edit canonical files under `packages/react/src`; do not maintain separate registry and npm implementations.
- Prefer a matching Base UI primitive. Preserve its controlled/uncontrolled behavior, form values, keyboard interactions, focus restoration and disabled state.
- Keep public types explicit and compatible with strict TypeScript. Avoid unsafe casts, `any`, duplicate state and effects that mirror renderable values.
- Keep optional engines behind their existing subpaths; basic controls must not load charts, table, editor or virtualizer engines.
- Compare reference states separately: idle, hover, pointer held down, keyboard focus, Space held down, selected, disabled and loading. A click screenshot alone does not verify the pressed state.
- Preserve source geometry and color transitions. Treat original extensions such as Destructive as extensions, not upstream parity evidence.
- Disabled/loading controls cannot repeat actions. Interactive children in rows must not trigger row selection twice.
- Preserve theme scopes across portals, reduced-motion handling and forced-color focus/borders.
- Use approved licensed fonts and original SVG/CSS indicators; retain notices and disclose font/asset substitutions.
- When exports change, reconcile `component-manifest.json`, package exports, registry dependencies and the shared example factory. Run `pnpm catalog:docs` and `pnpm registry:build`; do not patch generated JSON independently.
- `scripts/` is maintained source and belongs in Git. Portable test/reference fixtures belong in `tests/fixtures/`. Generated consumers, downloaded reference material, packs and transient logs belong in ignored `.artifacts/`.

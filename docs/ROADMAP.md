# Roadmap

## Current foundation

- Component pages include generated API tables and preserve authored usage sections.
- Named examples copy the same source that runs in the documentation.
- Forms demonstrate React Hook Form, Zod, pending state, reset and field errors.
- Skeleton, Alert, Avatar and Empty State share canonical package and registry source.
- Verification remains local; GitHub Actions are intentionally absent.

Before the first public release, resolve the outstanding upstream notice, confirm package/namespace ownership and complete the [release checklist](RELEASE_CHECKLIST.md). These are prerequisites, not completed release claims.

## Later development

1. Vue adapter: reuse tokens, themes, geometry and behavioral specifications; select an appropriate maintained Vue headless foundation after an API/license audit. Do not wrap React components or claim a Vue deliverable exists today. Independently test source distribution, ESM/types, keyboard/focus, portals and forms.
2. More themes: begin only after the default theme's visual/accessibility acceptance. Preserve semantic tokens and one canonical behavior implementation rather than multiplying logic.
3. Community components: publish contribution/API/rights requirements and meaningful consumer tests. Do not accept unaudited asset packs or framework-specific runtime dependencies into the base library.
4. Original effects and optional sound: CSS/Web Animations first; original/licensed sounds only, lazy and gesture-activated, mute/volume controls, default silent, and sensory preferences. Never create audio engines during SSR.
5. Specialized gaps: consider non-Gregorian calendars, measured masonry/grid examples, cross-application drag/drop and richer table contracts as explicit projects with their own accessibility and compatibility evidence.

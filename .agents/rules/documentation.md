# Documentation and website

- The homepage hero uses canonical Hextech ButtonLink actions and gold/teal gradient headings at the maintainer’s request.
- Keep Fumadocs in charge of the surrounding shell and documentation UI controls. Use its supported props, slots, Steps, Tabs, code blocks, cards and page actions before adding custom UI.
- Keep the overall shell full width, a bounded centered reading column, native spacing and responsive navigation. Retain both themes and avoid duplicated sidebar links.
- Public component references contain Preview/Code. Do not restore Example/State/Width toolbars. Internal noindex fixtures may expose state controls for regression checks.
- Make Installation a short path from prerequisites to a working component. Explain Next.js/Vite CSS paths where they differ. Keep repo setup, package packing and audit procedures in Contributing or maintainer docs.
- Keep examples complete, copyable and consistent with the rendered component. Include declared variants such as Destructive; do not imply backend behavior for local demos.
- Components sort A–Z; Foundation follows Get Started. Do not promote the retained block catalog.
- Link Markdown filenames and notices to actual files in the configured private GitHub repository. Use `blob/HEAD/` when the default branch is unknown. A configured link is not evidence that unpushed files are publicly accessible.
- Keep branding original and simple. Reuse the canonical `apps/web/app/icon.svg` for the wordmark and favicon. The visible name is `Hextech UI`, without a trailing dot.
- Preserve Markdown/LLM output when adding custom MDX elements. Resolve install commands and include complete code in machine-readable pages as well as visible previews.
- Documentation chat uses OpenRouter only on the server. Never expose, log or embed secrets. Check failures honestly; do not invent answers, citations or successful provider calls.
- Do not add public placeholders, internal progress reports or repeated legal/audit paragraphs to component pages. Keep required attribution on the dedicated legal page and minimal, centered project footer.

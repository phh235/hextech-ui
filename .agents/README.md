# Shared contributor rules

Start with [AGENTS.md](../AGENTS.md). [CLAUDE.md](../CLAUDE.md) imports that same source for Claude Code.

These are repository guidance files, not executable agent definitions or installed skills. Tools that do not auto-load `.agents/` should follow the links from the root instructions.

| Guide                                   | Read when changing                                        |
| --------------------------------------- | --------------------------------------------------------- |
| [Components](rules/components.md)       | Components, styles, registry or package exports           |
| [Documentation](rules/documentation.md) | Fumadocs, content, previews, branding or docs AI          |
| [Verification](rules/verification.md)   | Tests, fixtures, screenshots, scripts or handoff evidence |

Keep rules concise and tied to the actual repository. Update the canonical guide when requirements change; do not copy conflicting rules into individual tool configurations. Current results belong in `docs/audits/`, not in these reusable instructions.

# @hextech-ui/react

An independent Base UI adaptation of [LoL Math UI](https://ui.lolmath.net/), with credit to its original authors and contributors.

League-inspired components. Open by design.

Private development package. npm scope ownership and naming rights are unverified, and publication is disabled. Consume this workspace or a locally packed tarball; no public npm install is advertised.

## Packed usage

```tsx
import { Button } from '@hextech-ui/react/button';
import '@hextech-ui/react/styles.css';

export function Example() {
  return <Button variant="primary">Queue up</Button>;
}
```

Apply `data-hextech-ui-theme="hextech"` and `data-color-mode="dark"` (or `light`) to your document or theme scope. This stylesheet includes compiled utilities, tokens, theme and component/block styles without a global preflight reset.

Standalone styles use relative `./fonts/` assets included in the tarball. These unmodified Cinzel and Barlow files are SIL OFL 1.1, with original notices at `dist/fonts/cinzel-OFL.txt` and `dist/fonts/barlow-OFL.txt`. Preserve those notices when redistributing the font files; the fonts are not relicensed under the source MIT license.

React and React DOM 19 are peers. Basic components are available through root and deliberate subpath exports. Local/async list hooks are exported through `use-list-data` and `use-async-list`. Use `theme-scope` for explicit nested modes/custom properties that follow portaled overlays.

Heavy engines are optional peers and only required by their explicit entry:

| Entry                               | Optional engine                            |
| ----------------------------------- | ------------------------------------------ |
| `@hextech-ui/react/token-field`     | Lexical and its plain-text/history modules |
| `@hextech-ui/react/data-table`      | TanStack React Table                       |
| `@hextech-ui/react/charts`          | TanStack Charts                            |
| `@hextech-ui/react/virtual-listbox` | TanStack React Virtual                     |

Blocks use `@hextech-ui/react/blocks/auth`, `/account`, `/lobby`, `/draft` and `/hud`. They compose the same primitives and use fictional local data/actions. They provide no authentication, email, multiplayer, matchmaking or storage backend. No Next.js runtime is required by this package.

## Source distribution

The local documentation server also serves shadcn-compatible source items, using these same canonical files. The real CLI converts TSX/TS to JSX/JS for JavaScript consumers. Shared styles/helpers and component dependencies are declared explicitly.

Hextech UI additions are MIT licensed. Upstream materials and dependencies retain their own licenses; see the repository [third-party notices](https://github.com/phh235/hextech-ui/blob/HEAD/THIRD_PARTY_NOTICES.md). No Riot images, characters, fonts, textures or audio are included. Calendars are Gregorian; React Aria framework-specific types/context/layout APIs are not compatibility exports.

Hextech UI is an independent, community-driven project inspired by League of Legends. It is not affiliated with or endorsed by Riot Games.

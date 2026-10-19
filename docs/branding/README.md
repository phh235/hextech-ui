# Hextech UI branding

The approved direction is **H1 / Hexcore**: two armored gold pillars around a teal crystal. The color artwork adds gold shading and edge highlights; the crystal has four faces and a light ridge. Black and white variants preserve the original silhouette.

- [Brand overview](../../apps/web/public/brand/index.html)
- [Usage guide and export inventory](../../apps/web/public/brand/README.md)
- [Palette](../../apps/web/public/brand/palette.json)
- [Download kit](../../apps/web/public/hextech-ui-brand-kit.zip)

The website, favicon and exports share [the canonical mark](../../apps/web/app/icon.svg). [Geist SemiBold lettering](source/wordmark-type.svg) is outlined so exported wordmarks need no installed fonts. Font attribution is included in the kit.

Regenerate assets with `node scripts/generate-brand.mjs`. It uses the existing Playwright development dependency and writes SVG/PNG exports, app icons and social images. Create the downloadable ZIP from the contents of apps/web/public/brand after rendering preview.png; keep the ZIP outside that directory.

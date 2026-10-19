/** Export the approved Hexcore mark, outlined wordmark and raster applications. */
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import { format, resolveConfig } from 'prettier';

const root = fileURLToPath(new URL('..', import.meta.url));
const output = path.join(root, 'apps/web/public/brand');
const prettierOptions = (await resolveConfig(path.join(root, '.prettierrc.json'))) || {};
for (const folder of ['marks', 'wordmarks', 'stacked', 'png', 'favicons', 'social', 'licenses']) {
  await mkdir(path.join(output, folder), { recursive: true });
}
const canonical = await readFile(path.join(root, 'apps/web/app/icon.svg'), 'utf8');
const lettering = await readFile(path.join(root, 'docs/branding/source/wordmark-type.svg'), 'utf8');
const inside = (svg) =>
  svg
    .replace(/^[\s\S]*?<svg[^>]*>/, '')
    .replace(/<\/svg>[\s\S]*$/, '')
    .replace(/<title>[\s\S]*?<\/title>/g, '')
    .trim();
const colored = inside(canonical);
const armor = canonical.match(/<g[^>]*id="hx-armor"[^>]*>[\s\S]*?<path[^>]*\sd="([^"]+)"/)[1];
const crystal = canonical.match(/<g[^>]*id="hx-crystal"[^>]*>[\s\S]*?<path[^>]*\sd="([^"]+)"/)[1];
const typePath = inside(lettering).replace('fill="currentColor"', 'fill="inherit"');
const [, typeWidth, typeHeight] = lettering.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).map(Number);
const svg = (width, height, content) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none"><title>Hextech UI</title>${content}</svg>\n`;
const silhouette = (fill) =>
  `<path fill="${fill}" d="${armor}"/><path fill="${fill}" d="${crystal}"/>`;
const marks = {
  color: colored,
  flat: `<path fill="#C8AA6E" d="${armor}"/><path fill="#0AC8B9" d="${crystal}"/>`,
  black: silhouette('#000000'),
  white: silhouette('#FFFFFF'),
};
const assets = [];
async function save(file, contents) {
  const destination = path.join(output, file);
  if (typeof contents === 'string' && /\.(?:html|json|md)$/.test(file))
    contents = await format(contents, { ...prettierOptions, filepath: destination });
  await writeFile(destination, contents);
  assets.push(file);
  return destination;
}
const typeScale = 32 / typeHeight;
const wordmarkWidth = Math.ceil(80 + typeWidth * typeScale);
const wordmark = (mark, color) =>
  svg(
    wordmarkWidth,
    64,
    `<g transform="scale(2)">${mark}</g><g fill="${color}" transform="translate(80 16) scale(${typeScale})">${typePath}</g>`,
  );
const stackedWidth = 288;
const stacked = (mark, color) =>
  svg(
    stackedWidth,
    232,
    `<g transform="translate(64 0) scale(5)">${mark}</g><g fill="${color}" transform="translate(${(stackedWidth - typeWidth * typeScale) / 2} 192) scale(${typeScale})">${typePath}</g>`,
  );
const wordmarks = {
  'color-light': wordmark(colored, '#16181B'),
  'color-dark': wordmark(colored, '#F0E6D2'),
  black: wordmark(marks.black, '#000000'),
  white: wordmark(marks.white, '#FFFFFF'),
};
const stackedMarks = {
  'color-light': stacked(colored, '#16181B'),
  'color-dark': stacked(colored, '#F0E6D2'),
  black: stacked(marks.black, '#000000'),
  white: stacked(marks.white, '#FFFFFF'),
};
for (const [name, mark] of Object.entries(marks))
  await save(`marks/${name}.svg`, svg(32, 32, mark));
for (const [name, mark] of Object.entries(wordmarks)) await save(`wordmarks/${name}.svg`, mark);
for (const [name, mark] of Object.entries(stackedMarks)) await save(`stacked/${name}.svg`, mark);
await copyFile(
  path.join(root, 'apps/web/public/fonts/Geist-OFL.txt'),
  path.join(output, 'licenses/Geist-OFL.txt'),
);
await copyFile(path.join(root, 'LICENSE'), path.join(output, 'licenses/PROJECT-LICENSE.txt'));
const tile = (size) =>
  svg(
    size,
    size,
    `<rect width="${size}" height="${size}" fill="#010A13"/><g transform="translate(${size * 0.1875} ${size * 0.1875}) scale(${size * 0.01953125})">${colored}</g>`,
  );
const social = (mode, square = false) => {
  const width = square ? 1080 : 1200,
    height = square ? 1080 : 630,
    dark = mode === 'dark';
  const text = dark ? '#F0E6D2' : '#16181B',
    bg = dark ? '#010A13' : '#F7F7F3',
    muted = dark ? '#A09B8C' : '#626B70';
  return svg(
    width,
    height,
    `<rect width="${width}" height="${height}" fill="${bg}"/><g transform="translate(${(width - 180) / 2} ${square ? 190 : 90}) scale(5.625)">${colored}</g><g fill="${text}" transform="translate(${(width - typeWidth * 0.08) / 2} ${square ? 475 : 335}) scale(.08)">${typePath}</g><text x="${width / 2}" y="${square ? 620 : 455}" text-anchor="middle" font-family="Arial,sans-serif" font-size="${square ? 29 : 28}" fill="${muted}">League-inspired components. Open by design.</text>`,
  );
};
for (const mode of ['dark', 'light']) {
  await save(`social/og-${mode}.svg`, social(mode));
  await save(`social/square-${mode}.svg`, social(mode, true));
}
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  async function png(source, width, height, destination) {
    await page.setViewportSize({ width, height });
    await page.goto(
      `data:image/svg+xml;base64,${Buffer.from(source.replace(/width="[^" ]*"/, `width="${width}"`).replace(/height="[^" ]*"/, `height="${height}"`)).toString('base64')}`,
    );
    await page.screenshot({ path: destination, omitBackground: true, animations: 'disabled' });
  }
  for (const [name, mark] of Object.entries(marks))
    for (const size of [128, 256, 512, 1024, 2048]) {
      const file = `png/mark-${name}-${size}.png`;
      await png(svg(32, 32, mark), size, size, path.join(output, file));
      assets.push(file);
    }
  for (const [name, mark] of Object.entries(wordmarks))
    for (const width of [640, 1280, 2560]) {
      const file = `png/wordmark-${name}-${width}.png`;
      await png(mark, width, Math.round((width * 64) / wordmarkWidth), path.join(output, file));
      assets.push(file);
    }
  for (const [name, mark] of Object.entries(stackedMarks))
    for (const width of [512, 1024]) {
      const file = `png/stacked-${name}-${width}.png`;
      await png(mark, width, Math.round((width * 232) / 288), path.join(output, file));
      assets.push(file);
    }
  for (const name of ['color', 'black', 'white'])
    for (const size of [16, 32, 48, 64]) {
      const file = `favicons/${name}-${size}.png`;
      await png(svg(32, 32, marks[name]), size, size, path.join(output, file));
      assets.push(file);
    }
  for (const size of [180, 192, 512]) {
    const file = `favicons/app-${size}.png`;
    await png(tile(size), size, size, path.join(output, file));
    assets.push(file);
  }
  for (const mode of ['dark', 'light'])
    for (const square of [false, true]) {
      const file = `social/${square ? 'square' : 'og'}-${mode}.png`;
      await png(
        social(mode, square),
        square ? 1080 : 1200,
        square ? 1080 : 630,
        path.join(output, file),
      );
      assets.push(file);
    }
  await copyFile(
    path.join(output, 'favicons/app-180.png'),
    path.join(root, 'apps/web/app/apple-icon.png'),
  );
  await copyFile(
    path.join(output, 'social/og-dark.png'),
    path.join(root, 'apps/web/app/opengraph-image.png'),
  );
  // Modern ICO supports PNG frames; keep the 16/32/48 px exports together.
  const sizes = [16, 32, 48];
  const frames = await Promise.all(
    sizes.map((size) => readFile(path.join(output, `favicons/color-${size}.png`))),
  );
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(frames.length, 4);
  let offset = 6 + frames.length * 16;
  const entries = frames.map((frame, index) => {
    const entry = Buffer.alloc(16);
    entry[0] = sizes[index];
    entry[1] = sizes[index];
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(frame.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += frame.length;
    return entry;
  });
  const ico = Buffer.concat([header, ...entries, ...frames]);
  await save('favicons/favicon.ico', ico);
  await writeFile(path.join(root, 'apps/web/app/favicon.ico'), ico);
} finally {
  await browser.close();
}
await save(
  'palette.json',
  JSON.stringify(
    {
      name: 'Hextech UI / Hexcore',
      gold: { light: '#F0E6D2', base: '#C8AA6E', facet: '#C89B3C', shade: '#785A28' },
      crystal: {
        light: '#CDFAFA',
        highlight: '#83F6E9',
        base: '#0AC8B9',
        facet: '#0397AB',
        shade: '#005A82',
      },
      ink: '#010A13',
      black: '#000000',
      white: '#FFFFFF',
      typography: { family: 'Geist', weight: 600, license: 'SIL OFL 1.1' },
    },
    null,
    2,
  ) + '\n',
);
await save(
  'README.md',
  `# Hextech UI brand kit\n\nApproved mark: **H1 / Hexcore**. Original armored H with a faceted teal crystal, gold face shading and edge highlights.\n\n- marks/: shaded color, flat color, solid black and solid white SVGs.\n- wordmarks/: horizontal outlined wordmarks for light/dark backgrounds and monochrome use.\n- stacked/: vertical signatures in the same four versions.\n- png/: transparent marks (128–2048 px), horizontal (640–2560 px) and stacked exports.\n- favicons/: 16/32/48/64 px PNGs, multi-size ICO and 180/192/512 px app tiles.\n- social/: 1200 × 630 share images and 1080 × 1080 square assets in light/dark.\n- palette.json: exact brand colors; licenses/: project and Geist font notices.\n\nUse color-dark on a dark surface, color-light on a light surface, black on light, and white on dark. PNGs are transparent except app tiles and social images. Lettering is outlined; the exported SVGs do not require an installed font.\n\nKeep clear space of at least one crystal width (3/32 of the mark size). Minimum recommended width: 24 px for shaded color, 16 px for monochrome. Keep the H/crystal proportions, use a plain background and preserve the wordmark spacing. Shading is part of the color artwork, not an external drop shadow.\n\nThe canonical mark is apps/web/app/icon.svg. Outlined Geist SemiBold lettering is in docs/branding/source/wordmark-type.svg. Regenerate exports from the repository root with node scripts/generate-brand.mjs (uses the existing Playwright dev dependency).\n\nBrand artwork is original project source. Geist outlines retain SIL OFL 1.1 attribution. Independent project; no affiliation with Riot Games.\n`,
);
const palette = ['#F0E6D2', '#C8AA6E', '#785A28', '#CDFAFA', '#0AC8B9', '#005A82', '#010A13'];
await save(
  'index.html',
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Hextech UI — Hexcore brand kit</title><style>*{box-sizing:border-box}body{margin:0;background:#f4f4f0;color:#17191c;font:15px/1.6 Arial,sans-serif}main{max-width:1320px;margin:auto;padding:48px}header{display:flex;justify-content:space-between;align-items:center;margin-bottom:28px}h1{font-size:30px;letter-spacing:-1px;margin:0}header p{margin:3px 0 0;color:#777;font-size:13px}header a{color:inherit;font-size:13px}.hero{display:grid;grid-template-columns:1fr 1fr;gap:18px}.surface{display:flex;align-items:center;justify-content:center;min-height:300px;border:1px solid #ddded8;border-radius:14px;background:#fff}.surface.dark{background:#010a13;border-color:#192833}.surface img{width:65%;max-width:370px}.marks{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-top:18px}.mark{min-height:205px;flex-direction:column;gap:20px;padding:24px}.mark img{width:92px;height:92px}.mark span{color:#929188;font-size:11px}.samples{margin-top:18px;display:grid;grid-template-columns:1fr 1fr;gap:18px}.sizes{padding:24px;display:flex;align-items:center;justify-content:space-between;gap:18px;background:white;border:1px solid #ddded8;border-radius:14px}.sizes span{color:#777;font-size:12px}.swatches{display:flex;margin-top:26px;border-radius:10px;overflow:hidden}.swatches div{flex:1;height:70px;display:flex;align-items:flex-end;padding:8px 12px;font:11px Arial,sans-serif}.notes{display:flex;gap:40px;justify-content:space-between;color:#777;font-size:12px;padding-top:20px}.notes p{max-width:580px;margin:0}.notes a{color:inherit}@media(max-width:700px){main{padding:24px}.hero,.samples{grid-template-columns:1fr}.marks{grid-template-columns:1fr 1fr}.notes{display:block}}</style><main><header><div><h1>Hextech UI / Hexcore</h1><p>Approved H1 direction · Faceted crystal · Shaded gold · Original vector artwork</p></div><a href="../hextech-ui-brand-kit.zip">Download brand kit ↗</a></header><div class="hero"><div class="surface dark"><img src="wordmarks/color-dark.svg" alt="Hextech UI color wordmark on dark"></div><div class="surface"><img src="wordmarks/color-light.svg" alt="Hextech UI color wordmark on light"></div></div><div class="marks"><div class="surface mark dark"><img src="marks/color.svg" alt="Shaded gold and faceted crystal"><span>PRIMARY / SHADED COLOR</span></div><div class="surface mark"><img src="marks/flat.svg" alt="Flat two-color mark"><span>FLAT COLOR</span></div><div class="surface mark"><img src="marks/black.svg" alt="Black mark"><span>SOLID BLACK</span></div><div class="surface mark dark"><img src="marks/white.svg" alt="White mark"><span>SOLID WHITE</span></div></div><div class="samples"><div class="sizes"><span>Small sizes</span>${[16, 24, 32, 48].map((size) => `<img src="marks/color.svg" width="${size}" height="${size}" alt="${size} pixel color mark">`).join('')}</div><div class="sizes"><span>Monochrome</span>${[16, 24, 32, 48].map((size) => `<img src="marks/black.svg" width="${size}" height="${size}" alt="${size} pixel monochrome mark">`).join('')}</div></div><div class="swatches">${palette.map((color, index) => `<div style="background:${color};color:${index < 5 ? '#010a13' : '#fff'}">${color}</div>`).join('')}</div><div class="notes"><p>Shading follows the gold and teal component palettes. The crystal has four faces and a central light ridge. The H1 silhouette is preserved in all versions.</p><p>SVG + transparent PNG · Horizontal + stacked · Favicons + app tiles · Social assets<br><a href="README.md">Usage guide</a> · <a href="palette.json">Palette</a> · Geist SemiBold, outlined / SIL OFL 1.1</p></div></main></html>`,
);
await save(
  'asset-manifest.json',
  JSON.stringify(
    {
      mark: 'H1 / Hexcore',
      canonical: 'apps/web/app/icon.svg',
      lettering: 'docs/branding/source/wordmark-type.svg',
      files: assets.sort(),
    },
    null,
    2,
  ) + '\n',
);
console.log(`Exported Hexcore brand kit: ${assets.length} assets and supporting files.`);

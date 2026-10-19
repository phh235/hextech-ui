const start = '{/* BEGIN GENERATED REFERENCE */}';
const end = '{/* END GENERATED REFERENCE */}';

function refreshMetadata(prefix, item) {
  const header = prefix.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  let yaml = header?.[1] ?? '';
  const fields = {
    title: /^title:[^\r\n]*(?:\r?\n[ \t]+[^\r\n]*)*/m,
    description: /^description:[^\r\n]*(?:\r?\n[ \t]+[^\r\n]*)*/m,
  };
  for (const [key, expression] of Object.entries(fields)) {
    const value = `${key}: ${JSON.stringify(item[key])}`;
    yaml = expression.test(yaml)
      ? yaml.replace(expression, value)
      : `${yaml}\n${value}`.trimStart();
  }
  return `---\n${yaml}\n---` + (header ? prefix.slice(header[0].length) : `\n\n${prefix}`);
}

/** Update the generated reference while retaining contributor-authored MDX. */
export function updateComponentDoc(existing, item) {
  const cell = (value) => '`' + String(value).replaceAll('|', '\\|').replaceAll('`', '') + '`';
  const api = item.api.map((row) => '| ' + row.map(cell).join(' | ') + ' |').join('\n');
  const reference = `${start}\n\n<CatalogPreview name="${item.name}" />\n\n## Installation\n\n<RegistryInstallCommand name="${item.name}" />\n\n## API reference\n\nThese are the main ${item.title} options. See the exported TypeScript types for inherited native or primitive props.\n\n| Prop | Type | Default |\n| --- | --- | --- |\n${api}\n\n${end}`;
  const header = existing.match(/^---\r?\n[\s\S]*?\r?\n---/);
  const frontmatter = refreshMetadata(header?.[0] ?? '', item).trimEnd() + '\n\n';
  if (existing.includes(start)) {
    const first = existing.indexOf(start);
    const last = existing.indexOf(end, first);
    if (last === -1 || existing.indexOf(start, first + start.length) !== -1)
      throw new Error(`Invalid generated reference markers in ${item.name}`);
    return (
      refreshMetadata(existing.slice(0, first), item) +
      reference +
      existing.slice(last + end.length)
    );
  }
  // Migrate the original generated page; preserve any additions after its known scaffold.
  const authored = existing
    .replace(/^---\r?\n[\s\S]*?\r?\n---\s*/, '')
    .replace(new RegExp(`<CatalogPreview name="${item.name}"\\s*/>\\s*`), '')
    .replace(
      new RegExp(`## Installation\\s*<RegistryInstallCommand name="${item.name}"\\s*/>\\s*`),
      '',
    )
    .trim();
  return frontmatter + reference + (authored ? '\n\n' + authored : '') + '\n';
}

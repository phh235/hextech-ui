import ts from 'typescript';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

/** Validate documented exports and main prop names against canonical TypeScript types. */
export function validateComponentApi(manifest, root = process.cwd()) {
  const configPath = path.join(root, 'packages/react/tsconfig.json');
  const config = ts.readConfigFile(configPath, ts.sys.readFile);
  if (config.error)
    throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, '\n'));
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, path.dirname(configPath));
  const sources = manifest.map((item) =>
    path.resolve(root, item.source || `packages/react/src/components/${item.name}.tsx`),
  );
  const program = ts.createProgram(sources, { ...parsed.options, noEmit: true });
  const checker = program.getTypeChecker();
  const errors = [];
  for (const item of manifest) {
    const sourcePath = path.resolve(
      root,
      item.source || `packages/react/src/components/${item.name}.tsx`,
    );
    const source = program.getSourceFile(sourcePath);
    if (!source) {
      errors.push(`${item.name}: missing canonical source`);
      continue;
    }
    const module = checker.getSymbolAtLocation(source);
    const exports = new Map(
      checker.getExportsOfModule(module).map((symbol) => [symbol.name, symbol]),
    );
    const props = new Set();
    for (const name of item.exports) {
      const symbol = exports.get(name);
      if (!symbol) {
        errors.push(`${item.name}: missing export ${name}`);
        continue;
      }
      const type = checker.getTypeOfSymbolAtLocation(symbol, source);
      for (const signature of checker.getSignaturesOfType(type, ts.SignatureKind.Call)) {
        const parameter = signature.parameters[0];
        if (!parameter) continue;
        for (const property of checker.getPropertiesOfType(
          checker.getTypeOfSymbolAtLocation(parameter, source),
        ))
          props.add(property.name);
      }
    }
    for (const row of item.api) {
      if (row[2] === 'not accepted') continue; // Explicitly documented unsupported props.
      const memberOwner = row[0].match(/^([\w$]+)\./)?.[1];
      for (const label of row[0]
        .replace(/\s*\([^)]*\)/g, '')
        .split('/')
        .map((label) => label.trim())) {
        if (memberOwner) {
          const owner = exports.get(memberOwner);
          const member = label.split('.').at(-1);
          if (
            !owner ||
            !checker.getPropertyOfType(checker.getTypeOfSymbolAtLocation(owner, source), member)
          )
            errors.push(`${item.name}: missing member ${memberOwner}.${member}`);
          continue;
        }
        if (/^[A-Za-z_$][\w$]*$/.test(label) && !props.has(label))
          errors.push(`${item.name}: undocumented type mismatch for prop ${label}`);
      }
    }
  }
  return errors;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const manifest = JSON.parse(await readFile('packages/react/component-manifest.json', 'utf8'));
  const errors = validateComponentApi(manifest);
  if (errors.length) throw new Error(errors.join('\n'));
  console.log(
    `Canonical TypeScript exports and documented prop names verified: ${manifest.length} modules.`,
  );
}

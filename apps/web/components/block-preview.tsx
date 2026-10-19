import manifest from '../../../packages/react/block-manifest.json';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ComponentPreview } from './component-preview';
import { BlockExample } from './block-examples';
import { RegistryInstallCommand } from './copy-button';
export async function BlockPreview({ name }: { name: string }) {
  const block = manifest.find((item) => item.name === name);
  if (!block) return null;
  const code = await readFile(
    path.join(process.cwd(), '../../packages/react/src/blocks', `${name}.tsx`),
    'utf8',
  );
  return (
    <>
      <ComponentPreview
        title={block.title}
        code={code}
        fileName={`${name}.tsx`}
        variants={[{ name: 'Local demo', content: <BlockExample name={name} /> }]}
      />
      <RegistryInstallCommand name={block.registryName} />
    </>
  );
}

import manifest from '../../../packages/react/component-manifest.json';
import { ComponentPreview } from './component-preview';
import formattedExamples from '@/lib/formatted-component-examples.json';
import { catalogDemos } from '../.generated/catalog-demos';
import { InternalCatalogPreview } from './internal-catalog-preview';

export function CatalogPreview({ name, internal = false }: { name: string; internal?: boolean }) {
  if (internal) return <InternalCatalogPreview name={name} />;
  const item = manifest.find((component) => component.name === name);
  if (!item) return null;
  const Demo = catalogDemos[name as keyof typeof catalogDemos];
  return (
    <ComponentPreview
      title={item.title}
      code={formattedExamples[name as keyof typeof formattedExamples]}
      fileName={`${name}-demo.tsx`}
      variants={[{ name: 'Default', content: <Demo /> }]}
    />
  );
}

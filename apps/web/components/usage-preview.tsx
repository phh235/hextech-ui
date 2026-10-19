import { ComponentPreview } from './component-preview';
import sources from '@/lib/usage-example-sources.json';
import ButtonLoading from './examples/button-loading';
import ButtonSizes from './examples/button-sizes';
import ComboboxControlled from './examples/combobox-controlled';
import FormProfile from './examples/form-profile';
import AlertTones from './examples/alert-tones';
import AvatarFallback from './examples/avatar-fallback';
import EmptyStateAction from './examples/empty-state-action';

const examples = {
  'button-loading': { title: 'Saving an action', Component: ButtonLoading },
  'button-sizes': { title: 'Button sizes', Component: ButtonSizes },
  'combobox-controlled': { title: 'Controlled object selection', Component: ComboboxControlled },
  'form-profile': { title: 'Profile form', Component: FormProfile },
  'alert-tones': { title: 'Notice tones', Component: AlertTones },
  'avatar-fallback': { title: 'Image with fallback', Component: AvatarFallback },
  'empty-state-action': { title: 'Create your first item', Component: EmptyStateAction },
};

export function UsagePreview({ name }: { name: keyof typeof examples }) {
  const { title, Component } = examples[name];
  return (
    <ComponentPreview
      secondary
      title={title}
      code={sources[name]}
      fileName={`${name}.tsx`}
      variants={[{ name: 'Default', content: <Component /> }]}
    />
  );
}

import type { ComponentPropsWithRef, ElementType } from 'react';

/** Native props are retained when future Hextech UI parts wrap a Base UI primitive. */
export type HextechUIComponentProps<T extends ElementType> = ComponentPropsWithRef<T> & {
  'data-hextech-ui'?: string;
};

export interface HextechUIAttributes {
  'data-hextech-ui': string;
  'data-hextech-ui-theme': 'hextech';
}

/** Stable attributes shared by source and package consumers. */
export function getHextechUIAttributes(name: string): HextechUIAttributes {
  return { 'data-hextech-ui': name, 'data-hextech-ui-theme': 'hextech' };
}

export * from './components/button';
export * from './components/icon-button';
export * from './components/link';
export * from './components/typography';
export * from './components/badge';
export * from './components/card';
export * from './components/separator';
export * from './components/input';
export * from './components/textarea';
export * from './components/field';
export * from './components/checkbox';
export * from './components/radio';
export * from './components/switch';
export * from './components/toggle';
export * from './components/dialog';
export * from './components/alert-dialog';
export * from './components/popover';
export * from './components/tooltip';
export * from './components/tabs';
export * from './components/accordion';
export * from './components/collapsible';
export * from './components/progress';
export * from './components/number-field';
export * from './components/slider';
export * from './components/select';
export * from './components/toolbar';
export * from './components/group';
export * from './components/menu';
export * from './components/combobox';
export { AutocompletePrimitive } from './components/autocomplete';
export * from './components/multiple-select';
export * from './components/search-field';
export * from './components/spinner';
export * from './components/breadcrumbs';
export * from './components/toast';
export * from './components/preview-card';
export * from './components/table';
export * from './components/vertical-table';
export * from './components/calendar';
export * from './components/date-field';
export * from './components/date-picker';
export * from './components/tree';
export * from './components/tag-group';
export * from './hooks/use-list-data';
export * from './hooks/use-async-list';
export { ThemeScope } from './lib/theme-scope';
export type { ThemeScopeProps } from './lib/theme-scope';

export * from './components/table-load-more';

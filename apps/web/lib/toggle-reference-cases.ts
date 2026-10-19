import type { ToggleProps } from '@hextech-ui/react/toggle';
/** Public 9.7.0 stories, with React Aria state names mapped to Base UI. */
const cases: readonly [string, string, ToggleProps, string][] = [
  ['secondary', 'Secondary', { variant: 'secondary' }, 'some text'],
  ['hextech', 'Hextech', { variant: 'hextech' }, 'some text'],
  ['dimmed', 'Dimmed', { variant: 'dimmed' }, 'some text'],
  ['dimmed-selected', 'Dimmed Selected', { variant: 'dimmed', defaultPressed: true }, 'some text'],
  ['disabled', 'Disabled', { disabled: true }, 'some text'],
  ['rounded-secondary', 'Rounded Secondary', { variant: 'secondary', shape: 'round' }, '+'],
  ['rounded-hextech', 'Rounded Hextech', { variant: 'hextech', shape: 'round' }, '+'],
  ['rounded-dimmed', 'Rounded Dimmed', { variant: 'dimmed', shape: 'round' }, '+'],
  ['rounded-disabled', 'Rounded Disabled', { disabled: true, shape: 'round' }, '+'],
  [
    'rounded-secondary-with-text',
    'Rounded Secondary With Text',
    { variant: 'secondary', shape: 'round' },
    'A',
  ],
  ['squared-secondary', 'Squared Secondary', { variant: 'secondary', shape: 'square' }, '+'],
  ['squared-hextech', 'Squared Hextech', { variant: 'hextech', shape: 'square' }, '+'],
  ['squared-dimmed', 'Squared Dimmed', { variant: 'dimmed', shape: 'square' }, '+'],
  ['squared-disabled', 'Squared Disabled', { disabled: true, shape: 'square' }, '+'],
  [
    'squared-thin-secondary',
    'Squared Thin Secondary',
    { variant: 'secondary', shape: 'square', thin: true },
    '+',
  ],
  [
    'squared-dimmed-disabled',
    'Squared Dimmed Disabled',
    { variant: 'dimmed', shape: 'square', disabled: true },
    '+',
  ],
];
export const toggleReferenceCases = cases.map(([id, label, props, text]) => ({
  story: `buttons-togglebutton--${id}`,
  label,
  props,
  text,
}));

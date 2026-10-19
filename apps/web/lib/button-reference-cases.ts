import type { ButtonProps } from '@hextech-ui/react/button';

/** Audited 9.7.0 story props mapped to the public Base UI wrapper API. */
export const buttonReferenceCases: readonly {
  story: string;
  label: string;
  props: ButtonProps;
  text: string;
}[] = [
  {
    story: 'buttons-button--primary',
    label: 'Primary',
    props: {
      variant: 'primary',
    },
    text: 'League of Legends',
  },
  {
    story: 'buttons-button--secondary',
    label: 'Secondary',
    props: {
      variant: 'secondary',
    },
    text: 'League of Legends',
  },
  {
    story: 'buttons-button--hextech',
    label: 'Hextech',
    props: {
      variant: 'hextech',
    },
    text: 'League of Legends',
  },
  {
    story: 'buttons-button--dimmed',
    label: 'Dimmed',
    props: {
      variant: 'dimmed',
    },
    text: 'League of Legends',
  },
  {
    story: 'buttons-button--disabled',
    label: 'Disabled',
    props: {
      disabled: true,
    },
    text: 'League of Legends',
  },
  {
    story: 'buttons-button--text',
    label: 'Text',
    props: {
      variant: 'text',
    },
    text: 'League of Legends',
  },
  {
    story: 'buttons-button--text-disabled',
    label: 'Text Disabled',
    props: {
      disabled: true,
      variant: 'text',
    },
    text: 'League of Legends',
  },
  {
    story: 'buttons-button--text-inline',
    label: 'Text Inline',
    props: {
      variant: 'text',
    },
    text: 'League of Legends',
  },
  {
    story: 'buttons-button--size-small',
    label: 'Size Small',
    props: {
      size: 'small',
    },
    text: 'League of Legends',
  },
  {
    story: 'buttons-button--size-medium',
    label: 'Size Medium',
    props: {
      size: 'medium',
    },
    text: 'League of Legends',
  },
  {
    story: 'buttons-button--size-large',
    label: 'Size Large',
    props: {
      size: 'large',
    },
    text: 'League of Legends',
  },
  {
    story: 'buttons-button--rounded-primary',
    label: 'Rounded Primary',
    props: {
      variant: 'primary',
      shape: 'round',
    },
    text: '+',
  },
  {
    story: 'buttons-button--rounded-secondary',
    label: 'Rounded Secondary',
    props: {
      variant: 'secondary',
      shape: 'round',
    },
    text: '+',
  },
  {
    story: 'buttons-button--rounded-hextech',
    label: 'Rounded Hextech',
    props: {
      variant: 'hextech',
      shape: 'round',
    },
    text: '+',
  },
  {
    story: 'buttons-button--rounded-dimmed',
    label: 'Rounded Dimmed',
    props: {
      variant: 'dimmed',
      shape: 'round',
    },
    text: '+',
  },
  {
    story: 'buttons-button--rounded-disabled',
    label: 'Rounded Disabled',
    props: {
      disabled: true,
      shape: 'round',
    },
    text: '+',
  },
  {
    story: 'buttons-button--rounded-text',
    label: 'Rounded Text',
    props: {
      variant: 'text',
      shape: 'round',
    },
    text: '+',
  },
  {
    story: 'buttons-button--rounded-text-disabled',
    label: 'Rounded Text Disabled',
    props: {
      disabled: true,
      shape: 'round',
      variant: 'text',
    },
    text: '+',
  },
  {
    story: 'buttons-button--rounded-primary-with-text',
    label: 'Rounded Primary With Text',
    props: {
      variant: 'primary',
      shape: 'round',
    },
    text: 'A',
  },
  {
    story: 'buttons-button--rounded-small',
    label: 'Rounded Small',
    props: {
      shape: 'round',
      size: 'small',
    },
    text: '+',
  },
  {
    story: 'buttons-button--rounded-medium',
    label: 'Rounded Medium',
    props: {
      shape: 'round',
      size: 'medium',
    },
    text: '+',
  },
  {
    story: 'buttons-button--rounded-large',
    label: 'Rounded Large',
    props: {
      shape: 'round',
      size: 'large',
    },
    text: '+',
  },
  {
    story: 'buttons-button--squared-primary',
    label: 'Squared Primary',
    props: {
      variant: 'primary',
      shape: 'square',
    },
    text: '+',
  },
  {
    story: 'buttons-button--squared-secondary',
    label: 'Squared Secondary',
    props: {
      variant: 'secondary',
      shape: 'square',
    },
    text: '+',
  },
  {
    story: 'buttons-button--squared-hextech',
    label: 'Squared Hextech',
    props: {
      variant: 'hextech',
      shape: 'square',
    },
    text: '+',
  },
  {
    story: 'buttons-button--squared-dimmed',
    label: 'Squared Dimmed',
    props: {
      variant: 'dimmed',
      shape: 'square',
    },
    text: '+',
  },
  {
    story: 'buttons-button--squared-disabled',
    label: 'Squared Disabled',
    props: {
      disabled: true,
      shape: 'square',
    },
    text: '+',
  },
  {
    story: 'buttons-button--squared-text',
    label: 'Squared Text',
    props: {
      variant: 'text',
      shape: 'square',
    },
    text: '+',
  },
  {
    story: 'buttons-button--squared-text-disabled',
    label: 'Squared Text Disabled',
    props: {
      disabled: true,
      shape: 'square',
      variant: 'text',
    },
    text: '+',
  },
  {
    story: 'buttons-button--squared-image',
    label: 'Squared Image',
    props: {
      shape: 'square',
      className: 'size-[68px]',
    },
    text: '+',
  },
  {
    story: 'buttons-button--squared-inside-flex',
    label: 'Squared Inside Flex',
    props: {
      shape: 'square',
      className: 'size-24',
    },
    text: '+',
  },
];

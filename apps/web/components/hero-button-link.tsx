'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';
import { buttonVariants, type ButtonVariant, type ControlSize } from '@hextech-ui/react/button';

type HeroButtonLinkProps = ComponentProps<typeof Link> & {
  variant: ButtonVariant;
  size?: ControlSize;
};

export function HeroButtonLink({
  variant,
  size = 'large',
  className,
  ...props
}: HeroButtonLinkProps) {
  return (
    <Link
      prefetch
      {...props}
      data-hextech-ui="button-link"
      className={buttonVariants({ variant, size, className })}
    />
  );
}

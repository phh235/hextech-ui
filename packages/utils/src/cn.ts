import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ['hx-xs', 'hx-sm', 'hx-base', 'hx-lg', 'hx-xl', 'hx-2xl', 'hx-3xl', 'hx-4xl'],
      font: ['hx-sans', 'hx-display', 'hx-mono', 'hx-serif'],
      'font-weight': ['hx-normal', 'hx-medium', 'hx-semibold', 'hx-bold', 'hx-black'],
      leading: ['hx-normal', 'hx-tight'],
      tracking: ['hx-wide'],
      radius: ['hx-sm', 'hx-md', 'hx-lg'],
      shadow: ['hx-panel', 'hx-glow'],
      ease: ['hx-standard'],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

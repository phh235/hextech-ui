import type { SVGProps } from 'react';

type ControlIconName = 'plus' | 'minus' | 'chevron-down' | 'chevron-right' | 'check' | 'close';
const paths: Record<ControlIconName, string> = {
  plus: 'M8 2v12M2 8h12',
  minus: 'M2 8h12',
  'chevron-down': 'm3 5.5 5 5 5-5',
  'chevron-right': 'm5.5 3 5 5-5 5',
  check: 'm2.5 8 3.5 3.5 7.5-8',
  close: 'm3.5 3.5 9 9m0-9-9 9',
};
/** Shared original geometry; independent of the surrounding text font. */
export function ControlIcon({
  name,
  ...props
}: SVGProps<SVGSVGElement> & { name: ControlIconName }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d={paths[name]} />
    </svg>
  );
}

import Link from 'next/link';
import manifest from '../../../packages/react/component-manifest.json';
export function ComponentGallery() {
  return (
    <nav
      aria-label="All components"
      className="not-prose grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {[...manifest]
        .sort((a, b) => a.title.localeCompare(b.title, 'en'))
        .map((item) => (
          <Link
            key={item.name}
            href={'/docs/components/' + item.name}
            className="py-1.5 text-sm font-medium text-fd-foreground hover:underline underline-offset-4"
          >
            {item.title}
          </Link>
        ))}
    </nav>
  );
}

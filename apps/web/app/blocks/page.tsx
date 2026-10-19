import { pageMetadata } from '@/lib/seo';
import { BlockGallery } from '@/components/block-gallery';
export const metadata = pageMetadata({
  title: 'Blocks',
  description:
    'Original installable account, lobby, draft and HUD compositions, built from Hextech UI components.',
  path: '/blocks',
  index: false,
});
export default function BlocksPage() {
  return (
    <div id="main-content" className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 sm:py-20">
      <header className="mb-12 max-w-2xl">
        <p className="eyebrow">START WITH SOMETHING REAL</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Your next screen starts here.
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          Original blocks for the workshop, the party, and the moment before the match. Install the
          source, then make it yours.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          All examples run locally with fictional data. Authentication, messaging and matchmaking
          services are not connected.
        </p>
      </header>
      <BlockGallery />
    </div>
  );
}

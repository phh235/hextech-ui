import Image from 'next/image';
import { FeaturedComponents } from '@/components/featured-components';
import { ButtonLink } from '@hextech-ui/react/link';
import { StructuredData } from '@/components/structured-data';
import { pageMetadata, siteName, siteTitle, siteDescription } from '@/lib/seo';
import { repositoryUrl, siteUrl } from '@/lib/site';

export const metadata = pageMetadata({ title: siteTitle, path: '/' });

const websiteData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteName,
  url: siteUrl,
  description: siteDescription,
  inLanguage: 'en',
};
const sourceData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareSourceCode',
  name: siteName,
  url: siteUrl,
  description: siteDescription,
  programmingLanguage: 'TypeScript',
  ...(repositoryUrl && {
    codeRepository: repositoryUrl,
    license: `${repositoryUrl}/blob/HEAD/LICENSE`,
  }),
};

export default function Home() {
  return (
    <div id="main-content" className="mx-auto w-full max-w-[1600px] px-4 pb-12 sm:px-6">
      <StructuredData data={websiteData} />
      <StructuredData data={sourceData} />
      <section className="mx-auto flex max-w-6xl flex-col items-center px-2 py-12 text-center md:py-16">
        <Image
          src="/icon.svg"
          alt=""
          width={144}
          height={144}
          className="mb-6 size-28 sm:size-36"
          loading="eager"
        />
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl xl:text-6xl">
          <span className="hero-title hero-title-gold">League-inspired components.</span>
          <br />
          <span className="hero-title hero-title-hextech">Open by design.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-fd-muted-foreground">
          React components with a Hextech touch. Yours to customize.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink variant="primary" size="large" href="/docs/components">
            Browse Components
          </ButtonLink>
          <ButtonLink
            variant="hextech"
            size="large"
            href="/docs/installation"
            className="focus-visible:outline-[var(--hextech-ui-blue-200)]"
          >
            Get Started
          </ButtonLink>
        </div>
      </section>
      <section aria-labelledby="showcase-heading">
        <h2 id="showcase-heading" className="sr-only">
          Components in action
        </h2>
        <FeaturedComponents />
      </section>
    </div>
  );
}

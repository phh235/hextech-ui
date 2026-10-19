import { source, docsLlms } from '@/lib/source';
export const revalidate = false;
export async function GET(_request: Request, { params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  if (slug.at(-1) !== 'content.md') return new Response('Not found', { status: 404 });
  const slugs = slug.slice(0, -1);
  if (slugs.at(-1) === 'index') slugs.pop();
  if (slugs[0] === 'blocks') return new Response('Not found', { status: 404 });
  const page = source.getPage(slugs);
  if (!page) return new Response('Not found', { status: 404 });
  return new Response(await docsLlms.page(page), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
export function generateStaticParams() {
  return source
    .generateParams()
    .filter((item) => item.slug[0] !== 'blocks')
    .map((item) => ({ ...item, slug: [...item.slug, 'content.md'] }));
}

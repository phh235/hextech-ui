import 'server-only';
import { docsLlms, docsPages } from './source';

let corpus: Promise<Array<{ title: string; url: string; text: string }>> | undefined;
function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replaceAll('đ', 'd')
    .toLowerCase();
}
export async function getDocsContext(question: string, location?: string) {
  corpus ??= Promise.all(
    docsPages().map(async (page) => ({
      title: page.data.title,
      url: page.url,
      text: await docsLlms.page(page),
    })),
  );
  const query = normalize(question);
  const setupQuestion = /\b(javascript|typescript|jsx|tsx|vite|next|install)\b|cai dat/.test(query);
  const terms = query.split(/[^a-z0-9]+/).filter((term) => term.length > 2);
  if (/cai dat|install/.test(query)) terms.push('installation');
  if (/sang|toi|mau|theme/.test(query)) terms.push('theming');
  if (/nut|button/.test(query)) terms.push('button');
  let current = '';
  try {
    current = new URL(location ?? '', 'http://localhost').pathname;
  } catch {
    current = '';
  }
  const ranked = (await corpus)
    .map((page) => ({
      page,
      score:
        (page.url === current ? 10 : 0) +
        (setupQuestion && ['/docs/getting-started', '/docs/installation'].includes(page.url)
          ? 20
          : 0) +
        terms.reduce(
          (n, term) =>
            n +
            (normalize(page.title).includes(term) ? 6 : 0) +
            (normalize(page.text).includes(term) ? 1 : 0),
          0,
        ),
    }))
    .sort((a, b) => b.score - a.score);
  return ranked
    .slice(0, 6)
    .map(({ page }) => page.text.slice(0, 6500))
    .join('\n\n---\n\n');
}

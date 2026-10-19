import Link from 'next/link';
import { repositoryUrl, supportUrl } from '@/lib/site';

export function SiteFooter() {
  return (
    <footer className="site-footer mx-auto w-full max-w-7xl px-6 py-6 text-center text-sm text-fd-muted-foreground">
      <p>
        Based on{' '}
        <Link
          href="https://ui.lolmath.net/"
          className="underline underline-offset-4 hover:text-fd-foreground"
        >
          LoL Math UI
        </Link>
        . Rebuilt by{' '}
        <Link
          href="https://github.com/phh235"
          className="underline underline-offset-4 hover:text-fd-foreground"
        >
          phh235
        </Link>
        .
        {repositoryUrl && (
          <>
            {' '}
            The source code is available on{' '}
            <Link
              href={repositoryUrl}
              className="underline underline-offset-4 hover:text-fd-foreground"
            >
              GitHub
            </Link>
            .
          </>
        )}{' '}
        <Link
          href={supportUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 hover:text-fd-foreground"
        >
          Support on Ko-fi
        </Link>
        .
      </p>
    </footer>
  );
}

import Link from 'next/link';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
export default function NotFound() {
  return (
    <div id="main-content" className="not-found">
      <p className="eyebrow">404 / OFF THE MAP</p>
      <h1>That page is off the map.</h1>
      <p>Explore the library to find your next starting point.</p>
      <Link className={buttonVariants({ variant: 'primary' })} href="/docs">
        Documentation →
      </Link>
    </div>
  );
}

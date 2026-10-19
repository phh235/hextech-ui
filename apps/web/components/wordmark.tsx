import Link from 'next/link';
import Image from 'next/image';

export function Wordmark() {
  return (
    <Link href="/" className="wordmark" aria-label="Hextech UI home">
      <Brand />
    </Link>
  );
}

export function Brand() {
  return (
    <span className="brand-content">
      <Image src="/icon.svg" alt="" width={40} height={40} />
      <span>Hextech UI</span>
    </span>
  );
}

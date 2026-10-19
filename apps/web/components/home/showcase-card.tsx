import Link from 'next/link';
import { useId, type ReactNode } from 'react';
import { Card, CardTitle, CardDescription } from '@hextech-ui/react/card';

export function ShowcaseCard({
  title,
  component,
  description,
  children,
}: {
  title: string;
  component: string;
  description?: string;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <Card
      aria-labelledby={id}
      className="showcase-card mb-5 grid break-inside-avoid content-start gap-5 p-5"
    >
      <div className="grid gap-1.5">
        <CardTitle id={id} className="text-base leading-6 tracking-wide">
          <Link href={`/docs/components/${component}`} className="showcase-title-link">
            {title}
          </Link>
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </div>
      {children}
    </Card>
  );
}

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
    <Card aria-labelledby={id} className="showcase-card grid content-start gap-5 p-5">
      <div className="grid gap-1.5">
        <CardTitle id={id} className="text-hx-base leading-6 tracking-hx-wide">
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

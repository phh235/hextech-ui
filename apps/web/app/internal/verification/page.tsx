import type { Metadata } from 'next';
import { InternalPreview } from '@/components/internal-preview';
export const metadata: Metadata = {
  title: 'Internal verification',
  robots: { index: false, follow: false },
};
export default function Verification() {
  return (
    <main id="main-content" className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="mb-8 text-3xl">Internal verification fixture</h1>
      <InternalPreview />
    </main>
  );
}

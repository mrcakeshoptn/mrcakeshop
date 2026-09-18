import { Suspense } from 'react';
import CakesClient from './CakesClient';

export default function CakesPage() {
  return (
    <Suspense fallback={null}>
      <CakesClient />
    </Suspense>
  );
}

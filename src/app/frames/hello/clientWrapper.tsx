'use client';

import dynamic from 'next/dynamic';

const ClientComponent = dynamic(() => import('./client'), {
  ssr: false
});

export default function ClientWrapper() {
  return <ClientComponent />;
}

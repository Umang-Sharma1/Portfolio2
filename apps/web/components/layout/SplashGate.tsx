'use client';

import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';

const SplashLoader = dynamic(
  () => import('./SplashLoader').then((m) => m.SplashLoader),
  { ssr: false }
);

/**
 * Wraps children with the SplashLoader boot screen.
 * Children are always mounted (so heavy assets start loading immediately),
 * but hidden behind the splash overlay until it completes.
 */
export function SplashGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  const handleComplete = useCallback(() => {
    setReady(true);
  }, []);

  return (
    <>
      {!ready && <SplashLoader onComplete={handleComplete} />}
      {children}
    </>
  );
}

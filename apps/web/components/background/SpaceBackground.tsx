'use client';

import React, { Suspense, lazy } from 'react';
import { useTheme } from 'next-themes';
import { useIsMobile } from '../../hooks/use-is-mobile';
import StarField2D from './StarField2D';

const StarField3D = lazy(() => import('./StarField3D'));

const SpaceBackground: React.FC = () => {
  const isMobile = useIsMobile();
  const { resolvedTheme } = useTheme();

  // Hide space background in light mode
  if (resolvedTheme === 'light') {
    return (
      <div className="fixed inset-0 pointer-events-none -z-10">
        {/* Light mode: subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone-50 via-white to-stone-100" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(14,165,233,0.06)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(var(--glow-crimson),0.04)_0%,transparent_50%)]" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>
    );
  }

  // Dark mode: full space experience
  return (
    <div className="fixed inset-0 pointer-events-none -z-10">
      {isMobile ? (
        <StarField2D />
      ) : (
        <Suspense fallback={<StarField2D />}>
          <StarField3D />
        </Suspense>
      )}
      {/* Global Vignette/Glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-space-black/80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(3,0,20,0.4)_100%)]" />
    </div>
  );
};

export default SpaceBackground;

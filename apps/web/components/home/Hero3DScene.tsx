'use client';

/**
 * Hero3DScene — persistent hero background after the BigBangGate completes.
 * Renders the 80 K-star MilkyWay galaxy + 5-layer NebulaClouds in a single Canvas.
 */

import { memo, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { MilkyWay } from './MilkyWay';
import { NebulaClouds } from './NebulaClouds';

// ============================================================================
// SCENE — MilkyWay galaxy (reveal = 1, fully formed) + volumetric nebula
// ============================================================================

const Scene = memo(function Scene() {
  return (
    <>
      <MilkyWay reveal={1} rotationY={0.28} position={[0, -3, -8]} />
      <NebulaClouds />
    </>
  );
});

// ============================================================================
// EXPORT — mounted via dynamic(() => import(…), { ssr: false })
// ============================================================================

export default memo(function Hero3DScene() {
  const [dpr, setDpr] = useState(1);

  useEffect(() => {
    setDpr(Math.min(window.devicePixelRatio, 1.5));
  }, []);

  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0, 30], fov: 60 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        style={{ background: 'transparent' }}
        frameloop="always"
        performance={{ min: 0.5 }}
      >
        <Scene />
      </Canvas>
    </div>
  );
});

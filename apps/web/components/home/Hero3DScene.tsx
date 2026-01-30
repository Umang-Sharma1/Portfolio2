'use client';

import React, { useEffect, useState, memo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import { useTheme } from 'next-themes';
import BlackHoleCore from './BlackHoleCore';

const Scene = memo(function Scene({ isLight }: { isLight: boolean }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1.2} />
      <pointLight position={[-10, -10, -10]} intensity={0.6} color="#61DAFB" />
      <Stars radius={60} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
        <BlackHoleCore isLight={isLight} />
      </Float>
    </>
  );
});

export const Hero3DScene = memo(function Hero3DScene() {
  const [dpr, setDpr] = useState(1);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    setDpr(pixelRatio);
  }, []);

  return (
    <div className="absolute inset-0 bg-gradient-to-b from-background to-muted">
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
        frameloop="always"
        performance={{ min: 0.5 }}
      >
        <Scene isLight={isLight} />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent pointer-events-none" />
    </div>
  );
});

export default Hero3DScene;

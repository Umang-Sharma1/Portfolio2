'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from 'next-themes';
import { SingularityShader } from './SingularityShader';

const GargantuaSingularity = ({ theme }: { theme: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uTheme: { value: theme === 'dark' ? 0 : 1 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    uniforms.uTheme.value = theme === 'dark' ? 0 : 1;
  }, [theme, uniforms]);

  useFrame((state) => {
    const { mouse, clock } = state;
    const t = clock.getElapsedTime();
    uniforms.uTime.value = t;

    if (mouse) {
      uniforms.uMouse.value.lerp(mouse, 0.05);
    }

    if (coreRef.current) {
      coreRef.current.scale.setScalar(1.0 + Math.sin(t * 1.5) * 0.015);
    }
  });

  return (
    <group scale={1.2}>
      {/* The Black Hole Core (Event Horizon) */}
      <Sphere ref={coreRef} args={[1, 128, 128]}>
        <meshBasicMaterial color="#000000" />
      </Sphere>

      {/* The Accretion Disk & Lensing Shader */}
      <mesh ref={meshRef}>
        <planeGeometry args={[16, 16, 1, 1]} />
        <shaderMaterial
          transparent
          side={THREE.DoubleSide}
          uniforms={uniforms}
          vertexShader={SingularityShader.vertexShader}
          fragmentShader={SingularityShader.fragmentShader}
          depthWrite={false}
          blending={theme === 'dark' ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </mesh>
    </group>
  );
};

const DeepSpaceBackground = ({ theme }: { theme: string }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 6000;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 25 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state) => {
    const { mouse } = state;
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.00015;
      if (mouse) {
        pointsRef.current.position.x = THREE.MathUtils.lerp(
          pointsRef.current.position.x,
          mouse.x * 0.8,
          0.05
        );
        pointsRef.current.position.y = THREE.MathUtils.lerp(
          pointsRef.current.position.y,
          mouse.y * 0.8,
          0.05
        );
      }
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={theme === 'dark' ? '#FFE4AD' : '#CBD5E1'}
        size={0.025}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

export const SingularityCore = () => {
  const { theme } = useTheme();
  const currentTheme = theme || 'dark';

  return (
    <div className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 40 }}
        gl={{ antialias: true, alpha: true, stencil: false, depth: true }}
      >
        <DeepSpaceBackground theme={currentTheme} />
        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.25}>
          <GargantuaSingularity theme={currentTheme} />
        </Float>
      </Canvas>
    </div>
  );
};

export default SingularityCore;

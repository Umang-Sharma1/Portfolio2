'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const Stars = () => {
  const ref = useRef<THREE.Points>(null);

  const points = useMemo(() => {
    const count = 6000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Create a shell of stars
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 8 + Math.random() * 12;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Add a hint of color
      const mix = Math.random();
      if (mix > 0.8) {
        colors[i * 3] = 0.0; // Cyan hint
        colors[i * 3 + 1] = 0.95;
        colors[i * 3 + 2] = 1.0;
      } else if (mix > 0.6) {
        colors[i * 3] = 0.73; // Purple hint
        colors[i * 3 + 1] = 0.07;
        colors[i * 3 + 2] = 0.99;
      } else {
        colors[i * 3] = 1; // Pure white
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 1;
      }
    }
    return { positions, colors };
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 25;
      ref.current.rotation.y -= delta / 35;
    }
  });

  // Removed <group> to fix 'Property group does not exist on type JSX.IntrinsicElements'
  // Moved rotation to the Points component which inherits Object3D properties.
  return (
    <Points
      ref={ref}
      positions={points.positions}
      colors={points.colors}
      stride={3}
      frustumCulled={false}
      rotation={[0, 0, Math.PI / 4]}
    >
      <PointMaterial
        transparent
        vertexColors
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

const StarField3D: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] bg-space-black">
      <Canvas camera={{ position: [0, 0, 1], fov: 75 }}>
        <Stars />
      </Canvas>
    </div>
  );
};

export default StarField3D;

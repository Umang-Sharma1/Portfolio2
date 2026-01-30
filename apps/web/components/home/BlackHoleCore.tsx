'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const BlackHoleCore: React.FC<{ isLight?: boolean }> = ({ isLight }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const diskRef = useRef<THREE.Mesh>(null);

  // Accretion Disk Geometry
  const diskGeometry = useMemo(() => new THREE.TorusGeometry(3.5, 0.4, 16, 100), []);

  // Custom Shader for the Accretion Disk
  const shaderArgs = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(isLight ? '#000000' : '#00F3FF') },
        uOpacity: { value: isLight ? 0.8 : 0.6 },
      },
      vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
      fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        float strength = sin(vUv.x * 20.0 + uTime * 2.0) * 0.5 + 0.5;
        strength *= sin(vUv.y * 50.0 - uTime * 1.5) * 0.5 + 0.5;
        
        vec3 finalColor = mix(uColor, vec3(1.0), strength * 0.5);
        float alpha = uOpacity * strength * (1.0 - length(vPosition.xy) * 0.2);
        
        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
    }),
    [isLight]
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.2;
      meshRef.current.scale.setScalar(1 + Math.sin(t) * 0.05);
    }
    if (diskRef.current) {
      diskRef.current.rotation.z = t * 0.5;
      diskRef.current.rotation.x = Math.PI / 2.2 + Math.sin(t * 0.5) * 0.1;
    }
    shaderArgs.uniforms.uTime.value = t;
  });

  return (
    <group>
      {/* The Event Horizon (Central Sphere) */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicMaterial color={isLight ? '#ffffff' : '#000000'} wireframe={isLight} />
      </mesh>

      {/* The Accretion Disk */}
      <mesh ref={diskRef} geometry={diskGeometry}>
        <shaderMaterial
          args={[shaderArgs]}
          transparent
          side={THREE.DoubleSide}
          blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer Atmospheric Glow */}
      <mesh scale={[4.5, 4.5, 4.5]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={isLight ? '#000000' : '#BC13FE'}
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};

export default BlackHoleCore;

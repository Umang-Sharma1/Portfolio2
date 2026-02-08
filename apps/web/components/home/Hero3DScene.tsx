'use client';

import React, { useRef, useMemo, useState, useEffect, memo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, Line, Html } from '@react-three/drei';
import * as THREE from 'three';

// ============================================================================
// TECH STACK CONFIGURATION
// ============================================================================

interface TechConfig {
  name: string;
  color: string;
  position: [number, number, number];
}

const TECH_STACK: TechConfig[] = [
  { name: 'React', color: '#61DAFB', position: [-2.8, 1.6, 0] },
  { name: 'Node.js', color: '#68A063', position: [2.8, 1.4, 0.5] },
  { name: 'MongoDB', color: '#4DB33D', position: [-2.5, -1.5, 0.3] },
  { name: 'TypeScript', color: '#3178C6', position: [2.6, -1.6, -0.2] },
  { name: 'Express', color: '#888888', position: [0, 0, -0.5] },
];

// ============================================================================
// HOVERABLE LABEL (Html overlay from drei)
// ============================================================================

function TechLabel({ name, color, hovered }: { name: string; color: string; hovered: boolean }) {
  return (
    <Html center distanceFactor={10} style={{ pointerEvents: 'none' }} position={[0, -0.9, 0]}>
      <div
        className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-[0.15em] uppercase transition-all duration-300 whitespace-nowrap ${
          hovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-1 scale-90'
        }`}
        style={{
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${color}50`,
          color: color,
          boxShadow: `0 0 20px ${color}25`,
        }}
      >
        {name}
      </div>
    </Html>
  );
}

// ============================================================================
// REACT ATOM — Iconic 3-orbital spinning logo
// ============================================================================

const ReactAtom = memo(function ReactAtom({ isLight }: { isLight: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.5;
    groupRef.current.rotation.z = Math.sin(t * 0.25) * 0.15;
  });

  const c = TECH_STACK[0].color;
  const ei = hovered ? 1.5 : 0.7;

  return (
    <Float speed={1.8} rotationIntensity={0.15} floatIntensity={0.8} position={TECH_STACK[0].position}>
      <group
        ref={groupRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.15 : 1}
      >
        {/* Nucleus */}
        <mesh>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color={c} emissive={c} emissiveIntensity={3} />
        </mesh>

        {/* Three orbital rings — the React logo */}
        {[0, Math.PI / 3, -Math.PI / 3].map((rot, i) => (
          <mesh key={i} rotation={[rot, 0, 0]}>
            <torusGeometry args={[0.5, 0.018, 8, 64]} />
            <meshStandardMaterial
              color={c}
              emissive={c}
              emissiveIntensity={ei}
              transparent
              opacity={0.85}
            />
          </mesh>
        ))}

        {/* Glow sphere */}
        <mesh>
          <sphereGeometry args={[0.75, 16, 16]} />
          <meshBasicMaterial color={c} transparent opacity={hovered ? 0.12 : 0.04} />
        </mesh>

        <TechLabel name="React" color={c} hovered={hovered} />
      </group>
    </Float>
  );
});

// ============================================================================
// NODE.JS HEXAGONAL PRISM
// ============================================================================

const NodeHexagon = memo(function NodeHexagon({ isLight }: { isLight: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.35;
    groupRef.current.rotation.z = Math.cos(t * 0.2) * 0.1;
  });

  const c = TECH_STACK[1].color;

  return (
    <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.7} position={TECH_STACK[1].position}>
      <group
        ref={groupRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.15 : 1}
      >
        {/* Solid hexagonal disk */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.42, 0.42, 0.12, 6]} />
          <meshStandardMaterial
            color={c}
            emissive={c}
            emissiveIntensity={hovered ? 1.2 : 0.5}
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>

        {/* Wireframe ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.14, 6]} />
          <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.3} wireframe />
        </mesh>

        {/* Glow */}
        <mesh>
          <sphereGeometry args={[0.65, 16, 16]} />
          <meshBasicMaterial color={c} transparent opacity={hovered ? 0.12 : 0.04} />
        </mesh>

        <TechLabel name="Node.js" color={c} hovered={hovered} />
      </group>
    </Float>
  );
});

// ============================================================================
// MONGODB LEAF SHAPE
// ============================================================================

const MongoDBLeaf = memo(function MongoDBLeaf({ isLight }: { isLight: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.3;
    groupRef.current.rotation.x = Math.sin(t * 0.4) * 0.15;
  });

  const c = TECH_STACK[2].color;

  return (
    <Float speed={1.6} rotationIntensity={0.25} floatIntensity={0.6} position={TECH_STACK[2].position}>
      <group
        ref={groupRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.15 : 1}
      >
        {/* Leaf body — stretched sphere */}
        <mesh scale={[0.3, 0.55, 0.15]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial
            color={c}
            emissive={c}
            emissiveIntensity={hovered ? 1.2 : 0.5}
            metalness={0.5}
            roughness={0.4}
          />
        </mesh>

        {/* Stem */}
        <mesh position={[0, -0.38, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.25, 8]} />
          <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.6} />
        </mesh>

        {/* Glow */}
        <mesh>
          <sphereGeometry args={[0.65, 16, 16]} />
          <meshBasicMaterial color={c} transparent opacity={hovered ? 0.12 : 0.04} />
        </mesh>

        <TechLabel name="MongoDB" color={c} hovered={hovered} />
      </group>
    </Float>
  );
});

// ============================================================================
// TYPESCRIPT SQUARE
// ============================================================================

const TypeScriptSquare = memo(function TypeScriptSquare({ isLight }: { isLight: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.4;
    groupRef.current.rotation.x = Math.cos(t * 0.3) * 0.12;
  });

  const c = TECH_STACK[3].color;

  return (
    <Float speed={1.3} rotationIntensity={0.2} floatIntensity={0.7} position={TECH_STACK[3].position}>
      <group
        ref={groupRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.15 : 1}
      >
        {/* Solid square */}
        <mesh>
          <boxGeometry args={[0.55, 0.55, 0.1]} />
          <meshStandardMaterial
            color={c}
            emissive={c}
            emissiveIntensity={hovered ? 1.2 : 0.5}
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>

        {/* Wireframe overlay */}
        <mesh>
          <boxGeometry args={[0.6, 0.6, 0.12]} />
          <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.3} wireframe />
        </mesh>

        {/* Glow */}
        <mesh>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshBasicMaterial color={c} transparent opacity={hovered ? 0.12 : 0.04} />
        </mesh>

        <TechLabel name="TypeScript" color={c} hovered={hovered} />
      </group>
    </Float>
  );
});

// ============================================================================
// EXPRESS TORUS KNOT (centre-piece)
// ============================================================================

const ExpressKnot = memo(function ExpressKnot({ isLight }: { isLight: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.25;
    groupRef.current.rotation.x = t * 0.15;
  });

  const c = isLight ? '#555555' : '#aaaaaa';

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.4} position={TECH_STACK[4].position}>
      <group
        ref={groupRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.15 : 1}
      >
        <mesh>
          <torusKnotGeometry args={[0.3, 0.08, 100, 16]} />
          <meshStandardMaterial
            color={c}
            emissive={c}
            emissiveIntensity={hovered ? 0.8 : 0.3}
            metalness={0.8}
            roughness={0.15}
          />
        </mesh>

        {/* Glow */}
        <mesh>
          <sphereGeometry args={[0.7, 16, 16]} />
          <meshBasicMaterial color={c} transparent opacity={hovered ? 0.1 : 0.03} />
        </mesh>

        <TechLabel name="Express" color={c} hovered={hovered} />
      </group>
    </Float>
  );
});

// ============================================================================
// PARTICLE NETWORK — ambient floating particles
// ============================================================================

const ParticleNetwork = memo(function ParticleNetwork({ isLight }: { isLight: boolean }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const pos: number[] = [];
    const col: number[] = [];
    const count = 500;

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2 + Math.random() * 4;
      pos.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      );

      const t = Math.random();
      const color = new THREE.Color().lerpColors(
        new THREE.Color('#22D3EE'),
        new THREE.Color('#A855F7'),
        t,
      );
      col.push(color.r, color.g, color.b);
    }

    return {
      positions: new Float32Array(pos),
      colors: new Float32Array(col),
    };
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        vertexColors
        transparent
        opacity={isLight ? 0.35 : 0.65}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
});

// ============================================================================
// DASHED CONNECTION LINES between icons
// ============================================================================

const ConnectionLines = memo(function ConnectionLines({ isLight }: { isLight: boolean }) {
  const pairs: [number, number][] = useMemo(
    () => [
      [0, 4], [1, 4], [2, 4], [3, 4], // each → Express (centre)
      [0, 1], [1, 3], [3, 2], [2, 0],  // outer ring
    ],
    [],
  );

  const lineColor = isLight ? '#3b82f6' : '#22D3EE';

  return (
    <group>
      {pairs.map(([a, b], i) => (
        <Line
          key={i}
          points={[TECH_STACK[a].position, TECH_STACK[b].position]}
          color={lineColor}
          lineWidth={0.5}
          transparent
          opacity={0.15}
          dashed
          dashScale={3}
          dashSize={0.15}
          gapSize={0.1}
        />
      ))}
    </group>
  );
});

// ============================================================================
// ORBITAL RINGS — gentle rotating halos
// ============================================================================

const OrbitalRings = memo(function OrbitalRings({ isLight }: { isLight: boolean }) {
  const r1 = useRef<THREE.Mesh>(null);
  const r2 = useRef<THREE.Mesh>(null);
  const r3 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (r1.current) {
      r1.current.rotation.x = Math.PI / 2.5 + Math.sin(t * 0.2) * 0.05;
      r1.current.rotation.z = t * 0.08;
    }
    if (r2.current) {
      r2.current.rotation.x = Math.PI / 3 + Math.cos(t * 0.15) * 0.05;
      r2.current.rotation.z = -t * 0.06;
    }
    if (r3.current) {
      r3.current.rotation.x = Math.PI / 4;
      r3.current.rotation.y = t * 0.04;
    }
  });

  const c = isLight ? '#3b82f6' : '#22D3EE';

  return (
    <group>
      {/* Ring 1 */}
      <mesh ref={r1}>
        <torusGeometry args={[3.5, 0.008, 16, 150]} />
        <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.5} transparent opacity={0.3} />
      </mesh>
      {/* Ring 2 */}
      <mesh ref={r2}>
        <torusGeometry args={[4.2, 0.006, 16, 150]} />
        <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.3} transparent opacity={0.2} />
      </mesh>
      {/* Ring 3 */}
      <mesh ref={r3}>
        <torusGeometry args={[5.0, 0.004, 16, 150]} />
        <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.2} transparent opacity={0.15} />
      </mesh>
    </group>
  );
});

// ============================================================================
// MAIN SCENE COMPOSITION
// ============================================================================

const Scene = memo(function Scene({ isLight }: { isLight: boolean }) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={isLight ? 0.6 : 0.3} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-10, -5, -10]} intensity={0.8} color="#22D3EE" />
      <pointLight position={[5, -10, 5]} intensity={0.5} color="#A855F7" />
      <pointLight position={[0, 5, 8]} intensity={0.3} color="#FB923C" />

      {/* Star field (dark mode only) */}
      {!isLight && (
        <Stars radius={100} depth={60} count={2500} factor={3} saturation={0.3} fade speed={0.3} />
      )}

      {/* MERN stack icons */}
      <ReactAtom isLight={isLight} />
      <NodeHexagon isLight={isLight} />
      <MongoDBLeaf isLight={isLight} />
      <TypeScriptSquare isLight={isLight} />
      <ExpressKnot isLight={isLight} />

      {/* Ambient elements */}
      <ParticleNetwork isLight={isLight} />
      <ConnectionLines isLight={isLight} />
      <OrbitalRings isLight={isLight} />
    </>
  );
});

// ============================================================================
// EXPORT — mounted inside Hero.tsx via dynamic import (ssr: false)
// ============================================================================

export default memo(function Hero3DScene({ isLight }: { isLight?: boolean }) {
  const [dpr, setDpr] = useState(1);

  useEffect(() => {
    setDpr(Math.min(window.devicePixelRatio, 2));
  }, []);

  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0, 7], fov: 50 }}
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
        <Scene isLight={isLight ?? false} />
      </Canvas>
    </div>
  );
});

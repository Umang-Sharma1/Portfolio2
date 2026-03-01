'use client';

/**
 * BigBangGate — Full-screen "click to initiate" singularity screen.
 * On click → particle explosion → galaxy reveal → hero UI fades in.
 */

import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MilkyWay } from './MilkyWay';
import { NebulaClouds } from './NebulaClouds';

// ─────────────────────────────────────────────────────────────
// Singularity dot (pre-bang)
// ─────────────────────────────────────────────────────────────
const SING_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uScale;
  void main() {
    float pulse = 1.0 + 0.35 * sin(uTime * 3.5);
    gl_PointSize = 6.0 * pulse * uScale;
    gl_Position  = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const SING_FRAG = /* glsl */ `
  uniform float uTime;
  void main() {
    vec2  uv = gl_PointCoord - 0.5;
    float d  = length(uv);
    if (d > 0.5) discard;
    float core  = exp(-d * d * 14.0);
    float halo  = exp(-d * d * 3.5) * 0.5;
    float pulse = 0.85 + 0.15 * sin(uTime * 3.5);
    gl_FragColor = vec4(vec3(1.0) * pulse, (core + halo));
  }
`;

const Singularity: React.FC<{ clicked: boolean }> = ({ clicked }) => {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3));
    return g;
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScale: { value: 1 },
    }),
    []
  );

  useFrame((state) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    if (clicked) {
      matRef.current.uniforms.uScale.value = THREE.MathUtils.lerp(
        matRef.current.uniforms.uScale.value,
        80,
        0.12
      );
    }
  });

  return (
    <points geometry={geo}>
      <shaderMaterial
        ref={matRef}
        vertexShader={SING_VERT}
        fragmentShader={SING_FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// ─────────────────────────────────────────────────────────────
// Burst particles (post-click)
// ─────────────────────────────────────────────────────────────
const BURST_VERT = /* glsl */ `
  attribute vec3  aVelocity;
  attribute float aSize;
  attribute vec3  aColor;
  attribute float aLife;

  uniform float uProgress;

  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    vColor = aColor;
    float t  = 1.0 - pow(1.0 - uProgress, 2.5);
    vec3  p  = position + aVelocity * t * 22.0;
    vAlpha   = (1.0 - uProgress) * aLife;

    vec4 mv  = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * (280.0 / -mv.z);
    gl_Position  = projectionMatrix * mv;
  }
`;

const BURST_FRAG = /* glsl */ `
  varying vec3  vColor;
  varying float vAlpha;
  void main() {
    vec2  uv = gl_PointCoord - 0.5;
    float d  = dot(uv, uv);
    if (d > 0.25) discard;
    float a  = exp(-d * 8.0) * vAlpha;
    gl_FragColor = vec4(vColor, a);
  }
`;

const BurstParticles: React.FC<{ active: boolean }> = ({ active }) => {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const { geo, uniforms } = useMemo(() => {
    const N = 4000;
    const pos = new Float32Array(N * 3);
    const vel = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const sz = new Float32Array(N);
    const lf = new Float32Array(N);

    const palette = [
      [1.0, 0.95, 0.8],
      [1.0, 0.75, 0.35],
      [0.55, 0.75, 1.0],
      [1.0, 0.45, 0.2],
      [0.85, 0.6, 1.0],
    ];

    for (let i = 0; i < N; i++) {
      const speed = 1.5 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      vel[i * 3] = speed * Math.sin(phi) * Math.cos(theta);
      vel[i * 3 + 1] = speed * Math.sin(phi) * Math.sin(theta) * 0.5;
      vel[i * 3 + 2] = speed * Math.cos(phi);

      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c[0];
      col[i * 3 + 1] = c[1];
      col[i * 3 + 2] = c[2];
      sz[i] = 0.8 + Math.random() * 2.5;
      lf[i] = 0.4 + Math.random() * 0.6;
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aVelocity', new THREE.BufferAttribute(vel, 3));
    g.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
    g.setAttribute('aSize', new THREE.BufferAttribute(sz, 1));
    g.setAttribute('aLife', new THREE.BufferAttribute(lf, 1));
    return { geo: g, uniforms: { uProgress: { value: 0 } } };
  }, []);

  useFrame((_, delta) => {
    if (!matRef.current || !active) return;
    matRef.current.uniforms.uProgress.value = Math.min(
      matRef.current.uniforms.uProgress.value + delta * 0.38,
      1
    );
  });

  if (!active) return null;

  return (
    <points geometry={geo}>
      <shaderMaterial
        ref={matRef}
        vertexShader={BURST_VERT}
        fragmentShader={BURST_FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// ─────────────────────────────────────────────────────────────
// Scene wrapper (inside Canvas)
// ─────────────────────────────────────────────────────────────
interface SceneProps {
  phase: 'idle' | 'bang' | 'galaxy';
  reveal: number;
}

const Scene: React.FC<SceneProps> = ({ phase, reveal }) => (
  <>
    <Singularity clicked={phase !== 'idle'} />
    <BurstParticles active={phase === 'bang' || phase === 'galaxy'} />
    {phase === 'galaxy' && (
      <>
        <MilkyWay reveal={reveal} />
        <NebulaClouds />
      </>
    )}
  </>
);

// ─────────────────────────────────────────────────────────────
// Tiny helper for corner metadata text
// ─────────────────────────────────────────────────────────────
const metaStyle = (corner: 'tl' | 'br'): React.CSSProperties => ({
  position: 'absolute',
  ...(corner === 'tl' ? { top: 40, left: 44 } : { bottom: 40, right: 44 }),
  fontFamily: '"JetBrains Mono", "Courier New", monospace',
  fontSize: 9,
  letterSpacing: '0.3em',
  color: 'rgba(200,169,110,0.35)',
  textTransform: 'uppercase',
  userSelect: 'none',
});

// ─────────────────────────────────────────────────────────────
// BigBangGate — the full-screen wrapper
// ─────────────────────────────────────────────────────────────
interface BigBangGateProps {
  onComplete: () => void;
}

export const BigBangGate: React.FC<BigBangGateProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'idle' | 'bang' | 'galaxy'>('idle');
  const [reveal, setReveal] = useState(0);
  const [overlayAlpha, setOverlayAlpha] = useState(1);
  const [showHint, setShowHint] = useState(false);
  const [flashAlpha, setFlashAlpha] = useState(0);
  const revealRef = useRef(0);
  const rafRef = useRef<number>();

  // Show "click to initiate" after 900 ms
  useEffect(() => {
    const t = setTimeout(() => setShowHint(true), 900);
    return () => clearTimeout(t);
  }, []);

  const handleBang = useCallback(() => {
    if (phase !== 'idle') return;

    // 1. White flash
    setFlashAlpha(1);
    setPhase('bang');

    setTimeout(() => setFlashAlpha(0), 180);

    // 2. After flash, begin galaxy reveal
    setTimeout(() => {
      setPhase('galaxy');
      setShowHint(false);

      const start = performance.now();
      const DURATION = 3500;
      const tick = () => {
        const p = Math.min((performance.now() - start) / DURATION, 1);
        revealRef.current = p;
        setReveal(p);
        if (p < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          // 3. Fade overlay out, notify parent
          setTimeout(() => {
            setOverlayAlpha(0);
            setTimeout(onComplete, 1200);
          }, 600);
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    }, 350);
  }, [phase, onComplete]);

  // Keyboard support — Enter or Space triggers bang
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleBang();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleBang]);

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        cursor: phase === 'idle' ? 'pointer' : 'default',
        zIndex: 9999,
        opacity: overlayAlpha === 0 ? 0 : 1,
        transition: overlayAlpha === 0 ? 'opacity 1.2s ease' : 'none',
        pointerEvents: overlayAlpha === 0 ? 'none' : 'auto',
      }}
      onClick={handleBang}
      role="button"
      tabIndex={0}
      aria-label="Click to initiate Big Bang sequence"
    >
      {/* Three.js canvas */}
      <Canvas
        camera={{ position: [0, 0, 30], fov: 60 }}
        style={{ position: 'absolute', inset: 0 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => gl.setClearColor('#000000')}
      >
        <Scene phase={phase} reveal={reveal} />
      </Canvas>

      {/* Click hint + metadata */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        {/* Thin crosshair ring */}
        <div
          style={{
            width: 56,
            height: 56,
            border: '1px solid rgba(200,169,110,0.25)',
            borderRadius: '50%',
            position: 'absolute',
            animation: 'ringPulse 2.4s ease-in-out infinite',
          }}
        />

        {/* Hint text */}
        <p
          style={{
            marginTop: 80,
            fontFamily: '"JetBrains Mono", "Courier New", monospace',
            fontSize: 11,
            letterSpacing: '0.42em',
            textTransform: 'uppercase',
            color: 'rgba(200,169,110,0.55)',
            opacity: showHint ? 1 : 0,
            transition: 'opacity 1.2s ease',
            userSelect: 'none',
          }}
        >
          CLICK TO INITIATE
        </p>

        {/* Coordinate metadata */}
        {phase === 'idle' && (
          <>
            <p style={metaStyle('tl')}>T-MINUS ∞</p>
            <p style={metaStyle('br')}>SINGULARITY · CLASS Ω</p>
          </>
        )}

        {phase === 'galaxy' && (
          <p
            style={{
              position: 'absolute',
              bottom: 48,
              fontFamily: '"JetBrains Mono", "Courier New", monospace',
              fontSize: 9,
              letterSpacing: '0.3em',
              color: 'rgba(200,169,110,0.45)',
              opacity: reveal > 0.2 ? 1 : 0,
              transition: 'opacity 1s ease',
            }}
          >
            UNIVERSE AGE: {(reveal * 13.8).toFixed(1)} BYR
          </p>
        )}
      </div>

      {/* White flash overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#fff',
          opacity: flashAlpha,
          transition: flashAlpha === 0 ? 'opacity 0.5s ease' : 'opacity 0.05s ease',
          pointerEvents: 'none',
        }}
      />

      {/* CSS animation for ring pulse */}
      <style>{`
        @keyframes ringPulse {
          0%, 100% { transform: scale(1);   opacity: 0.4;  }
          50%      { transform: scale(1.5); opacity: 0.15; }
        }
      `}</style>
    </div>
  );
};

export default BigBangGate;

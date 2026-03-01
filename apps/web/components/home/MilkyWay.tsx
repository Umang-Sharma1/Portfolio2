'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─────────────────────────────────────────────────────────────
// VERTEX SHADER — per-star size, twinkle, parallax
// ─────────────────────────────────────────────────────────────
const VERTEX = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute float aBrightness;
  attribute vec3  aColor;

  varying vec3  vColor;
  varying float vBrightness;
  varying float vPhase;

  uniform float uTime;
  uniform vec2  uMouse;
  uniform float uReveal;

  void main() {
    vColor      = aColor;
    vBrightness = aBrightness;
    vPhase      = aPhase;

    vec3 p = position;

    // During Big Bang reveal: stars fly in from center
    float reveal = clamp(uReveal, 0.0, 1.0);
    float ease   = 1.0 - pow(1.0 - reveal, 3.0);
    p *= 0.01 + ease * 0.99;

    // Gentle differential rotation (inner faster than outer)
    float dist     = length(p.xz);
    float rotSpeed = 0.008 / (dist * 0.05 + 0.3);
    float angle    = uTime * rotSpeed;
    float cosA = cos(angle), sinA = sin(angle);
    float nx = p.x * cosA - p.z * sinA;
    float nz = p.x * sinA + p.z * cosA;
    p.x = nx; p.z = nz;

    // Very subtle vertical wave (galactic warp)
    p.y += sin(dist * 0.15 + uTime * 0.08) * 0.12;

    // Mouse parallax — deeper stars shift more
    float depth = (p.z + 30.0) / 60.0;
    p.x += uMouse.x * depth * 1.2;
    p.y += uMouse.y * depth * 0.8;

    vec4 mvPos = modelViewMatrix * vec4(p, 1.0);

    // Twinkle: +/-20 % size variation
    float twinkle = 0.8 + 0.2 * sin(uTime * 3.0 + aPhase * 6.283);

    gl_PointSize = aSize * twinkle * (350.0 / -mvPos.z);
    gl_Position  = projectionMatrix * mvPos;
  }
`;

// ─────────────────────────────────────────────────────────────
// FRAGMENT SHADER — soft disc + diffraction cross + bloom halo
// ─────────────────────────────────────────────────────────────
const FRAGMENT = /* glsl */ `
  varying vec3  vColor;
  varying float vBrightness;
  varying float vPhase;

  void main() {
    vec2  uv   = gl_PointCoord - 0.5;
    float dist = length(uv);
    if (dist > 0.5) discard;

    // Soft gaussian core
    float core  = exp(-dist * dist * 18.0);
    // Wide glow halo
    float halo  = exp(-dist * dist * 5.0) * 0.35;
    // Diffraction spikes (4-point cross)
    float spike = 0.0;
    float ax = abs(uv.x), ay = abs(uv.y);
    spike += max(0.0, 1.0 - ay * 50.0) * max(0.0, 1.0 - ax * 4.0) * 0.25;
    spike += max(0.0, 1.0 - ax * 50.0) * max(0.0, 1.0 - ay * 4.0) * 0.25;
    spike *= smoothstep(0.5, 0.0, dist);

    float alpha = (core + halo + spike) * vBrightness;
    gl_FragColor = vec4(vColor * (1.0 + core * 0.5), alpha);
  }
`;

// ─────────────────────────────────────────────────────────────
// CORE GLOW SHADER (separate additive billboard)
// ─────────────────────────────────────────────────────────────
const CORE_VERT = /* glsl */ `
  void main() {
    gl_PointSize = 320.0;
    gl_Position  = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const CORE_FRAG = /* glsl */ `
  uniform float uTime;
  void main() {
    vec2  uv = gl_PointCoord - 0.5;
    float d  = length(uv);
    if (d > 0.5) discard;
    float g1    = exp(-d * d * 6.0);
    float g2    = exp(-d * d * 1.5) * 0.3;
    float pulse = 0.92 + 0.08 * sin(uTime * 1.2);
    vec3  col   = mix(vec3(1.0, 0.88, 0.55), vec3(1.0, 0.55, 0.2), d * 2.0);
    gl_FragColor = vec4(col * pulse, (g1 + g2));
  }
`;

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function stellarColor(r: number, maxR: number): THREE.Color {
  const t = r / maxR;

  if (t < 0.08) {
    // Central bulge: orange-yellow
    return new THREE.Color().setHSL(0.08 + Math.random() * 0.05, 0.8, 0.7 + Math.random() * 0.2);
  } else if (t < 0.25) {
    // Inner disc: yellow-white
    return new THREE.Color().setHSL(0.1 + Math.random() * 0.05, 0.6, 0.7 + Math.random() * 0.2);
  } else if (t < 0.6) {
    // Spiral arms: mix blue-white (young) and yellow-white
    const onArm = Math.random() < 0.6;
    return onArm
      ? new THREE.Color().setHSL(0.58 + Math.random() * 0.08, 0.7, 0.7 + Math.random() * 0.25)
      : new THREE.Color().setHSL(0.1 + Math.random() * 0.05, 0.5, 0.65 + Math.random() * 0.2);
  } else {
    // Outer disc: cool, sparse
    return new THREE.Color().setHSL(0.6 + Math.random() * 0.1, 0.5, 0.4 + Math.random() * 0.3);
  }
}

// ─────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────
interface MilkyWayProps {
  reveal?: number;
  rotationY?: number;
  position?: [number, number, number];
}

export const MilkyWay: React.FC<MilkyWayProps> = ({
  reveal = 1,
  rotationY = 0.28,
  position = [0, -3, -8],
}) => {
  const starsRef = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const coreRef = useRef<THREE.Points>(null);
  const coreMatRef = useRef<THREE.ShaderMaterial>(null);

  // ── Generate galaxy geometry ────────────────────────────────
  const geo = useMemo(() => {
    const COUNT = 80_000;
    const ARMS = 4;
    const RADIUS = 28;
    const SPIN = 1.4;
    const CORE_R = 2.8;
    const THICK = 0.55;

    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    const phases = new Float32Array(COUNT);
    const brightness = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;

      const r = CORE_R + Math.pow(Math.random(), 1.6) * (RADIUS - CORE_R);

      const arm = (i % ARMS) / ARMS;
      const theta =
        arm * Math.PI * 2 + r * SPIN * (1.0 / (r * 0.12 + 1.0)) + (Math.random() - 0.5) * 0.55;

      const scatter = Math.pow(Math.random(), 2.5) * (0.5 + r * 0.04);
      const sr = r + (Math.random() - 0.5) * 2.0 * scatter;

      positions[i3] = Math.cos(theta) * sr;
      positions[i3 + 1] =
        (Math.random() - 0.5) *
        Math.pow(Math.random(), THICK) *
        ((CORE_R * 0.9) / (r * 0.12 + 1.0));
      positions[i3 + 2] = Math.sin(theta) * sr;

      const isBright = Math.random() < 0.012;
      sizes[i] = isBright ? 2.8 + Math.random() * 2.4 : 0.5 + Math.pow(Math.random(), 3) * 1.8;

      const coreBoost = Math.max(0, 1.0 - r / (CORE_R * 3));
      brightness[i] = (0.3 + Math.random() * 0.7) * (1.0 + coreBoost * 1.5);

      const c = stellarColor(r, RADIUS);
      colors[i3] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;

      phases[i] = Math.random();
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    g.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    g.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    g.setAttribute('aBrightness', new THREE.BufferAttribute(brightness, 1));
    return g;
  }, []);

  // Core glow point (single point at center)
  const coreGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3));
    return g;
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2() },
      uReveal: { value: reveal },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const coreUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  );

  // ── Per-frame update ────────────────────────────────────────
  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      matRef.current.uniforms.uMouse.value.set(state.pointer.x * 0.5, state.pointer.y * 0.5);
      matRef.current.uniforms.uReveal.value = reveal;
    }
    if (coreMatRef.current) {
      coreMatRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <group position={position} rotation={[rotationY, 0, 0]}>
      {/* ── Main star field ── */}
      <points ref={starsRef} geometry={geo}>
        <shaderMaterial
          ref={matRef}
          vertexShader={VERTEX}
          fragmentShader={FRAGMENT}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* ── Central galactic core glow ── */}
      <points ref={coreRef} geometry={coreGeo}>
        <shaderMaterial
          ref={coreMatRef}
          vertexShader={CORE_VERT}
          fragmentShader={CORE_FRAG}
          uniforms={coreUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

export default MilkyWay;

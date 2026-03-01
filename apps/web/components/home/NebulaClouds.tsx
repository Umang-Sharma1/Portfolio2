'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─────────────────────────────────────────────────────────────
// VERTEX SHADER
// ─────────────────────────────────────────────────────────────
const VERT = /* glsl */ `
  attribute float aOpacity;
  attribute float aPhase;
  attribute float aRadius;

  varying float vOpacity;
  varying float vPhase;
  varying vec3  vWorldPos;

  uniform float uTime;
  uniform vec2  uMouse;
  uniform float uLayerOpacity;

  void main() {
    vOpacity = aOpacity;
    vPhase   = aPhase;

    vec3 p = position;

    // Differential rotation: inner swirls faster
    float dist     = length(p.xz) + 0.001;
    float rotSpeed = 0.012 / (dist * 0.04 + 0.5);
    float angle    = uTime * rotSpeed * aPhase * 0.4 + uTime * 0.008;
    float cosA = cos(angle), sinA = sin(angle);
    float nx = p.x * cosA - p.z * sinA;
    float nz = p.x * sinA + p.z * cosA;
    p.x = nx; p.z = nz;

    // Gentle breathing
    p.y += sin(uTime * 0.15 + aPhase * 6.283) * 0.8;

    // Mouse parallax
    p.x += uMouse.x * 25.0 * (1.0 - aRadius * 0.03);
    p.y += uMouse.y * 16.0 * (1.0 - aRadius * 0.03);

    vWorldPos = p;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float sz = (50.0 + aOpacity * 100.0) * uLayerOpacity;
    gl_PointSize = sz * (600.0 / -mv.z);
    gl_Position  = projectionMatrix * mv;
  }
`;

// ─────────────────────────────────────────────────────────────
// FRAGMENT SHADER
// ─────────────────────────────────────────────────────────────
const FRAG = /* glsl */ `
  uniform vec3  uColor;
  uniform float uLayerOpacity;
  uniform vec2  uMouseWorld;
  varying float vOpacity;
  varying float vPhase;
  varying vec3  vWorldPos;

  void main() {
    vec2  uv = gl_PointCoord - 0.5;
    float d  = length(uv);
    if (d > 0.5) discard;

    // Volumetric gaussian falloff
    float alpha = exp(-d * d * 5.5);
    alpha       = pow(alpha, 1.6);

    // Mouse flashlight: brighten when within 180 world units
    float mDist     = length(vWorldPos.xy - uMouseWorld);
    float flashlight = smoothstep(180.0, 0.0, mDist) * 0.7;

    vec3 col = uColor + flashlight * vec3(0.18, 0.14, 0.10);
    gl_FragColor = vec4(col, alpha * vOpacity * uLayerOpacity);
  }
`;

// ─────────────────────────────────────────────────────────────
// Layer definitions
// ─────────────────────────────────────────────────────────────
interface LayerDef {
  color: [number, number, number];
  center: [number, number, number];
  spread: number;
  flattenY: number;
  count: number;
  baseOpacity: number;
}

const LAYERS: LayerDef[] = [
  {
    color: [0.14, 0.26, 0.68],
    center: [0, 0, -220],
    spread: 380,
    flattenY: 0.38,
    count: 7000,
    baseOpacity: 0.22,
  },
  {
    color: [0.4, 0.18, 0.68],
    center: [100, -70, -320],
    spread: 300,
    flattenY: 0.3,
    count: 5500,
    baseOpacity: 0.17,
  },
  {
    color: [0.72, 0.2, 0.36],
    center: [-110, 60, -270],
    spread: 260,
    flattenY: 0.32,
    count: 5000,
    baseOpacity: 0.15,
  },
  {
    color: [0.1, 0.52, 0.46],
    center: [60, 110, -190],
    spread: 200,
    flattenY: 0.28,
    count: 4000,
    baseOpacity: 0.13,
  },
  {
    color: [0.82, 0.52, 0.1],
    center: [-50, -110, -160],
    spread: 180,
    flattenY: 0.25,
    count: 3500,
    baseOpacity: 0.11,
  },
];

// ─────────────────────────────────────────────────────────────
// Single nebula layer
// ─────────────────────────────────────────────────────────────
const NebulaLayer: React.FC<{ def: LayerDef }> = ({ def }) => {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const geo = useMemo(() => {
    const { count, center, spread, flattenY } = def;
    const pos = new Float32Array(count * 3);
    const opacity = new Float32Array(count);
    const phase = new Float32Array(count);
    const radius = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const r = Math.pow(Math.random(), 0.55) * spread;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = center[0] + r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = center[1] + r * Math.sin(phi) * Math.sin(theta) * flattenY;
      pos[i * 3 + 2] = center[2] + r * Math.cos(phi) * 0.28;

      opacity[i] = 0.25 + Math.random() * 0.75;
      phase[i] = Math.random();
      radius[i] = r;
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aOpacity', new THREE.BufferAttribute(opacity, 1));
    g.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
    g.setAttribute('aRadius', new THREE.BufferAttribute(radius, 1));
    return g;
  }, [def]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2() },
      uMouseWorld: { value: new THREE.Vector2() },
      uColor: { value: new THREE.Color(...def.color) },
      uLayerOpacity: { value: def.baseOpacity },
    }),
    [def]
  );

  useFrame((state) => {
    if (!matRef.current) return;
    const u = matRef.current.uniforms;
    u.uTime.value = state.clock.elapsedTime;
    u.uMouse.value.set(state.pointer.x * 0.12, state.pointer.y * 0.09);
    u.uMouseWorld.value.set(state.pointer.x * 200, state.pointer.y * 140);
  });

  return (
    <points geometry={geo}>
      <shaderMaterial
        ref={matRef}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// ─────────────────────────────────────────────────────────────
// Exported composite
// ─────────────────────────────────────────────────────────────
export const NebulaClouds: React.FC = () => (
  <group>
    {LAYERS.map((layer, i) => (
      <NebulaLayer key={i} def={layer} />
    ))}
  </group>
);

export default NebulaClouds;

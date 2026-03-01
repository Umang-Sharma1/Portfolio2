export const SingularityShader = {
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uTheme;

    #define PI 3.14159265359

    // Smooth noise helper
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    void main() {
      vec2 uv = vUv - 0.5;
      float dist = length(uv);
      float angle = atan(uv.y, uv.x);

      // Event horizon mask - black center
      float horizon = smoothstep(0.06, 0.08, dist);

      // Accretion disk - rings of hot gas
      float diskMask = smoothstep(0.08, 0.12, dist) * smoothstep(0.5, 0.25, dist);

      // Spiral arms with time rotation
      float spiral = sin(angle * 3.0 - uTime * 0.8 + dist * 20.0) * 0.5 + 0.5;
      float spiral2 = sin(angle * 5.0 + uTime * 0.5 - dist * 15.0) * 0.5 + 0.5;

      // Radial falloff with turbulence
      float turb = noise(vec2(angle * 2.0, dist * 10.0 - uTime * 0.3)) * 0.4;
      float radialGlow = exp(-dist * 6.0) * (1.0 + turb);

      // Gravitational lensing ring (bright photon ring)
      float photonRing = exp(-pow((dist - 0.1) * 30.0, 2.0)) * 1.5;

      // Color palette
      vec3 hotColor = mix(
        vec3(0.13, 0.83, 0.93),  // Cyan (dark mode)
        vec3(0.88, 0.11, 0.28),  // Crimson (light mode)
        uTheme
      );
      vec3 warmColor = mix(
        vec3(0.98, 0.57, 0.24),  // Orange
        vec3(0.55, 0.15, 0.85),  // Purple (light mode)
        uTheme
      );

      // Compose the disk
      vec3 diskColor = mix(warmColor, hotColor, spiral);
      diskColor += hotColor * spiral2 * 0.3;
      diskColor *= diskMask;
      diskColor += hotColor * radialGlow * 0.6;
      diskColor += hotColor * photonRing;

      // Mouse influence - subtle warp
      float mouseDist = length(uv - uMouse * 0.1);
      diskColor += hotColor * exp(-mouseDist * 8.0) * 0.15;

      // Final alpha
      float alpha = diskMask * (spiral * 0.6 + 0.4) + radialGlow * 0.5 + photonRing;
      alpha *= horizon;
      alpha = clamp(alpha, 0.0, 1.0);

      gl_FragColor = vec4(diskColor, alpha * 0.85);
    }
  `,
};

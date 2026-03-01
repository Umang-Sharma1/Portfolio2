// ============================================================================
// NEBULA SHADER — Volumetric nebula with FBM noise, natural galaxy colors,
// mouse flashlight, theme-aware (dark = emission nebula, light = ethereal pastels)
// ============================================================================

export const NebulaShader = {
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: /* glsl */ `
    precision highp float;

    varying vec2 vUv;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec2 uResolution;
    uniform float uTheme;   // 0 = dark, 1 = light
    uniform float uReveal;  // 0‒1 Big Bang reveal
    uniform float uIntensity;

    // ── Simplex 3‑D Noise (Ashima Arts, MIT) ─────────────────────────────────
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
      const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);

      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);

      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;

      i = mod289(i);
      vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));

      float n_ = 0.142857142857;
      vec3  ns = n_ * D.wyz - D.xzx;

      vec4 j  = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);

      vec4 x = x_ * ns.x + ns.yyyy;
      vec4 y = y_ * ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);

      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);

      vec4 s0 = floor(b0) * 2.0 + 1.0;
      vec4 s1 = floor(b1) * 2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));

      vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);

      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    // ── Fractal Brownian Motion (5 octaves) ──────────────────────────────────
    float fbm(vec3 p) {
      float v = 0.0, a = 0.5, f = 1.0;
      for (int i = 0; i < 5; i++) {
        v += a * snoise(p * f);
        f *= 2.0;
        a *= 0.5;
      }
      return v;
    }

    // ─────────────────────────────────────────────────────────────────────────
    void main() {
      vec2 uv = vUv;
      vec2 c  = (uv - 0.5) * 2.0;                          // centred [‑1,1]
      float aspect = uResolution.x / max(uResolution.y, 1.0);
      c.x *= aspect;

      float t = uTime * 0.06;                               // slow drift

      // ── Cloud layers + domain warping ──
      float cloud1 = fbm(vec3(c * 1.5,              t      )) * 0.6 + 0.30;
      float cloud2 = fbm(vec3(c * 2.5 + 3.0,        t * 1.3)) * 0.5 + 0.25;
      float cloud3 = fbm(vec3(c * 0.8 - 5.0,        t * 0.7)) * 0.4 + 0.20;
      float warp   = fbm(vec3(c * 2.0,              t * 0.5));
      float wCloud = fbm(vec3(c * 1.2 + warp * 0.3, t * 0.9)) * 0.5 + 0.30;

      // ── Mouse flashlight ──
      vec2 mUv      = uMouse * vec2(aspect, 1.0);
      float mDist   = length(c - mUv);
      float flash   = smoothstep(1.4, 0.0, mDist) * 0.50;

      // ── Natural galaxy colour palette ──
      //   Dark mode — emission‑nebula tones
      vec3 dBase   = vec3(0.010, 0.010, 0.030);
      vec3 dCyan   = vec3(0.060, 0.450, 0.550);
      vec3 dBlue   = vec3(0.040, 0.100, 0.300);
      vec3 dPurple = vec3(0.200, 0.060, 0.320);
      vec3 dOrange = vec3(0.550, 0.220, 0.040);
      vec3 dPink   = vec3(0.400, 0.060, 0.180);

      //   Light mode — ethereal pastels
      vec3 lBase     = vec3(0.960, 0.970, 1.000);
      vec3 lBlue     = vec3(0.720, 0.820, 0.950);
      vec3 lIndigo   = vec3(0.620, 0.650, 0.900);
      vec3 lLavender = vec3(0.780, 0.700, 0.900);
      vec3 lRose     = vec3(0.920, 0.760, 0.820);
      vec3 lAmber    = vec3(0.960, 0.860, 0.720);

      // Theme‑interpolated palette
      vec3 base = mix(dBase,   lBase,     uTheme);
      vec3 c1   = mix(dCyan,   lBlue,     uTheme);
      vec3 c2   = mix(dBlue,   lIndigo,   uTheme);
      vec3 c3   = mix(dPurple, lLavender, uTheme);
      vec3 c4   = mix(dOrange, lAmber,    uTheme);
      vec3 c5   = mix(dPink,   lRose,     uTheme);

      // ── Compose nebula colour ──
      vec3 nebula = base;
      nebula = mix(nebula, c2, cloud1 * 0.65);
      nebula = mix(nebula, c3, cloud2 * 0.50);
      nebula = mix(nebula, c1, wCloud * 0.55);
      nebula = mix(nebula, c4, pow(cloud3, 2.0) * 0.40);
      nebula = mix(nebula, c5, pow(wCloud * cloud1, 1.5) * 0.30);

      // Flashlight reveals hidden fine detail
      float detail    = fbm(vec3(c * 4.0, t * 2.0)) * 0.5 + 0.5;
      vec3 flashColor = mix(c1, c4, detail);
      nebula = mix(nebula, flashColor, flash * 0.45);
      nebula += flashColor * flash * 0.12;

      // Vignette — darker at edges
      float vig = clamp(1.0 - length(c) * 0.30, 0.0, 1.0);

      // ── Final alpha ──
      float alpha = mix(
        (cloud1 * 0.40 + cloud2 * 0.30 + wCloud * 0.30) * vig * 0.60,   // dark
        (cloud1 * 0.20 + cloud2 * 0.15 + wCloud * 0.15) * vig * 0.30,   // light
        uTheme
      );
      alpha += flash * 0.18;
      alpha *= uReveal * uIntensity;

      gl_FragColor = vec4(nebula, clamp(alpha, 0.0, 0.82));
    }
  `,
};

// ============================================================================
// STAR SHADER — Per‑star twinkle via custom attributes (aSize, aPhase)
// ============================================================================

export const StarShader = {
  vertexShader: /* glsl */ `
    attribute float aSize;
    attribute float aPhase;
    uniform float uTime;
    varying float vAlpha;

    void main() {
      vec4 mv = modelViewMatrix * vec4(position, 1.0);

      // Per‑star twinkle
      float twinkle = sin(uTime * 1.5 + aPhase * 6.283185) * 0.30 + 0.70;
      vAlpha = twinkle;

      gl_PointSize = aSize * (200.0 / -mv.z) * twinkle;
      gl_Position  = projectionMatrix * mv;
    }
  `,

  fragmentShader: /* glsl */ `
    precision highp float;
    varying float vAlpha;
    uniform float uTheme;
    uniform float uReveal;

    void main() {
      // Soft circular point
      float d = length(gl_PointCoord - 0.5) * 2.0;
      float circle = 1.0 - smoothstep(0.0, 1.0, d);

      // Warm‑white in dark mode, subtle blue‑grey in light mode
      vec3 col = mix(vec3(0.95, 0.93, 0.88), vec3(0.50, 0.55, 0.65), uTheme);

      float a = circle * vAlpha * mix(0.75, 0.20, uTheme) * uReveal;
      gl_FragColor = vec4(col, a);
    }
  `,
};

'use client';

import { memo, useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { useTheme } from 'next-themes';

/**
 * PageStarfield — Interactive background for subpages.
 *
 * Dark mode:  Twinkling stars that shift with cursor (parallax).
 * Light mode: Floating luminous orbs with soft gradients + subtle grid.
 */

interface Props {
  density?: number;
  className?: string;
}

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
  layer: 'far' | 'mid' | 'near';
}

interface Orb {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
}

function generateStars(count: number): Star[] {
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    const layer: Star['layer'] = i < count * 0.5 ? 'far' : i < count * 0.8 ? 'mid' : 'near';
    const opacityMap = { far: 0.2, mid: 0.4, near: 0.7 };
    stars.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: layer === 'far' ? 0.8 : layer === 'mid' ? 1.4 : 2,
      delay: Math.random() * 6,
      duration: 3 + Math.random() * 4,
      opacity: opacityMap[layer],
      layer,
    });
  }
  return stars;
}

function generateOrbs(count: number): Orb[] {
  const colors = [
    'rgba(190,18,60,0.07)',
    'rgba(67,56,202,0.05)',
    'rgba(194,65,12,0.06)',
    'rgba(190,18,60,0.04)',
    'rgba(67,56,202,0.04)',
  ];
  const orbs: Orb[] = [];
  for (let i = 0; i < count; i++) {
    orbs.push({
      id: i,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      size: 120 + Math.random() * 280,
      color: colors[i % colors.length],
      delay: Math.random() * 8,
      duration: 15 + Math.random() * 20,
    });
  }
  return orbs;
}

const PARALLAX = { far: 0.01, mid: 0.025, near: 0.05 };

const PageStarfield = memo(function PageStarfield({ density = 60, className = '' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = mounted ? resolvedTheme === 'dark' : true;
  const rafRef = useRef<number>(0);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const starRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const orbRefs = useRef<(HTMLDivElement | null)[]>([]);
  const glowRef = useRef<HTMLDivElement>(null);

  const stars = useMemo(() => generateStars(density), [density]);
  const orbs = useMemo(() => generateOrbs(8), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    targetRef.current = {
      x: (e.clientX - cx) / cx,
      y: (e.clientY - cy) / cy,
    };
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Direct DOM updates instead of React state — no re-renders at 60fps
    const animate = () => {
      const cur = currentRef.current;
      const tgt = targetRef.current;
      cur.x += (tgt.x - cur.x) * 0.06;
      cur.y += (tgt.y - cur.y) * 0.06;

      if (isDark) {
        // Update star positions directly
        starRefs.current.forEach((el, i) => {
          if (!el) return;
          const star = stars[i];
          const px = PARALLAX[star.layer];
          el.style.transform = `translate(${cur.x * px * 100}px, ${cur.y * px * 100}px)`;
        });
        // Update glow
        if (glowRef.current) {
          glowRef.current.style.left = `calc(50% + ${cur.x * 30}px)`;
          glowRef.current.style.top = `calc(40% + ${cur.y * 30}px)`;
        }
      } else {
        // Light mode: parallax on inverted stars + orbs
        starRefs.current.forEach((el, i) => {
          if (!el) return;
          const star = stars[i];
          const px = PARALLAX[star.layer];
          el.style.transform = `translate(${cur.x * px * 100}px, ${cur.y * px * 100}px)`;
        });
        // Update orb positions directly
        orbRefs.current.forEach((el, i) => {
          if (!el) return;
          const shift = (i % 2 === 0 ? 1 : -1) * 15;
          el.style.transform = `translate(${cur.x * shift}px, ${cur.y * shift}px)`;
        });
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove, isDark, stars]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {isDark ? (
        <>
          {stars.map((star, i) => (
            <span
              key={star.id}
              ref={(el) => {
                starRefs.current[i] = el;
              }}
              className="absolute rounded-full animate-twinkle bg-white"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: star.opacity,
                animationDelay: `${star.delay}s`,
                animationDuration: `${star.duration}s`,
                willChange: 'transform',
              }}
            />
          ))}
          <div
            ref={glowRef}
            className="absolute w-[600px] h-[600px] rounded-full opacity-[0.04] blur-[120px]"
            style={{
              background: 'radial-gradient(circle, rgba(var(--glow-cyan),1) 0%, transparent 70%)',
              left: '50%',
              top: '40%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-rose-50/60 via-white to-stone-50/80" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(rgba(190,18,60,0.06) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(190,18,60,0.06) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
          {/* Glowing starfield — crimson + dark-navy dots with per-layer glow */}
          {stars.map((star, i) => {
            // ~18% of dots are dark navy accents for depth contrast
            const isNavy = star.id % 6 === 0;
            const sizeMap = { near: star.size * 2.0, mid: star.size * 1.4, far: star.size * 1.0 };
            const opacityMap = {
              near: isNavy ? 0.22 : 0.65,
              mid:  isNavy ? 0.13 : 0.40,
              far:  isNavy ? 0.07 : 0.22,
            };
            const color = isNavy ? '15,23,42' : '190,18,60';
            const glowMap = {
              near: `0 0 8px 1px rgba(${color},${isNavy ? 0.45 : 0.60})`,
              mid:  `0 0 5px rgba(${color},${isNavy ? 0.30 : 0.42})`,
              far:  `0 0 2px rgba(${color},${isNavy ? 0.18 : 0.26})`,
            };
            return (
              <span
                key={star.id}
                ref={(el) => { starRefs.current[i] = el; }}
                className="absolute rounded-full animate-twinkle"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width:  `${sizeMap[star.layer]}px`,
                  height: `${sizeMap[star.layer]}px`,
                  opacity: opacityMap[star.layer],
                  backgroundColor: `rgba(${color},1)`,
                  boxShadow: glowMap[star.layer],
                  animationDelay: `${star.delay}s`,
                  animationDuration: `${star.duration}s`,
                  willChange: 'transform',
                }}
              />
            );
          })}
          {orbs.map((orb, i) => (
            <div
              key={orb.id}
              ref={(el) => {
                orbRefs.current[i] = el;
              }}
              className="absolute rounded-full animate-float-slow"
              style={{
                left: `${orb.x}%`,
                top: `${orb.y}%`,
                width: `${orb.size}px`,
                height: `${orb.size}px`,
                background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
                animationDelay: `${orb.delay}s`,
                animationDuration: `${orb.duration}s`,
                willChange: 'transform',
                filter: 'blur(40px)',
              }}
            />
          ))}
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-vision-cyan/[0.04] blur-[100px]" />
          <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-vision-crimson/[0.04] blur-[100px]" />
        </>
      )}
    </div>
  );
});

export default PageStarfield;

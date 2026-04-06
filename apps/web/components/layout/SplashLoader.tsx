'use client';

import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// CONSTANTS
// ============================================================================

const BOOT_LINES = [
  '> Initializing Voyager-OS v2.5...',
  '> Loading stellar cartography...',
  '> Calibrating quantum renderer...',
  '> Compiling shader pipelines...',
  '> System ready.',
];

const BOOT_LINE_DELAY = 420; // ms between each line
const MIN_DISPLAY_MS = 2800; // minimum time the splash is shown
const STAR_COLORS = ['#00C8E8', '#FF6B2B', '#FF2A6D', '#A78BFA'];

// ============================================================================
// MINI STARFIELD (lightweight CSS particles)
// ============================================================================

const SplashStarfield = memo(function SplashStarfield() {
  const stars = useMemo(
    () =>
      Array.from({ length: 35 }, (_, i) => {
        const color = STAR_COLORS[i % STAR_COLORS.length];
        const size = Math.random() * 2 + 0.8;
        return {
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size,
          delay: Math.random() * 3,
          duration: Math.random() * 3 + 2,
          color,
        };
      }),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full animate-twinkle"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background: s.color,
            boxShadow: `0 0 ${s.size * 4}px ${s.color}80, 0 0 ${s.size * 8}px ${s.color}30`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
});

// ============================================================================
// ORBITAL RING (CSS-only rotating ring)
// ============================================================================

interface OrbitalRingProps {
  size: number;
  duration: number;
  delay?: number;
  color: string;
  thickness?: number;
  reverse?: boolean;
  tilt?: string;
}

const OrbitalRing = memo(function OrbitalRing({
  size,
  duration,
  delay = 0,
  color,
  thickness = 1,
  reverse = false,
  tilt = 'rotateX(70deg)',
}: OrbitalRingProps) {
  return (
    <motion.div
      className="absolute rounded-full border"
      style={{
        width: size,
        height: size,
        borderColor: color,
        borderWidth: thickness,
        transform: tilt,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: [0, 0.6, 0.3, 0.6],
        scale: 1,
        rotate: reverse ? -360 : 360,
      }}
      transition={{
        opacity: { duration: 2, ease: 'easeInOut', repeat: Infinity },
        scale: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
        rotate: { duration, ease: 'linear', repeat: Infinity },
      }}
    />
  );
});

// ============================================================================
// BOOT TEXT LINE
// ============================================================================

const BootLine = memo(function BootLine({
  text,
  index,
  isLast,
}: {
  text: string;
  index: number;
  isLast: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * BOOT_LINE_DELAY / 1000 }}
      className={`font-mono text-[10px] sm:text-xs tracking-wider ${
        isLast
          ? 'text-vision-cyan'
          : 'text-slate-400 dark:text-white/30'
      }`}
    >
      {text}
      {isLast && (
        <motion.span
          className="inline-block w-1.5 h-3 bg-vision-cyan ml-1 align-middle"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
});

// ============================================================================
// SPLASH LOADER
// ============================================================================

interface SplashLoaderProps {
  onComplete: () => void;
}

export const SplashLoader = memo(function SplashLoader({ onComplete }: SplashLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [exiting, setExiting] = useState(false);

  // Boot text sequence
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    BOOT_LINES.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setVisibleLines(i + 1);
        }, (i + 1) * BOOT_LINE_DELAY)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  // Progress bar — fills over MIN_DISPLAY_MS
  useEffect(() => {
    const start = Date.now();
    let raf: number;
    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / MIN_DISPLAY_MS, 1);
      // Ease-out curve for smooth fill
      setProgress(1 - Math.pow(1 - p, 3));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Exit after minimum display time
  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
    }, MIN_DISPLAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const handleExitComplete = useCallback(() => {
    if (exiting) onComplete();
  }, [exiting, onComplete]);

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {!exiting && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-stone-50 dark:bg-[#050505] overflow-hidden"
          exit={{
            opacity: 0,
            scale: 1.08,
            filter: 'blur(12px)',
          }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Starfield */}
          <SplashStarfield />

          {/* Ambient glow orbs */}
          <div className="absolute top-1/3 left-1/3 w-80 h-80 rounded-full bg-vision-cyan/[0.08] dark:bg-vision-cyan/[0.04] blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full bg-vision-crimson/[0.06] dark:bg-vision-crimson/[0.03] blur-[100px] pointer-events-none" />

          {/* Center content */}
          <div className="relative flex flex-col items-center gap-10">
            {/* Logo + Orbital rings */}
            <div className="relative flex items-center justify-center w-40 h-40 sm:w-48 sm:h-48">
              {/* Pulsing core glow */}
              <motion.div
                className="absolute w-20 h-20 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(0,200,232,0.25) 0%, transparent 70%)',
                }}
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{ duration: 2.5, ease: 'easeInOut', repeat: Infinity }}
              />

              {/* Orbital rings */}
              <OrbitalRing
                size={160}
                duration={8}
                color="rgba(0,200,232,0.25)"
                thickness={1}
                tilt="rotateX(72deg)"
              />
              <OrbitalRing
                size={130}
                duration={6}
                delay={0.2}
                color="rgba(255,42,109,0.18)"
                thickness={1}
                reverse
                tilt="rotateX(72deg) rotateZ(60deg)"
              />
              <OrbitalRing
                size={100}
                duration={10}
                delay={0.4}
                color="rgba(255,107,43,0.15)"
                thickness={1}
                tilt="rotateX(72deg) rotateZ(-30deg)"
              />

              {/* SVG Logo — animated path draw */}
              <motion.svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                className="relative z-10 text-vision-cyan"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {/* Left bracket < */}
                <motion.polyline
                  points="8 6 2 12 8 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
                {/* Right bracket > */}
                <motion.polyline
                  points="16 6 22 12 16 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
                {/* Slash / */}
                <motion.line
                  x1="14"
                  y1="4"
                  x2="10"
                  y2="20"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.5 }}
                  transition={{ duration: 0.8, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
                />
              </motion.svg>
            </div>

            {/* Brand text */}
            <motion.div
              className="text-center space-y-2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tighter text-slate-800 dark:text-white uppercase italic">
                Voyager <span className="text-vision-cyan">OS</span>
              </h1>
              <div className="text-[8px] font-mono font-black text-slate-400 dark:text-white/25 tracking-[0.5em] uppercase">
                Portfolio System // booting
              </div>
            </motion.div>

            {/* Boot text terminal */}
            <motion.div
              className="w-72 sm:w-80 space-y-1.5 px-4 py-3 rounded-xl bg-white/50 dark:bg-white/[0.03] border border-slate-200/50 dark:border-white/[0.06] backdrop-blur-sm"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
                <BootLine
                  key={i}
                  text={line}
                  index={0}
                  isLast={i === visibleLines - 1 && visibleLines < BOOT_LINES.length}
                />
              ))}
            </motion.div>

            {/* Progress bar */}
            <motion.div
              className="w-48 sm:w-56"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="h-[3px] w-full rounded-full bg-slate-200/60 dark:bg-white/[0.06] overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    width: `${progress * 100}%`,
                    background: 'linear-gradient(90deg, #00C8E8, #00F3FF, #A78BFA)',
                    boxShadow: '0 0 12px rgba(0,200,232,0.5), 0 0 24px rgba(0,200,232,0.2)',
                  }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[8px] font-mono font-bold text-slate-400 dark:text-white/20 tracking-[0.3em] uppercase">
                  Loading
                </span>
                <span className="text-[8px] font-mono font-bold text-vision-cyan tracking-wider tabular-nums">
                  {Math.round(progress * 100)}%
                </span>
              </div>
            </motion.div>
          </div>

          {/* Bottom HUD line */}
          <motion.div
            className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-slate-300 dark:to-white/10" />
            <span className="text-[7px] font-mono font-black text-slate-300 dark:text-white/15 tracking-[0.5em] uppercase">
              Orbital_Sector_09
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-slate-300 dark:to-white/10" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default SplashLoader;

'use client';

import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, memo, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { GET_PROJECTS } from '@/lib/graphql/queries';
import { ProjectModal, ProjectData } from '@/components/projects/project-modal';
import type { Project } from '@/lib/graphql/__generated__/schema';
import PageStarfield from '@/components/background/PageStarfield';

const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;
const MotionSpan = motion.span as any;

type CategoryType = 'All' | 'FRONTEND' | 'BACKEND' | 'DATABASE' | 'FULLSTACK';

// ============================================================================
// ICONS
// ============================================================================

const Icons = {
  ArrowLeft: ({ className }: { className?: string }) => (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  ),
  External: () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 22 3 22 10" />
      <line x1="10" x2="22" y1="14" y2="2" />
    </svg>
  ),
  Hex: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2l9 5v10l-9 5-9-5V7l9-5z" />
    </svg>
  ),
  Folder: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  ChevronRight: () => (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  ),
  Signal: () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 20h.01" />
      <path d="M7 20v-4" />
      <path d="M12 20v-8" />
      <path d="M17 20V8" />
    </svg>
  ),
  Rocket: () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  ),
  Database: () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  ),
};

// ============================================================================
// DATA MAPPING
// ============================================================================

function mapProjectToProjectData(project: Project): ProjectData {
  const p = project as any;
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: p.category,
    tagline: p.tagline,
    description: p.description,
    fullDescription: p.description,
    status: p.status.toLowerCase() as any,
    featured: p.featured,
    technologies: p.technologies,
    images: p.images,
    links: p.links,
    features: p.features,
    challenges: p.challenges,
    learnings: p.learnings,
    metrics: {
      lighthouse: { performance: 95, accessibility: 98, bestPractices: 100, seo: 92 },
      loadTime: '0.5s',
      uptime: '99.9%',
      responseTime: '15ms',
    },
    architecture: p.architecture,
  };
}

const categoryIcons: Record<string, React.ReactNode> = {
  FRONTEND: <Icons.Rocket />,
  BACKEND: <Icons.Signal />,
  DATABASE: <Icons.Database />,
  FULLSTACK: <Icons.Hex />,
};

// ============================================================================
// BACK BUTTON
// ============================================================================

const BackButton = memo(function BackButton() {
  return (
    <Link
      href="/"
      className={cn(
        'group relative inline-flex items-center gap-3 px-5 py-2.5 rounded-xl overflow-hidden',
        'text-[10px] font-mono font-black uppercase tracking-[0.3em]',
        'text-slate-500 dark:text-white/40 hover:text-vision-cyan',
        'backdrop-blur-md',
        'bg-white/60 dark:bg-white/[0.04]',
        'border border-slate-200/70 dark:border-white/[0.08]',
        'hover:border-vision-cyan/40 dark:hover:border-vision-cyan/30',
        'shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_2px_10px_rgba(0,0,0,0.06)]',
        'dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_0_16px_rgba(0,200,232,0.06)]',
        'hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_0_24px_rgba(0,200,232,0.15)]',
        'dark:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_28px_rgba(0,200,232,0.18)]',
        'transition-all duration-300'
      )}
    >
      {/* Corner brackets */}
      <span className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t border-l border-slate-300/50 dark:border-white/[0.08] group-hover:border-vision-cyan/50 transition-colors duration-300" />
      <span className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b border-r border-slate-300/50 dark:border-white/[0.08] group-hover:border-vision-cyan/50 transition-colors duration-300" />
      {/* Hover glow sweep */}
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none bg-gradient-to-r from-transparent via-vision-cyan/[0.08] to-transparent" />
      <Icons.ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1.5" />
      <span>Back to Core</span>
      <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-white/15 group-hover:bg-vision-cyan group-hover:shadow-[0_0_6px_rgba(0,200,232,0.7)] transition-all duration-300" />
    </Link>
  );
});

// ============================================================================
// SCRAMBLE TEXT — Letter-decode animation on viewport entry
// ============================================================================

const ScrambleText = memo(function ScrambleText({
  text,
  trigger,
  className,
  delay = 0,
}: {
  text: string;
  trigger: boolean;
  className?: string;
  delay?: number;
}) {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·■▲●/';
  const [display, setDisplay] = useState(text);
  const iterRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!trigger) return;
    iterRef.current = 0;
    timerRef.current = setTimeout(() => {
      const interval = setInterval(() => {
        iterRef.current += 0.45;
        setDisplay(
          text
            .split('')
            .map((char, i) => {
              if (i < iterRef.current) return char;
              if (char === ' ' || char === '/' || char === '.' || char === ':') return char;
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join(''),
        );
        if (iterRef.current >= text.length) clearInterval(interval);
      }, 38);
      return () => clearInterval(interval);
    }, delay);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [trigger, text, delay]);

  return <span className={className}>{display}</span>;
});

// ============================================================================
// ANIMATED STAT VALUE — Count-up with ease-out-quartic
// ============================================================================

const AnimatedStatValue = memo(function AnimatedStatValue({
  target,
  suffix = '',
  duration = 2200,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let startTime: number | null = null;
    let raf: number;
    function tick(now: number) {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
});

// ============================================================================
// HERO SECTION — Interactive Radar Console
// ============================================================================

const HeroSection = memo(
  ({ totalCount, activeCount }: { totalCount: number; activeCount: number }) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
    const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

    // Animated count (triggers on viewport entry)
    const [animTotal, setAnimTotal] = useState(0);
    const [animActive, setAnimActive] = useState(0);
    useEffect(() => {
      if (!isInView) return;
      let t = 0;
      const interval = setInterval(() => {
        t = Math.min(t + 1, totalCount);
        setAnimTotal(t);
        if (t >= totalCount) clearInterval(interval);
      }, 40);
      return () => clearInterval(interval);
    }, [totalCount, isInView]);
    useEffect(() => {
      if (!isInView) return;
      let a = 0;
      const interval = setInterval(() => {
        a = Math.min(a + 1, activeCount);
        setAnimActive(a);
        if (a >= activeCount) clearInterval(interval);
      }, 60);
      return () => clearInterval(interval);
    }, [activeCount, isInView]);

    // Typing effect
    const [typedCmd, setTypedCmd] = useState('');
    const cmdText = '> ls --all --projects --status=active';
    useEffect(() => {
      if (!isInView) return;
      let i = 0;
      const interval = setInterval(() => {
        setTypedCmd(cmdText.slice(0, i + 1));
        i++;
        if (i >= cmdText.length) clearInterval(interval);
      }, 40);
      return () => clearInterval(interval);
    }, [isInView]);

    // Radar sweep animation
    const radarAngle = useRef(0);
    const radarBeamRef = useRef<HTMLDivElement>(null);
    const radarConeRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      let raf: number;
      const animate = () => {
        radarAngle.current = (radarAngle.current + 2) % 360;
        if (radarBeamRef.current) {
          radarBeamRef.current.style.transform = `rotate(${radarAngle.current}deg)`;
        }
        if (radarConeRef.current) {
          radarConeRef.current.style.background = `conic-gradient(from ${radarAngle.current - 30}deg at 50% 50%, rgba(var(--glow-cyan),0.08), transparent 30deg)`;
        }
        raf = requestAnimationFrame(animate);
      };
      raf = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(raf);
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setGlowPos({ x: x * 100, y: y * 100 });
    }, []);

    return (
      <MotionDiv
        ref={sectionRef}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12"
      >
        <div
          ref={heroRef}
          onMouseMove={handleMouseMove}
          className="relative rounded-[2rem] overflow-hidden group/hero"
        >
          {/* ── Dark mode background — animated scan grid + ambient orbs ── */}
          <div className="absolute inset-0 z-0 hidden dark:block bg-space-black rounded-[2rem] overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(var(--glow-cyan),0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--glow-cyan),0.3) 1px, transparent 1px)',
                backgroundSize: '60px 60px',
              }}
            />
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-vision-cyan/[0.06] blur-[120px]" />
            <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-vision-crimson/[0.06] blur-[100px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-vision-orange/[0.03] blur-[150px]" />
            <div className="absolute inset-0 bg-gradient-to-b from-space-black/50 via-transparent to-space-black/70 pointer-events-none" />
            <div className="absolute inset-0 rounded-[2rem] border border-white/[0.06] pointer-events-none" />
          </div>

          {/* ── Light mode background — atmospheric gradient + dot grid ── */}
          <div
            className="absolute inset-0 z-0 dark:hidden rounded-[2rem] overflow-hidden"
            style={{
              background:
                'linear-gradient(145deg, #eff6ff 0%, #f8faff 30%, #f0fdff 62%, #fff7f0 100%)',
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'radial-gradient(rgba(0,180,220,0.18) 1.2px, transparent 1.2px)',
                backgroundSize: '26px 26px',
              }}
            />
            <div className="absolute -top-28 -right-28 w-[420px] h-[420px] rounded-full bg-vision-cyan/10 blur-[100px]" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-vision-crimson/[0.07] blur-[80px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[300px] rounded-full bg-vision-orange/[0.04] blur-[120px]" />
            <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-vision-cyan/40 to-transparent" />
            <div className="absolute inset-0 rounded-[2rem] border border-vision-cyan/12 pointer-events-none" />
            {/* Light mode twinkle stars */}
            {[
              { x: '7%',  y: '18%', s: 2,   d: 3.5, c: '#00C8E8' },
              { x: '88%', y: '14%', s: 2.5, d: 2.8, c: '#FF6B2B' },
              { x: '72%', y: '74%', s: 2,   d: 4.0, c: '#FF2A6D' },
              { x: '14%', y: '76%', s: 2.5, d: 3.2, c: '#00C8E8' },
              { x: '50%', y: '9%',  s: 2,   d: 4.5, c: '#FF6B2B' },
              { x: '33%', y: '85%', s: 2,   d: 3.0, c: '#00C8E8' },
              { x: '92%', y: '55%', s: 2.5, d: 2.5, c: '#FF2A6D' },
            ].map((p, i) => (
              <span
                key={i}
                className="absolute rounded-full animate-twinkle"
                style={{
                  left: p.x,
                  top: p.y,
                  width: `${p.s}px`,
                  height: `${p.s}px`,
                  background: p.c,
                  opacity: 0.55,
                  animationDuration: `${p.d}s`,
                  animationDelay: `${i * 0.4}s`,
                  boxShadow: `0 0 ${p.s * 4}px ${p.c}60, 0 0 ${p.s * 8}px ${p.c}25`,
                }}
              />
            ))}
          </div>

          {/* ── Mouse-following glow ── */}
          <div className="absolute inset-0 pointer-events-none z-[2]">
            <div
              className="absolute w-[500px] h-[500px] rounded-full opacity-0 group-hover/hero:opacity-100 transition-opacity duration-500"
              style={{
                background:
                  'radial-gradient(circle, rgba(var(--glow-cyan),0.1) 0%, transparent 60%)',
                left: `${glowPos.x}%`,
                top: `${glowPos.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          </div>

          <div className="relative z-10 p-8 md:p-10 lg:p-12">
            {/* ── Top bar: breadcrumb + status ── */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] text-text-light/40 dark:text-text-dark/30 uppercase"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-vision-cyan animate-pulse shadow-[0_0_8px_rgba(var(--glow-cyan),0.6)]" />
                <Link href="/" className="hover:text-vision-cyan transition-colors">
                  <ScrambleText text="SYS://ROOT" trigger={isInView} delay={200} />
                </Link>
                <Icons.ChevronRight />
                <span className="text-vision-cyan">
                  <ScrambleText text="PROJECT_ARCHIVES" trigger={isInView} delay={400} />
                </span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-1.5 text-[9px] font-mono tracking-[0.3em] text-text-light/30 dark:text-text-dark/20 uppercase"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                CONNECTED
              </motion.div>
            </div>

            {/* ── Main content row ── */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-10 mb-10">
              {/* Left: title + typing + description */}
              <div className="flex-1 space-y-5">
                {/* Title — char-stagger "PROJECT", letterSpacing-collapse "ARCHIVES" */}
                <div className="font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter uppercase italic overflow-visible pb-2">
                  <div
                    className="block text-text-light dark:text-text-dark"
                    aria-label="Project"
                  >
                    {'PROJECT'.split('').map((char, i) => (
                      <MotionSpan
                        key={i}
                        initial={{ opacity: 0, y: 56, filter: 'blur(16px)' }}
                        animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
                        transition={{
                          delay: 0.15 + i * 0.08,
                          duration: 0.7,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="inline-block"
                      >
                        {char}
                      </MotionSpan>
                    ))}
                  </div>
                  <MotionSpan
                    initial={{ opacity: 0, letterSpacing: '0.5em', filter: 'blur(28px)' }}
                    animate={
                      isInView
                        ? { opacity: 1, letterSpacing: '-0.02em', filter: 'blur(0px)' }
                        : {}
                    }
                    transition={{ delay: 0.9, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                    className="block text-transparent bg-clip-text bg-gradient-to-r from-vision-crimson via-vision-orange to-vision-cyan animate-gradient-x"
                    style={{ backgroundSize: '200% 100%' }}
                  >
                    ARCHIVES
                  </MotionSpan>
                </div>

                {/* Terminal typing line */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 1.5 }}
                  className="font-mono text-xs text-vision-cyan/50 dark:text-vision-cyan/70 flex items-center gap-1 h-5"
                >
                  <span>{typedCmd}</span>
                  <span className="inline-block w-[2px] h-3.5 bg-vision-cyan animate-pulse" />
                </motion.div>

                {/* Description — word-by-word blur fade */}
                <motion.p className="font-mono text-xs md:text-sm leading-relaxed text-text-light/50 dark:text-text-dark/40 max-w-xl">
                  {[
                    'Deployed',
                    'systems,',
                    'active',
                    'operations,',
                    'and',
                    'archived',
                    'projects',
                    '—',
                    'all',
                    'logged,',
                    'verified,',
                    'and',
                    'battle-tested.',
                  ].map((word, i) => (
                    <MotionSpan
                      key={i}
                      initial={{ opacity: 0, filter: 'blur(10px)', y: 10 }}
                      animate={isInView ? { opacity: 1, filter: 'blur(0px)', y: 0 } : {}}
                      transition={{ delay: 1.7 + i * 0.07, duration: 0.55, ease: 'easeOut' }}
                      className="inline-block mr-[0.27em]"
                    >
                      {word}
                    </MotionSpan>
                  ))}
                </motion.p>
              </div>

              {/* Right: Radar + glassmorphism stat chips */}
              <div className="shrink-0 flex flex-col items-center gap-6">
                {/* Mini radar — KEPT */}
                <div className="relative w-32 h-32 md:w-40 md:h-40 hidden sm:block">
                  {[1, 2, 3].map((ring) => (
                    <div
                      key={ring}
                      className="absolute rounded-full border border-vision-cyan/10 dark:border-vision-cyan/15"
                      style={{ inset: `${ring * 15}%` }}
                    />
                  ))}
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-vision-cyan/10" />
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-vision-cyan/10" />
                  <div
                    ref={radarBeamRef}
                    className="absolute top-1/2 left-1/2 w-1/2 h-0.5 origin-left"
                    style={{
                      background:
                        'linear-gradient(90deg, rgba(var(--glow-cyan),0.5), transparent)',
                    }}
                  />
                  <div ref={radarConeRef} className="absolute inset-0 rounded-full" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-vision-cyan shadow-[0_0_12px_rgba(var(--glow-cyan),0.8)]" />
                  {totalCount > 0 && (
                    <>
                      <div className="absolute top-[25%] left-[60%] h-1.5 w-1.5 rounded-full bg-vision-crimson shadow-[0_0_8px_rgba(var(--glow-crimson),0.7)] animate-pulse" />
                      <div
                        className="absolute top-[55%] left-[30%] h-1 w-1 rounded-full bg-vision-orange shadow-[0_0_6px_rgba(var(--glow-orange),0.7)] animate-pulse"
                        style={{ animationDelay: '0.5s' }}
                      />
                      <div
                        className="absolute top-[70%] left-[65%] h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399] animate-pulse"
                        style={{ animationDelay: '1s' }}
                      />
                    </>
                  )}
                </div>

                {/* Glassmorphism stat chips with data-stream fill */}
                <div className="flex items-center gap-3 flex-wrap justify-center">
                  {(
                    [
                      {
                        label: 'TOTAL',
                        value: animTotal,
                        dotClass: 'bg-sky-500 dark:bg-vision-cyan',
                        borderClass: 'border-white/70 dark:border-vision-cyan/25',
                        fillColor: 'rgba(0,200,232,0.10)',
                        textClass: 'text-sky-600 dark:text-vision-cyan',
                        shadow:
                          'inset 0 1px 0 rgba(255,255,255,0.8),inset 0 -1px 0 rgba(0,0,0,0.04),0 2px 12px rgba(0,0,0,0.07),0 0 16px rgba(0,200,232,0.08)',
                        darkShadow:
                          'inset 0 1px 0 rgba(255,255,255,0.06),0 0 20px rgba(0,200,232,0.12)',
                      },
                      {
                        label: 'ACTIVE',
                        value: animActive,
                        dotClass: 'bg-emerald-500 dark:bg-emerald-400',
                        borderClass: 'border-white/70 dark:border-emerald-500/25',
                        fillColor: 'rgba(52,211,153,0.10)',
                        textClass: 'text-emerald-600 dark:text-emerald-400',
                        shadow:
                          'inset 0 1px 0 rgba(255,255,255,0.8),inset 0 -1px 0 rgba(0,0,0,0.04),0 2px 12px rgba(0,0,0,0.07),0 0 16px rgba(52,211,153,0.08)',
                        darkShadow:
                          'inset 0 1px 0 rgba(255,255,255,0.06),0 0 20px rgba(52,211,153,0.12)',
                      },
                      {
                        label: 'UPTIME',
                        value: '99.9%',
                        dotClass: 'bg-orange-500 dark:bg-vision-orange',
                        borderClass: 'border-white/70 dark:border-vision-orange/25',
                        fillColor: 'rgba(255,107,43,0.10)',
                        textClass: 'text-orange-600 dark:text-vision-orange',
                        shadow:
                          'inset 0 1px 0 rgba(255,255,255,0.8),inset 0 -1px 0 rgba(0,0,0,0.04),0 2px 12px rgba(0,0,0,0.07),0 0 16px rgba(255,107,43,0.08)',
                        darkShadow:
                          'inset 0 1px 0 rgba(255,255,255,0.06),0 0 20px rgba(255,107,43,0.12)',
                      },
                    ] as const
                  ).map((stat, si) => (
                    <div
                      key={stat.label}
                      className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-full font-mono backdrop-blur-xl border bg-white/50 dark:bg-white/[0.06] ${stat.borderClass} overflow-hidden`}
                      style={{ boxShadow: stat.shadow }}
                    >
                      {/* Data-stream fill — left-to-right sweep on viewport entry */}
                      <MotionDiv
                        className="absolute inset-0 pointer-events-none"
                        initial={{ clipPath: 'inset(0 100% 0 0)' }}
                        animate={
                          isInView
                            ? { clipPath: 'inset(0 0% 0 0)' }
                            : { clipPath: 'inset(0 100% 0 0)' }
                        }
                        transition={{
                          delay: 0.6 + si * 0.18,
                          duration: 0.75,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        style={{
                          background: stat.fillColor,
                          borderRadius: '9999px',
                        }}
                      />
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${stat.dotClass} flex-shrink-0 animate-pulse shadow-[0_0_6px_currentColor] relative z-10`}
                      />
                      <span className="text-[7px] font-black uppercase tracking-[0.32em] text-slate-500 dark:text-white/30 relative z-10">
                        {stat.label}
                      </span>
                      <span className="h-2.5 w-px bg-slate-200/80 dark:bg-white/[0.12] relative z-10" />
                      <span
                        className={`text-[9px] font-black tabular-nums ${stat.textClass} relative z-10`}
                      >
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Bottom status bar ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-between pt-4 border-t border-stone-200/60 dark:border-white/[0.08]"
            >
              <div className="flex items-center gap-4 text-[9px] font-mono tracking-[0.3em] text-text-light/30 dark:text-text-dark/20 uppercase">
                <span className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ARCHIVE ONLINE
                </span>
                <span>CLEARANCE: ALPHA</span>
              </div>
              <div className="text-[9px] font-mono tracking-[0.3em] text-text-light/30 dark:text-text-dark/20 uppercase">
                SECTOR 7G — CLASSIFIED
              </div>
            </motion.div>
          </div>

          {/* HUD Corner brackets */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-vision-crimson/20 dark:border-vision-crimson/30 rounded-tl-lg pointer-events-none" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-vision-cyan/20 dark:border-vision-cyan/30 rounded-tr-lg pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-vision-cyan/20 dark:border-vision-cyan/30 rounded-bl-lg pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-vision-crimson/20 dark:border-vision-crimson/30 rounded-br-lg pointer-events-none" />
        </div>
      </MotionDiv>
    );
  }
);

// ============================================================================
// CATEGORY FILTERS
// ============================================================================

const CategoryFilters = memo(
  ({
    categories,
    selected,
    onSelect,
  }: {
    categories: CategoryType[];
    selected: CategoryType;
    onSelect: (cat: CategoryType) => void;
  }) => (
    <MotionDiv
      className="flex flex-wrap gap-2 mb-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
    >
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`
          relative px-5 py-2.5 font-mono text-[10px] tracking-[0.3em] uppercase border rounded-xl transition-all duration-300
          ${
            selected === cat
              ? 'border-vision-cyan/60 text-vision-cyan bg-vision-cyan/10 dark:bg-vision-cyan/[0.07] shadow-[0_0_20px_rgba(var(--glow-cyan),0.1)]'
              : 'border-stone-200/60 dark:border-white/[0.08] text-text-light/50 dark:text-text-dark/35 bg-white dark:bg-white/[0.02] hover:border-stone-300 dark:hover:border-white/15 hover:text-text-light/70 dark:hover:text-text-dark/50'
          }
        `}
        >
          <span className="flex items-center gap-2">
            {cat !== 'All' && <span className="opacity-60">{categoryIcons[cat]}</span>}
            {cat === 'All' ? 'ALL PROJECTS' : cat}
          </span>
          {selected === cat && (
            <MotionDiv
              layoutId="active-cat"
              className="absolute inset-0 rounded-xl border border-vision-cyan/40"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
        </button>
      ))}
    </MotionDiv>
  )
);

// ============================================================================
// PROJECT CARD — Border beam + inner glow
// ============================================================================

const ProjectCard = memo(
  ({
    project,
    idx,
    onSelect,
  }: {
    project: ProjectData;
    idx: number;
    onSelect: (p: ProjectData) => void;
  }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
      damping: 20,
      stiffness: 200,
    });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
      damping: 20,
      stiffness: 200,
    });

    const contentX = useSpring(useTransform(mouseX, [-0.5, 0.5], [15, -15]), {
      damping: 25,
      stiffness: 150,
    });
    const contentY = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), {
      damping: 25,
      stiffness: 150,
    });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
      mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    const statusColor =
      project.status === 'completed'
        ? 'bg-emerald-400'
        : project.status === 'in-progress'
          ? 'bg-vision-cyan'
          : 'bg-vision-orange';

    return (
      <MotionDiv
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="group/card relative"
        style={{ perspective: '2000px' }}
      >
        {/* Outer beam wrapper */}
        <MotionDiv
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY }}
          className="relative rounded-[2.5rem] transition-shadow duration-700 hover:shadow-[0_0_60px_rgba(var(--glow-cyan),0.2),_0_0_120px_rgba(var(--glow-cyan),0.08)]"
        >
          {/* Spinning conic-gradient border */}
          <div className="absolute -inset-[1px] rounded-[2.5rem] overflow-hidden opacity-0 group-hover/card:opacity-100 transition-opacity duration-500">
            <div
              className="absolute inset-0 animate-spin-slow"
              style={{
                background:
                  'conic-gradient(from 0deg, transparent 0%, rgba(var(--glow-cyan),1) 10%, transparent 20%, transparent 40%, rgba(var(--glow-crimson),1) 50%, transparent 60%, transparent 80%, rgba(var(--glow-orange),1) 90%, transparent 100%)',
              }}
            />
            <div className="absolute inset-[1.5px] rounded-[calc(1.25rem-1.5px)] bg-white dark:bg-space-black" />
          </div>

          {/* Traveling beam dots */}
          <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none">
            <div
              className="absolute h-[10px] w-[100px] animate-border-beam"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(var(--glow-cyan),1), transparent)',
                offsetPath: 'rect(0 100% 100% 0 round 20px)',
                boxShadow:
                  '0 0 40px 10px rgba(var(--glow-cyan),0.9), 0 0 80px 20px rgba(var(--glow-cyan),0.4)',
                filter: 'blur(0.3px)',
              }}
            />
            <div
              className="absolute h-[10px] w-[60px] animate-border-beam"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(var(--glow-crimson),1), transparent)',
                offsetPath: 'rect(0 100% 100% 0 round 20px)',
                animationDelay: '-1.5s',
                animationDuration: '4s',
                boxShadow:
                  '0 0 35px 8px rgba(var(--glow-crimson),0.8), 0 0 70px 16px rgba(var(--glow-crimson),0.35)',
                filter: 'blur(0.3px)',
              }}
            />
          </div>

          {/* Card body */}
          <div className="relative rounded-[2.5rem] flex flex-col overflow-hidden border-[1px] backdrop-blur-[40px] bg-white/95 dark:bg-space-black/90 border-slate-300/50 dark:border-white/10 transition-all duration-700 group-hover/card:border-transparent">
            {/* Lighting Edge Effect */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-vision-crimson/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-vision-cyan/50 to-transparent" />
            </div>

            {/* Dotted Background Effect */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.05] dark:opacity-[0.1]"
              style={{
                backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Ambient HUD Glow Blurs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000">
              <div className="absolute top-0 right-0 w-80 h-80 bg-vision-crimson/10 blur-[120px] translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-vision-cyan/10 blur-[120px] -translate-x-1/2 translate-y-1/2" />
            </div>

            {/* ── Image panel ── */}
            <div className="relative h-36 overflow-hidden border-b border-slate-200/60 dark:border-white/[0.05] shrink-0">
              {project.images?.thumbnail ? (
                <Image
                  src={project.images.thumbnail}
                  alt={project.title}
                  fill
                  className="object-cover transition-all duration-700 group-hover/card:scale-[1.04] group-hover/card:brightness-90"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-900 dark:to-space-black">
                  <div className="text-center space-y-1.5">
                    <div className="text-4xl font-mono font-black opacity-10 dark:opacity-[0.06] text-slate-900 dark:text-white">
                      ⬡
                    </div>
                    <div className="text-[9px] font-mono font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.5em]">
                      {project.category}
                    </div>
                  </div>
                </div>
              )}
              {/* Scanline overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(transparent_49%,rgba(0,0,0,0.04)_50%,transparent_51%)] bg-[size:100%_4px] pointer-events-none opacity-40 dark:opacity-70" />
              {/* Fade to card at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white dark:from-space-black to-transparent" />
              {/* Featured badge */}
              {project.featured && (
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-yellow-400/40 text-yellow-400 text-[8px] font-mono font-black uppercase tracking-widest">
                  ★ FEATURED
                </div>
              )}
            </div>

            {/* Parallax Content — all card content unified here */}
            <MotionDiv
              style={{ x: contentX, y: contentY }}
              className="relative z-10 flex flex-col p-6"
            >
              {/* Header: ID + category + hex icon */}
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-vision-crimson shadow-[0_0_10px_rgba(var(--glow-crimson),0.7)] animate-pulse" />
                    <span className="text-[10px] font-mono font-black text-vision-crimson uppercase tracking-[0.6em] drop-shadow-[0_0_8px_rgba(var(--glow-crimson),0.5)]">
                      #{String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-slate-400 dark:text-text-dark/30 uppercase tracking-[0.4em] italic">
                    {categoryIcons[project.category] && (
                      <span className="opacity-60 group-hover/card:opacity-100 group-hover/card:text-vision-cyan transition-all">
                        {categoryIcons[project.category]}
                      </span>
                    )}
                    {project.category}
                  </div>
                </div>
                <div className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-300 dark:text-text-dark/20 group-hover/card:text-vision-cyan border border-slate-200 dark:border-white/5 group-hover/card:border-vision-cyan/40 transition-all bg-white/20 dark:bg-black/40 backdrop-blur-sm">
                  <Icons.Hex />
                </div>
              </div>

              {/* Title + description */}
              <div className="space-y-2 mb-4">
                <h3 className="text-xl font-display font-black text-slate-900 dark:text-text-dark tracking-tighter uppercase italic group-hover/card:text-vision-cyan transition-colors duration-500 leading-tight">
                  {project.title}
                </h3>
                <p className="text-[12px] font-medium leading-relaxed text-slate-600 dark:text-text-dark/50 line-clamp-2">
                  {project.description}
                </p>
              </div>

              {/* Tech tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.technologies.slice(0, 4).map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 bg-slate-100 dark:bg-white/5 rounded-lg text-[8px] font-mono font-black text-slate-600 dark:text-text-dark/40 border border-slate-200 dark:border-white/5 group-hover/card:border-vision-cyan/30 transition-all uppercase tracking-tight"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Footer: status + action */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200/60 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-1.5 w-1.5 rounded-full ${statusColor} shadow-[0_0_10px_currentColor] animate-pulse`}
                  />
                  <span className="text-[10px] font-mono font-black tracking-[0.2em] text-slate-900 dark:text-text-dark uppercase">
                    {project.status}
                  </span>
                </div>
                <button
                  onClick={() => onSelect(project)}
                  className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-400 dark:text-text-dark/40 hover:text-white dark:hover:text-space-black hover:bg-vision-crimson dark:hover:bg-vision-cyan hover:scale-110 transition-all border border-slate-200 dark:border-white/5 bg-white/20 dark:bg-black/40 backdrop-blur-sm"
                >
                  <Icons.External />
                </button>
              </div>
            </MotionDiv>

            {/* Inner border accent */}
            <div className="absolute inset-[5px] rounded-[2.2rem] border border-vision-cyan/0 group-hover/card:border-vision-cyan/20 transition-all duration-700 pointer-events-none" />
          </div>
        </MotionDiv>
      </MotionDiv>
    );
  }
);

// ============================================================================
// LOADING SKELETON
// ============================================================================

const SkeletonCard = ({ i }: { i: number }) => (
  <MotionDiv
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.05, duration: 0.5 }}
    className="relative rounded-[2.5rem] overflow-hidden border border-slate-300/50 dark:border-white/10 bg-white/95 dark:bg-space-black/90"
  >
    {/* Image placeholder */}
    <div className="h-36 bg-stone-100 dark:bg-white/[0.04] animate-pulse border-b border-slate-200/60 dark:border-white/[0.05]" />
    <div className="p-6 flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="space-y-1.5">
          <div className="h-2 w-16 rounded bg-stone-200 dark:bg-white/[0.06] animate-pulse" />
          <div className="h-2 w-10 rounded bg-stone-200 dark:bg-white/[0.06] animate-pulse" />
        </div>
        <div className="h-9 w-9 rounded-xl bg-stone-200 dark:bg-white/[0.06] animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="h-5 w-3/4 rounded bg-stone-200 dark:bg-white/[0.06] animate-pulse" />
        <div className="h-3 w-full rounded bg-stone-100 dark:bg-white/[0.04] animate-pulse" />
        <div className="h-3 w-2/3 rounded bg-stone-100 dark:bg-white/[0.04] animate-pulse" />
      </div>
      <div className="flex gap-1.5">
        {[1, 2, 3].map((j) => (
          <div
            key={j}
            className="h-6 w-14 rounded-lg bg-stone-100 dark:bg-white/[0.04] animate-pulse"
          />
        ))}
      </div>
      <div className="pt-4 border-t border-stone-200/60 dark:border-white/[0.06] flex justify-between items-center">
        <div className="h-4 w-20 rounded bg-stone-200 dark:bg-white/[0.06] animate-pulse" />
        <div className="h-9 w-9 rounded-xl bg-stone-200 dark:bg-white/[0.06] animate-pulse" />
      </div>
    </div>
  </MotionDiv>
);

// ============================================================================
// PAGINATION
// ============================================================================

const Pagination = memo(
  ({
    pageInfo,
    page,
    onPrev,
    onNext,
  }: {
    pageInfo: any;
    page: number;
    onPrev: () => void;
    onNext: () => void;
  }) => {
    const current = pageInfo?.currentPage ?? page;
    const total = pageInfo?.totalPages ?? 1;
    const progress = total > 1 ? ((current - 1) / (total - 1)) * 100 : 100;

    return (
      <div className="flex flex-col items-center gap-5 mt-12">
        {/* Progress bar */}
        <div className="w-full max-w-xs h-0.5 rounded-full bg-stone-200/60 dark:bg-white/[0.06] overflow-hidden">
          <MotionDiv
            className="h-full rounded-full bg-gradient-to-r from-vision-crimson via-vision-orange to-vision-cyan"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ boxShadow: '0 0 12px rgba(var(--glow-cyan),0.4)' }}
          />
        </div>

        <div className="flex items-center gap-4">
          {/* Prev button */}
          <MotionButton
            onClick={onPrev}
            disabled={!pageInfo?.hasPreviousPage}
            className="group relative px-6 py-3 rounded-xl border border-stone-200/60 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] text-[10px] font-mono tracking-[0.3em] uppercase text-text-light/50 dark:text-text-dark/35 overflow-hidden disabled:opacity-20 disabled:cursor-not-allowed backdrop-blur-sm"
            whileHover={
              !pageInfo?.hasPreviousPage
                ? {}
                : { scale: 1.05, borderColor: 'rgba(var(--glow-cyan),0.4)' }
            }
            whileTap={!pageInfo?.hasPreviousPage ? {} : { scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <span className="relative z-10 flex items-center gap-2 group-hover:text-vision-cyan transition-colors">
              <MotionDiv
                className="inline-block"
                animate={!pageInfo?.hasPreviousPage ? {} : { x: [0, -3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                ←
              </MotionDiv>
              PREV
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-vision-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </MotionButton>

          {/* Page counter */}
          <MotionDiv
            className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl border border-stone-200/60 dark:border-white/[0.08] bg-stone-50 dark:bg-white/[0.04] backdrop-blur-sm overflow-hidden"
            key={current}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <span className="text-[10px] font-mono tracking-[0.3em] text-text-light/40 dark:text-text-dark/25 uppercase">
              PAGE
            </span>
            <span className="text-base font-mono font-black text-vision-cyan drop-shadow-[0_0_8px_rgba(var(--glow-cyan),0.4)]">
              {String(current).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-mono text-text-light/30 dark:text-text-dark/20">
              /
            </span>
            <span className="text-base font-mono font-black text-text-light/50 dark:text-text-dark/30">
              {String(total).padStart(2, '0')}
            </span>
            {/* Scanline effect */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_49%,rgba(var(--glow-cyan),0.03)_50%,transparent_51%)] bg-[size:100%_4px] pointer-events-none" />
          </MotionDiv>

          {/* Next button */}
          <MotionButton
            onClick={onNext}
            disabled={!pageInfo?.hasNextPage}
            className="group relative px-6 py-3 rounded-xl border border-stone-200/60 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] text-[10px] font-mono tracking-[0.3em] uppercase text-text-light/50 dark:text-text-dark/35 overflow-hidden disabled:opacity-20 disabled:cursor-not-allowed backdrop-blur-sm"
            whileHover={
              !pageInfo?.hasNextPage
                ? {}
                : { scale: 1.05, borderColor: 'rgba(var(--glow-cyan),0.4)' }
            }
            whileTap={!pageInfo?.hasNextPage ? {} : { scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <span className="relative z-10 flex items-center gap-2 group-hover:text-vision-cyan transition-colors">
              NEXT
              <MotionDiv
                className="inline-block"
                animate={!pageInfo?.hasNextPage ? {} : { x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                →
              </MotionDiv>
            </span>
            <div className="absolute inset-0 bg-gradient-to-l from-vision-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </MotionButton>
        </div>
      </div>
    );
  }
);

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function ProjectsPage() {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [skillFilter, setSkillFilter] = useState(() => searchParams.get('skill') ?? '');
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [page, setPage] = useState(1);
  const limit = 9;

  const categories: CategoryType[] = ['All', 'FRONTEND', 'BACKEND', 'DATABASE', 'FULLSTACK'];

  const { data, loading, error } = useQuery(GET_PROJECTS, {
    variables: {
      filter: selectedCategory !== 'All' ? { category: selectedCategory } : undefined,
      pagination: { page, limit },
    },
  });

  const projects =
    data?.projects?.edges?.map((edge: any) => mapProjectToProjectData(edge.node)) || [];
  const filteredProjects = skillFilter
    ? projects.filter((p: ProjectData) =>
        p.technologies?.some(
          (t: string) => t.toLowerCase() === skillFilter.toLowerCase()
        )
      )
    : projects;
  const pageInfo = data?.projects?.pageInfo;
  const totalCount = data?.projects?.totalCount ?? projects.length;

  useEffect(() => {
    setPage(1);
  }, [selectedCategory, skillFilter]);

  return (
    <main className="relative min-h-screen bg-stone-50 dark:bg-space-black text-text-light dark:text-text-dark overflow-hidden transition-colors duration-1000">
      <PageStarfield density={60} />
      {/* Grid overlay (dark mode only) */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_90%)] dark:opacity-100 opacity-0 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-6 pt-24 pb-20">
        {/* Back button */}
        <div className="mb-8">
          <BackButton />
        </div>

        {/* Command Console Hero */}
        <HeroSection
          totalCount={totalCount}
          activeCount={projects.filter((p: ProjectData) => p.status === 'in-progress').length}
        />

        {/* Category Filters */}
        <CategoryFilters
          categories={categories}
          selected={selectedCategory}
          onSelect={(cat) => { setSelectedCategory(cat); setSkillFilter(''); }}
        />

        {/* Active skill filter badge */}
        {skillFilter && (
          <MotionDiv
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-3 mb-6 flex-wrap"
          >
            <span className="text-[9px] font-mono tracking-[0.3em] text-text-light/40 dark:text-text-dark/30 uppercase">
              Filtered by:
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-vision-cyan/30 bg-vision-cyan/5 text-[9px] font-mono font-bold text-vision-cyan uppercase tracking-widest">
              {skillFilter}
              <button
                onClick={() => setSkillFilter('')}
                className="ml-1 text-vision-cyan/60 hover:text-vision-cyan transition-colors leading-none"
                aria-label="Clear skill filter"
              >
                ×
              </button>
            </span>
            <span className="text-[9px] font-mono text-text-light/30 dark:text-text-dark/20">
              {filteredProjects.length} result{filteredProjects.length !== 1 ? 's' : ''}
            </span>
          </MotionDiv>
        )}

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} i={i} />
            ))}
          </div>
        ) : error ? (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 rounded-2xl border border-stone-200/60 dark:border-white/[0.06] bg-white dark:bg-white/[0.02]"
          >
            <p className="text-sm font-mono text-text-light/50 dark:text-text-dark/30">
              ⚠ Error loading project logs. Retry connection.
            </p>
          </MotionDiv>
        ) : filteredProjects.length === 0 ? (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 rounded-2xl border border-stone-200/60 dark:border-white/[0.06] bg-white dark:bg-white/[0.02]"
          >
            <p className="text-sm font-mono text-text-light/50 dark:text-text-dark/30">
              {skillFilter
                ? `No projects found using ${skillFilter}.`
                : 'No projects found in this category.'}
            </p>
          </MotionDiv>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project: ProjectData, index: number) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.04 }}
                >
                  <ProjectCard project={project} idx={index} onSelect={setSelectedProject} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Status Bar */}
        <MotionDiv
          className="flex items-center justify-between py-4 px-5 rounded-xl border border-stone-200/60 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] font-mono text-[9px] tracking-[0.2em] text-text-light/40 dark:text-text-dark/25 uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <span className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            ARCHIVE_SYNC: 100%
          </span>
          <span>TOTAL_NODES: {totalCount}</span>
          <span className="text-vision-cyan font-bold">SIGNAL: STABLE_SECURE</span>
        </MotionDiv>

        {/* Pagination */}
        <Pagination
          pageInfo={pageInfo}
          page={page}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => p + 1)}
        />

        {/* ── Footer Stats Panel ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-16"
        >
          {/* Outer atmosphere — glow orbs + scattered stars */}
          <div className="absolute -inset-8 pointer-events-none overflow-hidden" aria-hidden>
            <div className="absolute -top-20 left-[15%] w-72 h-72 rounded-full bg-vision-cyan/[0.10] dark:bg-vision-cyan/[0.06] blur-[100px]" />
            <div className="absolute -bottom-16 right-[20%] w-64 h-64 rounded-full bg-vision-crimson/[0.08] dark:bg-vision-crimson/[0.04] blur-[90px]" />
            <div className="absolute top-1/3 right-[5%] w-48 h-48 rounded-full bg-vision-orange/[0.07] dark:bg-vision-orange/[0.03] blur-[80px]" />
            {[
              { x: '2%',  y: '8%',  s: 2.5, d: 3.2, c: '#00C8E8' },
              { x: '8%',  y: '85%', s: 2,   d: 4.1, c: '#FF2A6D' },
              { x: '95%', y: '12%', s: 3,   d: 2.8, c: '#FF6B2B' },
              { x: '92%', y: '88%', s: 2,   d: 3.6, c: '#00C8E8' },
              { x: '50%', y: '2%',  s: 2.5, d: 4.5, c: '#FF2A6D' },
              { x: '50%', y: '96%', s: 2,   d: 3.0, c: '#FF6B2B' },
              { x: '18%', y: '95%', s: 3,   d: 2.4, c: '#00C8E8' },
              { x: '80%', y: '5%',  s: 2,   d: 3.9, c: '#FF2A6D' },
            ].map((p, i) => (
              <span
                key={i}
                className="absolute rounded-full animate-twinkle"
                style={{
                  left: p.x, top: p.y,
                  width: `${p.s}px`, height: `${p.s}px`,
                  background: p.c,
                  animationDuration: `${p.d}s`,
                  animationDelay: `${i * 0.35}s`,
                  boxShadow: `0 0 ${p.s * 5}px ${p.c}80, 0 0 ${p.s * 10}px ${p.c}30`,
                }}
              />
            ))}
          </div>

          {/* Section label */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />
            <span className="text-[8px] font-mono font-black text-slate-300 dark:text-white/20 uppercase tracking-[0.6em] shrink-0">
              Project_Overview // compiled
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-slate-200 dark:via-white/10 to-transparent" />
          </div>

          {/* Stats panel */}
          <div className="relative rounded-[2rem] overflow-hidden border border-slate-200/80 dark:border-white/[0.07]">
            {/* Background layers */}
            <div className="absolute inset-0 bg-white dark:bg-space-black/95 backdrop-blur-sm" />
            {/* Grid texture */}
            <div
              className="absolute inset-0 opacity-[0.04] dark:opacity-[0.025]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(var(--glow-cyan),0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--glow-cyan),0.5) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />
            {/* Edge glows */}
            <div className="absolute top-0 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-vision-cyan/50 to-transparent" />
            <div className="absolute bottom-0 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-vision-crimson/30 to-transparent" />
            {/* Ambient orbs */}
            <div className="absolute -top-24 left-1/4 w-80 h-80 rounded-full bg-vision-cyan/[0.12] dark:bg-vision-cyan/[0.05] blur-[90px] pointer-events-none" />
            <div className="absolute -bottom-24 right-1/4 w-80 h-80 rounded-full bg-vision-crimson/[0.10] dark:bg-vision-crimson/[0.04] blur-[90px] pointer-events-none" />
            {/* Starry particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
              {[
                { x: '6%',  y: '15%', s: 3,   d: 2.5, c: '#00C8E8' },
                { x: '15%', y: '55%', s: 2.5, d: 3.8, c: '#FF6B2B' },
                { x: '22%', y: '80%', s: 2,   d: 2.8, c: '#FF2A6D' },
                { x: '30%', y: '28%', s: 3.5, d: 4.0, c: '#00C8E8' },
                { x: '38%', y: '68%', s: 2,   d: 3.2, c: '#FF6B2B' },
                { x: '45%', y: '12%', s: 3,   d: 2.2, c: '#FF2A6D' },
                { x: '52%', y: '85%', s: 2.5, d: 4.5, c: '#00C8E8' },
                { x: '60%', y: '35%', s: 3,   d: 3.0, c: '#FF6B2B' },
                { x: '68%', y: '72%', s: 2,   d: 3.5, c: '#00C8E8' },
                { x: '75%', y: '20%', s: 3.5, d: 2.6, c: '#FF2A6D' },
                { x: '82%', y: '58%', s: 2.5, d: 4.2, c: '#FF6B2B' },
                { x: '90%', y: '40%', s: 3,   d: 3.0, c: '#00C8E8' },
              ].map((p, i) => (
                <span
                  key={i}
                  className="absolute rounded-full animate-twinkle"
                  style={{
                    left: p.x, top: p.y,
                    width: `${p.s}px`, height: `${p.s}px`,
                    background: p.c,
                    animationDuration: `${p.d}s`,
                    animationDelay: `${i * 0.22}s`,
                    boxShadow: `0 0 ${p.s * 4}px ${p.c}90, 0 0 ${p.s * 8}px ${p.c}40`,
                  }}
                />
              ))}
            </div>

            {/* Top bar */}
            <div className="relative z-10 flex items-center justify-between px-6 py-3 border-b border-slate-100/80 dark:border-white/[0.05]">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
                <span className="text-[8px] font-mono font-black text-slate-400 dark:text-white/25 uppercase tracking-[0.4em]">
                  system_metrics :: live
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-vision-cyan/60 animate-pulse" />
                <span className="text-[8px] font-mono text-slate-300 dark:text-white/15 uppercase tracking-[0.3em]">
                  last_sync:{' '}
                  {new Date()
                    .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    .toUpperCase()}
                </span>
              </div>
            </div>

            {/* Stats grid */}
            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-slate-100/70 dark:bg-white/[0.04]">
              {(
                [
                  {
                    num: totalCount,
                    suffix: '',
                    label: 'Total Deployed',
                    sub: 'all projects',
                    hex: '#00F3FF',
                    icon: '◈',
                  },
                  {
                    num: projects.filter((p: ProjectData) => p.featured).length,
                    suffix: '',
                    label: 'Featured Ops',
                    sub: 'highlighted builds',
                    hex: '#FF6B2B',
                    icon: '◉',
                  },
                  {
                    num: 4,
                    suffix: '',
                    label: 'Categories',
                    sub: 'active domains',
                    hex: '#FF2A6D',
                    icon: '⬡',
                  },
                  {
                    num: [...new Set(projects.flatMap((p: ProjectData) => p.technologies))].length,
                    suffix: '+',
                    label: 'Tech Stack',
                    sub: 'unique technologies',
                    hex: '#00F3FF',
                    icon: '▣',
                  },
                ] as Array<{
                  num: number;
                  suffix: string;
                  label: string;
                  sub: string;
                  hex: string;
                  icon: string;
                }>
              ).map((stat) => (
                <div
                  key={stat.label}
                  className="group relative flex flex-col items-center justify-center gap-3 p-8 bg-white dark:bg-[#07090f] overflow-hidden transition-all duration-300"
                >
                  {/* Top accent bar */}
                  <span
                    className="absolute top-0 inset-x-0 h-[2px] pointer-events-none"
                    style={{
                      background: `linear-gradient(to right, transparent 8%, ${stat.hex}65 38%, ${stat.hex}90 50%, ${stat.hex}65 62%, transparent 92%)`,
                    }}
                  />
                  {/* Hover ambient */}
                  <span
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse 90% 55% at 50% 0%, ${stat.hex}14 0%, transparent 70%)`,
                    }}
                  />
                  {/* Corner brackets on hover */}
                  <span
                    className="absolute top-3 left-3 w-3.5 h-3.5 border-t-2 border-l-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    style={{ borderColor: `${stat.hex}80` }}
                  />
                  <span
                    className="absolute bottom-3 right-3 w-3.5 h-3.5 border-b-2 border-r-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    style={{ borderColor: `${stat.hex}80` }}
                  />
                  {/* Icon jewel */}
                  <span
                    className="flex items-center justify-center w-10 h-10 rounded-xl text-lg border mb-1 transition-all duration-300 group-hover:scale-110"
                    style={{
                      color: stat.hex,
                      borderColor: `${stat.hex}30`,
                      background: `radial-gradient(circle at 38% 28%, ${stat.hex}22 0%, ${stat.hex}09 100%)`,
                      boxShadow: `inset 0 1px 0 rgba(255,255,255,0.75), 0 0 22px ${stat.hex}20`,
                      textShadow: `0 0 14px ${stat.hex}90`,
                    }}
                  >
                    {stat.icon}
                  </span>
                  {/* Animated count-up */}
                  <p
                    className="text-4xl sm:text-5xl font-display font-black tracking-tighter leading-none"
                    style={{
                      color: stat.hex,
                      textShadow: `0 0 28px ${stat.hex}44, 0 0 52px ${stat.hex}18`,
                    }}
                  >
                    <AnimatedStatValue target={stat.num} suffix={stat.suffix} />
                  </p>
                  {/* Labels */}
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-[11px] font-display font-black uppercase tracking-[0.18em] text-slate-700 dark:text-white/70">
                      {stat.label}
                    </p>
                    <p className="text-[8px] font-mono font-bold uppercase tracking-[0.3em] text-slate-400 dark:text-white/25">
                      {stat.sub}
                    </p>
                  </div>
                  {/* Animated underline sweep */}
                  <span
                    className="absolute bottom-0 left-1/2 w-0 group-hover:w-3/5 h-px transition-all duration-500 -translate-x-1/2"
                    style={{
                      background: `linear-gradient(to right, transparent, ${stat.hex}70, transparent)`,
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Bottom bar */}
            <div className="relative z-10 flex items-center justify-center gap-6 px-6 py-3 border-t border-slate-100/80 dark:border-white/[0.05]">
              {[
                { label: 'Production: LIVE', dot: 'bg-emerald-400', color: 'text-emerald-500' },
                { label: 'Uptime: 99.9%', dot: 'bg-sky-400', color: 'text-sky-400' },
                { label: 'Signal: STABLE', dot: 'bg-vision-orange', color: 'text-orange-400' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <div className={`h-1.5 w-1.5 rounded-full ${item.dot}`} />
                  <span
                    className={`text-[8px] font-mono font-black uppercase tracking-[0.25em] ${item.color}`}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>


      </div>

      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </main>
  );
}

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { useState, useEffect, memo, useCallback } from 'react';
import { ArrowDown, Download, Briefcase } from 'lucide-react';

// ============================================================================
// CONSTANTS
// ============================================================================

const TYPEWRITER_STRINGS = [
  'Building scalable MERN applications',
  'Crafting elegant user experiences',
  'Creating performant web solutions',
  'Developing full-stack applications',
];

const TYPING_SPEED = 90;
const DELETE_SPEED = 45;
const PAUSE_MS = 2200;

// ============================================================================
// DYNAMIC IMPORTS
// ============================================================================

const Hero3DScene = dynamic(() => import('@/components/home/Hero3DScene'), {
  ssr: false,
  loading: () => <LoadingFallback />,
});

// ============================================================================
// LOADING FALLBACK
// ============================================================================

function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative">
        <div className="h-20 w-20 rounded-full border-2 border-vision-cyan/20 border-t-vision-cyan animate-spin" />
        <div
          className="absolute inset-0 h-20 w-20 rounded-full border-2 border-vision-orange/20 border-b-vision-orange animate-spin"
          style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
        />
        <div className="absolute inset-[25%] rounded-full bg-vision-cyan/5 animate-pulse" />
      </div>
    </div>
  );
}

// ============================================================================
// HOOKS
// ============================================================================

function useDeviceType() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return isDesktop;
}

function useTypewriter(strings: string[], typeSpeed: number, deleteSpeed: number, pause: number) {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const current = strings[idx % strings.length];

    const timer = setTimeout(
      () => {
        if (!isDeleting) {
          setText(current.substring(0, text.length + 1));
          if (text.length + 1 === current.length) {
            setTimeout(() => setIsDeleting(true), pause);
          }
        } else {
          setText(current.substring(0, text.length - 1));
          if (text.length - 1 === 0) {
            setIsDeleting(false);
            setIdx((i) => i + 1);
          }
        }
      },
      isDeleting ? deleteSpeed : typeSpeed,
    );

    return () => clearTimeout(timer);
  }, [text, isDeleting, idx, strings, typeSpeed, deleteSpeed, pause]);

  return text;
}

// ============================================================================
// MOBILE 2D BACKGROUND
// ============================================================================

const BADGES = [
  { name: 'React', color: '#61DAFB', delay: 0, x: '12%', y: '15%' },
  { name: 'Node.js', color: '#68A063', delay: 0.2, x: '78%', y: '22%' },
  { name: 'MongoDB', color: '#4DB33D', delay: 0.4, x: '18%', y: '68%' },
  { name: 'TypeScript', color: '#3178C6', delay: 0.6, x: '75%', y: '72%' },
  { name: 'GraphQL', color: '#E10098', delay: 0.8, x: '50%', y: '8%' },
  { name: 'Express', color: '#888888', delay: 1.0, x: '8%', y: '42%' },
  { name: 'Next.js', color: '#999999', delay: 1.2, x: '88%', y: '48%' },
];

const FloatingBadge = memo(function FloatingBadge({
  badge,
}: {
  badge: (typeof BADGES)[number];
}) {
  return (
    <motion.div
      className="absolute px-3 py-1.5 rounded-xl backdrop-blur-md bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 shadow-lg"
      style={{ left: badge.x, top: badge.y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0.35, 0.75, 0.35],
        scale: [0.92, 1.08, 0.92],
        y: [0, -12, 0],
        rotate: [-3, 3, -3],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        delay: badge.delay,
        ease: 'easeInOut',
      }}
    >
      <span
        className="text-xs font-mono font-bold drop-shadow-md"
        style={{ color: badge.color === '#888888' || badge.color === '#999999' ? 'currentColor' : badge.color }}
      >
        {badge.name}
      </span>
    </motion.div>
  );
});

const Mobile2DBackground = memo(function Mobile2DBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated radial gradients */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(34,211,238,0.12) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(251,146,60,0.12) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 80%, rgba(168,85,247,0.12) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(34,211,238,0.12) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.04)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />

      {/* Floating badges */}
      {BADGES.map((b) => (
        <FloatingBadge key={b.name} badge={b} />
      ))}
    </div>
  );
});

// ============================================================================
// STAGGER ANIMATION VARIANTS
// ============================================================================

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

// ============================================================================
// HERO COMPONENT
// ============================================================================

export default function Hero() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDesktop = useDeviceType();
  const typewriterText = useTypewriter(TYPEWRITER_STRINGS, TYPING_SPEED, DELETE_SPEED, PAUSE_MS);

  useEffect(() => setMounted(true), []);

  // ---- SSR / loading skeleton ----
  if (!mounted) {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-space-black">
        <LoadingFallback />
      </section>
    );
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-space-black transition-colors duration-700">
      {/* ── Background ── */}
      <div className="absolute inset-0 z-0">
        {isDesktop ? <Hero3DScene isLight={theme === 'light'} /> : <Mobile2DBackground />}
      </div>

      {/* ── Gradient overlays ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 dark:via-space-black/50 to-white dark:to-space-black pointer-events-none z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-t from-white/70 dark:from-space-black/70 via-transparent to-transparent pointer-events-none z-[1]" />

      {/* ── Content ── */}
      <motion.div
        className="relative z-10 container mx-auto px-6 py-24 text-center max-w-5xl"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Status badge */}
        <motion.div variants={item} className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-vision-cyan/25 shadow-lg shadow-vision-cyan/5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-vision-cyan opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-vision-cyan" />
            </span>
            <span className="text-sm font-mono font-semibold text-text-light/80 dark:text-text-dark/80 tracking-wide">
              Available for opportunities
            </span>
          </div>
        </motion.div>

        {/* ── Main heading ── */}
        <motion.div variants={item} className="space-y-5 mb-8">
          <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] tracking-tight text-text-light dark:text-text-dark leading-[1.08]">
            Hi, I&apos;m{' '}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-vision-cyan via-vision-orange to-vision-crimson bg-[length:200%_auto] animate-gradient-x">
                Umang Sharma
              </span>
              {/* Glow behind name */}
              <motion.span
                className="absolute -inset-2 bg-gradient-to-r from-vision-cyan/20 via-vision-orange/15 to-vision-crimson/20 blur-3xl -z-10 rounded-full"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
            </span>
          </h1>

          {/* Subtitle */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-base sm:text-lg md:text-xl font-medium text-text-light/80 dark:text-text-dark/70"
            variants={item}
          >
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-vision-cyan flex-shrink-0" />
              <span>Software Engineer @ MAQ Software</span>
            </div>
            <span className="hidden sm:inline text-text-light/20 dark:text-text-dark/20">|</span>
            <span className="text-text-light/60 dark:text-text-dark/50">Class of 2025</span>
          </motion.div>
        </motion.div>

        {/* ── Typewriter ── */}
        <motion.div variants={item} className="mb-12 flex justify-center">
          <div className="relative px-6 py-3 rounded-2xl backdrop-blur-md bg-vision-cyan/[0.07] border border-vision-cyan/15 max-w-xl">
            {/* Faint scan line */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none opacity-30">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-vision-cyan to-transparent absolute top-0 animate-scan" />
            </div>

            <p className="text-lg md:text-xl font-mono font-medium text-vision-cyan min-h-[1.75rem]">
              {typewriterText}
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="ml-0.5 text-vision-cyan"
              >
                ▎
              </motion.span>
            </p>
          </div>
        </motion.div>

        {/* ── CTA Buttons ── */}
        <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          {/* Primary */}
          <motion.a
            href="#projects"
            className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full font-bold text-base overflow-hidden min-w-[200px] bg-gradient-to-r from-vision-cyan to-blue-500 text-white shadow-lg shadow-vision-cyan/25 hover:shadow-vision-cyan/40 transition-shadow"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <Briefcase className="w-5 h-5 relative z-10" />
            <span className="relative z-10">View My Work</span>
            {/* Hover gradient sweep */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-vision-orange to-vision-crimson"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.a>

          {/* Secondary */}
          <motion.a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full font-bold text-base overflow-hidden min-w-[200px] backdrop-blur-xl bg-white/[0.08] dark:bg-white/[0.04] border border-vision-cyan/30 text-vision-cyan hover:bg-vision-cyan/10 transition-all"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <Download className="w-5 h-5" />
            <span>Download Resume</span>
          </motion.a>
        </motion.div>

        {/* ── Stats ── */}
        <motion.div
          variants={item}
          className="flex flex-wrap items-center justify-center gap-10 md:gap-16"
        >
          {[
            { value: '3+', label: 'Years Experience' },
            { value: '50+', label: 'Projects Completed' },
            { value: '100%', label: 'Client Satisfaction' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center group"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + i * 0.12 }}
            >
              <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-vision-cyan to-vision-orange group-hover:from-vision-orange group-hover:to-vision-crimson transition-all duration-500">
                {stat.value}
              </div>
              <div className="text-[11px] md:text-xs font-mono text-text-light/50 dark:text-text-dark/40 mt-1.5 tracking-wider uppercase">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Scroll indicator ── */}
      <motion.button
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 group cursor-pointer"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
        aria-label="Scroll down"
      >
        <div className="flex flex-col items-center gap-2 text-text-light/40 dark:text-text-dark/30 group-hover:text-vision-cyan transition-colors duration-300">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-current flex items-start justify-center p-1.5">
            <motion.div
              className="w-1 h-1 rounded-full bg-current"
              animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
          </div>
        </div>
      </motion.button>

      {/* ── Decorative corner circles ── */}
      <div className="absolute top-24 left-8 w-16 h-16 border border-vision-cyan/[0.08] rounded-full pointer-events-none" />
      <div className="absolute bottom-24 right-8 w-24 h-24 border border-vision-orange/[0.08] rounded-full pointer-events-none" />
    </section>
  );
}

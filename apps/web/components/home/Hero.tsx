'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useMemo, memo } from 'react';
import dynamic from 'next/dynamic';
import { Download, Briefcase } from 'lucide-react';

const GalaxyBackground = dynamic(
  () => import('@/components/background/GalaxyBackground').then((mod) => mod.GalaxyBackground),
  { ssr: false }
);

// ============================================================================
// CONSTANTS
// ============================================================================

const TYPEWRITER_STRINGS = [
  'Building scalable MERN applications',
  'Crafting elegant user experiences',
  'Creating performant web solutions',
  'Developing full-stack systems',
];

const TYPING_SPEED = 85;
const DELETE_SPEED = 40;
const PAUSE_MS = 2400;
const STAR_COUNT = 80;

// ============================================================================
// HOOKS
// ============================================================================

function useScrambleText(target: string, active: boolean, duration = 1200) {
  const [text, setText] = useState('');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';

  useEffect(() => {
    if (!active) {
      setText('');
      return;
    }

    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / duration, 1);

      let result = '';
      for (let i = 0; i < target.length; i++) {
        const charP = (p * target.length - i) / 1.5;
        if (target[i] === ' ') result += ' ';
        else if (charP > 1) result += target[i];
        else if (charP > 0) result += chars[Math.floor(Math.random() * chars.length)];
      }

      setText(result);
      if (p >= 1) {
        setText(target);
        clearInterval(interval);
      }
    }, 35);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, target, duration]);

  return text;
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
          if (text.length + 1 === current.length) setTimeout(() => setIsDeleting(true), pause);
        } else {
          setText(current.substring(0, text.length - 1));
          if (text.length - 1 === 0) {
            setIsDeleting(false);
            setIdx((i) => i + 1);
          }
        }
      },
      isDeleting ? deleteSpeed : typeSpeed
    );

    return () => clearTimeout(timer);
  }, [text, isDeleting, idx, strings, typeSpeed, deleteSpeed, pause]);

  return text;
}

// ============================================================================
// STARFIELD — lightweight CSS dots with twinkle (same approach as Footer)
// ============================================================================

const Starfield = memo(function Starfield() {
  const stars = useMemo(
    () =>
      Array.from({ length: STAR_COUNT }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 1.5 + 0.5,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 2,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-slate-400 dark:bg-white animate-twinkle"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            opacity: 0,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
});

// ============================================================================
// STAGGER VARIANTS
// ============================================================================

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

// ============================================================================
// HERO
// ============================================================================

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const scrambledName = useScrambleText('Umang Sharma', mounted, 1400);
  const typewriterText = useTypewriter(TYPEWRITER_STRINGS, TYPING_SPEED, DELETE_SPEED, PAUSE_MS);

  useEffect(() => {
    setMounted(true);

    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(media.matches);

    const handleChange = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);
    if (media.addEventListener) {
      media.addEventListener('change', handleChange);
      return () => media.removeEventListener('change', handleChange);
    }

    media.addListener(handleChange);
    return () => media.removeListener(handleChange);
  }, []);

  if (!mounted) {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-space-black" />
    );
  }

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-space-black transition-colors duration-700"
    >
      {/* ── Light mode cinematic background video ── */}
      <div className="absolute inset-0 z-0 dark:hidden overflow-hidden">
        {!prefersReducedMotion ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="h-full w-full object-cover scale-105 opacity-85"
            aria-hidden="true"
          >
            <source src="/videos/mixkit-stars-nebulae-14151-720.mp4" type="video/mp4" />
          </video>
        ) : (
          <div className="h-full w-full bg-[radial-gradient(circle_at_30%_20%,rgba(190,18,60,0.14),transparent_45%),radial-gradient(circle_at_70%_60%,rgba(6,182,212,0.12),transparent_45%),linear-gradient(to_bottom,#fff6f8,#ffffff)]" />
        )}
      </div>

      {/* ── Galaxy 3D Background — dark mode only ── */}
      <div className="absolute inset-0 z-0 hidden dark:block">
        <GalaxyBackground />
      </div>

      {/* ── Starfield background (light mode only) ── */}
      <div className="opacity-40 dark:hidden">
        <Starfield />
      </div>

      {/* ── Subtle gradient overlay ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/10 to-white/75 dark:from-transparent dark:via-transparent dark:to-space-black/60 pointer-events-none z-[1]" />

      {/* ── Main content ── */}
      <motion.div
        className="relative z-10 container mx-auto px-6 py-24 text-center max-w-5xl"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {/* Status badge */}
        <motion.div variants={staggerItem} className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full backdrop-blur-xl bg-rose-50/60 dark:bg-white/[0.04] border border-rose-200/40 dark:border-vision-cyan/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-vision-cyan opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-vision-cyan" />
            </span>
            <span className="text-xs sm:text-sm font-mono font-medium text-text-light/70 dark:text-text-dark/60 tracking-wider uppercase">
              Available for Opportunities
            </span>
          </div>
        </motion.div>

        {/* ── Name ── */}
        <motion.div variants={staggerItem} className="space-y-4 mb-8">
          <div className="font-mono text-xs sm:text-sm text-text-light/35 dark:text-text-dark/30 tracking-[0.25em] uppercase mb-2">
            {'// Full-Stack Developer'}
          </div>

          <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.05]">
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-700 via-slate-900 to-rose-600 dark:from-vision-cyan dark:via-white dark:to-vision-orange bg-[length:200%_auto] animate-gradient-x">
                {scrambledName || '\u00A0'}
              </span>

              <motion.span
                className="absolute -inset-4 bg-gradient-to-r from-vision-cyan/10 via-transparent to-vision-orange/10 blur-3xl -z-10 rounded-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ duration: 2 }}
              />
            </span>
          </h1>

          {/* Subtitle */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm sm:text-base md:text-lg font-mono text-text-light/55 dark:text-text-dark/50"
            variants={staggerItem}
          >
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-rose-600 dark:text-vision-cyan/70 flex-shrink-0" />
              <span>Software Engineer @ MAQ Software</span>
            </div>
            <span className="hidden sm:inline text-text-light/15 dark:text-text-dark/20">|</span>
            <span className="text-text-light/40 dark:text-text-dark/30">Class of 2025</span>
          </motion.div>
        </motion.div>

        {/* ── Typewriter ── */}
        <motion.div variants={staggerItem} className="mb-12 flex justify-center">
          <div className="relative px-6 py-3 rounded-xl backdrop-blur-md bg-rose-50/40 dark:bg-vision-cyan/[0.04] border border-rose-200/30 dark:border-vision-cyan/10 max-w-xl overflow-hidden">
            <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none opacity-20">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-vision-cyan to-transparent absolute top-0 animate-scan" />
            </div>

            <p className="text-base sm:text-lg md:text-xl font-mono font-medium text-vision-cyan/90 dark:text-vision-cyan/90 min-h-[1.75rem]">
              <span className="text-vision-cyan/40 mr-1">{'>'}</span>
              {typewriterText}
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.7, repeat: Infinity }}
                className="ml-0.5 text-vision-cyan"
              >
                ▎
              </motion.span>
            </p>
          </div>
        </motion.div>

        {/* ── CTA buttons ── */}
        <motion.div
          variants={staggerItem}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.a
            href="#projects"
            className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full font-mono font-semibold text-sm overflow-hidden min-w-[200px] bg-gradient-to-r from-rose-600 to-rose-700 dark:from-vision-cyan dark:to-blue-500 text-white shadow-lg shadow-rose-500/20 dark:shadow-vision-cyan/20 hover:shadow-rose-500/35 dark:hover:shadow-vision-cyan/35 transition-shadow"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Briefcase className="w-4 h-4 relative z-10" />
            <span className="relative z-10 tracking-wide">VIEW_PROJECTS</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-vision-orange to-vision-crimson"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.a>

          <motion.a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full font-mono font-semibold text-sm min-w-[200px] backdrop-blur-xl bg-rose-50/60 dark:bg-white/[0.03] border border-rose-200/50 dark:border-vision-cyan/20 text-vision-cyan hover:bg-rose-100/60 dark:hover:bg-vision-cyan/10 transition-all"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Download className="w-4 h-4" />
            <span className="tracking-wide">DOWNLOAD_CV</span>
          </motion.a>
        </motion.div>
      </motion.div>

      {/* ── Scroll indicator ── */}
      <motion.button
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 group cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{
          opacity: { duration: 0.5, delay: 1 },
          y: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
        }}
        onClick={() => document.querySelector('#skills')?.scrollIntoView({ behavior: 'smooth' })}
        aria-label="Scroll down"
      >
        <div className="flex flex-col items-center gap-2 text-text-light/30 dark:text-text-dark/20 group-hover:text-vision-cyan transition-colors duration-300">
          <span className="text-[9px] font-mono uppercase tracking-[0.3em]">Scroll</span>
          <div className="w-5 h-7 rounded-full border border-current flex items-start justify-center p-1.5">
            <motion.div
              className="w-0.5 h-0.5 rounded-full bg-current"
              animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
          </div>
        </div>
      </motion.button>
    </section>
  );
}

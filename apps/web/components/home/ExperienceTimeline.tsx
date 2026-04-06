'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';

const MotionDiv = motion.div as any;

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

// ============================================================================
// TEXT MORPH ANIMATION
// ============================================================================

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*!?';

function useTextMorph(from: string, to: string, trigger: boolean, duration = 1400) {
  const [display, setDisplay] = useState(from);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!trigger) {
      setDisplay(from);
      return;
    }
    const start = performance.now();
    let cancelled = false;
    function tick(now: number) {
      if (cancelled) return;
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      if (progress < 0.35) {
        const f = progress / 0.35;
        let r = '';
        for (let i = 0; i < from.length; i++) {
          if (from[i] === ' ') r += ' ';
          else if (Math.random() < f) r += CHARS[Math.floor(Math.random() * CHARS.length)];
          else r += from[i];
        }
        setDisplay(r);
      } else {
        const rp = (progress - 0.35) / 0.65;
        const resolved = Math.floor(rp * to.length);
        let r = '';
        for (let i = 0; i < to.length; i++) {
          if (to[i] === ' ') r += ' ';
          else if (i < resolved) r += to[i];
          else r += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
        setDisplay(r);
      }
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
      else setDisplay(to);
    }
    frameRef.current = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frameRef.current);
    };
  }, [trigger, from, to, duration]);
  return display;
}

// ============================================================================
// ICONS
// ============================================================================

const Icons = {
  Activity: ({ className }: { className?: string }) => (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  Briefcase: ({ className }: { className?: string }) => (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  Rocket: ({ className }: { className?: string }) => (
    <svg
      className={className}
      width="16"
      height="16"
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
  ChevronUp: ({ className }: { className?: string }) => (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  ),
  Zap: ({ className }: { className?: string }) => (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  ArrowRight: ({ className }: { className?: string }) => (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
};

// ============================================================================
// ANIMATED COUNTER
// ============================================================================

function AnimatedCounter({
  target,
  suffix = '',
  trigger,
}: {
  target: number;
  suffix?: string;
  trigger: boolean;
}) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    const duration = 1600;
    const startTime = performance.now();
    let cancelled = false;
    function tick(now: number) {
      if (cancelled) return;
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    return () => {
      cancelled = true;
    };
  }, [trigger, target]);
  return (
    <span className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

// ============================================================================
// PHASE DATA
// ============================================================================

interface Phase {
  phase: string;
  codename: string;
  title: string;
  org: string;
  period: string;
  duration: string;
  status: 'ACTIVE' | 'COMPLETED';
  description: string;
  tech: string[];
  highlights: string[];
  stats: { label: string; value: number; suffix: string }[];
}

const PHASES: Phase[] = [
  {
    phase: '01',
    codename: 'INTERN_PROTOCOL',
    title: 'Associate Software Engineer Intern',
    org: 'MAQ Software',
    period: 'Jan 2025 — Jul 2025',
    duration: '7 Months',
    status: 'COMPLETED',
    description:
      'Initial deployment into production environments. Rapid skill acquisition across the full stack, hands-on with enterprise-grade codebases, and mentorship-driven growth in agile workflows.',
    tech: ['React', 'TypeScript', 'Node.js', 'SQL', 'Azure', 'Git'],
    highlights: [
      'Shipped production features end-to-end',
      'Collaborated in agile sprints with senior engineers',
      'Built internal tooling & automation scripts',
    ],
    stats: [
      { label: 'Sprints', value: 14, suffix: '' },
      { label: 'PRs Merged', value: 60, suffix: '+' },
      { label: 'Uptime', value: 100, suffix: '%' },
    ],
  },
  {
    phase: '02',
    codename: 'ENGINEER_PROTOCOL',
    title: 'Software Engineer',
    org: 'MAQ Software',
    period: 'Aug 2025 — Present',
    duration: '7+ Months',
    status: 'ACTIVE',
    description:
      'Promoted to full engineer. Owning feature development, architecting solutions, code reviews, and driving technical decisions across client projects with increased scope and autonomy.',
    tech: ['Next.js', 'TypeScript', 'GraphQL', 'Azure', 'Docker', 'CI/CD'],
    highlights: [
      'Leading feature development for client projects',
      'Architecting scalable frontend & API solutions',
      'Mentoring interns & conducting code reviews',
    ],
    stats: [
      { label: 'Projects', value: 5, suffix: '+' },
      { label: 'Impact', value: 100, suffix: 'K+' },
      { label: 'Status', value: 0, suffix: '' },
    ],
  },
];

// ============================================================================
// PHASE CARD
// ============================================================================

const PhaseCard = ({
  phase,
  index,
  trigger,
}: {
  phase: Phase;
  index: number;
  trigger: boolean;
}) => {
  const isActive = phase.status === 'ACTIVE';
  const delay = index * 0.2;
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { damping: 20, stiffness: 200 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { damping: 20, stiffness: 200 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); };

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 40 }}
      animate={trigger ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: delay + 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={cn('group relative flex-1 min-w-0')}
      style={{ perspective: '1200px' }}
    >
      <MotionDiv
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY }}
        className="h-full"
      >
      {/* Card shell */}
      <div
        className={cn(
          'relative h-full rounded-[0.5rem] p-6 md:p-8 border transition-all duration-700 overflow-hidden',
          isActive
            ? 'bg-vision-cyan/[0.03] dark:bg-vision-cyan/[0.02] border-vision-cyan/30 shadow-[0_0_40px_rgba(var(--glow-cyan),0.06)]'
            : 'bg-slate-50/50 dark:bg-white/[0.015] border-slate-200 dark:border-white/[0.06] hover:border-vision-cyan/25 hover:shadow-[0_20px_50px_rgba(var(--glow-cyan),0.04)]'
        )}
      >
        {/* Scanline overlay for active */}
        {isActive && (
          <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--glow-cyan),0)_50%,rgba(var(--glow-cyan),0.015)_50%)] bg-[length:100%_4px] pointer-events-none" />
        )}

        {/* Phase badge row */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                'text-[9px] font-mono font-black tracking-[0.4em] uppercase px-3 py-1 border',
                isActive
                  ? 'text-vision-cyan border-vision-cyan/30 bg-vision-cyan/10'
                  : 'text-slate-400 dark:text-text-dark/30 border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.03]'
              )}
            >
              Phase_{phase.phase}
            </span>
            {isActive && (
              <span className="flex items-center gap-1.5 text-[8px] font-mono font-black text-emerald-400 tracking-[0.3em] uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                LIVE
              </span>
            )}
          </div>
          <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-text-dark/20 tracking-wider">
            {phase.duration}
          </span>
        </div>

        {/* Codename */}
        <p className="text-[9px] font-mono font-black text-vision-cyan/50 dark:text-vision-cyan/40 tracking-[0.3em] uppercase mb-2">
          {phase.codename}
        </p>

        {/* Title */}
        <h3
          className={cn(
            'text-xl md:text-2xl font-display font-black tracking-tight uppercase italic mb-1 leading-tight',
            isActive
              ? 'text-vision-cyan'
              : 'text-slate-800 dark:text-text-dark group-hover:text-vision-cyan transition-colors'
          )}
        >
          {phase.title}
        </h3>

        {/* Org + Period */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="text-[10px] font-mono font-black text-slate-500 dark:text-text-dark/30 tracking-[0.2em] uppercase">
            @ {phase.org}
          </span>
          <span className="text-[9px] font-mono text-slate-400 dark:text-text-dark/20">
            {phase.period}
          </span>
        </div>

        {/* Description */}
        <p className="text-[12px] font-bold leading-relaxed text-slate-500 dark:text-text-dark/50 mb-5">
          {phase.description}
        </p>

        {/* Highlights */}
        <div className="space-y-2 mb-5">
          {phase.highlights.map((h, i) => (
            <MotionDiv
              key={h}
              initial={{ opacity: 0, x: -10 }}
              animate={trigger ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: delay + 0.5 + i * 0.1 }}
              className="flex items-start gap-2"
            >
              <span
                className={cn(
                  'mt-1.5 h-1 w-1 rounded-full flex-shrink-0',
                  isActive ? 'bg-vision-cyan' : 'bg-slate-400 dark:bg-white/25'
                )}
              />
              <span className="text-[11px] font-bold text-slate-500 dark:text-text-dark/40">
                {h}
              </span>
            </MotionDiv>
          ))}
        </div>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {phase.tech.map((t) => (
            <span
              key={t}
              className={cn(
                'text-[8px] font-mono font-black uppercase tracking-wider px-2.5 py-0.5 border',
                isActive
                  ? 'text-vision-cyan/60 border-vision-cyan/15 bg-vision-cyan/5'
                  : 'text-slate-400 dark:text-text-dark/20 border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]'
              )}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Stats row */}
        <div className="flex gap-4 pt-4 border-t border-slate-200/50 dark:border-white/[0.04]">
          {phase.stats.map((stat, i) => (
            <div key={stat.label} className="flex flex-col">
              <span
                className={cn(
                  'text-lg font-mono font-black tracking-tight',
                  isActive ? 'text-vision-cyan' : 'text-slate-700 dark:text-text-dark/50'
                )}
              >
                {stat.label === 'Status' ? (
                  <span className="text-emerald-400 text-[9px] tracking-[0.2em]">ONLINE</span>
                ) : (
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} trigger={trigger} />
                )}
              </span>
              {stat.label !== 'Status' && (
                <span className="text-[7px] font-mono font-bold text-slate-400 dark:text-text-dark/20 uppercase tracking-[0.2em]">
                  {stat.label}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Corner brackets */}
        <div
          className={cn(
            'absolute top-3 left-3 w-3 h-3 border-t border-l transition-colors',
            isActive
              ? 'border-vision-cyan/30'
              : 'border-slate-300 dark:border-white/[0.06] group-hover:border-vision-cyan/30'
          )}
        />
        <div
          className={cn(
            'absolute top-3 right-3 w-3 h-3 border-t border-r transition-colors',
            isActive
              ? 'border-vision-cyan/30'
              : 'border-slate-300 dark:border-white/[0.06] group-hover:border-vision-cyan/30'
          )}
        />
        <div
          className={cn(
            'absolute bottom-3 left-3 w-3 h-3 border-b border-l transition-colors',
            isActive
              ? 'border-vision-crimson/30'
              : 'border-slate-300 dark:border-white/[0.06] group-hover:border-vision-crimson/30'
          )}
        />
        <div
          className={cn(
            'absolute bottom-3 right-3 w-3 h-3 border-b border-r transition-colors',
            isActive
              ? 'border-vision-crimson/30'
              : 'border-slate-300 dark:border-white/[0.06] group-hover:border-vision-crimson/30'
          )}
        />
      </div>
      </MotionDiv>
    </MotionDiv>
  );
};

// ============================================================================
// RANK UP CONNECTOR (Center beam between the two phases)
// ============================================================================

const RankUpConnector = ({ trigger }: { trigger: boolean }) => {
  return (
    <MotionDiv
      initial={{ opacity: 0, scale: 0.8 }}
      animate={trigger ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex-shrink-0 flex flex-col items-center justify-center gap-3 py-6 lg:py-0 lg:px-4 relative"
    >
      {/* Vertical/horizontal beam line */}
      <div className="hidden lg:block absolute top-1/2 -translate-y-1/2 left-0 right-0 h-[1px]">
        <MotionDiv
          initial={{ scaleX: 0 }}
          animate={trigger ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="h-full bg-gradient-to-r from-slate-300 dark:from-white/10 via-vision-cyan/50 to-slate-300 dark:to-white/10"
        />
      </div>
      <div className="lg:hidden absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px]">
        <MotionDiv
          initial={{ scaleY: 0 }}
          animate={trigger ? { scaleY: 1 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="h-full bg-gradient-to-b from-slate-300 dark:from-white/10 via-vision-cyan/50 to-slate-300 dark:to-white/10"
        />
      </div>

      {/* Rank Up badge */}
      <MotionDiv
        initial={{ scale: 0, opacity: 0 }}
        animate={trigger ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 1.0, type: 'spring', damping: 12 }}
        className="relative z-10"
      >
        <div className="relative flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20">
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-full border border-vision-cyan/20 animate-ping opacity-20" />
          <div className="absolute inset-0 rounded-full bg-vision-cyan/[0.06] blur-lg" />

          {/* Inner badge */}
          <div className="relative flex flex-col items-center justify-center w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-rose-50 dark:bg-space-black border-2 border-vision-cyan/40 shadow-[0_0_20px_rgba(190,18,60,0.12)] dark:shadow-[0_0_30px_rgba(34,211,238,0.2)]">
            <Icons.ChevronUp className="text-vision-cyan h-4 w-4 lg:h-5 lg:w-5 -mb-0.5" />
            <span className="text-[7px] lg:text-[8px] font-mono font-black text-vision-cyan tracking-[0.2em]">
              RANK
            </span>
          </div>
        </div>
      </MotionDiv>

      {/* Arrow indicators */}
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={trigger ? { opacity: 1 } : {}}
        transition={{ delay: 1.2 }}
        className="hidden lg:flex items-center gap-1 text-vision-cyan/40"
      >
        <Icons.ArrowRight className="h-3 w-3" />
      </MotionDiv>
    </MotionDiv>
  );
};

// ============================================================================
// DURATION COUNTER (Months at MAQ)
// ============================================================================

function useDurationMonths(): number {
  // From Jan 2025 to current date
  const start = new Date(2025, 0, 1); // Jan 2025
  const now = new Date();
  return (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth()) + 1;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const ExperienceTimeline = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-10%' });
  const headingInView = useInView(headingRef, { once: true, margin: '-20%' });
  const totalMonths = useDurationMonths();
  const morphedText = useTextMorph('System Upgrade.', 'EXPERIENCE', headingInView, 1400);

  return (
    <section
      ref={sectionRef}
      id="timeline"
      className="relative py-20 md:py-28 px-6 bg-white dark:bg-space-black transition-colors duration-1000 overflow-hidden"
    >
      {/* Background ambience */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 bg-vision-cyan/[0.03] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-vision-crimson/[0.02] blur-[180px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* ============================================================ */}
        {/* HEADER                                                       */}
        {/* ============================================================ */}
        <div ref={headingRef} className="text-center mb-14 md:mb-16">
          <MotionDiv
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-4 px-8 py-2.5 mb-6 rounded-full glassmorphism border-2 border-vision-cyan/40 text-vision-cyan font-mono text-[10px] font-black tracking-[0.6em] uppercase shadow-[0_0_30px_rgba(var(--glow-cyan),0.2)]"
          >
            <Icons.Activity className="animate-pulse" /> Mission_Chronolog // v2.0
          </MotionDiv>

          <div className="relative overflow-visible py-4 px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={headingInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="w-48 h-24 bg-vision-cyan/[0.06] dark:bg-vision-cyan/[0.04] blur-[60px] rounded-full" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={headingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative text-4xl sm:text-5xl md:text-6xl font-display font-black leading-none tracking-tighter uppercase italic"
            >
              <span className="relative inline-block pr-3">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-br from-rose-800 via-rose-600 to-rose-800 dark:from-vision-cyan dark:via-white/90 dark:to-vision-cyan">
                  {morphedText || '\u00A0'}
                </span>
                <span
                  aria-hidden
                  className="absolute inset-0 text-vision-crimson/30 dark:text-vision-crimson/20 animate-[glitch1_3s_infinite] pointer-events-none select-none mix-blend-darken dark:mix-blend-screen"
                >
                  {morphedText || '\u00A0'}
                </span>
                <span
                  aria-hidden
                  className="absolute inset-0 text-vision-cyan/30 dark:text-vision-cyan/20 animate-[glitch2_3s_infinite] pointer-events-none select-none mix-blend-darken dark:mix-blend-screen"
                >
                  {morphedText || '\u00A0'}
                </span>
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={headingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-3 text-[10px] md:text-[11px] font-mono font-bold text-slate-400 dark:text-vision-cyan/30 uppercase tracking-[0.35em]"
            >
              [ MAQ Software ] — {totalMonths} Months &amp; Counting
            </motion.p>

            {/* Decorative line */}
            <MotionDiv
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1, delay: 0.5 }}
              className="mx-auto mt-5 h-px w-24 bg-gradient-to-r from-transparent via-vision-cyan/40 to-transparent"
            />
          </div>
        </div>

        {/* ============================================================ */}
        {/* TWO-PANEL LAYOUT                                             */}
        {/* ============================================================ */}
        <div className="flex flex-col lg:flex-row items-stretch gap-0">
          {/* Phase 01 — Intern */}
          <PhaseCard phase={PHASES[0]} index={0} trigger={isInView} />

          {/* Rank Up Connector */}
          <RankUpConnector trigger={isInView} />

          {/* Phase 02 — Engineer */}
          <PhaseCard phase={PHASES[1]} index={1} trigger={isInView} />
        </div>

        {/* ============================================================ */}
        {/* BOTTOM SIGNAL BAR                                            */}
        {/* ============================================================ */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 text-[9px] font-mono font-black text-slate-400 dark:text-text-dark/30 uppercase tracking-[0.3em]"
        >
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-vision-cyan animate-pulse" />
            <span>
              Signal: <span className="text-vision-cyan">Strong</span>
            </span>
          </div>
          <span className="hidden sm:block text-slate-300 dark:text-text-dark/20">|</span>
          <div className="flex items-center gap-2">
            <Icons.Zap className="h-3 w-3 text-vision-orange" />
            <span>
              Trajectory: <span className="text-vision-orange">Ascending</span>
            </span>
          </div>
          <span className="hidden sm:block text-slate-300 dark:text-text-dark/20">|</span>
          <div className="flex items-center gap-2">
            <Icons.Rocket className="h-3 w-3 text-vision-cyan" />
            <span>
              Next: <span className="text-slate-600 dark:text-text-dark/40">Senior_Protocol</span>
            </span>
          </div>
        </MotionDiv>
      </div>
    </section>
  );
};

export default ExperienceTimeline;

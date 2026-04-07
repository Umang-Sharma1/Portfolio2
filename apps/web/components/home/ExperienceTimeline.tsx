'use client';

import React, { useRef, useState, useEffect, memo, useCallback } from 'react';
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;
const MotionSpan = motion.span as any;

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

// ============================================================================
// SCRAMBLE TEXT
// ============================================================================

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789Â·â– â–²â—/';

function useScramble(text: string, trigger: boolean, delay = 0) {
  const [display, setDisplay] = useState(text);
  const iterRef = useRef(0);
  useEffect(() => {
    if (!trigger) return;
    iterRef.current = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        iterRef.current += 0.5;
        setDisplay(
          text
            .split('')
            .map((char, i) => {
              if (i < iterRef.current) return char;
              if (char === ' ' || char === '.' || char === '_' || char === '-') return char;
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join('')
        );
        if (iterRef.current >= text.length) clearInterval(interval);
      }, 35);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [trigger, text, delay]);
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
  Zap: ({ className }: { className?: string }) => (
    <svg
      className={className}
      width="12"
      height="12"
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
  Check: () => (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  ArrowUp: () => (
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
      <path d="m18 15-6-6-6 6" />
    </svg>
  ),
};

// ============================================================================
// DATA
// ============================================================================

interface MissionPhase {
  id: string;
  missionId: string;
  codename: string;
  title: string;
  org: string;
  period: string;
  periodShort: string;
  duration: string;
  status: 'ACTIVE' | 'ARCHIVED';
  clearance: string;
  description: string;
  tech: string[];
  highlights: string[];
  stats: { label: string; value: string }[];
  signalStrength: number; // 1-5
  promotion?: boolean;
}

const MISSIONS: MissionPhase[] = [
  {
    id: 'phase-01',
    missionId: 'MSN-001',
    codename: 'INTERN_PROTOCOL',
    title: 'Associate Software Engineer Intern',
    org: 'MAQ Software',
    period: 'Jan 2025 â€” Jul 2025',
    periodShort: '2025.01 â†’ 2025.07',
    duration: '7 Months',
    status: 'ARCHIVED',
    clearance: 'ALPHA',
    description:
      'Initial deployment into production environments. Rapid skill acquisition across the full stack, hands-on with enterprise-grade codebases, and mentorship-driven growth in agile workflows.',
    tech: ['React', 'TypeScript', 'Node.js', 'SQL', 'Azure', 'Git'],
    highlights: [
      'Shipped production features end-to-end',
      'Collaborated in agile sprints with senior engineers',
      'Built internal tooling & automation scripts',
    ],
    stats: [
      { label: 'Sprints', value: '14' },
      { label: 'PRs_Merged', value: '60+' },
      { label: 'Uptime', value: '100%' },
    ],
    signalStrength: 3,
    promotion: true,
  },
  {
    id: 'phase-02',
    missionId: 'MSN-002',
    codename: 'ENGINEER_PROTOCOL',
    title: 'Software Engineer',
    org: 'MAQ Software',
    period: 'Aug 2025 â€” Present',
    periodShort: '2025.08 â†’ ACTIVE',
    duration: '7+ Months',
    status: 'ACTIVE',
    clearance: 'SIGMA',
    description:
      'Promoted to full engineer. Owning feature development, architecting solutions, code reviews, and driving technical decisions across client projects with increased scope and autonomy.',
    tech: ['Next.js', 'TypeScript', 'GraphQL', 'Azure', 'Docker', 'CI/CD'],
    highlights: [
      'Leading feature development for client projects',
      'Architecting scalable frontend & API solutions',
      'Mentoring interns & conducting code reviews',
    ],
    stats: [
      { label: 'Projects', value: '5+' },
      { label: 'Users_Impacted', value: '100K+' },
      { label: 'Status', value: 'ONLINE' },
    ],
    signalStrength: 5,
  },
];

// ============================================================================
// DURATION COUNTER
// ============================================================================

function useDurationMonths(): number {
  const start = new Date(2025, 0, 1);
  const now = new Date();
  return (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth()) + 1;
}

// ============================================================================
// SIGNAL BARS
// ============================================================================

const SignalBars = memo(({ strength, active }: { strength: number; active: boolean }) => (
  <div className="flex items-end gap-[2px]">
    {[1, 2, 3, 4, 5].map((i) => (
      <MotionDiv
        key={i}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: i * 0.06, duration: 0.3, ease: 'easeOut' }}
        className={cn(
          'w-[3px] rounded-sm origin-bottom transition-colors',
          i <= strength
            ? active
              ? 'bg-vision-cyan shadow-[0_0_4px_rgba(var(--glow-cyan),0.8)]'
              : 'bg-slate-400 dark:bg-white/30'
            : 'bg-slate-200 dark:bg-white/[0.06]'
        )}
        style={{ height: `${5 + i * 3}px` }}
      />
    ))}
  </div>
));

// ============================================================================
// PROMO BADGE (between nodes)
// ============================================================================

const PromoBadge = memo(({ trigger }: { trigger: boolean }) => (
  <MotionDiv
    initial={{ opacity: 0, scale: 0 }}
    animate={trigger ? { opacity: 1, scale: 1 } : {}}
    transition={{ delay: 0.9, duration: 0.5, type: 'spring', damping: 12 }}
    className="relative z-20 flex flex-col items-center gap-1 my-1"
  >
    <div className="relative">
      <div className="absolute inset-0 rounded-full bg-vision-cyan/20 blur-md animate-pulse" />
      <div className="relative flex flex-col items-center justify-center w-10 h-10 rounded-full bg-space-black dark:bg-space-black border-2 border-vision-cyan/60 shadow-[0_0_16px_rgba(var(--glow-cyan),0.4)]">
        <Icons.ArrowUp />
        <span className="text-[5px] font-mono font-black text-vision-cyan tracking-[0.1em] leading-none">
          UP
        </span>
      </div>
    </div>
    <div className="text-[7px] font-mono font-black text-vision-cyan/50 tracking-[0.3em] uppercase whitespace-nowrap">
      Promoted
    </div>
  </MotionDiv>
));

// ============================================================================
// DOSSIER PANEL (right side content on desktop / below on mobile)
// ============================================================================

const DossierPanel = memo(
  ({
    mission,
    active,
    trigger,
    index,
  }: {
    mission: MissionPhase;
    active: boolean;
    trigger: boolean;
    index: number;
  }) => {
    const isActive = mission.status === 'ACTIVE';
    const titleDisplay = useScramble(mission.title, active && trigger, 80);

    return (
      <AnimatePresence mode="wait">
        {active && (
          <MotionDiv
            key={mission.id}
            initial={{ opacity: 0, x: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -10, filter: 'blur(4px)' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'relative rounded-[2rem] border overflow-hidden',
              isActive
                ? 'bg-vision-cyan/[0.025] dark:bg-vision-cyan/[0.03] border-vision-cyan/30 shadow-[0_0_50px_rgba(var(--glow-cyan),0.08)]'
                : 'bg-slate-50/80 dark:bg-white/[0.02] border-slate-200/70 dark:border-white/[0.07]'
            )}
          >
            {/* Scanline */}
            {isActive && (
              <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--glow-cyan),0)_50%,rgba(var(--glow-cyan),0.015)_50%)] bg-[length:100%_4px] pointer-events-none" />
            )}
            {/* Sweep scanline animation */}
            {isActive && (
              <MotionDiv
                animate={{ y: ['0%', '100%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="absolute left-0 right-0 h-12 bg-gradient-to-b from-transparent via-vision-cyan/[0.04] to-transparent pointer-events-none z-10"
              />
            )}

            {/* HUD corners */}
            <div
              className={cn(
                'absolute top-3 left-3 w-4 h-4 border-t border-l pointer-events-none',
                isActive ? 'border-vision-cyan/40' : 'border-slate-300 dark:border-white/10'
              )}
            />
            <div
              className={cn(
                'absolute top-3 right-3 w-4 h-4 border-t border-r pointer-events-none',
                isActive ? 'border-vision-cyan/30' : 'border-slate-300 dark:border-white/10'
              )}
            />
            <div
              className={cn(
                'absolute bottom-3 left-3 w-4 h-4 border-b border-l pointer-events-none',
                isActive ? 'border-vision-crimson/30' : 'border-slate-300 dark:border-white/10'
              )}
            />
            <div
              className={cn(
                'absolute bottom-3 right-3 w-4 h-4 border-b border-r pointer-events-none',
                isActive ? 'border-vision-crimson/30' : 'border-slate-300 dark:border-white/10'
              )}
            />

            <div className="relative z-20 p-6 md:p-8">
              {/* Top bar */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'text-[8px] font-mono font-black tracking-[0.4em] uppercase px-2.5 py-1 border',
                      isActive
                        ? 'text-vision-cyan border-vision-cyan/30 bg-vision-cyan/10'
                        : 'text-slate-400 dark:text-text-dark/30 border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-white/[0.03]'
                    )}
                  >
                    {mission.missionId}
                  </span>
                  <span
                    className={cn(
                      'text-[7px] font-mono font-black tracking-[0.3em] uppercase px-2 py-1 border',
                      isActive
                        ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                        : 'text-slate-400 dark:text-text-dark/20 border-slate-200 dark:border-white/5'
                    )}
                  >
                    {mission.status}
                  </span>
                  {isActive && (
                    <span className="flex items-center gap-1 text-[7px] font-mono font-black text-emerald-400 tracking-[0.3em]">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.7)]" />
                      LIVE
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <SignalBars strength={mission.signalStrength} active={isActive} />
                  <span className="text-[7px] font-mono text-slate-400 dark:text-text-dark/20">
                    CLR: {mission.clearance}
                  </span>
                </div>
              </div>

              {/* Codename */}
              <div className="text-[8px] font-mono font-black text-vision-cyan/50 dark:text-vision-cyan/40 tracking-[0.35em] uppercase mb-2">
                â–¸ {mission.codename}
              </div>

              {/* Title */}
              <h3
                className={cn(
                  'text-xl md:text-2xl font-display font-black tracking-tight uppercase italic mb-1 leading-tight',
                  isActive ? 'text-vision-cyan' : 'text-slate-800 dark:text-text-dark'
                )}
              >
                {titleDisplay}
              </h3>

              {/* Org + Period */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4">
                <span className="text-[10px] font-mono font-black text-slate-500 dark:text-text-dark/40 uppercase tracking-[0.2em]">
                  @ {mission.org}
                </span>
                <span className="text-[9px] font-mono text-vision-crimson/70 dark:text-vision-crimson/60 tracking-wider">
                  {mission.periodShort}
                </span>
                <span className="text-[8px] font-mono text-slate-400 dark:text-text-dark/20">
                  [{mission.duration}]
                </span>
              </div>

              {/* Description */}
              <p className="text-[11px] font-bold leading-relaxed text-slate-500 dark:text-text-dark/45 mb-5">
                {mission.description}
              </p>

              {/* Highlights */}
              <div className="space-y-2 mb-5">
                {mission.highlights.map((h, i) => (
                  <MotionDiv
                    key={h}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="flex items-start gap-2.5"
                  >
                    <div
                      className={cn(
                        'mt-1 h-4 w-4 rounded flex items-center justify-center shrink-0',
                        isActive
                          ? 'bg-vision-cyan/10 border border-vision-cyan/30 text-vision-cyan'
                          : 'bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] text-slate-400 dark:text-text-dark/30'
                      )}
                    >
                      <Icons.Check />
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-text-dark/45 leading-snug">
                      {h}
                    </span>
                  </MotionDiv>
                ))}
              </div>

              {/* Tech stack */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {mission.tech.map((t) => (
                  <span
                    key={t}
                    className={cn(
                      'text-[8px] font-mono font-black uppercase tracking-wider px-2.5 py-1 border',
                      isActive
                        ? 'text-vision-cyan/70 border-vision-cyan/20 bg-vision-cyan/[0.06] hover:bg-vision-cyan/10 hover:border-vision-cyan/40 hover:shadow-[0_0_8px_rgba(var(--glow-cyan),0.15)]'
                        : 'text-slate-400 dark:text-text-dark/25 border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02]',
                      'transition-all duration-300 cursor-default'
                    )}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Stats row */}
              <div
                className={cn(
                  'flex gap-4 pt-4 border-t',
                  isActive
                    ? 'border-vision-cyan/10'
                    : 'border-slate-200/50 dark:border-white/[0.04]'
                )}
              >
                {mission.stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col gap-0.5">
                    <span
                      className={cn(
                        'text-base font-mono font-black tracking-tight',
                        stat.value === 'ONLINE'
                          ? 'text-emerald-400 text-[9px] tracking-[0.2em]'
                          : isActive
                            ? 'text-vision-cyan'
                            : 'text-slate-700 dark:text-text-dark/50'
                      )}
                    >
                      {stat.value}
                    </span>
                    <span className="text-[7px] font-mono font-bold text-slate-400 dark:text-text-dark/20 uppercase tracking-[0.2em]">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    );
  }
);

// ============================================================================
// TIMELINE NODE (hexagonal) + SPINE
// ============================================================================

const HexNode = memo(
  ({
    mission,
    active,
    onActivate,
    trigger,
    index,
    isLast,
  }: {
    mission: MissionPhase;
    active: boolean;
    onActivate: () => void;
    trigger: boolean;
    index: number;
    isLast: boolean;
  }) => {
    const isActive = mission.status === 'ACTIVE';

    return (
      <MotionDiv
        initial={{ opacity: 0, scale: 0, x: -20 }}
        animate={trigger ? { opacity: 1, scale: 1, x: 0 } : {}}
        transition={{ delay: 0.3 + index * 0.25, duration: 0.6, type: 'spring', damping: 14 }}
        className="relative flex items-start gap-0"
      >
        {/* Node column */}
        <div className="flex flex-col items-center shrink-0 w-12">
          {/* Hex node button */}
          <button
            onClick={onActivate}
            className={cn(
              'relative flex items-center justify-center w-10 h-10 transition-all duration-500 group/node z-10',
              'focus:outline-none'
            )}
            style={{ clipPath: 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)' }}
          >
            {/* Outer glow */}
            {active && (
              <MotionDiv
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.4, 0.9, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-[-4px] rounded-full bg-vision-cyan/20 blur-md pointer-events-none"
                style={{ clipPath: 'none' }}
              />
            )}
            {/* Hex fill */}
            <div
              className={cn(
                'absolute inset-0 transition-all duration-500',
                active && isActive
                  ? 'bg-vision-cyan'
                  : active
                    ? 'bg-slate-600 dark:bg-white/40'
                    : isActive
                      ? 'bg-vision-cyan/20 group-hover/node:bg-vision-cyan/40'
                      : 'bg-slate-200 dark:bg-white/[0.08] group-hover/node:bg-slate-300 dark:group-hover/node:bg-white/15'
              )}
            />
            {/* Ping for active live node */}
            {isActive && active && (
              <div
                className="absolute inset-0 animate-ping bg-vision-cyan/30"
                style={{ clipPath: 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)' }}
              />
            )}
            {/* Number */}
            <span
              className={cn(
                'relative z-10 text-[9px] font-mono font-black',
                active ? 'text-white dark:text-space-black' : 'text-slate-500 dark:text-white/30'
              )}
            >
              {`0${index + 1}`}
            </span>
          </button>

          {/* Spine line below (not for last item) */}
          {!isLast && (
            <MotionDiv
              initial={{ scaleY: 0 }}
              animate={trigger ? { scaleY: 1 } : {}}
              transition={{ delay: 0.5 + index * 0.2, duration: 0.8 }}
              className="w-px flex-1 min-h-[40px] origin-top"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(var(--glow-cyan),0.4), rgba(var(--glow-cyan),0.1))',
              }}
            />
          )}
        </div>

        {/* Side label (visible on mobile, replaces right panel) */}
        <div className="ml-4 pt-1.5 pb-4 cursor-pointer lg:hidden flex-1" onClick={onActivate}>
          <div className="text-[8px] font-mono font-black text-vision-cyan/50 tracking-[0.3em] uppercase mb-1">
            {mission.missionId}
          </div>
          <div
            className={cn(
              'text-base font-display font-black uppercase italic tracking-tight',
              isActive ? 'text-vision-cyan' : 'text-slate-700 dark:text-text-dark/70'
            )}
          >
            {mission.title}
          </div>
          <div className="text-[9px] font-mono text-vision-crimson/60 mt-0.5">
            {mission.periodShort}
          </div>
        </div>
      </MotionDiv>
    );
  }
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const ExperienceTimeline = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-10%' });
  const headingInView = useInView(headingRef, { once: true, margin: '-20%' });
  const totalMonths = useDurationMonths();

  const [activeIndex, setActiveIndex] = useState(1); // Default to current role

  // Scramble heading
  const headingDisplay = useScramble('EXPERIENCE', headingInView, 200);

  return (
    <section
      ref={sectionRef}
      id="timeline"
      className="relative py-20 md:py-28 px-6 bg-white dark:bg-space-black transition-colors duration-1000 overflow-hidden"
    >
      {/* Background ambience */}
      <div className="absolute top-1/3 left-0 w-72 h-72 bg-vision-cyan/[0.03] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-vision-crimson/[0.02] blur-[180px] pointer-events-none" />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_60px,rgba(var(--glow-cyan),0.012)_60px,rgba(var(--glow-cyan),0.012)_61px)] pointer-events-none opacity-40" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* â”€â”€ HEADER â”€â”€ */}
        <div ref={headingRef} className="text-center mb-14 md:mb-16">
          <MotionDiv
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-4 px-8 py-2.5 mb-6 rounded-full glassmorphism border-2 border-vision-cyan/40 text-vision-cyan font-mono text-[10px] font-black tracking-[0.6em] uppercase shadow-[0_0_30px_rgba(var(--glow-cyan),0.2)]"
          >
            <Icons.Activity className="animate-pulse" /> Mission_Chronolog // v3.0
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
                  {headingDisplay || '\u00A0'}
                </span>
                <span
                  aria-hidden
                  className="absolute inset-0 text-vision-crimson/30 dark:text-vision-crimson/20 animate-[glitch1_3s_infinite] pointer-events-none select-none mix-blend-darken dark:mix-blend-screen"
                >
                  {headingDisplay || '\u00A0'}
                </span>
                <span
                  aria-hidden
                  className="absolute inset-0 text-vision-cyan/30 dark:text-vision-cyan/20 animate-[glitch2_3s_infinite] pointer-events-none select-none mix-blend-darken dark:mix-blend-screen"
                >
                  {headingDisplay || '\u00A0'}
                </span>
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={headingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-3 text-[10px] md:text-[11px] font-mono font-bold text-slate-400 dark:text-vision-cyan/30 uppercase tracking-[0.35em]"
            >
              [ MAQ Software ] â€” {totalMonths} Months &amp; Counting
            </motion.p>

            <MotionDiv
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1, delay: 0.5 }}
              className="mx-auto mt-5 h-px w-24 bg-gradient-to-r from-transparent via-vision-cyan/40 to-transparent"
            />
          </div>
        </div>

        {/* â”€â”€ MISSION LOG LAYOUT â”€â”€ */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          {/* LEFT: Vertical spine + nodes */}
          <div className="lg:w-56 shrink-0 relative">
            {/* Spine background line (draws in) */}
            <MotionDiv
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : {}}
              transition={{ delay: 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-5 top-5 bottom-5 w-px origin-top pointer-events-none"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(var(--glow-cyan),0.15), rgba(var(--glow-crimson),0.1))',
              }}
            />

            <div className="flex flex-col relative">
              {MISSIONS.map((mission, i) => (
                <React.Fragment key={mission.id}>
                  <HexNode
                    mission={mission}
                    active={activeIndex === i}
                    onActivate={() => setActiveIndex(i)}
                    trigger={isInView}
                    index={i}
                    isLast={i === MISSIONS.length - 1}
                  />
                  {/* Promo badge between nodes */}
                  {i < MISSIONS.length - 1 && mission.promotion && (
                    <PromoBadge trigger={isInView} />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Mission selector labels â€” desktop */}
            <div className="hidden lg:flex flex-col gap-2 mt-6 ml-1">
              {MISSIONS.map((m, i) => (
                <button
                  key={m.id}
                  onClick={() => setActiveIndex(i)}
                  className={cn(
                    'text-left text-[9px] font-mono font-black uppercase tracking-[0.3em] px-3 py-2 border transition-all duration-300',
                    activeIndex === i
                      ? 'text-vision-cyan border-vision-cyan/30 bg-vision-cyan/5'
                      : 'text-slate-400 dark:text-text-dark/25 border-transparent hover:border-slate-200 dark:hover:border-white/10 hover:text-slate-600 dark:hover:text-text-dark/40'
                  )}
                >
                  <div className="flex items-center gap-2">
                    {activeIndex === i && (
                      <span className="h-1 w-1 rounded-full bg-vision-cyan animate-pulse" />
                    )}
                    {m.missionId}
                  </div>
                  <div className="text-[8px] opacity-60 mt-0.5 hidden xl:block">{m.period}</div>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Dossier panel */}
          <div className="flex-1 min-w-0">
            {MISSIONS.map((m, i) => (
              <DossierPanel
                key={m.id}
                mission={m}
                active={activeIndex === i}
                trigger={isInView}
                index={i}
              />
            ))}
          </div>
        </div>

        {/* â”€â”€ BOTTOM STATUS BAR â”€â”€ */}
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
            <Icons.Zap className="text-vision-orange" />
            <span>
              Trajectory: <span className="text-vision-orange">Ascending</span>
            </span>
          </div>
          <span className="hidden sm:block text-slate-300 dark:text-text-dark/20">|</span>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
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

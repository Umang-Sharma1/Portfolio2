'use client';

import React, { useRef, memo, useState, useEffect, useCallback } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { GET_SKILLS } from '@/lib/graphql/queries';
import { SkillIcon } from '@/lib/skill-icons';

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

// ============================================================================
// TYPES
// ============================================================================

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  yearsOfExperience: number;
  projectCount: number;
  icon: string;
  color: string;
  description: string;
}

// ============================================================================
// FALLBACK DATA (Top 10 Featured Skills)
// ============================================================================

const TOP_SKILLS: Skill[] = [
  {
    id: '1',
    name: 'React',
    category: 'Frontend',
    proficiency: 95,
    yearsOfExperience: 3,
    projectCount: 18,
    icon: '⚛️',
    color: '#22D3EE',
    description: 'Advanced patterns, Server Components, and optimized rendering engines.',
  },
  {
    id: '2',
    name: 'JavaScript',
    category: 'Frontend',
    proficiency: 95,
    yearsOfExperience: 3,
    projectCount: 0,
    icon: 'JS',
    color: '#F7DF1E',
    description: 'ES6+ mastery, async patterns, and high-performance DOM manipulation.',
  },
  {
    id: '3',
    name: 'Node.js',
    category: 'Backend',
    proficiency: 93,
    yearsOfExperience: 3,
    projectCount: 24,
    icon: '🟢',
    color: '#339933',
    description: 'Scalable microservices and high-performance API design.',
  },
  {
    id: '4',
    name: 'Express.js',
    category: 'Backend',
    proficiency: 95,
    yearsOfExperience: 3,
    projectCount: 10,
    icon: 'Ex',
    color: '#FFFFFF',
    description: 'RESTful APIs, middleware architecture, and production server setups.',
  },
  {
    id: '5',
    name: 'MongoDB',
    category: 'Database',
    proficiency: 90,
    yearsOfExperience: 3,
    projectCount: 17,
    icon: '🍃',
    color: '#47A248',
    description: 'NoSQL document stores, aggregation pipelines, and schema design.',
  },
  {
    id: '6',
    name: 'Next.js',
    category: 'Fullstack',
    proficiency: 88,
    yearsOfExperience: 2,
    projectCount: 6,
    icon: '▲',
    color: '#FFFFFF',
    description: 'Production-grade App Router architecture and edge deployment.',
  },
  {
    id: '7',
    name: 'TypeScript',
    category: 'Language',
    proficiency: 85,
    yearsOfExperience: 2,
    projectCount: 2,
    icon: 'TS',
    color: '#3178C6',
    description: 'Type-safety, utility types, and enterprise-scale refactoring.',
  },
  {
    id: '8',
    name: 'Tailwind CSS',
    category: 'Styling',
    proficiency: 90,
    yearsOfExperience: 2,
    projectCount: 9,
    icon: '🎨',
    color: '#38BDF8',
    description: 'Design system implementation and atomic styling at scale.',
  },
  {
    id: '9',
    name: 'Redis',
    category: 'Database',
    proficiency: 80,
    yearsOfExperience: 2,
    projectCount: 10,
    icon: '⚡',
    color: '#DC382D',
    description: 'In-memory caching, pub/sub messaging, and session management.',
  },
  {
    id: '10',
    name: 'Docker',
    category: 'DevOps',
    proficiency: 78,
    yearsOfExperience: 1,
    projectCount: 1,
    icon: '🐳',
    color: '#2496ED',
    description: 'Containerization and streamlined CI/CD orchestration.',
  },
];

const BENTO_CONFIG = [
  'md:col-span-2',
  'md:col-span-1',
  'md:col-span-1',
  'md:col-span-1',
  'md:col-span-1',
  'md:col-span-2',
  'md:col-span-1',
  'md:col-span-1',
  'md:col-span-1',
  'md:col-span-1',
];

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
  ArrowRight: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
};

// ============================================================================
// TEXT MORPH ANIMATION (Scramble from → to)
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
        // Phase 1: Scramble the "from" text progressively
        const scrambleFactor = progress / 0.35;
        let result = '';
        for (let i = 0; i < from.length; i++) {
          if (from[i] === ' ') {
            result += ' ';
          } else if (Math.random() < scrambleFactor) {
            result += CHARS[Math.floor(Math.random() * CHARS.length)];
          } else {
            result += from[i];
          }
        }
        setDisplay(result);
      } else {
        // Phase 2: Resolve to "to" text left-to-right
        const resolveProgress = (progress - 0.35) / 0.65;
        const resolved = Math.floor(resolveProgress * to.length);
        let result = '';
        for (let i = 0; i < to.length; i++) {
          if (to[i] === ' ') {
            result += ' ';
          } else if (i < resolved) {
            result += to[i];
          } else {
            result += CHARS[Math.floor(Math.random() * CHARS.length)];
          }
        }
        setDisplay(result);
      }

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(to);
      }
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
    let start = 0;
    const duration = 1800;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [trigger, target]);

  return (
    <span className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

// ============================================================================
// STAT PILL
// ============================================================================

function StatPill({
  label,
  value,
  suffix,
  trigger,
  delay,
}: {
  label: string;
  value: number;
  suffix: string;
  trigger: boolean;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={trigger ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group/stat relative flex flex-col items-center gap-0.5 px-5 py-2.5 lg:px-6 lg:py-3 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-vision-cyan/15 hover:border-vision-cyan/40 transition-colors duration-500"
    >
      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-slate-300 dark:border-vision-cyan/30 group-hover/stat:border-vision-cyan/70 transition-colors" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-slate-300 dark:border-vision-cyan/30 group-hover/stat:border-vision-cyan/70 transition-colors" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-slate-300 dark:border-vision-cyan/30 group-hover/stat:border-vision-cyan/70 transition-colors" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-slate-300 dark:border-vision-cyan/30 group-hover/stat:border-vision-cyan/70 transition-colors" />

      <span className="text-xl lg:text-2xl font-mono font-black text-slate-800 dark:text-vision-cyan tracking-tight">
        <AnimatedCounter target={value} suffix={suffix} trigger={trigger} />
      </span>
      <span className="text-[8px] font-mono font-bold text-slate-400 dark:text-vision-cyan/40 uppercase tracking-[0.25em]">
        {label}
      </span>
    </motion.div>
  );
}

// ============================================================================
// FLIP SKILL CARD
// ============================================================================

const SkillCard = memo(function SkillCard({
  skill,
  config,
  index,
}: {
  skill: Skill;
  config: string;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), {
    damping: 35,
    stiffness: 180,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), {
    damping: 35,
    stiffness: 180,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isFlipped || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const handleClick = () => {
    setIsFlipped((f) => !f);
    mouseX.set(0);
    mouseY.set(0);
  };

  const proficiencyLabel =
    skill.proficiency >= 90
      ? 'Expert'
      : skill.proficiency >= 75
        ? 'Advanced'
        : skill.proficiency >= 60
          ? 'Proficient'
          : 'Intermediate';

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        rotateX,
        rotateY,
        perspective: '1200px',
        willChange: isHovered ? 'transform' : 'auto',
      }}
      className={cn('group relative rounded-[2rem] cursor-pointer', config)}
    >
      {/* ── Animated Border Beam (on hover) ── */}
      {/* Layer 1: spinning conic gradient masked to border width */}
      <div className="absolute -inset-[1px] rounded-[2rem] overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div
          className="absolute inset-0 animate-spin-slow [animation-play-state:paused] group-hover:[animation-play-state:running]"
          style={{
            background:
              'conic-gradient(from 0deg, transparent 0%, rgba(var(--glow-cyan),1) 10%, transparent 20%, transparent 40%, rgba(var(--glow-crimson),1) 50%, transparent 60%, transparent 80%, rgba(var(--glow-orange),1) 90%, transparent 100%)',
          }}
        />
        <div className="absolute inset-[1.5px] rounded-[calc(2rem-1.5px)] bg-white dark:bg-space-black" />
      </div>
      {/* Layer 2: bright beam dots racing along border */}
      <div className="absolute inset-0 rounded-[2rem] overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div
          className="absolute h-[6px] w-[60px] animate-border-beam"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(var(--glow-cyan),1), transparent)',
            offsetPath: 'rect(0 100% 100% 0 round 32px)',
            boxShadow:
              '0 0 30px 8px rgba(var(--glow-cyan),0.9), 0 0 60px 16px rgba(var(--glow-cyan),0.4)',
            filter: 'blur(0.3px)',
          }}
        />
        <div
          className="absolute h-[6px] w-[50px] animate-border-beam"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(var(--glow-crimson),1), transparent)',
            offsetPath: 'rect(0 100% 100% 0 round 32px)',
            animationDelay: '-1.5s',
            animationDuration: '4s',
            boxShadow:
              '0 0 25px 6px rgba(var(--glow-crimson),0.8), 0 0 50px 12px rgba(var(--glow-crimson),0.35)',
            filter: 'blur(0.3px)',
          }}
        />
      </div>

      {/* Flip container */}
      <motion.div
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full h-full"
      >
        {/* ── FRONT FACE ── */}
        <div
          className="absolute inset-0 rounded-[2rem] glassmorphism border-2 transition-all duration-500 flex flex-col p-4 sm:p-5 overflow-hidden bg-white/[0.05] dark:bg-space-black/40 group-hover:bg-white/95 dark:group-hover:bg-space-black/95 border-slate-200 dark:border-white/10 group-hover:border-transparent shadow-xl"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Background ambience */}
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
            <div
              className="absolute inset-0 blur-[20px] opacity-20"
              style={{
                background: `radial-gradient(circle at center, ${skill.color}, transparent)`,
              }}
            />
          </div>

          <div className="relative z-10 h-full flex flex-col">
            <div className="flex justify-between items-start mb-3 sm:mb-5">
              <div className="flex items-center gap-2 sm:gap-3">
                <SkillIcon skill={skill} size="sm" />
                <div>
                  <h4 className="text-sm sm:text-base font-display font-black text-slate-900 dark:text-text-dark tracking-tighter uppercase italic group-hover:text-vision-cyan transition-colors leading-tight">
                    {skill.name}
                  </h4>
                  <span className="text-[8px] font-mono font-black text-slate-400 dark:text-text-dark/30 uppercase tracking-[0.25em]">
                    {skill.category}
                  </span>
                </div>
              </div>
              <div className="text-[9px] font-mono font-black text-vision-cyan/60 group-hover:text-vision-cyan transition-colors shrink-0">
                {skill.proficiency}%
              </div>
            </div>

            {config.includes('md:col-span-2') && (
              <p className="hidden sm:block text-[11px] font-bold leading-relaxed text-slate-500 dark:text-text-dark/50 mb-4 line-clamp-2 md:line-clamp-none">
                {skill.description}
              </p>
            )}

            <div className="mt-auto space-y-2 sm:space-y-3">
              <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.proficiency}%` }}
                  transition={{ duration: 1.5, delay: 0.3 }}
                  className="h-full bg-gradient-to-r from-vision-crimson via-vision-orange to-vision-cyan shadow-[0_0_15px_rgba(var(--glow-cyan),0.4)]"
                />
              </div>
              <div className="flex justify-between items-center text-[8px] font-mono font-black text-slate-400 dark:text-text-dark/30 uppercase tracking-widest">
                <div className="flex items-center gap-1.5">
                  <span className="text-vision-cyan">EXP:</span>
                  <span className="text-slate-900 dark:text-text-dark/70">
                    {skill.yearsOfExperience}Y
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-vision-crimson">PROJ:</span>
                  <span className="text-slate-900 dark:text-text-dark/70">
                    {skill.projectCount}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tap hint */}
          <div className="absolute bottom-2 right-3 text-[7px] font-mono text-slate-300 dark:text-white/15 uppercase tracking-widest select-none">
            tap ↻
          </div>
          {/* Corner brackets */}
          <div className="absolute top-4 sm:top-5 left-4 sm:left-5 w-4 h-4 border-t-2 border-l-2 border-vision-crimson/10 rounded-tl-xl group-hover:border-vision-crimson/40 transition-colors" />
          <div className="absolute bottom-4 sm:bottom-5 right-4 sm:right-5 w-4 h-4 border-b-2 border-r-2 border-vision-cyan/10 rounded-br-xl group-hover:border-vision-cyan/40 transition-colors" />
        </div>

        {/* ── BACK FACE ── */}
        <div
          className="absolute inset-0 rounded-[2rem] border-2 flex flex-col p-4 sm:p-5 overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: `radial-gradient(140% 140% at 20% 10%, ${skill.color}20 0%, rgba(255,255,255,0.06) 55%, transparent 100%)`,
            borderColor: `${skill.color}50`,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.12), 0 20px 60px ${skill.color}18`,
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <SkillIcon skill={skill} size="sm" />
            <div>
              <h4
                className="font-display font-black text-sm sm:text-base uppercase italic leading-tight"
                style={{ color: skill.color }}
              >
                {skill.name}
              </h4>
              <span className="text-[8px] font-mono text-slate-400 dark:text-white/30 uppercase tracking-wider">
                {skill.category}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-[10px] sm:text-[11px] font-medium leading-relaxed text-slate-600 dark:text-white/50 flex-1 min-h-0 overflow-hidden line-clamp-2 sm:line-clamp-3">
            {skill.description ||
              `Production-grade ${skill.name} development with deep expertise in advanced patterns and best practices.`}
          </p>

          {/* Bottom stats row */}
          <div className="flex items-end justify-between mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-white/10 dark:border-white/[0.07]">
            {/* Left — Projects (clickable when count > 0) */}
            {skill.projectCount > 0 ? (
              <Link
                href={`/projects?skill=${encodeURIComponent(skill.name)}`}
                onClick={(e) => e.stopPropagation()}
                className="group/proj block"
              >
                <div
                  className="text-xl sm:text-2xl font-mono font-black leading-none transition-opacity group-hover/proj:opacity-70"
                  style={{ color: skill.color }}
                >
                  {skill.projectCount}
                </div>
                <div className="text-[7px] font-mono font-bold text-slate-400 dark:text-white/30 uppercase tracking-[0.2em] mt-0.5 flex items-center gap-1">
                  Projects
                  <span className="text-vision-cyan opacity-0 group-hover/proj:opacity-100 transition-opacity">
                    →
                  </span>
                </div>
              </Link>
            ) : (
              <div>
                <div
                  className="text-xl sm:text-2xl font-mono font-black leading-none"
                  style={{ color: skill.color }}
                >
                  —
                </div>
                <div className="text-[7px] font-mono font-bold text-slate-400 dark:text-white/30 uppercase tracking-[0.2em] mt-0.5">
                  Projects
                </div>
              </div>
            )}

            {/* Right — Level + Experience */}
            <div className="text-right">
              <div
                className="text-[9px] font-mono font-black uppercase tracking-wider"
                style={{ color: skill.color }}
              >
                {proficiencyLabel}
              </div>
              <div className="text-[7px] font-mono text-slate-400 dark:text-white/30 uppercase tracking-[0.15em]">
                {skill.yearsOfExperience}yr exp
              </div>
              <div className="mt-1.5 w-12 sm:w-16 h-1 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${skill.proficiency}%`,
                    background: `linear-gradient(to right, ${skill.color}70, ${skill.color})`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Tap hint */}
          <div className="absolute bottom-2 left-3 text-[7px] font-mono text-slate-300 dark:text-white/15 uppercase tracking-widest select-none">
            tap ↩
          </div>
          {/* Corner accents */}
          <div
            className="absolute top-3 sm:top-4 right-3 sm:right-4 w-3 sm:w-4 h-3 sm:h-4 border-t-2 border-r-2 rounded-tr-lg"
            style={{ borderColor: `${skill.color}50` }}
          />
          <div
            className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 w-3 sm:w-4 h-3 sm:h-4 border-b-2 border-l-2 rounded-bl-lg"
            style={{ borderColor: `${skill.color}50` }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
});

// ============================================================================
// MAGNETIC CTA BUTTON
// ============================================================================

function MagneticCTA() {
  const btnRef = useRef<HTMLDivElement>(null);

  // Ghost springs
  const ghostX = useSpring(0, { damping: 20, stiffness: 200, mass: 0.5 });
  const ghostY = useSpring(0, { damping: 20, stiffness: 200, mass: 0.5 });
  const ghostOpacity = useSpring(0, { damping: 30, stiffness: 300 });
  const ghostScale = useSpring(0.9, { damping: 25, stiffness: 300 });

  // Main button magnetic pull springs
  const btnX = useSpring(0, { damping: 15, stiffness: 150, mass: 0.3 });
  const btnY = useSpring(0, { damping: 15, stiffness: 150, mass: 0.3 });

  const RANGE_X = 300;
  const RANGE_Y = 80;

  const handleAreaMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!btnRef.current) return;
      const rect = btnRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;

      const insideBtn = Math.abs(dx) <= rect.width / 2 + 5 && Math.abs(dy) <= rect.height / 2 + 5;
      const inRangeX = Math.abs(dx) <= RANGE_X + rect.width / 2;
      const inRangeY = Math.abs(dy) <= RANGE_Y + rect.height / 2;

      if (insideBtn) {
        // Magnetic pull on main button
        btnX.set(dx * 0.25);
        btnY.set(dy * 0.25);
        ghostOpacity.set(0);
        ghostScale.set(0.9);
      } else if (inRangeX && inRangeY) {
        // Reset pull, show ghost
        btnX.set(0);
        btnY.set(0);
        ghostX.set(dx);
        ghostY.set(dy);
        const edgeDx = Math.max(0, Math.abs(dx) - rect.width / 2);
        const edgeDy = Math.max(0, Math.abs(dy) - rect.height / 2);
        const outsideDist = Math.sqrt(edgeDx * edgeDx + edgeDy * edgeDy);
        const maxOutsideDist = Math.sqrt(RANGE_X * RANGE_X + RANGE_Y * RANGE_Y);
        const proximity = 1 - outsideDist / maxOutsideDist;
        ghostOpacity.set(Math.pow(proximity, 1.5) * 0.95);
        ghostScale.set(0.92 + proximity * 0.1);
      } else {
        btnX.set(0);
        btnY.set(0);
        ghostOpacity.set(0);
        ghostScale.set(0.9);
      }
    },
    [ghostX, ghostY, ghostOpacity, ghostScale, btnX, btnY]
  );

  const handleAreaMouseLeave = useCallback(() => {
    ghostOpacity.set(0);
    ghostScale.set(0.9);
    btnX.set(0);
    btnY.set(0);
  }, [ghostOpacity, ghostScale, btnX, btnY]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mt-10 flex justify-center"
    >
      <div
        className="relative"
        style={{
          padding: `${RANGE_Y + 30}px ${RANGE_X + 30}px`,
          margin: `-${RANGE_Y + 30}px -${RANGE_X + 30}px`,
        }}
        onMouseMove={handleAreaMouseMove}
        onMouseLeave={handleAreaMouseLeave}
      >
        {/* Main button — magnetic pull wrapper */}
        <div ref={btnRef} className="relative flex justify-center">
          <motion.div style={{ x: btnX, y: btnY }}>
            <Link
              href="/skills"
              className="group relative inline-flex items-center gap-3 px-8 py-3.5 overflow-hidden bg-white/90 dark:bg-space-black/60 border border-slate-200 dark:border-vision-cyan/30 hover:border-vision-cyan/60 text-[11px] font-mono font-bold text-slate-500 dark:text-vision-cyan/60 hover:text-vision-cyan uppercase tracking-[0.3em] transition-all duration-500 shadow-sm hover:shadow-[0_0_40px_rgba(var(--glow-cyan),0.2),0_4px_20px_rgba(0,0,0,0.08)]"
            >
              {/* Shimmer sweep on hover */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-vision-cyan/[0.06] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
              {/* Corner brackets — light up on hover */}
              <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-slate-300 dark:border-vision-cyan/30 group-hover:border-vision-cyan transition-colors duration-300" />
              <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-slate-300 dark:border-vision-cyan/30 group-hover:border-vision-cyan transition-colors duration-300" />
              <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-slate-300 dark:border-vision-cyan/30 group-hover:border-vision-cyan transition-colors duration-300" />
              <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-slate-300 dark:border-vision-cyan/30 group-hover:border-vision-cyan transition-colors duration-300" />
              {/* Count badge */}
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-vision-cyan/10 text-[8px] font-black text-slate-500 dark:text-vision-cyan/70 border border-slate-200 dark:border-vision-cyan/25 group-hover:bg-vision-cyan/20 group-hover:border-vision-cyan/50 group-hover:text-vision-cyan transition-all duration-300 leading-none shrink-0 tabular-nums">
                50
              </span>
              Explore Skills
              {/* Arrow slides right on hover */}
              <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                <Icons.ArrowRight />
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Ghost follower — neon hologram echo */}
        <motion.div
          className="absolute pointer-events-none left-1/2 top-1/2 z-20"
          style={{ x: ghostX, y: ghostY, opacity: ghostOpacity, scale: ghostScale }}
        >
          <Link
            href="/skills"
            className="-translate-x-1/2 -translate-y-1/2 pointer-events-auto relative inline-flex items-center gap-3 px-8 py-3.5 overflow-hidden border border-vision-cyan/70 text-[11px] font-mono font-bold text-vision-cyan uppercase tracking-[0.3em] bg-vision-cyan/[0.08] dark:bg-vision-cyan/[0.06] backdrop-blur-sm shadow-[0_0_50px_rgba(var(--glow-cyan),0.5),0_0_100px_rgba(var(--glow-cyan),0.15),inset_0_0_30px_rgba(var(--glow-cyan),0.06)] cursor-pointer"
          >
            {/* Scan line sweep */}
            <span className="absolute inset-0 bg-gradient-to-b from-transparent via-vision-cyan/[0.1] to-transparent animate-[scan_2.5s_linear_infinite] pointer-events-none" />
            {/* Solid bright corner brackets */}
            <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-vision-cyan" />
            <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-vision-cyan" />
            <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-vision-cyan" />
            <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-vision-cyan" />
            {/* Count badge — cyan filled */}
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-vision-cyan/20 text-[8px] font-black text-vision-cyan border border-vision-cyan/50 leading-none shrink-0 tabular-nums">
              50
            </span>
            Explore Skills
            <Icons.ArrowRight />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const SkillsOverview = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-10%' });
  const headingInView = useInView(headingRef, { once: true, margin: '-20%' });

  // Text morph: "Core Arsenal." → "SKILLS" on scroll
  const morphedText = useTextMorph('Core Arsenal.', 'SKILLS', headingInView, 1400);

  // Backend fetch — falls back to TOP_SKILLS if API is unavailable
  const { data: skillsData } = useQuery(GET_SKILLS, {
    variables: {
      sort: { field: 'PROFICIENCY', order: 'DESC' },
      pagination: { page: 1, limit: 10 },
    },
    errorPolicy: 'all',
  });
  const topSkills: Skill[] =
    skillsData?.skills?.edges?.map((e: any) => e.node).filter(Boolean) ?? TOP_SKILLS;

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative py-16 md:py-20 px-6 bg-white dark:bg-space-black transition-colors duration-1000 overflow-hidden"
    >
      {/* Static background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[500px] pointer-events-none">
        <div className="absolute inset-0 bg-vision-cyan/[0.03] blur-[180px] rounded-full" />
        <div className="absolute inset-0 bg-vision-crimson/[0.02] blur-[200px] rounded-full translate-x-1/4" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ============================================================== */}
        {/* CENTERED HEADING BLOCK                                         */}
        {/* ============================================================== */}
        <div ref={headingRef} className="text-center mb-10 md:mb-14">
          {/* Chip / badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={headingInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-4 px-8 py-2.5 mb-8 rounded-full glassmorphism border-2 border-vision-cyan/40 text-vision-cyan font-mono text-[10px] font-black tracking-[0.6em] uppercase shadow-[0_0_30px_rgba(var(--glow-cyan),0.2)]"
          >
            <Icons.Activity className="animate-pulse" /> Technical_Matrix // v4.2
          </motion.div>

          {/* Morphing heading: "Core Arsenal." → "SKILLS" with glitch */}
          <div className="relative overflow-visible py-4 px-8">
            {/* Faint glow behind the text */}
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
              className="relative text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black leading-none tracking-tighter uppercase italic"
            >
              {/* Glitch layers */}
              <span className="relative inline-block pr-3">
                {/* Main text */}
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-br from-rose-800 via-rose-600 to-rose-800 dark:from-vision-cyan dark:via-white/90 dark:to-vision-cyan">
                  {morphedText || '\u00A0'}
                </span>
                {/* Glitch layer 1 — red shift (uses mix-blend to avoid black bleed) */}
                <span
                  aria-hidden
                  className="absolute inset-0 text-vision-crimson/30 dark:text-vision-crimson/20 animate-[glitch1_3s_infinite] pointer-events-none select-none mix-blend-darken dark:mix-blend-screen"
                >
                  {morphedText || '\u00A0'}
                </span>
                {/* Glitch layer 2 — cyan shift */}
                <span
                  aria-hidden
                  className="absolute inset-0 text-vision-cyan/30 dark:text-vision-cyan/20 animate-[glitch2_3s_infinite] pointer-events-none select-none mix-blend-darken dark:mix-blend-screen"
                >
                  {morphedText || '\u00A0'}
                </span>
              </span>
            </motion.h2>

            {/* Subtitle line */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={headingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-3 text-[10px] md:text-[11px] font-mono font-bold text-slate-400 dark:text-vision-cyan/30 uppercase tracking-[0.35em]"
            >
              [ System.Arsenal ] &mdash; Technologies &amp; Proficiencies
            </motion.p>

            {/* Decorative horizontal line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={headingInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto mt-5 h-px w-24 bg-gradient-to-r from-transparent via-vision-cyan/40 to-transparent"
            />
          </div>
        </div>

        {/* ============================================================== */}
        {/* BENTO GRID                                                     */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-4 md:gap-5 auto-rows-[180px] sm:auto-rows-[185px] md:auto-rows-[185px] md:grid-flow-dense">
          {topSkills.map((skill, idx) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              index={idx}
              config={BENTO_CONFIG[idx] || 'md:col-span-1 md:row-span-1'}
            />
          ))}
        </div>

        {/* Magnetic CTA */}
        <MagneticCTA />
      </div>
    </section>
  );
};

export default SkillsOverview;

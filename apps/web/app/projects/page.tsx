'use client';

import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useState, useRef, memo, useEffect, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PROJECTS } from '@/lib/graphql/queries';
import { ProjectModal, ProjectData } from '@/components/projects/project-modal';
import type { Project } from '@/lib/graphql/__generated__/schema';
import PageStarfield from '@/components/background/PageStarfield';

const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;

type CategoryType = 'All' | 'FRONTEND' | 'BACKEND' | 'DATABASE' | 'FULLSTACK';

// ============================================================================
// ICONS
// ============================================================================

const Icons = {
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
  return {
    id: project.id,
    title: project.title,
    slug: project.slug,
    category: project.category,
    description: project.description,
    fullDescription: project.description,
    status: project.status.toLowerCase() as any,
    featured: project.featured,
    technologies: project.technologies,
    metrics: {
      lighthouse: { performance: 95, accessibility: 98, bestPractices: 100, seo: 92 },
      loadTime: '0.5s',
      uptime: '99.9%',
      responseTime: '15ms',
    },
    architecture: {
      nodes: [
        {
          id: 'n1',
          label: 'Frontend',
          type: 'frontend',
          description: 'User Interface',
          position: { x: 50, y: 50 },
        },
        {
          id: 'n2',
          label: 'Backend',
          type: 'backend',
          description: 'API Layer',
          position: { x: 250, y: 50 },
        },
        {
          id: 'n3',
          label: 'Database',
          type: 'database',
          description: 'Data Store',
          position: { x: 150, y: 150 },
        },
      ],
      connections: [
        { from: 'n1', to: 'n2', animated: true },
        { from: 'n2', to: 'n3', animated: true },
      ],
    },
  };
}

const categoryIcons: Record<string, React.ReactNode> = {
  FRONTEND: <Icons.Rocket />,
  BACKEND: <Icons.Signal />,
  DATABASE: <Icons.Database />,
  FULLSTACK: <Icons.Hex />,
};

// ============================================================================
// HERO SECTION — Interactive Radar Console
// ============================================================================

const HeroSection = memo(
  ({ totalCount, activeCount }: { totalCount: number; activeCount: number }) => {
    const heroRef = useRef<HTMLDivElement>(null);
    const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

    // Animated count
    const [animTotal, setAnimTotal] = useState(0);
    const [animActive, setAnimActive] = useState(0);
    useEffect(() => {
      let t = 0;
      const interval = setInterval(() => {
        t = Math.min(t + 1, totalCount);
        setAnimTotal(t);
        if (t >= totalCount) clearInterval(interval);
      }, 40);
      return () => clearInterval(interval);
    }, [totalCount]);
    useEffect(() => {
      let a = 0;
      const interval = setInterval(() => {
        a = Math.min(a + 1, activeCount);
        setAnimActive(a);
        if (a >= activeCount) clearInterval(interval);
      }, 60);
      return () => clearInterval(interval);
    }, [activeCount]);

    // Typing effect
    const [typedCmd, setTypedCmd] = useState('');
    const cmdText = '> ls --all --missions --status=active';
    useEffect(() => {
      let i = 0;
      const interval = setInterval(() => {
        setTypedCmd(cmdText.slice(0, i + 1));
        i++;
        if (i >= cmdText.length) clearInterval(interval);
      }, 40);
      return () => clearInterval(interval);
    }, []);

    // Radar sweep animation angle — CSS animation instead of JS interval
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
          radarConeRef.current.style.background = `conic-gradient(from ${radarAngle.current - 30}deg at 50% 50%, rgba(34,211,238,0.08), transparent 30deg)`;
        }
        raf = requestAnimationFrame(animate);
      };
      raf = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(raf);
    }, []);

    const handleMouseMove = useCallback(
      (e: React.MouseEvent) => {
        if (!heroRef.current) return;
        const rect = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setGlowPos({ x: x * 100, y: y * 100 });
      },
      []
    );

    return (
      <MotionDiv
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative mb-12 rounded-[2rem] overflow-hidden border border-stone-200/60 dark:border-white/[0.08] bg-white dark:bg-space-black/80"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]"
            style={{
              backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />
          {/* Mouse glow */}
          <div
            className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity"
            style={{
              background: `radial-gradient(600px circle at ${glowPos.x}% ${glowPos.y}%, rgba(34,211,238,0.08), transparent 60%)`,
            }}
          />
          {/* Ambient blurs */}
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-vision-crimson/5 blur-[120px]" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-vision-cyan/5 blur-[120px]" />
        </div>

        <div className="relative z-10 p-8 md:p-10 lg:p-12">
          {/* Top: Breadcrumb + Status */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] text-text-light/40 dark:text-text-dark/30 uppercase">
              <Link href="/" className="hover:text-vision-cyan transition-colors">
                SYS://ROOT
              </Link>
              <Icons.ChevronRight />
              <span className="text-vision-cyan">MISSION_ARCHIVES</span>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] font-mono tracking-[0.3em] text-text-light/30 dark:text-text-dark/20 uppercase">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
              CONNECTED
            </div>
          </div>

          {/* Main hero content row */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-10 mb-10">
            {/* Left: Title + typing — stable, no parallax */}
            <div className="flex-1 space-y-5">
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter text-text-light dark:text-text-dark uppercase italic leading-[0.95]">
                MISSION{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-vision-crimson via-vision-orange to-vision-cyan drop-shadow-[0_0_40px_rgba(34,211,238,0.3)]">
                  ARCHIVES
                </span>
              </h1>

              {/* Terminal typing line */}
              <div className="font-mono text-xs text-vision-cyan/50 dark:text-vision-cyan/70 flex items-center gap-1">
                <span>{typedCmd}</span>
                <span className="inline-block w-[2px] h-3.5 bg-vision-cyan animate-pulse" />
              </div>

              <p className="font-mono text-xs md:text-sm leading-relaxed text-text-light/50 dark:text-text-dark/40 max-w-xl">
                Deployed systems, active operations, and archived missions — all logged, verified,
                and battle-tested.
              </p>
            </div>

            {/* Right: Interactive Mini Radar + Stats */}
            <div className="shrink-0 flex flex-col items-center gap-6">
              {/* Mini radar */}
              <div className="relative w-32 h-32 md:w-40 md:h-40 hidden sm:block">
                {/* Radar rings */}
                {[1, 2, 3].map((ring) => (
                  <div
                    key={ring}
                    className="absolute rounded-full border border-vision-cyan/10 dark:border-vision-cyan/15"
                    style={{
                      inset: `${ring * 15}%`,
                    }}
                  />
                ))}
                {/* Cross hairs */}
                <div className="absolute top-1/2 left-0 right-0 h-px bg-vision-cyan/10" />
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-vision-cyan/10" />
                {/* Sweep beam */}
                <div
                  ref={radarBeamRef}
                  className="absolute top-1/2 left-1/2 w-1/2 h-0.5 origin-left"
                  style={{
                    background: 'linear-gradient(90deg, rgba(34,211,238,0.5), transparent)',
                  }}
                />
                {/* Sweep cone */}
                <div
                  ref={radarConeRef}
                  className="absolute inset-0 rounded-full"
                />
                {/* Center dot */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-vision-cyan shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                {/* Blip dots */}
                {totalCount > 0 && (
                  <>
                    <div className="absolute top-[25%] left-[60%] h-1.5 w-1.5 rounded-full bg-vision-crimson shadow-[0_0_8px_#E11D48] animate-pulse" />
                    <div className="absolute top-[55%] left-[30%] h-1 w-1 rounded-full bg-vision-orange shadow-[0_0_6px_#FB923C] animate-pulse" style={{ animationDelay: '0.5s' }} />
                    <div className="absolute top-[70%] left-[65%] h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399] animate-pulse" style={{ animationDelay: '1s' }} />
                  </>
                )}
              </div>

              {/* Stat chips */}
              <div className="flex items-center gap-3 flex-wrap justify-center">
                {[
                  { label: 'TOTAL', value: animTotal, dotColor: 'bg-vision-cyan' },
                  { label: 'ACTIVE', value: animActive, dotColor: 'bg-emerald-400' },
                  { label: 'UPTIME', value: '99.9%', dotColor: 'bg-vision-orange' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-stone-200/60 dark:border-white/[0.08] bg-stone-50 dark:bg-white/[0.04] font-mono text-[10px] backdrop-blur-sm"
                  >
                    <div className={`h-1.5 w-1.5 rounded-full ${stat.dotColor} animate-pulse shadow-[0_0_6px_currentColor]`} />
                    <span className="text-text-light/40 dark:text-text-dark/30 tracking-[0.2em] uppercase">
                      {stat.label}
                    </span>
                    <span className="text-text-light dark:text-text-dark font-black">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom status bar */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-200/60 dark:border-white/[0.08]">
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
          </div>
        </div>

        {/* HUD Corner brackets */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-vision-crimson/20 dark:border-vision-crimson/30 rounded-tl-lg pointer-events-none" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-vision-cyan/20 dark:border-vision-cyan/30 rounded-tr-lg pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-vision-cyan/20 dark:border-vision-cyan/30 rounded-bl-lg pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-vision-crimson/20 dark:border-vision-crimson/30 rounded-br-lg pointer-events-none" />
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
              ? 'border-vision-cyan/60 text-vision-cyan bg-vision-cyan/10 dark:bg-vision-cyan/[0.07] shadow-[0_0_20px_rgba(34,211,238,0.1)]'
              : 'border-stone-200/60 dark:border-white/[0.08] text-text-light/50 dark:text-text-dark/35 bg-white dark:bg-white/[0.02] hover:border-stone-300 dark:hover:border-white/15 hover:text-text-light/70 dark:hover:text-text-dark/50'
          }
        `}
        >
          <span className="flex items-center gap-2">
            {cat !== 'All' && <span className="opacity-60">{categoryIcons[cat]}</span>}
            {cat === 'All' ? 'ALL MISSIONS' : cat}
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
        className="group/card relative h-full"
        style={{ perspective: '2000px' }}
      >
        {/* Outer beam wrapper */}
        <MotionDiv
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY }}
          className="relative rounded-[2.5rem] h-full transition-shadow duration-700 hover:shadow-[0_0_60px_rgba(34,211,238,0.2),_0_0_120px_rgba(34,211,238,0.08)]"
        >
          {/* Spinning conic-gradient border */}
          <div className="absolute -inset-[1px] rounded-[2.5rem] overflow-hidden opacity-0 group-hover/card:opacity-100 transition-opacity duration-500">
            <div
              className="absolute inset-0 animate-spin-slow"
              style={{
                background:
                  'conic-gradient(from 0deg, transparent 0%, rgba(34,211,238,1) 10%, transparent 20%, transparent 40%, rgba(225,29,72,1) 50%, transparent 60%, transparent 80%, rgba(251,146,60,1) 90%, transparent 100%)',
              }}
            />
            <div className="absolute inset-[1.5px] rounded-[calc(1.25rem-1.5px)] bg-white dark:bg-space-black" />
          </div>

          {/* Traveling beam dots */}
          <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none">
            <div
              className="absolute h-[10px] w-[100px] animate-border-beam"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(34,211,238,1), transparent)',
                offsetPath: 'rect(0 100% 100% 0 round 20px)',
                boxShadow: '0 0 40px 10px rgba(34,211,238,0.9), 0 0 80px 20px rgba(34,211,238,0.4)',
                filter: 'blur(0.3px)',
              }}
            />
            <div
              className="absolute h-[10px] w-[60px] animate-border-beam"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(225,29,72,1), transparent)',
                offsetPath: 'rect(0 100% 100% 0 round 20px)',
                animationDelay: '-1.5s',
                animationDuration: '4s',
                boxShadow: '0 0 35px 8px rgba(225,29,72,0.8), 0 0 70px 16px rgba(225,29,72,0.35)',
                filter: 'blur(0.3px)',
              }}
            />
          </div>

          {/* Card body — home page style */}
          <div className="relative p-8 md:p-10 h-full rounded-[2.5rem] flex flex-col overflow-hidden border-[1px] backdrop-blur-[40px] bg-white/95 dark:bg-space-black/90 border-slate-300/50 dark:border-white/10 transition-all duration-700 group-hover/card:border-transparent min-h-[420px]">
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

            {/* Parallax Content */}
            <MotionDiv
              style={{ x: contentX, y: contentY }}
              className="relative z-10 flex-1 flex flex-col"
            >
              {/* Header: ID + category + hex icon */}
              <div className="flex justify-between items-start mb-10">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-vision-crimson shadow-[0_0_12px_#E11D48] animate-pulse" />
                    <span className="text-[11px] font-mono font-black text-vision-crimson uppercase tracking-[0.6em] drop-shadow-[0_0_10px_rgba(225,29,72,0.5)]">
                      LOG_{String(project.id).slice(-6).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-400 dark:text-text-dark/30 uppercase tracking-[0.4em] italic">
                    {categoryIcons[project.category] && (
                      <span className="opacity-60 group-hover/card:opacity-100 group-hover/card:text-vision-cyan transition-all">
                        {categoryIcons[project.category]}
                      </span>
                    )}
                    {project.category}
                  </div>
                </div>
                <div className="h-12 w-12 rounded-2xl flex items-center justify-center text-slate-300 dark:text-text-dark/20 group-hover/card:text-vision-cyan border border-slate-200 dark:border-white/5 group-hover/card:border-vision-cyan/40 transition-all shadow-xl bg-white/20 dark:bg-black/40 backdrop-blur-sm">
                  <Icons.Hex />
                </div>
              </div>

              {/* Title + description */}
              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-display font-black text-slate-900 dark:text-text-dark tracking-tighter uppercase italic group-hover/card:text-vision-cyan transition-colors duration-500 leading-[1.1]">
                  {project.title}
                </h3>
                <p className="text-[13px] font-bold leading-relaxed text-slate-600 dark:text-text-dark/50 line-clamp-3">
                  {project.description}
                </p>
              </div>
            </MotionDiv>

            {/* Bottom section */}
            <div className="mt-10 space-y-6 relative z-10">
              {/* Tech tags */}
              <div className="flex flex-wrap gap-2">
                {project.technologies.slice(0, 4).map((t) => (
                  <span
                    key={t}
                    className="px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-xl text-[9px] font-mono font-black text-slate-600 dark:text-text-dark/40 border border-slate-200 dark:border-white/5 group-hover/card:border-vision-cyan/30 transition-all uppercase tracking-tight"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Footer: status + action */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-200/60 dark:border-white/10">
                <div className="flex flex-col gap-1.5">
                  <div className="text-[8px] font-mono font-black text-slate-400 dark:text-text-dark/20 uppercase tracking-[0.4em]">
                    Status
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${statusColor} shadow-[0_0_14px_currentColor] animate-pulse`} />
                    <span className="text-[11px] font-mono font-black tracking-[0.2em] text-slate-900 dark:text-text-dark uppercase">
                      {project.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onSelect(project)}
                  className="h-12 w-12 rounded-2xl flex items-center justify-center text-slate-400 dark:text-text-dark/40 hover:text-white dark:hover:text-space-black hover:bg-vision-crimson dark:hover:bg-vision-cyan hover:scale-110 transition-all border border-slate-200 dark:border-white/5 shadow-[0_15px_30px_rgba(0,0,0,0.1)] bg-white/20 dark:bg-black/40 backdrop-blur-sm"
                >
                  <Icons.External />
                </button>
              </div>
            </div>

            {/* HUD Brackets — Crimson & Cyan with Glow */}
            <div className="absolute top-5 left-5 w-8 h-8 border-t-[3px] border-l-[3px] border-vision-crimson/40 rounded-tl-xl group-hover/card:border-vision-crimson group-hover/card:shadow-[0_0_20px_#E11D48] transition-all duration-500" />
            <div className="absolute bottom-5 right-5 w-8 h-8 border-b-[3px] border-r-[3px] border-vision-cyan/40 rounded-br-xl group-hover/card:border-vision-cyan group-hover/card:shadow-[0_0_20px_#22D3EE] transition-all duration-500" />
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
    className="relative rounded-[2.5rem] h-[420px] overflow-hidden border border-slate-300/50 dark:border-white/10 bg-white/95 dark:bg-space-black/90"
  >
    <div className="p-8 md:p-10 h-full flex flex-col">
      <div className="flex justify-between mb-5">
        <div className="space-y-2">
          <div className="h-2 w-16 rounded bg-stone-200 dark:bg-white/[0.06] animate-pulse" />
          <div className="h-2 w-10 rounded bg-stone-200 dark:bg-white/[0.06] animate-pulse" />
        </div>
        <div className="h-8 w-8 rounded-lg bg-stone-200 dark:bg-white/[0.06] animate-pulse" />
      </div>
      <div className="space-y-3 flex-1">
        <div className="h-5 w-3/4 rounded bg-stone-200 dark:bg-white/[0.06] animate-pulse" />
        <div className="h-3 w-full rounded bg-stone-100 dark:bg-white/[0.04] animate-pulse" />
        <div className="h-3 w-2/3 rounded bg-stone-100 dark:bg-white/[0.04] animate-pulse" />
      </div>
      <div className="mt-auto pt-5 space-y-5">
        <div className="flex gap-1.5">
          {[1, 2, 3].map((j) => (
            <div
              key={j}
              className="h-5 w-14 rounded-md bg-stone-100 dark:bg-white/[0.04] animate-pulse"
            />
          ))}
        </div>
        <div className="pt-4 border-t border-stone-200/60 dark:border-white/[0.06] flex justify-between">
          <div className="h-4 w-16 rounded bg-stone-200 dark:bg-white/[0.06] animate-pulse" />
          <div className="h-9 w-9 rounded-lg bg-stone-200 dark:bg-white/[0.06] animate-pulse" />
        </div>
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
            style={{ boxShadow: '0 0 12px rgba(34,211,238,0.4)' }}
          />
        </div>

        <div className="flex items-center gap-4">
          {/* Prev button */}
          <MotionButton
            onClick={onPrev}
            disabled={!pageInfo?.hasPreviousPage}
            className="group relative px-6 py-3 rounded-xl border border-stone-200/60 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] text-[10px] font-mono tracking-[0.3em] uppercase text-text-light/50 dark:text-text-dark/35 overflow-hidden disabled:opacity-20 disabled:cursor-not-allowed backdrop-blur-sm"
            whileHover={!pageInfo?.hasPreviousPage ? {} : { scale: 1.05, borderColor: 'rgba(34,211,238,0.4)' }}
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
            <span className="text-base font-mono font-black text-vision-cyan drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
              {String(current).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-mono text-text-light/30 dark:text-text-dark/20">/</span>
            <span className="text-base font-mono font-black text-text-light/50 dark:text-text-dark/30">
              {String(total).padStart(2, '0')}
            </span>
            {/* Scanline effect */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_49%,rgba(34,211,238,0.03)_50%,transparent_51%)] bg-[size:100%_4px] pointer-events-none" />
          </MotionDiv>

          {/* Next button */}
          <MotionButton
            onClick={onNext}
            disabled={!pageInfo?.hasNextPage}
            className="group relative px-6 py-3 rounded-xl border border-stone-200/60 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] text-[10px] font-mono tracking-[0.3em] uppercase text-text-light/50 dark:text-text-dark/35 overflow-hidden disabled:opacity-20 disabled:cursor-not-allowed backdrop-blur-sm"
            whileHover={!pageInfo?.hasNextPage ? {} : { scale: 1.05, borderColor: 'rgba(34,211,238,0.4)' }}
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
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
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
  const pageInfo = data?.projects?.pageInfo;
  const totalCount = data?.projects?.totalCount ?? projects.length;

  useEffect(() => {
    setPage(1);
  }, [selectedCategory]);

  return (
    <main className="relative min-h-screen bg-stone-50 dark:bg-space-black text-text-light dark:text-text-dark overflow-hidden transition-colors duration-1000">
      <PageStarfield density={60} />
      {/* Grid overlay (dark mode only) */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_90%)] dark:opacity-100 opacity-0 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-6 pt-24 pb-20">
        {/* Command Console Hero */}
        <HeroSection
          totalCount={totalCount}
          activeCount={projects.filter((p: ProjectData) => p.status === 'in-progress').length}
        />

        {/* Category Filters */}
        <CategoryFilters
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

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
              ⚠ Error loading mission logs. Retry connection.
            </p>
          </MotionDiv>
        ) : projects.length === 0 ? (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 rounded-2xl border border-stone-200/60 dark:border-white/[0.06] bg-white dark:bg-white/[0.02]"
          >
            <p className="text-sm font-mono text-text-light/50 dark:text-text-dark/30">
              No missions found in this category.
            </p>
          </MotionDiv>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <AnimatePresence mode="popLayout">
              {projects.map((project: ProjectData, index: number) => (
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

        {/* Return link */}
        <MotionDiv
          className="flex justify-center mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Link href="/" className="group">
            <MotionDiv
              className="relative px-8 py-4 font-mono text-[10px] tracking-[0.3em] text-text-light/50 dark:text-text-dark/35 uppercase border border-stone-200/60 dark:border-white/[0.08] rounded-xl bg-white dark:bg-white/[0.03] overflow-hidden backdrop-blur-sm"
              whileHover={{ scale: 1.03, borderColor: 'rgba(34,211,238,0.4)' }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <span className="relative z-10 flex items-center gap-2 group-hover:text-vision-cyan transition-colors duration-300">
                <MotionDiv
                  className="inline-block"
                  animate={{ x: [0, -3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  ←
                </MotionDiv>
                Return to Main Terminal
              </span>
              {/* Glow overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-r from-vision-cyan/10 via-vision-cyan/5 to-vision-crimson/10" />
              {/* Bottom glow line */}
              <div className="absolute bottom-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-vision-cyan/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_12px_rgba(34,211,238,0.5)]" />
            </MotionDiv>
          </Link>
        </MotionDiv>
      </div>

      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </main>
  );
}

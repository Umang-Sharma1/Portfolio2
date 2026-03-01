'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

const MotionDiv = motion.div as any;

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
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
  Signal: () => (
    <svg
      width="14"
      height="14"
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
      <path d="M22 4v16" />
    </svg>
  ),
};

// ============================================================================
// TIMELINE DATA
// ============================================================================

interface Milestone {
  year: string;
  title: string;
  org: string;
  description: string;
  status: 'ACTIVE' | 'COMPLETED';
  tech: string[];
}

const MILESTONES: Milestone[] = [
  {
    year: '2024',
    title: 'Senior Full-Stack Engineer',
    org: 'Tech Voyager Labs',
    description:
      'Leading architecture for next-gen web applications. Designing scalable systems with React, Next.js, and cloud-native infrastructure.',
    status: 'ACTIVE',
    tech: ['Next.js', 'TypeScript', 'AWS', 'GraphQL'],
  },
  {
    year: '2022',
    title: 'Full-Stack Developer',
    org: 'Digital Frontier Co.',
    description:
      'Built scalable SaaS platforms serving 100K+ users. Architected microservices with Node.js and deployed on cloud infrastructure.',
    status: 'COMPLETED',
    tech: ['React', 'Node.js', 'MongoDB', 'Docker'],
  },
  {
    year: '2021',
    title: 'Frontend Engineer',
    org: 'Pixel Matrix Inc.',
    description:
      'Crafted high-performance UI systems and design language frameworks for enterprise clients. Led frontend architecture decisions.',
    status: 'COMPLETED',
    tech: ['React', 'TypeScript', 'Tailwind', 'Figma'],
  },
  {
    year: '2020',
    title: 'Software Engineer Intern',
    org: 'Code Nebula',
    description:
      'First mission deployment. Rapid prototyping, agile workflows, and production-grade code delivery under mentorship.',
    status: 'COMPLETED',
    tech: ['JavaScript', 'Python', 'Git', 'REST API'],
  },
];

// ============================================================================
// MILESTONE CARD
// ============================================================================

const MilestoneCard = ({
  milestone,
  index,
  isLast,
}: {
  milestone: Milestone;
  index: number;
  isLast: boolean;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-80px' });
  const isActive = milestone.status === 'ACTIVE';

  return (
    <div ref={cardRef} className="relative flex gap-6 md:gap-10">
      {/* Timeline Rail */}
      <div className="flex flex-col items-center flex-shrink-0">
        {/* Node */}
        <MotionDiv
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className={cn(
            'relative h-12 w-12 rounded-2xl flex items-center justify-center border-2 z-10',
            isActive
              ? 'bg-vision-cyan/10 border-vision-cyan text-vision-cyan shadow-[0_0_25px_rgba(34,211,238,0.3)]'
              : 'bg-white/5 dark:bg-white/[0.03] border-slate-300 dark:border-white/10 text-slate-400 dark:text-white/20'
          )}
        >
          {isActive ? (
            <Icons.Rocket className="animate-pulse" />
          ) : (
            <Icons.Briefcase />
          )}
          {/* Active ping */}
          {isActive && (
            <div className="absolute inset-0 rounded-2xl border-2 border-vision-cyan animate-ping opacity-20" />
          )}
        </MotionDiv>

        {/* Connector line */}
        {!isLast && (
          <MotionDiv
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
            className="w-[2px] flex-1 origin-top bg-gradient-to-b from-vision-cyan/20 via-white/10 to-transparent min-h-[40px]"
          />
        )}
      </div>

      {/* Content Card */}
      <MotionDiv
        initial={{ opacity: 0, x: -20, y: 10 }}
        animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
        transition={{ duration: 0.7, delay: index * 0.1 + 0.1, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'group relative flex-1 rounded-[2rem] p-6 md:p-8 mb-8 border-[0.5px] transition-all duration-700',
          isActive
            ? 'glassmorphism border-vision-cyan/30 shadow-[0_20px_60px_rgba(34,211,238,0.08)] hover:border-vision-cyan/50'
            : 'bg-white/[0.02] dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06] hover:border-white/15'
        )}
      >
        {/* Year badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                'text-[10px] font-mono font-black uppercase tracking-[0.5em] px-4 py-1.5 rounded-full border',
                isActive
                  ? 'text-vision-cyan border-vision-cyan/30 bg-vision-cyan/5'
                  : 'text-slate-400 dark:text-white/20 border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02]'
              )}
            >
              {milestone.year}
            </span>
            {isActive && (
              <span className="text-[8px] font-mono font-black text-vision-cyan/80 tracking-[0.4em] uppercase flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-vision-cyan animate-pulse" />
                Active_Mission
              </span>
            )}
          </div>
        </div>

        {/* Title & Org */}
        <h3
          className={cn(
            'text-lg md:text-xl font-display font-black tracking-tight uppercase italic mb-1',
            isActive
              ? 'text-vision-cyan'
              : 'text-slate-900 dark:text-text-dark group-hover:text-vision-cyan transition-colors'
          )}
        >
          {milestone.title}
        </h3>
        <p className="text-[11px] font-mono font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.3em] mb-4">
          @ {milestone.org}
        </p>

        {/* Description */}
        <p className="text-sm font-bold leading-relaxed text-slate-500 dark:text-text-dark/40 mb-5">
          {milestone.description}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-2">
          {milestone.tech.map((t) => (
            <span
              key={t}
              className={cn(
                'text-[9px] font-mono font-black uppercase tracking-wider px-3 py-1 rounded-lg border',
                isActive
                  ? 'text-vision-cyan/70 border-vision-cyan/20 bg-vision-cyan/5'
                  : 'text-slate-400 dark:text-white/15 border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]'
              )}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Corner brackets */}
        <div
          className={cn(
            'absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 rounded-tl-lg transition-colors',
            isActive
              ? 'border-vision-crimson/30'
              : 'border-vision-crimson/10 group-hover:border-vision-crimson/30'
          )}
        />
        <div
          className={cn(
            'absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 rounded-br-lg transition-colors',
            isActive
              ? 'border-vision-cyan/30'
              : 'border-vision-cyan/10 group-hover:border-vision-cyan/30'
          )}
        />
      </MotionDiv>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const ExperienceTimeline = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-10%' });

  return (
    <section
      ref={sectionRef}
      id="timeline"
      className="relative py-28 px-6 bg-white dark:bg-space-black transition-colors duration-1000 overflow-hidden"
    >
      {/* Background ambience */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 bg-vision-cyan/[0.03] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-vision-crimson/[0.02] blur-[180px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-10">
          <div className="space-y-6">
            <MotionDiv
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              className="inline-flex items-center gap-4 px-8 py-2.5 rounded-full glassmorphism border-2 border-vision-cyan/40 text-vision-cyan font-mono text-[10px] font-black tracking-[0.6em] uppercase shadow-[0_0_30px_rgba(34,211,238,0.2)]"
            >
              <Icons.Activity className="animate-pulse" /> Mission_Chronolog // v2.0
            </MotionDiv>
            <h2 className="text-5xl md:text-6xl font-display font-black leading-[0.9] tracking-tighter text-slate-900 dark:text-text-dark uppercase italic">
              Flight <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-vision-orange via-vision-cyan to-vision-orange drop-shadow-2xl">
                Path.
              </span>
            </h2>
          </div>

          {/* Signal strength indicator */}
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4 text-[10px] font-mono font-black text-slate-400 dark:text-white/20 uppercase tracking-widest"
          >
            <Icons.Signal />
            <span>{MILESTONES.length} Missions Logged</span>
          </MotionDiv>
        </div>

        {/* Timeline */}
        <div className="relative">
          {MILESTONES.map((milestone, idx) => (
            <MilestoneCard
              key={milestone.year + milestone.title}
              milestone={milestone}
              index={idx}
              isLast={idx === MILESTONES.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceTimeline;

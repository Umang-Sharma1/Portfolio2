'use client';

import React, { useRef, memo, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import Link from 'next/link';
import { useSkills } from '@/hooks/use-skills';

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
    proficiency: 98,
    yearsOfExperience: 5,
    projectCount: 32,
    icon: '⚛️',
    color: '#22D3EE',
    description: 'Advanced patterns, Server Components, and optimized rendering engines.',
  },
  {
    id: '2',
    name: 'Next.js',
    category: 'Fullstack',
    proficiency: 95,
    yearsOfExperience: 4,
    projectCount: 24,
    icon: '▲',
    color: '#FFFFFF',
    description: 'Production-grade App Router architecture and edge deployment.',
  },
  {
    id: '3',
    name: 'TypeScript',
    category: 'Language',
    proficiency: 94,
    yearsOfExperience: 5,
    projectCount: 40,
    icon: 'TS',
    color: '#3178C6',
    description: 'Deep type-safety, utility types, and enterprise-scale refactoring.',
  },
  {
    id: '4',
    name: 'Node.js',
    category: 'Backend',
    proficiency: 90,
    yearsOfExperience: 5,
    projectCount: 28,
    icon: '🟢',
    color: '#339933',
    description: 'Scalable microservices and high-performance API design.',
  },
  {
    id: '5',
    name: 'Tailwind CSS',
    category: 'Styling',
    proficiency: 96,
    yearsOfExperience: 4,
    projectCount: 35,
    icon: '🎨',
    color: '#38BDF8',
    description: 'Design system implementation and atomic styling at scale.',
  },
  {
    id: '6',
    name: 'GraphQL',
    category: 'API',
    proficiency: 88,
    yearsOfExperience: 3,
    projectCount: 15,
    icon: '◈',
    color: '#E10098',
    description: 'Federated schemas, optimized resolvers, and real-time subscriptions.',
  },
  {
    id: '7',
    name: 'Three.js',
    category: 'Graphics',
    proficiency: 82,
    yearsOfExperience: 2,
    projectCount: 10,
    icon: '🎮',
    color: '#FB923C',
    description: 'Spatial computing, GLSL shaders, and 3D web experiences.',
  },
  {
    id: '8',
    name: 'AWS',
    category: 'DevOps',
    proficiency: 80,
    yearsOfExperience: 3,
    projectCount: 12,
    icon: '☁️',
    color: '#FF9900',
    description: 'Serverless architecture, S3 storage, and Lambda orchestration.',
  },
  {
    id: '9',
    name: 'Docker',
    category: 'DevOps',
    proficiency: 85,
    yearsOfExperience: 3,
    projectCount: 14,
    icon: '🐳',
    color: '#2496ED',
    description: 'Containerization and streamlined CI/CD orchestration.',
  },
  {
    id: '10',
    name: 'Python',
    category: 'Backend',
    proficiency: 84,
    yearsOfExperience: 4,
    projectCount: 18,
    icon: '🐍',
    color: '#3776AB',
    description: 'Data processing, automation scripts, and ML integrations.',
  },
];

const BENTO_CONFIG = [
  'md:col-span-2 md:row-span-2',
  'md:col-span-1 md:row-span-1',
  'md:col-span-1 md:row-span-2',
  'md:col-span-1 md:row-span-1',
  'md:col-span-1 md:row-span-1',
  'md:col-span-2 md:row-span-1',
  'md:col-span-1 md:row-span-2',
  'md:col-span-1 md:row-span-1',
  'md:col-span-1 md:row-span-1',
  'md:col-span-1 md:row-span-1',
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
// LAZY ICONS
// ============================================================================

const LazyIcons = {
  Atom: dynamic(() => import('lucide-react').then((m) => m.Atom), { ssr: false }),
  Layers: dynamic(() => import('lucide-react').then((m) => m.Layers), { ssr: false }),
  Code2: dynamic(() => import('lucide-react').then((m) => m.Code2), { ssr: false }),
  Server: dynamic(() => import('lucide-react').then((m) => m.Server), { ssr: false }),
  Database: dynamic(() => import('lucide-react').then((m) => m.Database), { ssr: false }),
  Cloud: dynamic(() => import('lucide-react').then((m) => m.Cloud), { ssr: false }),
  Hexagon: dynamic(() => import('lucide-react').then((m) => m.Hexagon), { ssr: false }),
  Sparkles: dynamic(() => import('lucide-react').then((m) => m.Sparkles), { ssr: false }),
  Box: dynamic(() => import('lucide-react').then((m) => m.Box), { ssr: false }),
  Terminal: dynamic(() => import('lucide-react').then((m) => m.Terminal), { ssr: false }),
  Cpu: dynamic(() => import('lucide-react').then((m) => m.Cpu), { ssr: false }),
};

const iconKey = (value?: string) => (value || '').toLowerCase().replace(/[^a-z0-9]/g, '');

const SkillIcon = memo(function SkillIcon({ skill }: { skill: Skill }) {
  const key = iconKey(skill.icon || skill.name);
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    react: LazyIcons.Atom,
    nextjs: LazyIcons.Layers,
    typescript: LazyIcons.Code2,
    javascript: LazyIcons.Code2,
    nodejs: LazyIcons.Server,
    graphql: LazyIcons.Hexagon,
    tailwindcss: LazyIcons.Sparkles,
    tailwind: LazyIcons.Sparkles,
    docker: LazyIcons.Box,
    aws: LazyIcons.Cloud,
    python: LazyIcons.Terminal,
    mongodb: LazyIcons.Database,
    postgres: LazyIcons.Database,
    postgresql: LazyIcons.Database,
    redis: LazyIcons.Cpu,
  };

  const Icon = iconMap[key];
  if (Icon) {
    return <Icon className="h-8 w-8 text-vision-cyan" />;
  }

  return (
    <span className="text-3xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
      {skill.icon || '✶'}
    </span>
  );
});

// ============================================================================
// ANIMATED PROFICIENCY BAR
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
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7, -7]), {
    damping: 20,
    stiffness: 200,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), {
    damping: 20,
    stiffness: 200,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.8, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => setIsTooltipOpen((prev) => !prev)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsTooltipOpen((prev) => !prev);
        }
      }}
      tabIndex={0}
      role="button"
      aria-expanded={isTooltipOpen}
      style={{ rotateX, rotateY, perspective: '1000px' }}
      className={cn(
        'group relative rounded-[2.5rem] glassmorphism border-2 transition-all duration-700 flex flex-col p-8 overflow-hidden will-change-transform',
        'bg-white/[0.05] dark:bg-space-black/40 border-slate-200 dark:border-white/10 hover:border-vision-cyan/40 shadow-xl hover:-translate-y-2',
        config
      )}
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
        <div
          className="absolute inset-0 blur-[60px] opacity-20"
          style={{ background: `radial-gradient(circle at center, ${skill.color}, transparent)` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(34,211,238,0.02)_50%)] bg-[length:100%_4px] animate-scan" />
      </div>

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <SkillIcon skill={skill} />
            <div>
              <h4 className="text-lg font-display font-black text-slate-900 dark:text-text-dark tracking-tighter uppercase italic group-hover:text-vision-cyan transition-colors">
                {skill.name}
              </h4>
              <span className="text-[9px] font-mono font-black text-slate-400 dark:text-text-dark/20 uppercase tracking-[0.3em]">
                {skill.category}
              </span>
            </div>
          </div>
          <div className="text-[10px] font-mono font-black text-vision-cyan/60 group-hover:text-vision-cyan transition-colors">
            {skill.proficiency}%
          </div>
        </div>

        {config.includes('md:row-span-2') && (
          <p className="text-[12px] font-bold leading-relaxed text-slate-500 dark:text-text-dark/40 mb-6 line-clamp-2 md:line-clamp-none">
            {skill.description}
          </p>
        )}

        <div className="mt-auto space-y-4">
          <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${skill.proficiency}%` }}
              transition={{ duration: 1.5, delay: 0.3 }}
              className="h-full bg-gradient-to-r from-vision-crimson via-vision-orange to-vision-cyan shadow-[0_0_15px_rgba(34,211,238,0.4)]"
            />
          </div>

          <div className="flex justify-between items-center text-[9px] font-mono font-black text-slate-400 dark:text-text-dark/20 uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <span className="text-vision-cyan">EXP:</span>
              <span className="text-slate-900 dark:text-text-dark/60">
                {skill.yearsOfExperience}Y
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-vision-crimson">PROJ:</span>
              <span className="text-slate-900 dark:text-text-dark/60">{skill.projectCount}</span>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isTooltipOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
            className="absolute left-6 right-6 bottom-6 rounded-2xl bg-white/90 dark:bg-space-black/80 backdrop-blur-xl border border-vision-cyan/30 p-4 text-xs text-slate-700 dark:text-text-dark/80 shadow-[0_20px_60px_rgba(34,211,238,0.15)]"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-vision-cyan">
                Detail_Pulse
              </span>
              <span className="font-mono text-[10px] font-black text-vision-crimson">
                {skill.yearsOfExperience}Y • {skill.projectCount} Missions
              </span>
            </div>
            <p className="text-[12px] font-semibold leading-relaxed">
              {skill.description ||
                'Deep operational expertise with consistent delivery across missions.'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Brackets */}
      <div className="absolute top-6 left-6 w-5 h-5 border-t-2 border-l-2 border-vision-crimson/10 rounded-tl-xl group-hover:border-vision-crimson/40 transition-colors" />
      <div className="absolute bottom-6 right-6 w-5 h-5 border-b-2 border-r-2 border-vision-cyan/10 rounded-br-xl group-hover:border-vision-cyan/40 transition-colors" />
    </motion.div>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const SkillsOverview = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-10%' });
  const { skills, loading } = useSkills({ limit: 10 });
  const topSkills = skills.length ? skills.slice(0, 10) : TOP_SKILLS;

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative py-20 px-6 bg-white dark:bg-space-black transition-colors duration-1000 overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-96 bg-vision-crimson/[0.02] blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-12 gap-10">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              className="inline-flex items-center gap-4 px-8 py-2.5 rounded-full glassmorphism border-2 border-vision-cyan/40 text-vision-cyan font-mono text-[10px] font-black tracking-[0.6em] uppercase shadow-[0_0_30px_rgba(34,211,238,0.2)]"
            >
              <Icons.Activity className="animate-pulse" /> Technical_Matrix // v4.2
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-display font-black leading-[0.9] tracking-tighter text-slate-900 dark:text-text-dark uppercase italic">
              Core <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-vision-crimson via-vision-orange to-vision-cyan text-glow-cyan drop-shadow-2xl">
                Arsenal.
              </span>
            </h2>
          </div>

          <Link
            href="/skills"
            className="group flex items-center gap-6 text-[12px] font-mono font-black uppercase tracking-[0.5em] text-slate-400 dark:text-text-dark/30 hover:text-vision-cyan transition-all duration-700"
          >
            Establish_Full_Manifest{' '}
            <div className="h-[2px] w-12 bg-current group-hover:w-24 transition-all duration-700 opacity-40 group-hover:opacity-100" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[160px] md:grid-flow-dense">
          {(loading ? TOP_SKILLS : topSkills).map((skill, idx) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              index={idx}
              config={BENTO_CONFIG[idx] || 'md:col-span-1 md:row-span-1'}
            />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/skills"
            className="px-12 py-5 glassmorphism border-2 border-vision-cyan/30 rounded-2xl text-[12px] font-mono font-black text-vision-cyan uppercase tracking-[0.5em] hover:scale-105 hover:bg-vision-cyan/5 hover:border-vision-cyan/60 transition-all shadow-[0_15px_40px_rgba(34,211,238,0.2)] flex items-center gap-4"
          >
            View All 50+ Skills <Icons.ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SkillsOverview;

'use client';

import React, { useState, useRef, memo, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  motion,
  useInView,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  thumbnail: string;
  videoPreview?: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  lighthouseScore?: number;
  users?: string;
  featured: boolean;
  category: string;
}

interface ProjectCardProps {
  project: Project;
  index: number;
  onDetailsClick: (project: Project) => void;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const FEATURED_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    tagline: 'Full-stack marketplace with real-time inventory',
    description:
      'A comprehensive e-commerce solution built with Next.js 14, featuring real-time inventory management, Stripe payments, and an AI-powered recommendation engine. Handles 10K+ daily transactions with 99.9% uptime.',
    thumbnail: '/projects/ecommerce.jpg',
    videoPreview: '/projects/ecommerce-preview.mp4',
    technologies: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Stripe', 'Redis'],
    liveUrl: 'https://example-shop.com',
    githubUrl: 'https://github.com/example/shop',
    lighthouseScore: 98,
    users: '50K+',
    featured: true,
    category: 'Web Application',
  },
  {
    id: '2',
    title: 'Real-Time Analytics Dashboard',
    tagline: 'Data visualization with WebSocket streams',
    description:
      'Enterprise analytics platform processing millions of events per minute. Features interactive D3.js visualizations, custom alerting, and exportable reports. Built for scale with Kubernetes.',
    thumbnail: '/projects/analytics.jpg',
    technologies: ['React', 'D3.js', 'Node.js', 'WebSocket', 'MongoDB', 'Docker'],
    liveUrl: 'https://analytics-demo.com',
    githubUrl: 'https://github.com/example/analytics',
    lighthouseScore: 95,
    users: '10K+',
    featured: true,
    category: 'Dashboard',
  },
  {
    id: '3',
    title: 'AI Content Generator',
    tagline: 'GPT-powered writing assistant',
    description:
      'SaaS application leveraging OpenAI GPT-4 for content generation. Features include tone adjustment, SEO optimization, plagiarism detection, and multi-language support.',
    thumbnail: '/projects/ai-writer.jpg',
    technologies: ['Next.js', 'OpenAI', 'tRPC', 'Tailwind', 'Vercel AI SDK'],
    liveUrl: 'https://ai-writer-demo.com',
    githubUrl: 'https://github.com/example/ai-writer',
    lighthouseScore: 92,
    users: '25K+',
    featured: true,
    category: 'AI/ML',
  },
  {
    id: '4',
    title: 'Developer Portfolio',
    tagline: 'This website — 3D immersive experience',
    description:
      'The portfolio you are viewing right now. Built with Next.js 14, Three.js for 3D graphics, Framer Motion for animations, and GraphQL for data. Features dark/light mode, responsive design, and a cyberpunk terminal aesthetic.',
    thumbnail: '/projects/portfolio.jpg',
    technologies: ['Next.js', 'Three.js', 'GraphQL', 'Tailwind', 'Framer Motion'],
    githubUrl: 'https://github.com/example/portfolio',
    lighthouseScore: 100,
    featured: true,
    category: 'Portfolio',
  },
];

// ============================================================================
// ICONS
// ============================================================================

const Icons = {
  ExternalLink: memo(function ExternalLinkIcon() {
    return (
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
    );
  }),
  Github: memo(function GithubIcon() {
    return (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    );
  }),
  ArrowRight: memo(function ArrowRightIcon() {
    return (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    );
  }),
  Star: memo(function StarIcon() {
    return (
      <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    );
  }),
  Expand: memo(function ExpandIcon() {
    return (
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="15 3 21 3 21 9" />
        <polyline points="9 21 3 21 3 15" />
        <line x1="21" y1="3" x2="14" y2="10" />
        <line x1="3" y1="21" x2="10" y2="14" />
      </svg>
    );
  }),
  X: memo(function XIcon() {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    );
  }),
};

// ============================================================================
// CATEGORY COLORS
// ============================================================================

function getCategoryGlow(category: string): string {
  switch (category) {
    case 'AI/ML':
      return 'rgba(var(--glow-orange),1)';
    case 'Dashboard':
      return 'rgba(var(--glow-crimson),1)';
    case 'Portfolio':
    case 'Web Application':
    default:
      return 'rgba(var(--glow-cyan),1)';
  }
}

// ============================================================================
// PROJECT CARD — Premium terminal-style
// ============================================================================

const ProjectCard = memo(function ProjectCard({
  project,
  index,
  onDetailsClick,
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });
  const [imageError, setImageError] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7, -7]), {
    damping: 18,
    stiffness: 200,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), {
    damping: 18,
    stiffness: 200,
  });
  const contentX = useSpring(useTransform(mouseX, [-0.5, 0.5], [8, -8]), {
    damping: 20,
    stiffness: 150,
  });
  const contentY = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    damping: 20,
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

  const glowColor = getCategoryGlow(project.category);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: '1800px' }}
      className="group/card relative"
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, willChange: 'transform' }}
        className="relative rounded-[2rem] transition-shadow duration-700 hover:shadow-[0_0_60px_rgba(var(--glow-cyan),0.12),_0_0_120px_rgba(var(--glow-cyan),0.06)]"
      >
        {/* ── Animated border beam ── */}
        <div className="absolute -inset-[1px] rounded-[2rem] overflow-hidden opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div
            className="absolute inset-0 animate-spin-slow"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0%, rgba(var(--glow-cyan),1) 10%, transparent 20%, transparent 40%, rgba(var(--glow-crimson),1) 50%, transparent 60%, transparent 80%, rgba(var(--glow-orange),1) 90%, transparent 100%)',
            }}
          />
          <div className="absolute inset-[1.5px] rounded-[calc(2rem-1.5px)] bg-white dark:bg-space-black" />
        </div>
        <div className="absolute inset-0 rounded-[2rem] overflow-hidden opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div
            className="absolute h-[8px] w-[80px] animate-border-beam"
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
            className="absolute h-[8px] w-[60px] animate-border-beam"
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

        {/* ── Card body ── */}
        <div className="relative rounded-[2rem] overflow-hidden border bg-white/95 dark:bg-space-black/90 border-slate-200/60 dark:border-white/[0.06] group-hover/card:border-transparent transition-colors duration-500">
          {/* Dot grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.07]"
            style={{
              backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Ambient glows */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-0 group-hover/card:opacity-100 transition-opacity duration-700">
            <div
              className="absolute top-0 right-0 w-72 h-72 blur-[100px] translate-x-1/2 -translate-y-1/3"
              style={{ background: `${glowColor.replace('1)', '0.08)')}` }}
            />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-vision-cyan/[0.06] blur-[100px] -translate-x-1/3 translate-y-1/2" />
          </div>

          {/* ── Image panel ── */}
          <div className="relative h-52 overflow-hidden border-b border-slate-200/60 dark:border-white/[0.05]">
            {!imageError ? (
              <Image
                src={project.thumbnail}
                alt={project.title}
                fill
                className="object-cover transition-all duration-700 group-hover/card:scale-[1.04] group-hover/card:brightness-90"
                sizes="(max-width: 1024px) 100vw, 50vw"
                onError={() => setImageError(true)}
              />
            ) : (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  background: `radial-gradient(circle at 40% 40%, ${glowColor.replace('1)', '0.12)')}, transparent 70%), radial-gradient(circle at 80% 70%, rgba(var(--glow-crimson),0.06), transparent 60%)`,
                }}
              >
                <div className="text-center space-y-3">
                  <div
                    className="text-6xl font-mono font-black opacity-20 dark:opacity-10"
                    style={{ color: glowColor }}
                  >
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
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white dark:from-space-black to-transparent" />

            {/* Featured badge */}
            {project.featured && (
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-sm border border-yellow-400/40 text-yellow-400 text-[8px] font-mono font-black uppercase tracking-widest">
                <Icons.Star />
                FEATURED
              </div>
            )}

            {/* Lighthouse score */}
            {project.lighthouseScore && (
              <div className="absolute top-3 right-3 flex flex-col items-center px-2.5 py-1.5 rounded-xl bg-black/65 backdrop-blur-sm border border-white/10">
                <span
                  className={cn(
                    'text-base font-mono font-black leading-none',
                    project.lighthouseScore >= 90
                      ? 'text-emerald-400'
                      : project.lighthouseScore >= 50
                        ? 'text-yellow-400'
                        : 'text-red-400'
                  )}
                >
                  {project.lighthouseScore}
                </span>
                <span className="text-[7px] font-mono text-white/40 uppercase tracking-widest mt-0.5">
                  LH
                </span>
              </div>
            )}
          </div>

          {/* ── Content ── */}
          <motion.div
            style={{ x: contentX, y: contentY, willChange: 'transform' }}
            className="relative z-10 p-6 md:p-8"
          >
            {/* Category + users */}
            <div className="flex items-center justify-between mb-4">
              <span
                className="inline-flex items-center gap-1.5 text-[9px] font-mono font-black uppercase tracking-[0.4em]"
                style={{ color: glowColor }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full animate-pulse"
                  style={{ background: glowColor, boxShadow: `0 0 8px ${glowColor}` }}
                />
                {project.category}
              </span>
              {project.users && (
                <span className="text-[9px] font-mono font-black text-slate-400 dark:text-white/30 uppercase tracking-[0.3em]">
                  {project.users} users
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="text-xl md:text-2xl font-display font-black text-slate-900 dark:text-text-dark tracking-tighter uppercase italic group-hover/card:text-vision-cyan transition-colors duration-500 leading-tight mb-2">
              {project.title}
            </h3>
            <p className="text-[12px] font-medium leading-relaxed text-slate-500 dark:text-white/40 mb-5 line-clamp-2">
              {project.description}
            </p>

            {/* Tech stack */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {project.technologies.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] group-hover/card:border-vision-cyan/20 text-[9px] font-mono font-black text-slate-600 dark:text-white/40 uppercase tracking-tight transition-colors duration-300"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 4 && (
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] text-[9px] font-mono font-black text-vision-cyan/60 uppercase tracking-tight">
                  +{project.technologies.length - 4}
                </span>
              )}
            </div>

            {/* Action bar */}
            <div className="flex items-center justify-between pt-5 border-t border-slate-200/60 dark:border-white/[0.06]">
              <div className="flex items-center gap-2">
                {project.liveUrl && (
                  <Link
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[9px] font-mono font-black uppercase tracking-widest bg-vision-cyan text-space-black hover:bg-white hover:text-space-black transition-all shadow-[0_0_20px_rgba(var(--glow-cyan),0.3)] hover:shadow-[0_0_30px_rgba(var(--glow-cyan),0.5)]"
                  >
                    <Icons.ExternalLink />
                    LIVE
                  </Link>
                )}
                {project.githubUrl && (
                  <Link
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[9px] font-mono font-black uppercase tracking-widest border border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-white/40 hover:border-white/30 hover:text-vision-cyan transition-all bg-white/50 dark:bg-white/[0.02]"
                  >
                    <Icons.Github />
                    CODE
                  </Link>
                )}
              </div>
              <button
                onClick={() => onDetailsClick(project)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[9px] font-mono font-black uppercase tracking-widest border border-slate-200 dark:border-white/[0.08] text-slate-500 dark:text-white/30 hover:border-vision-crimson/50 hover:text-vision-crimson transition-all bg-white/50 dark:bg-white/[0.02]"
              >
                <Icons.Expand />
                EXPAND
              </button>
            </div>
          </motion.div>

          {/* Corner accents */}
          <div className="absolute top-[208px] left-4 w-4 h-4 border-t-2 border-l-2 border-vision-crimson/0 group-hover/card:border-vision-crimson/30 rounded-tl-lg transition-colors duration-500 pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-vision-cyan/0 group-hover/card:border-vision-cyan/30 rounded-br-lg transition-colors duration-500 pointer-events-none" />

          {/* Edge light lines */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-vision-crimson/30 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-vision-cyan/30 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </div>
      </motion.div>
    </motion.div>
  );
});

// ============================================================================
// PROJECT DETAILS MODAL — premium redesign
// ============================================================================

const ProjectModal = memo(function ProjectModal({
  project,
  isOpen,
  onClose,
}: {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!project) return null;

  const glowColor = getCategoryGlow(project.category);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-2 md:inset-6 lg:inset-10 z-50 overflow-hidden"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative h-full w-full rounded-2xl overflow-hidden flex flex-col bg-white/97 dark:bg-space-black/97 border border-slate-200/60 dark:border-white/[0.08] shadow-2xl">
              {/* Scanline */}
              <div className="absolute inset-0 bg-[linear-gradient(transparent_49%,rgba(0,0,0,0.025)_50%,transparent_51%)] bg-[size:100%_6px] pointer-events-none z-0 opacity-50" />
              {/* Ambient glow */}
              <div
                className="absolute top-0 right-0 w-96 h-96 blur-[150px] opacity-10 pointer-events-none"
                style={{ background: glowColor }}
              />

              {/* Header */}
              <div className="relative z-10 flex items-start justify-between p-4 md:p-6 border-b border-slate-200/60 dark:border-white/[0.07]">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    {project.featured && (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-400/30 text-yellow-500 dark:text-yellow-400 text-[8px] font-mono font-black uppercase tracking-widest">
                        <Icons.Star />
                        FEATURED
                      </span>
                    )}
                    <span
                      className="text-[9px] font-mono font-black uppercase tracking-[0.4em]"
                      style={{ color: glowColor }}
                    >
                      {project.category}
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-display font-black text-slate-900 dark:text-text-dark tracking-tighter uppercase italic">
                    {project.title}
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-white/40 font-medium mt-0.5">
                    {project.tagline}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-white/[0.08] text-slate-400 dark:text-white/30 hover:border-vision-crimson/40 hover:text-vision-crimson transition-all bg-white/50 dark:bg-white/[0.02] ml-4 shrink-0"
                  aria-label="Close modal"
                >
                  <Icons.X />
                </button>
              </div>

              {/* Content */}
              <div className="relative z-10 flex-1 overflow-y-auto p-4 md:p-6">
                <div className="grid md:grid-cols-5 gap-5 md:gap-6">
                  {/* Image */}
                  <div className="md:col-span-2 relative aspect-video md:aspect-auto md:min-h-[200px] rounded-xl overflow-hidden border border-slate-200 dark:border-white/[0.06] bg-slate-100 dark:bg-white/[0.02]">
                    <Image
                      src={project.thumbnail}
                      alt={project.title}
                      fill
                      priority
                      className="object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(transparent_49%,rgba(0,0,0,0.04)_50%,transparent_51%)] bg-[size:100%_4px] pointer-events-none opacity-60" />
                    <div className="absolute inset-0 flex items-center justify-center -z-10">
                      <span className="text-8xl opacity-[0.07]">⬡</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="md:col-span-3 space-y-5">
                    <div>
                      <h3 className="text-[8px] font-mono font-black text-slate-400 dark:text-white/30 uppercase tracking-[0.4em] mb-1.5">
                        DESCRIPTION
                      </h3>
                      <p className="text-[11px] leading-relaxed text-slate-600 dark:text-white/60">
                        {project.description}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-[8px] font-mono font-black text-slate-400 dark:text-white/30 uppercase tracking-[0.4em] mb-2">
                        TECH STACK
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.07] text-[9px] font-mono font-black text-slate-600 dark:text-white/50 uppercase tracking-tight"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {project.lighthouseScore && (
                        <div className="p-3 rounded-lg border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02]">
                          <p
                            className={cn(
                              'text-2xl font-mono font-black',
                              project.lighthouseScore >= 90 ? 'text-emerald-500' : 'text-yellow-500'
                            )}
                          >
                            {project.lighthouseScore}
                          </p>
                          <p className="text-[8px] font-mono font-black text-slate-400 dark:text-white/30 uppercase tracking-[0.3em] mt-0.5">
                            LH Score
                          </p>
                        </div>
                      )}
                      {project.users && (
                        <div className="p-3 rounded-lg border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02]">
                          <p className="text-2xl font-mono font-black text-vision-cyan">
                            {project.users}
                          </p>
                          <p className="text-[8px] font-mono font-black text-slate-400 dark:text-white/30 uppercase tracking-[0.3em] mt-0.5">
                            Users
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {project.liveUrl && (
                        <Link
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[9px] font-mono font-black uppercase tracking-widest bg-vision-cyan text-space-black hover:bg-white hover:text-space-black transition-all shadow-[0_0_20px_rgba(var(--glow-cyan),0.3)]"
                        >
                          <Icons.ExternalLink />
                          LIVE
                        </Link>
                      )}
                      {project.githubUrl && (
                        <Link
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[9px] font-mono font-black uppercase tracking-widest border border-slate-200 dark:border-white/[0.1] text-slate-600 dark:text-white/50 hover:border-vision-cyan/40 hover:text-vision-cyan transition-all bg-white/50 dark:bg-white/[0.02]"
                        >
                          <Icons.Github />
                          CODE
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

// ============================================================================
// SECTION HEADER
// ============================================================================

const SectionHeader = memo(function SectionHeader() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      className="text-center mb-12 md:mb-16"
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center justify-center gap-2 text-[9px] font-mono tracking-[0.4em] text-slate-400 dark:text-white/25 uppercase mb-5">
        <span>SYS://</span>
        <span className="text-vision-crimson/70">WORK</span>
        <span>/</span>
        <span className="text-vision-cyan/80">FEATURED</span>
      </div>

      {/* Heading */}
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-slate-900 dark:text-text-dark tracking-tighter uppercase italic leading-[0.92] mb-5">
        <span className="text-vision-crimson">Selected</span> <span>Work</span>
      </h2>

      {/* Subtitle */}
      <p className="text-[13px] font-mono text-slate-500 dark:text-white/30 max-w-lg mx-auto leading-relaxed">
        A curated selection of projects demonstrating depth in{' '}
        <span className="text-vision-cyan/80">full-stack engineering</span>, product thinking, and
        technical craft.
      </p>

      {/* Underline */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-vision-cyan/50 to-transparent"
      />
    </motion.div>
  );
});

// ============================================================================
// ARCHIVES CTA — premium terminal button
// ============================================================================

const ArchivesCTA = memo(function ArchivesCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      className="flex justify-center mt-14 md:mt-20"
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href="/projects"
        className="group relative inline-flex items-center gap-4 px-10 py-4 font-mono text-[11px] font-black uppercase tracking-[0.35em] transition-all duration-500"
      >
        {/* Base border */}
        <span className="absolute inset-0 border border-slate-300 dark:border-vision-cyan/20 group-hover:border-vision-cyan/60 transition-colors duration-500" />

        {/* Corner brackets */}
        <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-vision-crimson/30 group-hover:border-vision-crimson/80 transition-colors duration-300" />
        <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-vision-cyan/30 group-hover:border-vision-cyan/80 transition-colors duration-300" />
        <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-vision-cyan/30 group-hover:border-vision-cyan/80 transition-colors duration-300" />
        <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-vision-crimson/30 group-hover:border-vision-crimson/80 transition-colors duration-300" />

        {/* Hover glow fill */}
        <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-vision-cyan/5 via-vision-cyan/10 to-vision-crimson/5" />
        {/* Scan sweep on hover */}
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-vision-cyan/15 to-transparent" />

        {/* Text */}
        <span className="relative text-slate-600 dark:text-vision-cyan/60 group-hover:text-vision-cyan transition-colors duration-300">
          View All Archives
        </span>
        <motion.span
          className="relative text-slate-400 dark:text-vision-cyan/40 group-hover:text-vision-cyan transition-colors duration-300"
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Icons.ArrowRight />
        </motion.span>

        {/* Glow shadow */}
        <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_40px_rgba(var(--glow-cyan),0.18)] pointer-events-none rounded-sm" />
      </Link>
    </motion.div>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function FeaturedProjects({ className }: { className?: string }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProjects(FEATURED_PROJECTS);
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleDetailsClick = useCallback((project: Project) => {
    setSelectedProject(project);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProject(null);
  }, []);

  return (
    <section
      id="projects"
      className={cn('py-20 md:py-28 px-4 md:px-6 lg:px-8 relative overflow-hidden', className)}
    >
      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-vision-cyan/[0.025] dark:bg-vision-cyan/[0.04] rounded-full blur-[200px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <SectionHeader />

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-[2rem] overflow-hidden border border-slate-200/60 dark:border-white/[0.06] bg-white dark:bg-space-black/80 animate-pulse"
              >
                <div className="h-52 bg-slate-200 dark:bg-white/[0.04]" />
                <div className="p-8 space-y-4">
                  <div className="h-2 w-20 rounded bg-slate-200 dark:bg-white/[0.04]" />
                  <div className="h-6 w-2/3 rounded bg-slate-200 dark:bg-white/[0.06]" />
                  <div className="h-3 w-full rounded bg-slate-100 dark:bg-white/[0.03]" />
                  <div className="flex gap-2 pt-2">
                    {[1, 2, 3].map((j) => (
                      <div
                        key={j}
                        className="h-6 w-16 rounded-lg bg-slate-100 dark:bg-white/[0.03]"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onDetailsClick={handleDetailsClick}
              />
            ))}
          </div>
        )}

        <ArchivesCTA />
      </div>

      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={handleCloseModal}
      />
    </section>
  );
}

export default FeaturedProjects;

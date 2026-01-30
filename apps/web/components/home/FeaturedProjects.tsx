'use client';

import React, { useState, useRef, memo, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView, AnimatePresence } from 'framer-motion';
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
// MOCK DATA (Replace with GraphQL query)
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
    videoPreview: '/projects/analytics-preview.mp4',
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
    tagline: 'This website - 3D immersive experience',
    description:
      "The portfolio you're viewing right now! Built with Next.js 14, Three.js for 3D graphics, Framer Motion for animations, and GraphQL for data. Features dark/light mode and responsive design.",
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
  ExternalLink: memo(function ExternalLinkIcon({ className }: { className?: string }) {
    return (
      <svg
        className={className}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
    );
  }),

  Github: memo(function GithubIcon({ className }: { className?: string }) {
    return (
      <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    );
  }),

  Info: memo(function InfoIcon({ className }: { className?: string }) {
    return (
      <svg
        className={className}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    );
  }),

  X: memo(function XIcon({ className }: { className?: string }) {
    return (
      <svg
        className={className}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    );
  }),

  Star: memo(function StarIcon({ className }: { className?: string }) {
    return (
      <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    );
  }),

  ArrowRight: memo(function ArrowRightIcon({ className }: { className?: string }) {
    return (
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
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    );
  }),

  Play: memo(function PlayIcon({ className }: { className?: string }) {
    return (
      <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    );
  }),
};

// ============================================================================
// SKELETON LOADER
// ============================================================================

const ProjectSkeleton = memo(function ProjectSkeleton() {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-card/50 border border-border/50">
      {/* Image skeleton */}
      <div className="aspect-video bg-muted animate-pulse" />

      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-20 bg-muted animate-pulse rounded-full" />
          <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
        </div>
        <div className="h-7 w-3/4 bg-muted animate-pulse rounded" />
        <div className="h-5 w-full bg-muted animate-pulse rounded" />
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-6 w-16 bg-muted animate-pulse rounded-full" />
          ))}
        </div>
        <div className="flex gap-3 pt-2">
          <div className="h-10 w-28 bg-muted animate-pulse rounded-full" />
          <div className="h-10 w-24 bg-muted animate-pulse rounded-full" />
        </div>
      </div>
    </div>
  );
});

// ============================================================================
// TECH BADGE
// ============================================================================

const TechBadge = memo(function TechBadge({ tech }: { tech: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
      {tech}
    </span>
  );
});

// ============================================================================
// PROJECT CARD
// ============================================================================

const ProjectCard = memo(function ProjectCard({
  project,
  index,
  onDetailsClick,
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Check if desktop for video preview
  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Handle video playback on hover
  useEffect(() => {
    if (!videoRef.current || !isDesktop) return;

    if (isHovered && project.videoPreview) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isHovered, isDesktop, project.videoPreview]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <motion.article
      ref={cardRef}
      className="group relative"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className={cn(
          'relative rounded-2xl overflow-hidden',
          'bg-card/50 dark:bg-card/30 backdrop-blur-sm',
          'border border-border/50 dark:border-white/5',
          'transition-all duration-500'
        )}
        animate={{
          y: isHovered ? -8 : 0,
          boxShadow: isHovered
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px hsl(var(--primary) / 0.2)'
            : '0 0 0 0 transparent',
        }}
      >
        {/* Image/Video Container */}
        <div className="relative aspect-video overflow-hidden">
          {/* Thumbnail Image */}
          <motion.div
            className="absolute inset-0"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {!imageError ? (
              <Image
                src={project.thumbnail}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-muted to-secondary/20 flex items-center justify-center">
                <span className="text-6xl opacity-50">🚀</span>
              </div>
            )}
          </motion.div>

          {/* Video Preview (Desktop only) */}
          {isDesktop && project.videoPreview && (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <video
                ref={videoRef}
                src={project.videoPreview}
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Featured Badge */}
          {project.featured && (
            <motion.div
              className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/90 text-yellow-950 text-xs font-semibold"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Icons.Star className="w-3 h-3" />
              Featured
            </motion.div>
          )}

          {/* Category Badge */}
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
            {project.category}
          </div>

          {/* Play indicator on hover (desktop) */}
          {isDesktop && project.videoPreview && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 0 : 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Icons.Play className="w-6 h-6 text-white ml-1" />
              </div>
            </motion.div>
          )}

          {/* Metrics overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4">
            {project.lighthouseScore && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm">
                <div
                  className={cn(
                    'w-2 h-2 rounded-full',
                    project.lighthouseScore >= 90
                      ? 'bg-green-500'
                      : project.lighthouseScore >= 50
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  )}
                />
                <span className="text-white text-xs font-medium">
                  {project.lighthouseScore} Lighthouse
                </span>
              </div>
            )}
            {project.users && (
              <div className="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
                👥 {project.users} users
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title & Tagline */}
          <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-4">{project.tagline}</p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies.slice(0, 4).map((tech) => (
              <TechBadge key={tech} tech={tech} />
            ))}
            {project.technologies.length > 4 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                +{project.technologies.length - 4} more
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {project.liveUrl && (
              <Link
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium',
                  'bg-primary text-primary-foreground',
                  'hover:bg-primary/90 transition-colors'
                )}
              >
                <Icons.ExternalLink className="w-4 h-4" />
                Live Demo
              </Link>
            )}
            {project.githubUrl && (
              <Link
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium',
                  'bg-muted text-foreground',
                  'hover:bg-muted/80 transition-colors'
                )}
              >
                <Icons.Github className="w-4 h-4" />
                GitHub
              </Link>
            )}
            <button
              onClick={() => onDetailsClick(project)}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium',
                'border border-border text-foreground',
                'hover:bg-muted transition-colors'
              )}
            >
              <Icons.Info className="w-4 h-4" />
              Details
            </button>
          </div>
        </div>

        {/* Hover glow effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            background:
              'radial-gradient(circle at 50% 0%, hsl(var(--primary) / 0.15), transparent 50%)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.article>
  );
});

// ============================================================================
// PROJECT DETAILS MODAL
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
  // Close on escape key
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-4 md:inset-10 lg:inset-20 z-50 overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="relative h-full w-full bg-background rounded-2xl shadow-2xl overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {project.featured && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-xs font-medium">
                        <Icons.Star className="w-3 h-3" />
                        Featured
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">{project.category}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">{project.title}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                  aria-label="Close modal"
                >
                  <Icons.X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left: Image */}
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                    <Image
                      src={project.thumbnail}
                      alt={project.title}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '';
                      }}
                    />
                    {/* Fallback */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-muted to-secondary/20 flex items-center justify-center -z-10">
                      <span className="text-8xl opacity-30">🚀</span>
                    </div>
                  </div>

                  {/* Right: Details */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">About</h3>
                      <p className="text-foreground">{project.description}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        Technologies
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <TechBadge key={tech} tech={tech} />
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {project.lighthouseScore && (
                        <div className="p-4 rounded-xl bg-muted/50">
                          <p className="text-2xl font-bold text-foreground">
                            {project.lighthouseScore}
                          </p>
                          <p className="text-sm text-muted-foreground">Lighthouse Score</p>
                        </div>
                      )}
                      {project.users && (
                        <div className="p-4 rounded-xl bg-muted/50">
                          <p className="text-2xl font-bold text-foreground">{project.users}</p>
                          <p className="text-sm text-muted-foreground">Active Users</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3 pt-4">
                      {project.liveUrl && (
                        <Link
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          <Icons.ExternalLink className="w-4 h-4" />
                          Visit Live Site
                        </Link>
                      )}
                      {project.githubUrl && (
                        <Link
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium bg-muted text-foreground hover:bg-muted/80 transition-colors"
                        >
                          <Icons.Github className="w-4 h-4" />
                          View Source
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
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
    >
      <motion.span
        className="inline-block px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4
                   bg-secondary/10 text-secondary border border-secondary/20"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        Featured Work
      </motion.span>

      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
        Projects That Define Me
      </h2>

      <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
        A showcase of my most impactful projects, demonstrating expertise in full-stack development,
        system design, and user experience
      </p>
    </motion.div>
  );
});

// ============================================================================
// VIEW ALL BUTTON
// ============================================================================

const ViewAllButton = memo(function ViewAllButton() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      className="flex justify-center mt-12 md:mt-16"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Link href="/projects" passHref>
        <motion.button
          className={cn(
            'group flex items-center gap-3 px-8 py-4 rounded-full',
            'bg-secondary text-secondary-foreground font-medium',
            'hover:bg-secondary/90 transition-colors',
            'shadow-lg shadow-secondary/25'
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>View All Projects</span>
          <motion.span
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Icons.ArrowRight className="w-5 h-5" />
          </motion.span>
        </motion.button>
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

  // Simulate data fetching (replace with GraphQL hook)
  useEffect(() => {
    const timer = setTimeout(() => {
      setProjects(FEATURED_PROJECTS);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleDetailsClick = useCallback((project: Project) => {
    setSelectedProject(project);
    // TODO: Track click with GraphQL mutation
    // trackProjectClick({ variables: { projectId: project.id } });
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProject(null);
  }, []);

  return (
    <section id="projects" className={cn('py-20 md:py-32 px-4 md:px-6 lg:px-8', className)}>
      <div className="max-w-7xl mx-auto">
        <SectionHeader />

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {[...Array(4)].map((_, i) => (
              <ProjectSkeleton key={i} />
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

        <ViewAllButton />
      </div>

      {/* Project Details Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={handleCloseModal}
      />
    </section>
  );
}

export default FeaturedProjects;

'use client';

import React, { useRef, useState, memo, useEffect } from 'react';
import {
  motion,
  useInView,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { GET_FEATURED_PROJECTS } from '@/lib/graphql/queries';
import { ProjectModal, ProjectData } from '../projects/project-modal';
import type { Project } from '@/lib/graphql/__generated__/schema';

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

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
  Pulse: () => (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
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
};

// Helper function to map backend Project to ProjectData
function mapProjectToProjectData(project: Project): ProjectData {
  console.log('🔄 Mapping project:', project);
  return {
    id: project.id,
    title: project.title,
    slug: project.slug,
    category: project.category,
    description: project.description,
    fullDescription: project.description,
    status: project.status.toLowerCase() as 'completed' | 'in-progress' | 'planned',
    featured: project.featured,
    technologies: project.technologies,
    metrics: {
      lighthouse: {
        performance: 95,
        accessibility: 98,
        bestPractices: 100,
        seo: 92,
      },
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

    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7, -7]), {
      damping: 25,
      stiffness: 150,
    });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), {
      damping: 25,
      stiffness: 150,
    });

    // Parallax shifts for content layers
    const contentX = useSpring(useTransform(mouseX, [-0.5, 0.5], [10, -10]), {
      damping: 30,
      stiffness: 100,
    });
    const contentY = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
      damping: 30,
      stiffness: 100,
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
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="group relative h-full"
        style={{ perspective: '1200px' }}
      >
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY }}
          className="relative p-10 h-full rounded-[3rem] glassmorphism border-2 border-slate-200/40 dark:border-white/10 transition-all duration-700 hover:border-vision-cyan/40 flex flex-col overflow-hidden bg-white/[0.05] dark:bg-space-black/40 shadow-2xl"
        >
          {/* Animated Scanline Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(34,211,238,0.5)_50%)] bg-[length:100%_2px] animate-scan" />
          </div>

          {/* Dynamic Interactive Glow */}
          <motion.div
            className="absolute pointer-events-none rounded-full bg-vision-cyan/15 blur-[60px] w-48 h-48 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
            style={{
              left: useTransform(mouseX, [-0.5, 0.5], ['30%', '70%']),
              top: useTransform(mouseY, [-0.5, 0.5], ['30%', '70%']),
            }}
          />

          {/* Top Telemetry */}
          <motion.div
            style={{ x: contentX, y: contentY }}
            className="flex justify-between items-start mb-12 relative z-10"
          >
            <div className="space-y-1">
              <div className="text-[10px] font-mono font-black text-vision-crimson uppercase tracking-[0.5em]">
                LOG_{project.id}
              </div>
              <div className="text-[10px] font-mono font-bold text-slate-500 dark:text-text-dark/40 uppercase tracking-widest">
                {project.category}
              </div>
            </div>
            <div className="h-10 w-10 glassmorphism rounded-xl flex items-center justify-center text-slate-300 dark:text-text-dark/20 group-hover:text-vision-cyan border-2 border-transparent group-hover:border-vision-cyan/30 transition-all shadow-lg">
              <Icons.Hex />
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            style={{
              x: useTransform(contentX, (v) => v * 1.5),
              y: useTransform(contentY, (v) => v * 1.5),
            }}
            className="flex-1 space-y-6 relative z-10"
          >
            <h3 className="text-3xl font-display font-black text-slate-900 dark:text-text-dark tracking-tighter uppercase italic group-hover:text-vision-cyan transition-colors duration-500 leading-none">
              {project.title}
            </h3>
            <p className="text-sm font-bold leading-relaxed text-slate-600 dark:text-text-dark/50 line-clamp-3">
              {project.description}
            </p>
          </motion.div>

          {/* Footer Data */}
          <div className="mt-12 space-y-8 relative z-10">
            <div className="flex flex-wrap gap-2.5">
              {project.technologies.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="px-3.5 py-1.5 bg-slate-100 dark:bg-white/5 rounded-xl text-[9px] font-mono font-black text-slate-500 dark:text-text-dark/40 border border-slate-200 dark:border-white/5 group-hover:border-vision-cyan/20 transition-all uppercase tracking-tighter"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-slate-200 dark:border-white/10">
              <div className="flex flex-col gap-0.5">
                <div className="text-[8px] font-mono font-black text-slate-400 dark:text-text-dark/20 uppercase tracking-[0.3em]">
                  Telemetry_Feed
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="h-2 w-2 rounded-full bg-vision-cyan shadow-[0_0_10px_#22D3EE] animate-pulse" />
                  <span className="text-[10px] font-mono font-black tracking-widest text-slate-900 dark:text-text-dark uppercase">
                    {project.metrics?.responseTime} Latency
                  </span>
                </div>
              </div>
              <button
                onClick={() => onSelect(project)}
                className="h-12 w-12 rounded-2xl glassmorphism flex items-center justify-center text-slate-400 dark:text-text-dark/40 hover:text-vision-crimson hover:scale-110 hover:shadow-[0_0_30px_rgba(225,29,72,0.3)] transition-all border-2 border-transparent hover:border-vision-crimson/30"
              >
                <Icons.External />
              </button>
            </div>
          </div>

          {/* Ultra-thin HUD Brackets */}
          <div className="absolute top-6 left-6 w-6 h-6 border-t-2 border-l-2 border-vision-crimson/20 rounded-tl-xl transition-all group-hover:border-vision-crimson/60" />
          <div className="absolute bottom-6 right-6 w-6 h-6 border-b-2 border-r-2 border-vision-cyan/20 rounded-br-xl transition-all group-hover:border-vision-cyan/60" />
        </motion.div>
      </motion.div>
    );
  }
);

export const ProjectsSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-10%' });
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  // Fetch featured projects from backend
  const { data, loading, error } = useQuery(GET_FEATURED_PROJECTS, {
    variables: { limit: 9 },
  });

  console.log('Featured Projects Data:', data);

  const projects = data?.featuredProjects?.map(mapProjectToProjectData) || [];

  console.log('Mapped Projects:', projects);
  console.log('Projects count:', projects.length);
  console.log('Loading state:', loading);
  console.log('Error state:', error);

  return (
    <section
      ref={containerRef}
      id="projects"
      className="relative py-20 px-6 bg-white dark:bg-space-black transition-colors duration-1000"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-72 bg-vision-cyan/[0.02] blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-10">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              className="inline-flex items-center gap-3 px-5 py-1.5 rounded-full glassmorphism border border-vision-cyan/20 text-vision-cyan font-mono text-[9px] font-black tracking-[0.5em] uppercase"
            >
              <Icons.Pulse /> MISSION_CONTROL // ALPHA
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-display font-black leading-[0.9] tracking-tighter text-text-light dark:text-text-dark uppercase italic">
              System <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-vision-crimson via-vision-orange to-vision-cyan text-glow-cyan">
                Architecture.
              </span>
            </h2>
          </div>

          <Link
            href="/projects"
            className="group flex items-center gap-5 text-[10px] font-mono font-black uppercase tracking-[0.4em] text-text-light/30 dark:text-text-dark/20 hover:text-vision-cyan transition-all duration-500"
          >
            VIEW_ARCHIVE{' '}
            <div className="h-[1px] w-8 bg-current group-hover:w-16 transition-all duration-700 opacity-20" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-96 rounded-[2rem] glassmorphism border border-white/5 animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 text-text-light/50">
            <p>Error loading projects. Please try again later.</p>
            <p className="text-xs mt-2">{error.message}</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-text-light/50">
            <p>No projects found. Please add some projects to the database.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                idx={idx}
                onSelect={setSelectedProject}
              />
            ))}
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <Link
            href="/projects"
            className="group relative px-8 py-4 font-mono text-[10px] tracking-[0.4em] text-text-light/60 dark:text-text-dark/40 uppercase border border-white/15 rounded-full hover:border-vision-cyan/40 hover:text-vision-cyan hover:bg-vision-cyan/5 transition-all duration-300"
          >
            SHOW_ALL_PROJECTS
          </Link>
        </div>
      </div>

      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};

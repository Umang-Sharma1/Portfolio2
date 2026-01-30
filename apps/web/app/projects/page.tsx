'use client';

import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useState, useRef, memo, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PROJECTS } from '@/lib/graphql/queries';
import { ProjectModal, ProjectData } from '@/components/projects/project-modal';
import type { Project } from '@/lib/graphql/__generated__/schema';

type CategoryType = 'All' | 'FRONTEND' | 'BACKEND' | 'DATABASE' | 'FULLSTACK';

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
};

// Helper function to map backend Project to ProjectData
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
          className="relative p-7 h-full rounded-[2rem] glassmorphism border border-white/5 transition-all duration-700 hover:border-vision-cyan/30 flex flex-col overflow-hidden bg-white/[0.03] dark:bg-space-black/20 min-h-[420px]"
        >
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(34,211,238,0.5)_50%)] bg-[length:100%_2px] animate-scan" />
          </div>

          <motion.div
            className="absolute pointer-events-none rounded-full bg-vision-cyan/15 blur-[60px] w-48 h-48 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
            style={{
              left: useTransform(mouseX, [-0.5, 0.5], ['30%', '70%']),
              top: useTransform(mouseY, [-0.5, 0.5], ['30%', '70%']),
            }}
          />

          <motion.div
            style={{ x: contentX, y: contentY }}
            className="flex justify-between items-start mb-8 relative z-10"
          >
            <div className="space-y-1">
              <div className="text-[8px] font-mono font-black text-vision-cyan/60 uppercase tracking-[0.5em]">
                LOG_{project.id}
              </div>
              <div className="text-[9px] font-mono font-bold text-text-light/30 dark:text-text-dark/20 uppercase tracking-widest">
                {project.category}
              </div>
            </div>
            <div className="h-8 w-8 glassmorphism rounded-lg flex items-center justify-center text-text-light/10 dark:text-text-dark/10 group-hover:text-vision-cyan border border-transparent group-hover:border-vision-cyan/10 transition-all">
              <Icons.Hex />
            </div>
          </motion.div>

          <motion.div
            style={{
              x: useTransform(contentX, (v) => v * 1.5),
              y: useTransform(contentY, (v) => v * 1.5),
            }}
            className="flex-1 space-y-4 relative z-10"
          >
            <h3 className="text-xl font-display font-black text-text-light dark:text-text-dark tracking-tighter uppercase italic group-hover:text-vision-cyan transition-colors duration-500">
              {project.title}
            </h3>
            <p className="text-[12px] font-medium leading-relaxed text-text-light/50 dark:text-text-dark/30 line-clamp-3">
              {project.description}
            </p>
          </motion.div>

          <div className="mt-8 space-y-6 relative z-10">
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 bg-white/5 dark:bg-white/[0.02] rounded-md text-[7px] font-mono font-black text-text-light/40 dark:text-text-dark/30 border border-white/5 group-hover:border-vision-cyan/10 transition-colors uppercase"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-5 border-t border-white/5">
              <div className="flex flex-col gap-0.5">
                <div className="text-[7px] font-mono text-text-light/20 dark:text-text-dark/20 uppercase tracking-widest font-black">
                  Status
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-1 w-1 rounded-full bg-vision-cyan/50 group-hover:bg-vision-cyan animate-pulse" />
                  <span className="text-[9px] font-mono font-black tracking-widest text-text-light/60 dark:text-text-dark/40 uppercase">
                    {project.status}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onSelect(project)}
                className="h-9 w-9 rounded-lg glassmorphism flex items-center justify-center text-text-light/30 dark:text-text-dark/20 group-hover:text-vision-cyan group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.1)] transition-all"
              >
                <Icons.External />
              </button>
            </div>
          </div>

          <div className="absolute top-3 left-3 w-3 h-3 border-t-[0.5px] border-l-[0.5px] border-white/10 rounded-tl-[4px] group-hover:border-vision-cyan/40 group-hover:shadow-[0_0_5px_rgba(34,211,238,0.2)] transition-all" />
          <div className="absolute bottom-3 right-3 w-3 h-3 border-b-[0.5px] border-r-[0.5px] border-white/10 rounded-br-[4px] group-hover:border-vision-cyan/40 group-hover:shadow-[0_0_5px_rgba(34,211,238,0.2)] transition-all" />
        </motion.div>
      </motion.div>
    );
  }
);

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

  useEffect(() => {
    setPage(1);
  }, [selectedCategory]);

  return (
    <main className="relative min-h-screen bg-white dark:bg-space-black text-text-light dark:text-text-dark overflow-hidden transition-colors duration-1000">
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_90%)]" />

      <div className="relative z-10 container mx-auto px-6 py-20">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 bg-vision-cyan animate-pulse" />
            <span className="font-mono text-xs tracking-[0.4em] text-vision-cyan uppercase">
              Project Archive
            </span>
          </div>
          <h1 className="font-display font-black text-6xl md:text-8xl tracking-tighter text-text-light dark:text-text-dark uppercase mb-6 italic">
            MISSION{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-vision-crimson via-vision-orange to-vision-cyan">
              LOGS
            </span>
          </h1>
          <p className="font-mono text-sm md:text-base leading-relaxed text-text-light/70 dark:text-text-dark/50 max-w-2xl">
            Comprehensive archive of deployed systems, active operations, and archived missions.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-wrap gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 font-mono text-xs tracking-[0.3em] uppercase border rounded-full transition-all duration-300 ${
                selectedCategory === cat
                  ? 'border-vision-cyan text-vision-cyan bg-vision-cyan/10'
                  : 'border-white/20 text-text-light/60 dark:text-text-dark/40 hover:border-white/40 hover:text-text-light/80 dark:hover:text-text-dark/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-[420px] rounded-[2rem] glassmorphism border border-white/5 animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 text-text-light/50">
            <p>Error loading projects. Please try again later.</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            <AnimatePresence mode="popLayout">
              {projects.map((project: ProjectData, index: number) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <ProjectCard project={project} idx={index} onSelect={setSelectedProject} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        <motion.div
          className="flex items-center justify-between py-6 border-t border-white/10 font-mono text-xs text-text-light/50 dark:text-text-dark/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <span>ARCHIVE_SYNC: 100%</span>
          <span>TOTAL_NODES: {data?.projects?.totalCount ?? projects.length}</span>
          <span className="text-vision-cyan">SIGNAL: STABLE_SECURE</span>
        </motion.div>

        <div className="mt-10 flex items-center justify-center gap-6">
          <button
            className="px-6 py-3 rounded-full border border-white/15 text-xs font-mono tracking-[0.3em] uppercase text-text-light/60 dark:text-text-dark/40 hover:border-vision-cyan/40 hover:text-vision-cyan transition-all disabled:opacity-40"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!pageInfo?.hasPreviousPage}
          >
            Prev
          </button>
          <span className="text-xs font-mono tracking-[0.4em] text-text-light/50 dark:text-text-dark/30">
            PAGE {pageInfo?.currentPage ?? page} / {pageInfo?.totalPages ?? 1}
          </span>
          <button
            className="px-6 py-3 rounded-full border border-white/15 text-xs font-mono tracking-[0.3em] uppercase text-text-light/60 dark:text-text-dark/40 hover:border-vision-cyan/40 hover:text-vision-cyan transition-all disabled:opacity-40"
            onClick={() => setPage((p) => p + 1)}
            disabled={!pageInfo?.hasNextPage}
          >
            Next
          </button>
        </div>

        <motion.div
          className="flex justify-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <Link
            href="/"
            className="group relative px-8 py-4 font-mono text-sm tracking-[0.3em] text-text-light dark:text-text-dark uppercase border border-white/20 rounded-full hover:border-vision-cyan/40 hover:bg-vision-cyan/5 transition-all duration-300"
          >
            <span className="relative z-10"> Return to Main Terminal</span>
          </Link>
        </motion.div>
      </div>

      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </main>
  );
}

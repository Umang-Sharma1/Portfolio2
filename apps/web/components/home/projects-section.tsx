'use client';

import React, { useRef, useState, memo, useEffect } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ProjectModal, ProjectData } from '../projects/project-modal';

const MotionDiv = motion.div as any;

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

const Icons = {
  External: () => (
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
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 22 3 22 10" />
      <line x1="10" x2="22" y1="14" y2="2" />
    </svg>
  ),
  Pulse: ({ className }: { className?: string }) => (
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
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  Hex: () => (
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
      <path d="M12 2l9 5v10l-9 5-9-5V7l9-5z" />
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

const MISSIONS: ProjectData[] = [
  {
    id: 'LOG_01',
    title: 'Aether Nexus',
    slug: 'aether-nexus',
    category: 'Orbital_Architecture',
    description:
      'High-bandwidth spatial computing hub for real-time asset synchronization in low-orbit nodes.',
    fullDescription:
      'Aether Nexus is a pioneering infrastructure project designed to bridge the gap between terrestrial data centers and orbital edge computing nodes. Utilizing high-frequency laser links, it achieves near-zero latency for spatial asset streaming across distributed global clusters.',
    status: 'completed',
    featured: true,
    technologies: ['React 19', 'Three.js', 'Rust', 'WebAssembly'],
    metrics: {
      lighthouse: { performance: 99, accessibility: 100, bestPractices: 100, seo: 95 },
      loadTime: '0.4s',
      uptime: '99.99%',
      responseTime: '12ms',
    },
    architecture: {
      nodes: [
        {
          id: 'n1',
          label: 'Orbital_Edge',
          type: 'service',
          description: 'Edge compute node',
          position: { x: 50, y: 50 },
        },
        {
          id: 'n2',
          label: 'Signal_Mesh',
          type: 'frontend',
          description: 'Frontend visualizer',
          position: { x: 250, y: 50 },
        },
        {
          id: 'n3',
          label: 'Rust_Core',
          type: 'backend',
          description: 'Core logic processor',
          position: { x: 150, y: 150 },
        },
      ],
      connections: [
        { from: 'n1', to: 'n3', animated: true },
        { from: 'n3', to: 'n2', animated: true },
      ],
    },
  },
  {
    id: 'LOG_02',
    title: 'Spectral Sentinel',
    slug: 'spectral-sentinel',
    category: 'Neural_Security',
    description:
      'Automated behavioral firewall leveraging generative patterns to secure distributed data clusters.',
    status: 'completed',
    featured: true,
    technologies: ['Python', 'GenAI', 'TensorFlow', 'gRPC'],
    metrics: {
      lighthouse: { performance: 92, accessibility: 98, bestPractices: 95, seo: 90 },
      loadTime: '0.8s',
      uptime: '99.95%',
      responseTime: '24ms',
    },
    architecture: {
      nodes: [
        {
          id: 's1',
          label: 'Neural_Core',
          type: 'service',
          description: 'ML Engine',
          position: { x: 50, y: 100 },
        },
        {
          id: 's2',
          label: 'Shield_Gate',
          type: 'auth',
          description: 'Security layer',
          position: { x: 250, y: 100 },
        },
      ],
      connections: [{ from: 's1', to: 's2', animated: true }],
    },
  },
  {
    id: 'LOG_03',
    title: 'Void Protocol',
    slug: 'void-protocol',
    category: 'Core_Infrastructure',
    description:
      'Next-generation database engine optimized for quantum-resistant encryption and cold-storage retrieval.',
    status: 'completed',
    featured: true,
    technologies: ['Go', 'Kubernetes', 'PostgreSQL', 'Redis'],
    metrics: {
      lighthouse: { performance: 96, accessibility: 95, bestPractices: 100, seo: 94 },
      loadTime: '0.2s',
      uptime: '100%',
      responseTime: '8ms',
    },
    architecture: {
      nodes: [
        {
          id: 'v1',
          label: 'K8s_Cluster',
          type: 'service',
          description: 'Orchestration',
          position: { x: 50, y: 50 },
        },
        {
          id: 'v2',
          label: 'Void_DB',
          type: 'database',
          description: 'Persistent store',
          position: { x: 250, y: 50 },
        },
      ],
      connections: [{ from: 'v1', to: 'v2', animated: true }],
    },
  },
  {
    id: 'LOG_04',
    title: 'Phantom Grid',
    slug: 'phantom-grid',
    category: 'Data_Mesh',
    description:
      'Distributed real-time analytics pipeline processing millions of events per second with sub-millisecond latency.',
    status: 'completed',
    featured: true,
    technologies: ['Apache Kafka', 'Flink', 'TypeScript', 'ClickHouse'],
    metrics: {
      lighthouse: { performance: 97, accessibility: 96, bestPractices: 100, seo: 93 },
      loadTime: '0.3s',
      uptime: '99.98%',
      responseTime: '6ms',
    },
    architecture: {
      nodes: [
        {
          id: 'p1',
          label: 'Event_Stream',
          type: 'service',
          description: 'Kafka cluster',
          position: { x: 50, y: 50 },
        },
        {
          id: 'p2',
          label: 'Process_Core',
          type: 'backend',
          description: 'Stream processor',
          position: { x: 250, y: 50 },
        },
      ],
      connections: [{ from: 'p1', to: 'p2', animated: true }],
    },
  },
  {
    id: 'LOG_05',
    title: 'Nova Terminal',
    slug: 'nova-terminal',
    category: 'Developer_Tools',
    description:
      'AI-augmented developer workspace with intelligent code analysis, live collaboration, and seamless CI/CD integration.',
    status: 'in-progress',
    featured: true,
    technologies: ['Next.js 14', 'OpenAI', 'WebSocket', 'Docker'],
    metrics: {
      lighthouse: { performance: 94, accessibility: 99, bestPractices: 98, seo: 96 },
      loadTime: '0.6s',
      uptime: '99.9%',
      responseTime: '18ms',
    },
    architecture: {
      nodes: [
        {
          id: 'nv1',
          label: 'AI_Engine',
          type: 'service',
          description: 'LLM integration',
          position: { x: 50, y: 50 },
        },
        {
          id: 'nv2',
          label: 'Editor_Core',
          type: 'frontend',
          description: 'Code workspace',
          position: { x: 250, y: 50 },
        },
      ],
      connections: [{ from: 'nv1', to: 'nv2', animated: true }],
    },
  },
  {
    id: 'LOG_06',
    title: 'Eclipse Vault',
    slug: 'eclipse-vault',
    category: 'Blockchain_Auth',
    description:
      'Decentralized identity management with zero-knowledge proofs and multi-chain wallet integration.',
    status: 'completed',
    featured: true,
    technologies: ['Solidity', 'Ethers.js', 'Next.js', 'IPFS'],
    metrics: {
      lighthouse: { performance: 91, accessibility: 97, bestPractices: 100, seo: 90 },
      loadTime: '0.7s',
      uptime: '99.95%',
      responseTime: '22ms',
    },
    architecture: {
      nodes: [
        {
          id: 'e1',
          label: 'Chain_Bridge',
          type: 'service',
          description: 'Multi-chain connector',
          position: { x: 50, y: 100 },
        },
        {
          id: 'e2',
          label: 'Vault_Core',
          type: 'auth',
          description: 'ZK-proof engine',
          position: { x: 250, y: 100 },
        },
      ],
      connections: [{ from: 'e1', to: 'e2', animated: true }],
    },
  },
];

// ============================================================================
// PROJECT CARD
// ============================================================================

const ProjectCard = memo(
  ({
    mission,
    idx,
    onSelect,
  }: {
    mission: ProjectData;
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
      <MotionDiv
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="group relative h-full"
        style={{ perspective: '2000px' }}
      >
        <MotionDiv
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY }}
          className={cn(
            'relative p-10 h-full rounded-[2.5rem] transition-all duration-700 flex flex-col overflow-hidden border-[1px] backdrop-blur-[40px]',
            'bg-white/95 dark:bg-space-black/90',
            'border-slate-300/50 dark:border-white/10 hover:border-vision-cyan/60 shadow-[0_30px_60px_rgba(0,0,0,0.06)] dark:shadow-[0_40px_100px_rgba(0,0,0,0.9)]'
          )}
        >
          {/* Lighting Edge Effect */}
          <div className="absolute inset-0 pointer-events-none z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
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

          {/* Subtle Ambient HUD Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
            <div className="absolute top-0 right-0 w-80 h-80 bg-vision-crimson/10 blur-[120px] translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-vision-cyan/10 blur-[120px] -translate-x-1/2 translate-y-1/2" />
          </div>

          <MotionDiv
            style={{ x: contentX, y: contentY }}
            className="relative z-10 flex-1 flex flex-col"
          >
            <div className="flex justify-between items-start mb-12">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-vision-crimson shadow-[0_0_12px_#E11D48] animate-pulse" />
                  <span className="text-[11px] font-mono font-black text-vision-crimson uppercase tracking-[0.6em] drop-shadow-[0_0_10px_rgba(225,29,72,0.5)]">
                    {mission.id}
                  </span>
                </div>
                <div className="text-[10px] font-mono font-bold text-slate-400 dark:text-text-dark/30 uppercase tracking-[0.4em] italic">
                  {mission.category}
                </div>
              </div>
              <div className="h-12 w-12 glassmorphism rounded-2xl flex items-center justify-center text-slate-300 dark:text-text-dark/20 group-hover:text-vision-cyan border border-slate-200 dark:border-white/5 group-hover:border-vision-cyan/40 transition-all shadow-xl bg-white/20 dark:bg-black/40">
                <Icons.Hex />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-3xl font-display font-black text-slate-900 dark:text-text-dark tracking-tighter uppercase italic group-hover:text-vision-cyan transition-colors duration-500 leading-[1.1]">
                {mission.title}
              </h3>
              <p className="text-[14px] font-bold leading-relaxed text-slate-600 dark:text-text-dark/50 line-clamp-3">
                {mission.description}
              </p>
            </div>
          </MotionDiv>

          <div className="mt-14 space-y-8 relative z-10">
            <div className="flex flex-wrap gap-2.5">
              {mission.technologies.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="px-5 py-2.5 bg-slate-100 dark:bg-white/5 rounded-2xl text-[10px] font-mono font-black text-slate-600 dark:text-text-dark/40 border border-slate-200 dark:border-white/5 group-hover:border-vision-cyan/30 transition-all uppercase tracking-tighter"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-slate-200/60 dark:border-white/10">
              <div className="flex flex-col gap-1.5">
                <div className="text-[8px] font-mono font-black text-slate-400 dark:text-text-dark/20 uppercase tracking-[0.4em]">
                  Node_Ping
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-vision-cyan shadow-[0_0_14px_#22D3EE] animate-pulse" />
                  <span className="text-[12px] font-mono font-black tracking-[0.2em] text-slate-900 dark:text-text-dark uppercase">
                    {mission.metrics?.responseTime}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onSelect(mission)}
                className="h-14 w-14 rounded-2xl glassmorphism flex items-center justify-center text-slate-400 dark:text-text-dark/40 hover:text-white dark:hover:text-space-black hover:bg-vision-crimson dark:hover:bg-vision-cyan hover:scale-110 transition-all border border-slate-200 dark:border-white/5 shadow-[0_15px_30px_rgba(0,0,0,0.1)]"
              >
                <Icons.External />
              </button>
            </div>
          </div>

          {/* HUD Brackets - Crimson & Cyan with Glow */}
          <div className="absolute top-6 left-6 w-10 h-10 border-t-[3px] border-l-[3px] border-vision-crimson/40 rounded-tl-xl group-hover:border-vision-crimson group-hover:shadow-[0_0_20px_#E11D48] transition-all duration-500" />
          <div className="absolute bottom-6 right-6 w-10 h-10 border-b-[3px] border-r-[3px] border-vision-cyan/40 rounded-br-xl group-hover:border-vision-cyan group-hover:shadow-[0_0_20px_#22D3EE] transition-all duration-500" />
        </MotionDiv>
      </MotionDiv>
    );
  }
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const ProjectsSection = ({ onModalToggle }: { onModalToggle?: (open: boolean) => void }) => {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-10%' });
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  useEffect(() => {
    onModalToggle?.(!!selectedProject);
  }, [selectedProject, onModalToggle]);

  return (
    <section
      ref={containerRef}
      id="projects"
      className="relative py-20 px-6 bg-stone-50 dark:bg-space-black transition-colors duration-1000 overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-96 bg-vision-cyan/[0.04] dark:bg-vision-cyan/[0.02] blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-10">
          <div className="space-y-6">
            <MotionDiv
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              className="inline-flex items-center gap-4 px-6 py-2 rounded-full glassmorphism border border-vision-cyan/20 text-vision-cyan font-mono text-[10px] font-black tracking-[0.5em] uppercase shadow-md dark:shadow-[0_0_30px_rgba(34,211,238,0.2)]"
            >
              <Icons.Pulse className="animate-pulse" /> Mission_Vessels // ARC-04
            </MotionDiv>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-black leading-[0.9] tracking-tighter text-slate-900 dark:text-text-dark uppercase italic">
              Digital <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-vision-orange via-vision-cyan to-vision-orange drop-shadow-2xl">
                Vessels.
              </span>
            </h2>
          </div>

          <a
            href="/projects"
            className="group flex items-center gap-6 text-[12px] font-mono font-black uppercase tracking-[0.5em] text-slate-400 dark:text-text-dark/30 hover:text-vision-cyan transition-all duration-700"
          >
            Establish_Data_Archive{' '}
            <div className="h-[2px] w-12 bg-current group-hover:w-24 transition-all duration-700 opacity-40 group-hover:opacity-100" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MISSIONS.map((mission, idx) => (
            <ProjectCard
              key={mission.id}
              mission={mission}
              idx={idx}
              onSelect={setSelectedProject}
            />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/projects"
            className="px-12 py-5 glassmorphism border-2 border-vision-crimson/30 rounded-2xl text-[12px] font-mono font-black text-vision-crimson uppercase tracking-[0.5em] hover:scale-105 hover:bg-vision-crimson/5 hover:border-vision-crimson/60 transition-all shadow-[0_15px_40px_rgba(225,29,72,0.2)] flex items-center gap-4"
          >
            Show All Archives <Icons.ArrowRight />
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

export default ProjectsSection;

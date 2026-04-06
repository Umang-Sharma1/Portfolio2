'use client';

import React, { useState, useEffect, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModalContext } from '@/lib/modal-context';

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

// ============================================================================
// TYPES
// ============================================================================

export interface ProjectMetrics {
  lighthouse?: {
    performance?: number;
    accessibility?: number;
    bestPractices?: number;
    seo?: number;
  };
  users?: number;
  loadTime?: string;
  uptime?: string;
  responseTime?: string;
}

export interface ArchitectureNode {
  id: string;
  label: string;
  type: 'frontend' | 'backend' | 'database' | 'service' | 'cache' | 'external' | 'auth';
  description: string;
  technologies?: string[];
  position: { x: number; y: number };
}

export interface ArchitectureConnection {
  from: string;
  to: string;
  label?: string;
  type?: 'sync' | 'async' | 'realtime' | 'cache';
  animated?: boolean;
}

export interface ProjectData {
  id: string;
  title: string;
  slug: string;
  description: string;
  fullDescription?: string;
  tagline?: string;
  category: string;
  status: 'completed' | 'in-progress' | 'planned';
  featured: boolean;
  technologies: string[];
  metrics?: ProjectMetrics;
  role?: string;
  features?: string[];
  images?: {
    thumbnail?: string;
    banner?: string;
    screenshots?: string[];
  };
  architecture?: {
    nodes: ArchitectureNode[];
    connections: ArchitectureConnection[];
  };
  links?: {
    github?: string;
    live?: string;
    demo?: string;
  };
  challenges?: string;
  learnings?: string;
}

interface ProjectModalProps {
  project: ProjectData | null;
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'Overview' | 'Architecture' | 'Links';

// ============================================================================
// ICONS
// ============================================================================

const Icons = {
  Close: memo(() => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )),
  Activity: memo(({ className }: { className?: string }) => (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )),
  Terminal: memo(({ className }: { className?: string }) => (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" x2="20" y1="19" y2="19" />
    </svg>
  )),
  Cpu: memo(({ className }: { className?: string }) => (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="16" x="4" y="4" rx="2" />
      <rect width="6" height="6" x="9" y="9" rx="1" />
      <path d="M15 2v2" />
      <path d="M15 20v2" />
      <path d="M2 15h2" />
      <path d="M2 9h2" />
      <path d="M20 15h2" />
      <path d="M20 9h2" />
      <path d="M9 2v2" />
      <path d="M9 20v2" />
    </svg>
  )),
  External: memo(({ className }: { className?: string }) => (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  )),
};

const MotionDiv = motion.div as any;
const MotionCircle = motion.circle as any;

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const Gauge = memo(({ label, score }: { label: string; score: number }) => {
  const circumference = 2 * Math.PI * 24;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 60 60">
          <circle
            cx="30"
            cy="30"
            r="24"
            fill="none"
            strokeWidth="5"
            className="stroke-slate-200 dark:stroke-white/5"
          />
          <MotionCircle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            cx="30"
            cy="30"
            r="24"
            fill="none"
            strokeWidth="5"
            strokeLinecap="round"
            className="stroke-vision-cyan drop-shadow-[0_0_12px_rgba(var(--glow-cyan),1)]"
            style={{ strokeDasharray: circumference }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-mono font-black text-vision-cyan">
          {score}
        </span>
      </div>
      <span className="text-[10px] font-mono font-black text-slate-500 dark:text-text-dark/20 uppercase tracking-[0.4em]">
        {label}
      </span>
    </div>
  );
});

const ArchitectureMap = memo(
  ({
    nodes,
    connections,
  }: {
    nodes: ArchitectureNode[];
    connections: ArchitectureConnection[];
  }) => {
    const nodeMap = useMemo(() => {
      const map = new Map<string, ArchitectureNode>();
      nodes.forEach((n) => map.set(n.id, n));
      return map;
    }, [nodes]);

    return (
      <div className="relative bg-slate-100/50 dark:bg-space-black/30 rounded-3xl border border-slate-200 dark:border-white/10 p-6 overflow-hidden h-full shadow-inner backdrop-blur-3xl">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(rgba(var(--glow-cyan),1)_2px,transparent_2px)] bg-[size:32px_32px]" />

        <div className="absolute top-8 left-8 flex items-center gap-4">
          <Icons.Cpu className="text-vision-cyan w-5 h-5" />
          <span className="text-[10px] font-mono font-black tracking-[0.6em] uppercase text-slate-400 dark:text-text-dark/40 italic">
            Structural_Topology
          </span>
        </div>

        <svg viewBox="0 0 650 400" className="w-full h-auto drop-shadow-2xl">
          <defs>
            <filter id="ultra-glow-modal">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {connections.map((conn, i) => {
            const from = nodeMap.get(conn.from);
            const to = nodeMap.get(conn.to);
            if (!from || !to) return null;

            const x1 = from.position.x + 130;
            const y1 = from.position.y + 35;
            const x2 = to.position.x;
            const y2 = to.position.y + 35;

            return (
              <g key={i}>
                <path
                  d={`M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`}
                  stroke="currentColor"
                  className="text-vision-cyan/20 dark:text-vision-cyan/10"
                  strokeWidth="2.5"
                  fill="none"
                />
                {conn.animated && (
                  <circle r="4" className="fill-vision-cyan" filter="url(#ultra-glow-modal)">
                    <animateMotion
                      dur="2s"
                      repeatCount="indefinite"
                      path={`M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`}
                    />
                  </circle>
                )}
              </g>
            );
          })}

          {nodes.map((node) => (
            <g
              key={node.id}
              transform={`translate(${node.position.x}, ${node.position.y})`}
              className="group/node cursor-default"
            >
              <rect
                width="130"
                height="70"
                rx="20"
                className="fill-white dark:fill-space-black stroke-slate-200 dark:stroke-white/5 group-hover/node:stroke-vision-cyan/50 transition-all duration-500 shadow-xl"
                strokeWidth="2"
              />
              <rect
                width="5"
                height="70"
                rx="2.5"
                className="fill-vision-crimson group-hover/node:fill-vision-cyan transition-colors"
              />
              <text
                x="18"
                y="32"
                className="fill-slate-900 dark:fill-text-dark text-[11px] font-mono font-black uppercase tracking-tight"
              >
                {node.label}
              </text>
              <text
                x="18"
                y="50"
                className="fill-slate-500 dark:fill-text-dark/40 text-[9px] font-mono uppercase tracking-[0.2em] font-bold italic"
              >
                {node.type}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  }
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('Overview');
  const [isHoveringLaunch, setIsHoveringLaunch] = useState(false);
  const { setModalOpen } = useModalContext();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setActiveTab('Overview');
      setModalOpen(true);
    } else {
      document.body.style.overflow = 'auto';
      setModalOpen(false);
    }
    return () => {
      setModalOpen(false);
    };
  }, [isOpen, setModalOpen]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  if (!isOpen || !project) return null;

  const heroImage = project.images?.banner || project.images?.thumbnail;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8 overflow-hidden">
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/70 dark:bg-space-black/90 backdrop-blur-3xl"
          onClick={onClose}
        />

        <MotionDiv
          initial={{ opacity: 0, scale: 0.88, y: 32, rotateX: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl max-h-[92vh] glassmorphism rounded-[3rem] border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col shadow-[0_50px_100px_rgba(0,0,0,0.4)] bg-white dark:bg-space-black"
        >
          {/* HUD Accents */}
          <div className="absolute top-6 left-6 w-10 h-10 border-t-[3px] border-l-[3px] border-vision-crimson/30 rounded-tl-2xl pointer-events-none" />
          <div className="absolute bottom-6 right-6 w-10 h-10 border-b-[3px] border-r-[3px] border-vision-cyan/30 rounded-br-2xl pointer-events-none" />

          {/* Dotted Background Overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.06] z-0"
            style={{
              backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          {/* Header — image as blurred background */}
          <div className="relative shrink-0 z-10 overflow-hidden">
            {/* Blurred image backdrop */}
            {heroImage && (
              <div className="absolute inset-0">
                <img src={heroImage} alt="" className="w-full h-full object-cover scale-110" />
                <div className="absolute inset-0 bg-slate-900/80 dark:bg-space-black/85 backdrop-blur-xl" />
                <div className="absolute inset-0 bg-gradient-to-r from-vision-crimson/20 via-transparent to-vision-cyan/20" />
              </div>
            )}
            {/* Fallback gradient when no image */}
            {!heroImage && (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-space-black dark:to-space-black" />
            )}

            {/* Header content */}
            <div className="relative z-10 px-8 pt-8 pb-0 md:px-12">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="space-y-2 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/70 text-[9px] font-mono font-black tracking-[0.4em] uppercase">
                      {project.category}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[9px] font-mono font-black tracking-[0.35em] uppercase">
                      <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${
                        project.status === 'in-progress' ? 'bg-amber-400' :
                        project.status === 'planned' ? 'bg-vision-orange' : 'bg-emerald-400'
                      }`} />
                      <span className="text-white/40">{project.status}</span>
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-display font-black text-white tracking-tighter leading-tight uppercase italic drop-shadow-lg">
                    {project.title}
                  </h2>
                  {project.tagline && (
                    <p className="text-[12px] text-white/50 font-mono italic">{project.tagline}</p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="shrink-0 h-10 w-10 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white/50 hover:text-white hover:bg-white/20 hover:border-white/40 transition-all flex items-center justify-center"
                >
                  <Icons.Close />
                </button>
              </div>

              {/* Tabs — sit flush against content area */}
              <div className="flex gap-0.5">
                {(['Overview', 'Architecture', 'Links'] as TabType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => handleTabChange(t)}
                    className={cn(
                      'relative px-6 py-3 text-[9px] font-mono font-black uppercase tracking-[0.4em] transition-all duration-200 rounded-t-2xl',
                      activeTab === t
                        ? 'bg-white dark:bg-space-black text-slate-900 dark:text-text-dark shadow-none'
                        : 'text-white/40 hover:text-white/70 hover:bg-white/10'
                    )}
                  >
                    {t}
                    {activeTab === t && (
                      <motion.div
                        layoutId="modal-active-tab"
                        className="absolute inset-0 rounded-t-2xl bg-white dark:bg-space-black -z-10"
                        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className={cn(
            'flex-1 overflow-y-auto relative z-10 custom-scrollbar bg-white dark:bg-space-black',
            activeTab === 'Architecture' ? 'p-0' : 'px-8 md:px-12 py-8 space-y-10'
          )}>
            <AnimatePresence mode="wait">
              <MotionDiv
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className={activeTab === 'Architecture' ? 'h-full' : 'space-y-10'}
              >
                  {activeTab === 'Overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                      <div className="lg:col-span-7 space-y-8">
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-mono font-black text-vision-cyan uppercase tracking-[0.5em] flex items-center gap-4">
                            <div className="h-[1px] w-10 bg-vision-cyan/40" /> Mission_Core
                          </h4>
                          <p className="text-lg md:text-xl font-bold leading-relaxed text-slate-700 dark:text-text-dark/80 italic">
                            {project.fullDescription || project.description}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {project.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-5 py-2.5 glassmorphism rounded-2xl text-[10px] font-mono font-black text-slate-500 dark:text-text-dark/40 uppercase border border-slate-200 dark:border-white/5 hover:border-vision-cyan/40 transition-all bg-white/60 dark:bg-black/30"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        {/* Features */}
                        {project.features && project.features.length > 0 && (
                          <div className="space-y-4">
                            <h4 className="text-[10px] font-mono font-black text-vision-cyan uppercase tracking-[0.5em] flex items-center gap-4">
                              <div className="h-[1px] w-10 bg-vision-cyan/40" /> Key_Features
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {project.features.map((feature, i) => (
                                <div key={i} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5">
                                  <div className="h-5 w-5 rounded-lg bg-vision-cyan/10 border border-vision-cyan/30 flex items-center justify-center shrink-0 mt-0.5">
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-vision-cyan" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                                  </div>
                                  <span className="text-[12px] font-mono text-slate-600 dark:text-text-dark/60 leading-snug">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Challenges */}
                        {project.challenges && (
                          <div className="space-y-3">
                            <h4 className="text-[10px] font-mono font-black text-vision-crimson uppercase tracking-[0.5em] flex items-center gap-4">
                              <div className="h-[1px] w-10 bg-vision-crimson/40" /> Challenges
                            </h4>
                            <p className="text-[13px] font-medium leading-relaxed text-slate-600 dark:text-text-dark/60 italic p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
                              {project.challenges}
                            </p>
                          </div>
                        )}

                        {/* Learnings */}
                        {project.learnings && (
                          <div className="space-y-3">
                            <h4 className="text-[10px] font-mono font-black text-vision-orange uppercase tracking-[0.5em] flex items-center gap-4">
                              <div className="h-[1px] w-10 bg-vision-orange/40" /> Learnings
                            </h4>
                            <p className="text-[13px] font-medium leading-relaxed text-slate-600 dark:text-text-dark/60 italic p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
                              {project.learnings}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="lg:col-span-5">
                        <div className="p-8 rounded-[2.5rem] glassmorphism border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-white/[0.03] space-y-10 shadow-xl relative overflow-hidden backdrop-blur-2xl">
                          <h4 className="text-[10px] font-mono font-black text-vision-crimson uppercase tracking-[0.5em] relative z-10 flex items-center gap-3">
                            <Icons.Activity className="w-4 h-4 animate-pulse" /> Telemetry_Output
                          </h4>
                          <div className="grid grid-cols-2 gap-8 relative z-10">
                            <div className="space-y-1.5">
                              <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-black italic">
                                DELAY
                              </div>
                              <div className="text-xl font-display font-black text-slate-900 dark:text-text-dark">
                                {project.metrics?.responseTime}
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-black italic">
                                UPTIME
                              </div>
                              <div className="text-xl font-display font-black text-vision-cyan text-glow-cyan">
                                {project.metrics?.uptime}
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-black italic">
                                LOAD
                              </div>
                              <div className="text-xl font-display font-black text-vision-orange">
                                {project.metrics?.loadTime}
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-black italic">
                                LINK
                              </div>
                              <div className="text-xl font-display font-black text-green-500/90">
                                SECURE
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'Architecture' && (
                    <div className="flex flex-col h-full min-h-[420px]">
                      <div className="px-8 md:px-12 pt-8 pb-4 flex items-center gap-4 border-b border-slate-100 dark:border-white/5 shrink-0">
                        <h4 className="text-[10px] font-mono font-black text-vision-cyan uppercase tracking-[0.5em] flex items-center gap-3">
                          <Icons.Cpu className="w-4 h-4" /> Topology_Visualization
                        </h4>
                        <span className="text-[9px] font-mono text-slate-400 dark:text-text-dark/20 tracking-[0.3em]">
                          {project.architecture?.nodes.length ?? 0} nodes · {project.architecture?.connections.length ?? 0} connections
                        </span>
                      </div>
                      <div className="flex-1 p-4 md:p-6">
                        <ArchitectureMap
                          nodes={project.architecture?.nodes || []}
                          connections={project.architecture?.connections || []}
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'Links' && (
                    <div className="space-y-8">
                      <h4 className="text-[10px] font-mono font-black text-vision-cyan uppercase tracking-[0.5em] flex items-center gap-4">
                        <div className="h-[1px] w-10 bg-vision-cyan/40" /> External_Links
                      </h4>

                      {/* Link cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {project.links?.github ? (
                          <a
                            href={project.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/link flex items-center gap-5 p-6 rounded-[2rem] bg-slate-900 dark:bg-white/[0.04] border border-slate-700 dark:border-white/10 hover:border-vision-cyan/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(var(--glow-cyan),0.1)]"
                          >
                            <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10 group-hover/link:border-vision-cyan/40 transition-colors">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white/70 group-hover/link:text-vision-cyan transition-colors"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-[11px] font-mono font-black text-white/90 group-hover/link:text-vision-cyan transition-colors uppercase tracking-[0.2em]">GitHub Repo</div>
                              <div className="text-[10px] font-mono text-white/30 mt-0.5 truncate">{project.links.github}</div>
                            </div>
                            <Icons.External className="shrink-0 opacity-30 group-hover/link:opacity-100 group-hover/link:text-vision-cyan transition-all text-white" />
                          </a>
                        ) : (
                          <div className="flex items-center gap-5 p-6 rounded-[2rem] border border-dashed border-slate-300 dark:border-white/10 opacity-30">
                            <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-slate-400"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                            </div>
                            <span className="text-[11px] font-mono font-black text-slate-500 dark:text-text-dark/30 uppercase tracking-[0.2em]">No GitHub link yet</span>
                          </div>
                        )}

                        {project.links?.live ? (
                          <a
                            href={project.links.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/link flex items-center gap-5 p-6 rounded-[2rem] bg-vision-cyan/5 border border-vision-cyan/20 hover:border-vision-cyan/50 transition-all duration-300 hover:bg-vision-cyan/10 hover:shadow-[0_0_30px_rgba(var(--glow-cyan),0.12)]"
                          >
                            <div className="h-12 w-12 rounded-2xl bg-vision-cyan/10 flex items-center justify-center shrink-0 border border-vision-cyan/30 group-hover/link:border-vision-cyan/60 transition-colors">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-vision-cyan" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-[11px] font-mono font-black text-vision-cyan uppercase tracking-[0.2em]">Live Demo</div>
                              <div className="text-[10px] font-mono text-vision-cyan/40 mt-0.5 truncate">{project.links.live}</div>
                            </div>
                            <Icons.External className="shrink-0 opacity-40 group-hover/link:opacity-100 transition-opacity text-vision-cyan" />
                          </a>
                        ) : (
                          <div className="flex items-center gap-5 p-6 rounded-[2rem] border border-dashed border-slate-300 dark:border-white/10 opacity-30">
                            <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-slate-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/></svg>
                            </div>
                            <span className="text-[11px] font-mono font-black text-slate-500 dark:text-text-dark/30 uppercase tracking-[0.2em]">No live link yet</span>
                          </div>
                        )}
                      </div>

                      {/* Project meta grid */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-5 rounded-[1.5rem] bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 space-y-1.5">
                          <div className="text-[9px] font-mono uppercase tracking-[0.4em] text-slate-400 dark:text-text-dark/30 font-black">Category</div>
                          <div className="text-[13px] font-mono font-black text-slate-900 dark:text-text-dark">{project.category}</div>
                        </div>
                        <div className="p-5 rounded-[1.5rem] bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 space-y-1.5">
                          <div className="text-[9px] font-mono uppercase tracking-[0.4em] text-slate-400 dark:text-text-dark/30 font-black">Status</div>
                          <div className="flex items-center gap-2">
                            <span className={`h-2 w-2 rounded-full ${project.status === 'in-progress' ? 'bg-amber-400' : project.status === 'planned' ? 'bg-vision-orange' : 'bg-emerald-400'}`} />
                            <span className="text-[13px] font-mono font-black text-slate-900 dark:text-text-dark capitalize">{project.status}</span>
                          </div>
                        </div>
                        <div className="p-5 rounded-[1.5rem] bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 space-y-1.5">
                          <div className="text-[9px] font-mono uppercase tracking-[0.4em] text-slate-400 dark:text-text-dark/30 font-black">Tech Stack</div>
                          <div className="text-[13px] font-mono font-black text-vision-cyan">{project.technologies.length} tools</div>
                        </div>
                        <div className="p-5 rounded-[1.5rem] bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 space-y-1.5">
                          <div className="text-[9px] font-mono uppercase tracking-[0.4em] text-slate-400 dark:text-text-dark/30 font-black">Features</div>
                          <div className="text-[13px] font-mono font-black text-vision-crimson">{project.features?.length ?? 0} listed</div>
                        </div>
                      </div>

                      {/* Tech tags */}
                      <div className="space-y-3">
                        <div className="text-[9px] font-mono font-black text-slate-400 dark:text-text-dark/30 uppercase tracking-[0.4em]">Full Stack</div>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech) => (
                            <span key={tech} className="px-4 py-2 rounded-xl text-[10px] font-mono font-black text-slate-600 dark:text-text-dark/50 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-vision-cyan/40 transition-all uppercase tracking-tight">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
              </MotionDiv>
            </AnimatePresence>
          </div>

          {/* Modal Footer */}
          <div className="px-8 py-6 md:px-12 border-t border-slate-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10 bg-slate-50/95 dark:bg-space-black/95 backdrop-blur-3xl">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-8 text-[10px] font-mono font-black text-slate-400 dark:text-text-dark/30 uppercase tracking-[0.4em]">
                <div className="flex items-center gap-3">
                  <Icons.Activity className="text-vision-cyan animate-pulse" />
                  <span>PROTOCOL: ACTIVE</span>
                </div>
              </div>
              {project.links?.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-vision-cyan/40 hover:text-vision-cyan transition-all text-slate-500 dark:text-text-dark/40"
                  title="GitHub Repository"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
              )}
              {project.links?.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 px-4 flex items-center gap-2 rounded-xl bg-vision-cyan/10 border border-vision-cyan/30 hover:bg-vision-cyan/20 transition-all text-[9px] font-mono font-black text-vision-cyan uppercase tracking-[0.3em]"
                >
                  <Icons.External className="w-3 h-3" />
                  Live
                </a>
              )}
            </div>

            <button
              onMouseEnter={() => setIsHoveringLaunch(true)}
              onMouseLeave={() => setIsHoveringLaunch(false)}
              className={cn(
                'group relative px-12 py-3.5 rounded-2xl overflow-hidden transition-all duration-500',
                'bg-vision-orange text-white',
                'dark:bg-vision-cyan dark:text-space-black',
                'shadow-[0_15px_30px_rgba(0,0,0,0.1)] hover:scale-[1.05] active:scale-[0.98] min-w-[220px] font-mono font-black text-[11px] uppercase tracking-[0.5em]'
              )}
            >
              <MotionDiv
                className="absolute inset-0 bg-white/30 dark:bg-black/10 origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isHoveringLaunch ? 1 : 0 }}
                transition={{ duration: 0.6, ease: 'circOut' }}
              />

              <span className="relative z-10 flex items-center justify-center gap-4">
                Execute_Mission
                <Icons.External className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-500" />
              </span>
            </button>
          </div>
        </MotionDiv>
      </div>
    </AnimatePresence>
  );
};

export default ProjectModal;

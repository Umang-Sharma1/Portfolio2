'use client';

import React, { useState, useEffect, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Spinner } from '../ui/loaders';
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
  architecture?: {
    nodes: ArchitectureNode[];
    connections: ArchitectureConnection[];
  };
}

interface ProjectModalProps {
  project: ProjectData | null;
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'Overview' | 'Architecture' | 'Integrity';

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
      <div className="relative bg-slate-100/50 dark:bg-space-black/30 rounded-[3rem] border-2 border-slate-200 dark:border-white/10 p-12 overflow-hidden min-h-[400px] shadow-inner backdrop-blur-3xl">
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
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { setModalOpen } = useModalContext();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setActiveTab('Overview');
      setIsInitialLoad(true);
      setIsLoading(true);
      setModalOpen(true);
      // Longer initial load with staged reveal
      setTimeout(() => {
        setIsInitialLoad(false);
        setIsLoading(false);
      }, 1800);
    } else {
      document.body.style.overflow = 'auto';
      setModalOpen(false);
    }
    return () => {
      setModalOpen(false);
    };
  }, [isOpen, setModalOpen]);

  const triggerLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1200);
  };

  const handleTabChange = (tab: TabType) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    triggerLoading();
  };

  if (!isOpen || !project) return null;

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
          initial={{ opacity: 0, scale: 0.97, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 20 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
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

          {/* Compact Header */}
          <div className="px-8 py-4 md:px-12 md:py-6 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10 border-b border-slate-100 dark:border-white/5 bg-white/40 dark:bg-black/20 backdrop-blur-md">
            <div className="space-y-2 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glassmorphism border-[1.5px] border-vision-crimson/40 text-vision-crimson text-[9px] font-mono font-black tracking-[0.5em] uppercase bg-vision-crimson/5">
                  ID: {project.id}
                </div>
                <div className="text-[10px] font-mono font-black text-slate-400 dark:text-text-dark/20 tracking-[0.3em] uppercase italic">
                  // {project.category}
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-black text-slate-900 dark:text-text-dark tracking-tighter leading-tight uppercase italic">
                {project.title}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="h-12 w-12 glassmorphism rounded-2xl text-slate-400 dark:text-text-dark/40 hover:text-vision-crimson hover:border-vision-crimson/40 transition-all border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 flex items-center justify-center shadow-lg"
            >
              <Icons.Close />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="px-8 md:px-12 pt-6 flex gap-3 relative z-10">
            {['Overview', 'Architecture', 'Integrity'].map((t) => (
              <button
                key={t}
                onClick={() => handleTabChange(t as TabType)}
                className={cn(
                  'px-6 py-2.5 rounded-xl text-[9px] font-mono font-black uppercase tracking-[0.4em] transition-all duration-400 border',
                  activeTab === t
                    ? 'bg-vision-cyan text-space-black border-vision-cyan shadow-[0_0_20px_rgba(var(--glow-cyan),0.2)] scale-105'
                    : 'text-slate-500 dark:text-text-dark/30 border-slate-100 dark:border-transparent hover:text-slate-900 dark:hover:text-text-dark hover:bg-slate-100 dark:hover:bg-white/5'
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto px-8 md:px-12 py-8 space-y-10 relative z-10 custom-scrollbar min-h-[400px]">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <MotionDiv
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 dark:bg-space-black/50 backdrop-blur-sm z-50"
                >
                  <Spinner size={isInitialLoad ? 'lg' : 'md'} showText variant="cyan" />
                  {isInitialLoad && (
                    <MotionDiv
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-8 space-y-3 flex flex-col items-center"
                    >
                      <div className="text-[9px] font-mono font-black text-vision-crimson/60 uppercase tracking-[0.6em]">
                        Loading Mission Profile
                      </div>
                      <div className="w-48 h-[2px] bg-white/5 overflow-hidden rounded-full">
                        <MotionDiv
                          className="h-full bg-gradient-to-r from-vision-cyan to-vision-crimson"
                          initial={{ width: '0%' }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 1.6, ease: 'easeInOut' }}
                        />
                      </div>
                    </MotionDiv>
                  )}
                </MotionDiv>
              ) : (
                <MotionDiv
                  key={activeTab}
                  initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(8px)' }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-10"
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
                    <div className="space-y-8">
                      <h4 className="text-[10px] font-mono font-black text-vision-cyan uppercase tracking-[0.5em] flex items-center gap-4">
                        <div className="h-[1px] w-10 bg-vision-cyan/40" /> Topology_Visualization
                      </h4>
                      <ArchitectureMap
                        nodes={project.architecture?.nodes || []}
                        connections={project.architecture?.connections || []}
                      />
                    </div>
                  )}

                  {activeTab === 'Integrity' && (
                    <div className="space-y-8">
                      <h4 className="text-[10px] font-mono font-black text-vision-crimson uppercase tracking-[0.5em] flex items-center gap-4">
                        <div className="h-[1px] w-10 bg-vision-crimson/40" /> Core_Diagnostics
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-12 rounded-[3rem] glassmorphism border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-white/[0.03] shadow-xl backdrop-blur-3xl">
                        <Gauge
                          label="Load"
                          score={project.metrics?.lighthouse?.performance || 95}
                        />
                        <Gauge
                          label="Access"
                          score={project.metrics?.lighthouse?.accessibility || 98}
                        />
                        <Gauge
                          label="Rules"
                          score={project.metrics?.lighthouse?.bestPractices || 100}
                        />
                        <Gauge label="SEO" score={project.metrics?.lighthouse?.seo || 92} />
                      </div>
                    </div>
                  )}
                </MotionDiv>
              )}
            </AnimatePresence>
          </div>

          {/* Modal Footer */}
          <div className="px-8 py-6 md:px-12 border-t border-slate-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10 bg-slate-50/95 dark:bg-space-black/95 backdrop-blur-3xl">
            <div className="flex items-center gap-8 text-[10px] font-mono font-black text-slate-400 dark:text-text-dark/30 uppercase tracking-[0.4em]">
              <div className="flex items-center gap-3">
                <Icons.Activity className="text-vision-cyan animate-pulse" />
                <span>PROTOCOL: ACTIVE</span>
              </div>
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

'use client';

import React, { useState, useEffect, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )),
  Activity: memo(({ className }: { className?: string }) => (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )),
  Terminal: memo(({ className }: { className?: string }) => (
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
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" x2="20" y1="19" y2="19" />
    </svg>
  )),
  Cpu: memo(({ className }: { className?: string }) => (
    <svg
      className={className}
      width="20"
      height="20"
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
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const Gauge = memo(({ label, score }: { label: string; score: number }) => {
  const circumference = 2 * Math.PI * 22;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 50 50">
          <circle
            cx="25"
            cy="25"
            r="22"
            fill="none"
            strokeWidth="4"
            className="stroke-slate-200 dark:stroke-white/5"
          />
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            cx="25"
            cy="25"
            r="22"
            fill="none"
            strokeWidth="4"
            strokeLinecap="round"
            className="stroke-vision-cyan drop-shadow-[0_0_10px_#22D3EE]"
            style={{ strokeDasharray: circumference }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-mono font-black text-vision-cyan">
          {score}
        </span>
      </div>
      <span className="text-[10px] font-mono font-black text-slate-400 dark:text-text-dark/20 uppercase tracking-[0.4em]">
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
      <div className="relative bg-slate-50 dark:bg-space-black/40 rounded-[3rem] border-2 border-slate-200 dark:border-white/5 p-12 overflow-hidden min-h-[450px] shadow-inner">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#22D3EE_1.5px,transparent_1.5px)] bg-[size:24px_24px]" />

        <div className="absolute top-8 left-8 flex items-center gap-4">
          <Icons.Cpu className="text-vision-cyan/60" />
          <span className="text-[10px] font-mono font-black tracking-[0.6em] uppercase text-slate-400 dark:text-text-dark/40 italic">
            Structural_Logical_Topology
          </span>
        </div>

        <svg viewBox="0 0 600 350" className="w-full h-auto drop-shadow-2xl">
          <defs>
            <filter id="neon-glow-fx">
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
                  className="text-vision-cyan/10"
                  strokeWidth="2.5"
                  fill="none"
                />
                {conn.animated && (
                  <circle r="3.5" fill="#22D3EE" filter="url(#neon-glow-fx)">
                    <animateMotion
                      dur="3s"
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
                className="fill-white dark:fill-space-black stroke-slate-200 dark:stroke-white/10 group-hover/node:stroke-vision-cyan/40 transition-all duration-500 shadow-xl"
                strokeWidth="2"
              />
              <rect
                width="5"
                height="70"
                rx="2.5"
                className="fill-vision-crimson/50 group-hover/node:fill-vision-cyan transition-colors"
              />
              <text
                x="18"
                y="32"
                className="fill-slate-900 dark:fill-text-dark text-[11px] font-mono font-black uppercase tracking-tighter"
              >
                {node.label}
              </text>
              <text
                x="18"
                y="50"
                className="fill-slate-400 dark:fill-text-dark/40 text-[9px] font-mono uppercase tracking-widest font-bold"
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

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }, [isOpen]);

  if (!isOpen || !project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 md:p-10 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 dark:bg-space-black/95 backdrop-blur-2xl"
          onClick={onClose}
        />

        {/* HUD Scan Overlay */}
        <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.05]">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] animate-scan" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-6xl h-full max-h-[90vh] glassmorphism rounded-[4rem] border-2 border-slate-200 dark:border-white/10 overflow-hidden flex flex-col shadow-[0_40px_100px_rgba(0,0,0,0.3)] bg-white dark:bg-space-black"
        >
          {/* Header */}
          <div className="p-12 md:p-16 flex flex-col md:flex-row justify-between items-start gap-12 relative z-10 border-b border-slate-100 dark:border-white/5">
            <div className="space-y-10">
              <div className="flex items-center gap-6">
                <div className="px-6 py-2 rounded-full glassmorphism border-2 border-vision-crimson/40 text-vision-crimson text-[11px] font-mono font-black tracking-[0.5em] uppercase shadow-[0_0_20px_rgba(225,29,72,0.15)] bg-vision-crimson/5">
                  MISSION_LOG_{project.id}
                </div>
                <div className="text-[12px] font-mono font-black text-slate-400 dark:text-text-dark/30 tracking-[0.4em] uppercase border-l border-current/20 pl-6 italic">
                  ARCHIVE_SECTOR: {project.category}
                </div>
              </div>
              <h2 className="text-5xl md:text-8xl font-display font-black text-slate-900 dark:text-text-dark tracking-tighter italic leading-none uppercase">
                {project.title}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="group p-5 glassmorphism rounded-3xl text-slate-400 dark:text-text-dark/30 hover:text-vision-crimson hover:border-vision-crimson/50 transition-all border-2 border-slate-200 dark:border-transparent bg-slate-50 dark:bg-white/5"
            >
              <Icons.Close />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto px-12 md:px-16 py-12 space-y-20 relative z-10 custom-scrollbar">
            {/* Tabs */}
            <div className="flex gap-4">
              {['Overview', 'Architecture', 'Integrity'].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t as TabType)}
                  className={cn(
                    'px-8 py-3 rounded-2xl text-[11px] font-mono font-black uppercase tracking-[0.4em] transition-all duration-500 border-2',
                    activeTab === t
                      ? 'bg-vision-cyan text-space-black border-vision-cyan shadow-[0_0_30px_rgba(34,211,238,0.4)] scale-105'
                      : 'text-slate-400 dark:text-text-dark/30 border-slate-100 dark:border-transparent hover:text-slate-900 dark:hover:text-text-dark hover:bg-slate-100 dark:hover:bg-white/5'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -10, filter: 'blur(5px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: 10, filter: 'blur(5px)' }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-12"
              >
                {activeTab === 'Overview' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-7 space-y-12">
                      <div className="space-y-8">
                        <h4 className="text-[12px] font-mono font-black text-vision-cyan uppercase tracking-[0.6em] flex items-center gap-5">
                          <div className="h-[2px] w-12 bg-vision-cyan/30" />{' '}
                          Mission_Payload_Analysis
                        </h4>
                        <p className="text-xl md:text-2xl font-bold leading-relaxed text-slate-700 dark:text-text-dark/60 italic">
                          {project.fullDescription || project.description}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-6 py-3 glassmorphism rounded-2xl text-[11px] font-mono font-black text-slate-500 dark:text-text-dark/40 uppercase border-2 border-slate-100 dark:border-white/5 tracking-widest hover:border-vision-cyan/40 hover:text-vision-cyan transition-all"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="lg:col-span-5">
                      <div className="p-10 rounded-[3.5rem] glassmorphism border-2 border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] space-y-12 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                          <Icons.Terminal className="w-16 h-16 text-vision-crimson" />
                        </div>
                        <h4 className="text-[12px] font-mono font-black text-vision-crimson uppercase tracking-[0.6em] relative z-10">
                          Hardware_Telemetry
                        </h4>
                        <div className="grid grid-cols-2 gap-10 relative z-10">
                          <div className="space-y-2">
                            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black">
                              LATENCY
                            </div>
                            <div className="text-2xl font-display font-black text-slate-900 dark:text-text-dark">
                              {project.metrics?.responseTime}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black">
                              UPTIME
                            </div>
                            <div className="text-2xl font-display font-black text-vision-cyan">
                              {project.metrics?.uptime}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black">
                              LOAD
                            </div>
                            <div className="text-2xl font-display font-black text-vision-orange">
                              {project.metrics?.loadTime}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black">
                              STATUS
                            </div>
                            <div className="text-2xl font-display font-black text-green-500">
                              NOMINAL
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'Architecture' && (
                  <div className="space-y-12">
                    <h4 className="text-[12px] font-mono font-black text-vision-cyan uppercase tracking-[0.6em] flex items-center gap-5">
                      <div className="h-[2px] w-12 bg-vision-cyan/30" /> Infrastructure_Topology_Map
                    </h4>
                    <ArchitectureMap
                      nodes={project.architecture?.nodes || []}
                      connections={project.architecture?.connections || []}
                    />
                  </div>
                )}

                {activeTab === 'Integrity' && (
                  <div className="space-y-12">
                    <h4 className="text-[12px] font-mono font-black text-vision-crimson uppercase tracking-[0.6em] flex items-center gap-5">
                      <div className="h-[2px] w-12 bg-vision-crimson/30" />{' '}
                      Core_Integrity_Diagnostics
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 p-16 rounded-[4rem] glassmorphism border-2 border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] shadow-xl">
                      <Gauge
                        label="Performance"
                        score={project.metrics?.lighthouse?.performance || 95}
                      />
                      <Gauge
                        label="Accessibility"
                        score={project.metrics?.lighthouse?.accessibility || 98}
                      />
                      <Gauge
                        label="Best_Practices"
                        score={project.metrics?.lighthouse?.bestPractices || 100}
                      />
                      <Gauge label="SEO" score={project.metrics?.lighthouse?.seo || 92} />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Modal System Footer */}
          <div className="p-10 border-t border-slate-100 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-10 relative z-10 bg-slate-50/50 dark:bg-space-black/80 backdrop-blur-md">
            <div className="flex items-center gap-12 text-[11px] font-mono font-black text-slate-400 dark:text-text-dark/30 uppercase tracking-[0.6em]">
              <div className="flex items-center gap-4">
                <Icons.Activity className="text-vision-cyan animate-pulse" />
                <span>BITSTREAM: ENCRYPTED</span>
              </div>
              <div className="hidden md:block italic text-vision-orange/40 tabular-nums font-bold">
                SYNC_NODE: 1.0.4-LITE
              </div>
              <div className="hidden md:block font-bold">
                CLOCK:{' '}
                {new Date().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
              </div>
            </div>

            <button className="px-12 py-4 bg-vision-cyan text-space-black font-mono font-black text-[13px] uppercase tracking-[0.6em] rounded-2xl shadow-[0_15px_40px_rgba(34,211,238,0.4)] transition-all hover:scale-105 active:scale-95">
              Initiate_Uplink
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProjectModal;

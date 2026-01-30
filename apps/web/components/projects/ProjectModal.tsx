'use client';

import React, { useState, useEffect, useCallback, useRef, memo, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

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

export interface ProjectTimeline {
  startDate?: string;
  endDate?: string;
  duration?: string;
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

export interface ProjectChallenge {
  problem: string;
  solution: string;
  learning: string;
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
  images: {
    thumbnail?: string;
    banner?: string;
    screenshots?: string[];
  };
  links: {
    live?: string;
    github?: string;
    demo?: string;
  };
  metrics?: ProjectMetrics;
  timeline?: ProjectTimeline;
  role?: string;
  features?: string[];
  architecture?: {
    nodes: ArchitectureNode[];
    connections: ArchitectureConnection[];
  };
  challenges?: ProjectChallenge[];
}

interface ProjectModalProps {
  project: ProjectData | null;
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'overview' | 'architecture' | 'challenges';

// ============================================================================
// ICONS
// ============================================================================

const Icons = {
  Close: memo(function CloseIcon({ className }: { className?: string }) {
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
  ChevronLeft: memo(function ChevronLeftIcon({ className }: { className?: string }) {
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
        <path d="m15 18-6-6 6-6" />
      </svg>
    );
  }),
  ChevronRight: memo(function ChevronRightIcon({ className }: { className?: string }) {
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
        <path d="m9 18 6-6-6-6" />
      </svg>
    );
  }),
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
  GitHub: memo(function GitHubIcon({ className }: { className?: string }) {
    return (
      <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    );
  }),
  Check: memo(function CheckIcon({ className }: { className?: string }) {
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
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
  }),
  Calendar: memo(function CalendarIcon({ className }: { className?: string }) {
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
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    );
  }),
  Clock: memo(function ClockIcon({ className }: { className?: string }) {
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
        <polyline points="12 6 12 12 16 14" />
      </svg>
    );
  }),
  Users: memo(function UsersIcon({ className }: { className?: string }) {
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
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }),
  Zap: memo(function ZapIcon({ className }: { className?: string }) {
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
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    );
  }),
  Lightbulb: memo(function LightbulbIcon({ className }: { className?: string }) {
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
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
        <path d="M9 18h6" />
        <path d="M10 22h4" />
      </svg>
    );
  }),
  AlertTriangle: memo(function AlertTriangleIcon({ className }: { className?: string }) {
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
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    );
  }),
  Wrench: memo(function WrenchIcon({ className }: { className?: string }) {
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
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    );
  }),
  BookOpen: memo(function BookOpenIcon({ className }: { className?: string }) {
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
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    );
  }),
  User: memo(function UserIcon({ className }: { className?: string }) {
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
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    );
  }),
};

// ============================================================================
// FOCUS TRAP HOOK
// ============================================================================

function useFocusTrap(isActive: boolean, containerRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    // Focus first focusable element
    firstElement?.focus();

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive, containerRef]);
}

// ============================================================================
// IMAGE GALLERY COMPONENT
// ============================================================================

const ImageGallery = memo(function ImageGallery({ images }: { images: ProjectData['images'] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const allImages = useMemo(() => {
    const imgs: string[] = [];
    if (images.banner) imgs.push(images.banner);
    else if (images.thumbnail) imgs.push(images.thumbnail);
    if (images.screenshots) imgs.push(...images.screenshots);
    return imgs.length > 0 ? imgs : ['/placeholder-project.jpg'];
  }, [images]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  }, [allImages.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  }, [allImages.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevious, goToNext]);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-video rounded-[2rem] overflow-hidden bg-gray-100 dark:bg-white/5 group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            {allImages[currentIndex] && allImages[currentIndex] !== '/placeholder-project.jpg' ? (
              <Image
                src={allImages[currentIndex]}
                alt={`Screenshot ${currentIndex + 1}`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-500/10 via-orange-500/10 to-cyan-500/10">
                <span className="text-6xl opacity-50">🚀</span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
              aria-label="Previous image"
            >
              <Icons.ChevronLeft />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
              aria-label="Next image"
            >
              <Icons.ChevronRight />
            </button>
          </>
        )}

        {/* Image Counter */}
        {allImages.length > 1 && (
          <div className="absolute bottom-4 right-4 px-4 py-2 rounded-full bg-black/60 backdrop-blur-xl text-white text-[10px] font-mono tracking-widest">
            {currentIndex + 1} / {allImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
          {allImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                'relative flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all',
                currentIndex === index
                  ? 'border-cyan-500 ring-2 ring-cyan-500/30'
                  : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
              )}
            >
              {img && img !== '/placeholder-project.jpg' ? (
                <Image src={img} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <span className="text-lg">🚀</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

// ============================================================================
// LIGHTHOUSE SCORE COMPONENT
// ============================================================================

const LighthouseScore = memo(function LighthouseScore({
  label,
  score,
}: {
  label: string;
  score: number;
}) {
  const circumference = 2 * Math.PI * 18;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 40 40">
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="none"
            strokeWidth="3"
            className="stroke-gray-200 dark:stroke-white/5"
          />
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
            cx="20"
            cy="20"
            r="18"
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            className="stroke-cyan-500"
            style={{ strokeDasharray: circumference }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-mono font-bold text-cyan-500">
          {score}
        </span>
      </div>
      <span className="text-[8px] font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest text-center">
        {label}
      </span>
    </div>
  );
});

// ============================================================================
// ARCHITECTURE DIAGRAM COMPONENT
// ============================================================================

const ArchitectureDiagram = memo(function ArchitectureDiagram({
  nodes,
  connections,
}: {
  nodes: ArchitectureNode[];
  connections: ArchitectureConnection[];
}) {
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const getNodeColor = (type: ArchitectureNode['type']) => {
    const colors: Record<ArchitectureNode['type'], { bg: string; border: string; text: string }> = {
      frontend: { bg: 'fill-blue-500/20', border: 'stroke-blue-500', text: 'text-blue-500' },
      backend: { bg: 'fill-green-500/20', border: 'stroke-green-500', text: 'text-green-500' },
      database: { bg: 'fill-purple-500/20', border: 'stroke-purple-500', text: 'text-purple-500' },
      service: { bg: 'fill-orange-500/20', border: 'stroke-orange-500', text: 'text-orange-500' },
      cache: { bg: 'fill-red-500/20', border: 'stroke-red-500', text: 'text-red-500' },
      external: { bg: 'fill-gray-500/20', border: 'stroke-gray-500', text: 'text-gray-500' },
      auth: { bg: 'fill-yellow-500/20', border: 'stroke-yellow-500', text: 'text-yellow-500' },
    };
    return colors[type];
  };

  const getConnectionStyle = (type?: ArchitectureConnection['type']) => {
    switch (type) {
      case 'realtime':
        return 'stroke-green-500 stroke-dasharray-4';
      case 'async':
        return 'stroke-orange-500 stroke-dasharray-2';
      case 'cache':
        return 'stroke-red-500';
      default:
        return 'stroke-muted-foreground';
    }
  };

  const nodeMap = useMemo(() => {
    const map = new Map<string, ArchitectureNode>();
    nodes.forEach((node) => map.set(node.id, node));
    return map;
  }, [nodes]);

  return (
    <div className="relative">
      <div className="absolute top-6 left-6 flex items-center gap-2 opacity-30 z-10">
        <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-ping" />
        <span className="text-[7px] font-mono tracking-widest uppercase">
          System_Logic_Map_v1.0
        </span>
      </div>
      <svg
        ref={svgRef}
        viewBox="0 0 600 400"
        className="w-full h-auto min-h-[300px] bg-gray-50/50 dark:bg-white/[0.02] rounded-[2rem] border border-gray-200/50 dark:border-white/5"
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" className="fill-muted-foreground" />
          </marker>
          <marker
            id="arrowhead-animated"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" className="fill-green-500" />
          </marker>
        </defs>

        {/* Connections */}
        {connections.map((conn, index) => {
          const fromNode = nodeMap.get(conn.from);
          const toNode = nodeMap.get(conn.to);
          if (!fromNode || !toNode) return null;

          const startX = fromNode.position.x + 60;
          const startY = fromNode.position.y + 30;
          const endX = toNode.position.x;
          const endY = toNode.position.y + 30;

          // Calculate control points for curved line
          const midX = (startX + endX) / 2;
          const midY = (startY + endY) / 2;
          const curvature = 30;
          const controlX = midX;
          const controlY = midY - curvature;

          return (
            <g key={`conn-${index}`}>
              <path
                d={`M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`}
                fill="none"
                strokeWidth="2"
                markerEnd={conn.animated ? 'url(#arrowhead-animated)' : 'url(#arrowhead)'}
                className={cn(getConnectionStyle(conn.type), 'opacity-60')}
              >
                {conn.animated && (
                  <animate
                    attributeName="stroke-dashoffset"
                    values="20;0"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                )}
              </path>
              {conn.label && (
                <text
                  x={controlX}
                  y={controlY - 8}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[10px]"
                >
                  {conn.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const colors = getNodeColor(node.type);
          const isSelected = selectedNode?.id === node.id;

          return (
            <g
              key={node.id}
              transform={`translate(${node.position.x}, ${node.position.y})`}
              className="cursor-pointer"
              onClick={() => setSelectedNode(isSelected ? null : node)}
            >
              <motion.rect
                width="120"
                height="60"
                rx="8"
                className={cn(colors.bg, colors.border, 'stroke-2')}
                initial={false}
                animate={{
                  strokeWidth: isSelected ? 3 : 2,
                  filter: isSelected ? 'drop-shadow(0 0 8px rgba(var(--primary), 0.5))' : 'none',
                }}
              />
              <text
                x="60"
                y="28"
                textAnchor="middle"
                className={cn('text-xs font-semibold fill-foreground')}
              >
                {node.label}
              </text>
              <text
                x="60"
                y="44"
                textAnchor="middle"
                className={cn('text-[10px] fill-muted-foreground')}
              >
                {node.type.charAt(0).toUpperCase() + node.type.slice(1)}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Node Details Panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-6 p-6 rounded-[2rem] bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                  {selectedNode.label}
                </h4>
                <span
                  className={cn(
                    'text-[9px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-widest',
                    getNodeColor(selectedNode.type).bg,
                    getNodeColor(selectedNode.type).text
                  )}
                >
                  {selectedNode.type}
                </span>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                <Icons.Close className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {selectedNode.description}
            </p>
            {selectedNode.technologies && selectedNode.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedNode.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-xl text-[9px] font-mono bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 uppercase"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-6 text-[9px] font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-gray-400 dark:bg-gray-500" />
          <span>Sync</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-cyan-500" />
          <span>Realtime</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-orange-500" style={{ borderTop: '2px dashed' }} />
          <span>Async</span>
        </div>
      </div>
    </div>
  );
});

// ============================================================================
// TAB COMPONENTS
// ============================================================================

const OverviewTab = memo(function OverviewTab({ project }: { project: ProjectData }) {
  return (
    <div className="space-y-10">
      {/* Description */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.4em]">
          Project_Scope
        </h3>
        <p className="text-lg font-light leading-relaxed text-gray-600 dark:text-gray-400">
          {project.fullDescription || project.description}
        </p>
      </div>

      {/* Role */}
      {project.role && (
        <div className="space-y-3">
          <h3 className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.4em] flex items-center gap-2">
            <Icons.User className="h-4 w-4" />
            Operator_Role
          </h3>
          <p className="text-gray-600 dark:text-gray-400">{project.role}</p>
        </div>
      )}

      {/* Key Features */}
      {project.features && project.features.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.4em]">
            Core_Features
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {project.features.map((feature, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400"
              >
                <Icons.Check className="h-4 w-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Metrics */}
      {project.metrics && (
        <div className="space-y-6">
          <h3 className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.4em]">
            Sync_Integrity
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-8 rounded-[2rem] bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10">
            {project.metrics.lighthouse && (
              <>
                {project.metrics.lighthouse.performance !== undefined && (
                  <LighthouseScore
                    label="Performance"
                    score={project.metrics.lighthouse.performance}
                  />
                )}
                {project.metrics.lighthouse.accessibility !== undefined && (
                  <LighthouseScore
                    label="Accessibility"
                    score={project.metrics.lighthouse.accessibility}
                  />
                )}
                {project.metrics.lighthouse.bestPractices !== undefined && (
                  <LighthouseScore
                    label="Best Practices"
                    score={project.metrics.lighthouse.bestPractices}
                  />
                )}
                {project.metrics.lighthouse.seo !== undefined && (
                  <LighthouseScore label="SEO" score={project.metrics.lighthouse.seo} />
                )}
              </>
            )}
          </div>

          {/* Other Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {project.metrics.users !== undefined && (
              <div className="p-4 rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 text-center">
                <Icons.Users className="h-5 w-5 mx-auto mb-2 text-cyan-500" />
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {project.metrics.users.toLocaleString()}
                </p>
                <p className="text-[8px] font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  Active_Users
                </p>
              </div>
            )}
            {project.metrics.loadTime && (
              <div className="p-4 rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 text-center">
                <Icons.Zap className="h-5 w-5 mx-auto mb-2 text-orange-500" />
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {project.metrics.loadTime}
                </p>
                <p className="text-[8px] font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  Load_Time
                </p>
              </div>
            )}
            {project.metrics.uptime && (
              <div className="p-4 rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 text-center">
                <Icons.Clock className="h-5 w-5 mx-auto mb-2 text-cyan-500" />
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {project.metrics.uptime}
                </p>
                <p className="text-[8px] font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  Uptime
                </p>
              </div>
            )}
            {project.metrics.responseTime && (
              <div className="p-4 rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 text-center">
                <Icons.Zap className="h-5 w-5 mx-auto mb-2 text-cyan-500" />
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {project.metrics.responseTime}
                </p>
                <p className="text-[8px] font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  API_Response
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Timeline */}
      {project.timeline && (
        <div className="space-y-4">
          <h3 className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.4em] flex items-center gap-2">
            <Icons.Calendar className="h-4 w-4" />
            Mission_Timeline
          </h3>
          <div className="flex flex-wrap gap-4">
            {project.timeline.startDate && (
              <div className="p-4 rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10">
                <p className="text-[8px] font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
                  Initiated
                </p>
                <p className="font-bold text-gray-900 dark:text-white">
                  {project.timeline.startDate}
                </p>
              </div>
            )}
            {project.timeline.endDate && (
              <div className="p-4 rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10">
                <p className="text-[8px] font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
                  Concluded
                </p>
                <p className="font-bold text-gray-900 dark:text-white">
                  {project.timeline.endDate}
                </p>
              </div>
            )}
            {project.timeline.duration && (
              <div className="p-4 rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10">
                <p className="text-[8px] font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
                  Duration
                </p>
                <p className="font-bold text-gray-900 dark:text-white">
                  {project.timeline.duration}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

const ArchitectureTab = memo(function ArchitectureTab({ project }: { project: ProjectData }) {
  // Default architecture for demo purposes
  const defaultArchitecture = useMemo(
    () => ({
      nodes: [
        {
          id: 'frontend',
          label: 'Next.js Frontend',
          type: 'frontend' as const,
          description: 'React-based frontend with SSR and ISR for optimal performance.',
          technologies: ['React', 'Next.js', 'TailwindCSS'],
          position: { x: 20, y: 170 },
        },
        {
          id: 'auth',
          label: 'Auth Layer',
          type: 'auth' as const,
          description: 'Handles authentication, session management, and JWT tokens.',
          technologies: ['NextAuth.js', 'JWT', 'OAuth'],
          position: { x: 180, y: 50 },
        },
        {
          id: 'api',
          label: 'API Server',
          type: 'backend' as const,
          description: 'GraphQL API with Apollo Server handling all business logic.',
          technologies: ['Node.js', 'Apollo Server', 'GraphQL'],
          position: { x: 240, y: 170 },
        },
        {
          id: 'cache',
          label: 'Redis Cache',
          type: 'cache' as const,
          description: 'In-memory caching for sessions and frequently accessed data.',
          technologies: ['Redis', 'ioredis'],
          position: { x: 180, y: 290 },
        },
        {
          id: 'database',
          label: 'PostgreSQL',
          type: 'database' as const,
          description: 'Primary database with full-text search and JSON support.',
          technologies: ['PostgreSQL', 'Prisma ORM'],
          position: { x: 460, y: 170 },
        },
        {
          id: 'storage',
          label: 'S3 Storage',
          type: 'external' as const,
          description: 'Object storage for images, documents, and static assets.',
          technologies: ['AWS S3', 'CloudFront CDN'],
          position: { x: 460, y: 290 },
        },
      ],
      connections: [
        { from: 'frontend', to: 'auth', label: 'Login/Register', type: 'sync' as const },
        { from: 'frontend', to: 'api', label: 'GraphQL', type: 'sync' as const },
        { from: 'auth', to: 'api', label: 'Verify Token', type: 'sync' as const },
        { from: 'api', to: 'cache', label: 'Session/Cache', type: 'cache' as const },
        { from: 'api', to: 'database', label: 'Queries', type: 'sync' as const, animated: true },
        { from: 'api', to: 'storage', label: 'File Upload', type: 'async' as const },
        {
          from: 'database',
          to: 'api',
          label: 'Real-time',
          type: 'realtime' as const,
          animated: true,
        },
      ],
    }),
    []
  );

  const architecture = project.architecture || defaultArchitecture;

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h3 className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.4em]">
          Infrastructure_Blueprint
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Click on any component to view details about its role and technologies.
        </p>
      </div>
      <ArchitectureDiagram nodes={architecture.nodes} connections={architecture.connections} />
    </div>
  );
});

const ChallengesTab = memo(function ChallengesTab({ project }: { project: ProjectData }) {
  const defaultChallenges: ProjectChallenge[] = [
    {
      problem: 'Implementing real-time updates without overwhelming the server with requests.',
      solution:
        'Utilized WebSocket connections with Socket.io and implemented intelligent debouncing on the client side.',
      learning:
        'Learned the importance of choosing the right communication protocol for different use cases.',
    },
    {
      problem: 'Managing complex state across multiple components while maintaining performance.',
      solution:
        'Adopted a combination of React Context for global state and local state for component-specific data.',
      learning:
        'Understanding when to use different state management approaches is crucial for scalability.',
    },
    {
      problem: 'Ensuring the application remained responsive on slower network connections.',
      solution: 'Implemented optimistic updates, skeleton loaders, and progressive image loading.',
      learning: 'User perception of speed is just as important as actual performance metrics.',
    },
  ];

  const challenges =
    project.challenges && project.challenges.length > 0 ? project.challenges : defaultChallenges;

  return (
    <div className="space-y-8">
      {challenges.map((challenge, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-8 rounded-[2rem] bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-orange-500/10 space-y-6"
        >
          {/* Problem */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-orange-500/10">
                <Icons.AlertTriangle className="h-4 w-4 text-orange-500" />
              </div>
              <h4 className="text-[10px] font-mono font-bold text-orange-500 uppercase tracking-widest">
                Incident_0{index + 1}
              </h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 pl-10">{challenge.problem}</p>
          </div>

          {/* Solution */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-cyan-500/10">
                <Icons.Wrench className="h-4 w-4 text-cyan-500" />
              </div>
              <h4 className="text-[10px] font-mono font-bold text-cyan-500 uppercase tracking-widest">
                Resolution
              </h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 pl-10">{challenge.solution}</p>
          </div>

          {/* Learning */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-cyan-500/10">
                <Icons.Lightbulb className="h-4 w-4 text-cyan-500" />
              </div>
              <h4 className="text-[10px] font-mono font-bold text-cyan-500 uppercase tracking-widest">
                Intel_Acquired
              </h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 pl-10">{challenge.learning}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
});

// ============================================================================
// MAIN MODAL COMPONENT
// ============================================================================

export const ProjectModal = memo(function ProjectModal({
  project,
  isOpen,
  onClose,
}: ProjectModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus trap
  useFocusTrap(isOpen, modalRef);

  // Handle escape key
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

  // Reset tab when project changes
  useEffect(() => {
    if (project) setActiveTab('overview');
  }, [project?.id]);

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Icons.BookOpen className="h-4 w-4" /> },
    { id: 'architecture', label: 'Architecture', icon: <Icons.Zap className="h-4 w-4" /> },
    { id: 'challenges', label: 'Challenges', icon: <Icons.Lightbulb className="h-4 w-4" /> },
  ];

  return (
    <AnimatePresence>
      {isOpen && project && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="relative w-full max-w-5xl max-h-[90vh] mx-4 rounded-[3rem] bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Background Spectral Orb */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />
            {/* Header */}
            <div className="flex-shrink-0 p-8 md:p-12 border-b border-gray-200/50 dark:border-white/5">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1 min-w-0 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-mono font-bold tracking-[0.4em] uppercase">
                      Log_{project.id}
                    </div>
                    <div className="text-[10px] font-mono text-gray-400 dark:text-gray-500 tracking-[0.2em] uppercase">
                      Sector: {project.category}
                    </div>
                  </div>
                  <h2
                    id="modal-title"
                    className="text-4xl md:text-6xl font-display font-bold text-gray-900 dark:text-white tracking-tighter italic leading-none"
                  >
                    {project.title}
                  </h2>
                  {project.tagline && (
                    <p className="text-lg font-light text-gray-600 dark:text-gray-400">
                      {project.tagline}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="flex-shrink-0 p-4 bg-white/50 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 text-gray-400 dark:text-gray-500 hover:text-red-500 transition-all"
                  aria-label="Close modal"
                >
                  <Icons.Close className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Image Gallery */}
              <div className="p-6 pb-4">
                <ImageGallery images={project.images} />
              </div>

              {/* Tabs */}
              <div className="sticky top-0 z-10 bg-white/80 dark:bg-black/40 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/5">
                <div className="flex gap-2 p-4">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest transition-all',
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg shadow-red-500/20'
                          : 'text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white'
                      )}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === 'overview' && <OverviewTab project={project} />}
                    {activeTab === 'architecture' && <ArchitectureTab project={project} />}
                    {activeTab === 'challenges' && <ChallengesTab project={project} />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 p-8 border-t border-gray-200/50 dark:border-white/5">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                    <span className="text-[9px] font-mono text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em]">
                      Transmission_Encrypted
                    </span>
                  </div>
                  <span
                    className={cn(
                      'px-3 py-1.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest',
                      project.status === 'completed' && 'bg-cyan-500/10 text-cyan-500',
                      project.status === 'in-progress' && 'bg-orange-500/10 text-orange-500',
                      project.status === 'planned' && 'bg-gray-500/10 text-gray-500'
                    )}
                  >
                    {project.status === 'completed' && 'Status: COMPLETE'}
                    {project.status === 'in-progress' && 'Status: ACTIVE'}
                    {project.status === 'planned' && 'Status: PENDING'}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 text-gray-500 font-mono font-bold text-[10px] uppercase tracking-[0.4em] rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-all inline-flex items-center gap-2"
                    >
                      <Icons.GitHub className="h-4 w-4" />
                      Source_Code
                    </a>
                  )}
                  {project.links.live && (
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white font-mono font-bold text-[10px] uppercase tracking-[0.4em] rounded-full shadow-lg shadow-red-500/20 transition-transform hover:scale-105 inline-flex items-center gap-2"
                    >
                      <Icons.ExternalLink className="h-4 w-4" />
                      Launch_Uplink
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

export default ProjectModal;

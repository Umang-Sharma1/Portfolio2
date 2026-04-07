'use client';

import React, { useRef, useState, memo, useEffect, useMemo, useCallback } from 'react';
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  useAnimation,
} from 'framer-motion';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { GET_FEATURED_PROJECTS } from '@/lib/graphql/queries';
import { ProjectModal, ProjectData } from '../projects/project-modal';

const MotionDiv = motion.div as any;

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

// ============================================================================
// TEXT MORPH ANIMATION
// ============================================================================

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*!?';

function useTextMorph(from: string, to: string, trigger: boolean, duration = 1400) {
  const [display, setDisplay] = useState(from);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!trigger) {
      setDisplay(from);
      return;
    }
    const start = performance.now();
    let cancelled = false;
    function tick(now: number) {
      if (cancelled) return;
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      if (progress < 0.35) {
        const scrambleFactor = progress / 0.35;
        let result = '';
        for (let i = 0; i < from.length; i++) {
          if (from[i] === ' ') result += ' ';
          else if (Math.random() < scrambleFactor)
            result += CHARS[Math.floor(Math.random() * CHARS.length)];
          else result += from[i];
        }
        setDisplay(result);
      } else {
        const resolveProgress = (progress - 0.35) / 0.65;
        const resolved = Math.floor(resolveProgress * to.length);
        let result = '';
        for (let i = 0; i < to.length; i++) {
          if (to[i] === ' ') result += ' ';
          else if (i < resolved) result += to[i];
          else result += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
        setDisplay(result);
      }
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
      else setDisplay(to);
    }
    frameRef.current = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frameRef.current);
    };
  }, [trigger, from, to, duration]);
  return display;
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
  ChevronLeft: ({ className }: { className?: string }) => (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  ),
  ChevronRight: ({ className }: { className?: string }) => (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  ),
  Filter: ({ className }: { className?: string }) => (
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
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  ),
  Nodes: ({ className }: { className?: string }) => (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="6" cy="6" r="3" />
      <circle cx="18" cy="18" r="3" />
      <path d="M8.6 8.6L15.4 15.4" />
      <circle cx="18" cy="6" r="3" />
      <path d="M15.4 8.6L8.6 15.4" />
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
    images: {
      thumbnail:
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    },
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
    links: {
      github: 'https://github.com/yourusername/aether-nexus',
      live: 'https://aether-nexus.vercel.app',
    },
    features: [
      'Real-time spatial sync',
      'Orbital edge nodes',
      'High-frequency laser links',
      'Zero-latency streaming',
      'Distributed cluster management',
    ],
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
    images: {
      thumbnail:
        'https://images.unsplash.com/photo-1633356122544-f134324ef6db?auto=format&fit=crop&w=800&q=80',
    },
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
    links: {
      github: 'https://github.com/yourusername/spectral-sentinel',
      live: 'https://spectral-sentinel.vercel.app',
    },
    features: [
      'Behavioral pattern analysis',
      'Real-time threat detection',
      'Zero-day exploit prevention',
      'Distributed firewall mesh',
      'Auto-remediation engine',
    ],
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
    images: {
      thumbnail:
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    },
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
    links: {
      github: 'https://github.com/yourusername/void-protocol',
      live: 'https://void-protocol.vercel.app',
    },
    features: [
      'Quantum-resistant encryption',
      'Cold-storage retrieval',
      'Kubernetes orchestration',
      'Sub-millisecond query time',
      'Auto-scaling clusters',
    ],
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
    images: {
      thumbnail:
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    },
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
    links: {
      github: 'https://github.com/yourusername/phantom-grid',
      live: 'https://phantom-grid.vercel.app',
    },
    features: [
      'Millions of events/sec',
      'Sub-ms latency',
      'Real-time analytics',
      'Kafka event streaming',
      'ClickHouse analytics DB',
    ],
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
    images: {
      thumbnail:
        'https://images.unsplash.com/photo-1516534775068-bb57027c26d5?auto=format&fit=crop&w=800&q=80',
    },
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
    links: {
      github: 'https://github.com/yourusername/nova-terminal',
      live: 'https://nova-terminal.vercel.app',
    },
    features: [
      'AI code analysis',
      'Live collaboration',
      'CI/CD integration',
      'WebSocket real-time sync',
      'Multi-language support',
    ],
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
    images: {
      thumbnail:
        'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=800&q=80',
    },
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
    links: {
      github: 'https://github.com/yourusername/eclipse-vault',
      live: 'https://eclipse-vault.vercel.app',
    },
    features: [
      'Zero-knowledge proofs',
      'Multi-chain wallet support',
      'Decentralized identity',
      'IPFS storage layer',
      'Smart contract auditing',
    ],
  },
];

// ============================================================================
// LIGHTHOUSE GAUGE — radial score ring
// ============================================================================

const LighthouseGauge = memo(function LighthouseGauge({
  score,
  size = 36,
}: {
  score: number;
  size?: number;
}) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const color = score >= 90 ? '#22c55e' : score >= 50 ? '#eab308' : '#ef4444';

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          className="text-slate-200 dark:text-white/10"
          strokeWidth={3}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          whileInView={{ strokeDashoffset: circ * (1 - score / 100) }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ filter: `drop-shadow(0 0 4px ${color}80)` }}
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center text-[8px] font-mono font-black"
        style={{ color }}
      >
        {score}
      </span>
    </div>
  );
});

// ============================================================================
// ARCHITECTURE MINI-MAP — tiny node graph
// ============================================================================

const ArchitectureMiniMap = memo(function ArchitectureMiniMap({
  architecture,
}: {
  architecture: ProjectData['architecture'];
}) {
  if (!architecture || !architecture.nodes.length) return null;

  const nodes = architecture.nodes;
  const conns = architecture.connections;

  // Normalize positions into 0-1 range
  const xs = nodes.map((n) => n.position.x);
  const ys = nodes.map((n) => n.position.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;

  const norm = (n: (typeof nodes)[0]) => ({
    x: ((n.position.x - minX) / rangeX) * 60 + 10,
    y: ((n.position.y - minY) / rangeY) * 30 + 10,
  });

  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <div className="w-full h-12 relative">
      <svg width="100%" height="100%" viewBox="0 0 80 50" preserveAspectRatio="xMidYMid meet">
        {/* connections */}
        {conns.map((c, i) => {
          const from = nodeMap[c.from];
          const to = nodeMap[c.to];
          if (!from || !to) return null;
          const f = norm(from);
          const t = norm(to);
          return (
            <motion.line
              key={i}
              x1={f.x}
              y1={f.y}
              x2={t.x}
              y2={t.y}
              stroke="rgba(0,200,232,0.3)"
              strokeWidth="0.8"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 + i * 0.15 }}
            />
          );
        })}
        {/* nodes */}
        {nodes.map((n, i) => {
          const p = norm(n);
          return (
            <motion.circle
              key={n.id}
              cx={p.x}
              cy={p.y}
              r="3"
              fill="rgba(0,200,232,0.6)"
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
            >
              <title>{n.label}</title>
            </motion.circle>
          );
        })}
      </svg>
    </div>
  );
});

// ============================================================================
// CATEGORY FILTER PILLS
// ============================================================================

const CategoryFilterPills = memo(function CategoryFilterPills({
  active,
  onChange,
  missions,
}: {
  active: string;
  onChange: (cat: string) => void;
  missions: ProjectData[];
}) {
  // Dynamically build categories from the actual data
  const available = useMemo(() => {
    const cats = Array.from(new Set(missions.map((m) => m.category)));
    return ['All', ...cats];
  }, [missions]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex flex-wrap justify-center gap-2 mb-10"
    >
      <div className="flex items-center gap-1.5 mr-2 text-slate-400 dark:text-white/20">
        <Icons.Filter />
        <span className="text-[8px] font-mono font-black uppercase tracking-[0.3em]">Filter</span>
      </div>
      {available.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={cn(
            'relative px-4 py-1.5 rounded-full text-[9px] font-mono font-black uppercase tracking-[0.2em] transition-all duration-300 border',
            active === cat
              ? 'text-white dark:text-space-black bg-vision-cyan border-vision-cyan/60 shadow-[0_0_16px_rgba(0,200,232,0.3)]'
              : 'text-slate-500 dark:text-white/30 bg-white/60 dark:bg-white/[0.03] border-slate-200/60 dark:border-white/[0.06] hover:border-vision-cyan/30 hover:text-vision-cyan'
          )}
        >
          {cat === 'All' ? 'All' : cat.replace('_', ' ')}
          {active === cat && (
            <motion.div
              layoutId="project-filter-active"
              className="absolute inset-0 rounded-full bg-vision-cyan -z-10"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
        </button>
      ))}
    </motion.div>
  );
});

// ============================================================================
// PROJECT CARD — with Lighthouse gauge, architecture mini-map, video hover
// ============================================================================

const ProjectCard = memo(
  ({
    mission,
    idx,
    onSelect,
    isHero,
  }: {
    mission: ProjectData;
    idx: number;
    onSelect: (p: ProjectData) => void;
    isHero?: boolean;
  }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const isFlippingRef = useRef(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    const [displayBack, setDisplayBack] = useState(false);
    const flipControls = useAnimation();

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
      damping: 20,
      stiffness: 200,
    });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
      damping: 20,
      stiffness: 200,
    });
    const contentX = useSpring(useTransform(mouseX, [-0.5, 0.5], [10, -10]), {
      damping: 25,
      stiffness: 150,
    });
    const contentY = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
      damping: 25,
      stiffness: 150,
    });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current || isFlipped) return;
      const rect = cardRef.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
      mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
      setIsHovered(false);
    };

    const handleFlip = async () => {
      if (isHero || isFlippingRef.current) return;
      isFlippingRef.current = true;
      mouseX.set(0);
      mouseY.set(0);
      const toBack = !isFlipped;
      await flipControls.start({
        rotateY: toBack ? -90 : 90,
        transition: { duration: 0.22, ease: 'easeIn' as const },
      });
      setDisplayBack(toBack);
      setIsFlipped(toBack);
      await flipControls.start({
        rotateY: 0,
        transition: { duration: 0.22, ease: 'easeOut' as const },
      });
      isFlippingRef.current = false;
    };

    const perfScore = 0; // gauge removed
    const statusDotClass =
      mission.status === 'in-progress'
        ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
        : 'bg-vision-cyan shadow-[0_0_8px_rgba(var(--glow-cyan),1)]';

    return (
      <MotionDiv
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
        className={cn('group relative h-full', isHero && 'lg:col-span-3 md:col-span-2')}
        style={{ perspective: '2000px' }}
      >
        {/* Flip controller */}
        <MotionDiv animate={flipControls} className="h-full">
          {/* Tilt + border effects wrapper */}
          <MotionDiv
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            onClick={!isHero ? handleFlip : undefined}
            style={{ rotateX: isHero ? 0 : rotateX, rotateY: isHero ? 0 : rotateY }}
            className={cn(
              'relative h-full transition-shadow duration-700',
              !isHero &&
                'cursor-pointer hover:shadow-[0_0_60px_rgba(var(--glow-cyan),0.2),0_0_120px_rgba(var(--glow-cyan),0.08)]',
              'rounded-[2.5rem]'
            )}
          >
            {/* Spinning conic-gradient border (non-hero only) */}
            {!isHero && (
              <div className="absolute -inset-[1px] rounded-[2.5rem] overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div
                  className="absolute inset-0 animate-spin-slow"
                  style={{
                    background:
                      'conic-gradient(from 0deg, transparent 0%, rgba(var(--glow-cyan),1) 10%, transparent 20%, transparent 40%, rgba(var(--glow-crimson),1) 50%, transparent 60%, transparent 80%, rgba(var(--glow-orange),1) 90%, transparent 100%)',
                  }}
                />
                <div className="absolute inset-[1.5px] rounded-[2.4rem] bg-white dark:bg-space-black" />
              </div>
            )}

            {/* Traveling border beam dots (non-hero only) */}
            {!isHero && (
              <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div
                  className="absolute h-[10px] w-[100px] animate-border-beam"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent, rgba(var(--glow-cyan),1), transparent)',
                    offsetPath: 'rect(0 100% 100% 0 round 20px)',
                    boxShadow:
                      '0 0 40px 10px rgba(var(--glow-cyan),0.9), 0 0 80px 20px rgba(var(--glow-cyan),0.4)',
                    filter: 'blur(0.3px)',
                  }}
                />
                <div
                  className="absolute h-[10px] w-[60px] animate-border-beam"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent, rgba(var(--glow-crimson),1), transparent)',
                    offsetPath: 'rect(0 100% 100% 0 round 20px)',
                    animationDelay: '-1.5s',
                    animationDuration: '4s',
                    boxShadow:
                      '0 0 35px 8px rgba(var(--glow-crimson),0.8), 0 0 70px 16px rgba(var(--glow-crimson),0.35)',
                    filter: 'blur(0.3px)',
                  }}
                />
              </div>
            )}

            {/* Card body */}
            <div
              className={cn(
                'relative h-full flex overflow-hidden border-[1px] backdrop-blur-[40px] rounded-[2.5rem]',
                isHero ? 'flex-col md:flex-row' : 'flex-col',
                'bg-white/95 dark:bg-space-black/90',
                'border-slate-300/50 dark:border-white/10',
                'shadow-[0_30px_60px_rgba(0,0,0,0.06)] dark:shadow-[0_40px_100px_rgba(0,0,0,0.9)]',
                !isHero && 'group-hover:border-transparent transition-colors duration-700'
              )}
            >
              {/* Dotted background */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.04] dark:opacity-[0.08] z-0"
                style={{
                  backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Ambient HUD glow (non-hero) */}
              {!isHero && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-0">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-vision-crimson/10 blur-[120px] translate-x-1/2 -translate-y-1/2" />
                  <div className="absolute bottom-0 left-0 w-80 h-80 bg-vision-cyan/10 blur-[120px] -translate-x-1/2 translate-y-1/2" />
                </div>
              )}

              {/* Bottom lighting edge */}
              <div className="absolute inset-0 pointer-events-none z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-vision-cyan/50 to-transparent" />
              </div>

              {/* ── FRONT / BACK via AnimatePresence ── */}
              <AnimatePresence mode="wait" initial={false}>
                {!displayBack ? (
                  /* ──────── FRONT FACE ──────── */
                  <MotionDiv
                    key="front"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className={cn(
                      'flex w-full',
                      isHero ? 'flex-col md:flex-row h-full' : 'flex-col min-h-[420px]'
                    )}
                  >
                    {/* Image section */}
                    <div
                      className={cn(
                        'relative shrink-0 overflow-hidden',
                        isHero
                          ? 'w-full md:w-[55%] h-64 md:h-auto rounded-t-[2.5rem] md:rounded-l-[2.5rem] md:rounded-tr-none'
                          : 'w-full h-48 rounded-t-[2.5rem]'
                      )}
                    >
                      {mission.images?.thumbnail ? (
                        <>
                          <img
                            src={mission.images.thumbnail}
                            alt={mission.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                            loading="lazy"
                          />
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-vision-crimson/30 via-slate-800 to-vision-cyan/30" />
                      )}
                      {/* Fade overlay */}
                      <div
                        className={cn(
                          'absolute inset-0',
                          isHero
                            ? 'bg-gradient-to-r from-transparent via-transparent to-white dark:to-space-black'
                            : 'bg-gradient-to-t from-white dark:from-space-black via-transparent to-transparent'
                        )}
                      />
                      {/* ID badge */}
                      <div className="absolute top-3.5 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/20">
                        <div className="h-1.5 w-1.5 rounded-full bg-vision-crimson shadow-[0_0_8px_rgba(var(--glow-crimson),1)] animate-pulse" />
                        <span className="text-[9px] font-mono font-black text-white uppercase tracking-[0.5em]">
                          #{String(idx + 1).padStart(2, '0')}
                        </span>
                      </div>
                      {/* Status badge */}
                      <div className="absolute top-3.5 right-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/20">
                        <div
                          className={cn('h-1.5 w-1.5 rounded-full animate-pulse', statusDotClass)}
                        />
                        <span className="text-[9px] font-mono font-black text-white uppercase tracking-[0.4em]">
                          {mission.status === 'in-progress' ? 'Active' : 'Done'}
                        </span>
                      </div>
                      {/* Lighthouse gauge removed */}
                      {/* Flip hint */}
                      {!isHero && (
                        <div className="absolute bottom-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/20">
                            <svg
                              width="9"
                              height="9"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="rgba(0,200,232,1)"
                              strokeWidth="2.5"
                            >
                              <path d="M17 1l4 4-4 4" />
                              <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                              <path d="M7 23l-4-4 4-4" />
                              <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                            </svg>
                            <span className="text-[8px] font-mono font-black text-vision-cyan uppercase tracking-[0.3em]">
                              Details
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <MotionDiv
                      style={!isHero ? { x: contentX, y: contentY } : undefined}
                      className={cn(
                        'relative z-10 flex flex-col flex-1',
                        isHero ? 'px-8 py-8 md:py-10 justify-center' : 'px-7 pt-4 pb-7'
                      )}
                    >
                      <div className="text-[9px] font-mono font-bold text-slate-400 dark:text-text-dark/30 uppercase tracking-[0.4em] italic mb-2.5">
                        {mission.category}
                      </div>
                      <h3
                        className={cn(
                          'font-display font-black text-slate-900 dark:text-text-dark tracking-tighter uppercase italic group-hover:text-vision-cyan transition-colors duration-500 leading-tight mb-2',
                          isHero ? 'text-3xl md:text-4xl' : 'text-2xl'
                        )}
                      >
                        {mission.title}
                      </h3>
                      <p
                        className={cn(
                          'text-[13px] font-medium leading-relaxed text-slate-500 dark:text-text-dark/50 mb-5',
                          isHero ? 'line-clamp-4 md:line-clamp-none max-w-lg' : 'line-clamp-2'
                        )}
                      >
                        {isHero
                          ? mission.fullDescription || mission.description
                          : mission.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-auto">
                        {mission.technologies.slice(0, isHero ? 6 : 3).map((t) => (
                          <span
                            key={t}
                            className="px-3.5 py-1.5 bg-slate-100 dark:bg-white/5 rounded-xl text-[9px] font-mono font-black text-slate-600 dark:text-text-dark/40 border border-slate-200 dark:border-white/5 group-hover:border-vision-cyan/30 transition-all uppercase tracking-tighter"
                          >
                            {t}
                          </span>
                        ))}
                        {mission.technologies.length > (isHero ? 6 : 3) && (
                          <span className="px-3 py-1.5 text-[9px] font-mono font-black text-slate-400 dark:text-text-dark/25 tracking-tighter">
                            +{mission.technologies.length - (isHero ? 6 : 3)} more
                          </span>
                        )}
                      </div>
                      {isHero && mission.architecture && (
                        <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/50 dark:border-white/[0.06]">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Icons.Nodes className="text-vision-cyan opacity-50" />
                            <span className="text-[8px] font-mono font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.3em]">
                              Architecture
                            </span>
                          </div>
                          <ArchitectureMiniMap architecture={mission.architecture} />
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-5 pt-5 border-t border-slate-200/60 dark:border-white/10">
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-mono font-black text-slate-400 dark:text-text-dark/20 uppercase tracking-[0.25em]">
                            {mission.technologies.length} Technologies
                          </span>
                          {isHero && mission.metrics && (
                            <div className="hidden sm:flex items-center gap-2 text-[8px] font-mono font-bold text-slate-400 dark:text-white/20">
                              <span>⚡ {mission.metrics.loadTime}</span>
                              <span className="text-slate-300 dark:text-white/10">|</span>
                              <span>↑ {mission.metrics.uptime}</span>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            isHero ? onSelect(mission) : handleFlip();
                          }}
                          className="h-11 w-11 rounded-2xl glassmorphism flex items-center justify-center text-slate-400 dark:text-text-dark/40 hover:text-white dark:hover:text-space-black hover:bg-vision-crimson dark:hover:bg-vision-cyan hover:scale-110 transition-all border border-slate-200 dark:border-white/5 shadow-[0_15px_30px_rgba(0,0,0,0.1)]"
                        >
                          <Icons.External />
                        </button>
                      </div>
                    </MotionDiv>
                  </MotionDiv>
                ) : (
                  /* ──────── BACK FACE ──────── */
                  <MotionDiv
                    key="back"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex flex-col w-full min-h-[420px] p-7 relative z-10"
                  >
                    {/* Back header */}
                    <div className="flex items-start justify-between mb-5">
                      <div>
                        <div className="text-[9px] font-mono font-black text-vision-cyan uppercase tracking-[0.5em] mb-1">
                          #{String(idx + 1).padStart(2, '0')} // DETAILS
                        </div>
                        <h3 className="text-xl font-display font-black text-slate-900 dark:text-text-dark tracking-tighter uppercase italic leading-tight">
                          {mission.title}
                        </h3>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFlip();
                        }}
                        className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 hover:text-vision-crimson transition-colors shrink-0 ml-3"
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Features */}
                    {mission.features && mission.features.length > 0 && (
                      <div className="mb-4">
                        <div className="text-[8px] font-mono font-black text-vision-cyan/70 uppercase tracking-[0.5em] mb-2.5 flex items-center gap-2">
                          <div className="h-px w-4 bg-vision-cyan/40" /> Key Features
                        </div>
                        <ul className="space-y-2">
                          {mission.features.slice(0, 4).map((f, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2.5 text-[11px] text-slate-600 dark:text-text-dark/60 font-mono"
                            >
                              <div className="h-4 w-4 rounded-md bg-vision-cyan/10 border border-vision-cyan/30 flex items-center justify-center shrink-0 mt-0.5">
                                <svg
                                  width="8"
                                  height="8"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  className="text-vision-cyan"
                                  strokeWidth="3.5"
                                >
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              </div>
                              <span className="leading-snug">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Challenges */}
                    {mission.challenges && (
                      <div className="mb-4">
                        <div className="text-[8px] font-mono font-black text-vision-crimson/70 uppercase tracking-[0.5em] mb-2 flex items-center gap-2">
                          <div className="h-px w-4 bg-vision-crimson/40" /> Challenge
                        </div>
                        <p className="text-[11px] font-mono text-slate-500 dark:text-text-dark/40 leading-relaxed line-clamp-3 italic">
                          {mission.challenges}
                        </p>
                      </div>
                    )}

                    {/* Links + action buttons */}
                    <div className="mt-auto space-y-2">
                      {mission.links?.github && (
                        <a
                          href={mission.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center justify-center gap-2.5 w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-vision-cyan/40 hover:text-vision-cyan transition-all text-[10px] font-mono font-black text-slate-600 dark:text-text-dark/50 uppercase tracking-[0.3em]"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                          GitHub
                        </a>
                      )}
                      {mission.links?.live && (
                        <a
                          href={mission.links.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center justify-center gap-2.5 w-full py-2.5 rounded-2xl bg-vision-cyan/10 border border-vision-cyan/30 hover:bg-vision-cyan/20 hover:border-vision-cyan/60 transition-all text-[10px] font-mono font-black text-vision-cyan uppercase tracking-[0.3em]"
                        >
                          <Icons.External />
                          Live Demo
                        </a>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(mission);
                        }}
                        className="flex items-center justify-center gap-2.5 w-full py-2.5 rounded-2xl bg-vision-crimson/10 border border-vision-crimson/30 hover:bg-vision-crimson/20 hover:border-vision-crimson/50 transition-all text-[10px] font-mono font-black text-vision-crimson uppercase tracking-[0.3em]"
                      >
                        Full Details
                      </button>
                    </div>
                  </MotionDiv>
                )}
              </AnimatePresence>

              {/* Inner border accent */}
              <div className="absolute inset-[5px] border border-vision-cyan/0 group-hover:border-vision-cyan/20 transition-all duration-700 pointer-events-none rounded-[2.2rem]" />
            </div>
          </MotionDiv>
        </MotionDiv>
      </MotionDiv>
    );
  }
);
ProjectCard.displayName = 'ProjectCard';

// ============================================================================
// MOBILE SCROLL CAROUSEL
// ============================================================================

const MobileCarousel = memo(function MobileCarousel({
  missions,
  onSelect,
}: {
  missions: ProjectData[];
  onSelect: (p: ProjectData) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  const scroll = useCallback((dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardW = el.clientWidth * 0.82;
    el.scrollBy({ left: dir === 'left' ? -cardW : cardW, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
    return () => el.removeEventListener('scroll', checkScroll);
  }, [checkScroll]);

  return (
    <div className="relative md:hidden">
      {/* Scroll buttons */}
      <AnimatePresence>
        {canScrollLeft && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => scroll('left')}
            className="absolute -left-2 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white/90 dark:bg-space-black/90 border border-slate-200 dark:border-white/10 shadow-lg flex items-center justify-center text-slate-600 dark:text-white/40 hover:text-vision-cyan transition-colors"
          >
            <Icons.ChevronLeft />
          </motion.button>
        )}
        {canScrollRight && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => scroll('right')}
            className="absolute -right-2 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white/90 dark:bg-space-black/90 border border-slate-200 dark:border-white/10 shadow-lg flex items-center justify-center text-slate-600 dark:text-white/40 hover:text-vision-cyan transition-colors"
          >
            <Icons.ChevronRight />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-6 px-6"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {missions.map((mission, idx) => (
          <div key={mission.id} className="snap-center shrink-0 w-[82vw] max-w-[340px]">
            <ProjectCard mission={mission} idx={idx} onSelect={onSelect} />
          </div>
        ))}
      </div>

      {/* Scroll indicator dots */}
      <div className="flex justify-center gap-1.5 mt-4">
        {missions.map((_, i) => (
          <div
            key={i}
            className="h-1 w-6 rounded-full bg-slate-200 dark:bg-white/10 transition-colors"
          />
        ))}
      </div>
    </div>
  );
});

// ============================================================================
// PREMIUM CTA
// ============================================================================

const PremiumCTA = memo(function PremiumCTA({ projectCount }: { projectCount?: number }) {
  return (
    <div className="mt-14 flex justify-center">
      <Link
        href="/projects"
        className="group relative inline-flex items-center gap-5 px-14 py-6 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.03]"
      >
        {/* Spinning conic border */}
        <div className="absolute -inset-[1px] rounded-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div
            className="absolute inset-0 animate-spin-slow"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0%, rgba(var(--glow-cyan),1) 10%, transparent 20%, transparent 40%, rgba(var(--glow-crimson),1) 50%, transparent 60%, transparent 80%, rgba(var(--glow-orange),1) 90%, transparent 100%)',
            }}
          />
          <div className="absolute inset-[1.5px] rounded-[calc(1rem-1.5px)] bg-white dark:bg-space-black" />
        </div>

        {/* Base glass layer */}
        <span className="absolute inset-0 bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl border-2 border-slate-200/80 dark:border-white/[0.08] rounded-2xl group-hover:border-transparent transition-colors duration-500" />

        {/* Ambient glow on hover */}
        <span
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
          style={{
            boxShadow: '0 0 60px rgba(0,200,232,0.15), inset 0 0 40px rgba(0,200,232,0.05)',
          }}
        />

        {/* Sweep shine */}
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-vision-cyan/[0.08] to-transparent pointer-events-none" />

        {/* Corner brackets */}
        <span className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-slate-300/40 dark:border-white/[0.08] group-hover:border-vision-cyan/50 transition-colors duration-300 rounded-tl-sm" />
        <span className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-slate-300/40 dark:border-white/[0.08] group-hover:border-vision-cyan/50 transition-colors duration-300 rounded-br-sm" />

        <span className="relative z-10 flex items-center gap-4">
          <Icons.Hex />
          <div className="flex flex-col items-start gap-0.5">
            <span className="text-[11px] font-mono font-black text-slate-600 dark:text-white/40 uppercase tracking-[0.5em] group-hover:text-vision-cyan transition-colors duration-300">
              View All Archives
            </span>
            {projectCount !== undefined && (
              <span className="text-[9px] font-mono text-slate-400 dark:text-white/20 group-hover:text-vision-cyan/60 transition-colors tracking-[0.3em]">
                {projectCount}+ Projects Indexed
              </span>
            )}
          </div>
          <motion.span
            className="inline-block"
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Icons.ArrowRight />
          </motion.span>
        </span>

        {/* Status dot */}
        <span className="absolute top-3 right-3 h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-white/15 group-hover:bg-vision-cyan group-hover:shadow-[0_0_8px_rgba(0,200,232,0.7)] transition-all duration-300" />
      </Link>
    </div>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

// Map backend category enum to display name
const CATEGORY_DISPLAY: Record<string, string> = {
  FRONTEND: 'Frontend',
  BACKEND: 'Backend',
  FULLSTACK: 'Full-Stack',
  DATABASE: 'Database',
};

// Map backend status enum to ProjectData status
const STATUS_MAP: Record<string, 'completed' | 'in-progress' | 'planned'> = {
  COMPLETED: 'completed',
  IN_PROGRESS: 'in-progress',
  PLANNING: 'planned',
  ARCHIVED: 'completed',
};

// Map backend project data to the ProjectData shape used by the card + modal
const mapAPIProject = (p: any): ProjectData | null => {
  if (!p || !p.id || !p.title) return null;
  return {
    id: p.id,
    title: p.title,
    slug: p.slug ?? p.title.toLowerCase().replace(/\s+/g, '-'),
    category: CATEGORY_DISPLAY[p.category] ?? p.category ?? 'General',
    description: p.description ?? '',
    fullDescription: p.fullDescription ?? p.description ?? '',
    status: STATUS_MAP[p.status] ?? 'completed',
    featured: p.featured ?? true,
    technologies: p.technologies ?? [],
    images: p.images ?? {},
    metrics: {
      lighthouse: {
        performance: p.metrics?.performance ?? 95,
        accessibility: p.metrics?.accessibility ?? 98,
        bestPractices: p.metrics?.bestPractices ?? 100,
        seo: p.metrics?.seo ?? 95,
      },
      loadTime: p.metrics?.loadTime ?? '0.5s',
      uptime: p.metrics?.uptime ?? '99.9%',
      responseTime: p.metrics?.responseTime ?? '15ms',
    },
    features: p.features,
    links: p.links,
    challenges: p.challenges,
    learnings: p.learnings,
    architecture: p.architecture,
  };
};

export const ProjectsSection = ({ onModalToggle }: { onModalToggle?: (open: boolean) => void }) => {
  const containerRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-10%' });
  const headingInView = useInView(headingRef, { once: true, margin: '-20%' });
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const morphedText = useTextMorph('Digital Vessels.', 'PROJECTS', headingInView, 1400);

  // Backend fetch — falls back to MISSIONS if API is unavailable
  const { data: projectsData } = useQuery(GET_FEATURED_PROJECTS, {
    variables: { limit: 6 },
    errorPolicy: 'all',
  });
  const allMissions: ProjectData[] =
    projectsData?.featuredProjects
      ?.map(mapAPIProject)
      .filter((p: ProjectData | null): p is ProjectData => p !== null) ?? MISSIONS;

  // Filtered missions
  const missions = useMemo(
    () =>
      activeFilter === 'All' ? allMissions : allMissions.filter((m) => m.category === activeFilter),
    [allMissions, activeFilter]
  );

  useEffect(() => {
    onModalToggle?.(!!selectedProject);
  }, [selectedProject, onModalToggle]);

  // Split: first mission is hero, rest are grid
  const heroMission = missions[0];
  const gridMissions = missions.slice(1);

  return (
    <section
      ref={containerRef}
      id="projects"
      className="relative py-20 px-6 bg-stone-50 dark:bg-space-black transition-colors duration-1000 overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-96 bg-vision-cyan/[0.04] dark:bg-vision-cyan/[0.02] blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div ref={headingRef} className="text-center mb-14 md:mb-16">
          <MotionDiv
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-4 px-8 py-2.5 mb-6 rounded-full glassmorphism border-2 border-vision-cyan/40 text-vision-cyan font-mono text-[10px] font-black tracking-[0.6em] uppercase shadow-[0_0_30px_rgba(var(--glow-cyan),0.2)]"
          >
            <Icons.Pulse className="animate-pulse" /> Project_Archive // ARC-04
          </MotionDiv>

          <div className="relative overflow-visible py-4 px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={headingInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="w-48 h-24 bg-vision-cyan/[0.06] dark:bg-vision-cyan/[0.04] blur-[60px] rounded-full" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={headingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black leading-[0.9] tracking-tighter uppercase italic"
            >
              <span className="relative inline-block pr-3">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-br from-rose-800 via-rose-600 to-rose-800 dark:from-vision-cyan dark:via-white/90 dark:to-vision-cyan">
                  {morphedText || '\u00A0'}
                </span>
                <span
                  aria-hidden
                  className="absolute inset-0 text-vision-crimson/30 dark:text-vision-crimson/20 animate-[glitch1_3s_infinite] pointer-events-none select-none mix-blend-darken dark:mix-blend-screen"
                >
                  {morphedText || '\u00A0'}
                </span>
                <span
                  aria-hidden
                  className="absolute inset-0 text-vision-cyan/30 dark:text-vision-cyan/20 animate-[glitch2_3s_infinite] pointer-events-none select-none mix-blend-darken dark:mix-blend-screen"
                >
                  {morphedText || '\u00A0'}
                </span>
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={headingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-3 text-[10px] md:text-[11px] font-mono font-bold text-slate-400 dark:text-vision-cyan/30 uppercase tracking-[0.35em] max-w-xl mx-auto"
            >
              [ Project_Log ] &mdash; Featured builds &amp; production deployments
            </motion.p>

            <MotionDiv
              initial={{ scaleX: 0 }}
              animate={headingInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto mt-5 h-px w-24 bg-gradient-to-r from-transparent via-vision-cyan/40 to-transparent"
            />
          </div>
        </div>

        {/* Category filter pills */}
        <CategoryFilterPills
          active={activeFilter}
          onChange={setActiveFilter}
          missions={allMissions}
        />

        {/* ── Desktop: Hero card + grid ── */}
        <div className="hidden md:block">
          {/* Hero card — first project, full width */}
          {heroMission && (
            <div className="mb-8">
              <ProjectCard mission={heroMission} idx={0} onSelect={setSelectedProject} isHero />
            </div>
          )}

          {/* Remaining cards — 3-col grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {gridMissions.map((mission, idx) => (
                <ProjectCard
                  key={mission.id}
                  mission={mission}
                  idx={idx + 1}
                  onSelect={setSelectedProject}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Mobile: horizontal scroll carousel ── */}
        <MobileCarousel missions={missions} onSelect={setSelectedProject} />

        {/* Premium CTA */}
        <PremiumCTA projectCount={allMissions.length} />
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

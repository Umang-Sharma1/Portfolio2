'use client';

import React, { memo } from 'react';
import dynamic from 'next/dynamic';

// ============================================================================
// SVG BASE WRAPPER
// ============================================================================

const Svg = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

// ============================================================================
// LUCIDE-REACT LAZY ICONS (Original 11)
// ============================================================================

const L = {
  Atom: dynamic(() => import('lucide-react').then((m) => m.Atom), { ssr: false }),
  Layers: dynamic(() => import('lucide-react').then((m) => m.Layers), { ssr: false }),
  Code2: dynamic(() => import('lucide-react').then((m) => m.Code2), { ssr: false }),
  Server: dynamic(() => import('lucide-react').then((m) => m.Server), { ssr: false }),
  Database: dynamic(() => import('lucide-react').then((m) => m.Database), { ssr: false }),
  Cloud: dynamic(() => import('lucide-react').then((m) => m.Cloud), { ssr: false }),
  Hexagon: dynamic(() => import('lucide-react').then((m) => m.Hexagon), { ssr: false }),
  Sparkles: dynamic(() => import('lucide-react').then((m) => m.Sparkles), { ssr: false }),
  Box: dynamic(() => import('lucide-react').then((m) => m.Box), { ssr: false }),
  Terminal: dynamic(() => import('lucide-react').then((m) => m.Terminal), { ssr: false }),
  Cpu: dynamic(() => import('lucide-react').then((m) => m.Cpu), { ssr: false }),
};

// ============================================================================
// CUSTOM SVG ICONS — Hand-crafted for each technology
// ============================================================================

type IconFC = React.FC<{ className?: string }>;

const C: Record<string, IconFC> = {
  /* ---- Frontend ---- */

  // HTML5 — shield with angle brackets
  Html5: ({ className }) => (
    <Svg className={className}>
      <path d="M4 3l1.78 17L12 22l6.22-2L20 3H4z" />
      <polyline points="9 8 7 12 9 16" />
      <polyline points="15 8 17 12 15 16" />
    </Svg>
  ),

  // CSS3 — shield with style braces
  Css3: ({ className }) => (
    <Svg className={className}>
      <path d="M4 3l1.78 17L12 22l6.22-2L20 3H4z" />
      <path d="M9 9c-1.5 0-2 1-2 2s1.5 1.5 2 2-.5 2-2 2" />
      <path d="M15 9c1.5 0 2 1 2 2s-1.5 1.5-2 2 .5 2 2 2" />
    </Svg>
  ),

  // Vue.js — double V chevron
  Vue: ({ className }) => (
    <Svg className={className}>
      <path d="M2 3h5l5 16L17 3h5" />
      <path d="M7 3l5 9 5-9" />
    </Svg>
  ),

  // Redux / Redux Toolkit — state cycle arrows
  Redux: ({ className }) => (
    <Svg className={className}>
      <path d="M17 4l3 3-3 3" />
      <path d="M20 7H10a4 4 0 100 8" />
      <path d="M7 20l-3-3 3-3" />
      <path d="M4 17h10a4 4 0 000-8" />
    </Svg>
  ),

  // React Query — atom with lightning center
  ReactQuery: ({ className }) => (
    <Svg className={className}>
      <ellipse cx="12" cy="12" rx="10" ry="4" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
      <polygon points="12 9 10.5 13.5 13.5 13.5" fill="currentColor" />
    </Svg>
  ),

  // Sass/SCSS — flowing S curve
  Sass: ({ className }) => (
    <Svg className={className}>
      <path d="M7 6c2-2 8-2 8 2s-8 4-8 8c0 4 6 4 8 2" />
    </Svg>
  ),

  // Webpack — hexagonal bundle with inner web
  Webpack: ({ className }) => (
    <Svg className={className}>
      <polygon points="12 2 21 7 21 17 12 22 3 17 3 7" />
      <path d="M12 8l5 3v4l-5 3-5-3v-4l5-3z" />
      <path d="M12 8v7" />
    </Svg>
  ),

  // Vite / FastAPI / React Query alt — lightning bolt
  Bolt: ({ className }) => (
    <Svg className={className}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10" />
    </Svg>
  ),

  // Material-UI — M in circle
  MaterialUI: ({ className }) => (
    <Svg className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M7 16V8l5 4 5-4v8" />
    </Svg>
  ),

  /* ---- Backend ---- */

  // Express.js — route/middleware lines with endpoint dot
  Express: ({ className }) => (
    <Svg className={className}>
      <path d="M4 8h16" />
      <path d="M4 12h10" />
      <path d="M4 16h16" />
      <circle cx="17" cy="12" r="2.5" />
    </Svg>
  ),

  // REST API — connected endpoint nodes
  RestApi: ({ className }) => (
    <Svg className={className}>
      <circle cx="5" cy="12" r="2.5" />
      <circle cx="19" cy="5" r="2.5" />
      <circle cx="19" cy="19" r="2.5" />
      <path d="M7.5 11L16.5 6.5" />
      <path d="M7.5 13L16.5 17.5" />
    </Svg>
  ),

  // Apollo Server — A with orbit ring
  Apollo: ({ className }) => (
    <Svg className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 17l3-10 3 10" />
      <path d="M10 14h4" />
    </Svg>
  ),

  // .NET Core — dotted cross in frame
  DotNet: ({ className }) => (
    <Svg className={className}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8" cy="12" r="1.5" fill="currentColor" />
      <path d="M12 8v8" />
      <path d="M14 10l4-4" />
      <path d="M14 14l4 4" />
    </Svg>
  ),

  // C# — C with hash lines
  CSharp: ({ className }) => (
    <Svg className={className}>
      <path d="M17 8A7 7 0 107 16" />
      <path d="M14 8v8" />
      <path d="M17 8v8" />
      <path d="M13 10h5" />
      <path d="M13 14h5" />
    </Svg>
  ),

  // NestJS — cat face
  Nest: ({ className }) => (
    <Svg className={className}>
      <path d="M4 20V10c0-4 3.5-7 8-7s8 3 8 7v10" />
      <path d="M4 10L1 5" />
      <path d="M20 10l3-5" />
      <circle cx="9" cy="13" r="1.5" fill="currentColor" />
      <circle cx="15" cy="13" r="1.5" fill="currentColor" />
      <path d="M10 17c1 1 3 1 4 0" />
    </Svg>
  ),

  // Microservices — node mesh grid
  Mesh: ({ className }) => (
    <Svg className={className}>
      <circle cx="5" cy="5" r="2" />
      <circle cx="19" cy="5" r="2" />
      <circle cx="5" cy="19" r="2" />
      <circle cx="19" cy="19" r="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M7 6l3 4" />
      <path d="M14 16l3 2" />
      <path d="M17 6l-3 4" />
      <path d="M7 18l3-4" />
    </Svg>
  ),

  // WebSockets / Socket.io — bidirectional plug
  Socket: ({ className }) => (
    <Svg className={className}>
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <rect x="5" y="7" width="14" height="4" rx="2" />
      <path d="M12 11v2" />
      <rect x="5" y="13" width="14" height="4" rx="2" />
      <path d="M8 17v4" />
      <path d="M16 17v4" />
    </Svg>
  ),

  // JWT Authentication — padlock with key
  JwtKey: ({ className }) => (
    <Svg className={className}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 018 0v4" />
      <circle cx="12" cy="16" r="1.5" />
      <path d="M12 17.5V19" />
    </Svg>
  ),

  // OAuth 2.0 — shield with checkmark
  Shield: ({ className }) => (
    <Svg className={className}>
      <path d="M12 2l8 4v6c0 5.5-3.5 10.5-8 12-4.5-1.5-8-6.5-8-12V6l8-4z" />
      <path d="M9 12l2 2 4-4" />
    </Svg>
  ),

  /* ---- Database ---- */

  // Mongoose — leaf
  Leaf: ({ className }) => (
    <Svg className={className}>
      <path d="M17 3c-4 0-10 4-10 12" />
      <path d="M7 15c8 2 14-4 14-12" />
      <path d="M3 21c2-4 5-7 8-8" />
    </Svg>
  ),

  // MySQL — dolphin arc
  Dolphin: ({ className }) => (
    <Svg className={className}>
      <path d="M4 16c0-6 4-10 9-10 3 0 5 1.5 6.5 3.5" />
      <path d="M19.5 9.5c1 1.5 1.5 3.5 1.5 6" />
      <path d="M21 16c0 2-4 4-9 4s-8-2-8-4" />
      <circle cx="15" cy="9" r="1" fill="currentColor" />
    </Svg>
  ),

  // Prisma — triangular prism with refraction lines
  Prism: ({ className }) => (
    <Svg className={className}>
      <path d="M12 2L3 20h18L12 2z" />
      <path d="M12 2l4 18" />
      <path d="M12 2L8 20" />
    </Svg>
  ),

  // TypeORM / SQL — data table grid
  Table: ({ className }) => (
    <Svg className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M3 15h18" />
      <path d="M9 3v18" />
    </Svg>
  ),

  // Database Design — ER diagram
  Schema: ({ className }) => (
    <Svg className={className}>
      <rect x="2" y="3" width="8" height="5" rx="1" />
      <rect x="14" y="3" width="8" height="5" rx="1" />
      <rect x="8" y="16" width="8" height="5" rx="1" />
      <path d="M6 8v4c0 2 2 4 6 4" />
      <path d="M18 8v4c0 2-2 4-6 4" />
    </Svg>
  ),

  // Database Optimization — DB with speed bolt
  DbBolt: ({ className }) => (
    <Svg className={className}>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
      <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
      <polygon points="13 10 11 14 15 14 13 18" fill="currentColor" fillOpacity="0.5" />
    </Svg>
  ),

  /* ---- DevOps ---- */

  // Git — branch/merge graph
  Git: ({ className }) => (
    <Svg className={className}>
      <circle cx="12" cy="4" r="2" />
      <circle cx="6" cy="20" r="2" />
      <circle cx="18" cy="20" r="2" />
      <path d="M12 6v6" />
      <path d="M12 12c-4 0-6 4-6 6" />
      <path d="M12 12c4 0 6 4 6 6" />
    </Svg>
  ),

  // Docker Compose — stacked containers
  Stacked: ({ className }) => (
    <Svg className={className}>
      <rect x="3" y="3" width="18" height="7" rx="1.5" />
      <rect x="3" y="13" width="18" height="7" rx="1.5" />
      <circle cx="7" cy="6.5" r="1" fill="currentColor" />
      <circle cx="7" cy="16.5" r="1" fill="currentColor" />
      <path d="M11 6.5h6" />
      <path d="M11 16.5h6" />
    </Svg>
  ),

  // GitHub Actions — gear cog
  GearPlay: ({ className }) => (
    <Svg className={className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2" />
      <path d="M12 21v2" />
      <path d="M4.22 4.22l1.42 1.42" />
      <path d="M18.36 18.36l1.42 1.42" />
      <path d="M1 12h2" />
      <path d="M21 12h2" />
      <path d="M4.22 19.78l1.42-1.42" />
      <path d="M18.36 5.64l1.42-1.42" />
    </Svg>
  ),

  // CI/CD — deploy cycle clock
  Deploy: ({ className }) => (
    <Svg className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
      <path d="M16 3l2 3-3 1" />
    </Svg>
  ),

  // Vercel — triangle
  Vercel: ({ className }) => (
    <Svg className={className}>
      <path d="M12 2L2 20h20L12 2z" />
    </Svg>
  ),

  // Nginx — N in server box
  Nginx: ({ className }) => (
    <Svg className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M8 16V8l8 8V8" />
    </Svg>
  ),

  /* ---- Tools ---- */

  // VS Code — code editor window
  VsCode: ({ className }) => (
    <Svg className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M8 8l-2.5 4L8 16" />
      <path d="M16 8l2.5 4L16 16" />
      <line x1="11" y1="7" x2="13" y2="17" />
    </Svg>
  ),

  // Postman — paper plane
  Postman: ({ className }) => (
    <Svg className={className}>
      <path d="M22 2L11 13" />
      <path d="M22 2l-7 20-4-9-9-4z" />
    </Svg>
  ),

  // Figma — design tool circles
  Figma: ({ className }) => (
    <Svg className={className}>
      <circle cx="9" cy="5" r="3" />
      <circle cx="15" cy="5" r="3" />
      <circle cx="9" cy="11" r="3" />
      <rect x="12" y="8" width="6" height="6" rx="1" />
      <circle cx="9" cy="17" r="3" />
    </Svg>
  ),

  // Jira — kanban board
  Board: ({ className }) => (
    <Svg className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18" />
      <path d="M15 3v18" />
      <rect x="4.5" y="5.5" width="3" height="3" rx="0.5" fill="currentColor" fillOpacity="0.4" />
      <rect x="10.5" y="5.5" width="3" height="3" rx="0.5" fill="currentColor" fillOpacity="0.4" />
      <rect x="10.5" y="10.5" width="3" height="3" rx="0.5" fill="currentColor" fillOpacity="0.4" />
      <rect x="16.5" y="5.5" width="3" height="3" rx="0.5" fill="currentColor" fillOpacity="0.4" />
    </Svg>
  ),

  // Slack — chat bubble
  Chat: ({ className }) => (
    <Svg className={className}>
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6A8.38 8.38 0 0112.5 3h.5a8.48 8.48 0 018 8v.5z" />
    </Svg>
  ),

  /* ---- Other ---- */

  // Three.js — 3D cube wireframe
  Cube3D: ({ className }) => (
    <Svg className={className}>
      <path d="M12 2l10 6v8l-10 6L2 16V8l10-6z" />
      <path d="M12 8l10-6" />
      <path d="M12 8L2 2" />
      <path d="M12 8v14" />
    </Svg>
  ),

  // Data Structures — binary tree
  Tree: ({ className }) => (
    <Svg className={className}>
      <circle cx="12" cy="4" r="2.5" />
      <circle cx="5" cy="13" r="2.5" />
      <circle cx="19" cy="13" r="2.5" />
      <circle cx="2" cy="21" r="1.5" />
      <circle cx="8" cy="21" r="1.5" />
      <path d="M10 5.5L7 11" />
      <path d="M14 5.5L17 11" />
      <path d="M4 15l-1.5 4.5" />
      <path d="M6.5 15L7.5 19.5" />
    </Svg>
  ),

  // Algorithms — flow graph
  Graph: ({ className }) => (
    <Svg className={className}>
      <circle cx="4" cy="4" r="2.5" />
      <circle cx="20" cy="4" r="2.5" />
      <circle cx="12" cy="12" r="2.5" />
      <circle cx="4" cy="20" r="2.5" />
      <circle cx="20" cy="20" r="2.5" />
      <path d="M6 5.5L10 10.5" />
      <path d="M18 5.5L14 10.5" />
      <path d="M10 13.5L6 18.5" />
      <path d="M14 13.5L18 18.5" />
    </Svg>
  ),
};

// ============================================================================
// COMPREHENSIVE ICON MAPPING (All 55+ seeded skills)
// ============================================================================

const normalize = (value?: string) =>
  (value || '').toLowerCase().replace(/[^a-z0-9]/g, '');

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  // —— Lucide icons (original 15 mappings) ——
  react: L.Atom,
  nextjs: L.Layers,
  typescript: L.Code2,
  javascript: L.Code2,
  nodejs: L.Server,
  node: L.Server,
  graphql: L.Hexagon,
  tailwindcss: L.Sparkles,
  tailwind: L.Sparkles,
  docker: L.Box,
  aws: L.Cloud,
  python: L.Terminal,
  mongodb: L.Database,
  postgres: L.Database,
  postgresql: L.Database,
  redis: L.Cpu,

  // —— Custom SVGs for all remaining skills ——
  // Frontend
  html5: C.Html5,
  css3: C.Css3,
  vuejs: C.Vue,
  redux: C.Redux,
  reduxtoolkit: C.Redux,
  reactquery: C.ReactQuery,
  sassscss: C.Sass,
  webpack: C.Webpack,
  vite: C.Bolt,
  materialui: C.MaterialUI,

  // Backend
  expressjs: C.Express,
  restapi: C.RestApi,
  apolloserver: C.Apollo,
  netcore: C.DotNet,
  c: C.CSharp,
  fastapi: C.Bolt,
  nestjs: C.Nest,
  microservices: C.Mesh,
  websockets: C.Socket,
  socketio: C.Socket,
  jwtauthentication: C.JwtKey,
  oauth20: C.Shield,

  // Database
  mongoose: C.Leaf,
  mysql: C.Dolphin,
  prisma: C.Prism,
  typeorm: C.Table,
  sql: C.Table,
  databasedesign: C.Schema,
  databaseoptimization: C.DbBolt,

  // DevOps
  git: C.Git,
  dockercompose: C.Stacked,
  githubactions: C.GearPlay,
  cicd: C.Deploy,
  vercel: C.Vercel,
  nginx: C.Nginx,

  // Tools
  vscode: C.VsCode,
  postman: C.Postman,
  figma: C.Figma,
  jira: C.Board,
  slack: C.Chat,

  // Other
  threejs: C.Cube3D,
  datastructures: C.Tree,
  algorithms: C.Graph,
};

// ============================================================================
// EXPORTED SKILL ICON COMPONENT
// ============================================================================

export const SkillIcon = memo(function SkillIcon({
  skill,
  size = 'md',
}: {
  skill: { icon?: string; name: string };
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeClass = { sm: 'h-6 w-6', md: 'h-8 w-8', lg: 'h-10 w-10' }[size];
  const textClass = { sm: 'text-2xl', md: 'text-3xl', lg: 'text-4xl' }[size];

  const keyFromIcon = normalize(skill.icon);
  const keyFromName = normalize(skill.name);
  const Icon = ICON_MAP[keyFromIcon] || ICON_MAP[keyFromName];

  if (Icon) {
    return <Icon className={`${sizeClass} text-vision-cyan`} />;
  }

  return (
    <span
      className={`${textClass} filter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]`}
    >
      {skill.icon || '✶'}
    </span>
  );
});

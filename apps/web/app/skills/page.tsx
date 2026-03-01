'use client';

import React, { useState, useRef, memo, useCallback, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useSkills } from '@/hooks/use-skills';
import { SkillIcon } from '@/lib/skill-icons';
import PageStarfield from '@/components/background/PageStarfield';

// ============================================================================
// TYPES
// ============================================================================

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  yearsOfExperience: number;
  projectCount: number;
  icon: string;
  color: string;
  description?: string;
  relatedSkills?: string[];
  status?: string;
}

interface SkillCategory {
  name: string;
  count: number;
}

type SortOption = 'proficiency' | 'name' | 'experience';

// ============================================================================
// ICONS (Inline SVG for performance)
// ============================================================================

const Icons = {
  ArrowLeft: memo(function ArrowLeftIcon({ className }: { className?: string }) {
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
        <path d="m12 19-7-7 7-7" />
        <path d="M19 12H5" />
      </svg>
    );
  }),
  Search: memo(function SearchIcon({ className }: { className?: string }) {
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
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    );
  }),
  Clear: memo(function ClearIcon({ className }: { className?: string }) {
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
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    );
  }),
  ChevronDown: memo(function ChevronDownIcon({ className }: { className?: string }) {
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
        <path d="m6 9 6 6 6-6" />
      </svg>
    );
  }),
  ChevronRight: memo(function ChevronRightIcon({ className }: { className?: string }) {
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
        <path d="m9 18 6-6-6-6" />
      </svg>
    );
  }),
  Sort: memo(function SortIcon({ className }: { className?: string }) {
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
        <path d="m3 16 4 4 4-4" />
        <path d="M7 20V4" />
        <path d="m21 8-4-4-4 4" />
        <path d="M17 4v16" />
      </svg>
    );
  }),
  Briefcase: memo(function BriefcaseIcon({ className }: { className?: string }) {
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
        <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
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
        <polyline points="12,6 12,12 16,14" />
      </svg>
    );
  }),
  Sparkles: memo(function SparklesIcon({ className }: { className?: string }) {
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
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        <path d="M5 3v4" />
        <path d="M19 17v4" />
        <path d="M3 5h4" />
        <path d="M17 19h4" />
      </svg>
    );
  }),
  ExternalLink: memo(function ExternalLinkIcon({ className }: { className?: string }) {
    return (
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
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
    );
  }),
};

const normalizeCategory = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');

// ============================================================================
// MOCK DATA (50+ skills for comprehensive display)
// ============================================================================

const MOCK_SKILLS: Skill[] = [
  // Frontend (12)
  {
    id: '1',
    name: 'React',
    category: 'Frontend',
    proficiency: 95,
    yearsOfExperience: 4,
    projectCount: 28,
    icon: '⚛️',
    color: '#61DAFB',
    description: 'Building interactive UIs with hooks, context, and modern patterns',
    relatedSkills: ['Next.js', 'Redux', 'TypeScript'],
  },
  {
    id: '2',
    name: 'Next.js',
    category: 'Frontend',
    proficiency: 92,
    yearsOfExperience: 3,
    projectCount: 18,
    icon: '▲',
    color: '#000000',
    description: 'Full-stack React with SSR, SSG, API routes, and App Router',
    relatedSkills: ['React', 'Vercel', 'TypeScript'],
  },
  {
    id: '3',
    name: 'TypeScript',
    category: 'Frontend',
    proficiency: 90,
    yearsOfExperience: 3,
    projectCount: 24,
    icon: '📘',
    color: '#3178C6',
    description: 'Type-safe development with advanced generics and utility types',
    relatedSkills: ['React', 'Node.js', 'GraphQL'],
  },
  {
    id: '4',
    name: 'Vue.js',
    category: 'Frontend',
    proficiency: 78,
    yearsOfExperience: 2,
    projectCount: 8,
    icon: '💚',
    color: '#4FC08D',
    description: 'Progressive framework with Composition API and Vuex',
    relatedSkills: ['Nuxt.js', 'Pinia', 'Vite'],
  },
  {
    id: '5',
    name: 'TailwindCSS',
    category: 'Frontend',
    proficiency: 94,
    yearsOfExperience: 3,
    projectCount: 26,
    icon: '🎨',
    color: '#06B6D4',
    description: 'Utility-first CSS, custom design systems, and responsive layouts',
    relatedSkills: ['CSS', 'PostCSS', 'Sass'],
  },
  {
    id: '6',
    name: 'Framer Motion',
    category: 'Frontend',
    proficiency: 85,
    yearsOfExperience: 2,
    projectCount: 15,
    icon: '✨',
    color: '#0055FF',
    description: 'Production-ready animations for React applications',
    relatedSkills: ['React', 'GSAP', 'CSS'],
  },
  {
    id: '7',
    name: 'Redux',
    category: 'Frontend',
    proficiency: 82,
    yearsOfExperience: 3,
    projectCount: 12,
    icon: '💜',
    color: '#764ABC',
    description: 'State management with Redux Toolkit and RTK Query',
    relatedSkills: ['React', 'TypeScript', 'Zustand'],
  },
  {
    id: '8',
    name: 'HTML5',
    category: 'Frontend',
    proficiency: 98,
    yearsOfExperience: 6,
    projectCount: 40,
    icon: '📄',
    color: '#E34F26',
    description: 'Semantic markup, accessibility, and modern APIs',
    relatedSkills: ['CSS', 'JavaScript', 'ARIA'],
  },
  {
    id: '9',
    name: 'CSS3',
    category: 'Frontend',
    proficiency: 95,
    yearsOfExperience: 6,
    projectCount: 40,
    icon: '🎨',
    color: '#1572B6',
    description: 'Modern layouts with Grid, Flexbox, animations, and custom properties',
    relatedSkills: ['Sass', 'TailwindCSS', 'PostCSS'],
  },
  {
    id: '10',
    name: 'JavaScript',
    category: 'Frontend',
    proficiency: 96,
    yearsOfExperience: 5,
    projectCount: 35,
    icon: '💛',
    color: '#F7DF1E',
    description: 'ES2024+, async patterns, and functional programming',
    relatedSkills: ['TypeScript', 'Node.js', 'React'],
  },
  {
    id: '11',
    name: 'Sass/SCSS',
    category: 'Frontend',
    proficiency: 88,
    yearsOfExperience: 4,
    projectCount: 20,
    icon: '💗',
    color: '#CC6699',
    description: 'CSS preprocessing with mixins, functions, and modular architecture',
    relatedSkills: ['CSS', 'PostCSS', 'BEM'],
  },
  {
    id: '12',
    name: 'Webpack',
    category: 'Frontend',
    proficiency: 75,
    yearsOfExperience: 3,
    projectCount: 10,
    icon: '📦',
    color: '#8DD6F9',
    description: 'Module bundling, code splitting, and optimization',
    relatedSkills: ['Vite', 'Babel', 'ESBuild'],
  },

  // Backend (10)
  {
    id: '13',
    name: 'Node.js',
    category: 'Backend',
    proficiency: 88,
    yearsOfExperience: 4,
    projectCount: 22,
    icon: '🟢',
    color: '#339933',
    description: 'Server-side JavaScript with Express, Fastify, and microservices',
    relatedSkills: ['Express', 'NestJS', 'TypeScript'],
  },
  {
    id: '14',
    name: 'Express.js',
    category: 'Backend',
    proficiency: 90,
    yearsOfExperience: 4,
    projectCount: 20,
    icon: '🚂',
    color: '#000000',
    description: 'RESTful APIs, middleware patterns, and authentication',
    relatedSkills: ['Node.js', 'MongoDB', 'JWT'],
  },
  {
    id: '15',
    name: 'NestJS',
    category: 'Backend',
    proficiency: 82,
    yearsOfExperience: 2,
    projectCount: 8,
    icon: '🐱',
    color: '#E0234E',
    description: 'Enterprise-grade Node.js framework with decorators and DI',
    relatedSkills: ['TypeScript', 'GraphQL', 'Prisma'],
  },
  {
    id: '16',
    name: 'GraphQL',
    category: 'Backend',
    proficiency: 85,
    yearsOfExperience: 2,
    projectCount: 12,
    icon: '◈',
    color: '#E535AB',
    description: 'Schema design, resolvers, Apollo Server, and subscriptions',
    relatedSkills: ['Apollo', 'TypeScript', 'Prisma'],
  },
  {
    id: '17',
    name: 'Python',
    category: 'Backend',
    proficiency: 80,
    yearsOfExperience: 3,
    projectCount: 14,
    icon: '🐍',
    color: '#3776AB',
    description: 'Django, FastAPI, data processing, and automation',
    relatedSkills: ['Django', 'FastAPI', 'Pandas'],
  },
  {
    id: '18',
    name: 'Django',
    category: 'Backend',
    proficiency: 75,
    yearsOfExperience: 2,
    projectCount: 6,
    icon: '🎸',
    color: '#092E20',
    description: 'Full-stack Python framework with ORM and admin panel',
    relatedSkills: ['Python', 'PostgreSQL', 'REST'],
  },
  {
    id: '19',
    name: 'FastAPI',
    category: 'Backend',
    proficiency: 78,
    yearsOfExperience: 1,
    projectCount: 5,
    icon: '⚡',
    color: '#009688',
    description: 'Modern async Python API framework with auto-docs',
    relatedSkills: ['Python', 'Pydantic', 'SQLAlchemy'],
  },
  {
    id: '20',
    name: 'REST APIs',
    category: 'Backend',
    proficiency: 92,
    yearsOfExperience: 5,
    projectCount: 30,
    icon: '🔌',
    color: '#4CAF50',
    description: 'API design, versioning, authentication, and documentation',
    relatedSkills: ['OpenAPI', 'JWT', 'OAuth'],
  },
  {
    id: '21',
    name: 'WebSockets',
    category: 'Backend',
    proficiency: 80,
    yearsOfExperience: 2,
    projectCount: 8,
    icon: '🔗',
    color: '#FF6B6B',
    description: 'Real-time bidirectional communication with Socket.io',
    relatedSkills: ['Socket.io', 'Node.js', 'Redis'],
  },
  {
    id: '22',
    name: 'Microservices',
    category: 'Backend',
    proficiency: 76,
    yearsOfExperience: 2,
    projectCount: 5,
    icon: '🧩',
    color: '#9C27B0',
    description: 'Distributed systems, service mesh, and event-driven architecture',
    relatedSkills: ['Docker', 'Kubernetes', 'RabbitMQ'],
  },

  // Database (8)
  {
    id: '23',
    name: 'MongoDB',
    category: 'Database',
    proficiency: 88,
    yearsOfExperience: 4,
    projectCount: 20,
    icon: '🍃',
    color: '#47A248',
    description: 'NoSQL database design, aggregation pipelines, and optimization',
    relatedSkills: ['Mongoose', 'Atlas', 'Redis'],
  },
  {
    id: '24',
    name: 'PostgreSQL',
    category: 'Database',
    proficiency: 85,
    yearsOfExperience: 3,
    projectCount: 15,
    icon: '🐘',
    color: '#4169E1',
    description: 'Advanced SQL, JSON support, and performance tuning',
    relatedSkills: ['Prisma', 'TypeORM', 'SQL'],
  },
  {
    id: '25',
    name: 'Redis',
    category: 'Database',
    proficiency: 80,
    yearsOfExperience: 2,
    projectCount: 10,
    icon: '🔴',
    color: '#DC382D',
    description: 'Caching, pub/sub, sessions, and rate limiting',
    relatedSkills: ['Node.js', 'Bull', 'Cache'],
  },
  {
    id: '26',
    name: 'Prisma',
    category: 'Database',
    proficiency: 86,
    yearsOfExperience: 2,
    projectCount: 12,
    icon: '△',
    color: '#2D3748',
    description: 'Type-safe ORM with migrations and Prisma Studio',
    relatedSkills: ['PostgreSQL', 'MongoDB', 'TypeScript'],
  },
  {
    id: '27',
    name: 'MySQL',
    category: 'Database',
    proficiency: 78,
    yearsOfExperience: 3,
    projectCount: 8,
    icon: '🐬',
    color: '#4479A1',
    description: 'Relational database design and optimization',
    relatedSkills: ['SQL', 'Sequelize', 'TypeORM'],
  },
  {
    id: '28',
    name: 'SQLite',
    category: 'Database',
    proficiency: 75,
    yearsOfExperience: 2,
    projectCount: 6,
    icon: '📁',
    color: '#003B57',
    description: 'Embedded database for local-first applications',
    relatedSkills: ['Drizzle', 'SQL', 'Turso'],
  },
  {
    id: '29',
    name: 'Elasticsearch',
    category: 'Database',
    proficiency: 70,
    yearsOfExperience: 1,
    projectCount: 4,
    icon: '🔍',
    color: '#005571',
    description: 'Full-text search, analytics, and log aggregation',
    relatedSkills: ['Kibana', 'Logstash', 'Node.js'],
  },
  {
    id: '30',
    name: 'Firebase',
    category: 'Database',
    proficiency: 82,
    yearsOfExperience: 3,
    projectCount: 10,
    icon: '🔥',
    color: '#FFCA28',
    description: 'Realtime database, Firestore, and authentication',
    relatedSkills: ['Authentication', 'Cloud Functions', 'Hosting'],
  },

  // Full Stack (6)
  {
    id: '31',
    name: 'MERN Stack',
    category: 'Full Stack',
    proficiency: 90,
    yearsOfExperience: 4,
    projectCount: 15,
    icon: '🏗️',
    color: '#00D8FF',
    description: 'MongoDB, Express, React, Node.js full-stack development',
    relatedSkills: ['React', 'Node.js', 'MongoDB'],
  },
  {
    id: '32',
    name: 'T3 Stack',
    category: 'Full Stack',
    proficiency: 85,
    yearsOfExperience: 2,
    projectCount: 8,
    icon: '🔺',
    color: '#3178C6',
    description: 'Next.js, tRPC, Prisma, and TypeScript',
    relatedSkills: ['Next.js', 'tRPC', 'Prisma'],
  },
  {
    id: '33',
    name: 'JAMstack',
    category: 'Full Stack',
    proficiency: 88,
    yearsOfExperience: 3,
    projectCount: 12,
    icon: '⚡',
    color: '#F0047F',
    description: 'JavaScript, APIs, and Markup for modern web apps',
    relatedSkills: ['Next.js', 'Vercel', 'Netlify'],
  },
  {
    id: '34',
    name: 'tRPC',
    category: 'Full Stack',
    proficiency: 80,
    yearsOfExperience: 1,
    projectCount: 6,
    icon: '🔵',
    color: '#398CCB',
    description: 'End-to-end typesafe APIs without code generation',
    relatedSkills: ['TypeScript', 'Next.js', 'Zod'],
  },
  {
    id: '35',
    name: 'Supabase',
    category: 'Full Stack',
    proficiency: 78,
    yearsOfExperience: 1,
    projectCount: 5,
    icon: '⚡',
    color: '#3ECF8E',
    description: 'Open-source Firebase alternative with PostgreSQL',
    relatedSkills: ['PostgreSQL', 'Auth', 'Storage'],
  },
  {
    id: '36',
    name: 'Vercel',
    category: 'Full Stack',
    proficiency: 90,
    yearsOfExperience: 3,
    projectCount: 20,
    icon: '▲',
    color: '#000000',
    description: 'Deployment, edge functions, and analytics',
    relatedSkills: ['Next.js', 'Edge Functions', 'Analytics'],
  },

  // Tools & DevOps (10)
  {
    id: '37',
    name: 'Git',
    category: 'Tools',
    proficiency: 94,
    yearsOfExperience: 5,
    projectCount: 50,
    icon: '📚',
    color: '#F05032',
    description: 'Version control, branching strategies, and collaboration',
    relatedSkills: ['GitHub', 'GitLab', 'CI/CD'],
  },
  {
    id: '38',
    name: 'Docker',
    category: 'Tools',
    proficiency: 82,
    yearsOfExperience: 3,
    projectCount: 14,
    icon: '🐳',
    color: '#2496ED',
    description: 'Containerization, Docker Compose, and multi-stage builds',
    relatedSkills: ['Kubernetes', 'CI/CD', 'Linux'],
  },
  {
    id: '39',
    name: 'Kubernetes',
    category: 'Tools',
    proficiency: 70,
    yearsOfExperience: 1,
    projectCount: 4,
    icon: '☸️',
    color: '#326CE5',
    description: 'Container orchestration, Helm, and deployments',
    relatedSkills: ['Docker', 'Helm', 'AWS EKS'],
  },
  {
    id: '40',
    name: 'AWS',
    category: 'Tools',
    proficiency: 78,
    yearsOfExperience: 3,
    projectCount: 10,
    icon: '☁️',
    color: '#FF9900',
    description: 'EC2, S3, Lambda, RDS, and serverless architectures',
    relatedSkills: ['Lambda', 'S3', 'CloudFormation'],
  },
  {
    id: '41',
    name: 'GitHub Actions',
    category: 'Tools',
    proficiency: 85,
    yearsOfExperience: 2,
    projectCount: 18,
    icon: '🔄',
    color: '#2088FF',
    description: 'CI/CD pipelines, automated testing, and deployments',
    relatedSkills: ['Git', 'Docker', 'Testing'],
  },
  {
    id: '42',
    name: 'VS Code',
    category: 'Tools',
    proficiency: 96,
    yearsOfExperience: 5,
    projectCount: 50,
    icon: '💙',
    color: '#007ACC',
    description: 'Extensions, debugging, and productivity workflows',
    relatedSkills: ['Git', 'Terminal', 'Debug'],
  },
  {
    id: '43',
    name: 'Figma',
    category: 'Tools',
    proficiency: 80,
    yearsOfExperience: 3,
    projectCount: 25,
    icon: '🎨',
    color: '#F24E1E',
    description: 'UI/UX design, prototyping, and design systems',
    relatedSkills: ['Design Systems', 'Prototyping', 'Collaboration'],
  },
  {
    id: '44',
    name: 'Postman',
    category: 'Tools',
    proficiency: 90,
    yearsOfExperience: 4,
    projectCount: 30,
    icon: '📮',
    color: '#FF6C37',
    description: 'API testing, documentation, and mock servers',
    relatedSkills: ['REST', 'GraphQL', 'Testing'],
  },
  {
    id: '45',
    name: 'Linux',
    category: 'Tools',
    proficiency: 82,
    yearsOfExperience: 4,
    projectCount: 20,
    icon: '🐧',
    color: '#FCC624',
    description: 'Shell scripting, system administration, and servers',
    relatedSkills: ['Bash', 'Docker', 'SSH'],
  },
  {
    id: '46',
    name: 'Nginx',
    category: 'Tools',
    proficiency: 75,
    yearsOfExperience: 2,
    projectCount: 8,
    icon: '🟩',
    color: '#009639',
    description: 'Reverse proxy, load balancing, and SSL termination',
    relatedSkills: ['Docker', 'Linux', 'DevOps'],
  },

  // Problem Solving (6)
  {
    id: '47',
    name: 'Data Structures',
    category: 'Problem Solving',
    proficiency: 88,
    yearsOfExperience: 5,
    projectCount: 100,
    icon: '🌳',
    color: '#6366F1',
    description: 'Arrays, trees, graphs, hash tables, and advanced structures',
    relatedSkills: ['Algorithms', 'LeetCode', 'Complexity'],
  },
  {
    id: '48',
    name: 'Algorithms',
    category: 'Problem Solving',
    proficiency: 85,
    yearsOfExperience: 5,
    projectCount: 100,
    icon: '⚙️',
    color: '#8B5CF6',
    description: 'Sorting, searching, dynamic programming, and optimization',
    relatedSkills: ['Data Structures', 'Big O', 'Problem Solving'],
  },
  {
    id: '49',
    name: 'System Design',
    category: 'Problem Solving',
    proficiency: 80,
    yearsOfExperience: 3,
    projectCount: 15,
    icon: '🏛️',
    color: '#EC4899',
    description: 'Scalable architectures, distributed systems, and patterns',
    relatedSkills: ['Microservices', 'Database', 'Caching'],
  },
  {
    id: '50',
    name: 'Testing',
    category: 'Problem Solving',
    proficiency: 86,
    yearsOfExperience: 4,
    projectCount: 25,
    icon: '🧪',
    color: '#22C55E',
    description: 'Unit, integration, E2E testing with Jest, Vitest, Playwright',
    relatedSkills: ['Jest', 'Vitest', 'Playwright'],
  },
  {
    id: '51',
    name: 'Performance',
    category: 'Problem Solving',
    proficiency: 82,
    yearsOfExperience: 3,
    projectCount: 18,
    icon: '🚀',
    color: '#F59E0B',
    description: 'Profiling, optimization, Core Web Vitals, and monitoring',
    relatedSkills: ['Lighthouse', 'Bundle Size', 'Caching'],
  },
  {
    id: '52',
    name: 'Security',
    category: 'Problem Solving',
    proficiency: 78,
    yearsOfExperience: 3,
    projectCount: 15,
    icon: '🔐',
    color: '#EF4444',
    description: 'Authentication, authorization, OWASP, and best practices',
    relatedSkills: ['JWT', 'OAuth', 'HTTPS'],
  },
];

const CATEGORIES: string[] = [
  'All',
  'Frontend',
  'Backend',
  'Full Stack',
  'Database',
  'Tools',
  'Problem Solving',
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function getProficiencyLevel(proficiency: number): string {
  if (proficiency >= 90) return 'Expert';
  if (proficiency >= 80) return 'Advanced';
  if (proficiency >= 70) return 'Proficient';
  if (proficiency >= 60) return 'Intermediate';
  return 'Beginner';
}

function resolveCategoryLabel(value: string, categories: string[]): string {
  return categories.find((cat) => normalizeCategory(cat) === normalizeCategory(value)) || value;
}

function matchesCategory(value: string, selected: string): boolean {
  return normalizeCategory(value) === normalizeCategory(selected);
}

function getProficiencyColor(proficiency: number): string {
  if (proficiency >= 90) return 'text-emerald-500';
  if (proficiency >= 80) return 'text-blue-500';
  if (proficiency >= 70) return 'text-yellow-500';
  return 'text-orange-500';
}

function getGradientByProficiency(proficiency: number): string {
  if (proficiency >= 90) return 'from-emerald-500 to-teal-500';
  if (proficiency >= 80) return 'from-blue-500 to-indigo-500';
  if (proficiency >= 70) return 'from-yellow-500 to-orange-500';
  return 'from-orange-500 to-red-500';
}

// ============================================================================
// COMPONENTS
// ============================================================================

/**
 * Back Button Component
 */
const BackButton = memo(function BackButton() {
  return (
    <Link
      href="/"
      className={cn(
        'inline-flex items-center gap-2.5 px-4 py-2 rounded-xl',
        'text-[10px] font-mono font-black uppercase tracking-[0.3em]',
        'text-slate-500 dark:text-white/30 hover:text-vision-cyan',
        'bg-white/60 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06]',
        'hover:border-vision-cyan/30 transition-all duration-300 group'
      )}
    >
      <Icons.ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
      Back to Core
    </Link>
  );
});

/**
 * Hero Section — Immersive Galaxy + Interactive Terminal
 */
const HeroSection = memo(function HeroSection({
  totalSkills,
  searchQuery,
  onSearchChange,
}: {
  totalSkills: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  // Interactive typing effect
  const [typedText, setTypedText] = useState('');
  const fullText = '> scanning_arsenal... indexing technologies... ready.';
  useEffect(() => {
    if (!isInView) return;
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, 35);
    return () => clearInterval(interval);
  }, [isInView]);

  // Animated count
  const [animatedCount, setAnimatedCount] = useState(0);
  useEffect(() => {
    if (!isInView || totalSkills === 0) return;
    let current = 0;
    const step = Math.max(1, Math.floor(totalSkills / 40));
    const interval = setInterval(() => {
      current = Math.min(current + step, totalSkills);
      setAnimatedCount(current);
      if (current >= totalSkills) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [isInView, totalSkills]);

  // Mouse glow only (no parallax)
  const handleHeroMouseMove = useCallback((e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    heroRef.current.style.setProperty('--glow-x', `${e.clientX - rect.left}px`);
    heroRef.current.style.setProperty('--glow-y', `${e.clientY - rect.top}px`);
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
      className="mb-14"
    >
      <div
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        className="relative rounded-[2.5rem] overflow-hidden mb-10 group/hero"
        style={{ minHeight: '420px' }}
      >
        {/* Dark mode CSS background — animated grid + ambient glow */}
        <div className="absolute inset-0 z-0 hidden dark:block bg-space-black rounded-[2.5rem] overflow-hidden">
          {/* Animated scan grid */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(34,211,238,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.3) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
          {/* Horizontal scan line animation */}
          <div
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-vision-cyan/40 to-transparent animate-pulse"
            style={{ top: '30%', animationDuration: '3s' }}
          />
          <div
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-vision-crimson/30 to-transparent animate-pulse"
            style={{ top: '65%', animationDuration: '4s', animationDelay: '1.5s' }}
          />
          {/* Ambient orbs */}
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-vision-cyan/[0.06] blur-[120px]" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-vision-crimson/[0.06] blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-vision-orange/[0.03] blur-[150px]" />
          {/* Vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-space-black/50 via-transparent to-space-black/70 pointer-events-none" />
          {/* Border */}
          <div className="absolute inset-0 rounded-[2.5rem] border border-white/[0.06] pointer-events-none" />
        </div>

        {/* Light mode background */}
        <div className="absolute inset-0 z-0 dark:hidden bg-white border border-slate-200/80 rounded-[2.5rem]">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(rgba(34,211,238,0.5) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-vision-cyan/5 blur-[100px]" />
          <div className="absolute -bottom-24 -left-24 w-60 h-60 rounded-full bg-vision-crimson/5 blur-[80px]" />
        </div>

        {/* Mouse-following glow */}
        <div className="absolute inset-0 pointer-events-none z-[2]">
          <div
            className="absolute w-[500px] h-[500px] rounded-full opacity-0 group-hover/hero:opacity-100 transition-opacity duration-500"
            style={{
              background: 'radial-gradient(circle, rgba(34,211,238,0.1) 0%, transparent 60%)',
              left: 'var(--glow-x, 50%)',
              top: 'var(--glow-y, 50%)',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>

        {/* Content layer — NO parallax, stable */}
        <div className="relative z-10 p-8 md:p-12 flex flex-col justify-between" style={{ minHeight: '420px' }}>
          {/* Top bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="h-2 w-2 rounded-full bg-vision-cyan animate-pulse shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
              <span className="text-[9px] font-mono font-black text-slate-400 dark:text-white/30 uppercase tracking-[0.5em]">
                System / Arsenal / Manifest
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3"
            >
              {[
                { label: 'NODES', value: animatedCount, color: 'text-vision-cyan' },
                { label: 'CATEGORIES', value: 7, color: 'text-vision-orange' },
                { label: 'STATUS', value: 'ONLINE', color: 'text-emerald-400' },
              ].map((chip) => (
                <span
                  key={chip.label}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/[0.06] text-[8px] font-mono font-black tracking-[0.3em] uppercase text-slate-500 dark:text-white/25 border border-slate-200/50 dark:border-white/[0.08] backdrop-blur-sm"
                >
                  {chip.label}: <span className={chip.color}>{chip.value}</span>
                </span>
              ))}
            </motion.div>
          </div>

          {/* Title Row — stable, no parallax */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-vision-cyan/5 dark:bg-vision-cyan/10 border border-vision-cyan/20 dark:border-vision-cyan/30 backdrop-blur-sm"
              >
                <Icons.Sparkles className="h-3.5 w-3.5 text-vision-cyan" />
                <span className="text-[9px] font-mono font-black tracking-[0.4em] uppercase text-vision-cyan">
                  {totalSkills}+ Technologies Indexed
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 }}
                className="text-5xl md:text-6xl lg:text-7xl font-display font-black tracking-tighter uppercase italic text-slate-900 dark:text-white leading-[0.9]"
              >
                Technical <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-vision-crimson via-vision-orange to-vision-cyan drop-shadow-[0_0_40px_rgba(34,211,238,0.3)]">
                  Arsenal.
                </span>
              </motion.h1>

              {/* Typing terminal line */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.4 }}
                className="font-mono text-xs text-vision-cyan/60 dark:text-vision-cyan/80 h-5"
              >
                {typedText}
                <span className="inline-block w-[2px] h-3.5 bg-vision-cyan ml-0.5 animate-pulse" />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 }}
                className="text-sm font-bold text-slate-500 dark:text-white/40 max-w-lg leading-relaxed"
              >
                Full-spectrum engineering skillset spanning frontend, backend, databases, DevOps,
                and beyond. Each node represents hands-on deployment experience.
              </motion.p>
            </div>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.35 }}
              className="w-full lg:w-80 shrink-0"
            >
              <div className="relative">
                <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-white/30" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search nodes..."
                  className={cn(
                    'w-full pl-11 pr-10 py-3.5 rounded-xl',
                    'bg-slate-50 dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/[0.12]',
                    'text-slate-900 dark:text-white font-mono text-xs placeholder:text-slate-400 dark:placeholder:text-white/25',
                    'focus:outline-none focus:ring-2 focus:ring-vision-cyan/30 focus:border-vision-cyan/40',
                    'transition-all duration-200 backdrop-blur-sm',
                    'shadow-[0_0_0_0_rgba(34,211,238,0)] focus:shadow-[0_0_20px_rgba(34,211,238,0.15)]'
                  )}
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                    aria-label="Clear search"
                  >
                    <Icons.Clear className="h-3.5 w-3.5 text-slate-400 dark:text-white/30" />
                  </button>
                )}
              </div>
              <span className="block text-[8px] font-mono font-black text-slate-300 dark:text-white/15 mt-2 pl-1 uppercase tracking-[0.3em]">
                Filter by name, category, or keyword
              </span>
            </motion.div>
          </div>

          {/* Bottom status bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-between pt-4 border-t border-slate-200/60 dark:border-white/[0.08]"
          >
            <div className="flex items-center gap-4 text-[9px] font-mono tracking-[0.3em] text-slate-400 dark:text-white/20 uppercase">
              <span className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                ARSENAL ONLINE
              </span>
              <span>CLEARANCE: SIGMA</span>
            </div>
            <div className="text-[9px] font-mono tracking-[0.3em] text-slate-400 dark:text-white/20 uppercase">
              {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase()}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
});

/**
 * Category Filter Pills
 */
const CategoryFilters = memo(function CategoryFilters({
  categories,
  selectedCategory,
  onSelectCategory,
  skillCounts,
}: {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  skillCounts: Record<string, number>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="flex flex-wrap justify-center gap-2 mb-8"
    >
      {categories.map((category, index) => {
        const isSelected = selectedCategory === category;
        const count = category === 'All' ? skillCounts['All'] : skillCounts[category] || 0;

        return (
          <motion.button
            key={category}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
            onClick={() => onSelectCategory(category)}
            className={cn(
              'inline-flex items-center gap-2 px-5 py-2.5 rounded-full',
              'text-xs font-mono font-black tracking-[0.2em] uppercase transition-all duration-300',
              'border',
              isSelected
                ? 'bg-vision-cyan/10 text-vision-cyan border-vision-cyan/40 shadow-lg shadow-vision-cyan/10'
                : 'glassmorphism text-slate-500 dark:text-text-dark/40 border-slate-200 dark:border-white/10 hover:border-vision-cyan/30 hover:text-vision-cyan'
            )}
          >
            {category}
            <span
              className={cn(
                'px-2 py-0.5 rounded-full text-xs',
                isSelected ? 'bg-white/20' : 'bg-muted-foreground/20'
              )}
            >
              {count}
            </span>
          </motion.button>
        );
      })}
    </motion.div>
  );
});

/**
 * Sort Dropdown
 */
const SortDropdown = memo(function SortDropdown({
  sortBy,
  onSortChange,
}: {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const options: { value: SortOption; label: string }[] = [
    { value: 'proficiency', label: 'Proficiency (High to Low)' },
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'experience', label: 'Experience (Years)' },
  ];

  const selectedLabel = options.find((o) => o.value === sortBy)?.label || 'Sort by';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'inline-flex items-center gap-2 px-5 py-2.5 rounded-full',
          'glassmorphism border border-slate-200 dark:border-white/10 text-xs font-mono font-black uppercase tracking-[0.2em]',
          'text-slate-500 dark:text-text-dark/40 hover:border-vision-cyan/30 hover:text-vision-cyan transition-all duration-300'
        )}
      >
        <Icons.Sort className="h-4 w-4" />
        {selectedLabel}
        <Icons.ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={cn(
                'absolute right-0 top-full mt-2 z-50',
                'w-56 rounded-2xl glassmorphism border border-slate-200 dark:border-white/10 shadow-xl overflow-hidden'
              )}
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onSortChange(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full px-4 py-2.5 text-left text-sm',
                    'hover:bg-muted transition-colors',
                    'first:rounded-t-lg last:rounded-b-lg',
                    sortBy === option.value && 'text-primary font-medium bg-primary/5'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
});

/**
 * Animated Proficiency Bar
 */
const ProficiencyBar = memo(function ProficiencyBar({
  proficiency,
  delay = 0,
}: {
  proficiency: number;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div ref={ref} className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={isInView ? { width: `${proficiency}%` } : { width: 0 }}
        transition={{ duration: 1, delay, ease: 'easeOut' }}
        className={cn(
          'h-full rounded-full bg-gradient-to-r',
          getGradientByProficiency(proficiency)
        )}
      />
    </div>
  );
});

/**
 * Skill Card Component
 */
const SkillCard = memo(function SkillCard({
  skill,
  index,
  onProjectsClick,
}: {
  skill: Skill;
  index: number;
  onProjectsClick: (skillName: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const handleCardMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty('--card-glow-x', `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty('--card-glow-y', `${e.clientY - rect.top}px`);
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: (index % 12) * 0.05 }}
    >
      {/* Outer wrapper — border beam container */}
      <div
        ref={cardRef}
        onMouseMove={handleCardMouseMove}
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'group/card relative rounded-2xl cursor-pointer hover:z-30',
          'transition-shadow duration-500',
          'hover:shadow-[0_0_50px_rgba(34,211,238,0.2),_0_0_100px_rgba(34,211,238,0.08)]'
        )}
      >
        {/* ── Rotating Border Beam ── */}
        {/* Outer glow frame: conic gradient that spins, masked to border only */}
        <div className="absolute -inset-[1px] rounded-2xl overflow-hidden opacity-0 group-hover/card:opacity-100 transition-opacity duration-500">
          {/* The spinning gradient background */}
          <div
            className="absolute inset-0 animate-spin-slow"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0%, rgba(34,211,238,1) 10%, transparent 20%, transparent 40%, rgba(225,29,72,1) 50%, transparent 60%, transparent 80%, rgba(251,146,60,1) 90%, transparent 100%)',
            }}
          />
          {/* Inner cutout — leaves only the border visible */}
          <div className="absolute inset-[1.5px] rounded-[calc(1rem-1.5px)] bg-white dark:bg-space-black" />
        </div>

        {/* Beam dot — a bright spot traveling along the border path */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div
            className="absolute h-[8px] w-[80px] animate-border-beam"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(34,211,238,1), transparent)',
              offsetPath: `rect(0 100% 100% 0 round 16px)`,
              boxShadow: '0 0 40px 10px rgba(34,211,238,0.9), 0 0 80px 20px rgba(34,211,238,0.4)',
              filter: 'blur(0.3px)',
            }}
          />
          <div
            className="absolute h-[10px] w-[60px] animate-border-beam"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(225,29,72,1), transparent)',
              offsetPath: `rect(0 100% 100% 0 round 16px)`,
              animationDelay: '-1.5s',
              animationDuration: '4s',
              boxShadow: '0 0 35px 8px rgba(225,29,72,0.8), 0 0 70px 16px rgba(225,29,72,0.35)',
              filter: 'blur(0.3px)',
            }}
          />
        </div>

        {/* ── Card Body ── */}
        <div
          className={cn(
            'relative p-5 rounded-2xl border overflow-hidden transition-all duration-500',
            'bg-white dark:bg-space-black/90 border-slate-200/60 dark:border-white/[0.06]',
            'group-hover/card:border-transparent group-hover/card:bg-white dark:group-hover/card:bg-space-black'
          )}
        >
          {/* Mouse-following glow inside card */}
          <div
            className="absolute w-[250px] h-[250px] rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
            style={{
              background: 'radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)',
              left: 'var(--card-glow-x, 50%)',
              top: 'var(--card-glow-y, 50%)',
              transform: 'translate(-50%, -50%)',
            }}
          />

          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {/* Icon with glow */}
                <div className="relative">
                  <div className="absolute inset-0 rounded-xl bg-vision-cyan/0 group-hover/card:bg-vision-cyan/10 blur-xl transition-all duration-500" />
                  <div className="relative">
                    <SkillIcon skill={skill} size="lg" />
                  </div>
                </div>
                {/* Name & Category */}
                <div>
                  <h3 className="text-lg font-display font-black text-slate-900 dark:text-text-dark tracking-tighter uppercase italic group-hover/card:text-vision-cyan transition-colors duration-300">
                    {skill.name}
                  </h3>
                  <span className="text-[9px] font-mono font-black text-slate-400 dark:text-text-dark/20 uppercase tracking-[0.4em]">
                    {skill.category}
                  </span>
                </div>
              </div>
              {/* Expand Indicator */}
              <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
                <Icons.ChevronRight className="h-4 w-4 text-slate-300 dark:text-text-dark/20 group-hover/card:text-vision-cyan/60 transition-colors" />
              </motion.div>
            </div>

            {/* Proficiency */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={cn(
                    'text-[10px] font-mono font-black uppercase tracking-widest',
                    getProficiencyColor(skill.proficiency)
                  )}
                >
                  {getProficiencyLevel(skill.proficiency)}
                </span>
                <span className="text-[10px] font-mono font-black text-vision-cyan">
                  {skill.proficiency}%
                </span>
              </div>
              <ProficiencyBar proficiency={skill.proficiency} delay={(index % 12) * 0.05} />
            </div>

            {/* Stats Row */}
            <div className="flex justify-between text-[9px] font-mono font-black uppercase tracking-widest text-slate-500 dark:text-text-dark/30">
              <div className="flex items-center gap-1.5">
                <Icons.Clock className="h-3 w-3 text-vision-cyan/60" />
                <span>{skill.yearsOfExperience}Y Experience</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onProjectsClick(skill.name);
                }}
                className="flex items-center gap-1.5 text-vision-crimson hover:text-vision-cyan transition-colors"
              >
                <Icons.Briefcase className="h-3 w-3" />
                <span>{skill.projectCount} Missions</span>
                <Icons.ExternalLink className="h-3 w-3" />
              </button>
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 mt-4 border-t border-slate-200/60 dark:border-white/5">
                    {skill.description && (
                      <p className="text-xs font-bold leading-relaxed text-slate-600 dark:text-text-dark/50 mb-3">
                        {skill.description}
                      </p>
                    )}
                    {skill.relatedSkills && skill.relatedSkills.length > 0 && (
                      <div>
                        <p className="text-[8px] font-mono font-black text-slate-400 dark:text-text-dark/30 uppercase tracking-[0.4em] mb-2">
                          Related_Skills
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {skill.relatedSkills.map((related) => (
                            <span
                              key={related}
                              className="px-2.5 py-0.5 bg-vision-cyan/5 border border-vision-cyan/15 rounded-lg text-[8px] font-mono font-black text-vision-cyan uppercase"
                            >
                              {related}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

/**
 * Category Section with Skills Grid
 */
const CategorySection = memo(function CategorySection({
  category,
  skills,
  isExpanded,
  onToggle,
  onProjectsClick,
}: {
  category: string;
  skills: Skill[];
  isExpanded: boolean;
  onToggle: () => void;
  onProjectsClick: (skillName: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5 }}
      className="mb-16"
    >
      {/* Category Header */}
      <button
        onClick={onToggle}
        className={cn(
          'w-full flex items-center justify-between',
          'p-5 rounded-2xl mb-6',
          'bg-white dark:bg-white/[0.03] glassmorphism border border-slate-200/80 dark:border-white/10 hover:border-vision-cyan/30',
          'transition-all duration-300'
        )}
      >
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-display font-black text-slate-900 dark:text-text-dark uppercase tracking-tight">
            {category}
          </h2>
          <span className="px-3 py-1 rounded-full bg-vision-cyan/10 text-vision-cyan text-[10px] font-mono font-black tracking-[0.2em] uppercase">
            {skills.length} skills
          </span>
        </div>
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <Icons.ChevronDown className="h-5 w-5 text-slate-400 dark:text-text-dark/30" />
        </motion.div>
      </button>

      {/* Skills Grid */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {skills.map((skill, index) => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  index={index}
                  onProjectsClick={onProjectsClick}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
});

/**
 * Loading Skeleton
 */
const SkeletonCard = memo(function SkeletonCard() {
  return (
    <div className="p-5 rounded-xl bg-card/50 border border-border/50 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-12 w-12 rounded-xl bg-muted" />
        <div className="flex-1">
          <div className="h-4 w-24 bg-muted rounded mb-2" />
          <div className="h-3 w-16 bg-muted rounded" />
        </div>
      </div>
      <div className="h-2 w-full bg-muted rounded-full mb-3" />
      <div className="flex gap-4">
        <div className="h-3 w-16 bg-muted rounded" />
        <div className="h-3 w-20 bg-muted rounded" />
      </div>
    </div>
  );
});

const LoadingSkeleton = memo(function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      {[1, 2, 3].map((section) => (
        <div key={section}>
          <div className="h-14 bg-muted/30 rounded-xl mb-4 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((card) => (
              <SkeletonCard key={card} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
});

/**
 * Empty State
 */
const EmptyState = memo(function EmptyState({
  searchQuery,
  onClear,
}: {
  searchQuery: string;
  onClear: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted/50 mb-4">
        <Icons.Search className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No skills found</h3>
      <p className="text-muted-foreground mb-4">No skills match &ldquo;{searchQuery}&rdquo;</p>
      <button
        onClick={onClear}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Clear search
      </button>
    </motion.div>
  );
});

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function SkillsPage() {
  const router = useRouter();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('proficiency');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // GraphQL Query (with fallback to mock data)
  const { skills, loading } = useSkills({
    limit: 100,
    sort: { field: 'PROFICIENCY', order: 'DESC' },
  });

  // Use GraphQL data or fallback to mock
  const allSkills: Skill[] = useMemo(() => {
    if (skills.length) {
      return skills;
    }
    return MOCK_SKILLS;
  }, [skills]);

  const categories = useMemo(() => {
    const base = [...CATEGORIES];
    const extra = Array.from(
      new Set(allSkills.map((skill) => resolveCategoryLabel(skill.category, CATEGORIES)))
    ).filter((cat) => !base.includes(cat) && cat !== 'All');
    return [...base, ...extra];
  }, [allSkills]);

  useEffect(() => {
    if (categories.length) {
      setExpandedCategories(new Set(categories.filter((cat) => cat !== 'All')));
    }
  }, [categories]);

  useEffect(() => {
    if (!categories.includes(selectedCategory)) {
      setSelectedCategory('All');
    }
  }, [categories, selectedCategory]);

  // Calculate skill counts per category
  const skillCounts = useMemo(() => {
    const counts: Record<string, number> = { All: allSkills.length };
    categories
      .filter((category) => category !== 'All')
      .forEach((category) => {
        counts[category] = allSkills.filter((skill) =>
          matchesCategory(skill.category, category)
        ).length;
      });
    return counts;
  }, [allSkills, categories]);

  // Filter and sort skills
  const filteredSkills = useMemo(() => {
    let result = [...allSkills];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (skill) =>
          skill.name.toLowerCase().includes(query) ||
          skill.category.toLowerCase().includes(query) ||
          skill.description?.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter((skill) => matchesCategory(skill.category, selectedCategory));
    }

    // Sort
    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'experience':
        result.sort((a, b) => b.yearsOfExperience - a.yearsOfExperience);
        break;
      case 'proficiency':
      default:
        result.sort((a, b) => b.proficiency - a.proficiency);
    }

    return result;
  }, [allSkills, searchQuery, selectedCategory, sortBy]);

  // Group skills by category
  const skillsByCategory = useMemo(() => {
    const grouped: Record<string, Skill[]> = {};
    filteredSkills.forEach((skill) => {
      const label = resolveCategoryLabel(skill.category, categories);
      if (!grouped[label]) {
        grouped[label] = [];
      }
      grouped[label].push(skill);
    });

    // Return in a consistent order
    return categories
      .filter((cat) => cat !== 'All')
      .filter((cat) => grouped[cat]?.length > 0)
      .map((category) => ({
        category,
        skills: grouped[category] || [],
      }));
  }, [filteredSkills, categories]);

  // Toggle category expansion
  const toggleCategory = useCallback((category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }, []);

  // Handle projects click
  const handleProjectsClick = useCallback(
    (skillName: string) => {
      router.push(`/projects?skill=${encodeURIComponent(skillName)}`);
    },
    [router]
  );

  // Expand all when filtering
  useEffect(() => {
    if (searchQuery || selectedCategory !== 'All') {
      setExpandedCategories(new Set(categories.filter((cat) => cat !== 'All')));
    }
  }, [searchQuery, selectedCategory, categories]);

  return (
    <main className="relative min-h-screen bg-stone-50 dark:bg-space-black text-text-light dark:text-text-dark overflow-hidden transition-colors duration-1000">
      <PageStarfield density={70} />
      <div className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Back Button */}
          <div className="mb-8">
            <BackButton />
          </div>

          {/* Hero Section */}
          <HeroSection
            totalSkills={allSkills.length}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* Category Filters */}
          <CategoryFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            skillCounts={skillCounts}
          />

          {/* Sort & Results Info */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filteredSkills.length}</span>{' '}
              {filteredSkills.length === 1 ? 'skill' : 'skills'}
              {selectedCategory !== 'All' && ` in ${selectedCategory}`}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
            <SortDropdown sortBy={sortBy} onSortChange={setSortBy} />
          </div>

          {/* Content */}
          {loading ? (
            <LoadingSkeleton />
          ) : filteredSkills.length === 0 ? (
            <EmptyState searchQuery={searchQuery} onClear={() => setSearchQuery('')} />
          ) : (
            <div className="space-y-12">
              {skillsByCategory.map(({ category, skills }) => (
                <CategorySection
                  key={category}
                  category={category}
                  skills={skills}
                  isExpanded={expandedCategories.has(category)}
                  onToggle={() => toggleCategory(category)}
                  onProjectsClick={handleProjectsClick}
                />
              ))}
            </div>
          )}

          {/* Footer Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-16 text-center"
          >
            <div className="inline-flex flex-wrap justify-center gap-6 p-8 rounded-[2rem] glassmorphism border border-slate-200 dark:border-white/10">
              <div className="text-center px-4">
                <p className="text-3xl font-display font-black text-vision-cyan">
                  {allSkills.length}+
                </p>
                <p className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-slate-400 dark:text-text-dark/30">
                  Technologies
                </p>
              </div>
              <div className="h-12 w-px bg-slate-200 dark:bg-white/10 hidden sm:block" />
              <div className="text-center px-4">
                <p className="text-3xl font-display font-black text-vision-cyan">
                  {Math.max(...allSkills.map((s) => s.yearsOfExperience))}+
                </p>
                <p className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-slate-400 dark:text-text-dark/30">
                  Years Experience
                </p>
              </div>
              <div className="h-12 w-px bg-slate-200 dark:bg-white/10 hidden sm:block" />
              <div className="text-center px-4">
                <p className="text-3xl font-display font-black text-vision-cyan">
                  {allSkills.reduce((sum, s) => sum + s.projectCount, 0)}+
                </p>
                <p className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-slate-400 dark:text-text-dark/30">
                  Total Projects
                </p>
              </div>
              <div className="h-12 w-px bg-slate-200 dark:bg-white/10 hidden sm:block" />
              <div className="text-center px-4">
                <p className="text-3xl font-display font-black text-vision-cyan">
                  {categories.filter((cat) => cat !== 'All').length}
                </p>
                <p className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-slate-400 dark:text-text-dark/30">
                  Categories
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

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
        'group relative inline-flex items-center gap-3 px-5 py-2.5 rounded-xl overflow-hidden',
        'text-[10px] font-mono font-black uppercase tracking-[0.3em]',
        'text-slate-500 dark:text-white/40 hover:text-vision-cyan',
        'backdrop-blur-md',
        'bg-white/60 dark:bg-white/[0.04]',
        'border border-slate-200/70 dark:border-white/[0.08]',
        'hover:border-vision-cyan/40 dark:hover:border-vision-cyan/30',
        'shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_2px_10px_rgba(0,0,0,0.06)]',
        'dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_0_16px_rgba(0,200,232,0.06)]',
        'hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_0_24px_rgba(0,200,232,0.15)]',
        'dark:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_28px_rgba(0,200,232,0.18)]',
        'transition-all duration-300'
      )}
    >
      {/* Corner brackets */}
      <span className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t border-l border-slate-300/50 dark:border-white/[0.08] group-hover:border-vision-cyan/50 transition-colors duration-300" />
      <span className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b border-r border-slate-300/50 dark:border-white/[0.08] group-hover:border-vision-cyan/50 transition-colors duration-300" />
      {/* Hover glow sweep */}
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none bg-gradient-to-r from-transparent via-vision-cyan/[0.08] to-transparent" />
      <Icons.ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1.5" />
      <span>Back to Core</span>
      <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-white/15 group-hover:bg-vision-cyan group-hover:shadow-[0_0_6px_rgba(0,200,232,0.7)] transition-all duration-300" />
    </Link>
  );
});

// ============================================================================
// SCRAMBLE TEXT — Letter-decode animation on viewport entry
// ============================================================================

const ScrambleText = memo(function ScrambleText({
  text,
  trigger,
  className,
  delay = 0,
}: {
  text: string;
  trigger: boolean;
  className?: string;
  delay?: number;
}) {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·■▲●/';
  const [display, setDisplay] = useState(text);
  const iterRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!trigger) return;
    iterRef.current = 0;
    timerRef.current = setTimeout(() => {
      const interval = setInterval(() => {
        iterRef.current += 0.45;
        setDisplay(
          text
            .split('')
            .map((char, i) => {
              if (i < iterRef.current) return char;
              if (char === ' ' || char === '/' || char === '.' || char === ':') return char;
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join('')
        );
        if (iterRef.current >= text.length) clearInterval(interval);
      }, 38);
      return () => clearInterval(interval);
    }, delay);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [trigger, text, delay]);

  return <span className={className}>{display}</span>;
});

// ============================================================================
// SCAN RETICLE — Tactical targeting overlay
// ============================================================================

const ScanReticle = memo(function ScanReticle() {
  return (
    <div className="pointer-events-none flex items-center justify-center">
      <div className="relative w-48 h-48 opacity-75 dark:opacity-35">
        {/* ── Ambient glow backdrop ── */}
        <div
          className="absolute inset-0 rounded-full animate-pulse"
          style={{
            background:
              'radial-gradient(circle, rgba(0,200,232,0.18) 0%, rgba(0,200,232,0.06) 40%, transparent 68%)',
            animationDuration: '3.5s',
            filter: 'blur(8px)',
          }}
        />

        {/* ── Radar sweep arm — rotates CW at 4s ── */}
        <svg
          className="absolute inset-0 w-full h-full animate-spin [animation-duration:4s]"
          viewBox="0 0 100 100"
          fill="none"
        >
          <defs>
            <linearGradient
              id="reticleSweep"
              x1="50"
              y1="50"
              x2="50"
              y2="5"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#00C8E8" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#00C8E8" stopOpacity="0.05" />
            </linearGradient>
            <filter id="sweepGlow">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="5"
            stroke="url(#reticleSweep)"
            strokeWidth="1.3"
            filter="url(#sweepGlow)"
          />
        </svg>

        {/* ── Outer dashed ring + cardinal markers — slow CW ── */}
        <svg
          className="absolute inset-0 w-full h-full animate-spin [animation-duration:22s]"
          viewBox="0 0 100 100"
          fill="none"
        >
          <defs>
            <filter id="ringGlow">
              <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle
            cx="50"
            cy="50"
            r="46"
            stroke="#00C8E8"
            strokeWidth="0.7"
            strokeOpacity="0.85"
            strokeDasharray="9 5"
            filter="url(#ringGlow)"
          />
          <rect x="47" y="1" width="6" height="3.5" rx="0.6" fill="#00C8E8" fillOpacity="0.85" />
          <rect x="47" y="95.5" width="6" height="3.5" rx="0.6" fill="#00C8E8" fillOpacity="0.85" />
          <rect x="1" y="47" width="3.5" height="6" rx="0.6" fill="#00C8E8" fillOpacity="0.85" />
          <rect x="95.5" y="47" width="3.5" height="6" rx="0.6" fill="#00C8E8" fillOpacity="0.85" />
        </svg>

        {/* ── Mid dashed ring + 45° diagonal ticks — CCW, crimson ── */}
        <svg
          className="absolute inset-0 w-full h-full animate-spin [animation-duration:13s] [animation-direction:reverse]"
          viewBox="0 0 100 100"
          fill="none"
        >
          <defs>
            <filter id="crimsonGlow">
              <feGaussianBlur in="SourceGraphic" stdDeviation="0.6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle
            cx="50"
            cy="50"
            r="30"
            stroke="#E8204A"
            strokeWidth="0.6"
            strokeOpacity="0.75"
            strokeDasharray="6 4"
            filter="url(#crimsonGlow)"
          />
          <line
            x1="71.2"
            y1="28.8"
            x2="74.7"
            y2="25.3"
            stroke="#E8204A"
            strokeWidth="0.9"
            strokeOpacity="0.75"
          />
          <line
            x1="71.2"
            y1="71.2"
            x2="74.7"
            y2="74.7"
            stroke="#E8204A"
            strokeWidth="0.9"
            strokeOpacity="0.75"
          />
          <line
            x1="28.8"
            y1="28.8"
            x2="25.3"
            y2="25.3"
            stroke="#E8204A"
            strokeWidth="0.9"
            strokeOpacity="0.75"
          />
          <line
            x1="28.8"
            y1="71.2"
            x2="25.3"
            y2="74.7"
            stroke="#E8204A"
            strokeWidth="0.9"
            strokeOpacity="0.75"
          />
        </svg>

        {/* ── Static layer — all fixed elements ── */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" fill="none">
          <defs>
            <filter id="staticGlow">
              <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="centerGlow">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle cx="50" cy="50" r="48" stroke="#00C8E8" strokeWidth="0.25" strokeOpacity="0.22" />
          <circle
            cx="50"
            cy="50"
            r="20"
            stroke="#00C8E8"
            strokeWidth="0.35"
            strokeOpacity="0.45"
            filter="url(#staticGlow)"
          />
          <circle
            cx="50"
            cy="50"
            r="9"
            stroke="#00C8E8"
            strokeWidth="0.30"
            strokeOpacity="0.40"
            filter="url(#staticGlow)"
          />

          {/* 4 cardinal crosshair ticks */}
          <line
            x1="50"
            y1="41"
            x2="50"
            y2="22"
            stroke="#00C8E8"
            strokeWidth="1.1"
            strokeOpacity="0.92"
            filter="url(#staticGlow)"
          />
          <line
            x1="50"
            y1="59"
            x2="50"
            y2="78"
            stroke="#00C8E8"
            strokeWidth="1.1"
            strokeOpacity="0.92"
            filter="url(#staticGlow)"
          />
          <line
            x1="41"
            y1="50"
            x2="22"
            y2="50"
            stroke="#00C8E8"
            strokeWidth="1.1"
            strokeOpacity="0.92"
            filter="url(#staticGlow)"
          />
          <line
            x1="59"
            y1="50"
            x2="78"
            y2="50"
            stroke="#00C8E8"
            strokeWidth="1.1"
            strokeOpacity="0.92"
            filter="url(#staticGlow)"
          />

          {/* Corner brackets */}
          <path d="M13 5 L4 5 L4 13" stroke="#00C8E8" strokeWidth="1.1" strokeOpacity="0.75" />
          <path d="M87 5 L96 5 L96 13" stroke="#00C8E8" strokeWidth="1.1" strokeOpacity="0.75" />
          <path d="M13 95 L4 95 L4 87" stroke="#00C8E8" strokeWidth="1.1" strokeOpacity="0.75" />
          <path d="M87 95 L96 95 L96 87" stroke="#00C8E8" strokeWidth="1.1" strokeOpacity="0.75" />

          {/* Compass labels */}
          <text
            x="50"
            y="19.5"
            textAnchor="middle"
            fontSize="4.2"
            fill="#00C8E8"
            fillOpacity="0.65"
            fontFamily="monospace"
          >
            N
          </text>
          <text
            x="50"
            y="85"
            textAnchor="middle"
            fontSize="4.2"
            fill="#00C8E8"
            fillOpacity="0.65"
            fontFamily="monospace"
          >
            S
          </text>
          <text
            x="17"
            y="52"
            textAnchor="middle"
            fontSize="4.2"
            fill="#00C8E8"
            fillOpacity="0.65"
            fontFamily="monospace"
          >
            W
          </text>
          <text
            x="83"
            y="52"
            textAnchor="middle"
            fontSize="4.2"
            fill="#00C8E8"
            fillOpacity="0.65"
            fontFamily="monospace"
          >
            E
          </text>

          {/* Center filled dot — glowing core */}
          <circle
            cx="50"
            cy="50"
            r="4.5"
            fill="#00C8E8"
            fillOpacity="0.20"
            filter="url(#centerGlow)"
          />
          <circle cx="50" cy="50" r="3" fill="#00C8E8" fillOpacity="0.95" />
          <circle cx="49.1" cy="49.1" r="1.1" fill="white" fillOpacity="0.95" />
        </svg>

        {/* ── Ping pulse — outerward ring expand ── */}
        <div
          className="absolute rounded-full border border-vision-cyan/50 animate-ping"
          style={{ width: '36%', height: '36%', top: '32%', left: '32%', animationDuration: '3s' }}
        />
        {/* ── Second ping — wider, slower ── */}
        <div
          className="absolute rounded-full border border-vision-cyan/25 animate-ping"
          style={{
            width: '60%',
            height: '60%',
            top: '20%',
            left: '20%',
            animationDuration: '4.5s',
            animationDelay: '1s',
          }}
        />
      </div>
    </div>
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

  // Animated count — ease-out cubic like home page
  const [animatedCount, setAnimatedCount] = useState(0);
  useEffect(() => {
    if (!isInView || totalSkills === 0) return;
    const duration = 1800;
    const startTime = performance.now();
    let cancelled = false;

    function tick(now: number) {
      if (cancelled) return;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedCount(Math.round(eased * totalSkills));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    return () => {
      cancelled = true;
    };
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
                'linear-gradient(rgba(var(--glow-cyan),0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--glow-cyan),0.3) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
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

        {/* Light mode background — atmospheric, mirroring dark mode */}
        <div
          className="absolute inset-0 z-0 dark:hidden rounded-[2.5rem] overflow-hidden"
          style={{
            background:
              'linear-gradient(145deg, #eff6ff 0%, #f8faff 30%, #f0fdff 62%, #fff7f0 100%)',
          }}
        >
          {/* Fine dot-grid — echoes the dark scan grid */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(rgba(0,180,220,0.18) 1.2px, transparent 1.2px)',
              backgroundSize: '26px 26px',
            }}
          />
          {/* Cyan bloom — top-right corner */}
          <div className="absolute -top-28 -right-28 w-[420px] h-[420px] rounded-full bg-vision-cyan/10 blur-[100px]" />
          {/* Warm crimson pool — bottom-left */}
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-vision-crimson/[0.07] blur-[80px]" />
          {/* Center orange ambient */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[300px] rounded-full bg-vision-orange/[0.04] blur-[120px]" />
          {/* Top chrome edge */}
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-vision-cyan/40 to-transparent" />
          {/* Brand ring border */}
          <div className="absolute inset-0 rounded-[2.5rem] border border-vision-cyan/12 pointer-events-none" />
        </div>

        {/* Mouse-following glow */}
        <div className="absolute inset-0 pointer-events-none z-[2]">
          <div
            className="absolute w-[500px] h-[500px] rounded-full opacity-0 group-hover/hero:opacity-100 transition-opacity duration-500"
            style={{
              background: 'radial-gradient(circle, rgba(var(--glow-cyan),0.1) 0%, transparent 60%)',
              left: 'var(--glow-x, 50%)',
              top: 'var(--glow-y, 50%)',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>

        {/* Content layer — NO parallax, stable */}
        <div
          className="relative z-10 p-8 md:p-12 flex flex-col justify-between"
          style={{ minHeight: '420px' }}
        >
          {/* Top bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="h-2 w-2 rounded-full bg-vision-cyan animate-pulse shadow-[0_0_12px_rgba(var(--glow-cyan),0.8)]" />
              <ScrambleText
                text="System / Arsenal / Manifest"
                trigger={isInView}
                delay={150}
                className="text-[9px] font-mono font-black text-slate-500 dark:text-white/40 uppercase tracking-[0.5em]"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2"
            >
              {/* NODES chip — glass */}
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-mono backdrop-blur-xl border bg-white/50 dark:bg-white/[0.06] border-white/70 dark:border-vision-cyan/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),inset_0_-1px_0_rgba(0,0,0,0.04),0_2px_12px_rgba(0,0,0,0.07),0_0_16px_rgba(0,200,232,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_20px_rgba(0,200,232,0.12)]">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-500 dark:bg-vision-cyan flex-shrink-0 shadow-[0_0_6px_rgba(0,200,232,0.6)]" />
                <span className="text-[7px] font-black uppercase tracking-[0.32em] text-slate-500 dark:text-white/30">
                  NODES
                </span>
                <span className="h-2.5 w-px bg-slate-200/80 dark:bg-white/[0.12]" />
                <span className="text-[9px] font-black tabular-nums text-sky-600 dark:text-vision-cyan">
                  {animatedCount}
                </span>
              </span>
              {/* CAT chip — glass */}
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-mono backdrop-blur-xl border bg-white/50 dark:bg-white/[0.06] border-white/70 dark:border-vision-orange/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),inset_0_-1px_0_rgba(0,0,0,0.04),0_2px_12px_rgba(0,0,0,0.07),0_0_16px_rgba(255,107,43,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_20px_rgba(255,107,43,0.12)]">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500 dark:bg-vision-orange flex-shrink-0 shadow-[0_0_6px_rgba(255,107,43,0.6)]" />
                <span className="text-[7px] font-black uppercase tracking-[0.32em] text-slate-500 dark:text-white/30">
                  CAT
                </span>
                <span className="h-2.5 w-px bg-slate-200/80 dark:bg-white/[0.12]" />
                <span className="text-[9px] font-black tabular-nums text-orange-600 dark:text-vision-orange">
                  7
                </span>
              </span>
              {/* STATUS chip — glass */}
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-mono backdrop-blur-xl border bg-white/50 dark:bg-white/[0.06] border-white/70 dark:border-emerald-500/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),inset_0_-1px_0_rgba(0,0,0,0.04),0_2px_12px_rgba(0,0,0,0.07),0_0_16px_rgba(52,211,153,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_20px_rgba(52,211,153,0.12)]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 flex-shrink-0 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
                <span className="text-[7px] font-black uppercase tracking-[0.32em] text-slate-500 dark:text-white/30">
                  STATUS
                </span>
                <span className="h-2.5 w-px bg-slate-200/80 dark:bg-white/[0.12]" />
                <span className="text-[9px] font-black tabular-nums text-emerald-600 dark:text-emerald-400">
                  LIVE
                </span>
              </span>
            </motion.div>
          </div>

          {/* Title Row — stable, no parallax */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div className="space-y-4">
              {/* Title — char-stagger blur on "Technical", letter-spacing collapse on "Arsenal." */}
              <div className="text-5xl md:text-6xl lg:text-7xl font-display font-black tracking-tighter uppercase italic leading-[0.9] overflow-hidden">
                {/* "Technical" — each character blurs in from below, staggered */}
                <div className="block text-slate-900 dark:text-white" aria-label="Technical">
                  {'Technical'.split('').map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 56, filter: 'blur(16px)' }}
                      animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
                      transition={{
                        delay: 0.15 + i * 0.08,
                        duration: 0.7,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>
                {/* "Arsenal." — wide letter-spacing collapses + blur clears + gradient flows */}
                <motion.span
                  initial={{ opacity: 0, letterSpacing: '0.5em', filter: 'blur(28px)' }}
                  animate={
                    isInView ? { opacity: 1, letterSpacing: '-0.02em', filter: 'blur(0px)' } : {}
                  }
                  transition={{ delay: 1.1, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                  className="block text-transparent bg-clip-text bg-gradient-to-r from-vision-crimson via-vision-orange to-vision-cyan animate-gradient-x"
                  style={{ backgroundSize: '200% 100%' }}
                >
                  Arsenal.
                </motion.span>
              </div>

              {/* Typing terminal line */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 1.5 }}
                className="font-mono text-xs text-vision-cyan/60 dark:text-vision-cyan/80 h-5"
              >
                {typedText}
                <span className="inline-block w-[2px] h-3.5 bg-vision-cyan ml-0.5 animate-pulse" />
              </motion.div>

              {/* Description — word-by-word blur fade stagger */}
              <motion.p className="text-sm font-bold text-slate-500 dark:text-white/40 max-w-lg leading-relaxed">
                {[
                  'Full-spectrum',
                  'engineering',
                  'skillset',
                  'spanning',
                  'frontend,',
                  'backend,',
                  'databases,',
                  'DevOps,',
                  'and',
                  'beyond.',
                  'Each',
                  'node',
                  'represents',
                  'hands-on',
                  'deployment',
                  'experience.',
                ].map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, filter: 'blur(10px)', y: 10 }}
                    animate={isInView ? { opacity: 1, filter: 'blur(0px)', y: 0 } : {}}
                    transition={{ delay: 1.7 + i * 0.07, duration: 0.55, ease: 'easeOut' }}
                    className="inline-block mr-[0.27em]"
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.p>
            </div>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.35 }}
              className="w-full lg:w-80 shrink-0 flex flex-col items-stretch gap-3"
            >
              {/* Reticle — centered between chips and search */}
              <ScanReticle />
              {/* Search */}
              <div>
                <div className="relative">
                  <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-white/30" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search skills..."
                    className={cn(
                      'w-full pl-11 pr-10 py-3.5 rounded-xl',
                      'bg-slate-50 dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/[0.12]',
                      'text-slate-900 dark:text-white font-mono text-xs placeholder:text-slate-400 dark:placeholder:text-white/25',
                      'focus:outline-none focus:ring-2 focus:ring-vision-cyan/30 focus:border-vision-cyan/40',
                      'transition-all duration-200 backdrop-blur-sm',
                      'shadow-[0_0_0_0_rgba(var(--glow-cyan),0)] focus:shadow-[0_0_20px_rgba(var(--glow-cyan),0.15)]'
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
                <span className="block text-[8px] font-mono font-black text-slate-400 dark:text-white/30 mt-2 pl-1 uppercase tracking-[0.3em]">
                  Filter by name, category, or keyword
                </span>
              </div>
            </motion.div>
          </div>

          {/* Bottom status bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-between pt-4 border-t border-slate-200/60 dark:border-white/[0.08]"
          >
            <div className="flex items-center gap-4 text-[9px] font-mono tracking-[0.3em] text-slate-500 dark:text-white/50 uppercase">
              <span className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                ARSENAL ONLINE
              </span>
              <span>CLEARANCE: SIGMA</span>
            </div>
            <div className="text-[9px] font-mono tracking-[0.3em] text-slate-500 dark:text-white/50 uppercase">
              {new Date()
                .toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                .toUpperCase()}
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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.4 }}
      className="mb-6"
    >
      {/* HUD label row */}
      <div className="flex items-center gap-3 mb-3 pl-1">
        <div className="h-px flex-1 bg-gradient-to-r from-vision-cyan/20 to-transparent" />
        <span className="text-[8px] font-mono font-black tracking-[0.45em] uppercase text-slate-400 dark:text-white/20">
          Filter by domain
        </span>
        <div className="h-px flex-1 bg-gradient-to-l from-vision-cyan/20 to-transparent" />
      </div>

      {/* Pills */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((category, index) => {
          const isSelected = selectedCategory === category;
          const count = category === 'All' ? skillCounts['All'] : skillCounts[category] || 0;

          return (
            <motion.button
              key={category}
              initial={{ opacity: 0, scale: 0.88, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.45 + index * 0.04, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelectCategory(category)}
              className={cn(
                'relative inline-flex items-center gap-2 px-4 py-2 rounded-full',
                'text-[10px] font-mono font-black tracking-[0.18em] uppercase transition-all duration-250',
                'border backdrop-blur-sm overflow-hidden',
                isSelected
                  ? 'bg-vision-cyan/10 dark:bg-vision-cyan/[0.12] text-vision-cyan border-vision-cyan/40 shadow-[0_0_18px_rgba(var(--glow-cyan),0.18),inset_0_1px_0_rgba(255,255,255,0.12)]'
                  : 'bg-white/50 dark:bg-white/[0.04] text-slate-500 dark:text-white/35 border-slate-200/70 dark:border-white/[0.08] hover:border-vision-cyan/30 hover:text-vision-cyan hover:bg-vision-cyan/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]'
              )}
            >
              {/* Selected: animated sweep highlight */}
              {isSelected && (
                <motion.span
                  layoutId="filter-active-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-vision-cyan/[0.08] via-vision-cyan/[0.15] to-vision-cyan/[0.08]"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className="relative z-10">{category}</span>
              <span
                className={cn(
                  'relative z-10 px-1.5 py-0.5 rounded-full text-[8px] font-black tabular-nums transition-all duration-250',
                  isSelected
                    ? 'bg-vision-cyan/25 text-vision-cyan'
                    : 'bg-slate-100/80 dark:bg-white/[0.07] text-slate-400 dark:text-white/25'
                )}
              >
                {count}
              </span>
            </motion.button>
          );
        })}
      </div>
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

  const options: { value: SortOption; label: string; icon: string }[] = [
    { value: 'proficiency', label: 'Proficiency', icon: '▲' },
    { value: 'name', label: 'Name A–Z', icon: '⌥' },
    { value: 'experience', label: 'Experience', icon: '◈' },
  ];

  const selected = options.find((o) => o.value === sortBy) ?? options[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'inline-flex items-center gap-2.5 px-4 py-2 rounded-xl',
          'bg-white/60 dark:bg-white/[0.04] backdrop-blur-sm',
          'border border-slate-200/70 dark:border-white/[0.08]',
          'text-[10px] font-mono font-black uppercase tracking-[0.2em]',
          'text-slate-500 dark:text-white/35 hover:text-vision-cyan hover:border-vision-cyan/30',
          'shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]',
          'transition-all duration-200',
          isOpen && 'border-vision-cyan/30 text-vision-cyan'
        )}
      >
        <Icons.Sort className="h-3.5 w-3.5" />
        <span className="text-slate-300 dark:text-white/15 font-mono">{selected.icon}</span>
        {selected.label}
        <Icons.ChevronDown
          className={cn('h-3.5 w-3.5 transition-transform duration-200', isOpen && 'rotate-180')}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                'absolute right-0 top-full mt-2 z-50 w-48',
                'rounded-xl overflow-hidden',
                'bg-white/80 dark:bg-[#0a0d16]/90 backdrop-blur-xl',
                'border border-slate-200/70 dark:border-white/[0.09]',
                'shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.6)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]'
              )}
            >
              {/* Header */}
              <div className="px-3 py-2 border-b border-slate-100/80 dark:border-white/[0.06]">
                <span className="text-[7px] font-mono font-black tracking-[0.4em] uppercase text-slate-400 dark:text-white/20">
                  Sort order
                </span>
              </div>
              {options.map((option) => {
                const isActive = sortBy === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      onSortChange(option.value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors duration-150',
                      isActive
                        ? 'bg-vision-cyan/[0.08] dark:bg-vision-cyan/[0.10]'
                        : 'hover:bg-slate-50/80 dark:hover:bg-white/[0.04]'
                    )}
                  >
                    <span
                      className={cn(
                        'text-[11px] w-4 text-center font-mono',
                        isActive ? 'text-vision-cyan' : 'text-slate-300 dark:text-white/15'
                      )}
                    >
                      {option.icon}
                    </span>
                    <span
                      className={cn(
                        'text-[10px] font-mono font-black tracking-[0.15em] uppercase',
                        isActive ? 'text-vision-cyan' : 'text-slate-500 dark:text-white/35'
                      )}
                    >
                      {option.label}
                    </span>
                    {isActive && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-vision-cyan shadow-[0_0_6px_rgba(var(--glow-cyan),0.8)]" />
                    )}
                  </button>
                );
              })}
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
  color,
  delay = 0,
}: {
  proficiency: number;
  color?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div
      ref={ref}
      className="w-full h-1.5 bg-slate-100 dark:bg-white/[0.06] rounded-full overflow-hidden"
    >
      <motion.div
        initial={{ width: 0 }}
        animate={isInView ? { width: `${proficiency}%` } : { width: 0 }}
        transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
        className="h-full rounded-full"
        style={{
          background: color ? `linear-gradient(to right, ${color}80, ${color})` : undefined,
          boxShadow: color ? `0 0 8px ${color}60` : undefined,
        }}
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
          'hover:shadow-[0_0_50px_rgba(var(--glow-cyan),0.2),_0_0_100px_rgba(var(--glow-cyan),0.08)]'
        )}
      >
        {/* ── Rotating Border Beam ── */}
        {/* Outer glow frame: conic gradient that spins, masked to border only */}
        <div className="absolute -inset-[1px] rounded-2xl overflow-hidden opacity-0 group-hover/card:opacity-100 transition-opacity duration-500">
          {/* The spinning gradient background */}
          <div
            className="absolute inset-0 animate-spin-slow [animation-play-state:paused] group-hover/card:[animation-play-state:running]"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0%, rgba(var(--glow-cyan),1) 10%, transparent 20%, transparent 40%, rgba(var(--glow-crimson),1) 50%, transparent 60%, transparent 80%, rgba(var(--glow-orange),1) 90%, transparent 100%)',
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
              background:
                'linear-gradient(90deg, transparent, rgba(var(--glow-cyan),1), transparent)',
              offsetPath: `rect(0 100% 100% 0 round 16px)`,
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
              offsetPath: `rect(0 100% 100% 0 round 16px)`,
              animationDelay: '-1.5s',
              animationDuration: '4s',
              boxShadow:
                '0 0 35px 8px rgba(var(--glow-crimson),0.8), 0 0 70px 16px rgba(var(--glow-crimson),0.35)',
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
              background:
                'radial-gradient(circle, rgba(var(--glow-cyan),0.08) 0%, transparent 70%)',
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
              <ProficiencyBar
                proficiency={skill.proficiency}
                color={skill.color}
                delay={(index % 12) * 0.05}
              />
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
                <span>{skill.projectCount} Projects</span>
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
 * Per-category color palette (cycles through 7 accents)
 */
const CATEGORY_PALETTE = [
  {
    bar: 'from-sky-400 to-vision-cyan',
    text: 'text-sky-600 dark:text-vision-cyan',
    badge:
      'bg-sky-50 dark:bg-vision-cyan/[0.08] text-sky-600 dark:text-vision-cyan border-sky-200 dark:border-vision-cyan/20',
    glow: '0 0 28px rgba(var(--glow-cyan),0.22)',
  },
  {
    bar: 'from-vision-orange to-amber-400',
    text: 'text-orange-600 dark:text-vision-orange',
    badge:
      'bg-orange-50 dark:bg-vision-orange/[0.08] text-orange-600 dark:text-vision-orange border-orange-200 dark:border-vision-orange/20',
    glow: '0 0 28px rgba(255,107,43,0.22)',
  },
  {
    bar: 'from-violet-500 to-purple-400',
    text: 'text-violet-600 dark:text-violet-400',
    badge:
      'bg-violet-50 dark:bg-violet-500/[0.08] text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-500/20',
    glow: '0 0 28px rgba(139,92,246,0.22)',
  },
  {
    bar: 'from-emerald-500 to-teal-400',
    text: 'text-emerald-600 dark:text-emerald-400',
    badge:
      'bg-emerald-50 dark:bg-emerald-500/[0.08] text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
    glow: '0 0 28px rgba(52,211,153,0.22)',
  },
  {
    bar: 'from-rose-500 to-vision-crimson',
    text: 'text-rose-600 dark:text-vision-crimson',
    badge:
      'bg-rose-50 dark:bg-vision-crimson/[0.08] text-rose-600 dark:text-vision-crimson border-rose-200 dark:border-vision-crimson/20',
    glow: '0 0 28px rgba(var(--glow-crimson),0.22)',
  },
  {
    bar: 'from-amber-500 to-yellow-400',
    text: 'text-amber-600 dark:text-amber-400',
    badge:
      'bg-amber-50 dark:bg-amber-500/[0.08] text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20',
    glow: '0 0 28px rgba(245,158,11,0.22)',
  },
  {
    bar: 'from-pink-500 to-fuchsia-400',
    text: 'text-pink-600 dark:text-pink-400',
    badge:
      'bg-pink-50 dark:bg-pink-500/[0.08] text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-500/20',
    glow: '0 0 28px rgba(236,72,153,0.22)',
  },
] as const;

/**
 * Category Section with Skills Grid
 */
const CategorySection = memo(function CategorySection({
  index,
  category,
  skills,
  isExpanded,
  onToggle,
  onProjectsClick,
}: {
  index: number;
  category: string;
  skills: Skill[];
  isExpanded: boolean;
  onToggle: () => void;
  onProjectsClick: (skillName: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const palette = CATEGORY_PALETTE[index % CATEGORY_PALETTE.length];
  const idx = String(index + 1).padStart(2, '0');

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5 }}
      className="mb-16"
    >
      {/* Category Header */}
      <button onClick={onToggle} className="group w-full text-left mb-6 focus:outline-none">
        {/* Main row */}
        <div
          className={cn(
            'relative flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300',
            'border backdrop-blur-sm',
            isExpanded
              ? 'bg-white/70 dark:bg-white/[0.04] border-transparent'
              : 'bg-white/50 dark:bg-white/[0.025] border-slate-200/60 dark:border-white/[0.07] hover:border-slate-300/80 dark:hover:border-white/[0.12]'
          )}
          style={isExpanded ? { boxShadow: palette.glow, borderColor: 'transparent' } : {}}
        >
          {/* Left accent bar */}
          <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full overflow-hidden">
            <motion.div
              className={`w-full h-full bg-gradient-to-b ${palette.bar}`}
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : {}}
              transition={{ delay: 0.1 + index * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: 'top' }}
            />
          </div>

          {/* Index number */}
          <span
            className={cn(
              'shrink-0 font-mono font-black text-[11px] tabular-nums w-7 text-center',
              isExpanded
                ? palette.text
                : 'text-slate-300 dark:text-white/15 group-hover:text-slate-400 dark:group-hover:text-white/30',
              'transition-colors duration-200'
            )}
          >
            {idx}
          </span>

          {/* Divider pip */}
          <span className="h-4 w-px bg-slate-200/80 dark:bg-white/[0.08] shrink-0" />

          {/* Category name */}
          <h2
            className={cn(
              'flex-1 font-display font-black uppercase italic tracking-tight transition-colors duration-200',
              'text-xl md:text-2xl',
              isExpanded
                ? palette.text
                : 'text-slate-800 dark:text-white/75 group-hover:text-slate-900 dark:group-hover:text-white/90'
            )}
          >
            {category}
          </h2>

          {/* Skill count badge */}
          <span
            className={cn(
              'shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-mono text-[9px] font-black tracking-[0.2em] uppercase backdrop-blur-sm transition-all duration-200',
              isExpanded
                ? palette.badge
                : 'bg-slate-50/80 dark:bg-white/[0.05] text-slate-400 dark:text-white/25 border-slate-200/60 dark:border-white/[0.07]'
            )}
          >
            <span
              className={cn(
                'h-1.5 w-1.5 rounded-full',
                isExpanded ? 'animate-pulse' : 'opacity-40',
                palette.text.split(' ')[0].replace('text-', 'bg-') +
                  ' ' +
                  (palette.text.split(' ')[1]?.replace('text-', 'bg-') ?? '')
              )}
            />
            {skills.length}
          </span>

          {/* Chevron */}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className={cn(
              'shrink-0 transition-colors duration-200',
              isExpanded ? palette.text : 'text-slate-300 dark:text-white/20'
            )}
          >
            <Icons.ChevronDown className="h-4 w-4" />
          </motion.div>
        </div>

        {/* Expanded glow line */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={`h-px bg-gradient-to-r ${palette.bar} mx-5 rounded-full`}
              style={{ transformOrigin: 'left' }}
            />
          )}
        </AnimatePresence>
      </button>

      {/* Skills Grid */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-x-visible"
            style={{ overflow: 'visible' }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pt-2 pb-2">
              {skills.map((skill, skillIdx) => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  index={skillIdx}
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
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center py-20"
    >
      {/* Icon container */}
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-vision-cyan/10 blur-[30px]" />
        <div className="relative flex items-center justify-center h-20 w-20 rounded-[1.5rem] border border-vision-cyan/20 bg-white/60 dark:bg-space-black/60 backdrop-blur-sm">
          <Icons.Search className="h-8 w-8 text-vision-cyan/60" />
        </div>
      </div>
      {/* Mono terminal readout */}
      <p className="text-[9px] font-mono font-black text-slate-300 dark:text-white/20 uppercase tracking-[0.5em] mb-3">
        Search / No_Match
      </p>
      <h3 className="text-2xl font-display font-black italic uppercase tracking-tighter text-slate-800 dark:text-white/80 mb-2">
        No Nodes Found.
      </h3>
      <p className="text-xs font-bold text-slate-400 dark:text-white/30 mb-8">
        Query <span className="font-mono text-vision-crimson">&ldquo;{searchQuery}&rdquo;</span>{' '}
        returned zero results.
      </p>
      <button
        onClick={onClear}
        className="group relative inline-flex items-center gap-2.5 px-6 py-2.5 text-[10px] font-mono font-black uppercase tracking-[0.3em] border border-vision-cyan/30 text-vision-cyan/70 hover:text-vision-cyan hover:border-vision-cyan/60 bg-white/80 dark:bg-space-black/60 hover:shadow-[0_0_20px_rgba(var(--glow-cyan),0.2)] transition-all duration-300"
      >
        <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-vision-cyan/40 group-hover:border-vision-cyan transition-colors" />
        <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-vision-cyan/40 group-hover:border-vision-cyan transition-colors" />
        Clear Search
      </button>
    </motion.div>
  );
});

// ============================================================================
// ANIMATED STAT VALUE — count-up on viewport entry
// ============================================================================

const AnimatedStatValue = memo(function AnimatedStatValue({
  target,
  suffix = '',
  duration = 2200,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let startTime: number | null = null;
    let raf: number;
    function tick(now: number) {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
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
    <main className="relative min-h-screen bg-stone-50 dark:bg-space-black text-text-light dark:text-text-dark overflow-x-hidden transition-colors duration-1000">
      <PageStarfield density={70} />
      <div className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl" style={{ overflow: 'visible' }}>
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
            {/* Result count HUD */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/60 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/[0.07] backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] dark:shadow-none">
                <span className="h-1.5 w-1.5 rounded-full bg-vision-cyan animate-pulse shadow-[0_0_6px_rgba(var(--glow-cyan),0.7)]" />
                <span className="text-[9px] font-mono font-black uppercase tracking-[0.25em] text-slate-400 dark:text-white/25">
                  <span className="text-vision-cyan">{filteredSkills.length}</span> nodes
                </span>
                {selectedCategory !== 'All' && (
                  <>
                    <span className="h-3 w-px bg-slate-200 dark:bg-white/[0.10]" />
                    <span className="text-[9px] font-mono font-black uppercase tracking-[0.2em] text-vision-orange">
                      {selectedCategory}
                    </span>
                  </>
                )}
                {searchQuery && (
                  <>
                    <span className="h-3 w-px bg-slate-200 dark:bg-white/[0.10]" />
                    <span className="text-[9px] font-mono font-black text-vision-crimson">
                      &ldquo;{searchQuery}&rdquo;
                    </span>
                  </>
                )}
              </div>
            </div>
            <SortDropdown sortBy={sortBy} onSortChange={setSortBy} />
          </div>

          {/* Content */}
          {loading ? (
            <LoadingSkeleton />
          ) : filteredSkills.length === 0 ? (
            <EmptyState searchQuery={searchQuery} onClear={() => setSearchQuery('')} />
          ) : (
            <div className="space-y-12">
              {skillsByCategory.map(({ category, skills }, index) => (
                <CategorySection
                  key={category}
                  index={index}
                  category={category}
                  skills={skills}
                  isExpanded={expandedCategories.has(category)}
                  onToggle={() => toggleCategory(category)}
                  onProjectsClick={handleProjectsClick}
                />
              ))}
            </div>
          )}

          {/* Footer Stats — Terminal Readout */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative mt-20"
          >
            {/* Outer atmosphere — glow orbs + stars surrounding the panel */}
            <div
              className="absolute -inset-8 sm:-inset-12 pointer-events-none overflow-hidden"
              aria-hidden
            >
              {/* Large ambient orbs */}
              <div className="absolute -top-20 left-[15%] w-72 h-72 rounded-full bg-vision-cyan/[0.10] dark:bg-vision-cyan/[0.06] blur-[100px]" />
              <div className="absolute -bottom-16 right-[20%] w-64 h-64 rounded-full bg-vision-crimson/[0.08] dark:bg-vision-crimson/[0.04] blur-[90px]" />
              <div className="absolute top-1/3 right-[5%] w-48 h-48 rounded-full bg-vision-orange/[0.07] dark:bg-vision-orange/[0.03] blur-[80px]" />
              {/* Scattered outer star particles */}
              {[
                { x: '2%', y: '8%', s: 2.5, d: 3.2, c: '#00C8E8' },
                { x: '8%', y: '85%', s: 2, d: 4.1, c: '#FF2A6D' },
                { x: '95%', y: '12%', s: 3, d: 2.8, c: '#FF6B2B' },
                { x: '92%', y: '88%', s: 2, d: 3.6, c: '#00C8E8' },
                { x: '50%', y: '2%', s: 2.5, d: 4.5, c: '#FF2A6D' },
                { x: '50%', y: '96%', s: 2, d: 3.0, c: '#FF6B2B' },
                { x: '18%', y: '95%', s: 3, d: 2.4, c: '#00C8E8' },
                { x: '80%', y: '5%', s: 2, d: 3.9, c: '#FF2A6D' },
              ].map((p, i) => (
                <span
                  key={`outer-${i}`}
                  className="absolute rounded-full animate-twinkle"
                  style={{
                    left: p.x,
                    top: p.y,
                    width: `${p.s}px`,
                    height: `${p.s}px`,
                    background: p.c,
                    animationDuration: `${p.d}s`,
                    animationDelay: `${i * 0.35}s`,
                    boxShadow: `0 0 ${p.s * 5}px ${p.c}80, 0 0 ${p.s * 10}px ${p.c}30`,
                  }}
                />
              ))}
            </div>

            {/* Section label */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />
              <span className="text-[8px] font-mono font-black text-slate-300 dark:text-white/20 uppercase tracking-[0.6em] shrink-0">
                Arsenal_Overview // compiled
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-slate-200 dark:via-white/10 to-transparent" />
            </div>

            {/* Stats panel */}
            <div className="relative rounded-[2rem] overflow-hidden border border-slate-200/80 dark:border-white/[0.07]">
              {/* Background layers */}
              <div className="absolute inset-0 bg-white dark:bg-space-black/95 backdrop-blur-sm" />
              {/* Grid texture */}
              <div
                className="absolute inset-0 opacity-[0.04] dark:opacity-[0.025]"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(var(--glow-cyan),0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--glow-cyan),0.5) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />
              {/* Top edge glow — visible in both modes */}
              <div className="absolute top-0 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-vision-cyan/50 to-transparent" />
              {/* Bottom edge glow */}
              <div className="absolute bottom-0 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-vision-crimson/30 to-transparent" />
              {/* Ambient glow orbs — visible in BOTH modes */}
              <div className="absolute -top-24 left-1/4 w-80 h-80 rounded-full bg-vision-cyan/[0.12] dark:bg-vision-cyan/[0.05] blur-[90px] pointer-events-none" />
              <div className="absolute -bottom-24 right-1/4 w-80 h-80 rounded-full bg-vision-crimson/[0.10] dark:bg-vision-crimson/[0.04] blur-[90px] pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-64 rounded-full bg-vision-orange/[0.06] dark:bg-vision-orange/[0.02] blur-[110px] pointer-events-none" />
              {/* Starry particles — larger, brighter, more */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
                {[
                  { x: '6%', y: '15%', s: 3, d: 2.5, c: '#00C8E8' },
                  { x: '15%', y: '55%', s: 2.5, d: 3.8, c: '#FF6B2B' },
                  { x: '22%', y: '80%', s: 2, d: 2.8, c: '#FF2A6D' },
                  { x: '30%', y: '28%', s: 3.5, d: 4.0, c: '#00C8E8' },
                  { x: '38%', y: '68%', s: 2, d: 3.2, c: '#FF6B2B' },
                  { x: '45%', y: '12%', s: 3, d: 2.2, c: '#FF2A6D' },
                  { x: '52%', y: '85%', s: 2.5, d: 4.5, c: '#00C8E8' },
                  { x: '60%', y: '35%', s: 3, d: 3.0, c: '#FF6B2B' },
                  { x: '68%', y: '72%', s: 2, d: 3.5, c: '#00C8E8' },
                  { x: '75%', y: '20%', s: 3.5, d: 2.6, c: '#FF2A6D' },
                  { x: '82%', y: '58%', s: 2.5, d: 4.2, c: '#FF6B2B' },
                  { x: '90%', y: '40%', s: 3, d: 3.0, c: '#00C8E8' },
                  { x: '95%', y: '78%', s: 2, d: 2.8, c: '#FF2A6D' },
                  { x: '10%', y: '40%', s: 2, d: 5.0, c: '#00C8E8' },
                  { x: '48%', y: '50%', s: 2.5, d: 3.6, c: '#FF6B2B' },
                  { x: '85%', y: '15%', s: 2, d: 4.8, c: '#FF2A6D' },
                ].map((p, i) => (
                  <span
                    key={i}
                    className="absolute rounded-full animate-twinkle"
                    style={{
                      left: p.x,
                      top: p.y,
                      width: `${p.s}px`,
                      height: `${p.s}px`,
                      background: p.c,
                      animationDuration: `${p.d}s`,
                      animationDelay: `${i * 0.22}s`,
                      boxShadow: `0 0 ${p.s * 4}px ${p.c}90, 0 0 ${p.s * 8}px ${p.c}40`,
                    }}
                  />
                ))}
              </div>

              {/* Top bar */}
              <div className="relative z-10 flex items-center justify-between px-6 py-3 border-b border-slate-100/80 dark:border-white/[0.05]">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
                  <span className="text-[8px] font-mono font-black text-slate-400 dark:text-white/25 uppercase tracking-[0.4em]">
                    data_node.manifest :: live
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-vision-cyan/60 animate-pulse" />
                  <span className="text-[8px] font-mono text-slate-300 dark:text-white/15 uppercase tracking-[0.3em]">
                    last_sync:{' '}
                    {new Date()
                      .toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                      .toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Stats grid */}
              <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-slate-100/70 dark:bg-white/[0.04]">
                {[
                  {
                    num: allSkills.length,
                    suffix: '+',
                    label: 'Technologies',
                    sub: 'indexed nodes',
                    hex: '#00F3FF',
                    icon: '◈',
                  },
                  {
                    num: Math.max(...allSkills.map((s) => s.yearsOfExperience)),
                    suffix: '+',
                    label: 'Years Active',
                    sub: 'production experience',
                    hex: '#FF6B2B',
                    icon: '◉',
                  },
                  {
                    num: allSkills.reduce((sum, s) => sum + s.projectCount, 0),
                    suffix: '+',
                    label: 'Deploy Count',
                    sub: 'cumulative projects',
                    hex: '#FF2A6D',
                    icon: '⬡',
                  },
                  {
                    num: categories.filter((cat) => cat !== 'All').length,
                    suffix: '',
                    label: 'Domains',
                    sub: 'specialist categories',
                    hex: '#00F3FF',
                    icon: '▣',
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="group relative flex flex-col items-center justify-center gap-3 p-8 bg-white dark:bg-[#07090f] overflow-hidden transition-all duration-300"
                  >
                    {/* Top accent bar — brand color stripe */}
                    <span
                      className="absolute top-0 inset-x-0 h-[2px] pointer-events-none"
                      style={{
                        background: `linear-gradient(to right, transparent 8%, ${stat.hex}65 38%, ${stat.hex}90 50%, ${stat.hex}65 62%, transparent 92%)`,
                      }}
                    />
                    {/* Hover: brand ambient radial from top */}
                    <span
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: `radial-gradient(ellipse 90% 55% at 50% 0%, ${stat.hex}14 0%, transparent 70%)`,
                      }}
                    />
                    {/* Corner brackets (hover) */}
                    <span
                      className="absolute top-3 left-3 w-3.5 h-3.5 border-t-2 border-l-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                      style={{ borderColor: `${stat.hex}80` }}
                    />
                    <span
                      className="absolute bottom-3 right-3 w-3.5 h-3.5 border-b-2 border-r-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                      style={{ borderColor: `${stat.hex}80` }}
                    />
                    {/* Icon in a glowing jewel container */}
                    <span
                      className="flex items-center justify-center w-10 h-10 rounded-xl text-lg border mb-1 transition-all duration-300 group-hover:scale-110"
                      style={{
                        color: stat.hex,
                        borderColor: `${stat.hex}30`,
                        background: `radial-gradient(circle at 38% 28%, ${stat.hex}22 0%, ${stat.hex}09 100%)`,
                        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.75), 0 0 22px ${stat.hex}20`,
                        textShadow: `0 0 14px ${stat.hex}90`,
                      }}
                    >
                      {stat.icon}
                    </span>
                    {/* Animated count-up value */}
                    <p
                      className="text-4xl sm:text-5xl font-display font-black tracking-tighter leading-none"
                      style={{
                        color: stat.hex,
                        textShadow: `0 0 28px ${stat.hex}44, 0 0 52px ${stat.hex}18`,
                      }}
                    >
                      <AnimatedStatValue target={stat.num} suffix={stat.suffix} />
                    </p>
                    {/* Labels */}
                    <div className="flex flex-col items-center gap-1">
                      <p className="text-[11px] font-display font-black uppercase tracking-[0.18em] text-slate-700 dark:text-white/70">
                        {stat.label}
                      </p>
                      <p className="text-[8px] font-mono font-bold uppercase tracking-[0.3em] text-slate-400 dark:text-white/25">
                        {stat.sub}
                      </p>
                    </div>
                    {/* Animated underline sweep */}
                    <span
                      className="absolute bottom-0 left-1/2 w-0 group-hover:w-3/5 h-px transition-all duration-500 -translate-x-1/2"
                      style={{
                        background: `linear-gradient(to right, transparent, ${stat.hex}70, transparent)`,
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Bottom bar */}
              <div className="relative z-10 flex items-center justify-center gap-6 px-6 py-3 border-t border-slate-100/80 dark:border-white/[0.05]">
                {['Expert: 90%+', 'Advanced: 80%+', 'Proficient: 70%+'].map((tier, i) => {
                  const colors = ['text-emerald-500', 'text-blue-400', 'text-yellow-500'];
                  const dots = ['bg-emerald-400', 'bg-blue-400', 'bg-yellow-400'];
                  return (
                    <div key={tier} className="flex items-center gap-1.5">
                      <div className={`h-1.5 w-1.5 rounded-full ${dots[i]}`} />
                      <span
                        className={`text-[8px] font-mono font-black uppercase tracking-[0.25em] ${colors[i]}`}
                      >
                        {tier}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

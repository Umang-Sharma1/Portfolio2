import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Skills | Technical Arsenal',
  description:
    "Explore 50+ technologies I've mastered across frontend, backend, databases, DevOps, and problem solving. Each skill represents years of hands-on experience.",
  keywords: [
    'React',
    'TypeScript',
    'Node.js',
    'Next.js',
    'GraphQL',
    'MongoDB',
    'Full Stack Developer',
  ],
};

export default function SkillsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects | From College to Production',
  description:
    'Explore 40+ projects spanning full-stack web apps, REST APIs, databases, and more. Built with React, Next.js, Node.js, TypeScript, and other modern technologies.',
  keywords: [
    'projects',
    'portfolio',
    'web development',
    'full stack',
    'React',
    'Next.js',
    'Node.js',
    'TypeScript',
  ],
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

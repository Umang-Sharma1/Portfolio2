import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects | Admin Dashboard',
  description: 'Manage your portfolio projects',
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

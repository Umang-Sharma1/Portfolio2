import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | Admin Panel',
  description: 'Admin dashboard overview for managing portfolio content',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Login | Portfolio',
  description: 'Secure admin login for portfolio management',
  robots: 'noindex, nofollow',
};

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}

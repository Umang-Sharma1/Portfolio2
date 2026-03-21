import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Code Sprint | Typing Game',
  description: 'Test your coding speed with the Code Sprint typing challenge',
};

export default function GameLayout({ children }: { children: React.ReactNode }) {
  return children;
}

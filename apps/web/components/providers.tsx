'use client';

import { ThemeProvider } from 'next-themes';
import { ApolloNextAppProvider } from '@apollo/experimental-nextjs-app-support/ssr';
import { Suspense } from 'react';
import { initializeApollo } from '@/lib/apollo-client';
import { AuthProvider } from '@/lib/auth';
import type { ApolloClient } from '@apollo/client-react-streaming';

/**
 * Create Apollo Client for client-side rendering
 * This is called once per browser tab
 */
function makeClient(): ApolloClient<any> {
  return initializeApollo() as ApolloClient<any>;
}

/**
 * Loading fallback component
 */
function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    </div>
  );
}

/**
 * Root providers wrapper
 * Includes:
 * - Apollo Client (GraphQL)
 * - Theme Provider (dark/light mode)
 * - Auth Provider (admin authentication)
 * - Suspense boundary
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ApolloNextAppProvider makeClient={makeClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="portfolio-theme"
        >
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </ApolloNextAppProvider>
    </Suspense>
  );
}

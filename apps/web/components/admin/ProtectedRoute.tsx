'use client';

import { useAuth } from '@/lib/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, ComponentType } from 'react';
import { motion } from 'framer-motion';

// ============================================================================
// LOADING SPINNER COMPONENT
// ============================================================================

function LoadingScreen({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6"
      >
        {/* Animated logo */}
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center shadow-2xl shadow-purple-500/30">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          {/* Spinning ring */}
          <div className="absolute inset-0 -m-2">
            <svg className="w-20 h-20 animate-spin" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-purple-200 dark:text-purple-900"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeDasharray="180"
                strokeDashoffset="60"
                strokeLinecap="round"
                className="text-purple-600"
              />
            </svg>
          </div>
        </div>

        <div className="text-center">
          <p className="text-lg font-medium text-gray-900 dark:text-white">{message}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Please wait...</p>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================================
// PROTECTED ROUTE HOC
// ============================================================================

interface ProtectedRouteOptions {
  redirectTo?: string;
  requiredRole?: 'admin' | 'super_admin' | 'editor';
  loadingMessage?: string;
}

/**
 * Higher-Order Component that protects routes requiring authentication
 *
 * @example
 * // Basic usage
 * export default withProtectedRoute(MyAdminPage);
 *
 * @example
 * // With options
 * export default withProtectedRoute(MyAdminPage, {
 *   requiredRole: 'super_admin',
 *   redirectTo: '/admin/unauthorized'
 * });
 */
export function withProtectedRoute<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: ProtectedRouteOptions = {}
): ComponentType<P> {
  const {
    redirectTo = '/admin/login',
    requiredRole,
    loadingMessage = 'Verifying authentication...',
  } = options;

  function ProtectedRoute(props: P) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      // Wait for loading to complete
      if (isLoading) return;

      // Redirect if not authenticated
      if (!isAuthenticated) {
        const returnUrl = encodeURIComponent(pathname);
        router.push(`${redirectTo}?returnUrl=${returnUrl}`);
        return;
      }

      // Check role if required
      if (requiredRole && user?.role !== requiredRole && user?.role !== 'super_admin') {
        router.push('/admin/unauthorized');
        return;
      }
    }, [isAuthenticated, isLoading, user, router, pathname]);

    // Show loading while checking auth
    if (isLoading) {
      return <LoadingScreen message={loadingMessage} />;
    }

    // Don't render if not authenticated
    if (!isAuthenticated) {
      return <LoadingScreen message="Redirecting to login..." />;
    }

    // Check role
    if (requiredRole && user?.role !== requiredRole && user?.role !== 'super_admin') {
      return <LoadingScreen message="Checking permissions..." />;
    }

    // Render the protected component
    return <WrappedComponent {...props} />;
  }

  // Set display name for debugging
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  ProtectedRoute.displayName = `withProtectedRoute(${displayName})`;

  return ProtectedRoute;
}

// ============================================================================
// PROTECTED ROUTE COMPONENT (Alternative)
// ============================================================================

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'super_admin' | 'editor';
  fallback?: React.ReactNode;
}

/**
 * Component that wraps children and protects them with authentication
 *
 * @example
 * <ProtectedRoute>
 *   <AdminContent />
 * </ProtectedRoute>
 *
 * @example
 * <ProtectedRoute requiredRole="super_admin">
 *   <SuperAdminContent />
 * </ProtectedRoute>
 */
export function ProtectedRoute({ children, requiredRole, fallback }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      const returnUrl = encodeURIComponent(pathname);
      router.push(`/admin/login?returnUrl=${returnUrl}`);
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  if (isLoading) {
    return fallback || <LoadingScreen message="Verifying authentication..." />;
  }

  if (!isAuthenticated) {
    return fallback || <LoadingScreen message="Redirecting to login..." />;
  }

  // Check role if required
  if (requiredRole && user?.role !== requiredRole && user?.role !== 'super_admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            You don&apos;t have permission to access this page.
          </p>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// ============================================================================
// ROLE-BASED CONTENT COMPONENT
// ============================================================================

interface RequireRoleProps {
  children: React.ReactNode;
  role: 'admin' | 'super_admin' | 'editor' | ('admin' | 'super_admin' | 'editor')[];
  fallback?: React.ReactNode;
}

/**
 * Conditionally renders content based on user role
 *
 * @example
 * <RequireRole role="super_admin">
 *   <DeleteButton />
 * </RequireRole>
 *
 * @example
 * <RequireRole role={['admin', 'super_admin']} fallback={<span>View only</span>}>
 *   <EditButton />
 * </RequireRole>
 */
export function RequireRole({ children, role, fallback = null }: RequireRoleProps) {
  const { user } = useAuth();

  if (!user) return fallback;

  const allowedRoles = Array.isArray(role) ? role : [role];

  // Super admin has access to everything
  if (user.role === 'super_admin' || allowedRoles.includes(user.role as any)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

export default ProtectedRoute;

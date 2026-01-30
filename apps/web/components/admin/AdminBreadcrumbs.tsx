'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRightIcon, HomeIcon } from './AdminIcons';

// ============================================================================
// BREADCRUMB CONFIGURATION
// ============================================================================

interface BreadcrumbConfig {
  [key: string]: {
    label: string;
    parent?: string;
  };
}

const breadcrumbConfig: BreadcrumbConfig = {
  '/admin': { label: 'Admin' },
  '/admin/dashboard': { label: 'Dashboard', parent: '/admin' },
  '/admin/projects': { label: 'Projects', parent: '/admin/dashboard' },
  '/admin/projects/new': { label: 'New Project', parent: '/admin/projects' },
  '/admin/skills': { label: 'Skills', parent: '/admin/dashboard' },
  '/admin/skills/new': { label: 'New Skill', parent: '/admin/skills' },
  '/admin/messages': { label: 'Messages', parent: '/admin/dashboard' },
  '/admin/analytics': { label: 'Analytics', parent: '/admin/dashboard' },
  '/admin/settings': { label: 'Settings', parent: '/admin/dashboard' },
  '/admin/settings/profile': { label: 'Profile', parent: '/admin/settings' },
  '/admin/settings/security': { label: 'Security', parent: '/admin/settings' },
  '/admin/notifications': { label: 'Notifications', parent: '/admin/dashboard' },
};

// ============================================================================
// ADMIN BREADCRUMBS COMPONENT
// ============================================================================

export function AdminBreadcrumbs() {
  const pathname = usePathname();

  // Generate breadcrumb trail
  const getBreadcrumbs = () => {
    const breadcrumbs: { href: string; label: string }[] = [];
    let currentPath = pathname;

    // Handle dynamic routes (e.g., /admin/projects/[id])
    const pathParts = pathname.split('/').filter(Boolean);
    let dynamicLabel: string | null = null;

    // Check if last segment is a dynamic ID
    if (pathParts.length > 2) {
      const lastSegment = pathParts[pathParts.length - 1];
      const basePath = '/' + pathParts.slice(0, -1).join('/');

      // If last segment isn't in config and looks like an ID
      if (!breadcrumbConfig[pathname] && !['new', 'edit'].includes(lastSegment)) {
        dynamicLabel = 'Details';
        currentPath = basePath;
      } else if (lastSegment === 'edit') {
        dynamicLabel = 'Edit';
        currentPath = '/' + pathParts.slice(0, -2).join('/');
      }
    }

    // Build breadcrumb chain
    while (currentPath && breadcrumbConfig[currentPath]) {
      const config = breadcrumbConfig[currentPath];
      breadcrumbs.unshift({
        href: currentPath,
        label: config.label,
      });
      currentPath = config.parent || '';
    }

    // Add dynamic segment if exists
    if (dynamicLabel) {
      breadcrumbs.push({
        href: pathname,
        label: dynamicLabel,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  // Don't show breadcrumbs on dashboard
  if (pathname === '/admin/dashboard' || breadcrumbs.length <= 1) {
    return (
      <div className="hidden lg:flex items-center gap-2 text-sm">
        <span className="font-semibold text-gray-900 dark:text-white">
          {breadcrumbConfig[pathname]?.label || 'Admin'}
        </span>
      </div>
    );
  }

  return (
    <nav className="hidden lg:flex items-center gap-1 text-sm" aria-label="Breadcrumb">
      <ol className="flex items-center gap-1">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const isFirst = index === 0;

          return (
            <li key={crumb.href} className="flex items-center gap-1">
              {!isFirst && (
                <ChevronRightIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              )}

              {isLast ? (
                <span className="font-semibold text-gray-900 dark:text-white">{crumb.label}</span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {isFirst && crumb.label === 'Dashboard' ? (
                    <span className="flex items-center gap-1">
                      <HomeIcon className="w-4 h-4" />
                      <span className="hidden xl:inline">{crumb.label}</span>
                    </span>
                  ) : (
                    crumb.label
                  )}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// ============================================================================
// PAGE TITLE COMPONENT
// ============================================================================

interface PageTitleProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageTitle({ title, description, actions }: PageTitleProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

export default AdminBreadcrumbs;

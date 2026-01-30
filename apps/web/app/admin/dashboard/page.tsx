'use client';

import { useAuth } from '@/lib/auth';
import { useQuery } from '@apollo/client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { format, subDays } from 'date-fns';
import { GET_ADMIN_STATS, GET_TOP_PROJECTS, GET_RECENT_MESSAGES } from '@/lib/graphql/queries';

// ============================================================================
// CHART COLORS
// ============================================================================

const CHART_COLORS = {
  primary: '#8B5CF6',
  secondary: '#3B82F6',
  accent: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  muted: '#6B7280',
};

const PIE_COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];

// ============================================================================
// TYPES
// ============================================================================

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  views: number;
  status: string;
  images?: { thumbnail?: string };
  clicks?: { github?: number; live?: number };
  createdAt?: string;
}

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  status: string;
  createdAt: string;
}

// ============================================================================
// ICONS
// ============================================================================

function ProjectsIcon({ className = 'w-6 h-6' }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
      />
    </svg>
  );
}

function SkillsIcon({ className = 'w-6 h-6' }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    </svg>
  );
}

function MessagesIcon({ className = 'w-6 h-6' }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

function ViewsIcon({ className = 'w-6 h-6' }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );
}

function TrendUpIcon({ className = 'w-4 h-4' }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}

function TrendDownIcon({ className = 'w-4 h-4' }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
    </svg>
  );
}

function PlusIcon({ className = 'w-5 h-5' }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

function ArrowRightIcon({ className = 'w-5 h-5' }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  );
}

function ExternalLinkIcon({ className = 'w-4 h-4' }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  );
}

function EditIcon({ className = 'w-4 h-4' }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  );
}

function RefreshIcon({ className = 'w-5 h-5' }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  );
}

function DownloadIcon({ className = 'w-5 h-5' }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    </svg>
  );
}

// ============================================================================
// STATS CARD COMPONENT
// ============================================================================

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  loading?: boolean;
}

function StatsCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  href,
  loading,
}: StatsCardProps) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 ${
        href
          ? 'hover:shadow-md hover:border-purple-200 dark:hover:border-purple-800 cursor-pointer transition-all'
          : ''
      }`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-full -mr-16 -mt-16" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          {loading ? (
            <div className="h-9 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-1" />
          ) : (
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          )}
          {change !== undefined && !loading && (
            <div
              className={`flex items-center gap-1 mt-2 text-sm font-medium ${
                change >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {change >= 0 ? (
                <TrendUpIcon className="w-4 h-4" />
              ) : (
                <TrendDownIcon className="w-4 h-4" />
              )}
              <span>
                {change >= 0 ? '+' : ''}
                {change}
                {changeLabel || ''}
              </span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10">
          <Icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
      </div>
    </motion.div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

// ============================================================================
// CHART CARD WRAPPER
// ============================================================================

function ChartCard({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        {action}
      </div>
      {children}
    </motion.div>
  );
}

// ============================================================================
// CUSTOM TOOLTIP FOR CHARTS
// ============================================================================

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ color: string; name: string; value: number }>;
  label?: string;
}) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
        {payload.map((entry, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

// ============================================================================
// ACTIVITY ITEM COMPONENT
// ============================================================================

function ActivityItem({
  type,
  description,
  time,
  icon: Icon,
}: {
  type: string;
  description: string;
  time: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const typeColors: Record<string, string> = {
    project: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    skill: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    message: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    analytics: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
  };

  return (
    <div className="flex items-start gap-3 py-3">
      <div className={`p-2 rounded-lg ${typeColors[type] || typeColors.project}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 dark:text-white">{description}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{time}</p>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN DASHBOARD PAGE
// ============================================================================

export default function DashboardPage() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<'7' | '30' | '90'>('30');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // GraphQL Queries with polling
  const {
    data: statsData,
    loading: statsLoading,
    refetch: refetchStats,
  } = useQuery(GET_ADMIN_STATS, {
    pollInterval: 30000,
  });

  const { data: topProjectsData, loading: projectsLoading } = useQuery(GET_TOP_PROJECTS, {
    variables: { limit: 5 },
    pollInterval: 30000,
  });

  const { data: messagesData } = useQuery(GET_RECENT_MESSAGES, {
    variables: { limit: 5 },
    pollInterval: 30000,
  });

  // Calculate stats from data
  const stats = useMemo(() => {
    if (!statsData) {
      return {
        totalProjects: 0,
        totalSkills: 0,
        unreadMessages: 0,
        totalViews: 0,
        projectsThisMonth: 0,
        skillsThisMonth: 0,
        viewsChange: 0,
      };
    }

    const projects = statsData.projects || [];
    const skills = statsData.skills || [];
    const messages = statsData.contactMessages || [];

    const thisMonth = new Date();
    thisMonth.setDate(1);

    const projectsThisMonth = projects.filter(
      (p: Project) => p.createdAt && new Date(p.createdAt) >= thisMonth
    ).length;

    const unreadMessages = messages.filter(
      (m: Message) => m.status === 'pending' || m.status === 'new'
    ).length;

    const totalViews = projects.reduce((sum: number, p: Project) => sum + (p.views || 0), 0);

    return {
      totalProjects: projects.length,
      totalSkills: skills.length,
      unreadMessages,
      totalViews,
      projectsThisMonth,
      skillsThisMonth: 0,
      viewsChange: 12,
    };
  }, [statsData]);

  // Generate mock page views data for chart
  const pageViewsData = useMemo(() => {
    const days = parseInt(timeRange);
    const data = [];
    const baseViews = 150;

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const randomVariation = Math.floor(Math.random() * 100) - 30;
      const dayOfWeek = date.getDay();
      const weekendBonus = dayOfWeek === 0 || dayOfWeek === 6 ? -30 : 20;

      data.push({
        date: format(date, days > 30 ? 'MMM d' : 'MMM d'),
        views: Math.max(50, baseViews + randomVariation + weekendBonus),
        uniqueVisitors: Math.max(30, Math.floor((baseViews + randomVariation) * 0.7)),
      });
    }
    return data;
  }, [timeRange]);

  // Calculate category distribution from projects
  const categoryData = useMemo(() => {
    if (!statsData?.projects) {
      return [
        { name: 'Frontend', value: 37.5, count: 15 },
        { name: 'Backend', value: 25, count: 10 },
        { name: 'Full Stack', value: 30, count: 12 },
        { name: 'Other', value: 7.5, count: 3 },
      ];
    }

    const projects = statsData.projects;
    const categories: Record<string, number> = {};

    projects.forEach((p: Project) => {
      const cat = p.category || 'Other';
      categories[cat] = (categories[cat] || 0) + 1;
    });

    const total = projects.length || 1;
    return Object.entries(categories).map(([name, count]) => ({
      name,
      value: Math.round((count / total) * 100 * 10) / 10,
      count,
    }));
  }, [statsData]);

  // Generate recent activity
  const recentActivity = useMemo(() => {
    const activities = [
      {
        type: 'project',
        description: 'New project "E-Commerce Platform" added',
        time: '2 hours ago',
        icon: ProjectsIcon,
      },
      {
        type: 'message',
        description: 'New message from john@example.com',
        time: '3 hours ago',
        icon: MessagesIcon,
      },
      {
        type: 'skill',
        description: 'Skill "TypeScript" updated',
        time: '5 hours ago',
        icon: SkillsIcon,
      },
      {
        type: 'analytics',
        description: 'Page views spike on Portfolio page',
        time: '1 day ago',
        icon: ViewsIcon,
      },
      {
        type: 'project',
        description: 'Project "AI Chatbot" views reached 500',
        time: '2 days ago',
        icon: ProjectsIcon,
      },
    ];

    if (messagesData?.contactMessages) {
      const recentMessages = messagesData.contactMessages.slice(0, 2);
      recentMessages.forEach((msg: Message) => {
        activities.unshift({
          type: 'message',
          description: `Message from ${msg.name}: "${msg.subject}"`,
          time: format(new Date(msg.createdAt), 'MMM d, h:mm a'),
          icon: MessagesIcon,
        });
      });
    }

    return activities.slice(0, 6);
  }, [messagesData]);

  // Top projects data
  const topProjects = useMemo(() => {
    if (topProjectsData?.projects) {
      return topProjectsData.projects;
    }
    return [];
  }, [topProjectsData]);

  // Manual refresh
  const handleRefresh = () => {
    refetchStats();
    setLastRefresh(new Date());
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 rounded-2xl p-8 text-white"
      >
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,white)]" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />

        <div className="relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.name?.split(' ')[0] || 'Admin'}! 👋
              </h1>
              <p className="text-purple-100">
                Here&apos;s what&apos;s happening with your portfolio today.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
              >
                <RefreshIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <p className="text-sm text-purple-200">
                Last updated: {format(lastRefresh, 'h:mm a')}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Projects"
          value={stats.totalProjects}
          change={stats.projectsThisMonth}
          changeLabel=" this month"
          icon={ProjectsIcon}
          href="/admin/projects"
          loading={statsLoading}
        />
        <StatsCard
          title="Total Skills"
          value={`${stats.totalSkills}+`}
          change={stats.skillsThisMonth}
          changeLabel=" this month"
          icon={SkillsIcon}
          href="/admin/skills"
          loading={statsLoading}
        />
        <StatsCard
          title="Unread Messages"
          value={stats.unreadMessages}
          icon={MessagesIcon}
          href="/admin/messages"
          loading={statsLoading}
        />
        <StatsCard
          title="Total Page Views"
          value={stats.totalViews.toLocaleString()}
          change={stats.viewsChange}
          changeLabel="%"
          icon={ViewsIcon}
          href="/admin/analytics"
          loading={statsLoading}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Page Views Chart - Takes 2 columns */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Page Views Over Time"
            action={
              <div className="flex items-center gap-2">
                {(['7', '30', '90'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                      timeRange === range
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {range}D
                  </button>
                ))}
              </div>
            }
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={pageViewsData}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-gray-200 dark:stroke-gray-700"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    className="text-gray-600 dark:text-gray-400"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    className="text-gray-600 dark:text-gray-400"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="views"
                    name="Page Views"
                    stroke={CHART_COLORS.primary}
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="uniqueVisitors"
                    name="Unique Visitors"
                    stroke={CHART_COLORS.secondary}
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Category Distribution */}
        <ChartCard title="Project Categories">
          <div className="h-80 flex flex-col">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                        className="stroke-white dark:stroke-gray-800"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {categoryData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {entry.name} ({entry.value}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <ChartCard
          title="Recent Activity"
          action={
            <Link
              href="/admin/analytics"
              className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
            >
              View all
            </Link>
          }
        >
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {recentActivity.map((activity, index) => (
              <ActivityItem key={index} {...activity} />
            ))}
          </div>
        </ChartCard>

        {/* Top Projects */}
        <ChartCard
          title="Top Projects by Views"
          action={
            <Link
              href="/admin/projects"
              className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
            >
              View all
            </Link>
          }
        >
          {projectsLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                  <div className="flex-1">
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-1" />
                  </div>
                </div>
              ))}
            </div>
          ) : topProjects.length > 0 ? (
            <div className="space-y-3">
              {topProjects.map((project: Project, index: number) => (
                <div
                  key={project.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10 text-purple-600 dark:text-purple-400 font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {project.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(project.views || 0).toLocaleString()} views
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="p-1.5 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <EditIcon className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/projects/${project.slug}`}
                      target="_blank"
                      className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="View Live"
                    >
                      <ExternalLinkIcon className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <ProjectsIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No projects yet</p>
              <Link
                href="/admin/projects/new"
                className="text-purple-600 dark:text-purple-400 hover:underline text-sm"
              >
                Add your first project
              </Link>
            </div>
          )}
        </ChartCard>

        {/* Quick Actions */}
        <ChartCard title="Quick Actions">
          <div className="space-y-3">
            <Link
              href="/admin/projects/new"
              className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 hover:from-purple-500/20 hover:to-blue-500/20 border border-purple-200/50 dark:border-purple-800/50 transition-all group"
            >
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500">
                <PlusIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">Add New Project</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Create a new portfolio project
                </p>
              </div>
              <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/admin/skills/new"
              className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 border border-blue-200/50 dark:border-blue-800/50 transition-all group"
            >
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                <PlusIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">Add New Skill</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Add a new technology skill
                </p>
              </div>
              <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/admin/messages"
              className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20 border border-green-200/50 dark:border-green-800/50 transition-all group"
            >
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 relative">
                <MessagesIcon className="w-5 h-5 text-white" />
                {stats.unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                    {stats.unreadMessages > 9 ? '9+' : stats.unreadMessages}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">View Messages</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stats.unreadMessages > 0
                    ? `${stats.unreadMessages} unread messages`
                    : 'Check contact submissions'}
                </p>
              </div>
              <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <button
              onClick={() => alert('Export feature coming soon!')}
              className="w-full flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 border border-amber-200/50 dark:border-amber-800/50 transition-all group"
            >
              <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500">
                <DownloadIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900 dark:text-white">Export Analytics</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Download CSV report</p>
              </div>
              <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </ChartCard>
      </div>

      {/* Project Performance Bar Chart */}
      {topProjects.length > 0 && (
        <ChartCard title="Project Performance Comparison">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topProjects.slice(0, 8).map((p: Project) => ({
                  name: p.title.length > 15 ? p.title.slice(0, 15) + '...' : p.title,
                  views: p.views || 0,
                  githubClicks: p.clicks?.github || 0,
                  liveClicks: p.clicks?.live || 0,
                }))}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-200 dark:stroke-gray-700"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={0}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="views"
                  name="Page Views"
                  fill={CHART_COLORS.primary}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="githubClicks"
                  name="GitHub Clicks"
                  fill={CHART_COLORS.secondary}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="liveClicks"
                  name="Live Demo Clicks"
                  fill={CHART_COLORS.accent}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {/* Footer Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {stats.totalProjects}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total Projects</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {stats.totalSkills}+
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Skills Listed</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {stats.totalViews.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total Page Views</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
              {categoryData.length}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Categories</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

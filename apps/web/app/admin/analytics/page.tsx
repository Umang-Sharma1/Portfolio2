'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { motion } from 'framer-motion';
import { format, subDays } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import {
  GET_ANALYTICS,
  GET_AGGREGATE_ANALYTICS,
  GET_RECENT_ANALYTICS,
} from '@/lib/graphql/queries';
import { GENERATE_ANALYTICS } from '@/lib/graphql/mutations';

// ============================================================================
// CHART COLORS
// ============================================================================

const COLORS = {
  primary: '#8B5CF6',
  secondary: '#3B82F6',
  accent: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  pink: '#EC4899',
};

const PIE_COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4'];

// ============================================================================
// ICONS
// ============================================================================

function EyeIcon({ className = 'w-5 h-5' }) {
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

function UsersIcon({ className = 'w-5 h-5' }) {
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
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}

function CursorIcon({ className = 'w-5 h-5' }) {
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
        d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
      />
    </svg>
  );
}

function RefreshIcon({ className = 'w-4 h-4' }) {
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

function ClockIcon({ className = 'w-5 h-5' }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
    </svg>
  );
}

type DateRange = '7d' | '30d' | '90d';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AdminAnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>('30d');

  const daysMap: Record<DateRange, number> = { '7d': 7, '30d': 30, '90d': 90 };
  const days = daysMap[dateRange];

  const dateFrom = format(subDays(new Date(), days), 'yyyy-MM-dd');
  const dateTo = format(new Date(), 'yyyy-MM-dd');

  // Queries
  const {
    data: recentData,
    loading: recentLoading,
    refetch: refetchRecent,
  } = useQuery(GET_RECENT_ANALYTICS, {
    variables: { days },
  });

  const { data: aggregateData, loading: aggLoading } = useQuery(GET_AGGREGATE_ANALYTICS, {
    variables: { dateFrom, dateTo },
  });

  // Mutation
  const [generateAnalytics, { loading: generating }] = useMutation(GENERATE_ANALYTICS, {
    onCompleted: () => refetchRecent(),
  });

  const aggregate = aggregateData?.aggregateAnalytics;
  const recentEntries = recentData?.recentAnalytics || [];

  // Prepare chart data
  const chartData = useMemo(() => {
    return recentEntries
      .map((entry: any) => ({
        date: format(new Date(entry.createdAt || entry.timestamp), 'MMM d'),
        views: entry.pageViews?.total || 0,
        visitors: entry.uniqueVisitors || 0,
        bounceRate: entry.bounceRate != null ? Math.round(entry.bounceRate * 100) : 0,
      }))
      .reverse();
  }, [recentEntries]);

  const pageViewsData = useMemo(() => {
    if (!recentEntries.length) return [];
    const latest = recentEntries[0];
    if (!latest?.pageViews) return [];
    const pv = latest.pageViews;
    return [
      { name: 'Home', value: pv.home || 0 },
      { name: 'Projects', value: pv.projects || 0 },
      { name: 'Skills', value: pv.skills || 0 },
      { name: 'Contact', value: pv.contact || 0 },
    ].filter((p) => p.value > 0);
  }, [recentEntries]);

  const topProjects = aggregate?.topProjects || [];
  const topSkills = aggregate?.topSkills || [];
  const loading = recentLoading || aggLoading;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            Analytics
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Website traffic and engagement insights
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Date Range */}
          <div className="flex bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            {(['7d', '30d', '90d'] as DateRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 text-xs font-medium transition-colors ${
                  dateRange === range
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <button
            onClick={() => generateAnalytics({ variables: { periodType: 'DAILY' } })}
            disabled={generating}
            className="px-4 py-2.5 text-sm font-medium bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-lg shadow-purple-500/25 disabled:opacity-50"
          >
            <RefreshIcon className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
            Generate
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      {aggregate && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Total Page Views',
              value: aggregate.totalPageViews?.toLocaleString() || '0',
              icon: <EyeIcon className="w-5 h-5" />,
              color: 'text-purple-600',
            },
            {
              label: 'Unique Visitors',
              value: aggregate.totalUniqueVisitors?.toLocaleString() || '0',
              icon: <UsersIcon className="w-5 h-5" />,
              color: 'text-blue-600',
            },
            {
              label: 'Project Clicks',
              value: aggregate.totalProjectClicks?.toLocaleString() || '0',
              icon: <CursorIcon className="w-5 h-5" />,
              color: 'text-green-600',
            },
            {
              label: 'Avg Session',
              value: aggregate.averageSessionDuration
                ? `${Math.round(aggregate.averageSessionDuration / 60)}m`
                : '—',
              icon: <ClockIcon className="w-5 h-5" />,
              color: 'text-orange-600',
            },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200/50 dark:border-gray-700/50"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                <span className={stat.color}>{stat.icon}</span>
              </div>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>
      )}

      {loading && !chartData.length ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Traffic Trend Chart */}
          {chartData.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Traffic Overview
              </h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="visitorsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                    <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(17,24,39,0.9)',
                        border: '1px solid rgba(75,85,99,0.5)',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="views"
                      stroke={COLORS.primary}
                      fill="url(#viewsGrad)"
                      strokeWidth={2}
                      name="Page Views"
                    />
                    <Area
                      type="monotone"
                      dataKey="visitors"
                      stroke={COLORS.secondary}
                      fill="url(#visitorsGrad)"
                      strokeWidth={2}
                      name="Visitors"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Two Column Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Page Views Distribution */}
            {pageViewsData.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Page Distribution
                </h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pageViewsData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                        nameKey="name"
                        paddingAngle={4}
                      >
                        {pageViewsData.map((_: any, index: number) => (
                          <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(17,24,39,0.9)',
                          border: '1px solid rgba(75,85,99,0.5)',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '12px',
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Bounce rate over time */}
            {chartData.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Bounce Rate (%)
                </h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                      <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                      <YAxis stroke="#9CA3AF" fontSize={12} domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(17,24,39,0.9)',
                          border: '1px solid rgba(75,85,99,0.5)',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '12px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="bounceRate"
                        stroke={COLORS.warning}
                        strokeWidth={2}
                        dot={{ fill: COLORS.warning, r: 3 }}
                        name="Bounce Rate"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* Top Projects & Skills */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Projects */}
            {topProjects.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Top Projects
                </h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topProjects.slice(0, 6)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                      <XAxis type="number" stroke="#9CA3AF" fontSize={12} />
                      <YAxis
                        dataKey="title"
                        type="category"
                        stroke="#9CA3AF"
                        fontSize={11}
                        width={120}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(17,24,39,0.9)',
                          border: '1px solid rgba(75,85,99,0.5)',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '12px',
                        }}
                      />
                      <Bar
                        dataKey="clicks"
                        fill={COLORS.primary}
                        radius={[0, 4, 4, 0]}
                        name="Clicks"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Top Skills */}
            {topSkills.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Top Skills</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topSkills.slice(0, 6)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                      <XAxis type="number" stroke="#9CA3AF" fontSize={12} />
                      <YAxis
                        dataKey="name"
                        type="category"
                        stroke="#9CA3AF"
                        fontSize={11}
                        width={100}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(17,24,39,0.9)',
                          border: '1px solid rgba(75,85,99,0.5)',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '12px',
                        }}
                      />
                      <Bar
                        dataKey="views"
                        fill={COLORS.accent}
                        radius={[0, 4, 4, 0]}
                        name="Views"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* No Data State */}
          {!chartData.length && !topProjects.length && !loading && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center">
              <EyeIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-lg mb-2">No analytics data yet</p>
              <p className="text-gray-400 text-sm mb-4">
                Generate analytics to start tracking your portfolio performance
              </p>
              <button
                onClick={() => generateAnalytics({ variables: { periodType: 'DAILY' } })}
                disabled={generating}
                className="px-6 py-2.5 text-sm font-medium bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
              >
                Generate Now
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

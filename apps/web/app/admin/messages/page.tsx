'use client';

import { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { GET_CONTACT_MESSAGES, GET_PENDING_MESSAGES, GET_SPAM_STATS } from '@/lib/graphql/queries';
import {
  UPDATE_MESSAGE_STATUS,
  MARK_MESSAGE_AS_SPAM,
  DELETE_MESSAGE,
} from '@/lib/graphql/mutations';

// ============================================================================
// TYPES
// ============================================================================

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  isSpam: boolean;
  spamScore: number;
  ipAddress: string;
  userAgent: string;
  adminNotes: string;
  repliedAt: string;
  isRecent: boolean;
  daysSinceCreation: number;
  responseTime: number;
  createdAt: string;
  updatedAt: string;
}

type StatusFilter = 'ALL' | 'PENDING' | 'READ' | 'REPLIED' | 'ARCHIVED' | 'SPAM';

// ============================================================================
// ICONS
// ============================================================================

function SearchIcon({ className = 'w-5 h-5' }) {
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
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}

function MailIcon({ className = 'w-5 h-5' }) {
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

function ReplyIcon({ className = 'w-4 h-4' }) {
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
        d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
      />
    </svg>
  );
}

function TrashIcon({ className = 'w-4 h-4' }) {
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
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
}

function ArchiveIcon({ className = 'w-4 h-4' }) {
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
        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
      />
    </svg>
  );
}

function SpamIcon({ className = 'w-4 h-4' }) {
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
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  );
}

function XIcon({ className = 'w-5 h-5' }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function CheckIcon({ className = 'w-4 h-4' }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  READ: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  REPLIED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  ARCHIVED: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  SPAM: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

const STATUS_FILTERS: StatusFilter[] = ['ALL', 'PENDING', 'READ', 'REPLIED', 'ARCHIVED', 'SPAM'];

// ============================================================================
// MESSAGE DETAIL MODAL
// ============================================================================

function MessageDetailModal({
  message,
  onClose,
  onStatusChange,
  onMarkSpam,
  onDelete,
  loading,
}: {
  message: Message;
  onClose: () => void;
  onStatusChange: (id: string, status: string, notes?: string) => void;
  onMarkSpam: (id: string) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}) {
  const [notes, setNotes] = useState(message.adminNotes || '');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex-1 min-w-0 pr-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">
              {message.subject}
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <span
                className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[message.status] || STATUS_STYLES.PENDING}`}
              >
                {message.status}
              </span>
              {message.isSpam && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  <SpamIcon className="w-3 h-3" /> Spam ({Math.round(message.spamScore * 100)}%)
                </span>
              )}
              {message.isRecent && (
                <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  New
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <XIcon />
          </button>
        </div>

        {/* Sender Info */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">From:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">{message.name}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Email:</span>
              <a
                href={`mailto:${message.email}`}
                className="ml-2 font-medium text-purple-600 hover:underline"
              >
                {message.email}
              </a>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Date:</span>
              <span className="ml-2 text-gray-700 dark:text-gray-300">
                {format(new Date(message.createdAt), 'PPp')}
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Days ago:</span>
              <span className="ml-2 text-gray-700 dark:text-gray-300">
                {message.daysSinceCreation || 0}d
              </span>
            </div>
          </div>
        </div>

        {/* Message Body */}
        <div className="p-6">
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
            {message.message}
          </p>
        </div>

        {/* Admin Notes */}
        <div className="px-6 pb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Admin Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 resize-none"
            placeholder="Add internal notes..."
          />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 p-6 border-t border-gray-200 dark:border-gray-700">
          {message.status !== 'READ' && (
            <button
              onClick={() => onStatusChange(message.id, 'READ', notes)}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <CheckIcon /> Mark Read
            </button>
          )}
          {message.status !== 'REPLIED' && (
            <button
              onClick={() => onStatusChange(message.id, 'REPLIED', notes)}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            >
              <ReplyIcon /> Mark Replied
            </button>
          )}
          <button
            onClick={() => onStatusChange(message.id, 'ARCHIVED', notes)}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <ArchiveIcon /> Archive
          </button>
          <button
            onClick={() => onMarkSpam(message.id)}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-700 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
          >
            <SpamIcon /> Spam
          </button>
          <div className="flex-1" />
          <button
            onClick={() => {
              if (confirm('Delete this message permanently?')) onDelete(message.id);
            }}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            <TrashIcon /> Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AdminMessagesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  // Queries
  const { data, loading, error, refetch } = useQuery(GET_CONTACT_MESSAGES, {
    variables: {
      status: statusFilter !== 'ALL' ? statusFilter : undefined,
      pagination: { limit: 100 },
    },
  });

  const { data: spamData } = useQuery(GET_SPAM_STATS);

  // Mutations
  const [updateStatus, { loading: updating }] = useMutation(UPDATE_MESSAGE_STATUS, {
    onCompleted: () => {
      refetch();
      setSelectedMessage(null);
    },
  });
  const [markSpam, { loading: marking }] = useMutation(MARK_MESSAGE_AS_SPAM, {
    onCompleted: () => {
      refetch();
      setSelectedMessage(null);
    },
  });
  const [deleteMessage, { loading: deleting }] = useMutation(DELETE_MESSAGE, {
    onCompleted: () => {
      refetch();
      setSelectedMessage(null);
    },
  });

  const messages: Message[] = useMemo(() => {
    let result = data?.contactMessages || [];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (m: Message) =>
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.subject.toLowerCase().includes(q)
      );
    }
    return result;
  }, [data, search]);

  const stats = useMemo(() => {
    const all = data?.contactMessages || [];
    return {
      total: all.length,
      pending: all.filter((m: Message) => m.status === 'PENDING').length,
      spam: spamData?.spamStats?.spam || 0,
      spamRate: spamData?.spamStats?.spamRate || 0,
    };
  }, [data, spamData]);

  const handleStatusChange = useCallback(
    (id: string, status: string, notes?: string) => {
      updateStatus({ variables: { id, input: { status, adminNotes: notes } } });
    },
    [updateStatus]
  );

  const handleMarkSpam = useCallback(
    (id: string) => {
      markSpam({ variables: { id } });
    },
    [markSpam]
  );

  const handleDelete = useCallback(
    (id: string) => {
      deleteMessage({ variables: { id } });
    },
    [deleteMessage]
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Messages</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage contact form submissions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Messages',
            value: stats.total,
            color: 'text-purple-600',
            icon: <MailIcon className="w-5 h-5" />,
          },
          {
            label: 'Pending',
            value: stats.pending,
            color: 'text-yellow-600',
            icon: <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />,
          },
          {
            label: 'Spam Detected',
            value: stats.spam,
            color: 'text-red-600',
            icon: <SpamIcon className="w-5 h-5" />,
          },
          {
            label: 'Spam Rate',
            value: `${Math.round(stats.spamRate * 100)}%`,
            color: 'text-orange-600',
            icon: null,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              <span className={stat.color}>{stat.icon}</span>
            </div>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search messages..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                statusFilter === filter
                  ? 'bg-purple-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
          <p className="text-red-700 dark:text-red-400 font-medium">Failed to load messages</p>
          <button onClick={() => refetch()} className="mt-2 text-sm text-red-600 underline">
            Retry
          </button>
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <MailIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-lg mb-2">No messages found</p>
          <p className="text-gray-400 text-sm">
            Messages will appear here when visitors submit the contact form
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map((msg: Message) => (
            <motion.button
              key={msg.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedMessage(msg)}
              className="w-full text-left bg-white dark:bg-gray-800 rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {msg.name.charAt(0).toUpperCase()}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                      {msg.name}
                    </span>
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${STATUS_STYLES[msg.status] || STATUS_STYLES.PENDING}`}
                    >
                      {msg.status}
                    </span>
                    {msg.isSpam && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                        <SpamIcon className="w-2.5 h-2.5" /> SPAM
                      </span>
                    )}
                    {msg.isRecent && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
                  </div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                    {msg.subject}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                    {msg.message}
                  </p>
                </div>

                {/* Meta */}
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-400">
                    {format(new Date(msg.createdAt), 'MMM d')}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">{msg.email}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedMessage && (
          <MessageDetailModal
            message={selectedMessage}
            onClose={() => setSelectedMessage(null)}
            onStatusChange={handleStatusChange}
            onMarkSpam={handleMarkSpam}
            onDelete={handleDelete}
            loading={updating || marking || deleting}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

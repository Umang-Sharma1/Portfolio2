'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { GET_PROJECTS, GET_PROJECT_BY_ID } from '@/lib/graphql/queries';
import {
  CREATE_PROJECT,
  UPDATE_PROJECT,
  DELETE_PROJECT,
  TOGGLE_PROJECT_FEATURED,
  BULK_DELETE_PROJECTS,
  UPDATE_PROJECT_ORDER,
  DUPLICATE_PROJECT,
  CHECK_SLUG_AVAILABILITY,
} from '@/lib/graphql/mutations';

// ============================================================================
// TYPES
// ============================================================================

interface Project {
  id: string;
  title: string;
  slug: string;
  tagline?: string;
  description: string;
  category: string;
  status: string;
  featured: boolean;
  technologies: string[];
  images: {
    thumbnail?: string;
    screenshots?: string[];
    banner?: string;
  };
  links: {
    live?: string;
    github?: string;
    demo?: string;
    documentation?: string;
  };
  metrics?: {
    stars?: number;
    forks?: number;
    downloads?: number;
  };
  timeline?: {
    startDate?: string;
    endDate?: string;
    duration?: number;
  };
  views: number;
  clicks?: {
    github: number;
    live: number;
    demo: number;
  };
  features?: string[];
  challenges?: string;
  learnings?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  order?: number;
  createdAt: string;
  updatedAt: string;
}

interface ProjectInput {
  title: string;
  slug?: string;
  tagline?: string;
  description: string;
  category: string;
  status: string;
  featured?: boolean;
  technologies?: string[];
  images?: {
    thumbnail?: string;
    screenshots?: string[];
    banner?: string;
  };
  links?: {
    live?: string;
    github?: string;
    demo?: string;
    documentation?: string;
  };
  timeline?: {
    startDate?: string;
    endDate?: string;
    duration?: number;
  };
  features?: string[];
  challenges?: string;
  learnings?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  order?: number;
}

type SortField = 'createdAt' | 'title' | 'views' | 'order';
type SortOrder = 'asc' | 'desc';
type FilterStatus = 'ALL' | 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED';
type FilterCategory = 'ALL' | 'FRONTEND' | 'BACKEND' | 'FULLSTACK' | 'DATABASE';
type ModalTab = 'basic' | 'technical' | 'media' | 'features' | 'seo';

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

function EditIcon({ className = 'w-5 h-5' }) {
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

function TrashIcon({ className = 'w-5 h-5' }) {
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

function DuplicateIcon({ className = 'w-5 h-5' }) {
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
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );
}

function ChevronUpIcon({ className = 'w-4 h-4' }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
  );
}

function ChevronDownIcon({ className = 'w-4 h-4' }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function CloseIcon({ className = 'w-6 h-6' }) {
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

function StarIcon({ className = 'w-5 h-5', filled = false }) {
  return filled ? (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ) : (
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
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  );
}

function GripIcon({ className = 'w-5 h-5' }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
    </svg>
  );
}

function FilterIcon({ className = 'w-5 h-5' }) {
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
        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
      />
    </svg>
  );
}

function UploadIcon({ className = 'w-8 h-8' }) {
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
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
      />
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

function CheckIcon({ className = 'w-5 h-5' }) {
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

function SpinnerIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={`${className} animate-spin`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

// ============================================================================
// CONSTANTS
// ============================================================================

const CATEGORIES = [
  { value: 'ALL', label: 'All Categories' },
  { value: 'FRONTEND', label: 'Frontend' },
  { value: 'BACKEND', label: 'Backend' },
  { value: 'FULLSTACK', label: 'Full Stack' },
  { value: 'DATABASE', label: 'Database' },
];

const STATUSES = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'PLANNING', label: 'Planning' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'ARCHIVED', label: 'Archived' },
];

const STATUS_COLORS: Record<string, string> = {
  PLANNING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  IN_PROGRESS: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  COMPLETED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  ARCHIVED: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400',
};

const CATEGORY_COLORS: Record<string, string> = {
  FRONTEND: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  BACKEND: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  FULLSTACK: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  DATABASE: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
};

const ITEMS_PER_PAGE = 20;

const POPULAR_TECHNOLOGIES = [
  'React',
  'Next.js',
  'TypeScript',
  'JavaScript',
  'Node.js',
  'Python',
  'Vue.js',
  'Angular',
  'Svelte',
  'Express',
  'NestJS',
  'FastAPI',
  'GraphQL',
  'REST',
  'MongoDB',
  'PostgreSQL',
  'MySQL',
  'Redis',
  'Docker',
  'Kubernetes',
  'AWS',
  'GCP',
  'Azure',
  'Vercel',
  'TailwindCSS',
  'Sass',
  'Material UI',
  'Chakra UI',
  'Framer Motion',
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), wait);
  };
}

// ============================================================================
// BADGE COMPONENT
// ============================================================================

function Badge({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
    >
      {children}
    </span>
  );
}

// ============================================================================
// DROPDOWN COMPONENT
// ============================================================================

function Dropdown({
  value,
  onChange,
  options,
  className = '',
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none ${className}`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

// ============================================================================
// TOGGLE SWITCH COMPONENT
// ============================================================================

function Toggle({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

// ============================================================================
// CONFIRM DIALOG COMPONENT
// ============================================================================

function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Delete',
  confirmVariant = 'danger',
  loading = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  confirmVariant?: 'danger' | 'primary';
  loading?: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 max-w-md w-full mx-4 z-10"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors flex items-center gap-2 ${
              confirmVariant === 'danger'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {loading && <SpinnerIcon className="w-4 h-4" />}
            {confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================================
// PROJECT MODAL COMPONENT
// ============================================================================

function ProjectModal({
  isOpen,
  onClose,
  project,
  onSave,
  loading,
}: {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
  onSave: (data: ProjectInput) => void;
  loading: boolean;
}) {
  const [activeTab, setActiveTab] = useState<ModalTab>('basic');
  const [formData, setFormData] = useState<ProjectInput>({
    title: '',
    slug: '',
    tagline: '',
    description: '',
    category: 'FRONTEND',
    status: 'PLANNING',
    featured: false,
    technologies: [],
    images: { thumbnail: '', screenshots: [], banner: '' },
    links: { live: '', github: '', demo: '', documentation: '' },
    timeline: { startDate: '', endDate: '' },
    features: [],
    challenges: '',
    learnings: '',
    seo: { metaTitle: '', metaDescription: '', keywords: [] },
  });
  const [newFeature, setNewFeature] = useState('');
  const [newTech, setNewTech] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens/closes or project changes
  useEffect(() => {
    if (isOpen && project) {
      setFormData({
        title: project.title || '',
        slug: project.slug || '',
        tagline: project.tagline || '',
        description: project.description || '',
        category: project.category || 'FRONTEND',
        status: project.status || 'PLANNING',
        featured: project.featured || false,
        technologies: project.technologies || [],
        images: project.images || { thumbnail: '', screenshots: [], banner: '' },
        links: project.links || { live: '', github: '', demo: '', documentation: '' },
        timeline: project.timeline
          ? {
              startDate: project.timeline.startDate?.split('T')[0] || '',
              endDate: project.timeline.endDate?.split('T')[0] || '',
            }
          : { startDate: '', endDate: '' },
        features: project.features || [],
        challenges: project.challenges || '',
        learnings: project.learnings || '',
        seo: project.seo || { metaTitle: '', metaDescription: '', keywords: [] },
      });
      setSlugManuallyEdited(true);
    } else if (isOpen && !project) {
      setFormData({
        title: '',
        slug: '',
        tagline: '',
        description: '',
        category: 'FRONTEND',
        status: 'PLANNING',
        featured: false,
        technologies: [],
        images: { thumbnail: '', screenshots: [], banner: '' },
        links: { live: '', github: '', demo: '', documentation: '' },
        timeline: { startDate: '', endDate: '' },
        features: [],
        challenges: '',
        learnings: '',
        seo: { metaTitle: '', metaDescription: '', keywords: [] },
      });
      setSlugManuallyEdited(false);
    }
    setErrors({});
    setActiveTab('basic');
  }, [isOpen, project]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugManuallyEdited && formData.title) {
      setFormData((prev) => ({ ...prev, slug: slugify(prev.title) }));
    }
  }, [formData.title, slugManuallyEdited]);

  const updateField = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const updateNestedField = (parent: string, field: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof ProjectInput] as Record<string, unknown>),
        [field]: value,
      },
    }));
  };

  const addTechnology = () => {
    if (newTech.trim() && !formData.technologies?.includes(newTech.trim())) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...(prev.technologies || []), newTech.trim()],
      }));
      setNewTech('');
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies?.filter((t) => t !== tech) || [],
    }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()],
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || [],
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (formData.links?.live && !isValidUrl(formData.links.live)) {
      newErrors.liveUrl = 'Invalid URL format';
    }

    if (formData.links?.github && !isValidUrl(formData.links.github)) {
      newErrors.githubUrl = 'Invalid URL format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave(formData);
    }
  };

  const tabs: { id: ModalTab; label: string }[] = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'technical', label: 'Technical' },
    { id: 'media', label: 'Media' },
    { id: 'features', label: 'Features' },
    { id: 'seo', label: 'SEO' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-4xl w-full mx-4 my-8 z-10 max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {project ? 'Edit Project' : 'Add New Project'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === tab.id
                  ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <motion.div
                key="basic"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="Project title"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.title ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                    } bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none`}
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => {
                      updateField('slug', e.target.value);
                      setSlugManuallyEdited(true);
                    }}
                    placeholder="project-slug"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.slug ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                    } bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none`}
                  />
                  {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
                  <p className="text-xs text-gray-500 mt-1">
                    URL: /projects/{formData.slug || 'project-slug'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => updateField('tagline', e.target.value)}
                    placeholder="Brief tagline"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Project description (supports markdown)"
                    rows={6}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.description ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                    } bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none`}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <Dropdown
                      value={formData.category}
                      onChange={(value) => updateField('category', value)}
                      options={CATEGORIES.filter((c) => c.value !== 'ALL')}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <Dropdown
                      value={formData.status}
                      onChange={(value) => updateField('status', value)}
                      options={STATUSES.filter((s) => s.value !== 'ALL')}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Toggle
                    checked={formData.featured || false}
                    onChange={(checked) => updateField('featured', checked)}
                  />
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Featured Project
                  </label>
                </div>
              </motion.div>
            )}

            {/* Technical Tab */}
            {activeTab === 'technical' && (
              <motion.div
                key="technical"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Technologies */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Technologies
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.technologies?.map((tech) => (
                      <Badge
                        key={tech}
                        className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechnology(tech)}
                          className="ml-1.5 text-purple-600 hover:text-purple-800"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTech}
                      onChange={(e) => setNewTech(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                      placeholder="Add technology"
                      list="tech-suggestions"
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    />
                    <datalist id="tech-suggestions">
                      {POPULAR_TECHNOLOGIES.filter((t) => !formData.technologies?.includes(t)).map(
                        (tech) => (
                          <option key={tech} value={tech} />
                        )
                      )}
                    </datalist>
                    <button
                      type="button"
                      onClick={addTechnology}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Links */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Links</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Live URL</label>
                      <input
                        type="url"
                        value={formData.links?.live || ''}
                        onChange={(e) => updateNestedField('links', 'live', e.target.value)}
                        placeholder="https://example.com"
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors.liveUrl ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                        } bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">GitHub URL</label>
                      <input
                        type="url"
                        value={formData.links?.github || ''}
                        onChange={(e) => updateNestedField('links', 'github', e.target.value)}
                        placeholder="https://github.com/..."
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors.githubUrl
                            ? 'border-red-500'
                            : 'border-gray-200 dark:border-gray-700'
                        } bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Demo URL</label>
                      <input
                        type="url"
                        value={formData.links?.demo || ''}
                        onChange={(e) => updateNestedField('links', 'demo', e.target.value)}
                        placeholder="https://demo.example.com"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Documentation URL</label>
                      <input
                        type="url"
                        value={formData.links?.documentation || ''}
                        onChange={(e) =>
                          updateNestedField('links', 'documentation', e.target.value)
                        }
                        placeholder="https://docs.example.com"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Timeline</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={formData.timeline?.startDate || ''}
                        onChange={(e) => updateNestedField('timeline', 'startDate', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">End Date</label>
                      <input
                        type="date"
                        value={formData.timeline?.endDate || ''}
                        onChange={(e) => updateNestedField('timeline', 'endDate', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Media Tab */}
            {activeTab === 'media' && (
              <motion.div
                key="media"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Thumbnail */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Thumbnail Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center">
                    {formData.images?.thumbnail ? (
                      <div className="relative inline-block">
                        <img
                          src={formData.images.thumbnail}
                          alt="Thumbnail"
                          className="max-h-40 rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => updateNestedField('images', 'thumbnail', '')}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                        >
                          <CloseIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="py-4">
                        <UploadIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Drop image here or click to upload</p>
                        <input
                          type="url"
                          value={formData.images?.thumbnail || ''}
                          onChange={(e) => updateNestedField('images', 'thumbnail', e.target.value)}
                          placeholder="Or enter image URL"
                          className="mt-3 w-full max-w-md mx-auto px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Banner */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Banner Image
                  </label>
                  <input
                    type="url"
                    value={formData.images?.banner || ''}
                    onChange={(e) => updateNestedField('images', 'banner', e.target.value)}
                    placeholder="Banner image URL"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Screenshots */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Screenshots
                  </label>
                  <p className="text-xs text-gray-500 mb-2">Add screenshot URLs (one per line)</p>
                  <textarea
                    value={formData.images?.screenshots?.join('\n') || ''}
                    onChange={(e) =>
                      updateNestedField(
                        'images',
                        'screenshots',
                        e.target.value.split('\n').filter((s) => s.trim())
                      )
                    }
                    placeholder="https://example.com/screenshot1.png&#10;https://example.com/screenshot2.png"
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none font-mono text-sm"
                  />
                </div>
              </motion.div>
            )}

            {/* Features Tab */}
            {activeTab === 'features' && (
              <motion.div
                key="features"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Key Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Key Features
                  </label>
                  <div className="space-y-2 mb-3">
                    {formData.features?.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                      >
                        <span className="flex-1 text-sm text-gray-900 dark:text-white">
                          {feature}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                      placeholder="Add a feature"
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Challenges */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Challenges & Solutions
                  </label>
                  <textarea
                    value={formData.challenges || ''}
                    onChange={(e) => updateField('challenges', e.target.value)}
                    placeholder="Describe challenges faced and how they were solved..."
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                  />
                </div>

                {/* Learnings */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Key Learnings
                  </label>
                  <textarea
                    value={formData.learnings || ''}
                    onChange={(e) => updateField('learnings', e.target.value)}
                    placeholder="What did you learn from this project?"
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                  />
                </div>
              </motion.div>
            )}

            {/* SEO Tab */}
            {activeTab === 'seo' && (
              <motion.div
                key="seo"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={formData.seo?.metaTitle || ''}
                    onChange={(e) => updateNestedField('seo', 'metaTitle', e.target.value)}
                    placeholder="SEO title (defaults to project title)"
                    maxLength={60}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.seo?.metaTitle?.length || 0}/60 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    value={formData.seo?.metaDescription || ''}
                    onChange={(e) => updateNestedField('seo', 'metaDescription', e.target.value)}
                    placeholder="SEO description (defaults to project description)"
                    maxLength={160}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.seo?.metaDescription?.length || 0}/160 characters
                  </p>
                </div>

                {/* SEO Preview */}
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <p className="text-xs text-gray-500 mb-2">Search Result Preview</p>
                  <div className="space-y-1">
                    <p className="text-blue-600 dark:text-blue-400 text-lg hover:underline cursor-pointer">
                      {formData.seo?.metaTitle || formData.title || 'Project Title'}
                    </p>
                    <p className="text-green-700 dark:text-green-500 text-sm">
                      yoursite.com/projects/{formData.slug || 'project-slug'}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                      {formData.seo?.metaDescription ||
                        formData.description ||
                        'Project description will appear here...'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="text-sm text-gray-500">
            {project
              ? `Last updated: ${format(new Date(project.updatedAt), 'MMM d, yyyy')}`
              : 'Creating new project'}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading && <SpinnerIcon className="w-4 h-4" />}
              {project ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function AdminProjectsPage() {
  // State
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('ALL');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    projectId?: string;
    isBulk?: boolean;
  }>({ isOpen: false });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // GraphQL Queries
  const { data, loading, error, refetch } = useQuery(GET_PROJECTS, {
    variables: {
      filter: {
        ...(filterCategory !== 'ALL' && { category: filterCategory }),
        ...(filterStatus !== 'ALL' && { status: filterStatus }),
        ...(search && { search }),
      },
      sort: { field: sortField, order: sortOrder },
      pagination: { page: currentPage, limit: ITEMS_PER_PAGE },
    },
    fetchPolicy: 'cache-and-network',
  });

  // GraphQL Mutations
  const [createProject, { loading: createLoading }] = useMutation(CREATE_PROJECT, {
    onCompleted: () => {
      showToast('Project created successfully', 'success');
      setIsModalOpen(false);
      refetch();
    },
    onError: (err) => showToast(err.message, 'error'),
  });

  const [updateProject, { loading: updateLoading }] = useMutation(UPDATE_PROJECT, {
    onCompleted: () => {
      showToast('Project updated successfully', 'success');
      setIsModalOpen(false);
      setEditingProject(null);
      refetch();
    },
    onError: (err) => showToast(err.message, 'error'),
  });

  const [deleteProject, { loading: deleteLoading }] = useMutation(DELETE_PROJECT, {
    onCompleted: () => {
      showToast('Project deleted successfully', 'success');
      setDeleteConfirm({ isOpen: false });
      refetch();
    },
    onError: (err) => showToast(err.message, 'error'),
  });

  const [toggleFeatured] = useMutation(TOGGLE_PROJECT_FEATURED, {
    onError: (err) => showToast(err.message, 'error'),
  });

  const [bulkDelete, { loading: bulkDeleteLoading }] = useMutation(BULK_DELETE_PROJECTS, {
    onCompleted: (data) => {
      showToast(`${data.bulkDeleteProjects.deletedCount} projects deleted`, 'success');
      setSelectedIds(new Set());
      setDeleteConfirm({ isOpen: false });
      refetch();
    },
    onError: (err) => showToast(err.message, 'error'),
  });

  const [duplicateProject] = useMutation(DUPLICATE_PROJECT, {
    onCompleted: () => {
      showToast('Project duplicated successfully', 'success');
      refetch();
    },
    onError: (err) => showToast(err.message, 'error'),
  });

  // Extract data
  const projects: Project[] = data?.projects?.edges?.map((e: { node: Project }) => e.node) || [];
  const totalCount = data?.projects?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const pageInfo = data?.projects?.pageInfo;

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Handlers
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.size === projects.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(projects.map((p) => p.id)));
    }
  };

  const handleSelect = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedIds(newSelection);
  };

  const handleToggleFeatured = async (id: string, featured: boolean) => {
    await toggleFeatured({ variables: { id, featured: !featured } });
    refetch();
  };

  const handleSaveProject = (formData: ProjectInput) => {
    if (editingProject) {
      updateProject({ variables: { id: editingProject.id, input: formData } });
    } else {
      createProject({ variables: { input: formData } });
    }
  };

  const handleDelete = () => {
    if (deleteConfirm.isBulk) {
      bulkDelete({ variables: { ids: Array.from(selectedIds) } });
    } else if (deleteConfirm.projectId) {
      deleteProject({ variables: { id: deleteConfirm.projectId } });
    }
  };

  const handleDuplicate = (id: string) => {
    duplicateProject({ variables: { id } });
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  // Debounced search
  const debouncedSearch = useMemo(() => debounce((value: string) => setSearch(value), 300), []);

  // Render sortable header
  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <th
      onClick={() => handleSort(field)}
      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field && (sortOrder === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />)}
      </div>
    </th>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your portfolio projects</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Add Project
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              onChange={(e) => debouncedSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <Dropdown
              value={filterCategory}
              onChange={(v) => setFilterCategory(v as FilterCategory)}
              options={CATEGORIES}
            />
            <Dropdown
              value={filterStatus}
              onChange={(v) => setFilterStatus(v as FilterStatus)}
              options={STATUSES}
            />
            <Dropdown
              value={sortField}
              onChange={(v) => setSortField(v as SortField)}
              options={[
                { value: 'createdAt', label: 'Sort: Recent' },
                { value: 'title', label: 'Sort: Title' },
                { value: 'views', label: 'Sort: Views' },
                { value: 'order', label: 'Sort: Order' },
              ]}
            />
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center gap-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg"
          >
            <span className="text-sm text-purple-700 dark:text-purple-300">
              {selectedIds.size} selected
            </span>
            <button
              onClick={() => setDeleteConfirm({ isOpen: true, isBulk: true })}
              className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 font-medium"
            >
              Delete Selected
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="text-sm text-gray-600 hover:text-gray-700 dark:text-gray-400 font-medium"
            >
              Clear Selection
            </button>
          </motion.div>
        )}
      </div>

      {/* Projects Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading && !data ? (
          <div className="p-12 text-center">
            <SpinnerIcon className="w-8 h-8 mx-auto text-purple-600" />
            <p className="mt-2 text-gray-500">Loading projects...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <p className="text-red-500">Error loading projects: {error.message}</p>
            <button onClick={() => refetch()} className="mt-2 text-purple-600 hover:underline">
              Try again
            </button>
          </div>
        ) : projects.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">No projects found</p>
            <button
              onClick={openCreateModal}
              className="mt-4 inline-flex items-center gap-2 text-purple-600 hover:text-purple-700"
            >
              <PlusIcon className="w-5 h-5" />
              Add your first project
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-4 py-3 w-12">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === projects.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <SortableHeader field="views">Views</SortableHeader>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Featured
                  </th>
                  <SortableHeader field="createdAt">Created</SortableHeader>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {projects.map((project) => (
                  <motion.tr
                    key={project.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(project.id)}
                        onChange={() => handleSelect(project.id)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                          {project.images?.thumbnail ? (
                            <img
                              src={project.images.thumbnail}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <EyeIcon className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {project.title}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            /{project.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Badge className={CATEGORY_COLORS[project.category] || ''}>
                        {project.category}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <Badge className={STATUS_COLORS[project.status] || ''}>
                        {project.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-gray-900 dark:text-white">
                      {project.views?.toLocaleString() || 0}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleToggleFeatured(project.id, project.featured)}
                        className={`p-1 rounded transition-colors ${
                          project.featured
                            ? 'text-yellow-500 hover:text-yellow-600'
                            : 'text-gray-300 hover:text-gray-400 dark:text-gray-600 dark:hover:text-gray-500'
                        }`}
                      >
                        <StarIcon className="w-5 h-5" filled={project.featured} />
                      </button>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(project.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/projects/${project.slug}`}
                          target="_blank"
                          className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Preview"
                        >
                          <ExternalLinkIcon className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDuplicate(project.id)}
                          className="p-2 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                          title="Duplicate"
                        >
                          <DuplicateIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(project)}
                          className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <EditIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ isOpen: true, projectId: project.id })}
                          className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
              {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of {totalCount} projects
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1
                )
                .map((page, index, arr) => (
                  <React.Fragment key={page}>
                    {index > 0 && arr[index - 1] !== page - 1 && (
                      <span className="px-2 py-1.5 text-gray-400">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <ProjectModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingProject(null);
            }}
            project={editingProject}
            onSave={handleSaveProject}
            loading={createLoading || updateLoading}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        <ConfirmDialog
          isOpen={deleteConfirm.isOpen}
          onClose={() => setDeleteConfirm({ isOpen: false })}
          onConfirm={handleDelete}
          title={deleteConfirm.isBulk ? 'Delete Selected Projects' : 'Delete Project'}
          message={
            deleteConfirm.isBulk
              ? `Are you sure you want to delete ${selectedIds.size} selected projects? This action cannot be undone.`
              : 'Are you sure you want to delete this project? This action cannot be undone.'
          }
          confirmText="Delete"
          confirmVariant="danger"
          loading={deleteLoading || bulkDeleteLoading}
        />
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
              toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckIcon className="w-5 h-5" />
            ) : (
              <CloseIcon className="w-5 h-5" />
            )}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

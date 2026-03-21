'use client';

import { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { motion, AnimatePresence } from 'framer-motion';
import { GET_SKILLS } from '@/lib/graphql/queries';
import {
  CREATE_SKILL,
  UPDATE_SKILL,
  DELETE_SKILL,
  SYNC_SKILL_PROJECT_COUNTS,
} from '@/lib/graphql/mutations';

// ============================================================================
// TYPES
// ============================================================================

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  yearsOfExperience: number;
  projectCount: number;
  status: string;
  relatedSkills: string[];
  icon: string;
  color: string;
  description: string;
  views: number;
  lastUsedDate: string;
  proficiencyLevel: string;
  experienceLevel: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SkillInput {
  name: string;
  category: string;
  proficiency: number;
  yearsOfExperience: number;
  icon?: string;
  color?: string;
  description?: string;
  relatedSkills?: string[];
  isActive?: boolean;
}

type FilterCategory =
  | 'ALL'
  | 'FRONTEND'
  | 'BACKEND'
  | 'DATABASE'
  | 'DEVOPS'
  | 'TOOLS'
  | 'DESIGN'
  | 'LANGUAGE'
  | 'OTHER';

// ============================================================================
// ICONS
// ============================================================================

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

function SyncIcon({ className = 'w-4 h-4' }) {
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

const CATEGORIES: FilterCategory[] = [
  'ALL',
  'FRONTEND',
  'BACKEND',
  'DATABASE',
  'DEVOPS',
  'TOOLS',
  'DESIGN',
  'LANGUAGE',
  'OTHER',
];

const CATEGORY_COLORS: Record<string, string> = {
  FRONTEND: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  BACKEND: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  DATABASE: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  DEVOPS: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  TOOLS: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  DESIGN: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
  LANGUAGE: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  OTHER: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
};

// ============================================================================
// SKILL FORM MODAL
// ============================================================================

function SkillFormModal({
  skill,
  isOpen,
  onClose,
  onSave,
  loading,
}: {
  skill: Skill | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: SkillInput) => void;
  loading: boolean;
}) {
  const [form, setForm] = useState<SkillInput>({
    name: skill?.name || '',
    category: skill?.category || 'FRONTEND',
    proficiency: skill?.proficiency || 50,
    yearsOfExperience: skill?.yearsOfExperience || 1,
    icon: skill?.icon || '',
    color: skill?.color || '#3B82F6',
    description: skill?.description || '',
    relatedSkills: skill?.relatedSkills || [],
    isActive: skill?.isActive ?? true,
  });

  const handleChange = (field: keyof SkillInput, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
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
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {skill ? 'Edit Skill' : 'Add New Skill'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <XIcon />
            </button>
          </div>

          {/* Form */}
          <div className="p-6 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g. React"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category *
              </label>
              <select
                value={form.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
              >
                {CATEGORIES.filter((c) => c !== 'ALL').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Proficiency & Experience Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Proficiency ({form.proficiency}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={form.proficiency}
                  onChange={(e) => handleChange('proficiency', parseInt(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Years of Exp
                </label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={form.yearsOfExperience}
                  onChange={(e) => handleChange('yearsOfExperience', parseFloat(e.target.value))}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Icon & Color Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Icon (identifier)
                </label>
                <input
                  type="text"
                  value={form.icon || ''}
                  onChange={(e) => handleChange('icon', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g. react"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={form.color || '#3B82F6'}
                    onChange={(e) => handleChange('color', e.target.value)}
                    className="h-[42px] w-16 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={form.color || ''}
                    onChange={(e) => handleChange('color', e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={form.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder="Brief description..."
              />
            </div>

            {/* Active toggle */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleChange('isActive', !form.isActive)}
                className={`relative w-11 h-6 rounded-full transition-colors ${form.isActive ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isActive ? 'translate-x-5' : ''}`}
                />
              </button>
              <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(form)}
              disabled={loading || !form.name.trim()}
              className="px-5 py-2.5 text-sm font-medium text-white bg-purple-600 rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {skill ? 'Update Skill' : 'Create Skill'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AdminSkillsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<FilterCategory>('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Queries
  const { data, loading, error, refetch } = useQuery(GET_SKILLS, {
    variables: {
      filter: category !== 'ALL' ? { category } : undefined,
      pagination: { limit: 200 },
    },
  });

  // Mutations
  const [createSkill, { loading: creating }] = useMutation(CREATE_SKILL, {
    onCompleted: () => {
      refetch();
      setModalOpen(false);
    },
  });
  const [updateSkill, { loading: updating }] = useMutation(UPDATE_SKILL, {
    onCompleted: () => {
      refetch();
      setModalOpen(false);
      setEditingSkill(null);
    },
  });
  const [deleteSkill, { loading: deleting }] = useMutation(DELETE_SKILL, {
    onCompleted: () => {
      refetch();
      setDeleteConfirm(null);
    },
  });
  const [syncCounts, { loading: syncing }] = useMutation(SYNC_SKILL_PROJECT_COUNTS, {
    onCompleted: () => refetch(),
  });

  const skills: Skill[] = useMemo(() => {
    const edges = data?.skills?.edges || [];
    let result = edges.map((e: any) => e.node);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (s: Skill) => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
      );
    }
    return result;
  }, [data, search]);

  const stats = useMemo(() => {
    return {
      total: skills.length,
      active: skills.filter((s) => s.isActive).length,
      categories: [...new Set(skills.map((s) => s.category))].length,
      avgProficiency: skills.length
        ? Math.round(skills.reduce((a, s) => a + s.proficiency, 0) / skills.length)
        : 0,
    };
  }, [skills]);

  const handleSave = useCallback(
    (formData: SkillInput) => {
      if (editingSkill) {
        updateSkill({ variables: { id: editingSkill.id, input: formData } });
      } else {
        createSkill({ variables: { input: formData } });
      }
    },
    [editingSkill, createSkill, updateSkill]
  );

  const handleDelete = useCallback(
    (id: string) => {
      deleteSkill({ variables: { id } });
    },
    [deleteSkill]
  );

  const openEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setModalOpen(true);
  };

  const openCreate = () => {
    setEditingSkill(null);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Skills</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your skills and technologies
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => syncCounts()}
            disabled={syncing}
            className="px-4 py-2.5 text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-gray-700 dark:text-gray-300"
          >
            <SyncIcon className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            Sync Counts
          </button>
          <button
            onClick={openCreate}
            className="px-4 py-2.5 text-sm font-medium text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-lg shadow-purple-500/25"
          >
            <PlusIcon className="w-4 h-4" />
            Add Skill
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Skills', value: stats.total, color: 'text-purple-600' },
          { label: 'Active', value: stats.active, color: 'text-green-600' },
          { label: 'Categories', value: stats.categories, color: 'text-blue-600' },
          { label: 'Avg Proficiency', value: `${stats.avgProficiency}%`, color: 'text-orange-600' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
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
            placeholder="Search skills..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                category === cat
                  ? 'bg-purple-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
          <p className="text-red-700 dark:text-red-400 font-medium">Failed to load skills</p>
          <button onClick={() => refetch()} className="mt-2 text-sm text-red-600 underline">
            Retry
          </button>
        </div>
      ) : skills.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <p className="text-gray-400 text-lg mb-2">No skills found</p>
          <p className="text-gray-400 text-sm">Add your first skill or adjust filters</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Skill
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Proficiency
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Projects
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {skills.map((skill) => (
                  <motion.tr
                    key={skill.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: skill.color || '#6B7280' }}
                        >
                          {skill.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {skill.name}
                          </p>
                          {skill.icon && <p className="text-xs text-gray-400">{skill.icon}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[skill.category] || CATEGORY_COLORS.OTHER}`}
                      >
                        {skill.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {skill.proficiency}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {skill.yearsOfExperience}y
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {skill.projectCount || 0}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          skill.isActive
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${skill.isActive ? 'bg-green-500' : 'bg-gray-400'}`}
                        />
                        {skill.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(skill)}
                          className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <EditIcon />
                        </button>
                        {deleteConfirm === skill.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(skill.id)}
                              disabled={deleting}
                              className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400 rounded-md"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(skill.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <TrashIcon />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form Modal */}
      <SkillFormModal
        skill={editingSkill}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingSkill(null);
        }}
        onSave={handleSave}
        loading={creating || updating}
      />
    </div>
  );
}

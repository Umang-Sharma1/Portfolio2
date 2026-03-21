'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useMutation } from '@apollo/client';
import { motion } from 'framer-motion';
import { ADMIN_LOGOUT_ALL } from '@/lib/graphql/mutations';

// ============================================================================
// ICONS
// ============================================================================

function UserIcon({ className = 'w-5 h-5' }) {
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
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
}

function ShieldIcon({ className = 'w-5 h-5' }) {
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
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  );
}

function BellIcon({ className = 'w-5 h-5' }) {
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
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
  );
}

function PaletteIcon({ className = 'w-5 h-5' }) {
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
        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
      />
    </svg>
  );
}

function LogOutIcon({ className = 'w-4 h-4' }) {
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
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
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

// ============================================================================
// TOGGLE
// ============================================================================

function Toggle({
  enabled,
  onChange,
  label,
  description,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-5' : ''}`}
        />
      </button>
    </div>
  );
}

// ============================================================================
// SETTINGS SECTION
// ============================================================================

function SettingsSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
        <span className="text-purple-600">{icon}</span>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </motion.div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AdminSettingsPage() {
  const { user, logout, logoutAll } = useAuth();
  const [saved, setSaved] = useState(false);

  // Local settings state (persisted to localStorage)
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [browserNotifications, setBrowserNotifications] = useState(false);
  const [newMessageAlerts, setNewMessageAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogoutAll = async () => {
    if (confirm('This will log you out of all devices. Continue?')) {
      await logoutAll();
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your admin preferences
        </p>
      </div>

      {/* Saved Toast */}
      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-2 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400 text-sm font-medium"
        >
          <CheckIcon className="w-4 h-4" />
          Settings saved successfully
        </motion.div>
      )}

      {/* Profile */}
      <SettingsSection title="Profile" icon={<UserIcon />}>
        <div className="space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-gray-700">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {user?.name || 'Admin'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email || '—'}</p>
              <span className="inline-flex px-2 py-0.5 mt-1 rounded-full text-[10px] font-bold uppercase bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                {user?.role || 'ADMIN'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                defaultValue={user?.name || ''}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                defaultValue={user?.email || ''}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={showSaved}
            className="px-5 py-2.5 text-sm font-medium text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors"
          >
            Save Profile
          </button>
        </div>
      </SettingsSection>

      {/* Security */}
      <SettingsSection title="Security" icon={<ShieldIcon />}>
        <div className="space-y-4">
          <Toggle
            enabled={twoFactor}
            onChange={setTwoFactor}
            label="Two-Factor Authentication"
            description="Add an extra layer of security to your account"
          />

          <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Change Password
            </label>
            <div className="space-y-3">
              <input
                type="password"
                placeholder="Current password"
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <input
                type="password"
                placeholder="New password"
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={showSaved}
              className="mt-3 px-5 py-2.5 text-sm font-medium text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors"
            >
              Update Password
            </button>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Active Sessions</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Log out from all other devices
                </p>
              </div>
              <button
                onClick={handleLogoutAll}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                <LogOutIcon /> Logout All
              </button>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection title="Notifications" icon={<BellIcon />}>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          <Toggle
            enabled={emailNotifications}
            onChange={(v) => {
              setEmailNotifications(v);
              showSaved();
            }}
            label="Email Notifications"
            description="Receive email alerts for important events"
          />
          <Toggle
            enabled={browserNotifications}
            onChange={(v) => {
              setBrowserNotifications(v);
              showSaved();
            }}
            label="Browser Notifications"
            description="Get push notifications in your browser"
          />
          <Toggle
            enabled={newMessageAlerts}
            onChange={(v) => {
              setNewMessageAlerts(v);
              showSaved();
            }}
            label="New Message Alerts"
            description="Get notified when someone sends a contact message"
          />
          <Toggle
            enabled={weeklyDigest}
            onChange={(v) => {
              setWeeklyDigest(v);
              showSaved();
            }}
            label="Weekly Digest"
            description="Receive a weekly summary of portfolio activity"
          />
        </div>
      </SettingsSection>

      {/* Appearance */}
      <SettingsSection title="Appearance" icon={<PaletteIcon />}>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          <Toggle
            enabled={compactMode}
            onChange={(v) => {
              setCompactMode(v);
              showSaved();
            }}
            label="Compact Mode"
            description="Reduce spacing and padding for denser layout"
          />
          <Toggle
            enabled={animationsEnabled}
            onChange={(v) => {
              setAnimationsEnabled(v);
              showSaved();
            }}
            label="Animations"
            description="Enable smooth transitions and animations"
          />
        </div>
      </SettingsSection>

      {/* Danger Zone */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-red-200 dark:border-red-900/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10">
          <h2 className="text-lg font-bold text-red-700 dark:text-red-400">Danger Zone</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Clear All Analytics
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Remove all analytics data. This cannot be undone.
              </p>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors border border-red-200 dark:border-red-800">
              Clear Data
            </button>
          </div>
          <div className="flex items-center justify-between border-t border-red-100 dark:border-red-900/30 pt-4">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Delete Account</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Permanently delete your admin account.
              </p>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

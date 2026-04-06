'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useModalContext } from '@/lib/modal-context';

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

const Icons = {
  // Filled glowing sun — warm gold orb with tapered rays (light/dark modes)
  Sun: ({ isDark }: { isDark?: boolean } = {}) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <defs>
        <radialGradient id="sun-core" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor={isDark ? "#FDE68A" : "#FBBF24"} />
          <stop offset="55%" stopColor={isDark ? "#F59E0B" : "#D97706"} />
          <stop offset="100%" stopColor={isDark ? "#D97706" : "#92400E"} />
        </radialGradient>
        <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={isDark ? "#FCD34D" : "#F59E0B"} stopOpacity={isDark ? "0.35" : "0.45"} />
          <stop offset="100%" stopColor={isDark ? "#F59E0B" : "#D97706"} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Soft outer glow */}
      <circle cx="12" cy="12" r="9" fill="url(#sun-glow)" />
      {/* Rays — tapered elongated diamonds */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
        <ellipse
          key={i}
          cx="12"
          cy="4.2"
          rx="0.9"
          ry="1.8"
          fill={isDark ? "#F59E0B" : "#D97706"}
          fillOpacity={i % 2 === 0 ? (isDark ? 0.9 : 0.95) : (isDark ? 0.55 : 0.7)}
          transform={`rotate(${deg} 12 12)`}
        />
      ))}
      {/* Core orb */}
      <circle cx="12" cy="12" r="4.4" fill="url(#sun-core)" />
      {/* Specular highlight */}
      <ellipse cx="10.4" cy="10.5" rx="1.4" ry="0.9" fill="white" fillOpacity={isDark ? "0.55" : "0.35"} transform="rotate(-30 10.4 10.5)" />
    </svg>
  ),

  // Filled crescent moon — silvery-blue with inner luminance (light/dark modes)
  Moon: ({ isDark }: { isDark?: boolean } = {}) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <defs>
        <radialGradient id="moon-fill" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor={isDark ? "#E2E8F0" : "#CBD5E1"} />
          <stop offset="45%" stopColor={isDark ? "#94A3B8" : "#64748B"} />
          <stop offset="100%" stopColor={isDark ? "#475569" : "#334155"} />
        </radialGradient>
      </defs>
      {/* Soft glow ring */}
      <circle cx="12" cy="12" r="8.5" fill={isDark ? "#94A3B8" : "#64748B"} fillOpacity={isDark ? "0.08" : "0.12"} />
      {/* Moon body */}
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        fill="url(#moon-fill)"
      />
      {/* Inner crescent shadow to add depth */}
      <path
        d="M18.5 14.5A6.5 6.5 0 0 1 10 6a6.5 6.5 0 0 0 8.5 8.5z"
        fill={isDark ? "#1E293B" : "#334155"}
        fillOpacity={isDark ? "0.18" : "0.25"}
      />
      {/* Specular arc on crescent tip */}
      <ellipse cx="13.8" cy="5.8" rx="1.1" ry="0.55" fill="white" fillOpacity={isDark ? "0.5" : "0.25"} transform="rotate(-40 13.8 5.8)" />
      {/* Small star dots */}
      <circle cx="19" cy="6" r="0.7" fill={isDark ? "#E2E8F0" : "#94A3B8"} fillOpacity={isDark ? "0.7" : "0.6"} />
      <circle cx="21" cy="9.5" r="0.45" fill={isDark ? "#CBD5E1" : "#64748B"} fillOpacity={isDark ? "0.6" : "0.5"} />
    </svg>
  ),

  // Filled waveform with glowing hot segment
  Activity: ({ className }: { className?: string }) => (
    <svg className={className} width="12" height="12" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="wave-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.4" />
          <stop offset="55%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {/* Filled area under waveform */}
      <path
        d="M2 12h4l2-7 5 14 3-7 2 0 1-2h5"
        fill="none"
        stroke="url(#wave-grad)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Hot segment glow dot */}
      <circle cx="15.5" cy="12" r="1.5" fill="currentColor" fillOpacity="0.9" />
    </svg>
  ),

  // Context switcher — layered hexagon (honeycomb cell cluster) with light/dark support
  Command: ({ isDark }: { isDark?: boolean } = {}) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="hex-a" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isDark ? "#22D3EE" : "#0891B2"} stopOpacity={isDark ? "0.9" : "0.8"} />
          <stop offset="100%" stopColor={isDark ? "#0891B2" : "#0E7490"} stopOpacity={isDark ? "0.7" : "0.8"} />
        </linearGradient>
        <linearGradient id="hex-b" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={isDark ? "#A78BFA" : "#7C3AED"} stopOpacity={isDark ? "0.85" : "0.8"} />
          <stop offset="100%" stopColor={isDark ? "#6D28D9" : "#5B21B6"} stopOpacity={isDark ? "0.65" : "0.7"} />
        </linearGradient>
        <linearGradient id="hex-c" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={isDark ? "#FDE68A" : "#D97706"} stopOpacity={isDark ? "0.9" : "0.85"} />
          <stop offset="100%" stopColor={isDark ? "#D97706" : "#92400E"} stopOpacity={isDark ? "0.7" : "0.75"} />
        </linearGradient>
      </defs>
      {/* Center hex — amber */}
      <path d="M12 3.5L15.2 7V10.5L12 14L8.8 10.5V7Z" fill="url(#hex-c)" />
      {/* Top-left hex — cyan */}
      <path d="M6.4 0.5L9.6 4V7.5L6.4 11L3.2 7.5V4Z" fill="url(#hex-a)" fillOpacity={isDark ? "0.75" : "0.65"} />
      {/* Top-right hex — violet */}
      <path d="M17.6 0.5L20.8 4V7.5L17.6 11L14.4 7.5V4Z" fill="url(#hex-b)" fillOpacity={isDark ? "0.75" : "0.65"} />
      {/* Bottom hex — muted cyan */}
      <path d="M12 10.5L15.2 14V17.5L12 21L8.8 17.5V14Z" fill="url(#hex-a)" fillOpacity={isDark ? "0.45" : "0.35"} />
      {/* Center specular */}
      <path d="M10 4.8L12 3.8L14 4.8" stroke="white" strokeOpacity={isDark ? "0.4" : "0.2"} strokeWidth="0.6" strokeLinecap="round" fill="none" />
    </svg>
  ),

  // Menu — three colorful stacked lines with light/dark support
  Menu: ({ isDark }: { isDark?: boolean } = {}) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="ml-1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={isDark ? "#22D3EE" : "#0891B2"} />
          <stop offset="100%" stopColor={isDark ? "#06B6D4" : "#0E7490"} />
        </linearGradient>
        <linearGradient id="ml-2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={isDark ? "#A78BFA" : "#7C3AED"} />
          <stop offset="100%" stopColor={isDark ? "#7C3AED" : "#5B21B6"} />
        </linearGradient>
        <linearGradient id="ml-3" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={isDark ? "#F59E0B" : "#D97706"} />
          <stop offset="100%" stopColor={isDark ? "#D97706" : "#92400E"} />
        </linearGradient>
      </defs>
      {/* Top bar — cyan, full width */}
      <rect x="3" y="5" width="18" height="2.8" rx="1.4" fill="url(#ml-1)" />
      <rect x="3.5" y="5.3" width="4" height="0.9" rx="0.4" fill="white" fillOpacity={isDark ? "0.35" : "0.15"} />
      {/* Middle bar — violet, shorter */}
      <rect x="3" y="10.6" width="13" height="2.8" rx="1.4" fill="url(#ml-2)" />
      <rect x="3.5" y="10.9" width="3" height="0.9" rx="0.4" fill="white" fillOpacity={isDark ? "0.25" : "0.1"} />
      {/* Bottom bar — amber, shortest */}
      <rect x="3" y="16.2" width="9" height="2.8" rx="1.4" fill="url(#ml-3)" />
      <rect x="3.5" y="16.5" width="2" height="0.9" rx="0.4" fill="white" fillOpacity={isDark ? "0.3" : "0.12"} />
    </svg>
  ),

  // Close — glowing ✕ inside a colored octagonal ring
  X: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="xclose-ring" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#DC2626" />
        </linearGradient>
        <radialGradient id="xclose-bg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#EF4444" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#EF4444" stopOpacity="0.04" />
        </radialGradient>
      </defs>
      {/* Filled tinted circle background */}
      <circle cx="12" cy="12" r="10.5" fill="url(#xclose-bg)" />
      {/* Colored ring */}
      <circle cx="12" cy="12" r="10.5" fill="none" stroke="url(#xclose-ring)" strokeOpacity="0.55" strokeWidth="1.2" />
      {/* Inner indicator ring */}
      <circle cx="12" cy="12" r="7.5" fill="none" stroke="#EF4444" strokeOpacity="0.15" strokeWidth="0.5" />
      {/* 4 corner tick marks */}
      <line x1="12" y1="1" x2="12" y2="3.5" stroke="#EF4444" strokeOpacity="0.4" strokeWidth="1" strokeLinecap="round" />
      <line x1="12" y1="20.5" x2="12" y2="23" stroke="#EF4444" strokeOpacity="0.4" strokeWidth="1" strokeLinecap="round" />
      <line x1="1" y1="12" x2="3.5" y2="12" stroke="#EF4444" strokeOpacity="0.4" strokeWidth="1" strokeLinecap="round" />
      <line x1="20.5" y1="12" x2="23" y2="12" stroke="#EF4444" strokeOpacity="0.4" strokeWidth="1" strokeLinecap="round" />
      {/* X strokes — bright red */}
      <path d="M8.5 8.5L15.5 15.5" stroke="#EF4444" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M15.5 8.5L8.5 15.5" stroke="#EF4444" strokeWidth="2.2" strokeLinecap="round" />
      {/* Center node */}
      <circle cx="12" cy="12" r="1.2" fill="#EF4444" />
      {/* Top arc specular */}
      <path d="M8 3.5 A9 9 0 0 1 16 3.5" stroke="white" strokeOpacity="0.25" strokeWidth="0.8" fill="none" strokeLinecap="round" />
    </svg>
  ),

  // ── Umang Sharma monogram — vivid absolute colors, works on light & dark
  UmangLogo: () => (
    <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
      <defs>
        {/* Left pillar — deep cyan */}
        <linearGradient id="ul-left" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#67E8F9" />
          <stop offset="55%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#0E7490" />
        </linearGradient>
        {/* Right pillar — deep violet */}
        <linearGradient id="ul-right" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#C4B5FD" />
          <stop offset="55%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#4C1D95" />
        </linearGradient>
        {/* Arch — amber bridge */}
        <linearGradient id="ul-arch" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="40%" stopColor="#F59E0B" />
          <stop offset="60%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
        {/* Gold jewel */}
        <linearGradient id="ul-jewel" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>
        {/* Outer glow ring */}
        <radialGradient id="ul-ring-glow" cx="50%" cy="50%" r="50%">
          <stop offset="60%" stopColor="#06B6D4" stopOpacity="0" />
          <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.25" />
        </radialGradient>
      </defs>

      {/* Outer colored halos — visible even on light bg */}
      <circle cx="16" cy="16" r="15" fill="url(#ul-ring-glow)" />
      <circle cx="16" cy="16" r="14.5" fill="none" stroke="#06B6D4" strokeOpacity="0.35" strokeWidth="0.7" />
      <circle cx="16" cy="16" r="13.5" fill="none" stroke="#7C3AED" strokeOpacity="0.2" strokeWidth="0.4" />

      {/* ── U body ── */}
      {/* Left pillar */}
      <rect x="5" y="5.5" width="5.2" height="15" rx="2.6" fill="url(#ul-left)" />
      {/* Right pillar */}
      <rect x="21.8" y="5.5" width="5.2" height="15" rx="2.6" fill="url(#ul-right)" />
      {/* Arch — thick stroke making the U base */}
      <path
        d="M7.6 18 Q7.6 27 16 27 Q24.4 27 24.4 18"
        fill="none"
        stroke="url(#ul-arch)"
        strokeWidth="5.2"
        strokeLinecap="round"
      />

      {/* Pillar speculars */}
      <rect x="6.2" y="6.5" width="2.4" height="1.1" rx="0.5" fill="white" fillOpacity="0.6" />
      <rect x="22.9" y="6.5" width="2.4" height="1.1" rx="0.5" fill="white" fillOpacity="0.45" />

      {/* Arch inner highlight */}
      <path
        d="M10.2 18.5 Q10.2 23.5 16 23.5 Q21.8 23.5 21.8 18.5"
        fill="none" stroke="white" strokeOpacity="0.3" strokeWidth="1.4" strokeLinecap="round"
      />

      {/* ── Jewel badge — top right ── */}
      {/* Jewel shadow */}
      <circle cx="27.3" cy="7" r="4" fill="#000" fillOpacity="0.18" />
      {/* Jewel fill */}
      <circle cx="27" cy="6.5" r="4" fill="url(#ul-jewel)" />
      {/* Jewel border ring */}
      <circle cx="27" cy="6.5" r="4" fill="none" stroke="white" strokeOpacity="0.4" strokeWidth="0.6" />
      {/* Jewel facet lines */}
      <path d="M24.5 5L27 3.5L29.5 5L29.5 7.2L27 8.9L24.5 7.2Z"
        fill="none" stroke="white" strokeOpacity="0.35" strokeWidth="0.5" />
      {/* Jewel specular */}
      <ellipse cx="25.9" cy="5.2" rx="1.2" ry="0.6" fill="white" fillOpacity="0.7"
        transform="rotate(-30 25.9 5.2)" />
    </svg>
  ),

  // ── Nav section icons — absolute-color glyphs, visible in light & dark ─

  // Home — bold house with warm amber roof + cyan window
  NavHome: () => (
    <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
      <defs>
        <linearGradient id="nh-roof" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>
        <linearGradient id="nh-wall" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#64748B" />
        </linearGradient>
      </defs>
      {/* Walls */}
      <path d="M2.5 7.2V12.5H5.5V9.8H8.5V12.5H11.5V7.2Z" fill="url(#nh-wall)" />
      {/* Door */}
      <rect x="5.8" y="9.8" width="2.4" height="2.7" rx="1.2" fill="#334155" fillOpacity="0.7" />
      {/* Roof */}
      <path d="M0.8 7.5L7 1.2L13.2 7.5Z" fill="url(#nh-roof)" />
      {/* Chimney */}
      <rect x="9" y="3.5" width="1.4" height="2.5" rx="0.5" fill="#EA580C" fillOpacity="0.85" />
      {/* Roof ridge specular */}
      <path d="M3.5 6L7 2.6L10.5 6" stroke="white" strokeOpacity="0.35" strokeWidth="0.6" fill="none" strokeLinecap="round" />
      {/* Window — glowing cyan */}
      <rect x="5.9" y="8.4" width="2.2" height="2.2" rx="0.5" fill="#22D3EE" fillOpacity="0.85" />
      <rect x="6.2" y="8.6" width="0.8" height="0.8" rx="0.2" fill="white" fillOpacity="0.5" />
    </svg>
  ),

  // Skills — diamond gem with vivid cyan/violet facets
  NavSkills: () => (
    <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
      <defs>
        <linearGradient id="ns-top" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
        <linearGradient id="ns-left" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#0E7490" />
        </linearGradient>
        <linearGradient id="ns-right" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#67E8F9" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      {/* Left lower facet */}
      <path d="M1.5 6L7 13L3.5 6Z" fill="url(#ns-left)" />
      {/* Right lower facet */}
      <path d="M12.5 6L7 13L10.5 6Z" fill="url(#ns-right)" />
      {/* Belt */}
      <path d="M1.5 6L3.5 2.2H10.5L12.5 6Z" fill="url(#ns-top)" />
      {/* Table top — bright cap */}
      <path d="M3.5 2.2L10.5 2.2L7 0.6Z" fill="#C4B5FD" />
      {/* Center belt divider */}
      <line x1="1.5" y1="6" x2="12.5" y2="6" stroke="white" strokeOpacity="0.25" strokeWidth="0.5" />
      {/* Vertical center crease */}
      <line x1="7" y1="6" x2="7" y2="13" stroke="white" strokeOpacity="0.15" strokeWidth="0.4" />
      {/* Top specular */}
      <path d="M5 1.5L9 1.5" stroke="white" strokeOpacity="0.5" strokeWidth="0.7" strokeLinecap="round" />
    </svg>
  ),

  // Projects — layered cards with colored edges
  NavProjects: () => (
    <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
      <defs>
        <linearGradient id="np-back" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#4C1D95" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="np-mid" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#0369A1" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="np-front" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      {/* Back card */}
      <rect x="4.5" y="1" width="8.5" height="5.5" rx="1.3" fill="url(#np-back)" />
      {/* Middle card */}
      <rect x="2.5" y="4" width="8.5" height="5.5" rx="1.3" fill="url(#np-mid)" />
      {/* Front card */}
      <rect x="0.5" y="7" width="8.5" height="5.5" rx="1.3" fill="url(#np-front)" />
      {/* Front card text lines */}
      <rect x="1.4" y="8.1" width="4.5" height="0.85" rx="0.4" fill="white" fillOpacity="0.5" />
      <rect x="1.4" y="9.8" width="3" height="0.7" rx="0.35" fill="white" fillOpacity="0.3" />
      <rect x="1.4" y="11.2" width="3.8" height="0.7" rx="0.35" fill="white" fillOpacity="0.2" />
    </svg>
  ),

  // Experience — vertical timeline with vivid nodes
  NavExperience: () => (
    <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
      <defs>
        <linearGradient id="ne-spine" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {/* Spine */}
      <rect x="6.3" y="1.5" width="1.4" height="11" rx="0.7" fill="url(#ne-spine)" />
      {/* Node 1 — amber */}
      <circle cx="7" cy="3" r="2.2" fill="#F59E0B" />
      <circle cx="6.3" cy="2.3" r="0.7" fill="white" fillOpacity="0.55" />
      {/* Node 2 — cyan */}
      <circle cx="7" cy="7.5" r="1.8" fill="#06B6D4" />
      <circle cx="6.4" cy="6.9" r="0.55" fill="white" fillOpacity="0.45" />
      {/* Node 3 — violet */}
      <circle cx="7" cy="11.5" r="1.4" fill="#7C3AED" />
      <circle cx="6.5" cy="11" r="0.42" fill="white" fillOpacity="0.4" />
    </svg>
  ),

  // Contact — envelope with vivid gradient + red seal
  NavContact: () => (
    <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
      <defs>
        <linearGradient id="nc-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>
        <linearGradient id="nc-flap" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      {/* Envelope body */}
      <rect x="1" y="3.5" width="12" height="8.5" rx="1.5" fill="url(#nc-body)" />
      {/* Flap line — colorful gradient V */}
      <path d="M1.5 4.2L7 8.8L12.5 4.2" fill="none" stroke="url(#nc-flap)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
      {/* Bottom fold */}
      <path d="M1.5 11.5L5.5 8.5" stroke="#94A3B8" strokeOpacity="0.25" strokeWidth="0.6" strokeLinecap="round" />
      <path d="M12.5 11.5L8.5 8.5" stroke="#94A3B8" strokeOpacity="0.25" strokeWidth="0.6" strokeLinecap="round" />
      {/* Wax seal — red */}
      <circle cx="7" cy="8.2" r="1.5" fill="#EF4444" />
      <circle cx="6.55" cy="7.8" r="0.5" fill="white" fillOpacity="0.55" />
    </svg>
  ),
};

// ─── NeuralPulse — organic neural cluster with animated signal arcs ─────────
const NeuralPulse = () => {
  // 5 nodes at fixed positions (cx, cy) + their colors
  const nodes = [
    { cx: 14, cy: 4,  r: 2,    color: '#22D3EE', delay: 0 },
    { cx: 4,  cy: 13, r: 1.6,  color: '#7C3AED', delay: 0.7 },
    { cx: 24, cy: 11, r: 1.6,  color: '#F59E0B', delay: 1.3 },
    { cx: 9,  cy: 23, r: 1.4,  color: '#22D3EE', delay: 1.9 },
    { cx: 21, cy: 22, r: 1.4,  color: '#EF4444', delay: 2.4 },
  ];
  // Edges: pairs of node indices
  const edges = [
    [0, 1], [0, 2], [1, 3], [2, 4], [1, 2], [3, 4], [0, 3],
  ] as const;

  return (
    <div className="relative w-7 h-7">
      <svg viewBox="0 0 28 28" className="w-7 h-7" fill="none">
        <defs>
          {nodes.map((n, i) => (
            <radialGradient key={i} id={`npn-${i}`} cx="40%" cy="35%" r="60%">
              <stop offset="0%" stopColor="white" stopOpacity="0.9" />
              <stop offset="100%" stopColor={n.color} stopOpacity="0.8" />
            </radialGradient>
          ))}
        </defs>

        {/* Static edges */}
        {edges.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a].cx} y1={nodes[a].cy}
            x2={nodes[b].cx} y2={nodes[b].cy}
            stroke={nodes[a].color}
            strokeOpacity="0.18"
            strokeWidth="0.7"
          />
        ))}

        {/* Static node base rings */}
        {nodes.map((n, i) => (
          <circle
            key={i}
            cx={n.cx} cy={n.cy} r={n.r + 1.2}
            fill={n.color} fillOpacity="0.08"
          />
        ))}

        {/* Filled node cores */}
        {nodes.map((n, i) => (
          <circle
            key={i}
            cx={n.cx} cy={n.cy} r={n.r}
            fill={`url(#npn-${i})`}
          />
        ))}
      </svg>

      {/* Animated signal pulses — one per edge */}
      {edges.map(([a, b], i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: '3px', height: '3px',
            background: nodes[a].color,
            boxShadow: `0 0 5px ${nodes[a].color}`,
            // Start at node A position (normalized to 28px viewBox, div is 28px = w-7)
            left: `${(nodes[a].cx / 28) * 100}%`,
            top:  `${(nodes[a].cy / 28) * 100}%`,
            translateX: '-50%',
            translateY: '-50%',
          }}
          animate={{
            left: [
              `${(nodes[a].cx / 28) * 100}%`,
              `${(nodes[b].cx / 28) * 100}%`,
            ],
            top: [
              `${(nodes[a].cy / 28) * 100}%`,
              `${(nodes[b].cy / 28) * 100}%`,
            ],
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1.2, 1, 0.4],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            delay: i * 0.38,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

type NavContext = 'LOCAL' | 'GLOBAL';

const NavItem = ({
  name,
  id,
  isActive,
  onClick,
  isExternal = false,
  icon: NavIcon,
}: {
  name: string;
  id: string;
  isActive: boolean;
  onClick: () => void;
  isExternal?: boolean;
  icon?: React.ComponentType;
}) => {
  return (
    <motion.button
      onClick={onClick}
      data-active={isActive ? 'true' : undefined}
      whileHover={{ y: -1 }}
      transition={{ type: 'spring', stiffness: 420, damping: 24 }}
      className={cn(
        'group nav-glow-item relative px-4 py-2 text-[10px] font-mono font-black tracking-[0.3em] uppercase rounded-lg transition-colors duration-200',
        isActive
          ? 'text-vision-cyan'
          : 'text-slate-600 dark:text-slate-400 hover:text-vision-cyan'
      )}
    >
      {isActive && (
        <motion.div
          layoutId="nav-active-pill"
          className="absolute inset-0 rounded-lg bg-vision-cyan/12 border border-vision-cyan/40 shadow-[0_0_20px_rgba(var(--glow-cyan),0.25),inset_0_0_12px_rgba(var(--glow-cyan),0.06)]"
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        />
      )}
      {/* Hover fill — only when not active */}
      {!isActive && (
        <span className="absolute inset-0 rounded-lg bg-slate-100 dark:bg-white/[0.06] opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none" />
      )}
      <span className="relative flex items-center gap-1.5">
        {NavIcon && <NavIcon />}
        {name}
        {isExternal && <span className="h-1 w-1 rounded-full bg-vision-orange" />}
      </span>
    </motion.button>
  );
};

export const Header = () => {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const { isModalOpen } = useModalContext();
  const isHomePage = pathname === '/';
  const [navContext, setNavContext] = useState<NavContext>(isHomePage ? 'LOCAL' : 'GLOBAL');
  const [isHidden, setIsHidden] = useState(false);
  const [currentSection, setCurrentSection] = useState(
    isHomePage
      ? 'HOME'
      : pathname === '/skills'
        ? 'SKILLS'
        : pathname === '/projects'
          ? 'PROJECTS'
          : pathname === '/contact'
            ? 'CONTACT'
            : 'HOME'
  );
  const [memory, setMemory] = useState('12.4MB');
  const [uptime, setUptime] = useState('00:00:00');
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const startTime = useRef(Date.now());
  const { scrollYProgress } = useScroll();
  const progressScaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-switch nav context and section label based on route
  useEffect(() => {
    if (pathname === '/') {
      setNavContext('LOCAL');
      setCurrentSection('HOME');
    } else {
      setNavContext('GLOBAL');
      if (pathname === '/skills') setCurrentSection('SKILLS');
      else if (pathname === '/projects') setCurrentSection('PROJECTS');
      else if (pathname === '/contact') setCurrentSection('CONTACT');
      else setCurrentSection(pathname.replace('/', '').toUpperCase());
    }
  }, [pathname]);

  useEffect(() => {
    let prevScroll = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const current = window.scrollY;

        // Auto-hide logic
        if (current > prevScroll && current > 150) setIsHidden(true);
        else setIsHidden(false);
        prevScroll = current;

        // Section tracking (only on home page)
        if (pathname === '/') {
          const sectionMap: Record<string, string> = {
            home: 'HOME',
            skills: 'SKILLS',
            projects: 'PROJECTS',
            timeline: 'EXPERIENCE',
            contact: 'CONTACT',
          };
          // Iterate in reverse so deeper sections are matched first
          const sections = ['contact', 'timeline', 'projects', 'skills', 'home'];
          let found = false;
          for (const s of sections) {
            const el = document.getElementById(s);
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= 300) {
                setCurrentSection(sectionMap[s] || s.toUpperCase());
                found = true;
                break;
              }
            }
          }
          if (!found || current < 200) setCurrentSection('HOME');
        }

        ticking = false;
      });
    };

    const updateStats = () => {
      // Memory Simulation
      const randomMem = (12 + Math.random() * 2).toFixed(1);
      setMemory(`${randomMem}MB`);

      // Uptime Calculation
      const diff = Date.now() - startTime.current;
      const h = Math.floor(diff / 3600000)
        .toString()
        .padStart(2, '0');
      const m = Math.floor((diff % 3600000) / 60000)
        .toString()
        .padStart(2, '0');
      const s = Math.floor((diff % 60000) / 1000)
        .toString()
        .padStart(2, '0');
      setUptime(`${h}:${m}:${s}`);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run once on mount
    const timer = setInterval(updateStats, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, [pathname]);

  const localItems = [
    { name: 'Home', id: 'home', icon: Icons.NavHome },
    { name: 'Skills', id: 'skills', icon: Icons.NavSkills },
    { name: 'Projects', id: 'projects', icon: Icons.NavProjects },
    { name: 'Experience', id: 'timeline', icon: Icons.NavExperience },
    { name: 'Contact', id: 'contact', icon: Icons.NavContact },
  ];

  const globalItems = [
    { name: 'Home', id: '/', external: false, icon: Icons.NavHome },
    { name: 'Skills', id: '/skills', external: true, icon: Icons.NavSkills },
    { name: 'Projects', id: '/projects', external: true, icon: Icons.NavProjects },
    { name: 'Contact', id: '/contact', external: true, icon: Icons.NavContact },
  ];

  const handleAction = (id: string, external: boolean) => {
    if (external || id.startsWith('/')) {
      window.location.href = id;
    } else {
      const el = document.getElementById(id);
      if (el) window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  // Derive active nav id from currentSection — computed fresh every render
  const sectionToNavId: Record<string, string> = {
    home: 'home',
    skills: 'skills',
    projects: 'projects',
    experience: 'timeline',
    contact: 'contact',
  };
  const activeNavId = sectionToNavId[currentSection.toLowerCase()] || 'home';

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] z-[1001] origin-left pointer-events-none bg-gradient-to-r from-vision-cyan via-vision-crimson to-vision-orange"
        style={{ scaleX: progressScaleX }}
      />

      <header className="fixed top-0 left-0 right-0 z-[1000] p-4 md:p-6 pointer-events-none">
        <motion.div
          animate={{
            y: isHidden || isModalOpen ? -120 : 0,
            opacity: isHidden || isModalOpen ? 0 : 1,
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[1500px] mx-auto flex items-center justify-between pointer-events-auto"
        >
          {/* Left Telemetry Wing */}
          <div className="flex items-center gap-4 md:gap-6">
            <div
              className="flex items-center gap-3 md:gap-4 group cursor-pointer bg-white/80 dark:bg-black/20 p-2 pr-4 md:pr-6 rounded-2xl border border-slate-200 dark:border-white/10 glassmorphism transition-all hover:border-vision-cyan/40 shadow-lg"
              onClick={() => setNavContext(navContext === 'LOCAL' ? 'GLOBAL' : 'LOCAL')}
            >
              <div className="h-9 w-9 md:h-10 md:w-10 rounded-xl flex items-center justify-center border group-hover:scale-110 transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #E0F7FA 0%, #EDE9FE 50%, #FEF3C7 100%)',
                  border: '1px solid rgba(139,92,246,0.35)',
                  boxShadow: '0 0 14px rgba(139,92,246,0.18), 0 0 7px rgba(34,211,238,0.14), inset 0 1px 0 rgba(255,255,255,0.7)'
                }}
              >
                <Icons.UmangLogo />
              </div>
              <div className="space-y-0.5">
                <h1 className="text-[9px] md:text-[10px] font-mono font-black tracking-[0.3em] uppercase text-slate-800 dark:text-text-dark">
                  Umang.OS
                </h1>
                <div className="flex items-center gap-2 text-[7px] md:text-[8px] font-mono font-black text-vision-cyan tracking-widest uppercase">
                  <Icons.Activity className="animate-pulse" /> {currentSection}
                </div>
              </div>
            </div>

            <div className="hidden 2xl:flex items-center gap-6 pl-6 border-l border-slate-200 dark:border-white/10">
              <div className="space-y-0.5">
                <div className="text-[7px] font-mono font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  MODE
                </div>
                <div className="text-[9px] font-mono font-black text-vision-cyan uppercase tracking-tighter italic">
                  {navContext}_MAP
                </div>
              </div>
            </div>
          </div>

          {/* Central Command Dock - Desktop */}
          <nav className="relative hidden lg:block">
            <div className="glassmorphism px-3 py-2 rounded-[2rem] border border-slate-200 dark:border-white/10 flex items-center gap-1 shadow-2xl backdrop-blur-[40px] bg-white/80 dark:bg-space-black/60">
              <div className="flex items-center gap-1">
                {(navContext === 'LOCAL' ? localItems : globalItems).map((item) => {
                  const isItemActive =
                    navContext === 'LOCAL'
                      ? activeNavId === item.id
                      : item.id === '/'
                        ? pathname === '/'
                        : pathname.startsWith(item.id);
                  return (
                    <NavItem
                      key={item.id}
                      name={item.name}
                      id={item.id}
                      isActive={isItemActive}
                      onClick={() => handleAction(item.id, (item as any).external || false)}
                      isExternal={(item as any).external}
                      icon={(item as any).icon}
                    />
                  );
                })}
              </div>

              {isHomePage && (
                <>
                  <div className="h-6 w-[1px] bg-slate-200 dark:bg-white/10 mx-2" />
                  <button
                    onClick={() => setNavContext(navContext === 'LOCAL' ? 'GLOBAL' : 'LOCAL')}
                    className="p-2 text-slate-500 dark:text-slate-400 hover:text-vision-cyan transition-colors"
                    title="Toggle Navigation Mode"
                  >
                    <Icons.Command isDark={theme === 'dark'} />
                  </button>
                </>
              )}
            </div>
          </nav>

          {/* Right Telemetry Wing */}
          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden lg:flex items-center gap-6 md:gap-8 px-4 md:px-6 py-2 glassmorphism border border-slate-200 dark:border-white/5 rounded-2xl bg-white/80 dark:bg-white/5 shadow-lg">
              <div className="space-y-0.5">
                <div className="text-[7px] font-mono font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  MEM_LOAD
                </div>
                <div className="text-[10px] font-mono font-black text-slate-800 dark:text-text-dark tabular-nums tracking-tighter">
                  {memory}
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[7px] font-mono font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  MISSION_TIME
                </div>
                <div className="text-[10px] font-mono font-black text-slate-800 dark:text-text-dark tabular-nums tracking-tighter">
                  {uptime}
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[7px] font-mono font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  NEURAL
                </div>
                <div className="mt-0.5">
                  <NeuralPulse />
                </div>
              </div>
            </div>

            {mounted && (
              <motion.button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                whileHover={{ scale: 1.08, y: -1 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="h-10 w-10 md:h-12 md:w-12 glassmorphism rounded-2xl flex items-center justify-center hover:border-vision-cyan/50 transition-colors border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/5 shadow-lg"
                aria-label="Toggle Theme"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={theme}
                    initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 30, opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center justify-center"
                  >
                    {theme === 'dark' ? <Icons.Sun isDark={true} /> : <Icons.Moon isDark={false} />}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(true)}
              whileHover={{ scale: 1.08, y: -1 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="lg:hidden h-10 w-10 flex items-center justify-center text-slate-600 dark:text-white/60 hover:text-vision-cyan transition-colors glassmorphism rounded-xl border border-slate-200 dark:border-white/10"
              aria-label="Open Menu"
            >
              <Icons.Menu isDark={theme === 'dark'} />
            </motion.button>
          </div>
        </motion.div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[2000] flex flex-col overflow-hidden bg-white dark:bg-space-black"
          >
            {/* Subtle grid overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.025] dark:opacity-[0.04]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(34,211,238,1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,1) 1px, transparent 1px)',
                backgroundSize: '64px 64px',
              }}
            />
            {/* Cyan accent glow top-right */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-vision-cyan/5 dark:bg-vision-cyan/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top header bar */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex items-center justify-between px-8 py-5 border-b border-slate-100 dark:border-white/[0.06]"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #E0F7FA 0%, #EDE9FE 50%, #FEF3C7 100%)',
                    border: '1px solid rgba(139,92,246,0.35)',
                    boxShadow: '0 0 14px rgba(139,92,246,0.2), inset 0 1px 0 rgba(255,255,255,0.7)'
                  }}
                >
                  <Icons.UmangLogo />
                </div>
                <div>
                  <div className="text-[9px] font-mono font-black tracking-[0.3em] uppercase text-slate-800 dark:text-text-dark">
                    Umang.OS
                  </div>
                  <div className="flex items-center gap-1.5 text-[7px] font-mono font-black text-vision-cyan tracking-widest uppercase">
                    <Icons.Activity className="animate-pulse" /> {currentSection}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center text-slate-500 dark:text-white/40 hover:text-vision-cyan border border-slate-200 dark:border-white/10 rounded-xl transition-all hover:border-vision-cyan/40 hover:bg-vision-cyan/5"
                aria-label="Close Menu"
              >
                <Icons.X />
              </button>
            </motion.div>

            {/* Nav items */}
            <div className="relative flex flex-col justify-center flex-1 px-8">
              {(navContext === 'LOCAL' ? localItems : globalItems).map((item, idx) => {
                const isItemActive =
                  navContext === 'LOCAL'
                    ? activeNavId === item.id
                    : item.id === '/'
                      ? pathname === '/'
                      : pathname.startsWith(item.id);
                return (
                  <motion.button
                    key={item.id}
                    initial={{ x: -32, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -32, opacity: 0 }}
                    transition={{ delay: idx * 0.055, duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => handleAction(item.id, (item as any).external || false)}
                    className={cn(
                      'group flex items-center gap-5 py-4 border-b border-slate-100 dark:border-white/[0.05] transition-colors text-left last:border-0',
                      isItemActive
                        ? 'text-vision-cyan'
                        : 'text-slate-800 dark:text-white hover:text-vision-cyan'
                    )}
                  >
                    <span className="text-[9px] font-mono font-black text-slate-400 dark:text-white/20 w-5 shrink-0 tabular-nums">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[2rem] sm:text-5xl font-display font-black uppercase tracking-tight leading-none flex-1">
                      {item.name}
                    </span>
                    {isItemActive && (
                      <motion.span
                        layoutId="mobile-active-dot"
                        className="h-2 w-2 rounded-full bg-vision-cyan shadow-[0_0_8px_rgba(var(--glow-cyan),0.9)] shrink-0"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Bottom telemetry bar */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="relative px-8 py-5 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between"
            >
              <div className="flex items-center gap-8">
                <div>
                  <div className="text-[7px] font-mono font-black text-slate-400 dark:text-white/20 uppercase tracking-widest">
                    MEM_LOAD
                  </div>
                  <div className="text-[10px] font-mono font-black text-slate-600 dark:text-white/50 tabular-nums tracking-tighter">
                    {memory}
                  </div>
                </div>
                <div>
                  <div className="text-[7px] font-mono font-black text-slate-400 dark:text-white/20 uppercase tracking-widest">
                    UPTIME
                  </div>
                  <div className="text-[10px] font-mono font-black text-slate-600 dark:text-white/50 tabular-nums tracking-tighter">
                    {uptime}
                  </div>
                </div>
              </div>
              {isHomePage && (
                <button
                  onClick={() => setNavContext(navContext === 'LOCAL' ? 'GLOBAL' : 'LOCAL')}
                  className="flex items-center gap-2 text-[9px] font-mono font-black text-slate-500 dark:text-white/30 hover:text-vision-cyan transition-colors border border-slate-200 dark:border-white/10 px-3 py-1.5 rounded-lg hover:border-vision-cyan/40"
                >
                  <Icons.Command isDark={theme === 'dark'} />
                  {navContext === 'LOCAL' ? 'PAGES' : 'SECTIONS'}
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;

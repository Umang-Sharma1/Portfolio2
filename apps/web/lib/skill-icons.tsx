'use client';

import React, { memo } from 'react';

// ============================================================================
// SVG BASE WRAPPER — clean, no background noise
// ============================================================================

const Svg = ({ children, className, color }: { children: React.ReactNode; className?: string; color?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    overflow="visible"
  >
    {color && (
      <defs>
        <filter id={`glow-${color.replace('#', '')}`} x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="0" stdDeviation="1.4" floodColor={color} floodOpacity="0.55" />
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={color} floodOpacity="0.2" />
        </filter>
      </defs>
    )}
    {children}
  </svg>
);

// ============================================================================
// CUSTOM SVG ICONS — Hand-crafted for each technology
// ============================================================================

type IconFC = React.FC<{ className?: string }>;

const C: Record<string, IconFC> = {
  /* ---- Frontend ---- */

  // React — atom with filled core, colored orbital rings in rounded rect container
  ReactLogo: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="reactBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#61DAFB" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#0891B2" stopOpacity="0.08" />
        </linearGradient>
        <radialGradient id="reactCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#61DAFB" />
          <stop offset="100%" stopColor="#21A9C9" />
        </radialGradient>
      </defs>
      {/* Rounded rect container background */}
      <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#reactBg)" stroke="#0891B2" strokeWidth="0.6" strokeOpacity="0.4" />
      
      {/* Orbital rings */}
      <ellipse cx="12" cy="12" rx="7" ry="2.4" fill="none" stroke="#61DAFB" strokeWidth="1.2" strokeOpacity="0.75" />
      <ellipse cx="12" cy="12" rx="7" ry="2.4" fill="none" stroke="#61DAFB" strokeWidth="1.2" strokeOpacity="0.55" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="7" ry="2.4" fill="none" stroke="#61DAFB" strokeWidth="1.2" strokeOpacity="0.4" transform="rotate(-60 12 12)" />
      {/* Glowing nucleus */}
      <circle cx="12" cy="12" r="2.2" fill="url(#reactCore)" stroke="none" />
      <circle cx="11.2" cy="11.2" r="0.7" fill="white" fillOpacity="0.45" stroke="none" />
    </Svg>
  ),

  // Next.js — bold filled disc in rounded rect container, clean white N lettermark
  NextLogo: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="nextBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#111" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#444" stopOpacity="0.1" />
        </linearGradient>
        <radialGradient id="nextDisc" cx="38%" cy="32%" r="72%">
          <stop offset="0%" stopColor="#444" />
          <stop offset="100%" stopColor="#111" />
        </radialGradient>
      </defs>
      {/* Rounded rect container background */}
      <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#nextBg)" stroke="#111" strokeWidth="0.5" strokeOpacity="0.3" />
      
      {/* Filled disc */}
      <circle cx="12" cy="12" r="8" fill="url(#nextDisc)" stroke="none" />
      {/* Specular highlight */}
      <ellipse cx="9" cy="8.5" rx="2.8" ry="1.6" fill="white" fillOpacity="0.08" stroke="none" />
      {/* Bold N letterform */}
      <path d="M8 15L10 9l4 6V9" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),

  // JavaScript — bold yellow filled square, white JS lettermark
  JsLogo: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="jsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F7DF1E" />
          <stop offset="100%" stopColor="#E6C800" />
        </linearGradient>
      </defs>
      <rect x="2.5" y="2.5" width="19" height="19" rx="2.5" fill="url(#jsGrad)" stroke="none" />
      <rect x="2.5" y="2.5" width="19" height="19" rx="2.5" fill="none" stroke="#D4BB00" strokeWidth="0.6" />
      {/* J */}
      <path d="M8.2 8.5v7.3c0 1.4-1 2.2-2.2 2.2" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" />
      {/* S */}
      <path d="M12.5 15.8c.4 1.5 3.5 1.5 3.5-.3 0-2-3.5-1.6-3.5-3.5 0-1.6 2.8-2 3.5-.4" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  ),

  // TypeScript — bold blue filled square, white TS lettermark
  TsLogo: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="tsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B8BDA" />
          <stop offset="100%" stopColor="#2A6EAF" />
        </linearGradient>
      </defs>
      <rect x="2.5" y="2.5" width="19" height="19" rx="2.5" fill="url(#tsGrad)" stroke="none" />
      <rect x="2.5" y="2.5" width="19" height="19" rx="2.5" fill="none" stroke="#1C5A94" strokeWidth="0.6" />
      {/* T */}
      <path d="M5 9.5h6.5" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M8.2 9.5V17" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
      {/* S */}
      <path d="M13 15.8c.4 1.4 3.5 1.4 3.5-.3 0-2-3.5-1.6-3.5-3.5 0-1.7 2.8-2 3.5-.4" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  ),

  // Tailwind — dual S-curve waves with strong cyan fill
  TailwindLogo: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="twBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="twGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#twBg)" stroke="#06B6D4" strokeWidth="0.6" strokeOpacity="0.4" />
      <path
        d="M7 10.5C8 8.5 9.8 7.8 11.7 8.6c1.3.5 2.1 1.7 3.2 2.2 1.6.9 3.3.3 5.1-1.8C18.8 11 17.1 11.8 15 11c-1.3-.5-2.1-1.7-3.2-2.2C9.9 7.9 8.3 8.3 7 10.5z"
        fill="url(#twGrad)" stroke="none"
      />
      <path
        d="M7 15.3C8 13.3 9.8 12.6 11.7 13.4c1.3.5 2.1 1.7 3.2 2.2 1.6.9 3.3.3 5.1-1.8C18.8 15.8 17.1 16.6 15 15.8c-1.3-.5-2.1-1.7-3.2-2.2C9.9 12.7 8.3 13.1 7 15.3z"
        fill="url(#twGrad)" stroke="none"
      />
    </Svg>
  ),

  // Docker — whale body + container blocks on back
  DockerLogo: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="dockerBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4FB8F0" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#2496ED" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="dockerBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4FB8F0" />
          <stop offset="100%" stopColor="#2496ED" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#dockerBg)" stroke="#2496ED" strokeWidth="0.6" strokeOpacity="0.4" />
      {/* Container blocks */}
      <rect x="4" y="9" width="2.5" height="2" rx="0.4" fill="url(#dockerBlue)" stroke="none" />
      <rect x="7.2" y="9" width="2.5" height="2" rx="0.4" fill="url(#dockerBlue)" stroke="none" />
      <rect x="10.4" y="9" width="2.5" height="2" rx="0.4" fill="url(#dockerBlue)" stroke="none" />
      <rect x="13.6" y="9" width="2.5" height="2" rx="0.4" fill="url(#dockerBlue)" stroke="none" />
      <rect x="7.2" y="6.5" width="2.5" height="2" rx="0.4" fill="url(#dockerBlue)" stroke="none" />
      <rect x="10.4" y="6.5" width="2.5" height="2" rx="0.4" fill="url(#dockerBlue)" stroke="none" />
      {/* Whale belly */}
      <path
        d="M3 12.5c.4 0 .8-.1 1.2-.2.9 2 3 3.5 5.8 3.5h3.2c3 0 5.2-1.8 5.5-4.6H3"
        fill="#2496ED" fillOpacity="0.22" stroke="#2496ED" strokeWidth="0.9" strokeLinecap="round"
      />
      {/* Spray puff */}
      <circle cx="19" cy="8.5" r="0.7" fill="#2496ED" fillOpacity="0.6" stroke="none" />
      <path d="M18 7.8c.5-.7 1.5-.6 1.7.2" fill="none" stroke="#2496ED" strokeWidth="0.8" strokeOpacity="0.7" />
    </Svg>
  ),

  // Node.js — hexagon with green fill and JS dot mark
  NodeLogo: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="nodeBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5CB85C" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#339933" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="nodeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5CB85C" />
          <stop offset="100%" stopColor="#339933" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#nodeBg)" stroke="#339933" strokeWidth="0.6" strokeOpacity="0.4" />
      {/* Hex shape scaled to fit inside rect */}
      <path d="M12 5l6 3.5v7L12 19l-6-3.5v-7L12 5z" fill="url(#nodeGrad)" fillOpacity="0.25" stroke="#339933" strokeWidth="1" />
      <path d="M12 8l3.5 2v4L12 16l-3.5-2v-4L12 8z" fill="url(#nodeGrad)" stroke="none" />
      <circle cx="12" cy="12" r="1.4" fill="white" fillOpacity="0.25" stroke="none" />
    </Svg>
  ),

  // Redis — stacked dish layers with star accent
  RedisLogo: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="redisBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B6B" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#DC382D" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="redisGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="100%" stopColor="#DC382D" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#redisBg)" stroke="#DC382D" strokeWidth="0.6" strokeOpacity="0.4" />
      {/* Bottom disc */}
      <ellipse cx="12" cy="16" rx="6.5" ry="2" fill="url(#redisGrad)" fillOpacity="0.25" stroke="#DC382D" strokeWidth="0.9" />
      {/* Middle disc */}
      <ellipse cx="12" cy="12" rx="6.5" ry="2" fill="url(#redisGrad)" fillOpacity="0.45" stroke="#DC382D" strokeWidth="0.9" />
      {/* Top disc / lid */}
      <ellipse cx="12" cy="8" rx="6.5" ry="2" fill="url(#redisGrad)" stroke="none" />
      {/* Star accent on top */}
      <path d="M12 6.5l.6 1.3 1.4.1-1 .9.3 1.3L12 9.4l-1.3.7.3-1.3-1-.9 1.4-.1z" fill="white" fillOpacity="0.85" stroke="none" />
    </Svg>
  ),

  // MongoDB — bold filled leaf shape (brand green)
  MongoLogo: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="mongoBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6DBF67" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#47A248" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="mongoGrad" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#6DBF67" />
          <stop offset="100%" stopColor="#47A248" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#mongoBg)" stroke="#47A248" strokeWidth="0.6" strokeOpacity="0.4" />
      {/* Leaf body scaled to fit */}
      <path
        d="M12 5c1.2 1.8 2.8 4.2 2.8 6.8 0 2.4-1.2 4.6-2.8 6.4 0 0 0 .4 0 2-1.6-1.8-2.8-4-2.8-6.8 0-2.6 1.6-5 2.8-6.8z"
        fill="url(#mongoGrad)" stroke="none"
      />
      {/* Leaf vein */}
      <path d="M12 6v13" fill="none" stroke="white" strokeWidth="0.8" strokeOpacity="0.5" />
      {/* Specular */}
      <ellipse cx="11.2" cy="8.5" rx="0.8" ry="1.8" fill="white" fillOpacity="0.22" stroke="none" />
    </Svg>
  ),

  // HTML5 — bold shield with orange fill, white brackets
  Html5: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="htmlBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F06529" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#E34C26" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="htmlGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F06529" />
          <stop offset="100%" stopColor="#E34C26" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#htmlBg)" stroke="#E34C26" strokeWidth="0.6" strokeOpacity="0.4" />
      <path d="M5.5 4.5l1.3 12.3L12 19.5l5.2-2.7L18.5 4.5H5.5z" fill="url(#htmlGrad)" stroke="none" />
      <path d="M5.5 4.5l1.3 12.3L12 19.5l5.2-2.7L18.5 4.5H5.5z" fill="none" stroke="#C73E10" strokeWidth="0.4" />
      <path d="M9.5 8l-1.2 3.5 1.2 3" fill="none" stroke="white" strokeWidth="1.3" strokeOpacity="0.9" />
      <path d="M14.5 8l1.2 3.5-1.2 3" fill="none" stroke="white" strokeWidth="1.3" strokeOpacity="0.9" />
    </Svg>
  ),

  // CSS3 — shield with blue fill, white curly brace accents
  Css3: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="cssBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2CA2D8" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#1572B6" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="cssGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2CA2D8" />
          <stop offset="100%" stopColor="#1572B6" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#cssBg)" stroke="#1572B6" strokeWidth="0.6" strokeOpacity="0.4" />
      <path d="M5.5 4.5l1.3 12.3L12 19.5l5.2-2.7L18.5 4.5H5.5z" fill="url(#cssGrad)" stroke="none" />
      <path d="M5.5 4.5l1.3 12.3L12 19.5l5.2-2.7L18.5 4.5H5.5z" fill="none" stroke="#0E5A96" strokeWidth="0.4" />
      <path d="M9.5 7.5c-1.4 0-2 .9-2 1.9s1.3 1.4 1.8 1.6-.7 1.7-1.8 1.7" fill="none" stroke="white" strokeWidth="1.3" strokeOpacity="0.9" />
      <path d="M14.5 7.5c1.4 0 2 .9 2 1.9s-1.3 1.4-1.8 1.6.7 1.7 1.8 1.7" fill="none" stroke="white" strokeWidth="1.3" strokeOpacity="0.9" />
    </Svg>
  ),

  // Vue.js — layered V shapes with green/teal brand colors (in rounded rect container)
  Vue: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="vueBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#41B883" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#35495E" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      {/* Rounded rect container background */}
      <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#vueBg)" stroke="#35495E" strokeWidth="0.5" strokeOpacity="0.3" />
      
      {/* Outer V — dark teal */}
      <path d="M3 4h3l6 9.6 6-9.6h3l-9 15L3 4z" fill="#35495E" stroke="none" />
      {/* Inner V — green */}
      <path d="M6 4l6 8.4 6-8.4h-3l-3 4.2-3-4.2H6z" fill="#41B883" stroke="none" />
    </Svg>
  ),

  // Redux — circular arrows with purple core
  Redux: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="reduxBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9B6BCF" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#764ABC" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="reduxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9B6BCF" />
          <stop offset="100%" stopColor="#764ABC" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#reduxBg)" stroke="#764ABC" strokeWidth="0.6" strokeOpacity="0.4" />
      <circle cx="12" cy="12" r="2.5" fill="url(#reduxGrad)" stroke="none" />
      <path d="M17.2 4.3l2.8 3-2.8 2.5" fill="none" stroke="#764ABC" strokeWidth="1.8" />
      <path d="M20 7.3H10a5 5 0 100 9.5" fill="none" stroke="#764ABC" strokeWidth="1.8" />
      <path d="M6.8 19.7l-2.8-3 2.8-2.5" fill="none" stroke="#764ABC" strokeWidth="1.8" />
      <path d="M4 16.7h10a5 5 0 000-9.5" fill="none" stroke="#764ABC" strokeWidth="1.8" />
    </Svg>
  ),

  // React Query — atom orbits with red lightning bolt center
  ReactQuery: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="rqBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B7A" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#FF4154" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="rqGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B7A" />
          <stop offset="100%" stopColor="#FF4154" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#rqBg)" stroke="#FF4154" strokeWidth="0.6" strokeOpacity="0.4" />
      <ellipse cx="12" cy="12" rx="8" ry="3" fill="none" stroke="#FF4154" strokeWidth="1.3" strokeOpacity="0.8" />
      <ellipse cx="12" cy="12" rx="8" ry="3" fill="none" stroke="#FF4154" strokeWidth="1.3" strokeOpacity="0.6" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="8" ry="3" fill="none" stroke="#FF4154" strokeWidth="1.3" strokeOpacity="0.6" transform="rotate(-60 12 12)" />
      <polygon points="12 9 10.2 13 13.2 13 12 16" fill="url(#rqGrad)" stroke="none" />
    </Svg>
  ),

  // Sass/SCSS — bold S-curve with pink brand color
  Sass: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="sassBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F891C1" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#CC6699" stopOpacity="0.08" />
        </linearGradient>
        <radialGradient id="sassGrad" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#F891C1" />
          <stop offset="100%" stopColor="#CC6699" />
        </radialGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#sassBg)" stroke="#CC6699" strokeWidth="0.6" strokeOpacity="0.4" />
      <circle cx="12" cy="12" r="7.5" fill="url(#sassGrad)" fillOpacity="0.18" stroke="#CC6699" strokeWidth="1" />
      <path d="M7.5 9c1.8-2.5 8.5-2 7.5 1.5-.9 3.2-7.5 2.5-8 6 -.4 2.6 3.5 3.6 6.5 2" fill="none" stroke="#CC6699" strokeWidth="1.8" />
    </Svg>
  ),

  // Webpack — bold hexagonal bundle, multi-tone fills
  Webpack: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="wpBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A9D4F5" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#8DD6F9" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="wpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A9D4F5" />
          <stop offset="100%" stopColor="#8DD6F9" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#wpBg)" stroke="#8DD6F9" strokeWidth="0.6" strokeOpacity="0.4" />
      <polygon points="12 4 19.5 8.5 19.5 17.5 12 22 4.5 17.5 4.5 8.5" fill="url(#wpGrad)" fillOpacity="0.22" stroke="#8DD6F9" strokeWidth="1" />
      <path d="M12 9l4.5 2.6v4L12 18.2l-4.5-2.6v-4L12 9z" fill="url(#wpGrad)" fillOpacity="0.55" stroke="none" />
      <path d="M12 9v9.2" fill="none" stroke="#8DD6F9" strokeWidth="1.1" />
      <path d="M12 11.6L7.5 9" fill="none" stroke="#8DD6F9" strokeWidth="0.9" strokeOpacity="0.7" />
      <path d="M12 11.6L16.5 9" fill="none" stroke="#8DD6F9" strokeWidth="0.9" strokeOpacity="0.7" />
    </Svg>
  ),

  // Vite / FastAPI / Python — lightning bolt with purple/indigo fill
  Bolt: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="boltBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9B93FF" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#646CFF" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9B93FF" />
          <stop offset="100%" stopColor="#646CFF" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#boltBg)" stroke="#646CFF" strokeWidth="0.6" strokeOpacity="0.4" />
      <polygon points="13 4 4.5 13.5 11.5 13.5 10 20 19.5 10.5 12.5 10.5" fill="url(#boltGrad)" stroke="none" />
      <path d="M13 4L6 13.5h5.5" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.35" />
    </Svg>
  ),

  // Material-UI — M chevron on blue backdrop
  MaterialUI: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="muiBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#42A5F5" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#007FFF" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="muiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#42A5F5" />
          <stop offset="100%" stopColor="#007FFF" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#muiBg)" stroke="#007FFF" strokeWidth="0.6" strokeOpacity="0.4" />
      <circle cx="12" cy="12" r="7.5" fill="url(#muiGrad)" fillOpacity="0.18" stroke="#007FFF" strokeWidth="1" />
      {/* M chevrons */}
      <path d="M5.5 16.5V7.5L9 12l3-4 3 4 3.5-4.5v9" fill="none" stroke="#007FFF" strokeWidth="2" strokeLinejoin="round" />
    </Svg>
  ),

  /* ---- Backend ---- */

  // Express.js — minimal terminal prompt lines in rounded box
  Express: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="expGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A8C562" />
          <stop offset="100%" stopColor="#90C53F" />
        </linearGradient>
      </defs>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" fill="#90C53F" fillOpacity="0.14" stroke="#90C53F" strokeWidth="1.2" />
      {/* > prompt */}
      <path d="M6.5 9l2.5 3-2.5 3" fill="none" stroke="#90C53F" strokeWidth="1.8" />
      {/* text lines */}
      <path d="M10.5 12h6" fill="none" stroke="#90C53F" strokeWidth="1.6" strokeOpacity="0.75" />
      <path d="M10.5 9h4" fill="none" stroke="#90C53F" strokeWidth="1.3" strokeOpacity="0.5" />
      <path d="M10.5 15h5" fill="none" stroke="#90C53F" strokeWidth="1.3" strokeOpacity="0.5" />
    </Svg>
  ),

  // REST API — three colored endpoint circles connected by arrows
  RestApi: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="restBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22C55E" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.06" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#restBg)" stroke="#3B82F6" strokeWidth="0.6" strokeOpacity="0.3" />
      <circle cx="5.5" cy="12" r="2.5" fill="#22C55E" fillOpacity="0.25" stroke="#22C55E" strokeWidth="1" />
      <circle cx="18.5" cy="6.5" r="2.5" fill="#3B82F6" fillOpacity="0.25" stroke="#3B82F6" strokeWidth="1" />
      <circle cx="18.5" cy="17.5" r="2.5" fill="#F59E0B" fillOpacity="0.25" stroke="#F59E0B" strokeWidth="1" />
      <path d="M8 11L16 8" fill="none" stroke="#6B7280" strokeWidth="1.2" />
      <path d="M8 13L16 16" fill="none" stroke="#6B7280" strokeWidth="1.2" />
      {/* Arrowheads */}
      <path d="M14.5 7.5l1.8.6-.6 1.8" fill="none" stroke="#3B82F6" strokeWidth="1" />
      <path d="M14.5 16.5l1.8-.6-.6-1.8" fill="none" stroke="#F59E0B" strokeWidth="1" />
    </Svg>
  ),

  // Apollo Server — A letterform in dark purple circle
  Apollo: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="apolloBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5B3FA6" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#311C87" stopOpacity="0.10" />
        </linearGradient>
        <radialGradient id="apolloGrad" cx="38%" cy="32%" r="72%">
          <stop offset="0%" stopColor="#5B3FA6" />
          <stop offset="100%" stopColor="#311C87" />
        </radialGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#apolloBg)" stroke="#5B3FA6" strokeWidth="0.6" strokeOpacity="0.5" />
      <circle cx="12" cy="12" r="7.5" fill="url(#apolloGrad)" stroke="none" />
      <ellipse cx="9.5" cy="9.5" rx="3" ry="2" fill="white" fillOpacity="0.08" stroke="none" />
      {/* A letterform */}
      <path d="M8.5 17.5L12 7l3.5 10.5" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.8 13.8h4.4" fill="none" stroke="white" strokeWidth="1.8" />
    </Svg>
  ),

  // .NET Core — purple square frame, dotted NET text
  DotNet: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="netGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9B72CF" />
          <stop offset="100%" stopColor="#512BD4" />
        </linearGradient>
      </defs>
      <rect x="2.5" y="2.5" width="19" height="19" rx="3" fill="url(#netGrad)" fillOpacity="0.20" stroke="#512BD4" strokeWidth="1.2" />
      {/* Dot */}
      <circle cx="4.8" cy="12" r="1.6" fill="#512BD4" stroke="none" />
      {/* NET letterform */}
      <path d="M7.5 15V9l3.5 6V9" fill="none" stroke="#512BD4" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12.5 9h3.5v3h-3.5v3h3.5" fill="none" stroke="#512BD4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),

  // C# — large C with hash grid overlay
  CSharp: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="csharpBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A855F7" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#7E22CE" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="csharpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#7E22CE" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#csharpBg)" stroke="#9333EA" strokeWidth="0.6" strokeOpacity="0.4" />
      <circle cx="12" cy="12" r="7.5" fill="url(#csharpGrad)" fillOpacity="0.18" stroke="#9333EA" strokeWidth="1" />
      {/* C arc */}
      <path d="M14.5 7.5A6 6 0 107.5 15.5" fill="none" stroke="#9333EA" strokeWidth="2" />
      {/* Hash # */}
      <path d="M15 7.5v7" fill="none" stroke="#9333EA" strokeWidth="1.4" />
      <path d="M17.5 7.5v7" fill="none" stroke="#9333EA" strokeWidth="1.4" />
      <path d="M14.2 10h4" fill="none" stroke="#9333EA" strokeWidth="1.2" />
      <path d="M14.2 13h4" fill="none" stroke="#9333EA" strokeWidth="1.2" />
    </Svg>
  ),

  // NestJS — upward wings (like the official Nest logo bird motif)
  Nest: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="nestBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F05768" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#E0234E" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="nestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F05768" />
          <stop offset="100%" stopColor="#E0234E" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#nestBg)" stroke="#E0234E" strokeWidth="0.6" strokeOpacity="0.4" />
      {/* Left wing */}
      <path d="M4.5 18C4.5 11 9 6.5 12 5.5c0 0-4.5 3.5-4.5 8" fill="url(#nestGrad)" fillOpacity="0.30" stroke="#E0234E" strokeWidth="1.2" />
      {/* Right wing */}
      <path d="M19.5 18C19.5 11 15 6.5 12 5.5c0 0 4.5 3.5 4.5 8" fill="url(#nestGrad)" fillOpacity="0.50" stroke="#E0234E" strokeWidth="1.2" />
      {/* Body */}
      <path d="M9 13.5c0 3.5 1.5 5.5 3 6.5 1.5-1 3-3 3-6.5" fill="url(#nestGrad)" stroke="none" />
      {/* Specular */}
      <ellipse cx="12" cy="11" rx="1.5" ry="2.5" fill="white" fillOpacity="0.15" stroke="none" />
    </Svg>
  ),

  // Microservices — 5-node mesh with colored nodes
  Mesh: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="meshBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A855F7" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#meshBg)" stroke="#A855F7" strokeWidth="0.6" strokeOpacity="0.4" />
      <circle cx="12" cy="12" r="2.5" fill="#A855F7" stroke="none" />
      <circle cx="6" cy="7" r="1.8" fill="#A855F7" fillOpacity="0.55" stroke="#A855F7" strokeWidth="0.9" />
      <circle cx="18" cy="7" r="1.8" fill="#A855F7" fillOpacity="0.55" stroke="#A855F7" strokeWidth="0.9" />
      <circle cx="6" cy="17" r="1.8" fill="#A855F7" fillOpacity="0.55" stroke="#A855F7" strokeWidth="0.9" />
      <circle cx="18" cy="17" r="1.8" fill="#A855F7" fillOpacity="0.55" stroke="#A855F7" strokeWidth="0.9" />
      <path d="M7.8 8.5L10.2 10.5" fill="none" stroke="#A855F7" strokeWidth="1" strokeOpacity="0.7" />
      <path d="M16.2 8.5L13.8 10.5" fill="none" stroke="#A855F7" strokeWidth="1" strokeOpacity="0.7" />
      <path d="M7.8 15.5L10.2 13.5" fill="none" stroke="#A855F7" strokeWidth="1" strokeOpacity="0.7" />
      <path d="M16.2 15.5L13.8 13.5" fill="none" stroke="#A855F7" strokeWidth="1" strokeOpacity="0.7" />
    </Svg>
  ),

  // WebSockets — bidirectional signal waves between two endpoints
  Socket: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="socketBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#0284C7" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#socketBg)" stroke="#0EA5E9" strokeWidth="0.6" strokeOpacity="0.4" />
      <circle cx="5.5" cy="12" r="1.8" fill="#0EA5E9" fillOpacity="0.5" stroke="#0EA5E9" strokeWidth="1" />
      <circle cx="18.5" cy="12" r="1.8" fill="#0EA5E9" fillOpacity="0.5" stroke="#0EA5E9" strokeWidth="1" />
      <path d="M7.3 12h9.4" fill="none" stroke="#0EA5E9" strokeWidth="1.4" />
      {/* top wave → right */}
      <path d="M9.5 9c.8-1.6 2.5-1.6 3.2 0s2.5 1.6 3.2 0" fill="none" stroke="#0EA5E9" strokeWidth="1.2" strokeOpacity="0.7" />
      {/* bottom wave ← left */}
      <path d="M8 15c.8 1.6 2.5 1.6 3.2 0s2.5-1.6 3.2 0" fill="none" stroke="#0EA5E9" strokeWidth="1.2" strokeOpacity="0.55" />
    </Svg>
  ),

  // JWT Authentication — padlock body with key-ring
  JwtKey: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="jwtBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="jwtGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2DD4BF" />
          <stop offset="100%" stopColor="#14B8A6" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#jwtBg)" stroke="#14B8A6" strokeWidth="0.6" strokeOpacity="0.4" />
      <rect x="5.5" y="11.5" width="13" height="8.5" rx="2" fill="url(#jwtGrad)" fillOpacity="0.20" stroke="#14B8A6" strokeWidth="1.1" />
      <path d="M8.5 11.5V8.5a3.5 3.5 0 017 0v3" fill="none" stroke="#14B8A6" strokeWidth="1.5" />
      <circle cx="12" cy="16" r="1.8" fill="url(#jwtGrad)" stroke="none" />
      <path d="M12 17.8v1.5" fill="none" stroke="#14B8A6" strokeWidth="1.4" />
    </Svg>
  ),

  // OAuth 2.0 — filled shield with bold check
  Shield: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="shieldBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#2563EB" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#shieldBg)" stroke="#2563EB" strokeWidth="0.6" strokeOpacity="0.4" />
      <path d="M12 4l7.5 3.3v5c0 5-3.3 9.7-7.5 11C7.8 22 4.5 17.3 4.5 12.3V7.3L12 4z" fill="url(#shieldGrad)" fillOpacity="0.22" stroke="#2563EB" strokeWidth="1" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),

  /* ---- Database ---- */

  // Mongoose — leaf with burgundy brand fill
  Leaf: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="leafBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C43C3C" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#880000" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C43C3C" />
          <stop offset="100%" stopColor="#880000" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#leafBg)" stroke="#880000" strokeWidth="0.6" strokeOpacity="0.4" />
      {/* Filled leaf body */}
      <path d="M8.5 15.5c0-7 5-10.5 8.5-10.5-1.5 0-3.5 1.5-3.5 4.5s2 3.5 2 6c0 2.5-1.5 4-3.5 4" fill="url(#leafGrad)" fillOpacity="0.25" stroke="#880000" strokeWidth="1.1" />
      <path d="M8.5 15.5c7 1.5 10.5-2.5 10.5-10.5-1.5 0-3.5 1.5-3.5 4.5s2 3.5 2 6c0 2.5-1.5 4-3.5 4" fill="url(#leafGrad)" fillOpacity="0.45" stroke="#880000" strokeWidth="0.9" />
      <path d="M8.5 15.5c0 3.5 1.5 5 3 5" fill="none" stroke="#880000" strokeWidth="1.3" />
      <path d="M4 21c1.5-3 4-5.5 6-6.5" fill="none" stroke="#880000" strokeWidth="1.1" strokeOpacity="0.6" />
    </Svg>
  ),

  // MySQL — database cylinder with blue fill
  Dolphin: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="mysqlBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5490C0" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#4479A1" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="mysqlGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5490C0" />
          <stop offset="100%" stopColor="#4479A1" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#mysqlBg)" stroke="#4479A1" strokeWidth="0.6" strokeOpacity="0.4" />
      {/* Cylinder top */}
      <ellipse cx="12" cy="7" rx="6" ry="2" fill="url(#mysqlGrad)" fillOpacity="0.35" stroke="#4479A1" strokeWidth="1" />
      {/* Cylinder body */}
      <path d="M6 7v10" fill="none" stroke="#4479A1" strokeWidth="1" />
      <path d="M18 7v10" fill="none" stroke="#4479A1" strokeWidth="1" />
      {/* Cylinder base */}
      <ellipse cx="12" cy="17" rx="6" ry="2" fill="url(#mysqlGrad)" stroke="#4479A1" strokeWidth="1" />
      {/* Middle ring */}
      <ellipse cx="12" cy="12" rx="6" ry="2" fill="none" stroke="#4479A1" strokeWidth="0.9" strokeOpacity="0.6" />
    </Svg>
  ),

  // Prisma — sharp triangular prism, dark navy fill
  Prism: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="prismBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5C8FA8" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#2D6E85" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="prismaLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5C8FA8" />
          <stop offset="100%" stopColor="#2D6E85" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#prismBg)" stroke="#4A5568" strokeWidth="0.6" strokeOpacity="0.4" />
      {/* Left face — lightest */}
      <path d="M10.5 4.5L5.5 18l5.5 2.5z" fill="#2D3748" fillOpacity="0.30" stroke="none" />
      {/* Right face — darker */}
      <path d="M10.5 4.5l5.5 4.5-5.5 16z" fill="#2D3748" fillOpacity="0.65" stroke="none" />
      {/* Front face */}
      <path d="M16 9l2.5 10-8 2z" fill="#2D3748" fillOpacity="0.42" stroke="none" />
      {/* Outline */}
      <path d="M10.5 4.5L5.5 18l5.5 2.5 8-2L16 9z" fill="none" stroke="#4A5568" strokeWidth="1" />
      <path d="M10.5 4.5l5.5 4.5" fill="none" stroke="#4A5568" strokeWidth="0.9" />
    </Svg>
  ),

  // TypeORM / SQL / PostgreSQL — table grid with colored header
  Table: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="tableGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
      <rect x="2.5" y="2.5" width="19" height="19" rx="2.5" fill="none" stroke="#3B82F6" strokeWidth="1.2" />
      {/* Header row filled */}
      <rect x="2.5" y="2.5" width="19" height="5.5" rx="2.5" fill="url(#tableGrad)" fillOpacity="0.55" stroke="none" />
      <rect x="2.5" y="5.5" width="19" height="2.5" rx="0" fill="url(#tableGrad)" fillOpacity="0.55" stroke="none" />
      <path d="M2.5 8h19" fill="none" stroke="#3B82F6" strokeWidth="1" />
      <path d="M2.5 13h19" fill="none" stroke="#3B82F6" strokeWidth="1" strokeOpacity="0.7" />
      <path d="M2.5 18h19" fill="none" stroke="#3B82F6" strokeWidth="1" strokeOpacity="0.5" />
      <path d="M9 2.5v19" fill="none" stroke="#3B82F6" strokeWidth="1" strokeOpacity="0.7" />
    </Svg>
  ),

  // Database Design — ER diagram with colored entity boxes
  Schema: ({ className }) => (
    <Svg className={className}>
      <rect x="2" y="2.5" width="8" height="5.5" rx="1.5" fill="#6366F1" fillOpacity="0.25" stroke="#6366F1" strokeWidth="1.1" />
      <rect x="14" y="2.5" width="8" height="5.5" rx="1.5" fill="#6366F1" fillOpacity="0.25" stroke="#6366F1" strokeWidth="1.1" />
      <rect x="8" y="16" width="8" height="5.5" rx="1.5" fill="#6366F1" fillOpacity="0.45" stroke="#6366F1" strokeWidth="1.1" />
      <path d="M6 8v4c0 2 2 4 6 4" fill="none" stroke="#6366F1" strokeWidth="1.3" />
      <path d="M18 8v4c0 2-2 4-6 4" fill="none" stroke="#6366F1" strokeWidth="1.3" />
    </Svg>
  ),

  // Database Optimization — cylinder with teal lightning bolt
  DbBolt: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="dbBoltBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#0D9488" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="dbBoltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2DD4BF" />
          <stop offset="100%" stopColor="#0D9488" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#dbBoltBg)" stroke="#0D9488" strokeWidth="0.6" strokeOpacity="0.4" />
      <ellipse cx="12" cy="6" rx="6.5" ry="2.2" fill="url(#dbBoltGrad)" fillOpacity="0.35" stroke="#0D9488" strokeWidth="0.9" />
      <path d="M5.5 6v12c0 1.2 2.9 2.2 6.5 2.2s6.5-1 6.5-2.2V6" fill="none" stroke="#0D9488" strokeWidth="0.9" />
      <path d="M5.5 12c0 1.2 2.9 2.2 6.5 2.2s6.5-1 6.5-2.2" fill="none" stroke="#0D9488" strokeWidth="0.8" strokeOpacity="0.6" />
      <polygon points="13 9.5 11 13.5 14 13.5 12.5 17" fill="url(#dbBoltGrad)" stroke="none" />
    </Svg>
  ),

  /* ---- DevOps ---- */

  // Git — bold branch graph with orange-red nodes
  Git: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="gitBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F1502F" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#DE4C36" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#gitBg)" stroke="#F1502F" strokeWidth="0.6" strokeOpacity="0.4" />
      <circle cx="12" cy="5.5" r="2" fill="#F1502F" stroke="none" />
      <circle cx="6.5" cy="18.5" r="2" fill="#F1502F" fillOpacity="0.75" stroke="none" />
      <circle cx="17.5" cy="18.5" r="2" fill="#F1502F" fillOpacity="0.75" stroke="none" />
      <path d="M12 7.5v4.5" fill="none" stroke="#F1502F" strokeWidth="1.6" />
      <path d="M12 12c-4 0-5.5 3-5.5 4.5" fill="none" stroke="#F1502F" strokeWidth="1.6" />
      <path d="M12 12c4 0 5.5 3 5.5 4.5" fill="none" stroke="#F1502F" strokeWidth="1.6" />
    </Svg>
  ),

  // Docker Compose — stacked containers with status dots
  Stacked: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="stackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4FB8F0" />
          <stop offset="100%" stopColor="#1D63ED" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="18" height="6.5" rx="2" fill="url(#stackGrad)" fillOpacity="0.22" stroke="#1D63ED" strokeWidth="1.1" />
      <rect x="3" y="14.5" width="18" height="6.5" rx="2" fill="url(#stackGrad)" fillOpacity="0.22" stroke="#1D63ED" strokeWidth="1.1" />
      <circle cx="7" cy="6.3" r="1.2" fill="#22C55E" stroke="none" />
      <circle cx="7" cy="17.8" r="1.2" fill="#22C55E" stroke="none" />
      <path d="M11 6.3h7" fill="none" stroke="#1D63ED" strokeWidth="1.4" strokeOpacity="0.8" />
      <path d="M11 17.8h7" fill="none" stroke="#1D63ED" strokeWidth="1.4" strokeOpacity="0.8" />
      {/* Middle connector */}
      <path d="M12 9.5v5" fill="none" stroke="#1D63ED" strokeWidth="1.1" strokeOpacity="0.5" strokeDasharray="1.5 1.5" />
    </Svg>
  ),

  // GitHub Actions — colored gear with play triangle
  GearPlay: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="gearBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4BACE4" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#2088FF" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="gearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4BACE4" />
          <stop offset="100%" stopColor="#2088FF" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#gearBg)" stroke="#2088FF" strokeWidth="0.6" strokeOpacity="0.4" />
      <path
        d="M12 4l1.6.9 1.8-.4.9 1.5.4 1.8 1.5 1.1-.6 1.7.6 1.7-1.5 1.1-.4 1.8-.9 1.5-1.8-.4-1.6.9-1.6-.9-1.8.4-.9-1.5-.4-1.8-1.5-1.1.6-1.7-.6-1.7 1.5-1.1.4-1.8.9-1.5 1.8.4z"
        fill="url(#gearGrad)" fillOpacity="0.22" stroke="#2088FF" strokeWidth="0.9" />
      <circle cx="12" cy="12" r="3" fill="url(#gearGrad)" stroke="none" />
      <path d="M10.8 10.8l2.8 1.2-2.8 1.2z" fill="white" fillOpacity="0.95" stroke="none" />
    </Svg>
  ),

  // CI/CD — circular deploy with rocket accent
  Deploy: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="deployBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FB923C" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#F97316" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="deployGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FB923C" />
          <stop offset="100%" stopColor="#F97316" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#deployBg)" stroke="#F97316" strokeWidth="0.6" strokeOpacity="0.4" />
      <circle cx="12" cy="12" r="7.5" fill="url(#deployGrad)" fillOpacity="0.18" stroke="#F97316" strokeWidth="1" />
      {/* Circular arrow */}
      <path d="M12 6v4l2.5-2" fill="none" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5.5 12a6.5 6.5 0 006.5-6.5" fill="none" stroke="#F97316" strokeWidth="1.3" />
      {/* Rocket */}
      <path d="M13.5 13.5l2.5-2.5c.8-2.5-.8-3.5-.8-3.5s-.8-.8-3.5.8l-2.5 2.5z" fill="url(#deployGrad)" stroke="none" />
    </Svg>
  ),

  // Vercel — bold filled triangle with soft inner specular
  Vercel: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="vercelBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#555" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#111" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#vercelBg)" stroke="#555" strokeWidth="0.6" strokeOpacity="0.4" />
      <path d="M12 4.5L3.5 19.5h17L12 4.5z" fill="currentColor" stroke="none" />
      {/* Specular */}
      <path d="M12 7L7 17.5h5L12 7z" fill="white" fillOpacity="0.12" stroke="none" />
    </Svg>
  ),

  // Nginx — N letterform in server-box with green accent
  Nginx: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="nginxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#40C080" />
          <stop offset="100%" stopColor="#009639" />
        </linearGradient>
      </defs>
      <rect x="2.5" y="2.5" width="19" height="19" rx="3" fill="url(#nginxGrad)" fillOpacity="0.18" stroke="#009639" strokeWidth="1.2" />
      {/* Server status dots */}
      <circle cx="6" cy="6.5" r="1.1" fill="#22C55E" stroke="none" />
      <circle cx="9.5" cy="6.5" r="1.1" fill="#F59E0B" stroke="none" />
      <circle cx="13" cy="6.5" r="1.1" fill="#EF4444" stroke="none" />
      {/* N letterform */}
      <path d="M7.5 17V9.5l9 7.5V9.5" fill="none" stroke="#009639" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),

  /* ---- Tools ---- */

  // VS Code — bold editor window with colored chevron
  VsCode: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="vscBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#29B6F6" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#007ACC" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="vscGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#29B6F6" />
          <stop offset="100%" stopColor="#007ACC" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#vscBg)" stroke="#007ACC" strokeWidth="0.6" strokeOpacity="0.4" />
      {/* Editor shell */}
      <path d="M6 8.5l5-3.5 6.5 2.5v11L11 21l-5-3.5 3.5-3.5L6 11z" fill="url(#vscGrad)" fillOpacity="0.20" stroke="#007ACC" strokeWidth="1" />
      {/* Inner chevron V mark */}
      <path d="M7 12L9.5 9v6z" fill="url(#vscGrad)" fillOpacity="0.95" stroke="none" />
      <path d="M9.5 9l5.5-2.5v11l-5.5-2.5" fill="none" stroke="#007ACC" strokeWidth="1.1" />
    </Svg>
  ),

  // Postman — rocket / send arrow in orange circle
  Postman: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="postBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF8A50" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#FF6C37" stopOpacity="0.08" />
        </linearGradient>
        <radialGradient id="postGrad" cx="38%" cy="32%" r="72%">
          <stop offset="0%" stopColor="#FF8A50" />
          <stop offset="100%" stopColor="#FF6C37" />
        </radialGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#postBg)" stroke="#FF6C37" strokeWidth="0.6" strokeOpacity="0.4" />
      <circle cx="12" cy="12" r="7.5" fill="url(#postGrad)" fillOpacity="0.20" stroke="#FF6C37" strokeWidth="1" />
      <ellipse cx="10" cy="9.5" rx="2" ry="1.3" fill="white" fillOpacity="0.10" stroke="none" />
      {/* Paper plane / send icon */}
      <path d="M6 12l11-4.5-4.5 11-1.5-4.5z" fill="#FF6C37" fillOpacity="0.90" stroke="none" />
      <path d="M11 14.5l4.5-7" fill="none" stroke="white" strokeWidth="0.7" strokeOpacity="0.5" />
    </Svg>
  ),

  // Figma — official 5-circle motif with brand colors
  Figma: ({ className }) => (
    <Svg className={className}>
      {/* Top-left — red */}
      <circle cx="9" cy="6.5" r="3" fill="#F24E1E" stroke="none" />
      {/* Top-right — violet */}
      <circle cx="15" cy="6.5" r="3" fill="#A259FF" stroke="none" />
      {/* Middle-left — orange */}
      <circle cx="9" cy="12.5" r="3" fill="#FF7262" stroke="none" />
      {/* Middle-right rounded rect — blue */}
      <rect x="12" y="9.5" width="6" height="6" rx="3" fill="#1ABCFE" stroke="none" />
      {/* Bottom-left — green */}
      <circle cx="9" cy="18.5" r="3" fill="#0ACF83" stroke="none" />
    </Svg>
  ),

  // Jira — Jira diamond logo (two chevrons pointing right)
  Board: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="jiraBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2684FF" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#0052CC" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="jiraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2684FF" />
          <stop offset="100%" stopColor="#0052CC" />
        </linearGradient>
        <linearGradient id="jiraGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2684FF" />
          <stop offset="100%" stopColor="#0052CC" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#jiraBg)" stroke="#0052CC" strokeWidth="0.6" strokeOpacity="0.4" />
      {/* Upper-right chevron */}
      <path d="M12 4l7.5 8-7.5 8" fill="none" stroke="url(#jiraGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Lower-left chevron */}
      <path d="M4.5 12l4.5 4L12 12l-3-4z" fill="url(#jiraGrad2)" stroke="none" />
    </Svg>
  ),

  // Slack — 4-colored hash/bolt logo motif
  Chat: ({ className }) => (
    <Svg className={className}>
      {/* Slack-style 4 rounded-rect segments */}
      <rect x="4.5" y="3.5" width="4" height="9" rx="2" fill="#E01E5A" stroke="none" />
      <rect x="7" y="8.5" width="9" height="4" rx="2" fill="#ECB22E" stroke="none" />
      <rect x="15.5" y="11.5" width="4" height="9" rx="2" fill="#2EB67D" stroke="none" />
      <rect x="8" y="15.5" width="9" height="4" rx="2" fill="#36C5F0" stroke="none" />
      {/* Corner dots (the rounded ends) */}
      <circle cx="4.5" cy="3.5" r="2" fill="#E01E5A" stroke="none" />
      <circle cx="4.5" cy="12.5" r="2" fill="#E01E5A" stroke="none" />
      <circle cx="19.5" cy="11.5" r="2" fill="#2EB67D" stroke="none" />
      <circle cx="19.5" cy="20.5" r="2" fill="#2EB67D" stroke="none" />
    </Svg>
  ),

  /* ---- Other ---- */

  // Three.js — isometric cube wireframe with subtle fill
  Cube3D: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="cubeBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#888" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#333" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="cubeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#888" />
          <stop offset="100%" stopColor="#333" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#cubeBg)" stroke="#555" strokeWidth="0.6" strokeOpacity="0.4" />
      {/* Top face */}
      <path d="M12 4L19.5 8.5L12 13L4.5 8.5z" fill="url(#cubeGrad)" fillOpacity="0.30" stroke="#555" strokeWidth="1" />
      {/* Left face */}
      <path d="M4.5 8.5v8L12 21v-8z" fill="url(#cubeGrad)" fillOpacity="0.18" stroke="#555" strokeWidth="1" />
      {/* Right face */}
      <path d="M19.5 8.5v8L12 21v-8z" fill="url(#cubeGrad)" fillOpacity="0.40" stroke="#555" strokeWidth="1" />
    </Svg>
  ),

  // Data Structures — binary tree with colored nodes
  Tree: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="treeBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22C55E" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#16A34A" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#treeBg)" stroke="#22C55E" strokeWidth="0.6" strokeOpacity="0.4" />
      <circle cx="12" cy="5.5" r="2" fill="#22C55E" stroke="none" />
      <circle cx="7" cy="12" r="2" fill="#22C55E" fillOpacity="0.75" stroke="none" />
      <circle cx="17" cy="12" r="2" fill="#22C55E" fillOpacity="0.75" stroke="none" />
      <circle cx="4.5" cy="18.5" r="1.8" fill="#22C55E" fillOpacity="0.50" stroke="none" />
      <circle cx="9.5" cy="18.5" r="1.8" fill="#22C55E" fillOpacity="0.50" stroke="none" />
      <circle cx="14.5" cy="18.5" r="1.8" fill="#22C55E" fillOpacity="0.50" stroke="none" />
      <path d="M10.5 7L7.5 10.5" fill="none" stroke="#16A34A" strokeWidth="1.3" />
      <path d="M13.5 7L16.5 10.5" fill="none" stroke="#16A34A" strokeWidth="1.3" />
      <path d="M5.5 14L4.5 17" fill="none" stroke="#16A34A" strokeWidth="1.2" />
      <path d="M8 14L9 17" fill="none" stroke="#16A34A" strokeWidth="1.2" />
      <path d="M16 14L15 17" fill="none" stroke="#16A34A" strokeWidth="1.2" />
    </Svg>
  ),

  // Algorithms — directed flow graph with colored arrows
  Graph: ({ className }) => (
    <Svg className={className}>
      <defs>
        <linearGradient id="graphBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#6D28D9" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#graphBg)" stroke="#8B5CF6" strokeWidth="0.6" strokeOpacity="0.4" />
      <circle cx="5.5" cy="6" r="2" fill="#8B5CF6" fillOpacity="0.70" stroke="#8B5CF6" strokeWidth="0.9" />
      <circle cx="18.5" cy="6" r="2" fill="#8B5CF6" fillOpacity="0.70" stroke="#8B5CF6" strokeWidth="0.9" />
      <circle cx="12" cy="12" r="2.5" fill="#8B5CF6" stroke="none" />
      <circle cx="5.5" cy="18" r="2" fill="#8B5CF6" fillOpacity="0.55" stroke="#8B5CF6" strokeWidth="0.9" />
      <circle cx="18.5" cy="18" r="2" fill="#8B5CF6" fillOpacity="0.55" stroke="#8B5CF6" strokeWidth="0.9" />
      <path d="M7.5 7L10.2 10" fill="none" stroke="#8B5CF6" strokeWidth="1.3" />
      <path d="M16.5 7L13.8 10" fill="none" stroke="#8B5CF6" strokeWidth="1.3" />
      <path d="M10.2 14L7.5 17" fill="none" stroke="#8B5CF6" strokeWidth="1.3" />
      <path d="M13.8 14L16.5 17" fill="none" stroke="#8B5CF6" strokeWidth="1.3" />
    </Svg>
  ),
};

// ============================================================================
// COMPREHENSIVE ICON MAPPING (All 55+ seeded skills)
// ============================================================================

const normalize = (value?: string) =>
  (value || '').toLowerCase().replace(/[^a-z0-9]/g, '');

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  // Premium SVG logos
  react: C.ReactLogo,
  nextjs: C.NextLogo,
  typescript: C.TsLogo,
  javascript: C.JsLogo,
  nodejs: C.NodeLogo,
  node: C.NodeLogo,
  tailwindcss: C.TailwindLogo,
  tailwind: C.TailwindLogo,
  docker: C.DockerLogo,
  mongodb: C.MongoLogo,
  redis: C.RedisLogo,

  // Remaining custom SVGs
  // Frontend
  html5: C.Html5,
  css3: C.Css3,
  vuejs: C.Vue,
  redux: C.Redux,
  reduxtoolkit: C.Redux,
  reactquery: C.ReactQuery,
  sassscss: C.Sass,
  webpack: C.Webpack,
  vite: C.Bolt,
  materialui: C.MaterialUI,

  // Backend
  expressjs: C.Express,
  restapi: C.RestApi,
  apolloserver: C.Apollo,
  netcore: C.DotNet,
  c: C.CSharp,
  fastapi: C.Bolt,
  nestjs: C.Nest,
  microservices: C.Mesh,
  websockets: C.Socket,
  socketio: C.Socket,
  jwtauthentication: C.JwtKey,
  oauth20: C.Shield,

  // Database
  mongoose: C.Leaf,
  postgres: C.Table,
  postgresql: C.Table,
  mysql: C.Dolphin,
  prisma: C.Prism,
  typeorm: C.Table,
  sql: C.Table,
  databasedesign: C.Schema,
  databaseoptimization: C.DbBolt,

  // DevOps
  git: C.Git,
  aws: C.Deploy,
  dockercompose: C.Stacked,
  githubactions: C.GearPlay,
  cicd: C.Deploy,
  vercel: C.Vercel,
  nginx: C.Nginx,

  // Tools
  python: C.Bolt,
  graphql: C.ReactQuery,
  vscode: C.VsCode,
  postman: C.Postman,
  figma: C.Figma,
  jira: C.Board,
  slack: C.Chat,

  // Other
  threejs: C.Cube3D,
  datastructures: C.Tree,
  algorithms: C.Graph,
};

// ============================================================================
// EXPORTED SKILL ICON COMPONENT
// ============================================================================

// ============================================================================
// SKILL COLOR MAPPING — Brand colors for each technology
// ============================================================================

// ============================================================================
// SKILL BRAND COLORS — Premium luxury look with authentic brand colors
// ============================================================================

const SKILL_COLORS: Record<string, string> = {
  // Frontend — Cyan/Blue tones
  react: '#61DAFB',
  nextjs: '#000000',
  vuejs: '#4FC08D',
  html5: '#E34C26',
  css3: '#1572B6',
  javascript: '#F7DF1E',
  typescript: '#3178C6',
  tailwindcss: '#06B6D4',
  tailwind: '#06B6D4',
  redux: '#764ABC',
  reactquery: '#FF4154',
  queryreact: '#FF4154',
  sass: '#C69',
  webpack: '#8DD6F9',
  vite: '#646CFF',
  materialui: '#007FFF',

  // Backend — Greens
  nodejs: '#339933',
  node: '#339933',
  expressjs: '#90C53F',
  express: '#90C53F',
  python: '#3776AB',
  fastapi: '#009688',
  nestjs: '#E0234E',
  restapi: '#22C55E',
  apolloserver: '#311C87',
  jwtauthentication: '#14B8A6',
  oauth20: '#2563EB',
  socketio: '#111827',
  websockets: '#0EA5E9',
  microservices: '#A855F7',

  // Database — Teals/Blues
  mongodb: '#47A248',
  mongoose: '#880000',
  postgres: '#336791',
  postgresql: '#336791',
  mysql: '#4479A1',
  redis: '#DC382D',
  prisma: '#2D3748',
  typeorm: '#FE0000',
  sql: '#0284C7',
  databasedesign: '#6366F1',
  databaseoptimization: '#0D9488',

  // DevOps — Oranges/Reds
  docker: '#2496ED',
  aws: '#FF9900',
  githubactions: '#2088FF',
  vercel: '#000000',
  nginx: '#009639',
  git: '#F1502F',
  dockercompose: '#1D63ED',
  cicd: '#F97316',

  // Tools — Purples/Pinks
  vscode: '#007ACC',
  figma: '#F24E1E',
  postman: '#FF6C37',
  graphql: '#E10098',
  apollo: '#311C87',
  jira: '#0052CC',
  slack: '#4A154B',

  // Other
  threejs: '#000000',
  kubernetes: '#326CE5',
  datastructures: '#22C55E',
  algorithms: '#8B5CF6',
  default: '#06B6D4',
};

export const SkillIcon = memo(function SkillIcon({
  skill,
  size = 'md',
}: {
  skill: { icon?: string; name: string };
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeClass = { sm: 'h-6 w-6', md: 'h-8 w-8', lg: 'h-10 w-10' }[size];
  const textClass = { sm: 'text-2xl', md: 'text-3xl', lg: 'text-4xl' }[size];
  const pad = { sm: '0.32rem', md: '0.46rem', lg: '0.62rem' }[size];

  const keyFromIcon = normalize(skill.icon);
  const keyFromName = normalize(skill.name);

  const color = SKILL_COLORS[keyFromName] || SKILL_COLORS[keyFromIcon] || SKILL_COLORS.default;
  const Icon = ICON_MAP[keyFromIcon] || ICON_MAP[keyFromName];

  if (Icon) {
    return (
      <div
        className={[
          'group/icon relative inline-flex items-center justify-center',
          'rounded-2xl overflow-hidden border',
          // ── Glass base: frosted surface responds to mode ──
          'bg-gradient-to-br from-white/95 via-[#f4f7fb] to-[#edf1f7] dark:from-[#0c1020] dark:via-[#0a0e1a] dark:to-[#070b14]',
          'backdrop-blur-md',
          'transition-all duration-300',
        ].join(' ')}
        style={{
          borderColor: `${color}40`,
          boxShadow: [
            // inner bevel — crisp top-edge chrome line
            `inset 0 1px 0 rgba(255,255,255,0.88)`,
            // inner side walls for depth
            `inset 1px 0 0 rgba(255,255,255,0.35)`,
            `inset -1px 0 0 rgba(0,0,0,0.04)`,
            // inner bottom taper
            `inset 0 -1px 0 rgba(0,0,0,0.08)`,
            // inner brand ring
            `inset 0 0 0 1px ${color}10`,
            // tight contact shadow
            `0 1px 2px rgba(0,0,0,0.10)`,
            // mid depth shadow
            `0 4px 14px rgba(0,0,0,0.12)`,
            // deep drop
            `0 10px 28px rgba(0,0,0,0.08)`,
            // brand halo
            `0 0 22px ${color}20`,
          ].join(', '),
          padding: pad,
          transition: 'all 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.transform = 'scale(1.14) translateY(-3px)';
          el.style.boxShadow = [
            `inset 0 1px 0 rgba(255,255,255,0.95)`,
            `inset 1px 0 0 rgba(255,255,255,0.50)`,
            `inset -1px 0 0 rgba(0,0,0,0.06)`,
            `inset 0 -1px 0 rgba(0,0,0,0.12)`,
            `inset 0 0 0 1px ${color}22`,
            `0 3px 8px rgba(0,0,0,0.18)`,
            `0 12px 30px rgba(0,0,0,0.15)`,
            `0 0 48px ${color}50`,
            `0 0 80px ${color}20`,
          ].join(', ');
          el.style.borderColor = `${color}80`;
          el.style.filter = `drop-shadow(0 4px 16px ${color}60)`;
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.transform = '';
          el.style.boxShadow = [
            `inset 0 1px 0 rgba(255,255,255,0.88)`,
            `inset 1px 0 0 rgba(255,255,255,0.35)`,
            `inset -1px 0 0 rgba(0,0,0,0.04)`,
            `inset 0 -1px 0 rgba(0,0,0,0.08)`,
            `inset 0 0 0 1px ${color}10`,
            `0 1px 2px rgba(0,0,0,0.10)`,
            `0 4px 14px rgba(0,0,0,0.12)`,
            `0 10px 28px rgba(0,0,0,0.08)`,
            `0 0 22px ${color}20`,
          ].join(', ');
          el.style.borderColor = `${color}40`;
          el.style.filter = '';
        }}
      >
        {/* ── Brand ambient radial: colour bleeding in from top-left ── */}
        <span
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 155% 125% at 16% 0%, ${color}38 0%, ${color}10 48%, transparent 70%)`,
          }}
        />

        {/* ── Glass dome: upper-half lens highlight (adapts per mode) ── */}
        <span
          className="absolute inset-x-0 top-0 pointer-events-none rounded-t-2xl h-[54%]
            bg-gradient-to-b from-white/50 dark:from-white/[0.09] via-white/20 dark:via-white/[0.03] to-transparent"
        />

        {/* ── Bottom-right warmth: brand light pooling in the base ── */}
        <span
          className="absolute bottom-0 right-0 pointer-events-none"
          style={{
            width: '54%',
            height: '54%',
            background: `radial-gradient(ellipse at 92% 92%, ${color}3c 0%, ${color}10 44%, transparent 68%)`,
            borderRadius: '0 0 16px 0',
          }}
        />

        {/* ── Specular dot: sharp glass-reflection point (top-left) ── */}
        <span
          className="absolute top-[3px] left-[4px] h-[6px] w-[6px] rounded-full pointer-events-none opacity-80 dark:opacity-60"
          style={{
            background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.5) 50%, transparent 78%)`,
          }}
        />

        {/* ── Rim highlight — bottom edge inner shine ── */}
        <span
          className="absolute inset-x-0 bottom-0 h-[1px] pointer-events-none rounded-b-2xl"
          style={{ background: `linear-gradient(to right, transparent, ${color}35, transparent)` }}
        />

        {/* ── Shimmer sweep across the face on hover ── */}
        <span
          className="absolute inset-0 -translate-x-full group-hover/icon:translate-x-[220%] transition-transform duration-700 ease-in-out pointer-events-none"
          style={{
            background: `linear-gradient(108deg, transparent 34%, ${color}1a 48%, rgba(255,255,255,0.45) 55%, ${color}14 62%, transparent 74%)`,
          }}
        />

        <Icon className={`${sizeClass} relative z-10`} />
      </div>
    );
  }

  return (
    <span
      className={`${textClass} transition-all duration-300`}
      style={{
        color,
        textShadow: `0 0 8px ${color}40, 0 0 2px ${color}25`,
      }}
    >
      {skill.icon || '✶'}
    </span>
  );
});

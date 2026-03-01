'use client';

import React, { useState, useEffect, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

/* ─── Icons ─── */
const Icons = {
  Terminal: ({ className }: { className?: string }) => (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" x2="20" y1="19" y2="19" />
    </svg>
  ),
  Github: ({ className }: { className?: string }) => (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  ),
  Linkedin: ({ className }: { className?: string }) => (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  Pulse: ({ className }: { className?: string }) => (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  X: ({ className }: { className?: string }) => (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4l11.733 16h4.267l-11.733-16z" />
      <path d="M4 20l6.768-6.768M17.232 10.768L20 4" />
    </svg>
  ),
};

/* ─── Signal Oscilloscope ─── */
const SignalOscilloscope = memo(() => (
  <div className="w-20 h-6 flex items-center justify-center">
    <svg width="60" height="24" viewBox="0 0 60 24" className="text-vision-cyan opacity-80">
      <motion.path
        d="M0 12 L8 12 L12 3 L20 21 L24 12 L32 12 L36 8 L40 16 L48 12 L56 12 L60 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: [0, 1, 1],
          pathOffset: [0, 0, 1],
          opacity: [0, 1, 0],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />
    </svg>
  </div>
));
SignalOscilloscope.displayName = 'SignalOscilloscope';

/* ─── Starfield – pure CSS dots generated once ─── */
const Starfield = memo(() => {
  const stars = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 1.5 + 0.5,
        delay: Math.random() * 4,
        duration: Math.random() * 3 + 2,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white dark:bg-white animate-twinkle"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            opacity: 0,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
});
Starfield.displayName = 'Starfield';

/* ─── Nav config ─── */
const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Skills', href: '/skills' },
  { label: 'Contact', href: '/#contact' },
];

const socialItems = [
  { label: 'GitHub', href: 'https://github.com/yourusername', icon: Icons.Github },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/yourusername', icon: Icons.Linkedin },
  { label: 'X', href: 'https://x.com/yourusername', icon: Icons.X },
];

/* ─── Stagger variants ─── */
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

/* ─── Footer ─── */
export const Footer = () => {
  const pathname = usePathname();
  const [sessionID, setSessionID] = useState('----');
  const [packets, setPackets] = useState(2048);

  useEffect(() => {
    setSessionID(Math.random().toString(16).toUpperCase().substring(2, 10));
    const interval = setInterval(() => {
      setPackets((prev) => prev + Math.floor(Math.random() * 8));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="relative z-[2] pt-14 pb-6 overflow-hidden border-t border-text-light/10 dark:border-white/[0.06] bg-stone-50/90 dark:bg-space-black/90 backdrop-blur-xl transition-colors duration-500">
      {/* Starry background */}
      <Starfield />

      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-vision-cyan/[0.04] blur-[100px] pointer-events-none" />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-6xl mx-auto px-6 relative z-10"
      >
        {/* ── Top row ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-8 border-b border-text-light/5 dark:border-white/[0.06]">
          {/* Brand */}
          <motion.div variants={item} className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 glassmorphism rounded-xl flex items-center justify-center text-vision-cyan border-2 border-vision-cyan/20">
                <Icons.Terminal />
              </div>
              <div>
                <h4 className="font-display font-black text-2xl tracking-tighter text-text-light dark:text-text-dark uppercase italic">
                  Voyager <span className="text-vision-cyan">OS</span>
                </h4>
                <div className="text-[8px] font-mono font-black text-vision-cyan tracking-[0.4em] uppercase mt-1">
                  System_Ready // v2.5
                </div>
              </div>
            </div>
            <p className="text-text-light/70 dark:text-text-dark/50 text-sm font-medium leading-relaxed max-w-sm">
              Architecting high-fidelity digital vessels at the edge of the singularity.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl glassmorphism border border-text-light/5 dark:border-white/5">
                <div className="text-[8px] font-mono font-black text-text-light/30 dark:text-text-dark/30 uppercase tracking-[0.3em] mb-2">
                  Uplink_Node
                </div>
                <div className="text-sm font-black text-vision-cyan font-mono tracking-wider tabular-nums">
                  #{sessionID}
                </div>
              </div>
              <div className="p-4 rounded-2xl glassmorphism border border-text-light/5 dark:border-white/5">
                <div className="text-[8px] font-mono font-black text-text-light/30 dark:text-text-dark/30 uppercase tracking-[0.3em] mb-2">
                  Sync_Status
                </div>
                <div className="text-sm font-black text-text-light dark:text-text-dark font-mono tracking-wider tabular-nums">
                  {packets.toLocaleString()}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div variants={item} className="md:col-span-3 md:col-start-7">
            <h5 className="text-[9px] font-mono font-black text-text-light/30 dark:text-text-dark/30 uppercase tracking-[0.4em] mb-5 flex items-center gap-2">
              <div className="w-6 h-[1px] bg-current" /> Directory
            </h5>
            <nav className="flex flex-col gap-2">
              {navItems.map((navItem, idx) => {
                const isActive =
                  pathname === navItem.href ||
                  (navItem.href !== '/' && pathname.startsWith(navItem.href.replace('/#', '/')));
                return (
                  <Link
                    key={navItem.label}
                    href={navItem.href}
                    className="group flex items-center gap-3 py-1 text-sm font-semibold text-text-light/70 dark:text-text-dark/50 hover:text-vision-cyan transition-colors duration-200"
                  >
                    <span className="text-[8px] font-mono text-vision-cyan/30 group-hover:text-vision-cyan/70 transition-colors">
                      0{idx + 1}
                    </span>
                    <span className="relative">
                      {navItem.label}
                      {/* Hover underline */}
                      <span className="absolute -bottom-0.5 left-0 h-[1px] w-0 bg-vision-cyan group-hover:w-full transition-all duration-300" />
                    </span>
                    {isActive && <span className="h-1 w-1 rounded-full bg-vision-cyan ml-1" />}
                  </Link>
                );
              })}
            </nav>
          </motion.div>

          {/* Telemetry + Social */}
          <motion.div variants={item} className="md:col-span-4 md:col-start-10 space-y-5">
            <h5 className="text-[9px] font-mono font-black text-text-light/30 dark:text-text-dark/30 uppercase tracking-[0.4em] mb-5 flex items-center gap-2">
              <div className="w-6 h-[1px] bg-current" /> Telemetry
            </h5>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="text-[8px] font-mono font-black text-text-light/30 dark:text-text-dark/30 uppercase tracking-widest">
                  Signal
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-lg" />
                  <span className="text-sm font-black text-text-light dark:text-text-dark uppercase tabular-nums">
                    Stable
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-[8px] font-mono font-black text-text-light/30 dark:text-text-dark/30 uppercase tracking-widest">
                  Latency
                </div>
                <div className="text-sm font-black text-text-light dark:text-text-dark tabular-nums tracking-tighter">
                  14ms
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl glassmorphism border border-text-light/5 dark:border-white/5 flex items-center justify-between group shadow-lg">
              <div>
                <div className="text-[9px] font-mono font-black text-text-light/20 dark:text-text-dark/20 uppercase tracking-[0.3em] mb-2">
                  Network_Viz
                </div>
                <SignalOscilloscope />
              </div>

              <div className="flex gap-2">
                {socialItems.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="h-11 w-11 glassmorphism rounded-xl flex items-center justify-center text-text-light dark:text-text-dark hover:text-vision-cyan hover:border-vision-cyan/30 transition-all border border-transparent shadow-md"
                  >
                    <social.icon />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Bottom bar ── */}
        <motion.div
          variants={item}
          className="pt-8 border-t border-text-light/5 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <div className="flex items-center gap-6 text-[9px] font-mono font-black text-text-light/30 dark:text-text-dark/30 uppercase tracking-[0.3em]">
            <span>© {new Date().getFullYear()} Voyager-OS</span>
            <div className="h-4 w-[1px] bg-current opacity-20 hidden md:block" />
            <span className="hidden md:block">Orbital_Sector_09</span>
          </div>

          <div className="flex items-center gap-8">
            <div className="text-right">
              <div className="text-[8px] font-mono font-black text-text-light/20 dark:text-text-dark/20 uppercase tracking-[0.4em]">
                Local_Time
              </div>
              <div className="text-xs font-black text-text-light dark:text-text-dark font-mono tabular-nums tracking-tighter">
                {new Date().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
              </div>
            </div>
            <div className="px-5 py-1.5 bg-vision-cyan/5 border border-vision-cyan/20 rounded-full text-vision-cyan text-[9px] font-mono font-black uppercase tracking-[0.4em] animate-pulse">
              SYNCED
            </div>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;

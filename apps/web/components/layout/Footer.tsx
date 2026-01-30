'use client';

import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

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
  Github: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5-.73 1.02-1.08 2.25-1 3.5 0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  ),
  X: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4l11.733 16h4.267l-11.733-16zM4 20l6.768-6.768m2.464-2.464L20 4" />
    </svg>
  ),
};

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

export const Footer = () => {
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
    <footer className="relative pt-32 pb-12 overflow-hidden border-t border-text-light/10 dark:border-white/10 bg-white dark:bg-space-black transition-colors duration-1000">
      <div className="absolute top-10 left-0 w-full overflow-hidden pointer-events-none opacity-[0.03] dark:opacity-[0.01]">
        <h2 className="text-[10vw] font-display font-black leading-none whitespace-nowrap tracking-[-0.05em] select-none text-center uppercase">
          VOYAGER EMISSION PROTOCOL
        </h2>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-[2rem] glassmorphism border border-text-light/5 dark:border-white/5 bg-text-light/[0.01] dark:bg-white/[0.01]">
                <div className="text-[8px] font-mono font-black text-text-light/30 dark:text-text-dark/30 uppercase tracking-[0.3em] mb-2">
                  Uplink_Node
                </div>
                <div className="text-sm font-black text-vision-cyan font-mono tracking-wider tabular-nums">
                  #{sessionID}
                </div>
              </div>
              <div className="p-6 rounded-[2rem] glassmorphism border border-text-light/5 dark:border-white/5 bg-text-light/[0.01] dark:bg-white/[0.01]">
                <div className="text-[8px] font-mono font-black text-text-light/30 dark:text-text-dark/30 uppercase tracking-[0.3em] mb-2">
                  Sync_Status
                </div>
                <div className="text-sm font-black text-text-light dark:text-text-dark font-mono tracking-wider tabular-nums">
                  {packets.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 lg:pt-2">
            <h5 className="text-[9px] font-mono font-black text-text-light/30 dark:text-text-dark/30 uppercase tracking-[0.4em] mb-8 flex items-center gap-2">
              <div className="w-6 h-[1px] bg-current" /> Directory
            </h5>
            <nav className="flex flex-col gap-5">
              {['Home', 'Archives', 'Capabilities', 'Uplink'].map((item, idx) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="group flex items-center gap-4 text-sm font-bold text-text-light/80 dark:text-text-dark/60 hover:text-vision-cyan transition-all duration-300"
                >
                  <span className="text-[9px] font-mono text-vision-cyan/40">0{idx + 1}</span>
                  {item}
                </a>
              ))}
            </nav>
          </div>

          <div className="lg:col-span-4 lg:pt-2 space-y-12">
            <h5 className="text-[9px] font-mono font-black text-text-light/30 dark:text-text-dark/30 uppercase tracking-[0.4em] mb-8 flex items-center gap-2">
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

            <div className="p-8 rounded-[2.5rem] glassmorphism border border-text-light/5 dark:border-white/5 flex items-center justify-between group shadow-lg">
              <div>
                <div className="text-[9px] font-mono font-black text-text-light/20 dark:text-text-dark/20 uppercase tracking-[0.3em] mb-2">
                  Network_Viz
                </div>
                <SignalOscilloscope />
              </div>

              <div className="flex gap-3">
                {[Icons.Github, Icons.X].map((Icon, i) => (
                  <motion.a
                    key={i}
                    whileHover={{ scale: 1.1, y: -3 }}
                    href="#"
                    className="h-12 w-12 glassmorphism rounded-xl flex items-center justify-center text-text-light dark:text-text-dark hover:text-vision-cyan transition-all border border-transparent shadow-md"
                  >
                    <Icon />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-text-light/5 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6 text-[9px] font-mono font-black text-text-light/30 dark:text-text-dark/30 uppercase tracking-[0.3em]">
            <span> 2025 Voyager-OS</span>
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
        </div>
      </div>
    </footer>
  );
};

export default Footer;

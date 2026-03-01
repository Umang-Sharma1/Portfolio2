'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

const Icons = {
  Sun: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  ),
  Moon: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  ),
  Activity: ({ className }: { className?: string }) => (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  Command: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <path d="M9 3v18" />
      <path d="M3 9h18" />
      <path d="M3 15h18" />
      <path d="M15 3v18" />
    </svg>
  ),
  Menu: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  ),
  X: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  ),
};

type NavContext = 'LOCAL' | 'GLOBAL';

const NavItem = ({
  name,
  id,
  isActive,
  onClick,
  isExternal = false,
}: {
  name: string;
  id: string;
  isActive: boolean;
  onClick: () => void;
  isExternal?: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      style={
        isActive
          ? {
              color: '#22D3EE',
              backgroundColor: 'rgba(34,211,238,0.12)',
              border: '1px solid rgba(34,211,238,0.4)',
              boxShadow:
                '0 0 20px rgba(34,211,238,0.25), inset 0 0 12px rgba(34,211,238,0.06)',
            }
          : { border: '1px solid transparent' }
      }
      className={cn(
        'relative px-4 py-2 text-[10px] font-mono font-black tracking-[0.3em] uppercase rounded-lg transition-all duration-300',
        !isActive && 'text-slate-600 dark:text-slate-400 hover:text-vision-cyan'
      )}
    >
      <span className="flex items-center gap-2">
        {name}
        {isExternal && <span className="h-1 w-1 rounded-full bg-vision-orange" />}
      </span>
    </button>
  );
};

export const Header = () => {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [navContext, setNavContext] = useState<NavContext>(isHomePage ? 'LOCAL' : 'GLOBAL');
  const [isHidden, setIsHidden] = useState(false);
  const [currentSection, setCurrentSection] = useState(
    isHomePage
      ? 'CORE_SINGULARITY'
      : pathname === '/skills'
        ? 'ARSENAL_MANIFEST'
        : pathname === '/projects'
          ? 'MISSION_ARCHIVES'
          : pathname === '/contact'
            ? 'UPLINK_CHANNEL'
            : 'CORE_SINGULARITY'
  );
  const [memory, setMemory] = useState('12.4MB');
  const [uptime, setUptime] = useState('00:00:00');
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const startTime = useRef(Date.now());

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-switch nav context and section label based on route
  useEffect(() => {
    if (pathname === '/') {
      setNavContext('LOCAL');
      setCurrentSection('CORE_SINGULARITY');
    } else {
      setNavContext('GLOBAL');
      if (pathname === '/skills') setCurrentSection('ARSENAL_MANIFEST');
      else if (pathname === '/projects') setCurrentSection('MISSION_ARCHIVES');
      else if (pathname === '/contact') setCurrentSection('UPLINK_CHANNEL');
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
            home: 'CORE_SINGULARITY',
            skills: 'ARSENAL_MANIFEST',
            projects: 'MISSION_ARCHIVES',
            timeline: 'FLIGHT_PATH',
            contact: 'UPLINK_CHANNEL',
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
          if (!found || current < 200) setCurrentSection('CORE_SINGULARITY');
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
    { name: 'Core', id: 'home' },
    { name: 'Arsenal', id: 'skills' },
    { name: 'Missions', id: 'projects' },
    { name: 'Timeline', id: 'timeline' },
    { name: 'Uplink', id: 'contact' },
  ];

  const globalItems = [
    { name: 'Main Core', id: '/', external: false },
    { name: 'Archives', id: '/projects', external: true },
    { name: 'Manifest', id: '/skills', external: true },
    { name: 'Uplink', id: '/contact', external: true },
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
    core_singularity: 'home',
    arsenal_manifest: 'skills',
    mission_archives: 'projects',
    flight_path: 'timeline',
    uplink_channel: 'contact',
  };
  const activeNavId = sectionToNavId[currentSection.toLowerCase()] || 'home';

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[1000] p-4 md:p-6 pointer-events-none">
        <motion.div
          animate={{
            y: isHidden ? -120 : 0,
            opacity: isHidden ? 0 : 1,
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
              <div className="h-9 w-9 md:h-10 md:w-10 glassmorphism rounded-xl flex items-center justify-center text-vision-cyan border border-vision-cyan/20 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(34,211,238,0.15)]">
                <span className="font-display font-black text-base md:text-lg italic">V</span>
              </div>
              <div className="space-y-0.5">
                <h1 className="text-[9px] md:text-[10px] font-mono font-black tracking-[0.3em] uppercase text-slate-800 dark:text-text-dark">
                  Voyager.OS
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
                    />
                  );
                })}
              </div>

              <div className="h-6 w-[1px] bg-slate-200 dark:bg-white/10 mx-2" />

              <button
                onClick={() => setNavContext(navContext === 'LOCAL' ? 'GLOBAL' : 'LOCAL')}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-vision-cyan transition-colors"
                title="Toggle Navigation Mode"
              >
                <Icons.Command />
              </button>
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
                  SIGNAL
                </div>
                <div className="flex gap-0.5 mt-1">
                  {[1, 1, 1, 0].map((b, i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: b ? [0.4, 1, 0.4] : 0.1 }}
                      transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
                      className={cn(
                        'w-2 h-1 rounded-full',
                        b
                          ? 'bg-vision-cyan shadow-[0_0_5px_#22D3EE]'
                          : 'bg-slate-300 dark:bg-white/5'
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>

            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="h-10 w-10 md:h-12 md:w-12 glassmorphism rounded-2xl flex items-center justify-center text-slate-600 dark:text-text-dark/60 hover:text-vision-cyan hover:border-vision-cyan/50 transition-all border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/5 shadow-lg"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Icons.Sun /> : <Icons.Moon />}
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden h-10 w-10 flex items-center justify-center text-slate-600 dark:text-white/60 hover:text-vision-cyan transition-colors glassmorphism rounded-xl border border-slate-200 dark:border-white/10"
              aria-label="Open Menu"
            >
              <Icons.Menu />
            </button>
          </div>
        </motion.div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(24px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            className="fixed inset-0 z-[2000] bg-white/98 dark:bg-space-black/98 flex flex-col p-8 pt-24"
          >
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center text-slate-500 dark:text-white/40 hover:text-vision-cyan border border-slate-200 dark:border-white/10 rounded-full transition-colors"
              aria-label="Close Menu"
            >
              <Icons.X />
            </button>

            <div className="flex flex-col gap-6 mt-8">
              {(navContext === 'LOCAL' ? localItems : globalItems).map((item, idx) => (
                <motion.button
                  key={item.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => handleAction(item.id, (item as any).external || false)}
                  className="text-4xl md:text-5xl font-display font-black text-slate-800 dark:text-white hover:text-vision-cyan transition-colors text-left uppercase tracking-tight"
                >
                  {item.name}
                </motion.button>
              ))}
            </div>

            <div className="mt-auto pt-8 border-t border-slate-200 dark:border-white/10">
              <button
                onClick={() => setNavContext(navContext === 'LOCAL' ? 'GLOBAL' : 'LOCAL')}
                className="text-sm font-mono font-bold text-slate-500 dark:text-white/40 hover:text-vision-cyan transition-colors flex items-center gap-3"
              >
                <Icons.Command />
                Switch to {navContext === 'LOCAL' ? 'Global' : 'Local'} Navigation
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;

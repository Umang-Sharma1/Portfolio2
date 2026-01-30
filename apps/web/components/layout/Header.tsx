'use client';

import React, { useState, useEffect, useMemo, memo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { useTheme } from 'next-themes';

// Local utility to avoid missing dependencies
const cn = (...classes: (string | boolean | undefined | null)[]) =>
  classes.filter(Boolean).join(' ');

// ============================================================================
// PERFORMANCE-OPTIMIZED ICONS (Inline SVG)
// ============================================================================

const Icons = {
  Portal: () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  ),
  Signal: ({ className }: { className?: string }) => (
    <svg
      className={className}
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 20h.01" />
      <path d="M7 20v-4" />
      <path d="M12 20v-8" />
      <path d="M17 20V8" />
      <path d="M22 20V4" />
    </svg>
  ),
  Battery: ({ className }: { className?: string }) => (
    <svg
      className={className}
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="10" x="2" y="7" rx="2" ry="2" />
      <line x1="22" x2="22" y1="11" y2="13" />
    </svg>
  ),
  Activity: ({ className }: { className?: string }) => (
    <svg
      className={className}
      width="8"
      height="8"
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
  Sun: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
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
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
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

const TelemetryHUD = memo(() => {
  const [time, setTime] = useState('--:--:--');
  const [battery, setBattery] = useState(98);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    }, 1000);
    const battInterval = setInterval(() => {
      setBattery((prev) => Math.max(94, Math.min(100, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 8000);
    return () => {
      clearInterval(timer);
      clearInterval(battInterval);
    };
  }, []);

  return (
    <div className="hidden xl:flex items-center gap-6 px-5 border-l border-black/10 dark:border-white/10 ml-5 h-8 text-[9px] font-mono tracking-[0.2em] text-slate-500 dark:text-white/30 uppercase">
      <div className="flex items-center gap-2">
        <Icons.Signal className="text-blue-600 dark:text-neon-cyan animate-pulse" />
        <span>Uplink: Live</span>
      </div>
      <div className="flex items-center gap-2">
        <Icons.Battery
          className={battery < 20 ? 'text-red-500' : 'text-slate-400 dark:text-white/20'}
        />
        <span>Pwr: {battery}%</span>
      </div>
      <div className="w-16 tabular-nums text-slate-900 dark:text-white/60">{time}</div>
    </div>
  );
});

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Added Home and aligned IDs with sections
  const NAV_ITEMS = useMemo(
    () => [
      { label: 'Home', id: 'home', type: 'section' as const },
      { label: 'Skills', id: 'skills', href: '/skills', type: 'route' as const },
      { label: 'Missions', id: 'missions', type: 'section' as const },
      { label: 'Archives', id: 'archives', type: 'section' as const },
      { label: 'Telemetry', id: 'telemetry', type: 'section' as const },
    ],
    []
  );

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 50);
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Adjust threshold to be more sensitive for section highlighting
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: [0.3, 0.5], rootMargin: '-10% 0px -80% 0px' }
    );

    NAV_ITEMS.filter((item) => item.type === 'section').forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [NAV_ITEMS]);

  const handleNavClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <motion.header
        animate={{
          paddingTop: isScrolled ? '1rem' : '2rem',
        }}
        className="fixed top-0 left-0 right-0 z-[100] p-6 pointer-events-none"
      >
        <motion.div
          animate={{
            width: isScrolled ? '95%' : '100%',
            backgroundColor: isScrolled
              ? theme === 'light'
                ? 'rgba(255, 255, 255, 0.95)'
                : 'rgba(3, 0, 20, 0.7)'
              : 'transparent',
            backdropFilter: isScrolled ? 'blur(24px)' : 'blur(0px)',
            borderRadius: isScrolled ? '100px' : '0px',
            borderColor: isScrolled
              ? theme === 'light'
                ? 'rgba(0, 0, 0, 0.05)'
                : 'rgba(255, 255, 255, 0.1)'
              : 'transparent',
            boxShadow: isScrolled ? '0 20px 50px -10px rgba(0,0,0,0.1)' : 'none',
          }}
          className="max-w-[1400px] mx-auto flex items-center justify-between px-6 py-3 pointer-events-auto transition-all duration-500"
        >
          {/* Logo */}
          <div
            className="flex items-center gap-4 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="h-11 w-11 glassmorphism rounded-2xl flex items-center justify-center text-vision-cyan border-2 border-vision-cyan/20 group-hover:border-vision-cyan transition-all group-hover:scale-105 shadow-glow shadow-vision-cyan/10">
              <motion.div
                animate={{ y: [-40, 40] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                className="absolute inset-0 bg-white/30 w-full h-[1px] blur-[1px]"
              />
              <span className="font-display font-black text-xl italic">V</span>
            </div>
            <div className="hidden md:block">
              <h1 className="text-[11px] font-mono font-black tracking-[0.5em] uppercase text-slate-900 dark:text-text-dark">
                VOYAGER.OS
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Icons.Activity className="text-vision-cyan animate-pulse" />
                <span className="text-[8px] font-mono font-black text-vision-cyan/60 uppercase tracking-[0.3em]">
                  Sector_{activeSection}
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-2 glassmorphism px-8 py-3 rounded-[2rem] border-2 border-slate-100 dark:border-white/10 shadow-2xl backdrop-blur-[32px] bg-white/40 dark:bg-space-black/60">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.type === 'route'
                  ? !!pathname?.startsWith(item.href || '')
                  : activeSection === item.id;
              return (
                <div key={item.id} className="relative group flex items-center">
                  {item.type === 'route' ? (
                    <Link
                      href={item.href || '/'}
                      className={cn(
                        'px-4 py-2 text-[10px] font-mono font-black uppercase tracking-[0.3em] transition-all duration-500 z-10',
                        isActive ? 'text-vision-cyan' : 'text-slate-500 hover:text-vision-cyan'
                      )}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => handleNavClick(item.id, e)}
                      className={cn(
                        'px-4 py-2 text-[10px] font-mono font-black uppercase tracking-[0.3em] transition-all duration-500 z-10',
                        isActive ? 'text-vision-cyan' : 'text-slate-500 hover:text-vision-cyan'
                      )}
                    >
                      {item.label}
                    </a>
                  )}

                  {isActive && (
                    <motion.div
                      layoutId="navGlow"
                      className="absolute -bottom-1 left-4 right-4 h-[2px] bg-vision-cyan shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    />
                  )}
                </div>
              );
            })}

            <TelemetryHUD />
          </nav>

          <div className="flex items-center gap-6">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="h-12 w-12 glassmorphism rounded-2xl flex items-center justify-center text-slate-400 dark:text-text-dark/40 hover:text-vision-cyan hover:border-vision-cyan/50 transition-all border-2 border-slate-200 dark:border-transparent bg-slate-50 dark:bg-white/5"
                aria-label="Toggle System Theme"
              >
                {theme === 'dark' ? <Icons.Sun /> : <Icons.Moon />}
              </button>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-600 dark:text-white/40 hover:text-slate-900 dark:hover:text-white"
            >
              <Icons.Menu />
            </button>
          </div>
        </motion.div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(24px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            className="fixed inset-0 z-[200] bg-white/95 dark:bg-space-black/95 flex flex-col p-8 pt-24"
          >
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center text-slate-400 dark:text-white/20 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 rounded-full"
            >
              <Icons.X />
            </button>

            <div className="flex flex-col gap-6">
              {NAV_ITEMS.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  {item.type === 'route' ? (
                    <Link
                      href={item.href || '/'}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-5xl font-display font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-neon-cyan transition-colors flex items-center justify-between group"
                    >
                      <span>{item.label}</span>
                      <Icons.Portal />
                    </Link>
                  ) : (
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => handleNavClick(item.id, e)}
                      className="text-5xl font-display font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-neon-cyan transition-colors flex items-center justify-between group"
                    >
                      <span>{item.label}</span>
                      <Icons.Portal />
                    </a>
                  )}
                  <div className="h-px w-full bg-slate-100 dark:bg-white/5 mt-4" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

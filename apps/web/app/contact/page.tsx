'use client';

import React, { useState, useRef, useEffect, memo } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useMutation } from '@apollo/client';
import Link from 'next/link';
import { SEND_CONTACT_MESSAGE } from '@/lib/graphql/mutations';
import PageStarfield from '@/components/background/PageStarfield';

const MotionDiv = motion.div as any;
const MotionSpan = motion.span as any;

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

// ============================================================================
// TEXT MORPH ANIMATION
// ============================================================================

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*!?';

function useTextMorph(from: string, to: string, trigger: boolean, duration = 1400) {
  const [display, setDisplay] = useState(from);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!trigger) {
      setDisplay(from);
      return;
    }
    const start = performance.now();
    let cancelled = false;
    function tick(now: number) {
      if (cancelled) return;
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      if (progress < 0.35) {
        const f = progress / 0.35;
        let r = '';
        for (let i = 0; i < from.length; i++) {
          if (from[i] === ' ') r += ' ';
          else if (Math.random() < f) r += CHARS[Math.floor(Math.random() * CHARS.length)];
          else r += from[i];
        }
        setDisplay(r);
      } else {
        const rp = (progress - 0.35) / 0.65;
        const resolved = Math.floor(rp * to.length);
        let r = '';
        for (let i = 0; i < to.length; i++) {
          if (to[i] === ' ') r += ' ';
          else if (i < resolved) r += to[i];
          else r += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
        setDisplay(r);
      }
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
      else setDisplay(to);
    }
    frameRef.current = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frameRef.current);
    };
  }, [trigger, from, to, duration]);
  return display;
}

// ============================================================================
// ICONS
// ============================================================================

// ============================================================================
// BACK BUTTON
// ============================================================================

const BackButton = memo(function BackButton() {
  return (
    <Link
      href="/"
      className={cn(
        'group relative inline-flex items-center gap-3 px-5 py-2.5 rounded-xl overflow-hidden',
        'text-[10px] font-mono font-black uppercase tracking-[0.3em]',
        'text-slate-500 dark:text-white/40 hover:text-vision-cyan',
        'backdrop-blur-md',
        'bg-white/60 dark:bg-white/[0.04]',
        'border border-slate-200/70 dark:border-white/[0.08]',
        'hover:border-vision-cyan/40 dark:hover:border-vision-cyan/30',
        'shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_2px_10px_rgba(0,0,0,0.06)]',
        'dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_0_16px_rgba(0,200,232,0.06)]',
        'hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_0_24px_rgba(0,200,232,0.15)]',
        'dark:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_28px_rgba(0,200,232,0.18)]',
        'transition-all duration-300'
      )}
    >
      <span className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t border-l border-slate-300/50 dark:border-white/[0.08] group-hover:border-vision-cyan/50 transition-colors duration-300" />
      <span className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b border-r border-slate-300/50 dark:border-white/[0.08] group-hover:border-vision-cyan/50 transition-colors duration-300" />
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none bg-gradient-to-r from-transparent via-vision-cyan/[0.08] to-transparent" />
      <svg
        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1.5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m12 19-7-7 7-7" />
        <path d="M19 12H5" />
      </svg>
      <span>Back to Core</span>
      <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-white/15 group-hover:bg-vision-cyan group-hover:shadow-[0_0_6px_rgba(0,200,232,0.7)] transition-all duration-300" />
    </Link>
  );
});

// ============================================================================
// ICONS
// ============================================================================

const Icons = {
  Send: memo(({ className }: { className?: string }) => (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  )),
  Check: memo(({ size = 20 }: { size?: number }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )),
  Alert: memo(() => (
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
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )),
  Activity: memo(({ className }: { className?: string }) => (
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
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )),
  Github: memo(({ className }: { className?: string }) => (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  )),
  Linkedin: memo(({ className }: { className?: string }) => (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )),
  Twitter: memo(({ className }: { className?: string }) => (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )),
  Mail: memo(({ className }: { className?: string }) => (
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
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )),
};

// ============================================================================
// VALIDATION
// ============================================================================

const VALIDATION = {
  name: { min: 2, messages: { required: 'Origin_ID missing', min: 'ID_too_short' } },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    messages: { required: 'Signal_coord missing', pattern: 'Invalid_coord_format' },
  },
  subject: { min: 3, messages: { required: 'Subject_missing', min: 'Subject_too_short' } },
  message: { min: 10, messages: { required: 'Payload missing', min: 'Payload_too_small' } },
};

type FormStatus = 'IDLE' | 'SYNCING' | 'TRANSMITTING' | 'SUCCESS' | 'ERROR';

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const SystemInput = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  type = 'text',
  placeholder,
  disabled,
  isTextArea = false,
}: any) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative space-y-3 group w-full">
      <div className="flex items-center justify-between px-6">
        <label
          className={cn(
            'text-[10px] font-mono font-black uppercase tracking-[0.5em] transition-colors duration-500',
            isFocused
              ? 'text-vision-cyan'
              : error
                ? 'text-vision-crimson'
                : 'text-slate-500 dark:text-text-dark/30'
          )}
        >
          {isFocused ? '>> ' : '// '}
          {label}
        </label>
        <AnimatePresence>
          {error && (
            <MotionSpan
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="text-[9px] font-mono font-black text-vision-crimson uppercase tracking-tighter flex items-center gap-2"
            >
              <Icons.Alert /> {error}
            </MotionSpan>
          )}
        </AnimatePresence>
      </div>
      <div
        className={cn(
          'relative transition-all duration-700 rounded-[2rem] overflow-hidden border-[0.5px]',
          isFocused
            ? 'bg-slate-100/50 dark:bg-white/[0.08] border-vision-cyan/50 backdrop-blur-[40px] shadow-[inset_0_0_25px_rgba(var(--glow-cyan),0.1),0_25px_50px_rgba(0,0,0,0.08)] scale-[1.01]'
            : error
              ? 'bg-vision-crimson/[0.04] border-vision-crimson/30'
              : 'bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/10'
        )}
      >
        <div
          className={cn(
            'absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 rounded-tl-lg transition-colors duration-500 pointer-events-none z-10',
            isFocused ? 'border-vision-crimson/40' : 'border-vision-crimson/10'
          )}
        />
        <div
          className={cn(
            'absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 rounded-br-lg transition-colors duration-500 pointer-events-none z-10',
            isFocused ? 'border-vision-cyan/40' : 'border-vision-cyan/10'
          )}
        />
        {isTextArea ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            rows={6}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur(e);
            }}
            onFocus={() => setIsFocused(true)}
            className="w-full bg-transparent px-8 py-6 outline-none text-slate-900 dark:text-text-dark font-mono font-bold text-sm resize-none placeholder:text-slate-300 dark:placeholder:text-white/15 transition-colors"
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur(e);
            }}
            onFocus={() => setIsFocused(true)}
            className="w-full bg-transparent px-8 py-6 outline-none text-slate-900 dark:text-text-dark font-mono font-bold text-sm placeholder:text-slate-300 dark:placeholder:text-white/15 transition-colors"
          />
        )}
      </div>
    </div>
  );
};

const BURST_PARTICLES = 16;

const Toast = memo(({ message, onExit }: { message: string; onExit: () => void }) => {
  const [phase, setPhase] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [particles] = useState(() =>
    Array.from({ length: BURST_PARTICLES }, (_, i) => ({
      angle: (i / BURST_PARTICLES) * 360,
      distance: 60 + Math.random() * 100,
      size: 2 + Math.random() * 4,
      delay: Math.random() * 0.15,
      color: i % 3 === 0 ? '#22D3EE' : i % 3 === 1 ? '#E11D48' : '#F97316',
    }))
  );
  const confirmText = 'TRANSMISSION_VERIFIED';

  useEffect(() => {
    const timer = setTimeout(onExit, 7000);
    return () => clearTimeout(timer);
  }, [onExit]);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800);
    const t2 = setTimeout(() => setPhase(2), 2000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    if (phase < 1) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTypedText(confirmText.slice(0, i));
      if (i >= confirmText.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [phase]);

  return (
    <MotionDiv
      initial={{ opacity: 0, y: -60, scale: 0.3, filter: 'blur(20px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -30, scale: 0.8, filter: 'blur(10px)' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-24 right-8 z-[2000] w-96"
    >
      {/* Burst particles */}
      <div className="absolute inset-0 pointer-events-none z-50">
        {particles.map((p, i) => (
          <MotionDiv
            key={i}
            initial={{
              opacity: 1,
              x: '50%',
              y: '50%',
              scale: 1,
            }}
            animate={{
              opacity: 0,
              x: `calc(50% + ${Math.cos((p.angle * Math.PI) / 180) * p.distance}px)`,
              y: `calc(50% + ${Math.sin((p.angle * Math.PI) / 180) * p.distance}px)`,
              scale: 0,
            }}
            transition={{ duration: 0.8, delay: p.delay, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute',
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: p.color,
              boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            }}
          />
        ))}
      </div>

      {/* Expanding ring burst */}
      <MotionDiv
        initial={{ opacity: 0.25, scale: 0.3 }}
        animate={{ opacity: 0, scale: 3.2 }}
        transition={{ duration: 1.4, delay: 0.2, ease: 'easeOut' }}
        className="absolute inset-0 rounded-2xl border border-vision-crimson/30 pointer-events-none z-40"
      />
      <MotionDiv
        initial={{ opacity: 0.8, scale: 0.5 }}
        animate={{ opacity: 0, scale: 2.5 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="absolute inset-0 rounded-2xl border-2 border-vision-cyan/60 pointer-events-none z-40"
      />
      <MotionDiv
        initial={{ opacity: 0.5, scale: 0.7 }}
        animate={{ opacity: 0, scale: 2 }}
        transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
        className="absolute inset-0 rounded-2xl border border-vision-cyan/30 pointer-events-none z-40"
      />

      {/* Flash overlay */}
      <MotionDiv
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 rounded-2xl bg-vision-cyan/20 pointer-events-none z-30"
      />

      {/* Outer glow */}
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute -inset-[2px] rounded-2xl bg-gradient-to-br from-vision-cyan/50 via-transparent to-vision-crimson/30 blur-[2px]"
      />

      <div className="relative rounded-2xl border border-vision-cyan/30 bg-slate-950/95 backdrop-blur-[60px] shadow-[0_0_80px_rgba(var(--glow-cyan),0.25),0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* HUD corner brackets */}
        <div className="absolute top-[6px] left-[6px] w-3 h-3 border-t border-l border-vision-cyan/50 pointer-events-none z-20" />
        <div className="absolute top-[6px] right-[6px] w-3 h-3 border-t border-r border-vision-cyan/30 pointer-events-none z-20" />
        <div className="absolute bottom-[6px] left-[6px] w-3 h-3 border-b border-l border-vision-cyan/30 pointer-events-none z-20" />
        <div className="absolute bottom-[6px] right-[6px] w-3 h-3 border-b border-r border-vision-crimson/40 pointer-events-none z-20" />

        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-30">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(var(--glow-cyan),0.03)_2px,rgba(var(--glow-cyan),0.03)_4px)]" />
          <MotionDiv
            animate={{ y: ['0%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute left-0 right-0 h-8 bg-gradient-to-b from-transparent via-vision-cyan/5 to-transparent"
          />
        </div>

        <div className="relative z-10 flex items-center justify-between px-5 py-3 border-b border-vision-cyan/10">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <MotionDiv
                  key={i}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1.5, delay: i * 0.15, repeat: Infinity }}
                  className="w-1 rounded-full bg-vision-cyan"
                  style={{ height: 4 + i * 3 }}
                />
              ))}
            </div>
            <span className="text-[8px] font-mono font-black text-vision-cyan/60 uppercase tracking-[0.4em]">
              Signal_Lock
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MotionDiv
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]"
            />
            <span className="text-[8px] font-mono font-black text-emerald-400/80 uppercase tracking-widest">
              Secure
            </span>
            <button
              onClick={onExit}
              className="ml-2 h-5 w-5 rounded flex items-center justify-center text-slate-600 hover:text-vision-crimson hover:bg-vision-crimson/10 transition-all"
              aria-label="Dismiss"
            >
              <svg
                width="7"
                height="7"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="relative z-10 p-5 space-y-4">
          <AnimatePresence mode="wait">
            {phase === 0 && (
              <MotionDiv
                key="decrypt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <MotionDiv
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="h-5 w-5 border-2 border-vision-cyan/40 border-t-vision-cyan rounded-full"
                />
                <span className="text-[10px] font-mono font-black text-vision-cyan/60 uppercase tracking-[0.3em]">
                  Decrypting_Payload...
                </span>
              </MotionDiv>
            )}
          </AnimatePresence>

          {phase >= 1 && (
            <MotionDiv
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <MotionDiv
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                    className="h-9 w-9 rounded-xl bg-vision-cyan/10 border border-vision-cyan/30 flex items-center justify-center shadow-[0_0_20px_rgba(var(--glow-cyan),0.3)]"
                  >
                    <Icons.Check />
                  </MotionDiv>
                  <MotionDiv
                    initial={{ scale: 0.6, opacity: 0.9 }}
                    animate={{ scale: 2.4, opacity: 0 }}
                    transition={{ duration: 0.9, delay: 0.15 }}
                    className="absolute inset-0 rounded-xl border border-vision-cyan/70 pointer-events-none"
                  />
                </div>
                <div className="font-mono font-black text-sm text-vision-cyan tracking-wider">
                  {typedText}
                  <MotionSpan
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="text-vision-cyan"
                  >
                    _
                  </MotionSpan>
                </div>
              </div>

              {phase >= 2 && (
                <MotionDiv
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.4 }}
                  className="space-y-3"
                >
                  <div className="px-4 py-3 rounded-lg bg-vision-cyan/5 border border-vision-cyan/10">
                    <p className="text-[11px] font-mono font-bold text-slate-300 leading-relaxed">
                      {message}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[7px] font-mono font-black uppercase tracking-[0.3em]">
                    <span className="text-slate-500">Latency: 42ms</span>
                    <span className="text-slate-500">Protocol: TLS_1.3</span>
                    <span className="text-emerald-400/60">Integrity: OK</span>
                  </div>
                </MotionDiv>
              )}
            </MotionDiv>
          )}
        </div>

        <div className="relative h-[2px] bg-white/5 overflow-hidden">
          <MotionDiv
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 7, ease: 'linear' }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-vision-cyan via-vision-cyan to-vision-cyan/50 shadow-[0_0_10px_rgba(var(--glow-cyan),1)] overflow-hidden"
          >
            <MotionDiv
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.4 }}
              className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/70 to-transparent"
            />
          </MotionDiv>
        </div>
      </div>
    </MotionDiv>
  );
});

const SocialLink = ({
  icon: Icon,
  label,
  href,
  description,
}: {
  icon: any;
  label: string;
  href: string;
  description: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex items-center gap-5 p-6 rounded-[2rem] glassmorphism border-[0.5px] border-slate-200 dark:border-white/5 hover:border-vision-cyan/40 transition-all duration-500 bg-slate-50/30 dark:bg-white/[0.02] hover:bg-vision-cyan/5 shadow-lg hover:shadow-[0_0_30px_rgba(var(--glow-cyan),0.1)]"
  >
    <div className="h-12 w-12 rounded-2xl bg-vision-cyan/10 flex items-center justify-center text-vision-cyan/60 group-hover:text-vision-cyan border border-vision-cyan/10 group-hover:border-vision-cyan/30 transition-all group-hover:scale-110">
      <Icon />
    </div>
    <div className="flex-1">
      <div className="text-[10px] font-mono font-black text-slate-400 dark:text-text-dark/30 uppercase tracking-[0.4em] group-hover:text-vision-cyan transition-colors">
        {label}
      </div>
      <div className="text-sm font-bold text-slate-700 dark:text-text-dark/60 mt-1 group-hover:text-slate-900 dark:group-hover:text-text-dark transition-colors">
        {description}
      </div>
    </div>
    <div className="h-8 w-8 rounded-full border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-400 group-hover:text-vision-cyan group-hover:border-vision-cyan/30 transition-all group-hover:translate-x-1">
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </div>
  </a>
);

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-5%' });
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    subject: false,
    message: false,
  });
  const [liveTime, setLiveTime] = useState('--:--:--');

  useEffect(() => {
    const tick = () => {
      setLiveTime(
        new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: 'Asia/Kolkata',
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [status, setStatus] = useState<FormStatus>('IDLE');
  const [showToast, setShowToast] = useState(false);
  const [transmissionLogs, setTransmissionLogs] = useState<string[]>([]);
  const [emailCopied, setEmailCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('hello@example.com').then(() => {
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    });
  };

  const [submitMessage] = useMutation(SEND_CONTACT_MESSAGE);

  const validate = (name: string, value: string) => {
    const v = value || '';
    if (name === 'name') {
      if (!v.trim()) return VALIDATION.name.messages.required;
      if (v.length < VALIDATION.name.min) return VALIDATION.name.messages.min;
    }
    if (name === 'email') {
      if (!v.trim()) return VALIDATION.email.messages.required;
      if (!VALIDATION.email.pattern.test(v)) return VALIDATION.email.messages.pattern;
    }
    if (name === 'subject') {
      if (!v.trim()) return VALIDATION.subject.messages.required;
      if (v.length < VALIDATION.subject.min) return VALIDATION.subject.messages.min;
    }
    if (name === 'message') {
      if (!v.trim()) return VALIDATION.message.messages.required;
      if (v.length < VALIDATION.message.min) return VALIDATION.message.messages.min;
    }
    return undefined;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (touched[name as keyof typeof touched])
      setErrors((p) => ({ ...p, [name]: validate(name, value) }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
    setErrors((p) => ({ ...p, [name]: validate(name, value) }));
  };

  const addLog = (msg: string) => setTransmissionLogs((prev) => [...prev.slice(-5), msg]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== 'IDLE') return;

    const e1 = validate('name', formData.name);
    const e2 = validate('email', formData.email);
    const e3 = validate('subject', formData.subject);
    const e4 = validate('message', formData.message);
    setTouched({ name: true, email: true, subject: true, message: true });
    setErrors({ name: e1, email: e2, subject: e3, message: e4 });

    if (e1 || e2 || e3 || e4) {
      setStatus('ERROR');
      addLog('VALIDATION_FAILURE');
      setTimeout(() => setStatus('IDLE'), 2000);
      return;
    }

    setStatus('SYNCING');
    addLog('HANDSHAKE_INIT');
    await new Promise((r) => setTimeout(r, 600));
    setStatus('TRANSMITTING');
    addLog('PAYLOAD_TRANSMIT');

    try {
      // Save to database via GraphQL
      await submitMessage({ variables: { input: formData } });

      // Send email notification via Web3Forms (non-blocking)
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: 'cbe742ef-9d1a-4253-9dd0-ecab0600a79e',
          subject: `[Portfolio] New message from ${formData.name}`,
          from_name: 'Voyager.OS Portfolio',
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      }).catch(() => {});

      addLog('SYNC_COMPLETE');
      addLog('UPLINK_CONFIRMED');
      setStatus('SUCCESS');
      setShowToast(true);
      setTimeout(() => {
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTouched({ name: false, email: false, subject: false, message: false });
        setTransmissionLogs([]);
        setStatus('IDLE');
      }, 3000);
    } catch {
      setStatus('ERROR');
      addLog('FAILURE: SIGNAL_LOSS');
      setTimeout(() => setStatus('IDLE'), 3000);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen py-32 px-6 overflow-hidden bg-stone-50 dark:bg-space-black transition-colors"
    >
      <PageStarfield density={60} />

      <AnimatePresence>
        {showToast && (
          <Toast
            message="Payload delivered to Voyager OS. Response pending."
            onExit={() => setShowToast(false)}
          />
        )}
      </AnimatePresence>

      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full cyber-grid" />
        <MotionDiv
          animate={{ x: [0, 40, -40, 0], y: [0, -30, 30, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-vision-cyan/5 rounded-full blur-[160px]"
        />
        <MotionDiv
          animate={{ x: [0, -30, 30, 0], y: [0, 40, -40, 0] }}
          transition={{ duration: 30, repeat: Infinity }}
          className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-vision-crimson/5 rounded-full blur-[160px]"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Back Button */}
        <div className="mb-10">
          <BackButton />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column - Form */}
          <MotionDiv
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <div
              className={cn(
                'relative p-8 md:p-12 rounded-[4rem] glassmorphism border-[0.5px] transition-all duration-1000',
                Object.values(errors).some((e) => !!e)
                  ? 'border-vision-crimson/30 shadow-[0_0_60px_rgba(var(--glow-crimson),0.1)]'
                  : 'border-slate-200 dark:border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.1)]'
              )}
            >
              {/* Corner brackets */}
              <div className="absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 border-vision-crimson/10 rounded-tl-xl pointer-events-none" />
              <div className="absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 border-vision-cyan/10 rounded-tr-xl pointer-events-none" />
              <div className="absolute bottom-8 left-8 w-6 h-6 border-b-2 border-l-2 border-vision-cyan/10 rounded-bl-xl pointer-events-none" />
              <div className="absolute bottom-8 right-8 w-6 h-6 border-b-2 border-r-2 border-vision-crimson/10 rounded-br-xl pointer-events-none" />

              {/* Form header */}
              <div className="mb-10 flex items-center justify-between">
                <div className="text-[10px] font-mono font-black text-vision-cyan uppercase tracking-[0.5em] flex items-center gap-3">
                  <div className="h-[1px] w-8 bg-vision-cyan/40" />
                  Transmission_Form
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'h-2 w-2 rounded-full',
                      status === 'IDLE'
                        ? 'bg-green-500 animate-pulse'
                        : status === 'ERROR'
                          ? 'bg-vision-crimson animate-pulse'
                          : 'bg-vision-cyan animate-ping'
                    )}
                  />
                  <span className="text-[8px] font-mono font-black text-slate-400 dark:text-text-dark/30 uppercase tracking-widest">
                    {status === 'IDLE' ? 'Ready' : status === 'SUCCESS' ? 'Sent' : status}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <SystemInput
                    label="Identity"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.name}
                    placeholder="NAME / UNIT"
                    disabled={status !== 'IDLE'}
                  />
                  <SystemInput
                    label="Terminal"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.email}
                    placeholder="EMAIL_ADDRESS"
                    disabled={status !== 'IDLE'}
                  />
                </div>

                <SystemInput
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.subject}
                  placeholder="MESSAGE_SUBJECT"
                  disabled={status !== 'IDLE'}
                />

                <SystemInput
                  label="Payload"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.message}
                  placeholder="TRANSMIT MESSAGE..."
                  isTextArea
                  disabled={status !== 'IDLE'}
                />

                <div className="relative pt-4">
                  <button
                    type="submit"
                    disabled={status !== 'IDLE' && status !== 'ERROR'}
                    className={cn(
                      'group relative w-full h-24 rounded-3xl overflow-hidden transition-all duration-1000',
                      'bg-rose-50/80 dark:bg-white/[0.03] border-2 border-rose-200/60 dark:border-white/10 shadow-xl',
                      status === 'SUCCESS' &&
                        'border-vision-cyan/60 shadow-[0_0_40px_rgba(190,18,60,0.15)] dark:shadow-[0_0_40px_rgba(6,182,212,0.2)]',
                      status === 'TRANSMITTING' && 'border-transparent',
                      status === 'SYNCING' && 'border-transparent',
                      status === 'ERROR' && 'border-vision-crimson/60'
                    )}
                  >
                    {/* Liquid fill animation */}
                    <AnimatePresence>
                      {status !== 'IDLE' && status !== 'ERROR' && (
                        <motion.div
                          initial={{ y: '100%' }}
                          animate={{ y: status === 'SUCCESS' ? '0%' : '35%' }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute inset-0 z-0 bg-gradient-to-t from-vision-cyan/60 via-vision-cyan/30 to-transparent pointer-events-none"
                        />
                      )}
                    </AnimatePresence>

                    <span
                      className={cn(
                        'relative z-20 flex items-center justify-center gap-4 font-mono font-black text-[11px] uppercase tracking-[0.5em] transition-all duration-700',
                        status !== 'IDLE' && status !== 'ERROR'
                          ? 'text-white dark:text-white'
                          : 'text-rose-800/50 dark:text-text-dark/40 group-hover:text-vision-cyan'
                      )}
                    >
                      <AnimatePresence mode="wait">
                        {status === 'IDLE' && (
                          <MotionDiv key="idle" className="flex items-center gap-4">
                            Initiate_Uplink
                            <Icons.Send className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />
                          </MotionDiv>
                        )}
                        {status === 'SYNCING' && <MotionDiv key="sync">Syncing_Nodes...</MotionDiv>}
                        {status === 'TRANSMITTING' && (
                          <MotionDiv key="trans">Transmitting_Data...</MotionDiv>
                        )}
                        {status === 'SUCCESS' && (
                          <MotionDiv key="success" className="flex items-center gap-4">
                            <Icons.Check size={16} /> Transmission_Complete
                          </MotionDiv>
                        )}
                        {status === 'ERROR' && (
                          <MotionDiv key="err" className="text-vision-crimson">
                            Signal_Failure
                          </MotionDiv>
                        )}
                      </AnimatePresence>
                    </span>
                  </button>
                </div>
              </form>

              <div className="mt-10 flex justify-between text-[8px] font-mono font-black text-slate-400 dark:text-text-dark/30 uppercase tracking-[0.5em] border-t border-slate-100 dark:border-white/5 pt-6">
                <div className="flex gap-8">
                  <span>Packet: Secure</span>
                  <span>Encryption: 256bit</span>
                </div>
                <div className="hidden md:block italic">Contact_Protocol_V2</div>
              </div>
            </div>
          </MotionDiv>

          {/* Right Column - Info + Socials */}
          <MotionDiv
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-8"
          >
            {/* Transmission Log */}
            <div className="p-8 rounded-[3rem] glassmorphism border-[0.5px] border-slate-200 dark:border-white/5 min-h-[180px] flex flex-col shadow-2xl relative overflow-hidden bg-slate-100/30 dark:bg-white/[0.01]">
              {/* Terminal header bar */}
              <div className="flex items-center justify-between mb-4 border-b border-slate-200/60 dark:border-white/[0.06] pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-vision-crimson/40" />
                    <div className="h-2.5 w-2.5 rounded-full bg-vision-orange/40" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500/40" />
                  </div>
                  <div className="text-[9px] font-mono font-black text-slate-500 dark:text-text-dark/30 uppercase tracking-[0.5em] ml-2">
                    Rolling_Log
                  </div>
                </div>
                <div className="text-[8px] font-mono text-slate-400 dark:text-text-dark/20 tracking-wider">
                  {liveTime} IST
                </div>
              </div>

              <div className="flex-1 space-y-2.5">
                <AnimatePresence mode="popLayout">
                  {transmissionLogs.length === 0 ? (
                    <div className="text-[10px] font-mono text-slate-400 dark:text-text-dark/20 italic flex items-center gap-2">
                      <span className="w-1 h-3.5 bg-vision-cyan/60 animate-pulse inline-block rounded-sm" />
                      Awaiting transmission...
                    </div>
                  ) : (
                    transmissionLogs.map((log, i) => (
                      <MotionDiv
                        key={log + i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="font-mono text-[10px] font-bold text-vision-cyan/80 flex items-center gap-4"
                      >
                        <span className="text-vision-cyan/40">
                          [{new Date().toLocaleTimeString([], { hour12: false })}]
                        </span>
                        <span className="tracking-tight uppercase">{log}</span>
                      </MotionDiv>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Status Card */}
            <div className="p-8 rounded-[3rem] glassmorphism border-[0.5px] border-slate-200 dark:border-white/5 shadow-xl bg-slate-50/30 dark:bg-white/[0.01] relative overflow-hidden">
              {/* Available banner */}
              <div className="flex items-center justify-between mb-6">
                <div className="text-[10px] font-mono font-black text-vision-crimson uppercase tracking-[0.5em] flex items-center gap-3">
                  <Icons.Activity className="animate-pulse" /> Station_Status
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_6px_rgba(34,197,94,0.7)]" />
                  <span className="text-[8px] font-mono font-black text-green-500 tracking-widest uppercase">
                    Available
                  </span>
                </div>
              </div>

              {/* Live clock */}
              <div className="mb-6 p-4 rounded-2xl bg-slate-100/60 dark:bg-black/20 border border-slate-200/60 dark:border-white/[0.04]">
                <div className="text-[8px] font-mono text-slate-400 dark:text-text-dark/30 uppercase tracking-widest mb-1">
                  Local_Time // IST (UTC+5:30)
                </div>
                <div className="text-2xl font-mono font-black text-slate-900 dark:text-text-dark tabular-nums tracking-wider">
                  {liveTime}
                </div>
              </div>

              {/* Download CV */}
              <a
                href="/cv.pdf"
                download
                className="group flex items-center justify-between gap-3 w-full mb-6 px-5 py-3.5 rounded-2xl border border-vision-cyan/20 bg-vision-cyan/5 hover:bg-vision-cyan/10 hover:border-vision-cyan/50 transition-all duration-300 shadow-[0_0_0_rgba(var(--glow-cyan),0)] hover:shadow-[0_0_20px_rgba(var(--glow-cyan),0.12)]"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-vision-cyan/10 border border-vision-cyan/20 group-hover:border-vision-cyan/50 flex items-center justify-center transition-all">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-vision-cyan"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[9px] font-mono font-black text-slate-400 dark:text-text-dark/30 uppercase tracking-[0.4em]">
                      Resume
                    </div>
                    <div className="text-[11px] font-mono font-black text-vision-cyan">
                      Download_CV.pdf
                    </div>
                  </div>
                </div>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-vision-cyan/40 group-hover:text-vision-cyan group-hover:translate-y-0.5 transition-all"
                >
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </a>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 p-3 rounded-2xl bg-slate-100/40 dark:bg-white/[0.02]">
                  <div className="text-[9px] font-mono text-slate-400 dark:text-text-dark/30 uppercase tracking-widest font-black italic">
                    Response
                  </div>
                  <div className="text-lg font-display font-black text-slate-900 dark:text-text-dark">
                    &lt;24h
                  </div>
                </div>
                <div className="space-y-1.5 p-3 rounded-2xl bg-slate-100/40 dark:bg-white/[0.02]">
                  <div className="text-[9px] font-mono text-slate-400 dark:text-text-dark/30 uppercase tracking-widest font-black italic">
                    Timezone
                  </div>
                  <div className="text-lg font-display font-black text-vision-cyan">IST</div>
                </div>
                <div className="space-y-1.5 p-3 rounded-2xl bg-slate-100/40 dark:bg-white/[0.02]">
                  <div className="text-[9px] font-mono text-slate-400 dark:text-text-dark/30 uppercase tracking-widest font-black italic">
                    Location
                  </div>
                  <div className="text-lg font-display font-black text-vision-cyan">India</div>
                </div>
                <div className="space-y-1.5 p-3 rounded-2xl bg-slate-100/40 dark:bg-white/[0.02]">
                  <div className="text-[9px] font-mono text-slate-400 dark:text-text-dark/30 uppercase tracking-widest font-black italic">
                    Open To
                  </div>
                  <div className="text-lg font-display font-black text-vision-orange">Work</div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <div className="text-[10px] font-mono font-black text-vision-cyan uppercase tracking-[0.5em] px-4 flex items-center gap-3">
                <div className="h-[1px] w-6 bg-vision-cyan/40" />
                Comm_Channels
              </div>
              <SocialLink
                icon={Icons.Github}
                label="GitHub"
                href="https://github.com"
                description="View source & contributions"
              />
              <SocialLink
                icon={Icons.Linkedin}
                label="LinkedIn"
                href="https://linkedin.com"
                description="Professional profile"
              />
              <SocialLink
                icon={Icons.Twitter}
                label="X / Twitter"
                href="https://x.com"
                description="Follow the signal"
              />
              {/* Direct Mail with copy button */}
              <div className="group relative flex items-center gap-5 p-6 rounded-[2rem] glassmorphism border-[0.5px] border-slate-200 dark:border-white/5 hover:border-vision-cyan/40 transition-all duration-500 bg-slate-50/30 dark:bg-white/[0.02] hover:bg-vision-cyan/5 shadow-lg hover:shadow-[0_0_30px_rgba(var(--glow-cyan),0.1)]">
                <a
                  href="mailto:hello@example.com"
                  className="flex items-center gap-5 flex-1 min-w-0"
                >
                  <div className="h-12 w-12 shrink-0 rounded-2xl bg-vision-cyan/10 flex items-center justify-center text-vision-cyan/60 group-hover:text-vision-cyan border border-vision-cyan/10 group-hover:border-vision-cyan/30 transition-all group-hover:scale-110">
                    <Icons.Mail />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-mono font-black text-slate-400 dark:text-text-dark/30 uppercase tracking-[0.4em] group-hover:text-vision-cyan transition-colors">
                      Direct_Mail
                    </div>
                    <div className="text-sm font-bold text-slate-700 dark:text-text-dark/60 mt-1 group-hover:text-slate-900 dark:group-hover:text-text-dark transition-colors truncate">
                      hello@example.com
                    </div>
                  </div>
                </a>
                <button
                  onClick={handleCopyEmail}
                  aria-label="Copy email"
                  className="shrink-0 h-9 w-9 rounded-2xl border border-slate-200 dark:border-white/5 group-hover:border-vision-cyan/30 flex items-center justify-center text-slate-400 hover:text-vision-cyan transition-all relative overflow-hidden"
                >
                  <AnimatePresence mode="wait">
                    {emailCopied ? (
                      <MotionDiv
                        key="check"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-emerald-400"
                      >
                        <Icons.Check size={13} />
                      </MotionDiv>
                    ) : (
                      <MotionDiv
                        key="copy"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                        </svg>
                      </MotionDiv>
                    )}
                  </AnimatePresence>
                  {emailCopied && (
                    <MotionDiv
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: -28 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="absolute -top-1 left-1/2 -translate-x-1/2 text-[8px] font-mono font-black text-emerald-400 whitespace-nowrap pointer-events-none"
                    >
                      Copied!
                    </MotionDiv>
                  )}
                </button>
              </div>
            </div>
          </MotionDiv>
        </div>
      </div>
    </div>
  );
}

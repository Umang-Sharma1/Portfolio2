'use client';

import React, { useState, useRef, memo, useEffect } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue, useInView } from 'framer-motion';
import Link from 'next/link';
import { useMutation } from '@apollo/client';
import { SEND_CONTACT_MESSAGE } from '@/lib/graphql/mutations';

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

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

type FormStatus = 'IDLE' | 'TRANSMITTING' | 'SYNCING' | 'SUCCESS' | 'ERROR';

const VALIDATION = {
  name: { min: 2, messages: { required: 'Origin_ID missing', min: 'ID_too_short' } },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    messages: { required: 'Signal_coord missing', pattern: 'Invalid_coord_format' },
  },
  message: { min: 10, messages: { required: 'Payload missing', min: 'Payload_too_small' } },
};

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
  Bell: memo(() => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )),
  ArrowRight: memo(() => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )),
};

const BURST_PARTICLES = 16;

const Toast = memo(({ message, onExit }: { message: string; onExit: () => void }) => {
  const [phase, setPhase] = useState(0); // 0=burst+decrypt, 1=confirm, 2=details
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

  // Phase sequencing
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800);
    const t2 = setTimeout(() => setPhase(2), 2000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Typing effect for confirm text
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

      <div className="relative rounded-2xl border border-vision-cyan/30 bg-white/95 dark:bg-slate-950/95 backdrop-blur-[60px] shadow-[0_0_80px_rgba(var(--glow-cyan),0.25),0_20px_60px_rgba(0,0,0,0.12)] dark:shadow-[0_0_80px_rgba(var(--glow-cyan),0.25),0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Scanline overlay */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-30">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(var(--glow-cyan),0.03)_2px,rgba(var(--glow-cyan),0.03)_4px)]" />
          <MotionDiv
            animate={{ y: ['0%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute left-0 right-0 h-8 bg-gradient-to-b from-transparent via-vision-cyan/5 to-transparent"
          />
        </div>

        {/* Header bar */}
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
            <span className="text-[8px] font-mono font-black text-vision-cyan/70 dark:text-vision-cyan/60 uppercase tracking-[0.4em]">
              Signal_Lock
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MotionDiv
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]"
            />
            <span className="text-[8px] font-mono font-black text-emerald-600 dark:text-emerald-400/80 uppercase tracking-widest">
              Secure
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="relative z-10 p-5 space-y-4">
          {/* Decrypting phase */}
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
                  className="h-5 w-5 border-2 border-vision-cyan/50 border-t-vision-cyan rounded-full"
                />
                <span className="text-[10px] font-mono font-black text-vision-cyan/80 uppercase tracking-[0.3em]">
                  Decrypting_Payload...
                </span>
              </MotionDiv>
            )}
          </AnimatePresence>

          {/* Confirmed phase */}
          {phase >= 1 && (
            <MotionDiv
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-3">
                <MotionDiv
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  className="h-9 w-9 rounded-xl bg-vision-cyan/10 border border-vision-cyan/30 flex items-center justify-center shadow-[0_0_20px_rgba(var(--glow-cyan),0.3)]"
                >
                  <Icons.Check size={18} />
                </MotionDiv>
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

              {/* Message */}
              {phase >= 2 && (
                <MotionDiv
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.4 }}
                  className="space-y-3"
                >
                  <div className="px-4 py-3 rounded-lg bg-vision-cyan/5 border border-vision-cyan/10">
                    <p className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300 leading-relaxed">
                      {message}
                    </p>
                  </div>

                  {/* Telemetry footer */}
                  <div className="flex items-center justify-between text-[7px] font-mono font-black uppercase tracking-[0.3em]">
                    <span className="text-slate-400 dark:text-slate-500">Latency: 42ms</span>
                    <span className="text-slate-400 dark:text-slate-500">Protocol: TLS_1.3</span>
                    <span className="text-emerald-600 dark:text-emerald-400/60">Integrity: OK</span>
                  </div>
                </MotionDiv>
              )}
            </MotionDiv>
          )}
        </div>

        {/* Progress bar */}
        <div className="relative h-[2px] bg-white/5">
          <MotionDiv
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 7, ease: 'linear' }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-vision-cyan via-vision-cyan to-vision-cyan/50 shadow-[0_0_10px_rgba(var(--glow-cyan),1)]"
          />
        </div>
      </div>
    </MotionDiv>
  );
});

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
        {/* Corner brackets */}
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
            rows={5}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur(e);
            }}
            onFocus={() => setIsFocused(true)}
            className="w-full bg-transparent px-8 py-6 outline-none text-slate-900 dark:text-text-dark font-mono font-bold text-sm resize-none placeholder:text-slate-400 dark:placeholder:text-white/20 transition-colors"
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
            className="w-full bg-transparent px-8 py-6 outline-none text-slate-900 dark:text-text-dark font-mono font-bold text-sm placeholder:text-slate-400 dark:placeholder:text-white/20 transition-colors"
          />
        )}
      </div>
    </div>
  );
};

export const ContactSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-10%' });
  const headingInView = useInView(headingRef, { once: true, margin: '-20%' });
  const morphedText = useTextMorph('Establish Contact.', 'CONTACT', headingInView, 1400);
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', message: '' });
  const [touched, setTouched] = useState({ name: false, email: false, message: false });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>('IDLE');
  const [showToast, setShowToast] = useState(false);
  const [transmissionLogs, setTransmissionLogs] = useState<string[]>([]);
  const [submitMessage] = useMutation(SEND_CONTACT_MESSAGE);
  const [clickOrigin, setClickOrigin] = useState({ x: 50, y: 50 });
  const [isFilling, setIsFilling] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 50, stiffness: 500 });
  const springY = useSpring(mouseY, { damping: 50, stiffness: 500 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x * 0.1);
    mouseY.set(y * 0.1);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (status !== 'IDLE') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setClickOrigin({ x, y });
    setIsFilling(true);
  };

  const validate = (name: string, value: string) => {
    const safeValue = value || '';
    if (name === 'name') {
      if (!safeValue.trim()) return VALIDATION.name.messages.required;
      if (safeValue.length < VALIDATION.name.min) return VALIDATION.name.messages.min;
    }
    if (name === 'email') {
      if (!safeValue.trim()) return VALIDATION.email.messages.required;
      if (!VALIDATION.email.pattern.test(safeValue)) return VALIDATION.email.messages.pattern;
    }
    if (name === 'message') {
      if (!safeValue.trim()) return VALIDATION.message.messages.required;
      if (safeValue.length < VALIDATION.message.min) return VALIDATION.message.messages.min;
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

  const addLog = (msg: string) => setTransmissionLogs((prev) => [...prev.slice(-4), msg]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== 'IDLE') return;

    const e1 = validate('name', formData.name);
    const e2 = validate('email', formData.email);
    const e3 = validate('message', formData.message);
    setTouched({ name: true, email: true, message: true });
    setErrors({ name: e1, email: e2, message: e3 });

    if (e1 || e2 || e3) {
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
      await submitMessage({
        variables: {
          input: {
            name: formData.name,
            email: formData.email,
            message: formData.message,
          },
        },
      });

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
      setStatus('IDLE');
      setShowToast(true);
      setFormData({ name: '', email: '', message: '' });
      setTouched({ name: false, email: false, message: false });
      setTransmissionLogs([]);
    } catch (err) {
      setStatus('ERROR');
      addLog('FAILURE: SIGNAL_LOSS');
      setTimeout(() => setStatus('IDLE'), 3000);
    }
  };

  return (
    <section
      ref={containerRef}
      id="contact"
      className="relative w-full py-28 px-6 flex items-center justify-center overflow-hidden bg-stone-50 dark:bg-space-black transition-colors duration-1000"
    >
      <AnimatePresence>
        {showToast && (
          <Toast
            message="Payload delivered to Voyager OS. Response pending."
            onExit={() => setShowToast(false)}
          />
        )}
      </AnimatePresence>

      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full cyber-grid" />
        <MotionDiv
          animate={{ x: [0, 40, -40, 0], y: [0, -30, 30, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-vision-cyan/5 rounded-full blur-[160px]"
        />
      </div>

      <div className="max-w-7xl w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start lg:items-center">
          <div className="lg:col-span-5 space-y-12">
            <MotionDiv
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              className="inline-flex items-center gap-4 px-6 py-2 rounded-full glassmorphism border border-vision-cyan/20 text-vision-cyan bg-vision-cyan/5"
            >
              <Icons.Activity className="animate-pulse" />
              <span className="text-[10px] font-mono font-black tracking-[0.5em] uppercase">
                Status: Uplink_Ready
              </span>
            </MotionDiv>

            <div className="space-y-6">
              <div ref={headingRef} className="relative overflow-visible py-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={headingInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <div className="w-48 h-24 bg-vision-cyan/[0.06] dark:bg-vision-cyan/[0.04] blur-[60px] rounded-full" />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  animate={headingInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="relative text-5xl md:text-6xl lg:text-7xl font-display font-black leading-[0.9] tracking-tighter uppercase italic"
                >
                  <span className="relative inline-block pr-3">
                    <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-br from-rose-800 via-rose-600 to-rose-800 dark:from-vision-cyan dark:via-white/90 dark:to-vision-cyan">
                      {morphedText || '\u00A0'}
                    </span>
                    <span
                      aria-hidden
                      className="absolute inset-0 text-vision-crimson/30 dark:text-vision-crimson/20 animate-[glitch1_3s_infinite] pointer-events-none select-none mix-blend-darken dark:mix-blend-screen"
                    >
                      {morphedText || '\u00A0'}
                    </span>
                    <span
                      aria-hidden
                      className="absolute inset-0 text-vision-cyan/30 dark:text-vision-cyan/20 animate-[glitch2_3s_infinite] pointer-events-none select-none mix-blend-darken dark:mix-blend-screen"
                    >
                      {morphedText || '\u00A0'}
                    </span>
                  </span>
                </motion.h2>
              </div>
              <p className="text-slate-600 dark:text-text-dark/50 text-lg lg:text-xl font-bold leading-relaxed max-w-sm italic">
                Synchronizing intentions into digital architecture. Secure terminal for
                collaboration.
              </p>
            </div>

            <div className="p-8 rounded-[3rem] glassmorphism border-[0.5px] border-slate-200 dark:border-white/5 space-y-3 min-h-[160px] flex flex-col justify-end shadow-2xl relative overflow-hidden bg-slate-100/30 dark:bg-white/[0.01]">
              <div className="text-[9px] font-mono font-black text-slate-500 dark:text-text-dark/30 uppercase tracking-[0.5em] mb-4 border-b border-current/10 pb-2">
                Rolling_Log
              </div>
              <AnimatePresence mode="popLayout">
                {transmissionLogs.map((log, i) => (
                  <MotionDiv
                    key={log + i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="font-mono text-[10px] font-bold text-vision-cyan/80 flex items-center gap-4"
                  >
                    <span className="text-vision-cyan/40">
                      [{new Date().toLocaleTimeString([], { hour12: false, second: '2-digit' })}]
                    </span>
                    <span className="tracking-tight uppercase">{log}</span>
                  </MotionDiv>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <MotionDiv
            style={{ x: springX, y: springY }}
            onMouseMove={handleMouseMove}
            className="lg:col-span-7 w-full will-change-transform"
          >
            <MotionDiv
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                'relative p-8 md:p-14 rounded-[4rem] glassmorphism border-[0.5px] transition-all duration-1000',
                Object.values(errors).some((e) => !!e)
                  ? 'border-vision-crimson/30 shadow-[0_0_60px_rgba(var(--glow-crimson),0.1)]'
                  : 'border-slate-200 dark:border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.1)]'
              )}
            >
              {/* Card corner brackets */}
              <div className="absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 border-vision-crimson/10 rounded-tl-xl group-hover:border-vision-crimson/40 transition-colors pointer-events-none" />
              <div className="absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 border-vision-cyan/10 rounded-tr-xl group-hover:border-vision-cyan/40 transition-colors pointer-events-none" />
              <div className="absolute bottom-8 left-8 w-6 h-6 border-b-2 border-l-2 border-vision-cyan/10 rounded-bl-xl group-hover:border-vision-cyan/40 transition-colors pointer-events-none" />
              <div className="absolute bottom-8 right-8 w-6 h-6 border-b-2 border-r-2 border-vision-crimson/10 rounded-br-xl group-hover:border-vision-crimson/40 transition-colors pointer-events-none" />
              <form onSubmit={handleSubmit} className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
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
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.email}
                    placeholder="EMAIL_ADDRESS"
                    disabled={status !== 'IDLE'}
                  />
                </div>

                <SystemInput
                  label="Payload"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.message}
                  placeholder="TRANSMIT MESSAGE..."
                  isTextArea={true}
                  disabled={status !== 'IDLE'}
                />

                <div className="relative pt-6">
                  <button
                    type="submit"
                    disabled={status !== 'IDLE'}
                    className={cn(
                      'group relative w-full h-24 rounded-3xl overflow-hidden transition-all duration-1000',
                      'bg-rose-50/80 dark:bg-white/[0.03] border-2 border-rose-200/60 dark:border-white/10 shadow-xl',
                      status === 'SUCCESS' &&
                        'border-vision-cyan/60 shadow-[0_0_40px_rgba(190,18,60,0.15)] dark:shadow-[0_0_40px_rgba(6,182,212,0.2)]',
                      status === 'TRANSMITTING' && 'border-transparent',
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
                        status !== 'IDLE'
                          ? 'text-white dark:text-white'
                          : 'text-rose-800/50 dark:text-text-dark/40 group-hover:text-vision-cyan'
                      )}
                    >
                      <AnimatePresence mode="wait">
                        {status === 'IDLE' && (
                          <MotionDiv key="idle" className="flex items-center gap-4">
                            Initiate_Uplink
                            <Icons.Send className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          </MotionDiv>
                        )}
                        {status === 'SYNCING' && <MotionDiv key="sync">Syncing...</MotionDiv>}
                        {status === 'TRANSMITTING' && (
                          <MotionDiv key="trans">Transmitting...</MotionDiv>
                        )}
                        {status === 'SUCCESS' && (
                          <MotionDiv key="success" className="flex items-center gap-4">
                            Link_Secure <Icons.Check />
                          </MotionDiv>
                        )}
                        {status === 'ERROR' && (
                          <MotionDiv key="err" className="text-vision-crimson">
                            Signal_Loss
                          </MotionDiv>
                        )}
                      </AnimatePresence>
                    </span>
                  </button>
                </div>
              </form>

              <div className="mt-12 flex justify-between text-[8px] font-mono font-black text-slate-400 dark:text-text-dark/30 uppercase tracking-[0.5em] border-t border-slate-100 dark:border-white/5 pt-6">
                <div className="flex gap-10">
                  <span>Packet: Secure</span>
                  <span>Encryption: 256bit</span>
                </div>
                <div className="hidden md:block italic">Sector_Contact_Protocol</div>
              </div>
            </MotionDiv>

            {/* More Ways to Connect */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-10 space-y-5"
            >
              <div className="flex items-center justify-center gap-4 text-[9px] font-mono font-black text-slate-400 dark:text-text-dark/30 uppercase tracking-[0.4em]">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-current opacity-30" />
                Comm_Channels
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-current opacity-30" />
              </div>

              <div className="flex items-center justify-center gap-3">
                {[
                  {
                    label: 'GitHub',
                    href: 'https://github.com',
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    ),
                  },
                  {
                    label: 'LinkedIn',
                    href: 'https://linkedin.com',
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    ),
                  },
                  {
                    label: 'Email',
                    href: 'mailto:hello@example.com',
                    icon: (
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
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    ),
                  },
                ].map((social, i) => (
                  <MotionDiv
                    key={social.label}
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                  >
                    <a
                      href={social.href}
                      target={social.href.startsWith('mailto') ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="group/social relative flex items-center justify-center h-11 w-11 border border-slate-200 dark:border-white/10 hover:border-vision-cyan/50 text-slate-500 dark:text-text-dark/30 hover:text-vision-cyan transition-all duration-500 overflow-hidden hover:shadow-[0_0_20px_rgba(var(--glow-cyan),0.15)]"
                    >
                      {/* Hover fill sweep */}
                      <span className="absolute inset-0 bg-vision-cyan/5 scale-x-0 group-hover/social:scale-x-100 origin-left transition-transform duration-500" />
                      {/* Corner brackets */}
                      <span className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-current opacity-0 group-hover/social:opacity-60 transition-opacity" />
                      <span className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-current opacity-0 group-hover/social:opacity-60 transition-opacity" />
                      <span className="relative z-10">{social.icon}</span>
                    </a>
                  </MotionDiv>
                ))}

                {/* Separator */}
                <div className="h-6 w-px bg-slate-200 dark:bg-white/10 mx-1" />

                {/* Full contact page link */}
                <MotionDiv
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <Link
                    href="/contact"
                    className="group/link flex items-center gap-3 px-5 py-2.5 border border-slate-200 dark:border-white/10 hover:border-vision-cyan/40 text-[9px] font-mono font-black text-slate-500 dark:text-text-dark/30 hover:text-vision-cyan uppercase tracking-[0.3em] transition-all duration-500 hover:shadow-[0_0_20px_rgba(var(--glow-cyan),0.1)] hover:bg-vision-cyan/5"
                  >
                    <span className="relative">
                      Full Terminal
                      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-vision-cyan group-hover/link:w-full transition-all duration-500" />
                    </span>
                    <Icons.ArrowRight />
                  </Link>
                </MotionDiv>
              </div>
            </MotionDiv>
          </MotionDiv>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

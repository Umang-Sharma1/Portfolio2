'use client';

import React, { useState, useRef, memo, useEffect } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue, useInView } from 'framer-motion';
import Link from 'next/link';

const MotionDiv = motion.div as any;
const MotionSpan = motion.span as any;

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
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
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
    </svg>
  )),
  Check: memo(({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )),
  Alert: memo(() => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )),
  Activity: memo(({ className }: { className?: string }) => (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )),
  Bell: memo(() => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
    </svg>
  )),
  ArrowRight: memo(() => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )),
};

const Toast = memo(({ message, onExit }: { message: string; onExit: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onExit, 5000);
    return () => clearTimeout(timer);
  }, [onExit]);

  return (
    <MotionDiv
      initial={{ opacity: 0, y: -20, x: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, x: 20 }}
      className="fixed top-24 right-8 z-[2000] w-80 glassmorphism p-6 rounded-[2rem] border-2 border-vision-cyan/30 shadow-[0_20px_50px_rgba(0,0,0,0.2)] bg-white/90 dark:bg-space-black/80 backdrop-blur-[50px] overflow-hidden"
    >
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-2xl bg-vision-cyan/10 flex items-center justify-center text-vision-cyan border border-vision-cyan/20">
          <Icons.Bell />
        </div>
        <div className="flex-1 space-y-1">
          <h4 className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">Uplink_Confirmed</h4>
          <p className="text-sm font-bold text-slate-900 dark:text-text-dark leading-tight">{message}</p>
        </div>
      </div>
      <MotionDiv
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: 5, ease: 'linear' }}
        className="absolute bottom-0 left-0 h-1 bg-vision-cyan shadow-[0_0_10px_#22D3EE]"
      />
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
                : 'text-slate-500 dark:text-white/20'
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
            ? 'bg-slate-100/50 dark:bg-white/[0.08] border-vision-cyan/50 backdrop-blur-[40px] shadow-[inset_0_0_25px_rgba(34,211,238,0.1),0_25px_50px_rgba(0,0,0,0.08)] scale-[1.01]'
            : error
              ? 'bg-vision-crimson/[0.04] border-vision-crimson/30'
              : 'bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/10'
        )}
      >
        {/* Corner brackets */}
        <div className={cn(
          'absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 rounded-tl-lg transition-colors duration-500 pointer-events-none z-10',
          isFocused ? 'border-vision-crimson/40' : 'border-vision-crimson/10'
        )} />
        <div className={cn(
          'absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 rounded-br-lg transition-colors duration-500 pointer-events-none z-10',
          isFocused ? 'border-vision-cyan/40' : 'border-vision-cyan/10'
        )} />
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
            className="w-full bg-transparent px-8 py-6 outline-none text-slate-900 dark:text-text-dark font-mono font-bold text-sm resize-none placeholder:text-slate-300 dark:placeholder:text-white/10 transition-colors"
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
            className="w-full bg-transparent px-8 py-6 outline-none text-slate-900 dark:text-text-dark font-mono font-bold text-sm placeholder:text-slate-300 dark:placeholder:text-white/10 transition-colors"
          />
        )}
      </div>
    </div>
  );
};

export const ContactSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-10%' });
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', message: '' });
  const [touched, setTouched] = useState({ name: false, email: false, message: false });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>('IDLE');
  const [showToast, setShowToast] = useState(false);
  const [transmissionLogs, setTransmissionLogs] = useState<string[]>([]);
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
      await new Promise((r) => setTimeout(r, 1200));
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
        {showToast && <Toast message="Payload delivered to Voyager OS. Response pending." onExit={() => setShowToast(false)} />}
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
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-black leading-[0.9] tracking-tighter uppercase italic text-slate-900 dark:text-text-dark">
                Establish <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-vision-orange via-vision-cyan to-vision-orange drop-shadow-2xl">
                  Contact.
                </span>
              </h2>
              <p className="text-slate-600 dark:text-text-dark/40 text-lg lg:text-xl font-bold leading-relaxed max-w-sm italic">
                Synchronizing intentions into digital architecture. Secure terminal for
                collaboration.
              </p>
            </div>

            <div className="p-8 rounded-[3rem] glassmorphism border-[0.5px] border-slate-200 dark:border-white/5 space-y-3 min-h-[160px] flex flex-col justify-end shadow-2xl relative overflow-hidden bg-slate-100/30 dark:bg-white/[0.01]">
              <div className="text-[9px] font-mono font-black text-slate-500 dark:text-white/20 uppercase tracking-[0.5em] mb-4 border-b border-current/10 pb-2">
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
                  ? 'border-vision-crimson/30 shadow-[0_0_60px_rgba(225,29,72,0.1)]'
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
                    onMouseDown={handleMouseDown}
                    className={cn(
                      'group relative w-full h-24 rounded-[2rem] overflow-hidden transition-all duration-700 font-mono font-black text-[12px] uppercase tracking-[0.6em] z-10 border-2',
                      status === 'IDLE'
                        ? 'bg-transparent border-vision-cyan/30 text-vision-cyan hover:border-vision-cyan/60'
                        : status === 'ERROR'
                          ? 'bg-vision-crimson border-vision-crimson text-white'
                          : 'bg-vision-cyan border-vision-cyan text-space-black',
                      'shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:scale-[1.02] active:scale-[0.98]'
                    )}
                  >
                    {/* Origin Fill Effect */}
                    <AnimatePresence>
                      {isFilling && (
                        <MotionDiv
                          initial={{ scale: 0, opacity: 0.5 }}
                          animate={{ scale: 4, opacity: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.8, ease: 'circOut' }}
                          onAnimationComplete={() => setIsFilling(false)}
                          style={{
                            position: 'absolute',
                            left: `${clickOrigin.x}%`,
                            top: `${clickOrigin.y}%`,
                            width: '100%',
                            paddingBottom: '100%',
                            transform: 'translate(-50%, -50%)',
                            borderRadius: '100%',
                            backgroundColor: 'currentColor',
                            zIndex: 0,
                            pointerEvents: 'none',
                          }}
                        />
                      )}
                    </AnimatePresence>

                    <span className="relative z-10 flex items-center justify-center gap-6">
                      <AnimatePresence mode="wait">
                        {status === 'IDLE' && (
                          <MotionDiv key="idle" className="flex items-center gap-4">
                            Initiate_Uplink
                            <Icons.Send className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />
                          </MotionDiv>
                        )}
                        {status === 'SYNCING' && <MotionDiv key="sync">Syncing_Nodes...</MotionDiv>}
                        {status === 'TRANSMITTING' && <MotionDiv key="trans">Transmitting_Data...</MotionDiv>}
                        {status === 'ERROR' && <MotionDiv key="err">Signal_Failure</MotionDiv>}
                      </AnimatePresence>
                    </span>

                    {/* Marching Ants Border for Submitting State */}
                    {(status === 'SYNCING' || status === 'TRANSMITTING') && (
                      <div className="absolute inset-0 pointer-events-none">
                        <svg className="w-full h-full">
                          <rect
                            width="100%"
                            height="100%"
                            fill="none"
                            rx="32"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray="8 8"
                            className="animate-[marching-ants_1s_linear_infinite]"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-12 flex justify-between text-[8px] font-mono font-black text-slate-300 dark:text-white/10 uppercase tracking-[0.5em] border-t border-slate-100 dark:border-white/5 pt-6">
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
              className="mt-8 flex justify-center"
            >
              <Link
                href="/contact"
                className="group flex items-center gap-4 px-10 py-4 glassmorphism border border-vision-cyan/20 rounded-2xl text-[11px] font-mono font-black text-vision-cyan/60 uppercase tracking-[0.5em] hover:text-vision-cyan hover:border-vision-cyan/40 hover:bg-vision-cyan/5 transition-all duration-500 shadow-lg"
              >
                More Ways to Connect
                <div className="h-[2px] w-8 bg-current group-hover:w-14 transition-all duration-500 opacity-40 group-hover:opacity-100" />
                <Icons.ArrowRight />
              </Link>
            </MotionDiv>
          </MotionDiv>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

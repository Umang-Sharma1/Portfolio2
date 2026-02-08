'use client';

import React, { useState, useRef, memo, useEffect } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue, useInView } from 'framer-motion';

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
  Check: memo(() => (
    <svg
      width="20"
      height="20"
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
};

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
      <div className="flex items-center justify-between px-3">
        <label
          className={cn(
            'text-[9px] font-mono font-black uppercase tracking-[0.5em] transition-colors duration-500',
            isFocused
              ? 'text-vision-cyan text-glow-cyan'
              : error
                ? 'text-vision-crimson text-glow-crimson'
                : 'text-text-light/50 dark:text-text-dark/40'
          )}
        >
          {isFocused ? '>> ' : '// '}
          {label}
        </label>

        <AnimatePresence>
          {error && (
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="text-[9px] font-mono font-black text-vision-crimson uppercase tracking-tighter flex items-center gap-2"
            >
              <Icons.Alert /> {error}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div
        className={cn(
          'relative transition-all duration-700 rounded-2xl overflow-hidden glassmorphism border-2',
          isFocused
            ? 'bg-white/[0.1] dark:bg-white/[0.06] border-vision-cyan/50 shadow-[0_0_40px_rgba(34,211,238,0.15)]'
            : error
              ? 'bg-vision-crimson/[0.06] border-vision-crimson/40'
              : 'bg-white/[0.04] dark:bg-white/[0.02] border-text-light/10 dark:border-white/10'
        )}
      >
        <div
          className={cn(
            'absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-current transition-opacity duration-500',
            isFocused ? 'opacity-60 text-vision-cyan' : 'opacity-0'
          )}
        />
        <div
          className={cn(
            'absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-current transition-opacity duration-500',
            isFocused ? 'opacity-60 text-vision-cyan' : 'opacity-0'
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
            className="w-full bg-transparent px-6 py-4 outline-none text-text-light dark:text-text-dark font-mono font-bold text-sm resize-none placeholder:text-text-light/20 dark:placeholder:text-text-dark/20 transition-colors"
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
            className="w-full bg-transparent px-6 py-4 outline-none text-text-light dark:text-text-dark font-mono font-bold text-sm placeholder:text-text-light/20 dark:placeholder:text-text-dark/20 transition-colors"
          />
        )}

        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 h-[3px] transition-transform duration-700 origin-left',
            isFocused
              ? 'scale-x-100 bg-vision-cyan shadow-[0_0_15px_rgba(6,182,212,0.8)]'
              : error
                ? 'scale-x-100 bg-vision-crimson shadow-[0_0_15px_rgba(190,18,60,0.8)]'
                : 'scale-x-0'
          )}
        />
      </div>
    </div>
  );
};

export function ContactForm({ className }: { className?: string }) {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-10%' });
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', message: '' });
  const [touched, setTouched] = useState({ name: false, email: false, message: false });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>('IDLE');
  const [toast, setToast] = useState({
    message: '',
    type: 'success' as 'success' | 'error',
    isVisible: false,
  });
  const [transmissionLogs, setTransmissionLogs] = useState<string[]>([]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 50, stiffness: 500 });
  const springY = useSpring(mouseY, { damping: 50, stiffness: 500 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x * 0.015);
    mouseY.set(y * 0.015);
  };

  const validate = (name: string, value: string) => {
    if (name === 'name') {
      if (!value.trim()) return VALIDATION.name.messages.required;
      if (value.length < VALIDATION.name.min) return VALIDATION.name.messages.min;
    }
    if (name === 'email') {
      if (!value.trim()) return VALIDATION.email.messages.required;
      if (!VALIDATION.email.pattern.test(value)) return VALIDATION.email.messages.pattern;
    }
    if (name === 'message') {
      if (!value.trim()) return VALIDATION.message.messages.required;
      if (value.length < VALIDATION.message.min) return VALIDATION.message.messages.min;
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

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type, isVisible: true });
    setTimeout(() => setToast((p) => ({ ...p, isVisible: false })), 6000);
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
      addLog('VALIDATION_FAILURE: SECTOR_MISSING_DATA');
      setTimeout(() => setStatus('IDLE'), 2000);
      return;
    }

    setStatus('SYNCING');
    addLog('HANDSHAKE_START: NODE_ALPHA_01');
    await new Promise((r) => setTimeout(r, 800));
    setStatus('TRANSMITTING');
    addLog('PAYLOAD_ENCRYPTED: Mission_Secure');

    try {
      await new Promise((r) => setTimeout(r, 1500));
      addLog('BITSTREAM_SYNC: 100%');
      setStatus('SUCCESS');
      showToast('Transmission successful. Payload secured.', 'success');
      setTimeout(() => {
        setFormData({ name: '', email: '', message: '' });
        setStatus('IDLE');
        setTransmissionLogs([]);
        setTouched({ name: false, email: false, message: false });
      }, 4000);
    } catch (err) {
      setStatus('ERROR');
      addLog('FAILURE: SIGNAL_INTERFERENCE');
      showToast('Uplink failed. Check coordinates.', 'error');
      setTimeout(() => {
        setStatus('IDLE');
        setTransmissionLogs([]);
      }, 3000);
    }
  };

  return (
    <section
      ref={containerRef}
      id="contact"
      className={cn(
        'relative w-full py-20 px-6 flex items-center justify-center overflow-hidden bg-white dark:bg-space-black transition-colors duration-1000',
        className
      )}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <motion.div
          animate={{ x: [0, 40, -40, 0], y: [0, -30, 30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-vision-crimson/10 rounded-full blur-[160px]"
        />
        <motion.div
          animate={{ x: [0, -40, 40, 0], y: [0, 30, -30, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-vision-cyan/10 rounded-full blur-[160px]"
        />
      </div>

      <div className="max-w-7xl w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              className="inline-flex items-center gap-4 px-6 py-2 rounded-full glassmorphism border-2 border-vision-cyan/30 text-vision-cyan shadow-[0_0_20px_rgba(6,182,212,0.15)]"
            >
              <Icons.Activity className="animate-pulse" />
              <span className="text-[9px] font-mono font-black tracking-[0.5em] uppercase">
                Protocol: Transmit_Ready
              </span>
            </motion.div>

            <div className="space-y-6">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-black leading-[0.85] tracking-tight uppercase text-text-light dark:text-text-dark">
                Sync <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-vision-crimson via-vision-orange to-vision-cyan drop-shadow-[0_10px_30px_rgba(190,18,60,0.25)]">
                  Reality.
                </span>
              </h2>
              <p className="text-text-light/70 dark:text-text-dark/60 text-base sm:text-lg font-medium leading-relaxed max-w-sm">
                Initialize communication protocol. Our architecture is optimized for high-fidelity
                collaboration.
              </p>
            </div>

            <div className="p-6 rounded-[2.5rem] glassmorphism border-2 border-white/5 space-y-3 min-h-[140px] flex flex-col justify-end shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />

              <div className="text-[9px] font-mono font-black text-text-light/40 dark:text-text-dark/20 uppercase tracking-[0.4em] mb-2 border-b border-current/10 pb-2">
                Transmission_Telemetry
              </div>
              <AnimatePresence mode="popLayout">
                {transmissionLogs.map((log, i) => (
                  <motion.div
                    key={log + i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="font-mono text-[10px] font-bold text-vision-cyan/80 flex items-center gap-3"
                  >
                    <span className="text-vision-cyan/40 font-black">
                      [
                      {new Date().toLocaleTimeString([], {
                        hour12: false,
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                      ]
                    </span>
                    <span className="tracking-tight">{log}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <motion.div
            style={{ x: springX, y: springY }}
            onMouseMove={handleMouseMove}
            className="lg:col-span-7 w-full will-change-transform"
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                'relative p-8 md:p-12 rounded-[3.5rem] glassmorphism border-2 transition-all duration-1000',
                Object.values(errors).some((e) => !!e)
                  ? 'border-vision-crimson/50 shadow-2xl'
                  : 'border-white/10 shadow-2xl'
              )}
            >
              <div className="absolute top-8 left-8 w-10 h-10 border-t-2 border-l-2 border-vision-cyan/30 rounded-tl-[1.5rem]" />
              <div className="absolute bottom-8 right-8 w-10 h-10 border-b-2 border-r-2 border-vision-crimson/30 rounded-br-[1.5rem]" />

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <SystemInput
                    label="Origin_ID"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.name}
                    placeholder="ENTER IDENTITY"
                    disabled={status !== 'IDLE'}
                  />
                  <SystemInput
                    label="Return_Signal"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.email}
                    placeholder="COORD@DOMAIN.COM"
                    disabled={status !== 'IDLE'}
                  />
                </div>

                <SystemInput
                  label="Mission_Payload"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.message}
                  placeholder="ENCRYPT DATA PACKET..."
                  isTextArea={true}
                  disabled={status !== 'IDLE'}
                />

                <div className="relative pt-6">
                  <button
                    type="submit"
                    disabled={status !== 'IDLE'}
                    className={cn(
                      'group relative w-full h-24 rounded-3xl overflow-hidden transition-all duration-1000',
                      'bg-white/5 dark:bg-white/[0.03] border-2 border-text-light/15 dark:border-white/10 shadow-xl',
                      status === 'SUCCESS' &&
                        'border-vision-cyan/60 shadow-[0_0_40px_rgba(6,182,212,0.2)]',
                      status === 'TRANSMITTING' && 'border-transparent',
                      status === 'ERROR' && 'border-vision-crimson/60'
                    )}
                  >
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
                          ? 'text-white'
                          : 'text-text-light/50 dark:text-text-dark/40 group-hover:text-vision-cyan'
                      )}
                    >
                      <AnimatePresence mode="wait">
                        {status === 'IDLE' && (
                          <motion.div key="idle" className="flex items-center gap-4">
                            Initiate_Uplink{' '}
                            <Icons.Send className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          </motion.div>
                        )}
                        {status === 'SYNCING' && <motion.div key="sync">Syncing...</motion.div>}
                        {status === 'TRANSMITTING' && (
                          <motion.div key="trans">Transmitting...</motion.div>
                        )}
                        {status === 'SUCCESS' && (
                          <motion.div key="success" className="flex items-center gap-4">
                            Link_Secure <Icons.Check />
                          </motion.div>
                        )}
                        {status === 'ERROR' && (
                          <motion.div key="err" className="text-vision-crimson">
                            Signal_Loss
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </span>
                  </button>
                </div>
              </form>

              <div className="mt-12 flex justify-between text-[8px] font-mono font-black text-text-light/30 dark:text-text-dark/20 uppercase tracking-[0.5em] border-t border-current/5 pt-4">
                <div className="flex gap-8">
                  <span>Packet: OK</span>
                  <span>Latency: 14ms</span>
                </div>
                <div className="hidden md:block">Voyager_OS // Subsector_09</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ContactForm;

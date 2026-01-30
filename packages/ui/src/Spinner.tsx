'use client';

import React, { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Utility for clean class merging
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

// ============================================================================
// VOYAGER SPINNER (SCANNING NODE)
// ============================================================================

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'cyan' | 'crimson' | 'orange';
  className?: string;
  showText?: boolean;
}

const sizeMap = {
  xs: 'h-8 w-8',
  sm: 'h-12 w-12',
  md: 'h-20 w-20',
  lg: 'h-32 w-32',
  xl: 'h-48 w-48',
};

export const Spinner = memo(function Spinner({
  size = 'md',
  variant = 'cyan',
  className,
  showText = false,
}: SpinnerProps) {
  const colorClass =
    variant === 'crimson'
      ? 'text-vision-crimson'
      : variant === 'orange'
        ? 'text-vision-orange'
        : 'text-vision-cyan';

  return (
    <div className={cn('relative flex flex-col items-center justify-center', className)}>
      <div className={cn('relative', sizeMap[size])}>
        {/* Outer Static Bracket Ring (Dashed) */}
        <svg
          className={cn('absolute inset-0 w-full h-full opacity-20', colorClass)}
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeDasharray="4 4"
          />
        </svg>

        {/* Layer 1: Slow Reverse Rotation */}
        <motion.div
          className={cn(
            'absolute inset-0 border-[0.5px] border-current opacity-10 rounded-full',
            colorClass
          )}
          animate={{ rotate: -360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />

        {/* Layer 2: Main Accented HUD Ring */}
        <motion.div
          className={cn(
            'absolute inset-2 border-t-2 border-l-[0.5px] border-current opacity-60 rounded-full',
            colorClass
          )}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />

        {/* Layer 3: Inner Fast Scanning Beam */}
        <motion.div
          className={cn(
            'absolute inset-4 border-r-2 border-current rounded-full shadow-[0_0_15px_rgba(6,182,212,0.2)]',
            colorClass
          )}
          animate={{ rotate: -360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />

        {/* Core Pulsing Point */}
        <motion.div
          className={cn(
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1/5 w-1/5 rounded-full bg-current shadow-[0_0_20px_currentColor]',
            colorClass
          )}
          animate={{
            scale: [0.8, 1.1, 0.8],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Corner Telemetry Brackets */}
        <div
          className={cn(
            'absolute -top-1 -left-1 w-3 h-3 border-t border-l border-current opacity-80',
            colorClass
          )}
        />
        <div
          className={cn(
            'absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-current opacity-80',
            colorClass
          )}
        />
      </div>

      {showText && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            'mt-6 text-[8px] font-mono font-bold uppercase tracking-[0.6em]',
            colorClass
          )}
        >
          Node_Scanning...
        </motion.div>
      )}
    </div>
  );
});

// ============================================================================
// DATA PACKET LOADER (DOTS)
// ============================================================================

export const DotsLoader = memo(function DotsLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col items-center gap-3', className)} role="status">
      <div className="flex items-center gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="relative h-2.5 w-2.5">
            <motion.div
              className="absolute inset-0 rounded-sm bg-vision-cyan"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.2, 1, 0.2],
                rotate: [0, 90, 0],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-sm bg-vision-cyan blur-[4px]"
              animate={{
                scale: [1, 2, 1],
                opacity: [0, 0.4, 0],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          </div>
        ))}
      </div>
      <span className="text-[7px] font-mono text-vision-cyan/40 uppercase tracking-[0.4em] font-bold">
        Bit_Stream_Active
      </span>
    </div>
  );
});

// ============================================================================
// SONAR PULSE LOADER
// ============================================================================

export const PulseLoader = memo(function PulseLoader({ className }: { className?: string }) {
  return (
    <div className={cn('relative h-24 w-24 flex items-center justify-center', className)}>
      {/* Background Radar Grid */}
      <div className="absolute inset-0 border border-vision-cyan/5 rounded-full" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-[0.5px] bg-vision-cyan/10" />
        <div className="h-full w-[0.5px] bg-vision-cyan/10 absolute" />
      </div>

      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border border-vision-cyan/20"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{
            duration: 3,
            ease: 'easeOut',
            repeat: Infinity,
            delay: i * 1,
          }}
        />
      ))}

      {/* Sweeping Beam */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-vision-cyan/10 to-transparent"
        style={{ originX: '50%', originY: '50%' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />

      <div className="relative z-10 h-2 w-2 rounded-full bg-vision-cyan shadow-[0_0_15px_rgba(6,182,212,1)]" />

      <div className="absolute -bottom-8 whitespace-nowrap text-[8px] font-mono text-vision-cyan/50 uppercase tracking-[0.5em] flex items-center gap-2">
        <span className="animate-pulse">●</span> Sector_Scan_09
      </div>
    </div>
  );
});

// ============================================================================
// FREQUENCY BARS (EQUALIZER)
// ============================================================================

export const BarsLoader = memo(function BarsLoader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-end gap-1.5 h-10 px-4 py-2 glassmorphism rounded-xl border-white/5',
        className
      )}
    >
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 rounded-t-sm bg-gradient-to-t from-vision-cyan/20 via-vision-cyan to-vision-crimson"
          animate={{
            height: ['15%', '100%', '45%', '85%', '20%', '95%', '15%'],
          }}
          transition={{
            duration: 1 + Math.random(),
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
      <div className="ml-2 h-full flex flex-col justify-center border-l border-white/10 pl-3">
        <div className="text-[7px] font-mono text-vision-cyan font-black uppercase leading-none">
          FRQ
        </div>
        <div className="text-[6px] font-mono text-white/20 uppercase leading-none mt-1 tracking-tighter">
          SIG_STB
        </div>
      </div>
    </div>
  );
});

// ============================================================================
// FULL PAGE SYSTEM BOOT LOADER
// ============================================================================

interface PageLoaderProps {
  isLoading?: boolean;
  message?: string;
}

const BOOT_LOGS = [
  'Kernel_Init_Success',
  'Uplink_Channel_Stable',
  'Sector_Alpha_Mapped',
  'Gravity_Drive_Sync',
  'Voyager_Ready_For_Entry',
];

export const PageLoader = memo(function PageLoader({
  isLoading = true,
  message = 'Voyager_OS // Booting',
}: PageLoaderProps) {
  const [logIndex, setLogIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setLogIndex((prev) => (prev + 1) % BOOT_LOGS.length);
    }, 600);
    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-space-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            filter: 'blur(20px)',
            transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
          }}
        >
          {/* Global HUD CRT Overlay */}
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,118,0.03))] bg-[length:100%_4px,4px_100%] opacity-20" />
            <motion.div
              animate={{ y: ['-100%', '100%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="w-full h-1/4 bg-gradient-to-b from-transparent via-vision-cyan/[0.05] to-transparent"
            />
          </div>

          <div className="relative flex flex-col items-center">
            {/* Centerpiece: Massive HUD Spinner */}
            <Spinner size="xl" className="mb-20" />

            {/* Matrix style Boot Log Display */}
            <div className="h-24 w-96 flex flex-col items-center justify-center space-y-6">
              <motion.div
                key={logIndex}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[9px] font-mono text-vision-cyan font-bold uppercase tracking-[0.5em] bg-vision-cyan/5 px-4 py-1.5 rounded-md border border-vision-cyan/10"
              >
                {BOOT_LOGS[logIndex]}
              </motion.div>

              <div className="flex items-center justify-center gap-8">
                <div className="flex flex-col items-center">
                  <span className="text-[7px] font-mono text-white/20 uppercase tracking-widest mb-1">
                    Link
                  </span>
                  <span className="text-[10px] font-mono text-vision-cyan">STABLE</span>
                </div>
                <div className="h-6 w-px bg-white/10" />
                <div className="flex flex-col items-center">
                  <span className="text-[7px] font-mono text-white/20 uppercase tracking-widest mb-1">
                    Latency
                  </span>
                  <span className="text-[10px] font-mono text-vision-cyan">14ms</span>
                </div>
                <div className="h-6 w-px bg-white/10" />
                <div className="flex flex-col items-center">
                  <span className="text-[7px] font-mono text-white/20 uppercase tracking-widest mb-1">
                    Power
                  </span>
                  <span className="text-[10px] font-mono text-vision-orange">100%</span>
                </div>
              </div>
            </div>

            {/* Technical Progress Bar */}
            <div className="mt-16 w-80 h-[1.5px] bg-white/5 relative overflow-hidden rounded-full">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-vision-cyan via-vision-crimson to-vision-cyan shadow-[0_0_15px_rgba(6,182,212,0.6)]"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 4, ease: 'easeInOut' }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:50%_100%] animate-dash-move" />
            </div>

            <div className="mt-4 text-[7px] font-mono text-white/20 uppercase tracking-[1em] italic">
              Loading_Mission_Assets
            </div>
          </div>

          {/* Ambient Cosmic Bloom */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-vision-cyan/5 rounded-full blur-[160px] pointer-events-none" />
          <div className="absolute bottom-10 left-10 text-[8px] font-mono text-white/10 uppercase tracking-[0.4em]">
            Voyager_System // Ver_2.5.0-Release
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// ============================================================================
// GHOST SKELETON (HUD STYLE)
// ============================================================================

export const Skeleton = memo(function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-white/[0.03] dark:bg-white/[0.01] rounded-[1.5rem] border border-white/5 backdrop-blur-md',
        className
      )}
    >
      {/* HUD Background Detail */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-px bg-white absolute left-1/4" />
        <div className="h-full w-px bg-white absolute left-2/4" />
        <div className="h-full w-px bg-white absolute left-3/4" />
      </div>

      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      />

      {/* Brackets Detail */}
      <div className="absolute top-3 left-3 w-2 h-2 border-t border-l border-white/20 rounded-tl-sm" />
      <div className="absolute bottom-3 right-3 w-2 h-2 border-b border-r border-white/20 rounded-br-sm" />
    </div>
  );
});

// Legacy support wrapper
export const SpinnerContainer = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => (
  <div className={cn('flex items-center justify-center p-8', className)}>
    {children || <Spinner />}
  </div>
);

export default {
  Spinner,
  DotsLoader,
  PulseLoader,
  BarsLoader,
  PageLoader,
  Skeleton,
};

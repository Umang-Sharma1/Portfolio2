'use client';

import React, { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'cyan' | 'crimson' | 'orange';
  className?: string;
  showText?: boolean;
}

const sizeMap = {
  xs: 'h-10 w-10',
  sm: 'h-16 w-16',
  md: 'h-24 w-24',
  lg: 'h-40 w-40',
  xl: 'h-64 w-64',
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
        {/* Layer 0: Static Grid */}
        <svg
          className={cn('absolute inset-0 w-full h-full opacity-10', colorClass)}
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeDasharray="2 4"
          />
        </svg>

        {/* Layer 1: Slow Orbital Brackets */}
        <MotionDiv
          className={cn(
            'absolute inset-0 border-[1px] border-current opacity-20 rounded-full',
            colorClass
          )}
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        />

        {/* Layer 2: Main Accented HUD Segment */}
        <MotionDiv
          className={cn(
            'absolute inset-4 border-t-4 border-l-2 border-current rounded-full shadow-[0_0_30px_currentColor]',
            colorClass
          )}
          animate={{ rotate: 360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
        />

        {/* Layer 3: Inner Fast Scanning Beam */}
        <MotionDiv
          className={cn(
            'absolute inset-8 border-r-4 border-current rounded-full opacity-80',
            colorClass
          )}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        />

        {/* Core Pulsing Singularity */}
        <MotionDiv
          className={cn(
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1/6 w-1/6 rounded-full bg-current shadow-[0_0_40px_currentColor]',
            colorClass
          )}
          animate={{ scale: [0.7, 1.2, 0.7], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Technical Corner Brackets */}
        <div
          className={cn(
            'absolute -top-2 -left-2 w-5 h-5 border-t-2 border-l-2 border-current',
            colorClass
          )}
        />
        <div
          className={cn(
            'absolute -bottom-2 -right-2 w-5 h-5 border-b-2 border-r-2 border-current',
            colorClass
          )}
        />
      </div>

      {showText && (
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            'mt-12 text-[10px] font-mono font-black uppercase tracking-[1em]',
            colorClass
          )}
        >
          Node_Scanning...
        </MotionDiv>
      )}
    </div>
  );
});

export const PageLoader = memo(function PageLoader({
  isLoading = true,
  message = 'VOYAGER_OS // LOADING_MISSION',
}: {
  isLoading?: boolean;
  message?: string;
}) {
  const [logIndex, setLogIndex] = useState(0);
  const logs = [
    'KERNEL_INIT: OK',
    'UPLINK_SYNC: STABLE',
    'SECTOR_SCAN: COMPLETE',
    'DRIVE_ENGAGE: READY',
  ];

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => setLogIndex((prev) => (prev + 1) % logs.length), 700);
    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <MotionDiv
          className="fixed inset-0 z-[5000] flex flex-col items-center justify-center bg-space-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] } }}
        >
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden opacity-20">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(34,211,238,0.05),transparent,rgba(34,211,238,0.05))] bg-[length:100%_4px,100%_100%] animate-scan" />
          </div>

          <div className="relative flex flex-col items-center">
            <Spinner size="xl" className="mb-24" />

            <div className="h-32 w-[500px] flex flex-col items-center justify-center space-y-8">
              <MotionDiv
                key={logIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[11px] font-mono text-vision-cyan font-black uppercase tracking-[0.8em] bg-vision-cyan/10 px-8 py-3 rounded-full border border-vision-cyan/30 shadow-[0_0_30px_rgba(34,211,238,0.2)]"
              >
                {logs[logIndex]}
              </MotionDiv>

              <div className="flex items-center justify-center gap-12">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[9px] font-mono text-white/30 uppercase tracking-[0.4em]">
                    Signal
                  </span>
                  <span className="text-sm font-black text-vision-cyan font-mono tracking-tighter">
                    SECURE
                  </span>
                </div>
                <div className="h-10 w-[2px] bg-white/10" />
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[9px] font-mono text-white/30 uppercase tracking-[0.4em]">
                    Ping
                  </span>
                  <span className="text-sm font-black text-vision-cyan font-mono tracking-tighter">
                    12MS
                  </span>
                </div>
                <div className="h-10 w-[2px] bg-white/10" />
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[9px] font-mono text-white/30 uppercase tracking-[0.4em]">
                    Energy
                  </span>
                  <span className="text-sm font-black text-vision-orange font-mono tracking-tighter">
                    100%
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-20 w-96 h-[3px] bg-white/5 relative overflow-hidden rounded-full">
              <MotionDiv
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-vision-cyan via-vision-crimson to-vision-cyan shadow-[0_0_30px_rgba(34,211,238,0.8)]"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 5, ease: 'easeInOut' }}
              />
            </div>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-vision-cyan/5 rounded-full blur-[200px] pointer-events-none" />
        </MotionDiv>
      )}
    </AnimatePresence>
  );
});

export default { Spinner, PageLoader };

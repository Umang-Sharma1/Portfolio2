'use client';

import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// ============================================================================
// SPINNER COMPONENT
// ============================================================================

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'gradient';
  className?: string;
}

const sizeMap = {
  xs: 'h-4 w-4',
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
};

const borderSizeMap = {
  xs: 'border-2',
  sm: 'border-2',
  md: 'border-[3px]',
  lg: 'border-4',
  xl: 'border-4',
};

export const Spinner = memo(function Spinner({
  size = 'md',
  variant = 'default',
  className,
}: SpinnerProps) {
  if (variant === 'gradient') {
    return (
      <div className={cn('relative', sizeMap[size], className)}>
        <motion.div
          className={cn(
            'absolute inset-0 rounded-full',
            'bg-gradient-to-tr from-primary via-primary/50 to-transparent'
          )}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            ease: 'linear',
            repeat: Infinity,
          }}
        />
        <div className="absolute inset-1 rounded-full bg-background" />
      </div>
    );
  }

  return (
    <motion.div
      className={cn(
        'rounded-full',
        sizeMap[size],
        borderSizeMap[size],
        'border-muted',
        variant === 'primary' ? 'border-t-primary' : 'border-t-foreground',
        className
      )}
      animate={{ rotate: 360 }}
      transition={{
        duration: 0.8,
        ease: 'linear',
        repeat: Infinity,
      }}
      role="status"
      aria-label="Loading"
    />
  );
});

// ============================================================================
// DOTS LOADER
// ============================================================================

interface DotsLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const dotSizeMap = {
  sm: 'h-1.5 w-1.5',
  md: 'h-2 w-2',
  lg: 'h-3 w-3',
};

const dotGapMap = {
  sm: 'gap-1',
  md: 'gap-1.5',
  lg: 'gap-2',
};

export const DotsLoader = memo(function DotsLoader({ size = 'md', className }: DotsLoaderProps) {
  return (
    <div
      className={cn('flex items-center', dotGapMap[size], className)}
      role="status"
      aria-label="Loading"
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={cn('rounded-full bg-primary', dotSizeMap[size])}
          animate={{
            y: ['0%', '-50%', '0%'],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.6,
            ease: 'easeInOut',
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
});

// ============================================================================
// PULSE LOADER
// ============================================================================

interface PulseLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const pulseSizeMap = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
};

export const PulseLoader = memo(function PulseLoader({ size = 'md', className }: PulseLoaderProps) {
  return (
    <div
      className={cn('relative', pulseSizeMap[size], className)}
      role="status"
      aria-label="Loading"
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border-2 border-primary"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{
            duration: 1.5,
            ease: 'easeOut',
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-1/3 w-1/3 rounded-full bg-primary" />
      </div>
    </div>
  );
});

// ============================================================================
// BARS LOADER
// ============================================================================

interface BarsLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const barHeightMap = {
  sm: 'h-4',
  md: 'h-6',
  lg: 'h-8',
};

const barWidthMap = {
  sm: 'w-1',
  md: 'w-1.5',
  lg: 'w-2',
};

export const BarsLoader = memo(function BarsLoader({ size = 'md', className }: BarsLoaderProps) {
  return (
    <div
      className={cn('flex items-end gap-1', barHeightMap[size], className)}
      role="status"
      aria-label="Loading"
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className={cn('rounded-full bg-primary', barWidthMap[size])}
          animate={{
            height: ['20%', '100%', '20%'],
          }}
          transition={{
            duration: 0.8,
            ease: 'easeInOut',
            repeat: Infinity,
            delay: i * 0.1,
          }}
          style={{ height: '20%' }}
        />
      ))}
    </div>
  );
});

// ============================================================================
// PAGE LOADER (Full Page)
// ============================================================================

interface PageLoaderProps {
  isLoading?: boolean;
  message?: string;
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars' | 'logo';
  className?: string;
}

export const PageLoader = memo(function PageLoader({
  isLoading = true,
  message = 'Loading...',
  variant = 'logo',
  className,
}: PageLoaderProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className={cn(
            'fixed inset-0 z-[100] flex flex-col items-center justify-center',
            'bg-background/80 backdrop-blur-md',
            className
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {variant === 'logo' ? (
            <LogoLoader />
          ) : variant === 'spinner' ? (
            <Spinner size="xl" variant="gradient" />
          ) : variant === 'dots' ? (
            <DotsLoader size="lg" />
          ) : variant === 'pulse' ? (
            <PulseLoader size="lg" />
          ) : (
            <BarsLoader size="lg" />
          )}

          {message && (
            <motion.p
              className="mt-6 text-sm font-medium text-muted-foreground"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {message}
            </motion.p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// ============================================================================
// LOGO LOADER (Animated Logo)
// ============================================================================

const LogoLoader = memo(function LogoLoader() {
  return (
    <div className="relative flex flex-col items-center">
      {/* Animated logo */}
      <motion.div
        className="relative flex h-20 w-20 items-center justify-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Rotating ring */}
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-primary/30"
          animate={{ rotate: 360 }}
          transition={{
            duration: 3,
            ease: 'linear',
            repeat: Infinity,
          }}
        />

        {/* Pulsing background */}
        <motion.div
          className="absolute inset-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        />

        {/* Logo icon */}
        <motion.svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="relative z-10 text-primary"
          animate={{
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        >
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </motion.svg>
      </motion.div>

      {/* Progress bar */}
      <motion.div
        className="mt-6 h-1 w-32 overflow-hidden rounded-full bg-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary via-primary/80 to-primary"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            duration: 1.5,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        />
      </motion.div>
    </div>
  );
});

// ============================================================================
// SKELETON LOADER
// ============================================================================

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'circular' | 'rounded';
  animation?: 'pulse' | 'shimmer' | 'none';
}

export const Skeleton = memo(function Skeleton({
  className,
  variant = 'default',
  animation = 'shimmer',
}: SkeletonProps) {
  const baseClasses = cn(
    'bg-muted',
    variant === 'circular' && 'rounded-full',
    variant === 'rounded' && 'rounded-lg',
    variant === 'default' && 'rounded-md',
    animation === 'pulse' && 'animate-pulse',
    animation === 'shimmer' &&
      'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
    className
  );

  return <div className={baseClasses} />;
});

// ============================================================================
// INLINE LOADER
// ============================================================================

interface InlineLoaderProps {
  className?: string;
  text?: string;
}

export const InlineLoader = memo(function InlineLoader({
  className,
  text = 'Loading',
}: InlineLoaderProps) {
  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <span className="text-sm text-muted-foreground">{text}</span>
      <DotsLoader size="sm" />
    </span>
  );
});

// ============================================================================
// BUTTON LOADER (For use inside buttons)
// ============================================================================

interface ButtonLoaderProps {
  isLoading?: boolean;
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
}

export const ButtonLoader = memo(function ButtonLoader({
  isLoading = false,
  children,
  loadingText,
  className,
}: ButtonLoaderProps) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.span
            key="loading"
            className="inline-flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Spinner size="xs" variant="default" />
            {loadingText && <span>{loadingText}</span>}
          </motion.span>
        ) : (
          <motion.span
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
});

// Export all components
export default {
  Spinner,
  DotsLoader,
  PulseLoader,
  BarsLoader,
  PageLoader,
  Skeleton,
  InlineLoader,
  ButtonLoader,
};

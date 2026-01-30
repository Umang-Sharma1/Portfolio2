'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef, memo, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

interface HeroProps {
  className?: string;
}

interface TechBadge {
  name: string;
  icon: string;
  color: string;
  delay: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const TECH_BADGES: TechBadge[] = [
  { name: 'React', icon: '⚛️', color: '#61DAFB', delay: 0 },
  { name: 'Node.js', icon: '🟢', color: '#339933', delay: 0.1 },
  { name: 'MongoDB', icon: '🍃', color: '#47A248', delay: 0.2 },
  { name: 'TypeScript', icon: '📘', color: '#3178C6', delay: 0.3 },
  { name: 'Express', icon: '⚡', color: '#000000', delay: 0.4 },
  { name: 'Next.js', icon: '▲', color: '#000000', delay: 0.5 },
];

const TYPEWRITER_STRINGS = [
  'Building scalable MERN applications',
  'Crafting elegant user experiences',
  'Creating performant web solutions',
  'Developing full-stack applications',
];

const TYPEWRITER_SPEED = 80;
const TYPEWRITER_DELETE_SPEED = 40;
const TYPEWRITER_PAUSE = 2000;

// ============================================================================
// DYNAMIC IMPORTS (Lazy load 3D components)
// ============================================================================

const Hero3DScene = dynamic(() => import('@/components/home/Hero3DScene'), {
  ssr: false,
  loading: () => <Hero3DLoadingFallback />,
});

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Hook to detect device type based on screen width
 */
function useDeviceType() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const checkDevice = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkDevice();

    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkDevice, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return { isDesktop, isMounted };
}

/**
 * Typewriter effect hook
 */
function useTypewriter(
  strings: string[],
  typingSpeed = TYPEWRITER_SPEED,
  deletingSpeed = TYPEWRITER_DELETE_SPEED,
  pauseDuration = TYPEWRITER_PAUSE
) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const currentString = strings[currentIndex];

    if (isPaused) {
      const pauseTimeout = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseDuration);
      return () => clearTimeout(pauseTimeout);
    }

    if (isDeleting) {
      if (displayText === '') {
        setIsDeleting(false);
        setCurrentIndex((prev) => (prev + 1) % strings.length);
      } else {
        const deleteTimeout = setTimeout(() => {
          setDisplayText((prev) => prev.slice(0, -1));
        }, deletingSpeed);
        return () => clearTimeout(deleteTimeout);
      }
    } else {
      if (displayText === currentString) {
        setIsPaused(true);
      } else {
        const typeTimeout = setTimeout(() => {
          setDisplayText((prev) => currentString.slice(0, prev.length + 1));
        }, typingSpeed);
        return () => clearTimeout(typeTimeout);
      }
    }
  }, [
    displayText,
    currentIndex,
    isDeleting,
    isPaused,
    strings,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
  ]);

  return displayText;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Loading fallback for 3D scene
 */
const Hero3DLoadingFallback = memo(function Hero3DLoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative">
        {/* Pulsing circles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border border-primary/30"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              delay: i * 0.4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              width: 100 + i * 40,
              height: 100 + i * 40,
              marginLeft: -(50 + i * 20),
              marginTop: -(50 + i * 20),
            }}
          />
        ))}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
          />
        </div>
      </div>
    </div>
  );
});

/**
 * Animated gradient background for mobile
 */
const AnimatedGradientBackground = memo(function AnimatedGradientBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted" />

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-gradient-to-tl from-secondary/20 to-transparent blur-3xl"
        animate={{
          x: [0, -80, 0],
          y: [0, -60, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-1/3 h-1/3 rounded-full bg-gradient-to-bl from-accent/10 to-transparent blur-2xl"
        animate={{
          x: [0, 40, 0],
          y: [0, -30, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
});

/**
 * Floating tech badge component for mobile
 */
interface FloatingBadgeProps {
  badge: TechBadge;
  index: number;
}

const FloatingBadge = memo(function FloatingBadge({ badge, index }: FloatingBadgeProps) {
  // Calculate position based on index for a scattered layout
  const positions = [
    { top: '15%', left: '10%' },
    { top: '20%', right: '15%' },
    { top: '45%', left: '5%' },
    { top: '50%', right: '8%' },
    { top: '70%', left: '12%' },
    { top: '75%', right: '10%' },
  ];

  const position = positions[index % positions.length];

  return (
    <motion.div
      className="absolute"
      style={position}
      initial={{ opacity: 0, scale: 0, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        delay: badge.delay + 0.5,
        duration: 0.5,
        type: 'spring',
        stiffness: 200,
      }}
    >
      <motion.div
        className={cn(
          'px-3 py-1.5 rounded-full',
          'bg-background/80 backdrop-blur-sm',
          'border border-border/50',
          'shadow-lg shadow-black/5',
          'flex items-center gap-2',
          'text-sm font-medium'
        )}
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 3 + index * 0.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: index * 0.2,
        }}
        whileHover={{ scale: 1.1 }}
      >
        <span>{badge.icon}</span>
        <span
          className="text-xs"
          style={{ color: badge.color === '#000000' ? 'inherit' : badge.color }}
        >
          {badge.name}
        </span>
      </motion.div>
    </motion.div>
  );
});

/**
 * Mobile 2D Hero Background
 */
const Mobile2DBackground = memo(function Mobile2DBackground() {
  return (
    <>
      <AnimatedGradientBackground />
      <div className="absolute inset-0 pointer-events-none">
        <StaticSingularityCanvas />
      </div>
    </>
  );
});

/**
 * CTA Button Component
 */
interface CTAButtonProps {
  href: string;
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
  download?: boolean;
  external?: boolean;
}

const CTAButton = memo(function CTAButton({
  href,
  variant,
  children,
  download,
  external,
}: CTAButtonProps) {
  const baseClasses = cn(
    'relative inline-flex items-center justify-center',
    'px-10 py-5 md:px-12 md:py-5',
    'text-[11px] font-black uppercase',
    'tracking-[0.4em]',
    'rounded-2xl',
    'transition-all duration-300',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
    'overflow-hidden group'
  );

  const variantClasses =
    variant === 'primary'
      ? cn(
          'bg-slate-900 dark:bg-text-dark text-white dark:text-space-black',
          'hover:shadow-2xl',
          'hover:-translate-y-1'
        )
      : cn(
          'glassmorphism border-2 border-slate-200 dark:border-white/10',
          'text-slate-900 dark:text-text-dark',
          'hover:bg-slate-50 dark:hover:bg-white/5',
          'hover:-translate-y-1'
        );

  const content = (
    <>
      {/* Shine effect */}
      <span
        className={cn(
          'absolute inset-0 -translate-x-full',
          'bg-gradient-to-r from-transparent via-white/20 to-transparent',
          'group-hover:translate-x-full transition-transform duration-700'
        )}
      />
      <span className="relative">{children}</span>
    </>
  );

  if (external || download) {
    return (
      <motion.a
        href={href}
        className={cn(baseClasses, variantClasses)}
        download={download}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <Link href={href} passHref legacyBehavior>
      <motion.a
        className={cn(baseClasses, variantClasses)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {content}
      </motion.a>
    </Link>
  );
});

/**
 * Scroll Indicator Component
 */
const ScrollIndicator = memo(function ScrollIndicator() {
  const handleClick = useCallback(() => {
    const nextSection = document.getElementById('skills') || document.getElementById('about');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth',
      });
    }
  }, []);

  return (
    <motion.button
      onClick={handleClick}
      className={cn(
        'absolute bottom-12 left-1/2 -translate-x-1/2',
        'flex flex-col items-center gap-6',
        'text-slate-400 dark:text-white/20',
        'transition-colors duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-vision-cyan rounded-lg p-2'
      )}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.5 }}
      aria-label="Scroll to next section"
    >
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        className="flex flex-col items-center gap-6"
      >
        <div className="h-24 w-[2px] bg-gradient-to-b from-vision-cyan via-vision-cyan/20 to-transparent" />
        <span className="text-[9px] font-mono font-black tracking-[1em] uppercase italic">Descent_Required</span>
      </motion.div>
    </motion.button>
  );
});

/**
 * Hero Content Component
 */
interface HeroContentProps {
  typewriterText: string;
}

const HeroContent = memo(function HeroContent({ typewriterText }: HeroContentProps) {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.15,
        delayChildren: prefersReducedMotion ? 0 : 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <motion.div
      className="relative z-10 text-center space-y-12 px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* System Badge */}
      <motion.div
        variants={itemVariants}
        className="inline-flex items-center gap-4 px-6 py-2 border-2 border-vision-cyan/30 bg-vision-cyan/5 rounded-full text-[10px] font-mono font-black tracking-[0.5em] text-vision-cyan uppercase shadow-glow shadow-vision-cyan/10"
      >
        System_Link: Establishing_Singularity
      </motion.div>

      {/* Main Heading */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h1 className="text-7xl md:text-[11vw] font-display font-black leading-[0.8] tracking-tighter uppercase italic text-slate-900 dark:text-text-dark">
          <motion.span
            initial={{ x: -150, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="block"
          >
            Beyond
          </motion.span>
          <motion.span
            initial={{ x: 150, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="block text-transparent bg-clip-text bg-gradient-to-r from-vision-crimson via-vision-orange to-vision-cyan drop-shadow-2xl"
          >
            The_Horizon.
          </motion.span>
        </h1>
      </motion.div>

      <motion.p
        variants={itemVariants}
        className="max-w-xl mx-auto text-slate-500 dark:text-text-dark/40 text-lg md:text-xl font-bold tracking-tight leading-relaxed italic"
      >
        Architecting structural experiences in the digital void. {typewriterText}
      </motion.p>

      {/* CTA Buttons */}
      <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-8">
        <CTAButton href="#skills" variant="primary">
          <span className="relative z-10">Initialize_Drive</span>
          <span className="absolute inset-0 bg-vision-cyan translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
        </CTAButton>
        <CTAButton href="/projects" variant="secondary">
          <span className="flex items-center gap-3">
            Archives <span className="h-2 w-2 rounded-full bg-vision-orange animate-pulse" />
          </span>
        </CTAButton>
      </motion.div>

      {/* Social Links */}
      <motion.div variants={itemVariants} className="flex items-center justify-center gap-4 mt-8">
        {[
          {
            name: 'GitHub',
            href: 'https://github.com/umangsharma',
            icon: (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            ),
          },
          {
            name: 'LinkedIn',
            href: 'https://linkedin.com/in/umangsharma',
            icon: (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            ),
          },
          {
            name: 'Twitter',
            href: 'https://twitter.com/umangsharma',
            icon: (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            ),
          },
        ].map((social) => (
          <motion.a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'p-2 rounded-full',
              'text-muted-foreground hover:text-foreground',
              'bg-muted/50 hover:bg-muted',
              'transition-colors duration-200',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary'
            )}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Visit my ${social.name} profile`}
          >
            {social.icon}
          </motion.a>
        ))}
      </motion.div>
    </motion.div>
  );
});

// ============================================================================
// MAIN HERO COMPONENT
// ============================================================================

export const Hero = memo(function Hero({ className }: HeroProps) {
  const { isDesktop, isMounted } = useDeviceType();
  const typewriterText = useTypewriter(TYPEWRITER_STRINGS);
  const prefersReducedMotion = useReducedMotion();

  // Don't render until mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <section
        className={cn(
          'relative min-h-screen flex items-center justify-center',
          'overflow-hidden',
          className
        )}
      >
        <Hero3DLoadingFallback />
      </section>
    );
  }

  return (
    <section
      id="home"
      className={cn(
        'relative h-screen flex flex-col items-center justify-center',
        'overflow-hidden px-6 bg-white dark:bg-space-black transition-colors duration-1000',
        className
      )}
      aria-label="Hero section"
    >
      {/* Background */}
      {isDesktop && !prefersReducedMotion ? (
        <Suspense fallback={<Hero3DLoadingFallback />}>
          <div className="absolute inset-0">
            <Hero3DScene />
          </div>
        </Suspense>
      ) : (
        <Mobile2DBackground />
      )}

      {/* Content */}
      <HeroContent typewriterText={typewriterText} />

      {/* Environmental HUD Accents */}
      <div className="absolute top-1/2 left-8 -translate-y-1/2 hidden xl:block space-y-4 opacity-30">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-1 h-8 bg-vision-cyan/20 rounded-full" />
        ))}
      </div>

      {/* Scroll Indicator */}
      <ScrollIndicator />
    </section>
  );
});

// ============================================================================
// EXPORTS
// ============================================================================

export default Hero;
export { TECH_BADGES, TYPEWRITER_STRINGS };

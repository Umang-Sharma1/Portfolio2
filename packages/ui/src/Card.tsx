import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'holographic';
  title?: string;
  subtitle?: string;
}

export const Card = ({
  children,
  className = '',
  variant = 'holographic',
  title,
  subtitle,
  ...props
}: CardProps) => {
  const baseStyles = 'rounded-xl p-6 transition-all duration-300';

  const variants = {
    default: 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800',

    // The Space Voyager Style (dark mode) / Clean Professional (light mode)
    holographic: `
      bg-white/80 dark:bg-space-light/30 
      backdrop-blur-md 
      border border-gray-200/50 dark:border-white/10 
      shadow-lg dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]
      hover:border-primary/50 dark:hover:border-neon-cyan/50
      hover:shadow-xl dark:hover:shadow-[0_0_20px_rgba(0,243,255,0.15)]
      group
    `,
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold text-foreground">{title}</h3>}
          {subtitle && (
            <span className="text-xs text-muted-foreground uppercase tracking-widest">
              {subtitle}
            </span>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

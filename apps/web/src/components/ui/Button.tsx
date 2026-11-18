'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', loading, className = '', disabled, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium rounded-2xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta dark:focus-visible:ring-ochre disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
      primary: 'bg-terracotta text-white hover:bg-accent-hover dark:bg-ochre dark:hover:bg-accent-hover shadow-sm hover:shadow-md',
      secondary: 'bg-sand dark:bg-bark text-espresso dark:text-sand-light border border-earth-border dark:border-border-color hover:bg-surface-hover dark:hover:bg-surface-hover',
      ghost: 'text-umber dark:text-ochre hover:bg-surface-hover dark:hover:bg-surface-hover',
      danger: 'bg-red-600 text-white hover:bg-red-700',
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    const activeClass = 'active:scale-[0.98]';

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${activeClass} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
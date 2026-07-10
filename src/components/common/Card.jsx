import { memo } from 'react';

/**
 * Card — Container wrapper for standard UI blocks.
 */
export const Card = memo(({ children, className = '', ...props }) => (
  <div
    className={`bg-white border border-slate-200/80 dark:bg-slate-800/60 dark:border-slate-700/50 rounded-2xl shadow-sm hover:shadow-md dark:shadow-lg dark:hover:shadow-xl hover:border-slate-350 dark:hover:border-slate-600/60 flex flex-col transition-all duration-200 h-full backdrop-blur-sm ${className}`}
    {...props}
  >
    {children}
  </div>
));
Card.displayName = 'Card';

/**
 * CardHeader — Header section for title, description, and action buttons.
 */
export const CardHeader = memo(({ children, className = '', ...props }) => (
  <div className={`p-6 pb-0 flex flex-col gap-1 ${className}`} {...props}>
    {children}
  </div>
));
CardHeader.displayName = 'CardHeader';

/**
 * CardContent — Main body section with internal layout padding and gaps.
 */
export const CardContent = memo(({ children, className = '', ...props }) => (
  <div className={`p-6 flex-1 flex flex-col ${className}`} {...props}>
    {children}
  </div>
));
CardContent.displayName = 'CardContent';

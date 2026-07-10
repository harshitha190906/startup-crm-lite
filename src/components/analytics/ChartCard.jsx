import { memo } from 'react';
import { Card, CardHeader, CardContent } from '../common/Card';

/**
 * ChartCard — Shared wrapper for all analytics chart cards.
 * Uses common Card UI components and styles for complete consistency.
 *
 * @component
 */
const ChartCard = memo(({ title, subtitle, action, children, className = '', footer }) => (
  <Card className={className}>
    {/* Header */}
    <CardHeader>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">{title}</h3>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>
        {action && (
          <div className="shrink-0 ml-2">{action}</div>
        )}
      </div>
    </CardHeader>

    {/* Body */}
    <CardContent className="pt-4">
      {children}
    </CardContent>

    {/* Footer divider */}
    {footer && (
      <div className="px-6 pb-6 pt-4 border-t border-slate-200 dark:border-slate-700/50">
        {footer}
      </div>
    )}
  </Card>
));

ChartCard.displayName = 'ChartCard';
export default ChartCard;

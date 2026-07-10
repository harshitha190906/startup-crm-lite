import { memo } from 'react';

/**
 * Pulse skeleton block
 */
const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse rounded-xl bg-slate-200/60 dark:bg-slate-700/40 ${className}`} />
);

/**
 * KPI card skeleton (matches KpiCard dimensions)
 */
const KpiSkeleton = () => (
  <div className="bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/50 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <Skeleton className="w-9 h-9 rounded-xl" />
      <Skeleton className="w-14 h-5 rounded-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="w-24 h-7" />
      <Skeleton className="w-20 h-3" />
      <Skeleton className="w-28 h-3" />
    </div>
  </div>
);

/**
 * Chart card skeleton (matches chart card dimensions)
 */
const ChartSkeleton = ({ tall = false }) => (
  <div className={`bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/50 rounded-2xl p-6 shadow-sm flex flex-col gap-4 ${tall ? 'min-h-[320px]' : 'min-h-[260px]'}`}>
    <div className="space-y-1.5">
      <Skeleton className="w-40 h-4" />
      <Skeleton className="w-60 h-3" />
    </div>
    <div className="flex-1 flex items-end gap-2 pt-4">
      {[60, 40, 80, 55, 70, 45].map((h, i) => (
        <Skeleton key={i} className="flex-1 rounded-lg" style={{ height: `${h}%` }} />
      ))}
    </div>
  </div>
);

/**
 * LoadingSkeleton — Full dashboard skeleton while data loads.
 */
const LoadingSkeleton = memo(() => (
  <div className="p-6 lg:p-8 space-y-6">
    {/* Header */}
    <div className="space-y-1.5">
      <Skeleton className="w-56 h-7" />
      <Skeleton className="w-80 h-4" />
    </div>

    {/* KPI Grid */}
    <section className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
      {Array.from({ length: 6 }).map((_, i) => <KpiSkeleton key={i} />)}
    </section>

    {/* Chart rows */}
    {Array.from({ length: 4 }).map((_, i) => (
      <section key={i} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton tall={i === 0} />
        <ChartSkeleton tall={i === 0} />
      </section>
    ))}
  </div>
));

LoadingSkeleton.displayName = 'LoadingSkeleton';
export default LoadingSkeleton;

import { memo } from 'react';
import { Zap, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../common/Card';

const SalesVelocityCard = memo(({ velocityData = {}, trend = null }) => {
  const {
    velocityFormatted = '₹0/day',
    total = 0,
    winRate = 0,
    avgDealSizeFormatted = '₹0',
    avgCycle = 0,
  } = velocityData;

  const hasTrend = trend !== null && trend !== undefined;
  const isTrendPositive = trend >= 0;
  const trendDisplay = trend >= 0 ? `+${trend}%` : `${trend}%`;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">Sales Velocity</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Revenue generated per day across the pipeline</p>
          </div>
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 text-amber-600 dark:text-amber-400">
            <Zap className="w-4 h-4" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 flex flex-col justify-between">
        <div className="my-auto py-3">
          <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-1.5">CURRENT VELOCITY</p>
          <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
            {velocityFormatted}
          </h2>
          {hasTrend ? (
            <div className={`flex items-center gap-1.5 mt-2.5 ${isTrendPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {isTrendPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span className="text-xs font-semibold">{trendDisplay} vs previous period</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 mt-2.5 text-slate-400 dark:text-slate-500">
              <Zap className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">Based on current pipeline metrics</span>
            </div>
          )}
        </div>

        <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700/50">
          <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-3">
            VELOCITY EQUATION FACTORS
          </p>
          <div className="space-y-2.5 text-xs font-medium text-slate-550 dark:text-slate-400">
            <div className="flex items-center justify-between">
              <span>Opportunities (Total Leads)</span>
              <strong className="text-slate-800 dark:text-slate-200 font-bold">{total}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Win Rate (Conversion)</span>
              <strong className="text-slate-800 dark:text-slate-200 font-bold">{winRate}%</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Avg Deal Size</span>
              <strong className="text-slate-800 dark:text-slate-200 font-bold">{avgDealSizeFormatted}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Avg Sales Cycle Length</span>
              <strong className="text-slate-800 dark:text-slate-200 font-bold">
                {avgCycle > 0 ? `${avgCycle} Days` : '–'}
              </strong>
            </div>
          </div>
          <div className="mt-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60">
            <p className="text-[9px] font-mono text-slate-500 dark:text-slate-600 text-center leading-relaxed">
              (Opps × Win Rate × Avg Deal Size) ÷ Cycle Length
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

SalesVelocityCard.displayName = 'SalesVelocityCard';
export default SalesVelocityCard;

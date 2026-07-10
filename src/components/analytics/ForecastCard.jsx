import { memo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../common/Card';

const ForecastCard = memo(({ forecastData = {} }) => {
  const {
    forecastFormatted = '₹0',
    confidence = 0,
    growthPct = 0,
    monthlyData = [],
  } = forecastData;

  const TrendIcon = growthPct > 0 ? TrendingUp : growthPct < 0 ? TrendingDown : Minus;
  const trendColor = growthPct > 0 ? 'text-emerald-600 dark:text-emerald-400' : growthPct < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500';
  const trendLabel = growthPct > 0 ? `+${growthPct}% growth trend` : growthPct < 0 ? `${growthPct}% declining trend` : 'Flat growth trajectory';
  
  // Custom confidence color mappings
  const confidenceColor = confidence >= 80 ? 'from-emerald-500 to-emerald-400' : confidence >= 60 ? 'from-amber-500 to-amber-400' : 'from-rose-500 to-rose-400';
  const confidenceTextColor = confidence >= 80 ? 'text-emerald-600 dark:text-emerald-400' : confidence >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">Revenue Forecast</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Projected won values based on trailing metrics</p>
          </div>
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 flex flex-col justify-between">
        <div className="my-auto py-3">
          <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-1.5">
            PREDICTED REVENUE NEXT MONTH
          </p>
          <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
            {forecastFormatted}
          </h2>
          <div className={`flex items-center gap-1.5 mt-2.5 ${trendColor}`}>
            <TrendIcon className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">{trendLabel}</span>
          </div>
        </div>

        {monthlyData.length > 0 && (
          <div className="flex items-end gap-1 h-12 mb-4">
            {monthlyData.map((m, i) => {
              const maxR = Math.max(...monthlyData.map((x) => x.revenue), 1);
              const h = m.revenue > 0 ? Math.round((m.revenue / maxR) * 100) : 4;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-0.5" title={`${m.month}: ₹${Number(m.revenue).toLocaleString('en-IN')}`}>
                  <div
                    className="w-full rounded-sm bg-emerald-500/30 dark:bg-emerald-500/40 transition-all duration-500"
                    style={{ height: `${h}%`, minHeight: '3px' }}
                  />
                </div>
              );
            })}
            <div className="flex-1 flex flex-col items-center gap-0.5" title="Forecast">
              <div className="w-full rounded-sm bg-blue-500/20 border border-blue-400/20 border-dashed dark:bg-blue-500/40" style={{ height: '80%', minHeight: '3px' }} />
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-200 dark:border-slate-700/50 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-500 dark:text-slate-400">Forecasting Confidence</span>
            <span className={`font-bold ${confidenceTextColor}`}>{confidence}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-900/60 rounded-full h-1.5 overflow-hidden border border-slate-200/40 dark:border-slate-800/40">
            <div
              className={`h-full bg-gradient-to-r ${confidenceColor} rounded-full transition-all duration-700`}
              style={{ width: `${confidence}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-relaxed">
            Based on {monthlyData.filter((m) => m.revenue > 0).length} months of revenue data. Accuracy range ±15%.
          </p>
        </div>
      </CardContent>
    </Card>
  );
});

ForecastCard.displayName = 'ForecastCard';
export default ForecastCard;

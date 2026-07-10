import { memo } from 'react';
import { Trophy } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../common/Card';

const RANK_LABELS = ['🥇', '🥈', '🥉'];

const TopPerformersCard = memo(({ performers = [] }) => {
  const maxRevenue = performers[0]?.rawRevenue || 1;
  const totalRevenue = performers.reduce((sum, p) => sum + (p.rawRevenue || 0), 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">Top Sales Performers</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Ranked by closed-won revenue</p>
          </div>
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 text-amber-600 dark:text-amber-400">
            <Trophy className="w-4 h-4" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 flex flex-col justify-between">
        {performers.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-slate-450 dark:text-slate-500 font-medium text-center">
              No closed deals yet.<br />Win your first deal to appear here.
            </p>
          </div>
        ) : (
          <div className="flex-1 space-y-5 my-auto">
            {performers.slice(0, 5).map((rep, idx) => {
              const pct = maxRevenue > 0 ? Math.round((rep.rawRevenue / maxRevenue) * 100) : 0;
              return (
                <div key={rep.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-base leading-none w-5 text-center text-slate-800 dark:text-slate-200">
                        {RANK_LABELS[idx] ?? `${idx + 1}.`}
                      </span>
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm shrink-0"
                        style={{ backgroundColor: rep.avatarColor }}
                      >
                        {rep.name[0].toUpperCase()}
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-slate-850 dark:text-slate-200">{rep.name}</span>
                        <span className="text-[10px] text-slate-450 dark:text-slate-500 ml-1.5 font-medium">
                          {rep.count} {rep.count === 1 ? 'deal' : 'deals'}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {rep.revenueFormatted}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-900/60 rounded-full h-1.5 overflow-hidden border border-slate-200/40 dark:border-slate-800/40">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: rep.avatarColor }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      <div className="flex items-center justify-between text-xs pt-4 mx-6 mb-6 border-t border-slate-200 dark:border-slate-700/50">
        <span className="font-medium text-slate-500 dark:text-slate-400">Aggregate Closed Revenue</span>
        <span className="font-extrabold text-slate-900 dark:text-white text-sm">
          {totalRevenue > 0 ? `₹${Number(totalRevenue).toLocaleString('en-IN')}` : '₹0'}
        </span>
      </div>
    </Card>
  );
});

TopPerformersCard.displayName = 'TopPerformersCard';
export default TopPerformersCard;

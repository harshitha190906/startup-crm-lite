import { memo, useState, useCallback } from 'react';
import { Activity } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../common/Card';

const getIntensityClass = (count) => {
  if (count === 0) return 'bg-slate-100 dark:bg-slate-700/50 border-slate-200/60 dark:border-slate-700/30';
  if (count === 1) return 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-200/50 dark:border-emerald-800/30';
  if (count === 2) return 'bg-emerald-200 dark:bg-emerald-800/60 border-emerald-300/50 dark:border-emerald-700/40';
  if (count === 3) return 'bg-emerald-300 dark:bg-emerald-700/80 border-emerald-400/50 dark:border-emerald-600/40';
  if (count === 4) return 'bg-emerald-400 dark:bg-emerald-600 border-emerald-500/50 dark:border-emerald-500/40';
  return 'bg-emerald-500 dark:bg-emerald-500 border-emerald-600/50 dark:border-emerald-400/45';
};

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const ActivityHeatmap = memo(({ heatmapData = { cells: [], totalActivities: 0 } }) => {
  const [tooltip, setTooltip] = useState(null);
  const { cells = [], totalActivities = 0 } = heatmapData;

  const firstDayOfWeek = cells[0]?.dayOfWeek ?? 0;
  const paddedCells = [
    ...Array.from({ length: firstDayOfWeek }, (_, i) => ({ date: `pad-${i}`, count: -1, label: '' })),
    ...cells,
  ];

  const onEnter = useCallback((cell) => { if (cell.count >= 0) setTooltip(cell); }, []);
  const onLeave = useCallback(() => setTooltip(null), []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">Activity Heatmap</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">90-day trail of CRM touchpoints and operations</p>
          </div>
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <Activity className="w-4 h-4" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 flex flex-col gap-5 justify-between">
        <div className="relative flex gap-1.5 flex-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 justify-start">
            {DAY_LABELS.map((d) => (
              <div key={d} className="h-4 flex items-center text-[8px] text-slate-400 dark:text-slate-650 font-semibold w-5">{d[0]}</div>
            ))}
          </div>

          {/* Weeks columns */}
          <div className="flex gap-1 flex-1 overflow-hidden">
            {Array.from({ length: 13 }, (_, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-1 flex-1">
                {Array.from({ length: 7 }, (_, dayIdx) => {
                  const cell = paddedCells[weekIdx * 7 + dayIdx];
                  if (!cell) return <div key={dayIdx} className="flex-1 min-h-[14px]" />;
                  if (cell.count < 0) return <div key={dayIdx} className="flex-1 min-h-[14px]" />;
                  return (
                    <div
                      key={dayIdx}
                      className={`flex-1 min-h-[14px] rounded-sm border cursor-pointer transition-all duration-150 hover:scale-110 ${getIntensityClass(cell.count)}`}
                      onMouseEnter={() => onEnter(cell)}
                      onMouseLeave={onLeave}
                      title={cell.count > 0 ? `${cell.label}: ${cell.count} activities` : `${cell.label}: No activity`}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* Tooltip */}
          {tooltip && tooltip.count >= 0 && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 shadow-xl dark:shadow-2xl pointer-events-none whitespace-nowrap">
              <span className="font-bold">{tooltip.label}</span>
              <span className="text-slate-500 dark:text-slate-400 ml-1.5">
                {tooltip.count > 0 ? `${tooltip.count} activities` : 'No activity'}
              </span>
            </div>
          )}
        </div>
      </CardContent>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs pt-4 mx-6 mb-6 border-t border-slate-200 dark:border-slate-700/50">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Less</span>
          <div className="flex gap-1 items-center">
            {[0, 1, 2, 3, 4, 5].map((val) => (
              <div key={val} className={`w-3 h-3 rounded-sm border ${getIntensityClass(val)}`} />
            ))}
          </div>
          <span className="text-slate-500 dark:text-slate-400 font-medium">More</span>
        </div>
        <div className="text-slate-500 dark:text-slate-400 font-medium">
          Total Operations Logged:{' '}
          <span className="font-extrabold text-slate-800 dark:text-slate-200">{totalActivities}</span>
        </div>
      </div>
    </Card>
  );
});

ActivityHeatmap.displayName = 'ActivityHeatmap';
export default ActivityHeatmap;

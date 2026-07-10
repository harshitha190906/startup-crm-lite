import { memo } from 'react';
import { Calendar } from 'lucide-react';

const RANGES = ['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'This Year', 'Custom Range'];

const AnalyticsFilters = memo(({
  activeRange,
  onRangeChange,
  customStart,
  customEnd,
  onCustomDatesChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 flex-wrap">
      <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {RANGES.map((range) => (
            <button
              key={range}
              onClick={() => onRangeChange(range)}
              className={`
                px-3 py-3 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer min-h-[44px] flex items-center justify-center flex-1 md:flex-initial
                ${activeRange === range
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20 dark:shadow-blue-500/30'
                  : 'bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 text-slate-600 hover:text-slate-800 dark:bg-slate-800/60 dark:border-slate-700/60 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-200'
                }
              `}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {activeRange === 'Custom Range' && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
          <div className="flex items-center justify-between sm:justify-start gap-1.5 bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 rounded-lg px-3 py-3 text-xs min-h-[44px] flex-1 sm:flex-initial">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span className="text-[9px] text-slate-450 dark:text-slate-555 uppercase font-bold">From:</span>
            </div>
            <input
              type="date"
              value={customStart || ''}
              onChange={(e) => onCustomDatesChange(e.target.value, customEnd)}
              className="bg-transparent border-none text-slate-700 dark:text-slate-300 outline-none text-xs font-medium focus:ring-0 p-0 cursor-pointer ml-1"
            />
          </div>
          <div className="flex items-center justify-between sm:justify-start gap-1.5 bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 rounded-lg px-3 py-3 text-xs min-h-[44px] flex-1 sm:flex-initial">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span className="text-[9px] text-slate-450 dark:text-slate-555 uppercase font-bold">To:</span>
            </div>
            <input
              type="date"
              value={customEnd || ''}
              onChange={(e) => onCustomDatesChange(customStart, e.target.value)}
              className="bg-transparent border-none text-slate-700 dark:text-slate-300 outline-none text-xs font-medium focus:ring-0 p-0 cursor-pointer ml-1"
            />
          </div>
        </div>
      )}
    </div>
  );
});

AnalyticsFilters.displayName = 'AnalyticsFilters';
export default AnalyticsFilters;

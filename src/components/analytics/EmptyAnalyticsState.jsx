import { memo } from 'react';
import { BarChart3 } from 'lucide-react';

const EmptyAnalyticsState = memo(({ onAddLead }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-24 px-6 text-center">
    <div className="w-20 h-20 rounded-3xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center mb-6 shadow-md dark:shadow-lg dark:shadow-blue-500/10">
      <BarChart3 className="w-10 h-10 text-blue-600 dark:text-blue-400" />
    </div>
    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
      No analytics available yet
    </h3>
    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-xs leading-relaxed">
      Add your first lead to start tracking business performance.
    </p>
    {onAddLead && (
      <button
        onClick={onAddLead}
        className="mt-6 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all duration-200 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 cursor-pointer"
      >
        Add Lead
      </button>
    )}
  </div>
));

EmptyAnalyticsState.displayName = 'EmptyAnalyticsState';
export default EmptyAnalyticsState;

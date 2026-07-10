import { memo } from 'react';
import { Search, Plus, RotateCcw } from 'lucide-react';

/**
 * EmptyState component: Renders feedback layouts for empty database or empty search results.
 * 
 * @component
 * @param {Object} props - The component properties.
 * @param {number} props.totalLeadsCount - The total number of leads in the system database.
 * @param {function} props.onClearFilters - Callback to clear active search and status filters.
 * @param {function} props.onAddLead - Callback to trigger the "Add New Lead" modal creation form.
 * @returns {React.JSX.Element} The styled empty state element.
 */
const EmptyState = memo(({ totalLeadsCount, onClearFilters, onAddLead }) => {
  const isPipelineEmpty = totalLeadsCount === 0;

  return (
    <div className="w-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-3xl p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-90 relative overflow-hidden transition-colors duration-200">
      {/* Glow highlight effects in the background */}
      <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-blue-600/5 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none"></div>

      {/* Warning/Search Icon Circle Container */}
      <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center mb-6 shadow-sm transition-colors duration-200">
        <Search className="w-6 h-6 text-slate-400 dark:text-slate-500" />
      </div>

      {isPipelineEmpty ? (
        <>
          {/* CASE 1: CRM database is completely empty */}
          <h3 className="text-slate-950 dark:text-white font-extrabold text-lg mb-2 tracking-tight transition-colors duration-200">Your Sales Pipeline is Empty</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto leading-relaxed mb-8 transition-colors duration-200">
            There are no lead entries registered in your startup CRM database. Let's add your first lead to start tracking conversions.
          </p>
          
          {/* CTA: Create lead button */}
          <button
            onClick={onAddLead}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-500/10 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Lead</span>
          </button>
        </>
      ) : (
        <>
          {/* CASE 2: Leads exist, but search or status filters eliminated all matches */}
          <h3 className="text-slate-950 dark:text-white font-extrabold text-lg mb-2 tracking-tight transition-colors duration-200">No Leads Found</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto leading-relaxed mb-8 transition-colors duration-200">
            We couldn't find any leads matching your active search query or status filter. Try resetting your search query or status filters.
          </p>
          
          {/* CTA: Reset filters button */}
          <button
            onClick={onClearFilters}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800/80 dark:text-slate-300 font-semibold text-sm transition-all duration-300 border border-slate-200/60 dark:border-slate-700 active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-500 dark:text-slate-450" />
            <span>Clear Search & Filters</span>
          </button>
        </>
      )}
    </div>
  );
});

EmptyState.displayName = 'EmptyState';
export default EmptyState;

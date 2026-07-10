import { memo } from 'react';
import { Plus, Users, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * QuickActions component displays a list of standard CTA operations
 * for quick database modifications, list views, or spreadsheet exporting.
 *
 * @component
 * @returns {React.JSX.Element} The rendered quick actions card container.
 */
const QuickActions = memo(() => {
  const navigate = useNavigate();

  /**
   * Navigates to the Lead Management page.
   * Used by both "Add New Lead" and "View All Leads" actions.
   */
  const handleGoToLeads = () => navigate('/leads');

  /**
   * Handles CSV export of CRM data.
   * Placeholder implementation — integrates with export utility in Phase 8.
   */
  const handleExportData = () => {
    console.warn('[QuickActions] Export Data: integration pending Phase 8.');
  };

  return (
    <div className="bg-white border border-slate-200/80 dark:bg-slate-800 dark:border-slate-700 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-full transition-colors duration-200">
      {/* Title Header */}
      <div className="mb-5">
        <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-wide transition-colors duration-200">
          Quick Controls
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-normal transition-colors duration-200">
          Common shortcuts to speed up your sales operations workflow.
        </p>
      </div>

      {/* Button Group Actions */}
      <div className="flex flex-col sm:flex-row lg:flex-col gap-3 my-2">
        {/* Action 1: Add New Lead */}
        <button
          onClick={handleGoToLeads}
          aria-label="Go to Lead Management to add a new lead"
          className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all duration-300 shadow-md shadow-blue-600/10 active:scale-[0.98] w-full cursor-pointer min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Lead</span>
        </button>

        {/* Action 2: View All Leads */}
        <button
          onClick={handleGoToLeads}
          aria-label="Navigate to Lead Management page"
          className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-100 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 dark:hover:border-slate-600 font-semibold text-sm transition-all duration-300 active:scale-[0.98] w-full cursor-pointer min-h-[44px]"
        >
          <Users className="w-4 h-4" />
          <span>View All Leads</span>
        </button>

        {/* Action 3: Export Data */}
        <button
          onClick={handleExportData}
          aria-label="Export CRM database to CSV"
          className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-100 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 dark:hover:border-slate-600 font-semibold text-sm transition-all duration-300 active:scale-[0.98] w-full cursor-pointer min-h-[44px]"
        >
          <Download className="w-4 h-4" />
          <span>Export Database</span>
        </button>
      </div>
    </div>
  );
});

QuickActions.displayName = 'QuickActions';
export default QuickActions;

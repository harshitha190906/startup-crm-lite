import { memo, useMemo } from 'react';

// Statuses config is static — defined outside the component to avoid re-allocation on every render
const PIPELINE_STATUSES = [
  { name: 'New',       bgClass: 'bg-blue-600',   dotClass: 'bg-blue-600'   },
  { name: 'Contacted', bgClass: 'bg-amber-500',  dotClass: 'bg-amber-500'  },
  { name: 'Proposal',  bgClass: 'bg-indigo-500', dotClass: 'bg-indigo-500' },
  { name: 'Won',       bgClass: 'bg-green-500',  dotClass: 'bg-green-500'  },
  { name: 'Lost',      bgClass: 'bg-red-500',    dotClass: 'bg-red-500'    },
];

/**
 * PipelineOverview component renders a proportional segmented horizontal progress bar
 * representing the distribution of leads across different pipeline stages (statuses).
 *
 * @component
 * @param {Object} props - The component properties.
 * @param {Array<Object>} props.leads - Array of lead objects representing the CRM database.
 * @param {string} props.leads[].status - The status of the lead (e.g., 'New', 'Contacted', 'Proposal', 'Won', 'Lost').
 * @returns {React.JSX.Element} The rendered pipeline overview card.
 */
const PipelineOverview = memo(({ leads }) => {
  // Memoize the distribution calculation to avoid recomputing on every parent render
  const distribution = useMemo(() => {
    const totalLeads = leads.length;
    return PIPELINE_STATUSES.map((status) => {
      const count = leads.filter(
        (lead) => lead.status.toLowerCase() === status.name.toLowerCase()
      ).length;
      const percentage = totalLeads > 0 ? (count / totalLeads) * 100 : 0;
      return {
        ...status,
        count,
        percentage: Math.round(percentage * 10) / 10, // Round to one decimal place
      };
    });
  }, [leads]);

  const totalLeads = leads.length;

  return (
    <div className="bg-white border border-slate-200/80 dark:bg-slate-800 dark:border-slate-750 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-full transition-colors duration-200">
      {/* Title Header */}
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-wide transition-colors duration-200">Deal Pipeline Overview</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-normal transition-colors duration-200">Visual representation of stage conversion and lead volume.</p>
      </div>

      {/* Segmented Horizontal Bar */}
      <div className="w-full h-4 bg-slate-100 dark:bg-slate-900 rounded-full flex overflow-hidden my-6 shadow-inner border border-slate-200/50 dark:border-slate-800/60 transition-all duration-200">
        {totalLeads === 0 ? (
          // Fallback view when no lead data exists
          <div className="w-full h-full bg-slate-200 dark:bg-slate-700 text-center text-[10px] text-slate-400 dark:text-slate-500 flex items-center justify-center font-medium transition-colors duration-200">
            No Leads Active
          </div>
        ) : (
          // Render each segmented block based on calculated percentage
          distribution.map((stage) => {
            if (stage.count === 0) return null;
            return (
              <div
                key={stage.name}
                className={`${stage.bgClass} h-full transition-all duration-500 hover:brightness-95`}
                style={{ width: `${stage.percentage}%` }}
                title={`${stage.name}: ${stage.count} leads (${stage.percentage}%)`}
              />
            );
          })
        )}
      </div>

      {/* Legend & Count Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-2">
        {distribution.map((stage) => (
          <div key={stage.name} className="flex flex-col gap-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 transition-colors duration-200">
            {/* Color Dot + Name */}
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${stage.dotClass}`}></span>
              <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 transition-colors duration-200">{stage.name}</span>
            </div>
            {/* Lead metrics (count & ratio) */}
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 transition-colors duration-200">{stage.count}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 transition-colors duration-200">({stage.percentage}%)</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
});

PipelineOverview.displayName = 'PipelineOverview';
export default PipelineOverview;

import { memo, useMemo, useCallback } from 'react';
import { FILTER_STATUSES } from '../../constants/crm';

/**
 * FilterBar component: Displays a responsive, scrollable list of status filter buttons.
 * Renders dynamic lead counts in parentheses based on the current lead database.
 *
 * @component
 * @param {Object} props - The component properties.
 * @param {string} props.activeFilter - The currently selected status filter.
 * @param {function} props.onFilterChange - Callback triggered when a status button is clicked.
 * @param {Array<Object>} props.leads - The raw leads array used to calculate counts.
 * @returns {React.JSX.Element} The styled horizontal filter buttons row.
 */
const FilterBar = memo(({ activeFilter, onFilterChange, leads = [] }) => {
  // Memoize per-status lead counts so they only recompute when leads change
  const counts = useMemo(() => {
    const countsMap = { All: leads.length };
    FILTER_STATUSES.forEach((status) => {
      if (status !== 'All') {
        countsMap[status] = leads.filter((lead) => lead.status === status).length;
      }
    });
    return countsMap;
  }, [leads]);

  // Stable click handler — avoids creating a new arrow fn per-button per-render
  const handleClick = useCallback(
    (status) => onFilterChange(status),
    [onFilterChange]
  );

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-1" role="group" aria-label="Filter leads by status">
      <div className="flex gap-2 min-w-max pb-1.5">
        {FILTER_STATUSES.map((status) => {
          const isActive = activeFilter === status;
          const count = counts[status] ?? 0;

          return (
            <button
              key={status}
              onClick={() => handleClick(status)}
              aria-pressed={isActive}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 cursor-pointer min-h-[44px] ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/15 scale-[1.01]'
                  : 'bg-white border border-slate-200/85 text-slate-600 hover:text-slate-800 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white dark:hover:border-slate-650'
              }`}
            >
              <span>{status}</span>
              <span
                className={`ml-1.5 text-xs font-bold transition-colors ${
                  isActive ? 'text-blue-100 dark:text-blue-200' : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                ({count})
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
});

FilterBar.displayName = 'FilterBar';
export default FilterBar;

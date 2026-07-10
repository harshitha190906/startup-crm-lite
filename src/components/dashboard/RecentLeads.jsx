import { memo, useMemo } from 'react';
import StatusBadge from '../leads/StatusBadge';

/**
 * RecentLeads component displays the 5 most recently created leads in a structured tabular format.
 *
 * @component
 * @param {Object} props - The component properties.
 * @param {Array<Object>} props.leads - Array of lead objects from the CRM database.
 * @returns {React.JSX.Element} The rendered recent leads table card.
 */
const RecentLeads = memo(({ leads }) => {
  // Sort leads by createdAt descending, then take the first 5 records
  const recentLeads = useMemo(() => {
    return [...leads]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [leads]);

  return (
    <div className="bg-white border border-slate-200/80 dark:bg-slate-800 dark:border-slate-750 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-full transition-colors duration-200 font-sans">
      {/* Title Panel */}
      <div className="mb-5">
        <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-wide transition-colors duration-200">Recent Lead Acquisitions</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-normal transition-colors duration-200">Overview of the last 5 leads added to your pipeline.</p>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto -mx-6">
        <div className="inline-block min-w-full align-middle px-6">
          <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-700/60">
            {/* Table Headings */}
            <thead>
              <tr>
                <th scope="col" className="py-3 text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider transition-colors duration-200">Name</th>
                <th scope="col" className="py-3 text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider transition-colors duration-200">Company</th>
                <th scope="col" className="py-3 text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider transition-colors duration-200">Status</th>
                <th scope="col" className="py-3 text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider transition-colors duration-200">Date Added</th>
              </tr>
            </thead>
            {/* Table Records */}
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {recentLeads.length === 0 ? (
                // Empty state row helper
                <tr>
                  <td colSpan={4} className="py-8 text-center text-sm text-slate-400 dark:text-slate-500 font-medium transition-colors duration-200">
                    No recent leads found.
                  </td>
                </tr>
              ) : (
                recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/35 transition-colors">
                    {/* Lead Contact Name */}
                    <td className="py-3.5 whitespace-nowrap text-sm font-semibold text-slate-950 dark:text-white transition-colors duration-200">
                       {lead.name}
                    </td>
                    {/* Associated Company */}
                    <td className="py-3.5 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 font-medium transition-colors duration-200">
                       {lead.company}
                    </td>
                    {/* Status Badge */}
                    <td className="py-3.5 whitespace-nowrap">
                      <StatusBadge status={lead.status} />
                    </td>
                    {/* Acquisition Date */}
                    <td className="py-3.5 whitespace-nowrap text-xs text-slate-400 dark:text-slate-500 font-medium transition-colors duration-200">
                      {new Date(lead.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
});

RecentLeads.displayName = 'RecentLeads';
export default RecentLeads;

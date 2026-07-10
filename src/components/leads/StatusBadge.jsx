

import { memo } from 'react';

/**
 * StatusBadge component renders a styled pill badge representing a lead's pipeline stage.
 *
 * @component
 * @param {Object} props - The component properties.
 * @param {string} props.status - The status value (e.g. 'New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost').
 * @returns {React.JSX.Element} The colored status pill.
 */
const StatusBadge = memo(({ status }) => {
  // Normalize the status string to handle casing variations safely
  const normalizedStatus = status ? status.trim().toLowerCase() : '';

  /**
   * Helper function to match status strings to precise Tailwind color utility classes.
   * Keeps consistent with light theme and accessibility colors.
   */
  const getBadgeClasses = () => {
    switch (normalizedStatus) {
      case 'new':
        return 'bg-slate-100 text-slate-700 border-slate-200/80 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
      case 'contacted':
        return 'bg-amber-50 text-amber-800 border-amber-200/80 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30';
      case 'meeting scheduled':
        return 'bg-purple-50 text-purple-800 border-purple-200/80 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/30';
      case 'proposal sent':
        return 'bg-blue-50 text-blue-800 border-blue-200/80 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30';
      case 'won':
        return 'bg-green-50 text-green-800 border-green-200/80 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20';
      case 'lost':
        return 'bg-red-50 text-red-800 border-red-200/80 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200/80 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
    }
  };

  return (
    <span
      className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getBadgeClasses()}`}
    >
      {status}
    </span>
  );
});

StatusBadge.displayName = 'StatusBadge';
export default StatusBadge;

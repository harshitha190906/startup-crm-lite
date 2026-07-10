
import { memo } from 'react';
import { Mail, Phone, Edit2, Trash2, Building2 } from 'lucide-react'; // Import layout icons from Lucide React
import StatusBadge from './StatusBadge'; // Import color-coded StatusBadge component

/**
 * LeadCard component displays lead details inside a standalone styled grid card.
 * Typically rendered in mobile stacks or grid arrangements.
 *
 * @component
 * @param {Object} props - The component properties.
 * @param {Object} props.lead - The lead object to render.
 * @param {string|number} props.lead.id - Unique ID of the lead.
 * @param {string} props.lead.name - Full name.
 * @param {string} props.lead.company - Company name.
 * @param {string} props.lead.status - Status string.
 * @param {string} props.lead.email - Email address.
 * @param {string} [props.lead.phone] - Optional phone contact.
 * @param {function} props.onEdit - Edit action handler callback.
 * @param {function} props.onDelete - Delete action handler callback.
 * @returns {React.JSX.Element} The rendered lead card component.
 */
const LeadCard = memo(({ lead, onEdit, onDelete }) => {
  return (
    <div className="bg-white border border-slate-200/80 dark:bg-slate-800 dark:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden group">
      
      {/* Decorative top-side accent gradient bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-700 group-hover:bg-blue-600 transition-colors duration-350"></div>

      <div>
        {/* Upper Header: Name and Status badge */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="overflow-hidden">
            <h4 className="font-bold text-base text-slate-900 dark:text-white truncate tracking-wide transition-colors duration-200" title={lead.name}>
              {lead.name}
            </h4>
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mt-1 transition-colors duration-200">
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              <span className="text-xs font-semibold truncate" title={lead.company}>
                {lead.company}
              </span>
            </div>
          </div>
          {/* Status Badge integration */}
          <div className="shrink-0">
            <StatusBadge status={lead.status} />
          </div>
        </div>

        {/* Contact Info Section */}
        <div className="space-y-2 py-3 border-t border-slate-100/80 dark:border-slate-700/60 transition-colors duration-200">
          {/* Email row */}
          <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-350 select-all transition-colors duration-200" title={lead.email}>
            <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
            <span className="text-xs font-medium truncate">{lead.email}</span>
          </div>

          {/* Phone row */}
          {lead.phone ? (
            <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300 select-all transition-colors duration-200" title={lead.phone}>
              <Phone className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
              <span className="text-xs font-medium truncate">{lead.phone}</span>
            </div>
          ) : (
            // Placeholder text if phone is omitted
            <div className="flex items-center gap-2.5 text-slate-400 dark:text-slate-500 italic transition-colors duration-200">
              <Phone className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
              <span className="text-xs">No phone provided</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer controls: Edit & Delete buttons */}
      <div className="flex items-center justify-end gap-2.5 pt-3.5 mt-2 border-t border-slate-100/80 dark:border-slate-700/60 transition-colors duration-200">
        {/* Pencil edit button */}
        <button
          onClick={() => onEdit(lead)}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-50 dark:hover:text-white dark:hover:bg-slate-700 border border-transparent hover:border-slate-200 dark:hover:border-slate-600 transition-all active:scale-95 cursor-pointer"
          title="Edit Lead"
          aria-label={`Edit ${lead.name}`}
        >
          <Edit2 className="w-4 h-4" />
        </button>
        {/* Trash delete button */}
        <button
          onClick={() => onDelete(lead.id)}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-950/20 border border-transparent hover:border-red-100 dark:hover:border-red-900/30 transition-all active:scale-95 cursor-pointer"
          title="Delete Lead"
          aria-label={`Delete ${lead.name}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
});

LeadCard.displayName = 'LeadCard';
export default LeadCard;

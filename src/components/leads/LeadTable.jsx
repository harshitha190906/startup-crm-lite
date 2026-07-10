import { memo, useState } from 'react';
import { Table, LayoutGrid, Edit2, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';
import LeadCard from './LeadCard';

/**
 * LeadTable component handles the collection rendering for CRM leads.
 *
 * Responsive behaviour (mobile-first):
 *   Mobile  (< md)  → card grid only, no toggle shown
 *   Tablet  (md–lg) → toggle between card grid and table view
 *   Desktop (≥ lg)  → table view only, no toggle shown
 *
 * @component
 * @param {Object}   props          - The component properties.
 * @param {Array}    props.leads    - List of lead records to render.
 * @param {function} props.onEdit   - Edit lead trigger callback.
 * @param {function} props.onDelete - Delete lead trigger callback.
 * @returns {React.JSX.Element} The rendered lead list layout.
 */
const LeadTable = memo(({ leads, onEdit, onDelete }) => {
  /**
   * viewMode is only relevant at the tablet breakpoint (md–lg).
   * On mobile it is ignored (cards always shown).
   * On desktop it is ignored (table always shown).
   * Default to 'table' so tablets open in table mode by default.
   */
  const [viewMode, setViewMode] = useState('table');

  return (
    <div className="w-full space-y-4">

      {/* ── Header bar: lead count + tablet view toggle ─────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between
                      bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700
                      p-4 rounded-2xl shadow-sm transition-colors duration-200">

        <span className="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-wide transition-colors duration-200">
          Showing {leads.length} {leads.length === 1 ? 'Lead' : 'Leads'}
        </span>

        {/*
          View-mode toggle — only rendered on tablet (md → visible, lg → hidden).
          Mobile never sees it (it's `hidden md:flex`).
          Desktop never sees it (it's `lg:hidden`).
        */}
        <div
          className="hidden md:flex lg:hidden bg-slate-100 dark:bg-slate-900 p-1 rounded-xl
                     border border-slate-200/60 dark:border-slate-800/85 transition-colors duration-200"
          role="tablist"
          aria-label="Switch between table and card view"
        >
          <button
            onClick={() => setViewMode('table')}
            role="tab"
            aria-selected={viewMode === 'table'}
            aria-label="Table View"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold
                        transition-all cursor-pointer min-h-[44px] ${
              viewMode === 'table'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200/40 dark:border-slate-700'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Table className="w-4 h-4" />
            <span>Table</span>
          </button>

          <button
            onClick={() => setViewMode('card')}
            role="tab"
            aria-selected={viewMode === 'card'}
            aria-label="Card Grid View"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold
                        transition-all cursor-pointer min-h-[44px] ${
              viewMode === 'card'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200/40 dark:border-slate-700'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Cards</span>
          </button>
        </div>
      </div>

      {/* ── Collections ──────────────────────────────────────────────────────── */}
      {leads.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700
                        rounded-2xl p-12 text-center shadow-sm transition-colors duration-200">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100
                          dark:border-slate-800 flex items-center justify-center mx-auto mb-4 transition-colors duration-200">
            <Table className="w-6 h-6 text-slate-400 dark:text-slate-500" />
          </div>
          <h4 className="text-slate-800 dark:text-white font-bold text-base mb-1 transition-colors duration-200">
            No Leads Found
          </h4>
          <p className="text-slate-400 dark:text-slate-500 text-xs max-w-xs mx-auto leading-relaxed transition-colors duration-200">
            Get started by clicking the "Add New Lead" button to populate your CRM pipeline.
          </p>
        </div>
      ) : (
        <>
          {/*
            ── TABLE VIEW ───────────────────────────────────────────────────────
            Visibility rules (mobile-first):
              - Mobile (< md):  hidden  → cards shown instead
              - Tablet (md–lg): shown only when viewMode === 'table'
              - Desktop (≥ lg): always shown
          */}
          <div className={`
            bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700
            rounded-2xl overflow-hidden shadow-sm transition-colors duration-200
            hidden
            lg:block
            ${viewMode === 'table' ? 'md:block' : 'md:hidden'}
          `}>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200/80 dark:border-slate-700 bg-slate-50
                                 dark:bg-slate-900/60 transition-colors duration-200">
                    <th scope="col" className="py-4 px-6 text-xs font-bold text-slate-400
                                               dark:text-slate-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="py-4 px-6 text-xs font-bold text-slate-400
                                               dark:text-slate-500 uppercase tracking-wider">Company</th>
                    <th scope="col" className="py-4 px-6 text-xs font-bold text-slate-400
                                               dark:text-slate-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="py-4 px-6 text-xs font-bold text-slate-400
                                               dark:text-slate-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="hidden xl:table-cell py-4 px-6 text-xs font-bold
                                               text-slate-400 dark:text-slate-500 uppercase tracking-wider">Source</th>
                    <th scope="col" className="hidden xl:table-cell py-4 px-6 text-xs font-bold
                                               text-slate-400 dark:text-slate-500 uppercase tracking-wider">Date Added</th>
                    <th scope="col" className="py-4 px-6 text-xs font-bold text-slate-400
                                               dark:text-slate-500 uppercase tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-50/40 dark:hover:bg-slate-900/30 transition-colors"
                    >
                      <td className="py-4 px-6 whitespace-nowrap text-sm font-bold
                                     text-slate-900 dark:text-white transition-colors duration-200">
                        {lead.name}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-slate-500
                                     dark:text-slate-400 font-semibold transition-colors duration-200">
                        {lead.company}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <StatusBadge status={lead.status} />
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-slate-600
                                     dark:text-slate-300 font-medium select-all transition-colors duration-200">
                        {lead.email}
                      </td>
                      <td className="hidden xl:table-cell py-4 px-6 whitespace-nowrap text-xs
                                     text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider
                                     transition-colors duration-200">
                        {lead.source}
                      </td>
                      <td className="hidden xl:table-cell py-4 px-6 whitespace-nowrap text-xs
                                     text-slate-400 dark:text-slate-500 font-semibold transition-colors duration-200">
                        {new Date(lead.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onEdit(lead)}
                            className="p-2 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white
                                       hover:bg-slate-50 dark:hover:bg-slate-700 border border-transparent
                                       transition-colors active:scale-95 cursor-pointer
                                       min-h-[44px] min-w-[44px] flex items-center justify-center"
                            aria-label={`Edit ${lead.name}`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDelete(lead.id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50
                                       dark:hover:text-red-400 dark:hover:bg-red-950/30 border border-transparent
                                       transition-colors active:scale-95 cursor-pointer
                                       min-h-[44px] min-w-[44px] flex items-center justify-center"
                            aria-label={`Delete ${lead.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/*
            ── CARD GRID ────────────────────────────────────────────────────────
            Visibility rules (mobile-first):
              - Mobile (< md):  always shown  (grid, 1 col)
              - Tablet (md–lg): shown only when viewMode === 'card'
              - Desktop (≥ lg): always hidden
          */}
          <div className={`
            grid grid-cols-1 sm:grid-cols-2 gap-4
            lg:hidden
            ${viewMode === 'card' ? 'md:grid' : 'md:hidden'}
          `}>
            {leads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </>
      )}

    </div>
  );
});

LeadTable.displayName = 'LeadTable';
export default LeadTable;

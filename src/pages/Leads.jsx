import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, X } from 'lucide-react'; // Import icons from Lucide React
import toast, { Toaster } from 'react-hot-toast'; // Import Toast indicators for notifications
import LeadTable from '../components/leads/LeadTable'; // Import LeadTable component which handles view toggles
import LeadForm from '../components/leads/LeadForm'; // Import LeadForm modal content
import SearchBar from '../components/common/SearchBar'; // Import SearchBar component
import FilterBar from '../components/common/FilterBar'; // Import FilterBar component
import EmptyState from '../components/common/EmptyState'; // Import EmptyState component
import { useLeads } from '../context/LeadContext'; // Consume the centralized Leads Context hook

/**
 * Leads Page component: Main container for managing leads CRUD state, search, and category filtering.
 * Refactored to leverage the global LeadContext state architecture.
 *
 * @component
 * @returns {React.JSX.Element} The assembled leads management route view.
 */
const Leads = () => {
  // Consume leads database array and core CRUD operations from global context
  const { leads, addLead, updateLead, deleteLead } = useLeads();

  // Search query string state
  const [searchQuery, setSearchQuery] = useState('');

  // Active status filter state (defaults to 'All')
  const [activeFilter, setActiveFilter] = useState('All');

  // Modal display toggler
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Track currently selected lead during editing (null implies CREATE mode)
  const [selectedLead, setSelectedLead] = useState(null);

  // Safely close the modal and empty selected state
  const handleCloseFormModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedLead(null);
  }, []);

  // Close modal when Escape key is pressed (Keyboard Accessibility)
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        handleCloseFormModal();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [handleCloseFormModal]);

  // Open modal in CREATE mode
  const handleOpenCreateModal = useCallback(() => {
    setSelectedLead(null);
    setIsModalOpen(true);
  }, []);

  // Open modal in EDIT mode
  const handleOpenEditModal = useCallback((lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  }, []);

  // Process addition or updates from LeadForm onSubmit triggers
  const handleFormSubmit = useCallback((data) => {
    if (selectedLead) {
      // UPDATE Mode: Call centralized context function
      updateLead(selectedLead.id, data);
      
      // Trigger success green toast
      toast.success(`Updated lead "${data.name}" successfully!`, {
        iconTheme: {
          primary: '#22C55E', // Green theme colors
        },
      });
    } else {
      // CREATE Mode: Call centralized context function
      addLead(data);
      
      // Trigger success green toast
      toast.success(`Created new lead "${data.name}" successfully!`, {
        iconTheme: {
          primary: '#22C55E',
        },
      });
    }
    // Close modal form
    handleCloseFormModal();
  }, [selectedLead, updateLead, addLead, handleCloseFormModal]);

  // Delete lead handler
  const handleDeleteLead = useCallback((id) => {
    const leadToDelete = leads.find((item) => item.id === id);
    if (leadToDelete) {
      deleteLead(id); // Call centralized context function
      
      // Trigger red error toast for deletion indicator
      toast.error(`Deleted lead "${leadToDelete.name}" successfully.`, {
        iconTheme: {
          primary: '#EF4444', // Red theme danger color
        },
      });
    }
  }, [leads, deleteLead]);

  // Clears all active filters (search query and status category)
  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setActiveFilter('All');
  }, []);

  // Derived state: Filtered leads based on status category and search query matches
  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => activeFilter === 'All' || lead.status === activeFilter)
      .filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [leads, activeFilter, searchQuery]);

  return (
    // Content Layout Container: mobile-first padding
    <div className="p-4 md:p-8 text-slate-800 dark:text-slate-100 transition-colors duration-200 font-sans relative">
      
      {/* react-hot-toast notifier container */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Control bar: Search, Add Lead CTA, and dynamic status filters */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          {/* CREATE Button Trigger */}
          <button
            onClick={handleOpenCreateModal}
            className="flex w-full sm:w-auto items-center justify-center gap-2 min-h-11 px-4.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all duration-300 shadow-md shadow-blue-500/10 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Lead</span>
          </button>
        </div>
        <FilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          leads={leads}
        />
      </div>

      {/* Lead List/Grid Collection Section */}
      <main className="w-full">
        {filteredLeads.length === 0 ? (
          <EmptyState
            totalLeadsCount={leads.length}
            onClearFilters={handleClearFilters}
            onAddLead={handleOpenCreateModal}
          />
        ) : (
          <LeadTable
            leads={filteredLeads}
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteLead}
          />
        )}
      </main>

      {/* Modal Dialog: Overlay background with centered form card */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center md:items-center md:p-4 bg-slate-900/60 dark:bg-slate-950/70 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Modal Box: full-screen on mobile, centered modal with rounded corners on tablet+ */}
          <div className="bg-white dark:bg-slate-800 w-full h-full md:h-auto md:max-w-lg md:rounded-3xl md:border md:border-slate-200 dark:md:border-slate-700 shadow-2xl p-6 relative overflow-y-auto animate-slide-up transition-colors duration-200">
            {/* Header section of modal */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-700">
              <h2 id="modal-title" className="text-lg font-bold text-slate-900 dark:text-white transition-colors duration-200">
                {selectedLead ? 'Edit Lead Details' : 'Add New CRM Lead'}
              </h2>
              {/* Dismiss button */}
              <button
                onClick={handleCloseFormModal}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form — key forces remount when selectedLead changes,
                so the lazy useState initializer in LeadForm always picks up
                the correct initialData (fixes stale-state in edit mode). */}
            <LeadForm
              key={selectedLead?.id ?? 'new'}
              initialData={selectedLead}
              onSubmit={handleFormSubmit}
              onCancel={handleCloseFormModal}
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default Leads;

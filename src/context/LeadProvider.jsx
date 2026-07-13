import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { leadService } from '../services/leadService.js';
import { LeadContext } from './LeadContext.jsx';
import { useAuth } from './AuthContext.jsx';

// ---------------------------------------------------------------------------
// src/context/LeadProvider.jsx  (rewritten — backend-connected version)
//
// Replaces the old useLocalStorage implementation with real API calls.
// The context value shape is intentionally kept backward-compatible with
// all existing components (Dashboard, Leads, Analytics) so nothing breaks.
//
// Key design decisions:
//   • leads array now comes from the API, not localStorage.
//   • isLoading tracks in-flight requests so components can show spinners.
//   • pagination carries { total, page, limit, pages } from paginatedResponse.
//   • fetchLeads(params) is exposed so pages can re-query with different filters.
//   • addLead / updateLead / deleteLead optimistically reflect changes locally
//     after the server confirms success, then show a toast.
// ---------------------------------------------------------------------------

/**
 * LeadProvider — wraps the app tree and owns all lead state.
 *
 * @param {{ children: React.ReactNode }} props
 */
export const LeadProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  // ── State ─────────────────────────────────────────────────────────────────
  const [leads,      setLeads]      = useState([]);
  const [isLoading,  setIsLoading]  = useState(false);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, pages: 0 });

  // ── Fetch ─────────────────────────────────────────────────────────────────

  /**
   * Load leads from the API with optional filter / pagination params.
   * Called on mount by consuming pages and whenever filters change.
   *
   * @param {{ status?: string, search?: string, page?: number, limit?: number, sortBy?: string, sortOrder?: string }} [params={}]
   */
  const fetchLeads = useCallback(async (params = {}) => {
    setIsLoading(true);
    try {
      const result = await leadService.getLeads(params);
      // result shape: { success, data: [...], pagination: { total, page, limit, pages } }
      setLeads(result.data ?? []);
      if (result.pagination) {
        setPagination(result.pagination);
      }
    } catch (error) {
      const message = error?.response?.data?.message ?? 'Failed to load leads.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Auto-fetch triggers ──────────────────────────────────────────────────
  useEffect(() => {
    if (isAuthenticated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchLeads();
    } else {
      setLeads([]);
    }
  }, [isAuthenticated, fetchLeads]);

  // ── Create ────────────────────────────────────────────────────────────────

  /**
   * Create a new lead via the API and prepend it to the local state.
   *
   * @param {Object} leadData - Lead fields from the form.
   * @returns {Promise<Object>} The created lead document.
   */
  const addLead = useCallback(async (leadData) => {
    try {
      const result = await leadService.createLead(leadData);
      const newLead = result.data.lead;

      // Prepend to local list so it appears at the top immediately
      setLeads((prev) => [newLead, ...prev]);
      setPagination((prev) => ({ ...prev, total: prev.total + 1 }));

      toast.success('Lead created successfully! 🎉');
      return newLead;
    } catch (error) {
      const message = error?.response?.data?.message ?? 'Failed to create lead.';
      toast.error(message);
      throw error; // re-throw so the calling component can reset its loading state
    }
  }, []);

  // ── Update ────────────────────────────────────────────────────────────────

  /**
   * Update an existing lead via the API and reflect the change locally.
   *
   * @param {string} id       - Lead _id (MongoDB ObjectId string).
   * @param {Object} leadData - Fields to update.
   * @returns {Promise<Object>} The updated lead document.
   */
  const updateLead = useCallback(async (id, leadData) => {
    try {
      const result = await leadService.updateLead(id, leadData);
      const updatedLead = result.data.lead;

      // Replace the stale entry in-place
      setLeads((prev) =>
        prev.map((lead) => (lead._id === id ? updatedLead : lead))
      );

      toast.success('Lead updated successfully.');
      return updatedLead;
    } catch (error) {
      const message = error?.response?.data?.message ?? 'Failed to update lead.';
      toast.error(message);
      throw error;
    }
  }, []);

  // ── Status update (lightweight) ───────────────────────────────────────────

  /**
   * Update only the pipeline status of a lead (Kanban / quick actions).
   *
   * @param {string} id     - Lead _id.
   * @param {string} status - New pipeline status value.
   * @returns {Promise<Object>} The updated lead document.
   */
  const updateLeadStatus = useCallback(async (id, status) => {
    try {
      const result = await leadService.updateLeadStatus(id, status);
      const updatedLead = result.data.lead;

      setLeads((prev) =>
        prev.map((lead) => (lead._id === id ? updatedLead : lead))
      );

      toast.success(`Status updated to "${status}".`);
      return updatedLead;
    } catch (error) {
      const message = error?.response?.data?.message ?? 'Failed to update status.';
      toast.error(message);
      throw error;
    }
  }, []);

  // ── Delete ────────────────────────────────────────────────────────────────

  /**
   * Delete a lead via the API and remove it from local state.
   *
   * @param {string} id - Lead _id.
   * @returns {Promise<void>}
   */
  const deleteLead = useCallback(async (id) => {
    try {
      await leadService.deleteLead(id);

      setLeads((prev) => prev.filter((lead) => lead._id !== id));
      setPagination((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));

      toast.success('Lead deleted.');
    } catch (error) {
      const message = error?.response?.data?.message ?? 'Failed to delete lead.';
      toast.error(message);
      throw error;
    }
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────

  /**
   * Look up a lead by its MongoDB _id from the local cache.
   * Avoids an extra API call when the full list is already loaded.
   *
   * @param {string} id
   * @returns {Object|undefined}
   */
  const getLeadById = useCallback((id) => {
    // Support both old string 'id' field and MongoDB '_id'
    return leads.find((lead) => lead._id === id || lead.id === id);
  }, [leads]);

  // ── Context value ─────────────────────────────────────────────────────────

  return (
    <LeadContext.Provider
      value={{
        leads,
        isLoading,
        pagination,
        fetchLeads,
        addLead,
        updateLead,
        updateLeadStatus,
        deleteLead,
        getLeadById,
      }}
    >
      {children}
    </LeadContext.Provider>
  );
};

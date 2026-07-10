import { useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { sampleLeads } from '../data/sampleLeads';
import { LeadContext } from './LeadContext';

// LocalStorage key for leads database persistence
const LOCAL_STORAGE_KEY = 'startup-crm-leads';

/**
 * LeadProvider component: Context provider that wraps the app tree.
 * Manages leads state persistence under 'startup-crm-leads' and exposes CRUD methods.
 *
 * All mutation handlers are wrapped in useCallback to guarantee stable references
 * across renders — prevents unnecessary re-renders of consuming components.
 *
 * @component
 * @param {Object} props - The component properties.
 * @param {React.ReactNode} props.children - Child components to wrap.
 * @returns {React.JSX.Element} The context provider rendering child trees.
 */
export const LeadProvider = ({ children }) => {
  const [leads, setLeads] = useLocalStorage(LOCAL_STORAGE_KEY, sampleLeads);

  /**
   * Adds a new lead to the CRM database.
   * Generates a unique string ID and appends the creation timestamp.
   *
   * @param {Object} leadData - The raw lead fields from the form.
   */
  const addLead = useCallback((leadData) => {
    const uniqueId =
      typeof crypto?.randomUUID === 'function'
        ? crypto.randomUUID()
        : Date.now().toString();

    const newLead = {
      ...leadData,
      id: uniqueId,
      createdAt: new Date().toISOString(),
    };

    setLeads((prevLeads) => [newLead, ...prevLeads]);
  }, [setLeads]);

  /**
   * Updates an existing lead in the CRM database.
   * Preserves the original ID and creation timestamp.
   *
   * @param {string} id - The unique ID of the target lead.
   * @param {Object} updatedData - The modified lead fields.
   */
  const updateLead = useCallback((id, updatedData) => {
    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id === id
          ? { ...lead, ...updatedData, id, createdAt: lead.createdAt }
          : lead
      )
    );
  }, [setLeads]);

  /**
   * Deletes a lead from the CRM database.
   *
   * @param {string} id - The unique ID of the target lead to remove.
   */
  const deleteLead = useCallback((id) => {
    setLeads((prevLeads) => prevLeads.filter((lead) => lead.id !== id));
  }, [setLeads]);

  /**
   * Retrieves a single lead object by its unique ID.
   *
   * @param {string} id - The target lead ID.
   * @returns {Object | undefined} The matching lead object or undefined.
   */
  const getLeadById = useCallback((id) => {
    return leads.find((lead) => lead.id === id);
  }, [leads]);

  return (
    <LeadContext.Provider value={{ leads, addLead, updateLead, deleteLead, getLeadById }}>
      {children}
    </LeadContext.Provider>
  );
};

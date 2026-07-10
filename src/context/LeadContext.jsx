import { createContext, useContext } from 'react';

/**
 * TypeScript-style shape definition of a Lead object:
 * 
 * @typedef {Object} Lead
 * @property {string} id - Unique identifier of the lead contact.
 * @property {string} name - Full name of the lead.
 * @property {string} company - Associated company name.
 * @property {string} email - Primary email address.
 * @property {string} phone - Active telephone contact number.
 * @property {'New' | 'Contacted' | 'Meeting Scheduled' | 'Proposal Sent' | 'Won' | 'Lost'} status - Active pipeline status.
 * @property {'Website' | 'Referral' | 'LinkedIn' | 'Cold Call' | 'Email Campaign' | 'Other'} source - Referral or origin source.
 * @property {string} createdAt - ISO 8601 formatted date string representing creation timestamp.
 */

/**
 * LeadContext: React Context object for managing centralized CRM lead records.
 * Separated from the Provider component to ensure complete Fast Refresh HMR compatibility.
 */
export const LeadContext = createContext(null);

/**
 * Custom hook: useLeads
 * Consumes LeadContext and throws a descriptive runtime error if used outside a LeadProvider.
 * 
 * @returns {Object} Centralized leads state and operational methods.
 * @throws {Error} If consumed outside of a LeadProvider context wrapper.
 */
export const useLeads = () => {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error('useLeads must be consumed within a <LeadProvider> context tree wrapper.');
  }
  return context;
};

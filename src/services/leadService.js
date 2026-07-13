import api from './api.js';

// ---------------------------------------------------------------------------
// src/services/leadService.js
//
// All lead-related API calls.
// Every function unwraps response.data and returns it to the caller.
//
// Lead routes on the backend:
//   GET    /api/leads                → paginated list with filters
//   POST   /api/leads                → create new lead
//   GET    /api/leads/:id            → single lead
//   PUT    /api/leads/:id            → full update
//   PATCH  /api/leads/:id/status     → status-only update
//   DELETE /api/leads/:id            → delete
//   GET    /api/leads/stats          → aggregated stats for Dashboard
//   GET    /api/leads/monthly-stats  → 6-month chart data for Analytics
// ---------------------------------------------------------------------------

/**
 * Fetch a paginated, filtered list of leads.
 *
 * @param {{ status?: string, search?: string, page?: number, limit?: number, sortBy?: string, sortOrder?: string }} [params={}]
 * @returns {Promise<{ success: boolean, data: Array, pagination: Object }>}
 */
const getLeads = async (params = {}) => {
  const response = await api.get('/api/leads', { params });
  return response.data;
};

/**
 * Create a new lead owned by the currently authenticated user.
 *
 * @param {{ name: string, company: string, email: string, phone?: string, status?: string, source?: string, notes?: string }} leadData
 * @returns {Promise<{ success: boolean, data: { lead: Object } }>}
 */
const createLead = async (leadData) => {
  const response = await api.post('/api/leads', leadData);
  return response.data;
};

/**
 * Fetch a single lead by its MongoDB ObjectId.
 *
 * @param {string} id - Lead _id.
 * @returns {Promise<{ success: boolean, data: { lead: Object } }>}
 */
const getLeadById = async (id) => {
  const response = await api.get(`/api/leads/${id}`);
  return response.data;
};

/**
 * Fully update a lead's fields.
 * The owner field is ignored server-side — it cannot be changed.
 *
 * @param {string} id       - Lead _id.
 * @param {Object} leadData - Fields to update.
 * @returns {Promise<{ success: boolean, data: { lead: Object } }>}
 */
const updateLead = async (id, leadData) => {
  const response = await api.put(`/api/leads/${id}`, leadData);
  return response.data;
};

/**
 * Update only the pipeline status of a lead (used by Kanban drag-and-drop).
 *
 * @param {string} id     - Lead _id.
 * @param {string} status - One of the 6 valid status values.
 * @returns {Promise<{ success: boolean, data: { lead: Object } }>}
 */
const updateLeadStatus = async (id, status) => {
  const response = await api.patch(`/api/leads/${id}/status`, { status });
  return response.data;
};

/**
 * Permanently delete a lead.
 *
 * @param {string} id - Lead _id.
 * @returns {Promise<{ success: boolean, message: string }>}
 */
const deleteLead = async (id) => {
  const response = await api.delete(`/api/leads/${id}`);
  return response.data;
};

/**
 * Get aggregated stats for the Dashboard StatsCards.
 *
 * @returns {Promise<{ success: boolean, data: { stats: Object } }>}
 */
const getLeadStats = async () => {
  const response = await api.get('/api/leads/stats/summary');
  return response.data;
};

/**
 * Get per-month lead totals for the last 6 months (Analytics bar chart).
 *
 * @returns {Promise<{ success: boolean, data: { monthlyStats: Array } }>}
 */
const getMonthlyStats = async () => {
  const response = await api.get('/api/leads/stats/monthly');
  return response.data;
};

export const leadService = {
  getLeads,
  createLead,
  getLeadById,
  updateLead,
  updateLeadStatus,
  deleteLead,
  getLeadStats,
  getMonthlyStats,
};
export default leadService;

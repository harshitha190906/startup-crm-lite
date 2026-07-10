/**
 * crm.js — Shared domain constants for Startup CRM Lite.
 *
 * Single source of truth for all status, source, and funnel values.
 * Import from here instead of duplicating arrays across components.
 */

/** All valid lead pipeline statuses (in stage order) */
export const LEAD_STATUSES = [
  'New',
  'Contacted',
  'Meeting Scheduled',
  'Proposal Sent',
  'Won',
  'Lost',
];

/** Status values shown in the filter bar (All + pipeline statuses) */
export const FILTER_STATUSES = ['All', ...LEAD_STATUSES];

/** Lead acquisition source options */
export const LEAD_SOURCES = [
  'Website',
  'Referral',
  'LinkedIn',
  'Cold Call',
  'Email Campaign',
  'Other',
];

/** Ordered pipeline funnel stages (excludes Lost) */
export const FUNNEL_STAGES = [
  'New',
  'Contacted',
  'Meeting Scheduled',
  'Proposal Sent',
  'Won',
];

/** Display label overrides for long status names */
export const STATUS_DISPLAY_LABELS = {
  'Meeting Scheduled': 'Meeting',
  'Proposal Sent': 'Proposal',
};

/** Analytics date range filter options */
export const DATE_RANGES = [
  'Last 7 Days',
  'Last 30 Days',
  'Last 90 Days',
  'This Year',
  'Custom Range',
];

/** Number of days corresponding to each named date range */
export const DATE_RANGE_DAYS = {
  'Last 7 Days': 7,
  'Last 30 Days': 30,
  'Last 90 Days': 90,
  'This Year': 365,
};

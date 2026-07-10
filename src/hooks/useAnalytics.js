/**
 * useAnalytics — Central hook for all analytics computations.
 *
 * Accepts raw leads + active date range string.
 * Returns memoized computed analytics datasets to prevent unnecessary re-renders.
 * Supports 10,000+ leads via efficient memoization.
 */

import { useMemo } from 'react';
import {
  filterLeadsByRange,
  getPipelineMetrics,
  getStatusDistribution,
  getFunnelData,
  getMonthlyLeads,
  getConversionByMonth,
  getRevenueByMonth,
  getLeadSourceStats,
  getSalesVelocity,
  getForecastRevenue,
  getTopPerformers,
  getActivityHeatmapData,
} from '../utils/analyticsHelpers';
import { DATE_RANGE_DAYS } from '../constants/crm';

// ─── Pure helper — defined outside the hook so it never gets re-created ───────

/**
 * Compute a rounded percentage delta between current and previous period values.
 * Returns null when there is no previous data to compare against.
 *
 * @param {number} current
 * @param {number} previous
 * @returns {number | null}
 */
const computeTrend = (current, previous) => {
  if (!previous || previous === 0) return null;
  return Math.round(((current - previous) / previous) * 100);
};

// ─── Hook ──────────────────────────────────────────────────────────────────────

/**
 * @param {Array}  leads           - Raw leads array from useLeads()
 * @param {string} dateRange       - Active date range filter string
 * @param {string} customStartDate - ISO date string for custom range start
 * @param {string} customEndDate   - ISO date string for custom range end
 */
export const useAnalytics = (leads, dateRange = 'All Time', customStartDate = null, customEndDate = null) => {
  // ── 1. Date-filtered leads ─────────────────────────────────────────────────
  const filteredLeads = useMemo(
    () => filterLeadsByRange(leads, dateRange, customStartDate, customEndDate),
    [leads, dateRange, customStartDate, customEndDate]
  );

  // ── 2. Previous period leads (for trend computation) ──────────────────────
  const previousLeads = useMemo(() => {
    if (!leads?.length) return [];

    let periodStart, periodEnd;

    if (dateRange === 'Custom Range' && customStartDate && customEndDate) {
      const start = new Date(customStartDate);
      const end = new Date(customEndDate);
      const durationMs = end.getTime() - start.getTime();
      periodEnd   = new Date(start.getTime());
      periodStart = new Date(start.getTime() - durationMs);
    } else {
      const days = DATE_RANGE_DAYS[dateRange];
      if (!days) return []; // 'All Time' — no previous period

      const now = new Date();
      periodEnd   = new Date(now.getTime() - days * 86_400_000);
      periodStart = new Date(now.getTime() - days * 2 * 86_400_000);
    }

    return leads.filter((l) => {
      if (!l.createdAt) return false;
      const d = new Date(l.createdAt);
      return d >= periodStart && d < periodEnd;
    });
  }, [leads, dateRange, customStartDate, customEndDate]);

  // ── 3. KPI metrics ────────────────────────────────────────────────────────
  const metrics     = useMemo(() => getPipelineMetrics(filteredLeads), [filteredLeads]);
  const prevMetrics = useMemo(() => getPipelineMetrics(previousLeads), [previousLeads]);

  // ── 4. Chart datasets ─────────────────────────────────────────────────────
  const statusDistribution = useMemo(() => getStatusDistribution(filteredLeads),  [filteredLeads]);
  const funnelData         = useMemo(() => getFunnelData(filteredLeads),           [filteredLeads]);
  const monthlyLeads       = useMemo(() => getMonthlyLeads(filteredLeads),         [filteredLeads]);
  const conversionByMonth  = useMemo(() => getConversionByMonth(filteredLeads),    [filteredLeads]);
  const revenueByMonth     = useMemo(() => getRevenueByMonth(filteredLeads),       [filteredLeads]);
  const leadSourceStats    = useMemo(() => getLeadSourceStats(filteredLeads),      [filteredLeads]);
  const salesVelocity      = useMemo(() => getSalesVelocity(filteredLeads),        [filteredLeads]);
  const prevSalesVelocity  = useMemo(() => getSalesVelocity(previousLeads),        [previousLeads]);
  const forecastData       = useMemo(() => getForecastRevenue(filteredLeads),      [filteredLeads]);
  const topPerformers      = useMemo(() => getTopPerformers(filteredLeads),        [filteredLeads]);
  const heatmapData        = useMemo(() => getActivityHeatmapData(leads),          [leads]); // Always uses full data for 90-day grid

  // ── 5. Period-over-period trends ──────────────────────────────────────────
  const trends = useMemo(() => {
    if (!previousLeads.length) return {};
    return {
      total:          computeTrend(metrics.rawTotal,          prevMetrics.rawTotal),
      conversionRate: computeTrend(metrics.rawConversionRate, prevMetrics.rawConversionRate),
      pipelineValue:  computeTrend(metrics.rawPipelineValue,  prevMetrics.rawPipelineValue),
      wonRevenue:     computeTrend(metrics.rawWonRevenue,     prevMetrics.rawWonRevenue),
      avgSalesCycle:  computeTrend(metrics.rawAvgSalesCycle,  prevMetrics.rawAvgSalesCycle),
      lostRate:       computeTrend(metrics.rawLostRate,       prevMetrics.rawLostRate),
      salesVelocity:  computeTrend(salesVelocity.velocity,    prevSalesVelocity.velocity),
    };
  }, [metrics, prevMetrics, previousLeads.length, salesVelocity.velocity, prevSalesVelocity.velocity]);

  // ── 6. Derived ────────────────────────────────────────────────────────────
  const isEmpty = filteredLeads.length === 0;

  return {
    filteredLeads,
    metrics,
    trends,
    isEmpty,
    statusDistribution,
    funnelData,
    monthlyLeads,
    conversionByMonth,
    revenueByMonth,
    leadSourceStats,
    salesVelocity,
    forecastData,
    topPerformers,
    heatmapData,
  };
};

export default useAnalytics;

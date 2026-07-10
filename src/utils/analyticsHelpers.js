/**
 * analyticsHelpers.js — Pure analytics computation functions for Startup CRM Lite.
 *
 * All functions:
 *  - Accept a `leads` array (defensive: handles empty/null arrays)
 *  - Return computed data — no hardcoded stubs
 *  - Are memoization-friendly (pure, no side effects)
 *  - Handle missing optional fields (value, wonAt, owner, etc.) gracefully
 *
 * Lead status values: 'New' | 'Contacted' | 'Meeting Scheduled' | 'Proposal Sent' | 'Won' | 'Lost'
 * Lead source values: 'Website' | 'Referral' | 'LinkedIn' | 'Cold Call' | 'Email Campaign' | 'Other'
 */

import { STATUS_COLORS, SOURCE_COLORS, PERFORMER_AVATAR_COLORS } from '../constants/analyticsColors';
import { FUNNEL_STAGES as _FUNNEL_STAGES } from '../constants/crm';

// ─── Internal Helpers ───────────────────────────────────────────────────────

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const ALL_STATUSES = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];
const FUNNEL_STAGES = _FUNNEL_STAGES;
const ALL_SOURCES   = ['LinkedIn', 'Referral', 'Website', 'Cold Call', 'Email Campaign', 'Other'];

/** Format a number as Indian currency string: ₹1,20,000 */
export const formatINR = (value) => {
  if (!value && value !== 0) return '₹0';
  return '₹' + Number(value).toLocaleString('en-IN');
};

/** Get the last N months as { year, month (0-indexed), label } objects, ending at current month */
const getLastNMonths = (n) => {
  const now = new Date();
  const months = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ year: d.getFullYear(), month: d.getMonth(), label: MONTH_LABELS[d.getMonth()] });
  }
  return months;
};

/**
 * Filter leads to a date range based on createdAt.
 * @param {Array} leads
 * @param {string} range - 'Last 7 Days' | 'Last 30 Days' | 'Last 90 Days' | 'This Year' | 'Custom Range' | 'All Time'
 * @param {string} [customStart] - ISO date string or YYYY-MM-DD
 * @param {string} [customEnd] - ISO date string or YYYY-MM-DD
 */
export const filterLeadsByRange = (leads, range, customStart = null, customEnd = null) => {
  if (!leads?.length) return [];
  const now = new Date();
  let cutoff = null;

  switch (range) {
    case 'Last 7 Days':
      cutoff = new Date(now - 7 * 86400000);
      break;
    case 'Last 30 Days':
      cutoff = new Date(now - 30 * 86400000);
      break;
    case 'Last 90 Days':
      cutoff = new Date(now - 90 * 86400000);
      break;
    case 'This Year':
      cutoff = new Date(now.getFullYear(), 0, 1);
      break;
    case 'Custom Range':
      if (customStart && customEnd) {
        const start = new Date(customStart);
        start.setHours(0, 0, 0, 0);
        const end = new Date(customEnd);
        end.setHours(23, 59, 59, 999);
        return leads.filter((l) => {
          if (!l.createdAt) return false;
          const d = new Date(l.createdAt);
          return d >= start && d <= end;
        });
      }
      return leads;
    default:
      return leads; // All Time / Fallback
  }

  return leads.filter((l) => l.createdAt && new Date(l.createdAt) >= cutoff);
};

// ─── KPI Metrics ────────────────────────────────────────────────────────────

/**
 * Compute all 6 KPI card values from a leads array.
 * Returns fully formatted display strings and raw numbers for trend computation.
 */
export const getPipelineMetrics = (leads) => {
  if (!leads?.length) {
    return {
      total: 0,
      conversionRate: '0%',
      pipelineValue: '₹0',
      wonRevenue: '₹0',
      avgSalesCycle: '–',
      lostRate: '0%',
      rawTotal: 0,
      rawConversionRate: 0,
      rawPipelineValue: 0,
      rawWonRevenue: 0,
      rawAvgSalesCycle: 0,
      rawLostRate: 0,
    };
  }

  const total = leads.length;
  const wonLeads  = leads.filter((l) => l.status === 'Won');
  const lostLeads = leads.filter((l) => l.status === 'Lost');
  const activeLeads = leads.filter((l) => l.status !== 'Won' && l.status !== 'Lost');

  const wonCount  = wonLeads.length;
  const lostCount = lostLeads.length;

  const conversionRate = total > 0 ? Math.round((wonCount / total) * 100) : 0;
  const lostRate       = total > 0 ? Math.round((lostCount / total) * 100) : 0;

  const pipelineValue = activeLeads.reduce((sum, l) => sum + (Number(l.value) || 0), 0);
  const wonRevenue    = wonLeads.reduce((sum, l)    => sum + (Number(l.value) || 0), 0);

  // Avg sales cycle: days from createdAt to wonAt for closed-won leads
  const salesCycleDays = wonLeads
    .filter((l) => l.wonAt && l.createdAt)
    .map((l) => Math.round((new Date(l.wonAt) - new Date(l.createdAt)) / 86400000));

  const avgSalesCycle = salesCycleDays.length > 0
    ? Math.round(salesCycleDays.reduce((a, b) => a + b, 0) / salesCycleDays.length)
    : 0;

  return {
    total,
    conversionRate: `${conversionRate}%`,
    pipelineValue: formatINR(pipelineValue),
    wonRevenue: formatINR(wonRevenue),
    avgSalesCycle: avgSalesCycle > 0 ? `${avgSalesCycle} Days` : '–',
    lostRate: `${lostRate}%`,
    // Raw numbers for trend calculations
    rawTotal: total,
    rawConversionRate: conversionRate,
    rawPipelineValue: pipelineValue,
    rawWonRevenue: wonRevenue,
    rawAvgSalesCycle: avgSalesCycle,
    rawLostRate: lostRate,
  };
};

// ─── Status Distribution ─────────────────────────────────────────────────────

export const getStatusDistribution = (leads) => {
  const safe = leads || [];
  const total = safe.length || 1;

  return ALL_STATUSES.map((status) => {
    const count = safe.filter((l) => l.status === status).length;
    return {
      name: status === 'Meeting Scheduled' ? 'Meeting' : status === 'Proposal Sent' ? 'Proposal' : status,
      rawStatus: status,
      value: count,
      color: STATUS_COLORS[status] || '#94A3B8',
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    };
  });
};

// ─── Funnel ──────────────────────────────────────────────────────────────────

export const getFunnelData = (leads) => {
  const safe = leads || [];

  // A lead "has reached" a stage if its status matches that stage OR any later stage
  const stageOrder = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won'];
  const stageIndex = (status) => stageOrder.indexOf(status);

  // Cumulative funnel: count leads that have status at that stage or beyond
  const stageCounts = FUNNEL_STAGES.map((stage, i) => {
    return safe.filter((l) => {
      const idx = stageIndex(l.status);
      // Won is the last stage in funnel
      if (l.status === 'Lost') return false;
      return idx >= i;
    }).length;
  });

  const top = stageCounts[0] || 1;

  return FUNNEL_STAGES.map((stage, i) => {
    const count = stageCounts[i];
    const prev  = i > 0 ? stageCounts[i - 1] : count;
    const convPct = Math.round((count / top) * 100);
    const dropPct = prev > 0 ? Math.round(((prev - count) / prev) * 100) : 0;

    return {
      name: stage === 'Meeting Scheduled' ? 'Meeting' : stage === 'Proposal Sent' ? 'Proposal' : stage,
      count,
      conv: `${convPct}%`,
      drop: i > 0 && dropPct > 0 ? `−${dropPct}%` : null,
      color: STATUS_COLORS[stage] || '#94A3B8',
    };
  });
};

// ─── Monthly Trends ──────────────────────────────────────────────────────────

export const getMonthlyLeads = (leads) => {
  const safe = leads || [];
  const months = getLastNMonths(6);

  return months.map(({ year, month, label }) => {
    const count = safe.filter((l) => {
      if (!l.createdAt) return false;
      const d = new Date(l.createdAt);
      return d.getFullYear() === year && d.getMonth() === month;
    }).length;
    return { month: label, count };
  });
};

export const getConversionByMonth = (leads) => {
  const safe = leads || [];
  const months = getLastNMonths(6);

  return months.map(({ year, month, label }) => {
    const monthLeads = safe.filter((l) => {
      if (!l.createdAt) return false;
      const d = new Date(l.createdAt);
      return d.getFullYear() === year && d.getMonth() === month;
    });
    const wonInMonth = monthLeads.filter((l) => l.status === 'Won').length;
    const rate = monthLeads.length > 0
      ? Math.round((wonInMonth / monthLeads.length) * 100)
      : 0;
    return { month: label, rate };
  });
};

export const getRevenueByMonth = (leads) => {
  const safe = leads || [];
  const months = getLastNMonths(6);

  return months.map(({ year, month, label }) => {
    const revenue = safe
      .filter((l) => {
        if (!l.wonAt || l.status !== 'Won') return false;
        const d = new Date(l.wonAt);
        return d.getFullYear() === year && d.getMonth() === month;
      })
      .reduce((sum, l) => sum + (Number(l.value) || 0), 0);
    return { month: label, revenue };
  });
};

// Alias for backward compatibility with existing RevenueChartCard
export const getRevenueRealization = getRevenueByMonth;

// ─── Pipeline & Revenue ──────────────────────────────────────────────────────

export const getPipelineValue = (leads) => {
  const safe = leads || [];
  return safe
    .filter((l) => l.status !== 'Won' && l.status !== 'Lost')
    .reduce((sum, l) => sum + (Number(l.value) || 0), 0);
};

export const getWonRevenue = (leads) => {
  const safe = leads || [];
  return safe
    .filter((l) => l.status === 'Won')
    .reduce((sum, l) => sum + (Number(l.value) || 0), 0);
};

export const getAverageSalesCycle = (leads) => {
  const safe = leads || [];
  const days = safe
    .filter((l) => l.status === 'Won' && l.wonAt && l.createdAt)
    .map((l) => Math.round((new Date(l.wonAt) - new Date(l.createdAt)) / 86400000));

  if (!days.length) return 0;
  return Math.round(days.reduce((a, b) => a + b, 0) / days.length);
};

export const getLostRate = (leads) => {
  const safe = leads || [];
  if (!safe.length) return 0;
  return Math.round((safe.filter((l) => l.status === 'Lost').length / safe.length) * 100);
};

// ─── Lead Sources ─────────────────────────────────────────────────────────────

export const getLeadSourceStats = (leads) => {
  const safe = leads || [];
  const counts = {};
  ALL_SOURCES.forEach((s) => { counts[s] = 0; });
  safe.forEach((l) => {
    if (l.source && counts[l.source] !== undefined) counts[l.source]++;
    else if (l.source) counts[l.source] = (counts[l.source] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([source, count]) => ({ source, count, color: SOURCE_COLORS[source] || '#64748B' }))
    .filter((d) => d.count > 0)
    .sort((a, b) => b.count - a.count);
};

// Alias for backward compatibility
export const getSourceDistribution = getLeadSourceStats;

// ─── Sales Velocity ──────────────────────────────────────────────────────────

export const getSalesVelocity = (leads) => {
  const safe = leads || [];
  const total = safe.length || 1;
  const wonLeads = safe.filter((l) => l.status === 'Won');
  const wonCount = wonLeads.length || 0;

  const winRate = wonCount / total;
  const avgDealSize = wonCount > 0
    ? wonLeads.reduce((s, l) => s + (Number(l.value) || 0), 0) / wonCount
    : 0;
  const avgCycle = getAverageSalesCycle(safe) || 30;

  const velocity = avgCycle > 0 ? Math.round((total * winRate * avgDealSize) / avgCycle) : 0;

  return {
    velocity,
    velocityFormatted: formatINR(velocity) + '/day',
    total,
    winRate: Math.round(winRate * 100),
    avgDealSize: Math.round(avgDealSize),
    avgDealSizeFormatted: formatINR(Math.round(avgDealSize)),
    avgCycle,
  };
};

// ─── Revenue Forecast ─────────────────────────────────────────────────────────

export const getForecastRevenue = (leads) => {
  const safe = leads || [];
  const monthly = getRevenueByMonth(safe);

  // Use last 3 months of revenue for forecast (trim zeros from the front)
  const nonZero = monthly.filter((m) => m.revenue > 0);
  const recent = nonZero.length >= 3 ? nonZero.slice(-3) : (nonZero.length ? nonZero : monthly);

  const avgRevenue = recent.length > 0
    ? Math.round(recent.reduce((s, m) => s + m.revenue, 0) / recent.length)
    : 0;

  // Simple linear growth trend
  const trend = recent.length >= 2
    ? recent[recent.length - 1].revenue - recent[0].revenue
    : 0;
  const forecast = Math.max(0, avgRevenue + Math.round(trend * 0.3));

  const confidence = Math.min(95, 50 + nonZero.length * 8);

  const growthPct = recent.length >= 2 && recent[0].revenue > 0
    ? Math.round(((recent[recent.length - 1].revenue - recent[0].revenue) / recent[0].revenue) * 100)
    : 0;

  return {
    forecast,
    forecastFormatted: formatINR(forecast),
    confidence,
    growthPct,
    monthlyData: monthly,
  };
};

// ─── Top Performers ──────────────────────────────────────────────────────────

export const getTopPerformers = (leads) => {
  const safe = leads || [];
  const wonLeads = safe.filter((l) => l.status === 'Won');

  // Group by owner
  const byOwner = {};
  wonLeads.forEach((l) => {
    const owner = l.owner || 'Unknown';
    if (!byOwner[owner]) byOwner[owner] = { name: owner, revenue: 0, count: 0 };
    byOwner[owner].revenue += Number(l.value) || 0;
    byOwner[owner].count += 1;
  });

  const sorted = Object.values(byOwner).sort((a, b) => b.revenue - a.revenue);

  return sorted.map((rep, i) => ({
    ...rep,
    rank: i + 1,
    revenueFormatted: formatINR(rep.revenue),
    avatarColor: PERFORMER_AVATAR_COLORS[i % PERFORMER_AVATAR_COLORS.length],
    revenue: formatINR(rep.revenue),
    rawRevenue: rep.revenue,
  }));
};

// ─── Activity Heatmap ─────────────────────────────────────────────────────────

export const getActivityHeatmapData = (leads) => {
  const safe = leads || [];

  // Build 90-day heatmap from today backward
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  // Build a map: dateKey → activity count
  const activityMap = {};

  safe.forEach((lead) => {
    const dates = [lead.createdAt, lead.contactedAt, lead.meetingAt, lead.proposalAt, lead.wonAt];
    dates.forEach((dateStr) => {
      if (!dateStr) return;
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      activityMap[key] = (activityMap[key] || 0) + 1;
    });
  });

  // Build grid: 13 weeks × 7 days = 91 cells, ending today
  const cells = [];
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 90);
  startDate.setHours(0, 0, 0, 0);

  for (let i = 0; i <= 90; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const count = activityMap[key] || 0;
    cells.push({
      date: key,
      count,
      label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      dayOfWeek: d.getDay(),
    });
  }

  const totalActivities = Object.values(activityMap).reduce((a, b) => a + b, 0);

  return { cells, totalActivities };
};

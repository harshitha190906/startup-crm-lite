import { useState, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { useLeads } from '../context/LeadContext';
import { useNavigate } from 'react-router-dom';

import { useAnalytics } from '../hooks/useAnalytics';

import AnalyticsFilters    from '../components/analytics/AnalyticsFilters';
import StatsCards          from '../components/analytics/StatsCards';
import PieChartCard        from '../components/analytics/PieChartCard';
import FunnelChartCard     from '../components/analytics/FunnelChartCard';
import BarChartCard        from '../components/analytics/BarChartCard';
import LineChartCard       from '../components/analytics/LineChartCard';
import RevenueChartCard    from '../components/analytics/RevenueChartCard';
import LeadSourceChart     from '../components/analytics/LeadSourceChart';
import ActivityHeatmap     from '../components/analytics/ActivityHeatmap';
import TopPerformersCard   from '../components/analytics/TopPerformersCard';
import ForecastCard        from '../components/analytics/ForecastCard';
import SalesVelocityCard   from '../components/analytics/SalesVelocityCard';
import EmptyAnalyticsState from '../components/analytics/EmptyAnalyticsState';

const Analytics = () => {
  const { leads } = useLeads();
  const navigate   = useNavigate();
  const [dateRange, setDateRange] = useState('This Year');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const onRangeChange = useCallback((range) => {
    setDateRange(range);
    if (range === 'Custom Range' && (!customStartDate || !customEndDate)) {
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      setCustomStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
      setCustomEndDate(today.toISOString().split('T')[0]);
    }
  }, [customStartDate, customEndDate]);

  const onCustomDatesChange = useCallback((start, end) => {
    setCustomStartDate(start);
    setCustomEndDate(end);
  }, []);

  const {
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
  } = useAnalytics(leads, dateRange, customStartDate, customEndDate);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-200">

      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Analytics Dashboard
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Track sales performance and growth trends.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-bold">
            <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" style={{ animationDuration: '3s' }} />
            <span className="hidden sm:inline">Real-time Sync Active</span>
          </div>
        </div>
      </div>

      {/* ── Filters ──────────────────────────────────────────────────────── */}
      <div className="overflow-x-auto pb-1">
        <AnalyticsFilters
          activeRange={dateRange}
          onRangeChange={onRangeChange}
          customStart={customStartDate}
          customEnd={customEndDate}
          onCustomDatesChange={onCustomDatesChange}
        />
      </div>

      {/* ── Empty State ───────────────────────────────────────────────────── */}
      {isEmpty ? (
        <EmptyAnalyticsState onAddLead={() => navigate('/leads')} />
      ) : (
        <>
          {/* Section 1: KPI Cards */}
          <StatsCards metrics={metrics} trends={trends} />

          {/* Section 2: Status Donut + Funnel */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PieChartCard data={statusDistribution} totalLeads={filteredLeads.length} />
            <FunnelChartCard data={funnelData} />
          </section>

          {/* Section 3: Monthly Bar + Conversion Line */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BarChartCard data={monthlyLeads} />
            <LineChartCard data={conversionByMonth} />
          </section>

          {/* Section 4: Revenue Area + Source Bars */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RevenueChartCard data={revenueByMonth} />
            <LeadSourceChart data={leadSourceStats} />
          </section>

          {/* Section 5: Activity Heatmap + Top Performers */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ActivityHeatmap heatmapData={heatmapData} />
            <TopPerformersCard performers={topPerformers} />
          </section>

          {/* Section 6: Forecast + Sales Velocity */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
            <ForecastCard forecastData={forecastData} />
            <SalesVelocityCard velocityData={salesVelocity} trend={trends.salesVelocity} />
          </section>
        </>
      )}
    </div>
  );
};

export default Analytics;

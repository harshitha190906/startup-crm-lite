import { useMemo } from 'react';
import { Users, Target, DollarSign, Activity } from 'lucide-react'; // Import standard Lucide React icons
import StatsCard from '../components/dashboard/StatsCard'; // Import child stats card component
import PipelineOverview from '../components/dashboard/PipelineOverview'; // Import pipeline visualizer component
import RecentLeads from '../components/dashboard/RecentLeads'; // Import table component for recent leads
import QuickActions from '../components/dashboard/QuickActions'; // Import button group quick action component
import { useLeads } from '../context/LeadContext'; // Consume the centralized Leads Context hook

/**
 * Dashboard Page component for Startup CRM Lite.
 * Optimized with mobile-first grid parameters.
 * 
 * @component
 * @returns {React.JSX.Element} The assembled CRM Dashboard view.
 */
const Dashboard = () => {
  // Consume leads database array from global context
  const { leads } = useLeads();

  // Compute dynamic dashboard metrics based on active CRM leads
  const stats = useMemo(() => {
    const total = leads.length;
    const wonCount = leads.filter((l) => l.status === 'Won').length;
    const lostCount = leads.filter((l) => l.status === 'Lost').length;
    const activeCount = leads.filter((l) => l.status !== 'Won' && l.status !== 'Lost').length;
    
    const conversionRate = total > 0 
      ? ((wonCount / total) * 100).toFixed(1) + '%' 
      : '0.0%';

    return {
      total,
      conversionRate,
      activeCount,
      lostCount,
    };
  }, [leads]);

  return (
    // Content Layout Container: mobile-first padding
    <div className="p-4 md:p-8 text-slate-800 dark:text-slate-100 transition-colors duration-200">

      {/* Stats Cards Section: 1 col on mobile, 2 on tablet, 4 on desktop */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Leads"
          value={stats.total.toString()}
          icon={Users}
          change="+12.5%"
          color="primary"
        />
        <StatsCard
          title="Conversion Rate"
          value={stats.conversionRate}
          icon={Target}
          change="+4.2%"
          color="success"
        />
        <StatsCard
          title="Active Deals"
          value={stats.activeCount.toString()}
          icon={DollarSign}
          change="+1.2%"
          color="warning"
        />
        <StatsCard
          title="Lost Lead Dropoff"
          value={stats.lostCount.toString()}
          icon={Activity}
          change="-5.4%"
          color="danger"
        />
      </section>

      {/* Charts Grid: stacks vertically on mobile/tablet (full-width), side-by-side 2-col on desktop */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-fit">
          <PipelineOverview leads={leads} />
        </div>
        <div className="h-fit">
          <RecentLeads leads={leads} />
        </div>
      </section>

      {/* Quick Actions Panel: full-width underneath */}
      <section className="mt-6">
        <QuickActions />
      </section>

    </div>
  );
};

export default Dashboard;

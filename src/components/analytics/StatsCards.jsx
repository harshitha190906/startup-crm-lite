import { memo } from 'react';
import {
  Users, Target, DollarSign, TrendingUp, Clock, AlertTriangle,
} from 'lucide-react';
import { Card } from '../common/Card';

const TrendBadge = ({ trend, invert = false }) => {
  if (trend === null || trend === undefined) return null;
  const isPositive = invert ? trend < 0 : trend >= 0;
  const display = trend >= 0 ? `+${trend}%` : `${trend}%`;
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
      isPositive
        ? 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-400/10 border-emerald-100 dark:border-emerald-400/20'
        : 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-400/10 border-rose-100 dark:border-rose-400/20'
    }`}>
      {isPositive ? '↑' : '↓'} {display}
    </span>
  );
};

const KpiCard = memo(({ label, value, sub, icon: Icon, iconBg, iconBorder, iconColorClass, trend, invert = false }) => (
  <Card className="p-5 flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <div className={`p-2.5 rounded-xl ${iconBg} border ${iconBorder} backdrop-blur-sm`}>
        <Icon className={`w-4 h-4 ${iconColorClass}`} />
      </div>
      <TrendBadge trend={trend} invert={invert} />
    </div>
    <div>
      <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
        {value}
      </h4>
      <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 mt-1.5">
        {label}
      </p>
      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium">{sub}</p>
    </div>
  </Card>
));
KpiCard.displayName = 'KpiCard';

const StatsCards = memo(({ metrics, trends = {} }) => {
  const kpis = [
    {
      label: 'Total Leads',
      value: metrics.total,
      sub: 'Leads in selected period',
      icon: Users,
      iconBg: 'bg-blue-50 dark:bg-blue-500/10',
      iconBorder: 'border-blue-100 dark:border-blue-500/20',
      iconColorClass: 'text-blue-600 dark:text-blue-400',
      trend: trends.total ?? null,
    },
    {
      label: 'Conversion Rate',
      value: metrics.conversionRate,
      sub: 'Closed-won conversion rate',
      icon: Target,
      iconBg: 'bg-emerald-50 dark:bg-emerald-500/10',
      iconBorder: 'border-emerald-100 dark:border-emerald-500/20',
      iconColorClass: 'text-emerald-600 dark:text-emerald-400',
      trend: trends.conversionRate ?? null,
    },
    {
      label: 'Pipeline Value',
      value: metrics.pipelineValue,
      sub: 'Value of all active deals',
      icon: DollarSign,
      iconBg: 'bg-purple-50 dark:bg-purple-500/10',
      iconBorder: 'border-purple-100 dark:border-purple-500/20',
      iconColorClass: 'text-purple-600 dark:text-purple-400',
      trend: trends.pipelineValue ?? null,
    },
    {
      label: 'Won Revenue',
      value: metrics.wonRevenue,
      sub: 'Revenue from won deals',
      icon: TrendingUp,
      iconBg: 'bg-indigo-50 dark:bg-indigo-500/10',
      iconBorder: 'border-indigo-100 dark:border-indigo-500/20',
      iconColorClass: 'text-indigo-600 dark:text-indigo-400',
      trend: trends.wonRevenue ?? null,
    },
    {
      label: 'Average Sales Cycle',
      value: metrics.avgSalesCycle,
      sub: 'Created to close velocity',
      icon: Clock,
      iconBg: 'bg-amber-50 dark:bg-amber-500/10',
      iconBorder: 'border-amber-100 dark:border-amber-500/20',
      iconColorClass: 'text-amber-600 dark:text-amber-400',
      trend: trends.avgSalesCycle ?? null,
      invert: true,
    },
    {
      label: 'Lost Rate',
      value: metrics.lostRate,
      sub: 'Percentage of lost leads',
      icon: AlertTriangle,
      iconBg: 'bg-rose-50 dark:bg-rose-500/10',
      iconBorder: 'border-rose-100 dark:border-rose-500/20',
      iconColorClass: 'text-rose-600 dark:text-rose-400',
      trend: trends.lostRate ?? null,
      invert: true,
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {kpis.map((kpi) => (
        <KpiCard key={kpi.label} {...kpi} />
      ))}
    </section>
  );
});

StatsCards.displayName = 'StatsCards';
export default StatsCards;

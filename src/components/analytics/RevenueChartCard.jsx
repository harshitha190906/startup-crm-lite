import { memo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardContent } from '../common/Card';

const RevenueTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 shadow-md dark:shadow-2xl text-xs text-slate-800 dark:text-slate-200">
      <p className="font-bold text-slate-900 dark:text-white mb-0.5">{label} Revenue</p>
      <p className="text-slate-550 dark:text-slate-400">
        <span className="font-semibold text-emerald-600 dark:text-emerald-450">
          ₹{Number(payload[0].value).toLocaleString('en-IN')}
        </span>
      </p>
    </div>
  );
};

const RevenueChartCard = memo(({ data = [] }) => {
  const formatYAxis = (v) => {
    if (v === 0) return '₹0';
    if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
    if (v >= 1000) return `₹${(v / 1000).toFixed(0)}k`;
    return `₹${v}`;
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">Revenue Realization</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Closed-won contract values realized by month</p>
      </CardHeader>

      <CardContent className="pt-4 flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revAreaGradientDark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#22C55E" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#22C55E" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: 'currentColor', className: 'fill-slate-500 dark:fill-slate-400', fontWeight: 600 }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              tickFormatter={formatYAxis}
              tick={{ fontSize: 11, fill: 'currentColor', className: 'fill-slate-500 dark:fill-slate-400', fontWeight: 600 }}
              axisLine={false} tickLine={false}
              width={48}
            />
            <Tooltip content={<RevenueTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#22C55E"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#revAreaGradientDark)"
              dot={{ r: 3.5, fill: '#22C55E', stroke: 'currentColor', className: 'text-white dark:text-slate-800', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#22C55E', stroke: 'currentColor', className: 'text-white dark:text-slate-800', strokeWidth: 2 }}
              animationBegin={0} animationDuration={900}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});

RevenueChartCard.displayName = 'RevenueChartCard';
export default RevenueChartCard;

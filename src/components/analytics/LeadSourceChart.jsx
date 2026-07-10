import { memo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { Card, CardHeader, CardContent } from '../common/Card';

const SourceTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 shadow-md dark:shadow-2xl text-xs text-slate-800 dark:text-slate-200">
      <p className="font-bold text-slate-900 dark:text-white mb-0.5">{label}</p>
      <p className="text-slate-550 dark:text-slate-400">
        <span className="font-semibold text-blue-600 dark:text-blue-400">{payload[0].value}</span> leads
      </p>
    </div>
  );
};

const LeadSourceChart = memo(({ data = [] }) => {
  const chartData = data.length ? data : [];

  return (
    <Card>
      <CardHeader>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">Lead Acquisitions by Source</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Inbound and outbound channel breakdown</p>
      </CardHeader>

      <CardContent className="pt-4 flex-1 min-h-[200px]">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={chartData}
              barSize={16}
              margin={{ top: 0, right: 24, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" horizontal={false} />
              <XAxis
                type="number"
                allowDecimals={false}
                tick={{ fontSize: 11, fill: 'currentColor', className: 'fill-slate-500 dark:fill-slate-400', fontWeight: 600 }}
                axisLine={false} tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="source"
                width={90}
                tick={{ fontSize: 11, fill: 'currentColor', className: 'fill-slate-500 dark:fill-slate-400', fontWeight: 600 }}
                axisLine={false} tickLine={false}
              />
              <Tooltip content={<SourceTooltip />} cursor={{ fill: 'rgba(148,163,184,0.05)' }} />
              <Bar dataKey="count" radius={[0, 6, 6, 0]} animationBegin={0} animationDuration={900}>
                {chartData.map((entry, i) => (
                  <Cell key={`src-${i}`} fill={entry.color} opacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-slate-400 dark:text-slate-500 font-medium">
            No source data available
          </div>
        )}
      </CardContent>
    </Card>
  );
});

LeadSourceChart.displayName = 'LeadSourceChart';
export default LeadSourceChart;

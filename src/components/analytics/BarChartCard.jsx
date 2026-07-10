import { memo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { Card, CardHeader, CardContent } from '../common/Card';

const BarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 shadow-md dark:shadow-2xl text-xs text-slate-800 dark:text-slate-200">
      <p className="font-bold text-slate-900 dark:text-white mb-0.5">{label}</p>
      <p className="text-slate-550 dark:text-slate-400">
        <span className="font-semibold text-blue-655 dark:text-blue-450">{payload[0].value}</span> leads added
      </p>
    </div>
  );
};

const BarChartCard = memo(({ data = [] }) => {
  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const yMax = Math.ceil(maxCount * 1.2) || 10;

  return (
    <Card>
      <CardHeader>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">Monthly Lead Acquisition</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">New leads tracked per month (last 6 months)</p>
      </CardHeader>

      <CardContent className="pt-4 flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={28} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: 'currentColor', className: 'fill-slate-500 dark:fill-slate-400', fontWeight: 600 }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: 'currentColor', className: 'fill-slate-500 dark:fill-slate-400', fontWeight: 600 }}
              axisLine={false} tickLine={false}
              domain={[0, yMax]}
            />
            <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(148,163,184,0.05)' }} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} animationBegin={0} animationDuration={900}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.count > 0 ? '#2563EB' : '#1e293b'}
                  className={entry.count > 0 ? '' : 'fill-slate-200 dark:fill-slate-800'}
                  opacity={entry.count > 0 ? 1 : 0.4}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});

BarChartCard.displayName = 'BarChartCard';
export default BarChartCard;

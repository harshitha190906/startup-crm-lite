import { memo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { Card, CardHeader, CardContent } from '../common/Card';

const LineTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 shadow-md dark:shadow-2xl text-xs text-slate-800 dark:text-slate-200">
      <p className="font-bold text-slate-900 dark:text-white mb-0.5">{label}</p>
      <p className="text-slate-550 dark:text-slate-400">Win rate: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{payload[0].value}%</span></p>
    </div>
  );
};

const LineChartCard = memo(({ data = [] }) => {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">Monthly Lead Conversion Rate</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">% of leads won per month (last 6 months)</p>
      </CardHeader>

      <CardContent className="pt-4 flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: 'currentColor', className: 'fill-slate-500 dark:fill-slate-400', fontWeight: 600 }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 11, fill: 'currentColor', className: 'fill-slate-500 dark:fill-slate-400', fontWeight: 600 }}
              axisLine={false} tickLine={false}
            />
            <Tooltip content={<LineTooltip />} />
            <ReferenceLine y={50} stroke="rgba(148, 163, 184, 0.25)" strokeDasharray="4 4" />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="#22C55E"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#22C55E', stroke: 'currentColor', className: 'text-white dark:text-slate-800', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#22C55E', stroke: 'currentColor', className: 'text-white dark:text-slate-800', strokeWidth: 2 }}
              animationBegin={0} animationDuration={900}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});

LineChartCard.displayName = 'LineChartCard';
export default LineChartCard;

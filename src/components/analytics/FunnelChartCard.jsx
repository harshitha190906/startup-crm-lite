import { memo } from 'react';
import { FunnelChart, Funnel, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardContent } from '../common/Card';

const FunnelTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, count, conv, drop } = payload[0].payload;
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 shadow-md dark:shadow-2xl text-xs text-slate-800 dark:text-slate-200">
      <p className="font-bold text-slate-900 dark:text-white mb-1">{name}</p>
      <p className="text-slate-550 dark:text-slate-400">Leads: <span className="font-semibold text-slate-805 dark:text-white">{count}</span></p>
      <p className="text-slate-550 dark:text-slate-400">Conversion: <span className="font-semibold text-blue-650 dark:text-blue-400">{conv}</span></p>
      {drop && <p className="text-rose-650 dark:text-rose-400 mt-0.5">Drop-off: <span className="font-semibold">{drop}</span></p>}
    </div>
  );
};

const FunnelChartCard = memo(({ data = [] }) => {
  const chartData = data.map((d) => ({ ...d, value: d.count }));

  return (
    <Card>
      <CardHeader>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">Sales Pipeline Funnel</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Cumulative conversion and drop-off at each stage</p>
      </CardHeader>

      <CardContent className="pt-4 flex flex-col sm:flex-row gap-6">
        {/* Funnel Chart */}
        <div className="flex-1 w-full min-h-[220px] max-h-[260px]">
          {chartData.length > 0 && chartData.some(d => d.count > 0) ? (
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip content={<FunnelTooltip />} />
                <Funnel dataKey="value" data={chartData} isAnimationActive animationDuration={900}>
                  {chartData.map((entry, index) => (
                    <Cell key={`funnel-cell-${index}`} fill={entry.color} opacity={0.9} />
                  ))}
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400 dark:text-slate-650 font-medium">
              No pipeline data available
            </div>
          )}
        </div>

        {/* Legend Table */}
        <div className="w-full sm:w-44 space-y-3 py-1 shrink-0">
          {chartData.map((stage) => (
            <div key={stage.name} className="text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: stage.color }} />
                  <span className="text-slate-600 dark:text-slate-400 font-semibold text-[11px]">{stage.name}</span>
                  <span className="text-slate-450 dark:text-slate-500 text-[10px]">{stage.conv}</span>
                </div>
                <span className="font-extrabold text-slate-800 dark:text-slate-200 text-sm">{stage.count}</span>
              </div>
              {stage.drop && (
                <div className="pl-4 mt-0.5">
                  <span className="text-[9px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-400/10 border border-rose-100 dark:border-rose-400/20 px-1.5 py-0.5 rounded">
                    {stage.drop}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>

      {chartData.length >= 2 && (
        <div className="flex items-center justify-between text-xs pt-4 mx-6 mb-6 border-t border-slate-200 dark:border-slate-700/50">
          <span className="font-medium text-slate-500 dark:text-slate-400">Overall Conversion Rate</span>
          <span className="font-extrabold text-slate-900 dark:text-white text-sm">
            {chartData[0]?.count > 0 ? `${Math.round((chartData[chartData.length - 1]?.count / chartData[0]?.count) * 100)}%` : '0%'}
          </span>
        </div>
      )}
    </Card>
  );
});

FunnelChartCard.displayName = 'FunnelChartCard';
export default FunnelChartCard;

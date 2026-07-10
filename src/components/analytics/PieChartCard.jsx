import { memo, useState, useCallback } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardContent } from '../common/Card';

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value, percentage } = payload[0].payload;
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 shadow-md dark:shadow-2xl text-xs text-slate-800 dark:text-slate-200">
      <p className="font-bold text-slate-900 dark:text-white mb-0.5">{name}</p>
      <p className="text-slate-500 dark:text-slate-400">
        <span className="font-semibold text-slate-800 dark:text-white">{value}</span>{' '}
        leads · <span className="font-semibold text-slate-600 dark:text-slate-300">{percentage}%</span>
      </p>
    </div>
  );
};

const PieChartCard = memo(({ data = [], totalLeads = 0 }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const nonZero = data.filter((d) => d.value > 0);
  const chartData = nonZero.length
    ? nonZero
    : [{ name: 'No Data', value: 1, color: '#1e293b', percentage: 0 }];

  const onMouseEnter = useCallback((_, index) => setActiveIndex(index), []);
  const onMouseLeave = useCallback(() => setActiveIndex(null), []);

  return (
    <Card>
      <CardHeader>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">Lead Status Distribution</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Proportion of leads in each pipeline stage</p>
      </CardHeader>

      <CardContent className="pt-4 flex flex-col sm:flex-row items-center gap-6">
        {/* Donut */}
        <div className="relative flex-shrink-0 flex items-center justify-center" style={{ width: 180, height: 180 }}>
          <ResponsiveContainer width={180} height={180}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%" cy="50%"
                innerRadius={56} outerRadius={78}
                paddingAngle={nonZero.length > 1 ? 3 : 0}
                dataKey="value"
                startAngle={90} endAngle={-270}
                animationBegin={0} animationDuration={900}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
              >
                {chartData.map((entry, i) => (
                  <Cell
                     key={`cell-${i}`}
                     fill={entry.color}
                     stroke="transparent"
                     outerRadius={activeIndex === i ? 84 : 78}
                     style={{ cursor: 'pointer', transition: 'all 0.2s', filter: activeIndex === i ? 'brightness(1.2)' : 'none' }}
                  />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none">{totalLeads}</span>
            <span className="text-[9px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 mt-1">Total Leads</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 w-full space-y-2.5">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                <span className="text-slate-600 dark:text-slate-400 font-medium">{entry.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 dark:text-slate-200 w-6 text-right">{entry.value}</span>
                <span className="text-slate-400 dark:text-slate-500 text-[11px] w-10 text-right">({entry.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

PieChartCard.displayName = 'PieChartCard';
export default PieChartCard;

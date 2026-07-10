import { memo } from 'react';

/**
 * @typedef {import('lucide-react').LucideIcon} LucideIcon
 */

/**
 * StatsCard component displays a single CRM dashboard metric card.
 * It includes an icon, a title, the metric value, and a percentage change tag.
 *
 * @component
 * @param {Object} props - The component properties.
 * @param {string} props.title - The title label of the metric.
 * @param {string|number} props.value - The main statistical value to display.
 * @param {LucideIcon} props.icon - The Lucide icon component to render.
 * @param {string} props.change - The percentage change indicator (e.g., "+12.5%", "-2.4%").
 * @param {'primary' | 'success' | 'warning' | 'danger'} props.color - Theme key defining the badge accent color.
 * @returns {React.JSX.Element} The rendered stats card component.
 */
const StatsCard = memo(({ title, value, icon: Icon, change, color }) => {
  // Determine if the trend is positive or negative based on the change string content
  const isPositive = change.startsWith('+');

  // Map theme colors to specific Tailwind utility classes for background, border, and text
  const colorMap = {
    primary: {
      bg: 'bg-blue-50 border-blue-100 text-blue-600',
      iconBg: 'bg-blue-600',
    },
    success: {
      bg: 'bg-green-50 border-green-100 text-green-600',
      iconBg: 'bg-green-500',
    },
    warning: {
      bg: 'bg-amber-50 border-amber-100 text-amber-600',
      iconBg: 'bg-amber-500',
    },
    danger: {
      bg: 'bg-red-50 border-red-100 text-red-600',
      iconBg: 'bg-red-500',
    },
  };

  // Safe fallback to 'primary' classes if an invalid color key is passed
  const activeColor = colorMap[color] || colorMap.primary;

  return (
    <div className="bg-white border border-slate-200/80 dark:bg-slate-800 dark:border-slate-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden group">
      {/* Decorative top gradient bar for premium appearance */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${color === 'success' ? 'from-green-400 to-emerald-500' : color === 'warning' ? 'from-amber-400 to-orange-500' : color === 'danger' ? 'from-red-400 to-rose-500' : 'from-blue-500 to-indigo-600'}`}></div>

      {/* Header containing title and icon */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-slate-500 dark:text-slate-400 text-sm font-medium tracking-wide transition-colors duration-200">{title}</span>
        {/* Dynamic circular background for the icon */}
        <div className={`p-2.5 rounded-xl ${activeColor.iconBg} text-white shadow-sm transition-transform duration-300 group-hover:scale-110`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {/* Value and Change stats */}
      <div className="flex items-baseline justify-between mt-2">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors duration-200">{value}</h3>
        {/* Color-coded trend percentage badge */}
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all duration-200 ${
            isPositive
              ? 'bg-green-50 border-green-200 text-green-600 dark:bg-green-500/10 dark:border-green-500/20 dark:text-green-400'
              : 'bg-red-50 border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400'
          }`}
        >
          {change}
        </span>
      </div>

      {/* Dynamic subtitle indicating time comparison */}
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-3 font-normal transition-colors duration-200">vs. last month</p>
    </div>
  );
})

;

StatsCard.displayName = 'StatsCard';
export default StatsCard;

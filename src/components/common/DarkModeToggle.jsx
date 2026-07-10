import { memo } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/**
 * DarkModeToggle component: Renders an interactive switch to toggle the light/dark theme.
 * Displays appropriate Sun/Moon status icons and includes smooth slide transition effects.
 *
 * @component
 * @returns {React.JSX.Element} The rendered theme switch control.
 */
const DarkModeToggle = memo(() => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-between gap-3 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/80 dark:border-slate-700 dark:text-slate-300 transition-all duration-200 cursor-pointer select-none min-h-[44px]"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDarkMode}
    >
      <div className="flex items-center gap-1.5">
        {isDarkMode ? (
          <Moon className="w-4 h-4 dark:text-blue-400" />
        ) : (
          <Sun className="w-4 h-4 text-amber-500 animate-pulse" />
        )}
        <span className="text-xs font-bold tracking-wide">
          {isDarkMode ? 'Dark Mode' : 'Light Mode'}
        </span>
      </div>

      {/* Visual Slide Switch Wrapper */}
      <div className="w-8 h-4.5 bg-slate-300 dark:bg-slate-600 rounded-full p-0.5 transition-colors duration-200 flex items-center relative">
        <div
          className={`w-3.5 h-3.5 bg-white dark:bg-slate-100 rounded-full shadow-sm transition-transform duration-200 ${
            isDarkMode ? 'translate-x-3.5' : 'translate-x-0'
          }`}
        />
      </div>
    </button>
  );
});

DarkModeToggle.displayName = 'DarkModeToggle';
export default DarkModeToggle;

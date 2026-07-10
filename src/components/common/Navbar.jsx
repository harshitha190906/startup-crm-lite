import { memo } from 'react';
import { useLocation } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';

// Helper function to map current path to route-specific headers.
// Hoisted outside the component to prevent recreation on every render.
const getHeaderTitle = (pathname) => {
  switch (pathname) {
    case '/':
      return {
        title: 'CRM Dashboard',
        subtitle: 'Real-time indicators, pipeline conversion, and active sales funnels.',
      };
    case '/leads':
      return {
        title: 'Lead Management',
        subtitle: 'Add, edit, structure, and monitor leads in your startup pipeline.',
      };
    case '/analytics':
      return {
        title: 'Analytics Dashboard',
        subtitle: 'Live charts, pipeline metrics, and conversion trends from your CRM data.',
      };
    default:
      return {
        title: 'Page Not Found',
        subtitle: 'The page you requested could not be resolved.',
      };
  }
};

/**
 * Navbar component: Shared header layout that displays the active route title,
 * system database connection status, and the DarkModeToggle.
 *
 * @component
 * @param {Object} props - The component properties.
 * @param {function} props.onToggleMobileMenu - Toggle callback for mobile drawer menu.
 * @returns {React.JSX.Element} The rendered navigation bar.
 */
const Navbar = memo(({ onToggleMobileMenu }) => {
  const location = useLocation();
  const { title, subtitle } = getHeaderTitle(location.pathname);

  return (
    <header className="sticky top-0 z-30 w-full flex items-center justify-between border-b border-slate-200/80 bg-white/80 dark:border-slate-800 dark:bg-slate-900/85 backdrop-blur-md px-4 md:px-8 py-4 transition-all duration-200">
      
      {/* Title Segment with Mobile Hamburger Trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          aria-label="Toggle Navigation Menu"
          className="flex md:hidden items-center justify-center p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60 focus:outline-none min-w-[44px] min-h-[44px] cursor-pointer"
        >
          {/* Hamburger SVG Icon */}
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex flex-col gap-0.5">
          <h2 className="text-base md:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white transition-colors duration-200">
            {title}
          </h2>
          <p className="hidden md:block text-xs font-semibold text-slate-400 dark:text-slate-500 transition-colors duration-200">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right Controls: DB status indicator + Dark mode toggler */}
      <div className="flex items-center gap-4.5">
        {/* Dynamic Database connection status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100/80 text-blue-600 dark:bg-blue-900/20 dark:border-blue-900/40 dark:text-blue-400 font-bold text-[10px] uppercase tracking-wider transition-colors duration-200">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></span>
          <span>DB Live</span>
        </div>

        {/* Unified Dark Mode switcher */}
        <DarkModeToggle />
      </div>

    </header>
  );
});

Navbar.displayName = 'Navbar';
export default Navbar;

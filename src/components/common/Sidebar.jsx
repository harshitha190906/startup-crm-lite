import { memo } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart3, X } from 'lucide-react';

/**
 * Sidebar component that provides navigation for the Startup CRM Lite application.
 * Adapts between bottom navigation (Mobile), collapsed sidebar (Tablet), and wide sidebar (Desktop).
 *
 * @component
 * @param {Object} props - The component properties.
 * @param {boolean} props.isMobileMenuOpen - Toggles the mobile overlay drawer.
 * @param {function} props.onCloseMobileMenu - Closes the mobile overlay drawer.
 * @returns {React.JSX.Element} The responsive sidebar menu panels.
 */
// Static nav config — hoisted outside component to prevent recreation on every render
const MENU_ITEMS = [
  { path: '/', label: 'Dashboard', desc: 'Overview & metrics', icon: LayoutDashboard },
  { path: '/leads', label: 'Leads', desc: 'Manage active pipeline', icon: Users },
  { path: '/analytics', label: 'Analytics', desc: 'Charts, rates & performance', icon: BarChart3 },
];

const Sidebar = memo(({ isMobileMenuOpen, onCloseMobileMenu }) => {

  return (
    <>
      {/* 1. Mobile Bottom Navigation Bar (Icons Only) */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-slate-900 dark:bg-slate-950 border-t border-slate-800 dark:border-slate-900/60 flex items-center justify-around z-40 md:hidden select-none">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400'
                    : 'text-slate-400 hover:text-slate-100'
                }`
              }
              aria-label={item.label}
            >
              <Icon className="w-6 h-6" />
            </NavLink>
          );
        })}
      </nav>

      {/* 2. Mobile Slide-over Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-fade-in">
          {/* Backdrop overlay */}
          <div
            onClick={onCloseMobileMenu}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity duration-300"
          />

          {/* Drawer Panel */}
          <aside className="relative flex flex-col w-64 max-w-xs h-full bg-slate-900 dark:bg-slate-950 border-r border-slate-800 dark:border-slate-900 text-slate-100 p-5 shadow-2xl transition-transform duration-300 select-none">
            {/* Header: Logo & Close */}
            <div className="flex items-center justify-between mb-8 px-1">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-linear-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <span className="font-bold text-white text-lg tracking-wider">S</span>
                </div>
                <div>
                  <h1 className="font-bold text-sm tracking-wide text-white leading-tight">Startup CRM</h1>
                  <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-widest">Lite Edition</span>
                </div>
              </div>
              <button
                onClick={onCloseMobileMenu}
                aria-label="Close drawer"
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation links */}
            <nav className="flex flex-col gap-1.5 flex-1">
              {MENU_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onCloseMobileMenu}
                    className={({ isActive }) =>
                      `flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-305 group min-h-[44px] ${
                        isActive
                          ? 'bg-blue-600/15 text-blue-400 border-l-4 border-blue-500 pl-3.5'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            {/* Profile footer in drawer */}
            <div className="border-t border-slate-800/80 dark:border-slate-900/80 pt-4">
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/40 border border-slate-800/60 dark:bg-slate-900/30 dark:border-slate-800">
                <div className="relative shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                    alt="User Avatar"
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/20"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-slate-900 dark:border-slate-950 rounded-full"></span>
                </div>
                <div className="overflow-hidden">
                  <p className="font-semibold text-xs text-slate-200 truncate">Sarah Connor</p>
                  <p className="text-[10px] text-slate-500 truncate">Senior Architect</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* 3. Left Sidebar for Tablet and Desktop */}
      <aside className="hidden md:flex flex-col justify-between h-screen bg-slate-900 border-r border-slate-800 dark:bg-slate-950 dark:border-slate-900 text-slate-100 select-none transition-all duration-300 md:w-20 lg:w-64 shrink-0">
        <div className="flex flex-col gap-8 py-6 px-3.5 lg:px-4">
          
          {/* Logo Brand segment */}
          <div className="flex items-center gap-3 px-1">
            <div className="w-9 h-9 rounded-lg bg-linear-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
              <span className="font-bold text-white text-lg tracking-wider">S</span>
            </div>
            <div className="hidden lg:block overflow-hidden transition-all duration-300">
              <h1 className="font-bold text-sm tracking-wide text-white leading-tight truncate">Startup CRM</h1>
              <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-widest truncate block mt-0.5">Lite Edition</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center transition-all duration-300 group ${
                      isActive
                        ? 'bg-blue-600/15 text-blue-400 border-l-4 border-blue-500 pl-2 lg:pl-3.5'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    } ${
                      // Tablet: vertical layout with icon top and tiny text below
                      'md:flex-col md:py-2.5 md:px-1 md:text-[10px] md:text-center md:gap-1.5 ' +
                      // Desktop: horizontal layout with title, sub-label and icon
                      'lg:flex-row lg:py-3 lg:px-4 lg:text-sm lg:text-left lg:gap-3.5 lg:pl-3.5'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-105" />
                  
                  {/* Tablet View: tiny label underneath */}
                  <span className="md:block lg:hidden text-[9px] font-bold tracking-tight truncate w-full">
                    {item.label}
                  </span>

                  {/* Desktop View: Main label + Sub-label */}
                  <div className="hidden lg:flex flex-col overflow-hidden text-left">
                    <span className="font-semibold text-xs text-slate-200 group-hover:text-white transition-colors">{item.label}</span>
                    <span className="text-[10px] text-slate-500 font-medium tracking-tight truncate leading-tight mt-0.5">
                      {item.desc}
                    </span>
                  </div>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Profile Segment footer */}
        <div className="p-3 border-t border-slate-800/80 dark:border-slate-900/80">
          <div className="flex items-center gap-3 p-1.5 rounded-xl transition-colors duration-300 md:justify-center lg:justify-start lg:bg-slate-800/40 lg:border lg:border-slate-800/60 lg:dark:bg-slate-900/30 lg:dark:border-slate-800">
            <div className="relative shrink-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                alt="User Avatar"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/20"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border-2 border-slate-900 rounded-full"></span>
            </div>
            
            {/* User details (Desktop wide sidebar only) */}
            <div className="hidden lg:block overflow-hidden">
              <p className="font-semibold text-xs text-slate-200 truncate">Sarah Connor</p>
              <p className="text-[10px] text-slate-500 truncate">Senior Architect</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
});

Sidebar.displayName = 'Sidebar';
export default Sidebar;

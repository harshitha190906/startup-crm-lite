import { lazy, Suspense, useState, useCallback } from 'react'; // Import lazy for dynamic imports, and Suspense
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route components
import Sidebar from '../components/common/Sidebar'; // Import the global Sidebar navigation component
import Navbar from '../components/common/Navbar'; // Import the top layout Navbar component

// Dynamic dynamic code-splitting imports via React.lazy for route-based performance optimization
const Dashboard = lazy(() => import('../pages/Dashboard')); // Lazy load the Dashboard page component
const Leads = lazy(() => import('../pages/Leads')); // Lazy load the Lead Management page component
const Analytics = lazy(() => import('../pages/Analytics')); // Lazy load the Analytics page component
const NotFound = lazy(() => import('../pages/NotFound')); // Lazy load the 404 Fallback page component

/**
 * PageLoader component showing a modern, premium loading spinner.
 * Displayed as a fallback placeholder during Suspense chunk loading.
 */
const PageLoader = () => (
  <div className="flex-1 min-h-[calc(100vh-70px)] bg-[#F8FAFC] dark:bg-slate-900 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors duration-200">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      <span className="text-xs font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-500 animate-pulse">Loading Views...</span>
    </div>
  </div>
);

/**
 * AppRoutes component configuring the main page-switching logic.
 * Wraps the route structure with Suspense and integrates the Sidebar globally.
 */
const AppRoutes = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = useCallback(() => setIsMobileMenuOpen((prev) => !prev), []);
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  return (
    // Application Layout Wrapper: flex layout layout spacing adjusted for bottom navigation bar on mobile
    <div className="flex flex-col md:flex-row h-screen w-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-200 pb-16 md:pb-0">
      
      {/* Sidebar Component: Persistent across pages. Handles bottom navigation and left sidebar drawer */}
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} onCloseMobileMenu={closeMobileMenu} />
      
      {/* Main content vertical container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Navbar: Passes mobile toggle handler */}
        <Navbar onToggleMobileMenu={toggleMobileMenu} />

        {/* Scrollable Route Content panel */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC] dark:bg-slate-900 transition-colors duration-200">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Dashboard route matching exact base path "/" */}
              <Route path="/" element={<Dashboard />} />
              
              {/* Lead Management route matching path "/leads" */}
              <Route path="/leads" element={<Leads />} />
              
              {/* Analytics route matching path "/analytics" */}
              <Route path="/analytics" element={<Analytics />} />
              
              {/* Catch-all route matching any unspecified path, displaying the 404 page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
      </div>
      
    </div>
  );
};

export default AppRoutes;

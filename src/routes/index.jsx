import { lazy, Suspense, useState, useCallback } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import { useAuth } from '../context/AuthContext';

// Lazy load route pages to keep initial bundle size lean
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Leads     = lazy(() => import('../pages/Leads'));
const Analytics = lazy(() => import('../pages/Analytics'));
const Login     = lazy(() => import('../pages/Login'));
const Register  = lazy(() => import('../pages/Register'));
const NotFound  = lazy(() => import('../pages/NotFound'));

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
 * ProtectedRoute component guarding routes requiring credentials.
 * If authentication state is loading, it outputs the PageLoader.
 * If user holds a valid session token, it renders the child pages via <Outlet />.
 * If no session is active, it redirects to /login.
 */
const ProtectedRoute = () => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="w-screen h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

/**
 * ProtectedLayout component that frames pages with Navbar and Sidebar.
 * Only loaded within ProtectedRoute elements.
 */
const ProtectedLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = useCallback(() => setIsMobileMenuOpen((prev) => !prev), []);
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  return (
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
            <Outlet />
          </Suspense>
        </main>
      </div>
      
    </div>
  );
};

/**
 * AppRoutes component configuring the main page-switching logic.
 * Segregates public authentication pages from protected layout layouts.
 */
const AppRoutes = () => {
  return (
    <Suspense fallback={
      <div className="w-screen h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <PageLoader />
      </div>
    }>
      <Routes>
        {/* Public Authentication routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected endpoints wrapped in ProtectedRoute & ProtectedLayout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/analytics" element={<Analytics />} />
          </Route>
        </Route>

        {/* Catch-all 404 handler */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;

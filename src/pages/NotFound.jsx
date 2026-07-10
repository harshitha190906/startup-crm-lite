
import { Link } from 'react-router-dom'; // Import Link from react-router-dom for navigation without page refresh
import { ShieldAlert, ArrowLeft } from 'lucide-react'; // Import warning icon and navigation arrow icon

/**
 * NotFound component rendering a customized 404 error page in a light theme.
 * Displays error information and provides a navigation button back to the home path.
 */
const NotFound = () => {
  return (
    // Main Container: Full screen height and width, centering content vertically and horizontally, dark mode transition
    <div className="w-full min-h-[calc(100vh-70px)] flex flex-col items-center justify-center p-6 text-slate-800 dark:text-slate-100 transition-colors duration-200 font-sans">
      
      {/* Visual Indicator Container: Outer card with soft shadow and white background */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 text-center shadow-xl overflow-hidden transition-colors duration-200">
        
        {/* Glow effect in background */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-blue-600/5 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none"></div>

        {/* Warning Icon Badge: Centered, colorized in danger/rose theme */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-105 dark:border-rose-900/30 flex items-center justify-center mb-6 shadow-sm transition-colors duration-200">
          <ShieldAlert className="w-8 h-8 text-rose-500" />
        </div>

        {/* Major HTTP Code indicator */}
        <span className="block text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2 transition-colors duration-200">404</span>
        
        {/* Page Title Header */}
        <h2 className="text-xl font-bold text-slate-950 dark:text-white mb-3 transition-colors duration-200">Page Not Found</h2>
        
        {/* Description text detailing the issue */}
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8 transition-colors duration-200">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Please verify the URL.
        </p>

        {/* Back to Home CTA button */}
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-600/10 active:scale-[0.98]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

      </div>

    </div>
  );
};

export default NotFound; // Export the NotFound component

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, Shield } from 'lucide-react';

/**
 * Login Page component for Startup CRM Lite.
 * Built with a modern, glassmorphic card design and fully responsive.
 * Handles credential input, submission, loading status, and authentication error displays.
 */
const Login = () => {
  const { login } = useAuth();
  
  // Local state for input fields and validation/API errors
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handles submission of the login credentials form.
   * Calls the login function from AuthContext and manages loading/error states.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      // AuthContext handles redirect to dashboard '/' on success
    } catch (err) {
      // Extract the error message returned from the backend API if available
      const errMsg = err?.response?.data?.message ?? 'Invalid email or password';
      setError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 text-slate-800 dark:text-slate-100 transition-colors duration-200 font-sans">
      
      {/* Container Card with soft shadow and borders */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl overflow-hidden transition-colors duration-200">
        
        {/* Sleek background glow effects */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-blue-600/10 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>

        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Welcome back</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Enter your credentials to access your CRM dashboard</p>
        </div>

        {/* Error notification display */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl text-rose-600 dark:text-rose-400 text-xs leading-relaxed animate-fadeIn">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 rounded-xl text-sm focus:outline-none transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 rounded-xl text-sm focus:outline-none transition-all duration-200"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 mt-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-600/10 active:scale-[0.98] disabled:opacity-75 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Redirect back to Register */}
        <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          <span>New to CRM Lite? </span>
          <Link to="/register" className="text-blue-600 hover:underline font-semibold transition-colors duration-200">
            Create an account
          </Link>
        </div>

      </div>

    </div>
  );
};

export default Login;

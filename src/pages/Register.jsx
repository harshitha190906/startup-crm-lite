import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Shield } from 'lucide-react';

/**
 * Register Page component for Startup CRM Lite.
 * Integrates state for registration inputs (name, email, password, confirmPassword)
 * and client-side credential validations before routing them to useAuth().register().
 */
const Register = () => {
  const { register } = useAuth();

  // Local state for input fields and validations/API error alerts
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Validates values client-side and triggers the registration action.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset any existing errors
    setError(null);

    // Client-side validations
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      await register(name, email, password);
      // AuthContext handles redirecting to '/' on successful session start
    } catch (err) {
      // Extract the field-level errors or root error message returned from Express backend
      const responseData = err?.response?.data;
      if (responseData?.errors && Array.isArray(responseData.errors)) {
        // Collect express-validator field messages
        const fieldErrorMsg = responseData.errors.map(e => e.message || e.msg).join(', ');
        setError(fieldErrorMsg || 'Validation failed');
      } else {
        setError(responseData?.message ?? 'Registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 text-slate-800 dark:text-slate-100 transition-colors duration-200 font-sans">
      
      {/* Container card with soft shadow borders */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl overflow-hidden transition-colors duration-200">
        
        {/* Soft background visual glows */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-blue-600/10 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>

        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Create an account</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Join Startup CRM Lite and track your sales leads</p>
        </div>

        {/* Error notification display */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-105 dark:border-rose-900/30 rounded-2xl text-rose-600 dark:text-rose-400 text-xs leading-relaxed animate-fadeIn">
            {error}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 rounded-xl text-sm focus:outline-none transition-all duration-200"
              />
            </div>
          </div>

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
                placeholder="jane.doe@example.com"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 rounded-xl text-sm focus:outline-none transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 rounded-xl text-sm focus:outline-none transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 rounded-xl text-sm focus:outline-none transition-all duration-200"
              />
            </div>
          </div>

          {/* Submit CTA button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 mt-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-600/10 active:scale-[0.98] disabled:opacity-75 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        {/* Redirect link back to Login */}
        <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          <span>Already have an account? </span>
          <Link to="/login" className="text-blue-600 hover:underline font-semibold transition-colors duration-200">
            Sign in
          </Link>
        </div>

      </div>

    </div>
  );
};

export default Register;

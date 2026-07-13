/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../services/authService.js';

// ---------------------------------------------------------------------------
// src/context/AuthContext.jsx
//
// Provides authentication state and actions to the entire component tree.
// Designed to be the single source of truth for "who is logged in".
//
// Token storage strategy:
//   • Token  → localStorage key 'crm-token'
//   • User   → localStorage key 'crm-user'  (cached to avoid a profile fetch on every refresh)
//
// On mount, if a token exists, we re-validate it by calling getProfile().
// If the token is expired/invalid the API returns 401, the response
// interceptor in api.js clears storage and redirects to /login automatically.
// ---------------------------------------------------------------------------

/** @type {React.Context} */
export const AuthContext = createContext(null);

// ---------------------------------------------------------------------------
// AuthProvider
// ---------------------------------------------------------------------------

/**
 * Wraps the application (or any sub-tree) and provides auth state + actions.
 *
 * @param {{ children: React.ReactNode }} props
 */
export const AuthProvider = ({ children }) => {
  // ── State ─────────────────────────────────────────────────────────────────
  const [user,      setUser]      = useState(null);
  const [token,     setToken]     = useState(() => localStorage.getItem('crm-token'));
  const [isLoading, setIsLoading] = useState(true); // true until session is restored

  const navigate = useNavigate();

  // ── Session restoration on mount ─────────────────────────────────────────

  /**
   * On initial render, if a token exists in localStorage, verify it by
   * fetching the user's profile from the API.  This handles the case where
   * the user refreshes the page — they should stay logged in.
   *
   * If the token is invalid/expired, the response interceptor in api.js
   * handles the 401 automatically (clears storage + redirects to /login).
   */
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem('crm-token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        // Re-validate token and fetch fresh user data
        const result = await authService.getProfile();
        setUser(result.data.user);
        setToken(storedToken);
      } catch {
        // Token is invalid or expired — clear everything.
        // (The 401 interceptor may have already done this, but belt-and-suspenders.)
        localStorage.removeItem('crm-token');
        localStorage.removeItem('crm-user');
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []); // run once on mount

  // ── Actions ───────────────────────────────────────────────────────────────

  /**
   * Authenticate with email + password.
   * On success: stores token, updates user state, navigates to dashboard.
   * On failure: shows the API error message as a toast and re-throws so the
   *             Login page can display it inline too.
   *
   * @param {string} email
   * @param {string} password
   * @returns {Promise<void>}
   */
  const login = useCallback(async (email, password) => {
    const result = await authService.login(email, password);
    const { token: newToken, user: newUser } = result.data;

    // Persist to localStorage so the request interceptor picks it up
    localStorage.setItem('crm-token', newToken);
    localStorage.setItem('crm-user', JSON.stringify(newUser));

    setToken(newToken);
    setUser(newUser);

    toast.success(`Welcome back, ${newUser.name}! 👋`);
    navigate('/');
  }, [navigate]);

  /**
   * Create a new user account.
   * On success: stores token, updates user state, navigates to dashboard.
   *
   * @param {string} name
   * @param {string} email
   * @param {string} password
   * @returns {Promise<void>}
   */
  const register = useCallback(async (name, email, password) => {
    const result = await authService.register(name, email, password);
    const { token: newToken, user: newUser } = result.data;

    localStorage.setItem('crm-token', newToken);
    localStorage.setItem('crm-user', JSON.stringify(newUser));

    setToken(newToken);
    setUser(newUser);

    toast.success(`Account created! Welcome, ${newUser.name}! 🎉`);
    navigate('/');
  }, [navigate]);

  /**
   * Log out the current user.
   * Clears localStorage, resets context state, and redirects to /login.
   *
   * @returns {void}
   */
  const logout = useCallback(() => {
    authService.logout(); // removes tokens from localStorage
    localStorage.removeItem('crm-token');
    localStorage.removeItem('crm-user');
    setUser(null);
    setToken(null);
    toast.success('Logged out successfully.');
    navigate('/login');
  }, [navigate]);

  // ── Context value ─────────────────────────────────────────────────────────

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ---------------------------------------------------------------------------
// useAuth — convenience hook
// ---------------------------------------------------------------------------

/**
 * Custom hook that consumes AuthContext.
 * Must be used inside an <AuthProvider> wrapper.
 *
 * @returns {{ user: Object|null, token: string|null, isLoading: boolean, isAuthenticated: boolean, login: Function, register: Function, logout: Function }}
 * @throws {Error} If used outside of <AuthProvider>.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an <AuthProvider>.');
  }
  return context;
};

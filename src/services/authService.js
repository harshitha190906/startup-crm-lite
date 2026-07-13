import api from './api.js';

// ---------------------------------------------------------------------------
// src/services/authService.js
//
// All authentication-related API calls.
// Every function unwraps the Axios response and returns response.data so
// callers get the plain API envelope ({ success, message, data }) directly.
//
// Auth routes on the backend:
//   POST /api/auth/register
//   POST /api/auth/login
//   GET  /api/auth/me
//   PUT  /api/auth/me
// ---------------------------------------------------------------------------

/**
 * Register a new user account.
 *
 * @param {string} name     - Full display name.
 * @param {string} email    - Email address (must be unique).
 * @param {string} password - Plain-text password (min 6 chars).
 * @returns {Promise<{ success: boolean, message: string, data: { token: string, user: Object } }>}
 */
const register = async (name, email, password) => {
  const response = await api.post('/api/auth/register', { name, email, password });
  return response.data;
};

/**
 * Authenticate an existing user with email + password.
 *
 * @param {string} email    - Registered email address.
 * @param {string} password - Plain-text password.
 * @returns {Promise<{ success: boolean, message: string, data: { token: string, user: Object } }>}
 */
const login = async (email, password) => {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data;
};

/**
 * Client-side logout.
 * The backend uses stateless JWTs, so there is no server-side session to
 * invalidate — we simply remove the token from localStorage so it is no
 * longer sent in future requests.
 *
 * @returns {void}
 */
const logout = () => {
  localStorage.removeItem('crm-token');
  localStorage.removeItem('crm-user');
};

/**
 * Fetch the currently authenticated user's profile.
 * Requires a valid JWT in localStorage (injected automatically by api.js).
 *
 * @returns {Promise<{ success: boolean, data: { user: Object } }>}
 */
const getProfile = async () => {
  const response = await api.get('/api/auth/profile');
  return response.data;
};

/**
 * Update the authenticated user's profile (name and/or password).
 *
 * @param {{ name?: string, currentPassword?: string, newPassword?: string }} data
 * @returns {Promise<{ success: boolean, data: { user: Object } }>}
 */
const updateProfile = async (data) => {
  const response = await api.put('/api/auth/profile', data);
  return response.data;
};

export const authService = { register, login, logout, getProfile, updateProfile };
export default authService;

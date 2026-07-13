import axios from 'axios';
import toast from 'react-hot-toast';

// ---------------------------------------------------------------------------
// src/services/api.js
//
// Single configured Axios instance shared by every service module.
// Two interceptors handle cross-cutting concerns so individual service
// functions stay clean — they only describe *what* to call, not *how*
// to authenticate or handle failures.
// ---------------------------------------------------------------------------

/**
 * Base Axios instance.
 *
 * baseURL comes from the Vite environment variable VITE_API_URL
 * (defined in .env at the project root).  In development this points at
 * http://localhost:5000; in production it would be your deployed API URL.
 *
 * withCredentials is left false because the backend uses stateless JWT
 * bearer tokens, not session cookies that need to be sent cross-origin.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // abort requests that hang for more than 15 s
});

// ---------------------------------------------------------------------------
// Request interceptor — inject Authorization header
// ---------------------------------------------------------------------------

/**
 * Before every outgoing request, pull the JWT from localStorage and attach it
 * as a Bearer token.  This means every service call is automatically
 * authenticated without each function needing to read storage itself.
 *
 * The token key 'crm-token' is the single source of truth — it must match
 * the key used in AuthContext when storing/removing the token.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('crm-token');
    if (token) config.headers.Authorization = 'Bearer ' + token;
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------------------------------------------------------------------------
// Response interceptor — centralised error handling
// ---------------------------------------------------------------------------

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('crm-token');
        localStorage.removeItem('crm-user');
        window.location.href = '/login';
      }
    } else if (error.request || !error.response) {
      toast.error('Cannot connect to server. Check your connection.');
    }
    return Promise.reject(error);
  }
);

export default api;

import { useState, useCallback } from 'react';

/**
 * Custom hook: useLocalStorage
 * Synchronizes React state with the browser's localStorage API, providing 
 * seamless persistence across page sessions. Handles edge cases such as JSON parse 
 * errors, functional state updates, and blocked or unavailable localStorage APIs 
 * (e.g. private browsing, sandboxed environments) by falling back to in-memory state.
 * 
 * @template T
 * @param {string} key - The unique localStorage key name.
 * @param {T} initialValue - The fallback value if no stored record exists.
 * @returns {[T, (value: T | ((val: T) => T)) => void]} A stateful value and a function to update it.
 */
export const useLocalStorage = (key, initialValue) => {
  // Read and initialize state on mount
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Return initialValue if window or localStorage is not available (SSR safety)
      if (typeof window === 'undefined') {
        return initialValue;
      }

      const item = window.localStorage.getItem(key);
      // Return parsed JSON object or initialValue if empty
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Log parsing or access error and fallback to initialValue
      console.warn(`[useLocalStorage] Failed to read or parse key "${key}". Falling back to initialValue.`, error);
      return initialValue;
    }
  });

  /**
   * Stateful setter function that updates React state and localStorage simultaneously.
   * Supports functional updates (e.g. setValue(prev => prev + 1)).
   * 
   * @param {T | ((val: T) => T)} value - The new state value or updater callback.
   */
  const setValue = useCallback((value) => {
    try {
      // Use setStoredValue's functional form so we always get the latest state,
      // not a stale closure snapshot — this fixes the toggle getting stuck.
      // ✅ Now: React gives us the real current value as `prev`
setStoredValue((prev) => {
  const valueToStore = value instanceof Function ? value(prev) : value;
  localStorage.setItem(key, JSON.stringify(valueToStore));
  return valueToStore;
});

    } catch (error) {
      // Catch quota exceeded or blocked storage exceptions gracefully
      console.warn(`[useLocalStorage] Failed to write key "${key}" to localStorage. State updated in-memory.`, error);
    }
  }, [key]);

  return [storedValue, setValue];
};

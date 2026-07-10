import { createContext, useContext } from 'react';

/**
 * ThemeContext: React Context object for managing application dark/light theme state.
 * Separated from the Provider component to ensure complete Fast Refresh HMR compatibility.
 */
export const ThemeContext = createContext(null);

/**
 * Custom hook: useTheme
 * Consumes ThemeContext and throws a descriptive runtime error if used outside a ThemeProvider.
 * 
 * @returns {Object} Centralized theme state (isDarkMode) and toggleTheme function.
 * @throws {Error} If consumed outside of a ThemeProvider context wrapper.
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be consumed within a <ThemeProvider> context tree wrapper.');
  }
  return context;
};

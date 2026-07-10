import { useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage'; // Import custom localStorage hook
import { ThemeContext } from './ThemeContext'; // Import the context object reference

// LocalStorage key for theme preference persistence
const THEME_STORAGE_KEY = 'startup-crm-theme';

/**
 * ThemeProvider component: Context provider that wraps the app tree.
 * Manages theme state persistence under 'startup-crm-theme' and injects/removes
 * the 'dark' class on the document root element.
 * 
 * @component
 * @param {Object} props - The component properties.
 * @param {React.ReactNode} props.children - Child components to wrap.
 * @returns {React.JSX.Element} The context provider rendering child trees.
 */
export const ThemeProvider = ({ children }) => {
  // Centralized theme state synchronized with localStorage under 'startup-crm-theme'
  const [isDarkMode, setIsDarkMode] = useLocalStorage(THEME_STORAGE_KEY, true);

  // Sync theme class to document root whenever state changes (for Tailwind dark selector targeting)
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  /**
   * Toggles the active theme state between light and dark modes.
   */
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

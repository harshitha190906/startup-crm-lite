import { useState, useEffect, memo } from 'react';
import { Search, X } from 'lucide-react'; // Import Lucide search and close icons

/**
 * SearchBar component: Renders a controlled, debounced search input field.
 * Uses state adjustment during rendering to ensure smooth typing response 
 * while maintaining synchronization with parent state resets.
 * 
 * @component
 * @param {Object} props - The component properties.
 * @param {string} props.value - The active search query value from the parent state.
 * @param {function} props.onChange - Callback triggered after 300ms of user inactivity, passing the new search string.
 * @returns {React.JSX.Element} The styled search bar input element.
 */
const SearchBar = memo(({ value, onChange }) => {
  // Local state to support instant keyboard rendering response (0ms typing latency)
  const [localValue, setLocalValue] = useState(value);
  
  // Track the previous prop value to detect external resets (e.g. from parent "Clear Filters" button)
  const [prevValue, setPrevValue] = useState(value);

  // If the parent value prop changes (e.g. cleared externally), adjust local state during render.
  // This is the officially recommended React pattern to avoid synchronous useEffect state updates.
  if (value !== prevValue) {
    setPrevValue(value);
    setLocalValue(value);
  }

  // Debounce effect: Wait 300ms after localValue changes before triggering parent filter callback.
  useEffect(() => {
    // Avoid triggering a debounce cycle if local state is already in sync with parent prop value.
    if (localValue === value) return;

    const timer = setTimeout(() => {
      onChange(localValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, value, onChange]);

  /**
   * Clears the search bar input and immediately notifies the parent component.
   */
  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Magnifying Glass Icon Decorator */}
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
      </div>

      {/* Accessible text search field */}
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder="Search by name, company, or email..."
        aria-label="Search leads by name, company, or email"
        className="w-full pl-10.5 pr-11 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/10 transition-all text-sm shadow-sm min-h-[44px]"
      />

      {/* Clear Button: Triggers when text content exists */}
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 w-11 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors active:scale-95 cursor-pointer min-h-[44px]"
          aria-label="Clear search query"
        >
          <X className="h-4.5 w-4.5" />
        </button>
      )}
    </div>
  );
});

SearchBar.displayName = 'SearchBar';
export default SearchBar;

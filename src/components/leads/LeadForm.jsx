import { useState } from 'react';
import { LEAD_STATUSES, LEAD_SOURCES } from '../../constants/crm';

/**
 * LeadForm component handles validation and inputs for creating and updating leads.
 * Uses fully accessible forms with associated htmlFor labels and ARIA descriptors.
 *
 * @component
 * @param {Object} props - The component properties.
 * @param {Object} [props.initialData] - Optional initial data when editing an existing lead.
 * @param {function} props.onSubmit - Callback function triggered on successful form submission.
 * @param {function} props.onCancel - Callback function triggered when cancel is clicked.
 * @returns {React.JSX.Element} The rendered lead form.
 */
const LeadForm = ({ initialData, onSubmit, onCancel }) => {
  // Status and source options sourced from shared constants (single source of truth)
  const statusOptions = LEAD_STATUSES;
  const sourceOptions = LEAD_SOURCES;

  // Initialize form state from initialData (edit mode) or defaults (create mode)
  // Deriving the initial value directly inside useState avoids the
  // react-hooks/set-state-in-effect lint error while keeping behaviour identical.
  const [formData, setFormData] = useState(() => ({
    name: initialData?.name || '',
    company: initialData?.company || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    status: initialData?.status || 'New',
    source: initialData?.source || 'Website',
  }));

  // Track validation error messages
  const [errors, setErrors] = useState({});

  // Handle generic input change events
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation error when user begins typing again
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Perform form validation rules
  const validateForm = () => {
    const tempErrors = {};
    if (!formData.name.trim()) {
      tempErrors.name = 'Full name is required.';
    }
    if (!formData.company.trim()) {
      tempErrors.company = 'Company name is required.';
    }
    if (!formData.email.trim()) {
      tempErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Please enter a valid email address.';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Process form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Name Input */}
      <div>
        <label htmlFor="lead-name" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5 transition-colors duration-200">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="lead-name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          aria-invalid={errors.name ? 'true' : 'false'}
          aria-describedby={errors.name ? 'name-error' : undefined}
          className={`w-full px-3.5 py-3 border rounded-xl text-sm focus:outline-none transition-colors dark:text-slate-100 ${
            errors.name 
              ? 'border-red-300 focus:border-red-500 bg-red-50/20 dark:border-red-900/60 dark:bg-red-950/20' 
              : 'border-slate-200 focus:border-blue-500/60 bg-white dark:bg-slate-900 dark:border-slate-700'
          }`}
          placeholder="e.g. Sarah Connor"
        />
        {errors.name && (
          <p id="name-error" className="text-xs text-red-500 font-semibold mt-1">
            {errors.name}
          </p>
        )}
      </div>

      {/* Company Input */}
      <div>
        <label htmlFor="lead-company" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5 transition-colors duration-200">
          Company <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="lead-company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          aria-invalid={errors.company ? 'true' : 'false'}
          aria-describedby={errors.company ? 'company-error' : undefined}
          className={`w-full px-3.5 py-3 border rounded-xl text-sm focus:outline-none transition-colors dark:text-slate-100 ${
            errors.company 
              ? 'border-red-300 focus:border-red-500 bg-red-50/20 dark:border-red-900/60 dark:bg-red-950/20' 
              : 'border-slate-200 focus:border-blue-500/60 bg-white dark:bg-slate-900 dark:border-slate-700'
          }`}
          placeholder="e.g. Cyberdyne Systems"
        />
        {errors.company && (
          <p id="company-error" className="text-xs text-red-500 font-semibold mt-1">
            {errors.company}
          </p>
        )}
      </div>

      {/* Email Input */}
      <div>
        <label htmlFor="lead-email" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5 transition-colors duration-200">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="lead-email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className={`w-full px-3.5 py-3 border rounded-xl text-sm focus:outline-none transition-colors dark:text-slate-100 ${
            errors.email 
              ? 'border-red-300 focus:border-red-500 bg-red-50/20 dark:border-red-900/60 dark:bg-red-950/20' 
              : 'border-slate-200 focus:border-blue-500/60 bg-white dark:bg-slate-900 dark:border-slate-700'
          }`}
          placeholder="e.g. sarah@cyberdyne.io"
        />
        {errors.email && (
          <p id="email-error" className="text-xs text-red-500 font-semibold mt-1">
            {errors.email}
          </p>
        )}
      </div>

      {/* Phone Input */}
      <div>
        <label htmlFor="lead-phone" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5 transition-colors duration-200">
          Phone Number
        </label>
        <input
          type="tel"
          id="lead-phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-3.5 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm dark:text-slate-100 focus:outline-none focus:border-blue-500/60 transition-colors"
          placeholder="e.g. +1 (555) 123-4567"
        />
      </div>

      {/* Grid: Status and Source Selection Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Status Dropdown */}
        <div>
          <label htmlFor="lead-status" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5 transition-colors duration-200">
            Status
          </label>
          <select
            id="lead-status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3.5 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm dark:text-slate-200 focus:outline-none focus:border-blue-500/60 transition-colors cursor-pointer"
          >
            {statusOptions.map((opt) => (
              <option key={opt} value={opt} className="dark:bg-slate-800 dark:text-slate-200">
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Source Dropdown */}
        <div>
          <label htmlFor="lead-source" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5 transition-colors duration-200">
            Source
          </label>
          <select
            id="lead-source"
            name="source"
            value={formData.source}
            onChange={handleChange}
            className="w-full px-3.5 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm dark:text-slate-200 focus:outline-none focus:border-blue-500/60 transition-colors cursor-pointer"
          >
            {sourceOptions.map((opt) => (
              <option key={opt} value={opt} className="dark:bg-slate-800 dark:text-slate-200">
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Button Group Controls: full-width stack on mobile, right-aligned row on sm+ */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700/60 transition-colors duration-200">
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto min-h-[44px] px-5 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-sm transition-colors active:scale-95 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="w-full sm:w-auto min-h-[44px] px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-colors active:scale-95 shadow-md shadow-blue-500/10 cursor-pointer"
        >
          {initialData ? 'Save Changes' : 'Create Lead'}
        </button>
      </div>
    </form>
  );
};

export default LeadForm;

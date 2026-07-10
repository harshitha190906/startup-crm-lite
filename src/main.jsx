import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { LeadProvider } from './context/LeadProvider'; // Import Lead Provider component
import { ThemeProvider } from './context/ThemeProvider'; // Import Theme Provider component

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* LeadProvider wraps ThemeProvider, ensuring global data is accessible across the application shell */}
    <LeadProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </LeadProvider>
  </StrictMode>
);

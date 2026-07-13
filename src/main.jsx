import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext'; // Import Auth Provider component
import { LeadProvider } from './context/LeadProvider'; // Import Lead Provider component
import { ThemeProvider } from './context/ThemeProvider'; // Import Theme Provider component

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LeadProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </LeadProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);

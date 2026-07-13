import AppRoutes from './routes'; // Import the defined routing layout which lists routes and Sidebar

/**
 * App component: Main entry point of the React application.
 * Wraps the routing setup in BrowserRouter to enable React Router DOM routing.
 */
const App = () => {
  return (
    /* AppRoutes: Main application routing and core page structures */
    <AppRoutes />
  );
};

export default App; // Export App component as default
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import './App.css';
import AppRoutes from './routes/AppRoutes';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Función para manejar el login
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Función para manejar el logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Asegurarte de que el Sidebar se muestre correctamente al actualizar el estado de autenticación
  return (
    <Router>
      <div className="app">
        {!isAuthenticated ? (
          <AppRoutes onLogin={handleLogin} isAuthenticated={isAuthenticated} />
        ) : (
          <>
            <Sidebar onLogout={handleLogout} />
            <div className="content">
              <AppRoutes onLogin={handleLogin} isAuthenticated={isAuthenticated} />
            </div>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;

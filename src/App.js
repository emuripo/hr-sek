import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './components/SideBar/Sidebar';
import './App.css';
import AppRoutes from './routes/AppRoutes'; 
import 'mdb-react-ui-kit/dist/css/mdb.min.css';

function App() {
  // Estado para verificar si el usuario está autenticado
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Función para manejar el login
  const handleLogin = () => {
    setIsAuthenticated(true);  
  };

  // useEffect para comprobar si el token está en localStorage al cargar la aplicación
  useEffect(() => {
    const token = localStorage.getItem('token');  // Verificar si hay un token almacenado
    if (token) {
      setIsAuthenticated(true);  // Si hay un token, autenticar automáticamente
    }
  }, []);  // Se ejecuta solo una vez al cargar la app

  return (
    <Router>
      <div className="app">
        {!isAuthenticated ? (
          <AppRoutes onLogin={handleLogin} isAuthenticated={isAuthenticated} />  
        ) : (
          <>
            <Sidebar />
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

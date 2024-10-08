import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Importar las páginas
import Dashboard from '../pages/Dashboard';
import Empleados from '../pages/Empleados';
import Nomina from '../pages/Nomina';
import Solicitudes from '../pages/Solicitudes';
import Reportes from '../pages/Reportes';
import Login from '../pages/Login';
import '../styles/Login.css';

function AppRoutes() {
  // Estado para el token y la autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate(); // Para redirigir al usuario

  // Verificar si el token está en localStorage cuando se monta el componente
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true); // Si hay un token, consideramos al usuario autenticado
    }
  }, []);

  // Función para manejar el login exitoso
  const handleLogin = () => {
    const token = localStorage.getItem('token'); // Obtiene el token después del login
    if (token) {
      setIsAuthenticated(true); // Marca al usuario como autenticado
      navigate('/'); // Redirigir al dashboard o página principal
    }
  };

  return (
    <Routes>
      {!isAuthenticated ? (
        <>
          {/* Rutas para usuarios no autenticados */}
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" />} />  
        </>
      ) : (
        <>
          {/* Rutas para usuarios autenticados */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/empleados" element={<Empleados />} />
          <Route path="/nomina" element={<Nomina />} />
          <Route path="/solicitudes" element={<Solicitudes />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/login" element={<Navigate to="/" />} /> {/* Redirige si intenta acceder al login estando autenticado */}
        </>
      )}
    </Routes>
  );
}

export default AppRoutes;

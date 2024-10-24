import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; // Importar el decodificador de JWT

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // Estado para almacenar el rol del usuario

  const handleLogin = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Decodificar el token
        setUserRole(decodedToken.role); // Asignar el rol del usuario desde el token
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        setIsAuthenticated(false);
        setUserRole(null);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserRole(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.role); // Establecer el rol al montar el componente
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        setIsAuthenticated(false);
        setUserRole(null);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;

import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; // Importar correctamente

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState(''); // Estado para el nombre de usuario

  const handleLogin = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log('Token decodificado:', decodedToken); // Para depuración
      setUsername(decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']); // Establecer nombre de usuario
      setUserRole(decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']); // Obtener rol desde el token
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserRole(null);
    setUsername(''); // Limpiar nombre de usuario al cerrar sesión
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log('Token decodificado en useEffect:', decodedToken); // Agregar este log
      setUsername(decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']); // Establecer nombre de usuario
      setUserRole(decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']); // Obtener rol desde el token
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, username, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;

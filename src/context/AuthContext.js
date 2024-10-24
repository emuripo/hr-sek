import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';  // Mantener la importación correcta para ti

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const handleLogin = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log('Token decodificado:', decodedToken);

      // Ajustar cómo obtenemos el rol
      const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      setUserRole(role);
      setIsAuthenticated(true);
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
      const decodedToken = jwtDecode(token);
      console.log('Token decodificado en useEffect:', decodedToken);

      // Ajustar cómo obtenemos el rol
      const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      setUserRole(role);
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;

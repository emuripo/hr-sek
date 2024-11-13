import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; 

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState(''); 
  const [idEmpleado, setIdEmpleado] = useState(null); 
  const [permissions, setPermissions] = useState([]); 

  const handleLogin = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log('Token decodificado:', decodedToken); 
      setUsername(decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']);
      setUserRole(decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
      setIdEmpleado(decodedToken['IdEmpleado']); // Asegúrate de que `IdEmpleado` esté en el token
      setPermissions(decodedToken['Permission'] || []); // Asigna permisos si están en el token
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserRole(null);
    setUsername('');
    setIdEmpleado(null); 
    setPermissions([]); 
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log('Token decodificado en useEffect:', decodedToken);
        setUsername(decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']);
        setUserRole(decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
        setIdEmpleado(decodedToken['IdEmpleado']);
        setPermissions(decodedToken['Permission'] || []);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        handleLogout(); // Si el token no es válido, hacer logout
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        username,
        idEmpleado,
        permissions,
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;

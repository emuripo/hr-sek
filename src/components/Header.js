import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';

function Header() {
  const { username, isAuthenticated } = useContext(AuthContext); // Obtener el nombre de usuario y autenticación

  return (
    <div style={{ position: 'absolute', top: 0, right: 0, padding: '10px', fontSize: '18px', backgroundColor: '#f0f0f0' }}>
      {isAuthenticated && username ? `Bienvenido, ${username}` : 'No autenticado'} {/* Mostrar el nombre del usuario si está autenticado */}
    </div>
  );
}

export default Header;

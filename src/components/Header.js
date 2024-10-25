import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import '../styles/Header.css'; // Importar el archivo CSS

function Header() {
  const { username, isAuthenticated } = useContext(AuthContext);

  return (
    <div className="header-container">
      {isAuthenticated && username ? `Bienvenido, ${username}` : 'No autenticado'}
    </div>
  );
}

export default Header;

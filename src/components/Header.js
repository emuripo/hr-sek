import React, { useContext } from 'react'; 
import { useLocation } from 'react-router-dom'; // Importar useLocation
import AuthContext from '../context/AuthContext';
import '../styles/Header.css'; // Importar el archivo CSS

function Header() {
  const { username, isAuthenticated } = useContext(AuthContext);
  const location = useLocation(); // Obtener la ubicación actual

  // Verificar si la ruta es '/login'
  if (location.pathname === '/login') {
    return null; // No renderizar el Header en la página de login
  }

  return (
    <div className="header-container">
      {isAuthenticated && username ? `Bienvenido, ${username}` : 'No autenticado'}
    </div>
  );
}

export default Header;

// src/components/Sidebar/Sidebar.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import './Sidebar.css'; // Asegúrate de crear o ajustar este archivo para estilos

function Sidebar() {
  const { handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  const onLogoutClick = () => {
    handleLogout();       // Actualiza el estado de autenticación
    navigate('/login');   // Redirige al login
  };

  return (
    <div className="sidebar">
      <h2>Gestión de Recursos Humanos</h2>
      <ul>
        <li>
          <Link to="/">Dashboard</Link>
        </li>
        <li>
          <Link to="/empleados">Empleados</Link>
        </li>
        <li>
          <Link to="/nomina">Nómina</Link>
        </li>
        <li>
          <Link to="/solicitudes">Solicitudes</Link>
        </li>
        <li>
          <Link to="/reportes">Reportes</Link>
        </li>
        <li>
          <button onClick={onLogoutClick} className="logout-button">Cerrar sesión</button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;

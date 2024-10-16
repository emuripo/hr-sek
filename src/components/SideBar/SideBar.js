import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import './Sidebar.css'; 
import logo from '../../assets/imagenes/costa_rica_120.png'; // Importar el logo

function Sidebar() {
  const { handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  const onLogoutClick = () => {
    handleLogout();       
    navigate('/login');   
  };

  return (
    <div className="sidebar">
      {/* Cambiar el h2 por la imagen del logo */}
      <div className="sidebar-logo">
        <img src={logo} alt="logo" className="logo-image" />
      </div>
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

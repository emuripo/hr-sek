import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { Collapse, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import './Sidebar.css';
import logo from '../../assets/imagenes/costa_rica_120.png';

function Sidebar() {
  const { handleLogout, userRole } = useContext(AuthContext);  
  const navigate = useNavigate();
  const [openGestionHorarios, setOpenGestionHorarios] = useState(false); 

  const onLogoutClick = () => {
    handleLogout();
    navigate('/login');
  };

  const handleGestionHorariosClick = () => {
    setOpenGestionHorarios(!openGestionHorarios);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="logo" className="logo-image" />
      </div>

      <ul>
        <li>
          <Link to="/">Dashboard</Link>
        </li>

        {/* Opciones para RRHH */}
        {userRole === 'RRHH' && (
          <>
            <li>
              <Link to="/empleados">Empleados</Link>
            </li>
            <li>
              <Link to="/nomina">Nómina</Link>
            </li>
            <li>
              <Link to="/SolicitudesRRHH">Solicitudes</Link>
            </li>
            <li>
              <Link to="/AsistenciasEmpleado">Asistencia</Link>
            </li>

            {/* Gestión de Horarios */}
            <li onClick={handleGestionHorariosClick}>
              <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                <ListItemText primary="Gestión de Horarios" />
                {openGestionHorarios ? <ExpandLess /> : <ExpandMore />}
              </div>
            </li>
            <Collapse in={openGestionHorarios} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button component={Link} to="/RegistrarTurno">
                  <ListItemText primary="Turno" />
                </ListItem>
                <ListItem button component={Link} to="/RegistrarHorario">
                  <ListItemText primary="Horario" />
                </ListItem>
                <ListItem button component={Link} to="/EmpleadoTurno">
                  <ListItemText primary="Empleado Turno" />
                </ListItem>
              </List>
            </Collapse>

            <li>
              <Link to="/reportes">Reportes</Link>
            </li>
          </>
        )}

        {/* Opciones para Jefatura */}
        {userRole === 'Jefatura' && (
          <>
            <li>
              <Link to="/empleados">Empleados</Link>
            </li>
            <li>
              <Link to="/nomina">Nómina</Link>
            </li>
            <li>
              <Link to="/VistaJefatura">Solicitudes</Link>
            </li>
            <li>
              <Link to="/reportes">Reportes</Link>
            </li>
          </>
        )}

        {/* Opciones para Usuario */}
        {userRole === 'Usuario' && (
          <>
            <li>
              <Link to="/mis-solicitudes">Mis Solicitudes</Link>
            </li>
            <li>
              <Link to="/CrearSolicitud">Crear una Solicitud</Link>
            </li>
            <li>
              <Link to="/RegistroAsistencia">Asistencia</Link>
            </li>
          </>
        )}

        {/* Opciones para Admin */}
        {userRole === 'Admin' && (
          <>
            <li>
              <Link to="/empleados">Empleados</Link>
            </li>
          </>
        )}

        <li>
          <button onClick={onLogoutClick} className="logout-button">Cerrar sesión</button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;

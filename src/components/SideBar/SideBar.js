import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { Collapse, List, ListItem, ListItemText } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import './Sidebar.css';
import logo from '../../assets/imagenes/costa_rica_120.png';

function Sidebar() {
  const { handleLogout, userRole } = useContext(AuthContext);
  const navigate = useNavigate();

  // Estados para abrir/cerrar submenús
  const [openGestionNomina, setOpenGestionNomina] = useState(false);
  const [openGestionPeriodos, setOpenGestionPeriodos] = useState(false);
  const [openGestionHorarios, setOpenGestionHorarios] = useState(false);
  const [openGestionDeducciones, setOpenGestionDeducciones] = useState(false);
  const [openGestionBonificaciones, setOpenGestionBonificaciones] = useState(false);
  const [openGestionAguinaldos, setOpenGestionAguinaldos] = useState(false);
  const [openGestionCesantias, setOpenGestionCesantias] = useState(false);

  const onLogoutClick = () => {
    handleLogout();
    navigate('/login');
  };

  const toggleMenu = (setter) => () => {
    setter((prev) => !prev);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="logo" className="logo-image" />
      </div>

      <ul>

        {/* Opciones para RRHH */}
        {userRole === 'RRHH' && (
          <>
            <li>
              <Link to="/">Dashboard</Link>
            </li>

            <li>
              <Link to="/empleados">Gestion Empleados</Link>
            </li>
            
            <li>
              <Link to="/SolicitudesRRHH">Solicitudes</Link>
            </li>
            <li>
              <Link to="/AsistenciasEmpleado">Asistencia</Link>
            </li>

            {/* Gestión de Nómina */}
            <li onClick={toggleMenu(setOpenGestionNomina)}>
              <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <ListItemText primary="Gestión de Nómina" style={{ color: 'white' }}/>
                {openGestionNomina ? <ExpandLess /> : <ExpandMore />}
              </div>
            </li>
            <Collapse in={openGestionNomina} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button component={Link} to="/ConsultarNomina">
                  <ListItemText primary="Consultar Nómina" style={{ color: 'white' }}/>
                </ListItem>
                <ListItem button component={Link} to="/CrearEditarNomina">
                  <ListItemText primary="Crear una Nómina/Editar" style={{ color: 'white' }}/>
                </ListItem>
              </List>
            </Collapse>

            {/* Gestión de Periodos */}
            <li onClick={toggleMenu(setOpenGestionPeriodos)}>
              <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <ListItemText primary="Gestión de Periodos" />
                {openGestionPeriodos ? <ExpandLess /> : <ExpandMore />}
              </div>
            </li>
            <Collapse in={openGestionPeriodos} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button component={Link} to="/ConsultarPeriodos">
                  <ListItemText primary="Consultar Periodos" style={{ color: 'white' }}/>
                </ListItem>
                <ListItem button component={Link} to="/CrearEditarPeriodo">
                  <ListItemText primary="Crear un Periodo" style={{ color: 'white' }}/>
                </ListItem>
              </List>
            </Collapse>

            {/* Gestión de Deducciones */}
            <li onClick={toggleMenu(setOpenGestionDeducciones)}>
              <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <ListItemText primary="Gestión de Deducciones" style={{ color: 'white' }}/>
                {openGestionDeducciones ? <ExpandLess /> : <ExpandMore />}
              </div>
            </li>
            <Collapse in={openGestionDeducciones} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button component={Link} to="/ConsultarDeducciones">
                  <ListItemText primary="Consultar Deducciones" style={{ color: 'white' }} />
                </ListItem>
                <ListItem button component={Link} to="/CrearEditarDeduccion">
                  <ListItemText primary="Crear una Deducción/Editar" style={{ color: 'white' }}/>
                </ListItem>
              </List>
            </Collapse>

            {/* Gestión de Bonificaciones */}
            <li onClick={toggleMenu(setOpenGestionBonificaciones)}>
              <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <ListItemText primary="Gestión de Bonificaciones" style={{ color: 'white' }}/>
                {openGestionBonificaciones ? <ExpandLess /> : <ExpandMore />}
              </div>
            </li>
            <Collapse in={openGestionBonificaciones} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button component={Link} to="/ConsultarBonificaciones">
                  <ListItemText primary="Consultar Bonificaciones" style={{ color: 'white' }} />
                </ListItem>
                <ListItem button component={Link} to="/CrearEditarBonificacion">
                  <ListItemText primary="Crear una Bonificación/Editar" style={{ color: 'white' }} />
                </ListItem>
              </List>
            </Collapse>

            {/* Gestión de Aguinaldos */}
            <li onClick={toggleMenu(setOpenGestionAguinaldos)}>
              <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <ListItemText primary="Gestión de Aguinaldos" />
                {openGestionAguinaldos ? <ExpandLess /> : <ExpandMore />}
              </div>
            </li>
            <Collapse in={openGestionAguinaldos} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button component={Link} to="/ConsultarAguinaldos">
                  <ListItemText primary="Consultar Aguinaldos" style={{ color: 'white' }}/>
                </ListItem>
                <ListItem button component={Link} to="/CrearEditarAguinaldo">
                  <ListItemText primary="Crear Aguinaldos/Editar" style={{ color: 'white' }}/>
                </ListItem>
              </List>
            </Collapse>

            {/* Gestión de Cesantías */}
            <li onClick={toggleMenu(setOpenGestionCesantias)}>
              <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <ListItemText primary="Gestión de Cesantías" style={{ color: 'white' }}/>
                {openGestionCesantias ? <ExpandLess /> : <ExpandMore />}
              </div>
            </li>
            <Collapse in={openGestionCesantias} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button component={Link} to="/ConsultarCesantias">
                  <ListItemText primary="Consultar Cesantías" style={{ color: 'white' }}/>
                </ListItem>
                <ListItem button component={Link} to="/CrearEditarCesantia">
                  <ListItemText primary="Crear Cesantías/Editar" style={{ color: 'white' }}/>
                </ListItem>
              </List>
            </Collapse>

            {/* Gestión de Horarios */}
            <li onClick={toggleMenu(setOpenGestionHorarios)}>
              <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <ListItemText primary="Gestión de Horarios" />
                {openGestionHorarios ? <ExpandLess /> : <ExpandMore />}
              </div>
            </li>
            <Collapse in={openGestionHorarios} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button component={Link} to="/RegistrarTurno">
                  <ListItemText primary="Turno" style={{ color: 'white' }}/>
                </ListItem>
                <ListItem button component={Link} to="/RegistrarHorario">
                  <ListItemText primary="Horario" style={{ color: 'white' }}/>
                </ListItem>
                <ListItem button component={Link} to="/EmpleadoTurno">
                  <ListItemText primary="Empleado Turno" style={{ color: 'white' }}/>
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
              <Link to="/">Dashboard</Link>
            </li>
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
            <li>
              <Link to="/MisVacaciones">Consulta de Vacaciones</Link>
            </li>
          </>
        )}

        {/* Opciones para Admin */}
        {userRole === 'Admin' && (
          <>
            <li>
              <Link to="/empleados">Empleados</Link>
            </li>
            <li>
              <Link to="/ListaUsuarios">Listado de Usuarios</Link>
            </li>
            <li>
              <Link to="/CrearUsuario">Crear Usuarios</Link>
            </li>
            <li>
              <Link to="/LogsView">Logs del Sistema</Link>
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

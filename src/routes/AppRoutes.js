import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Layout from '../components/layout/Layout';
//Páginas principales
import Dashboard from '../pages/Dashboard';
import Empleados from '../pages/empleados/Empleados';
import Nomina from '../pages/nomina/Nomina';
import Reportes from '../pages/Reportes';
import Login from '../components/Auth/Login';
//Nominas
import CrearEditarPeriodo from '../pages/nomina/periodo/CrearEditarPeriodo';
import ConsultarPeriodos from '../pages/nomina/periodo/ConsultarPeriodos';
//bonificaciones
import CrearEditarBonificacion from '../pages/nomina/bonificacion/CrearEditarBonificacion'
import ConsultarBonificaciones from '../pages/nomina/bonificacion/ConsultarBonificaciones'
//aguinaldos
import CrearEditarAguinaldo from '../pages/nomina/aguinaldo/CrearEditarAguinaldo'
import ConsultarAguinaldos from '../pages/nomina/aguinaldo/ConsultarAguinaldos'

//Solicitudes
import MisSolicitudes from '../pages/solicitudes/user/MisSolicitudes';
import CrearSolicitud from '../pages/solicitudes/CrearSolicitudes/CrearSolicitud';
import VistaJefatura from '../pages/solicitudes/jefatura/VistaJefatura';
import SolicitudesRRHH from '../pages/solicitudes/rrhh/SolicitudesRRHH';
//Gestion Asistencia
import AsistenciasEmpleado from '../pages/asistencia/AsistenciasEmpleado';
import RegistroAsistencia from '../pages/empleados/RegistroAsistencia';
import RegistrarTurno from '../pages/asistencia/RegistrarTurno';
import RegistrarHorario from '../pages/asistencia/RegistrarHorario';
import EmpleadoTurno from '../pages/asistencia/EmpleadoTurno';
//Adminsitracion
import CrearUsuario from '../pages/administrador/CrearUsuario';
import ListaUsuarios from '../pages/administrador/ListaUsuarios';
//Vacaciones
import MisVacaciones from '../pages/empleados/MisVacaciones';

function AppRoutes() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Routes>
      {!isAuthenticated ? (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/empleados" element={<Empleados />} />
            <Route path="/nomina" element={<Nomina />} />
            <Route path="/reportes" element={<Reportes />} />

            {/* Rutas para Nomina */}
            <Route path="/CrearEditarPeriodo" element={<CrearEditarPeriodo />} />
            <Route path="/ConsultarPeriodos" element={<ConsultarPeriodos/>} />
            <Route path="/CrearEditarBonificacion" element={<CrearEditarBonificacion/>} />
            <Route path="/ConsultarBonificaciones" element={<ConsultarBonificaciones/>} />
            <Route path="/CrearEditarAguinaldo" element={<CrearEditarAguinaldo/>} />
            <Route path="/ConsultarAguinaldos" element={<ConsultarAguinaldos/>} />

            {/* Rutas para Asistencia */}
            <Route path="/RegistroAsistencia" element={<RegistroAsistencia />} />
            <Route path="/AsistenciasEmpleado" element={<AsistenciasEmpleado />} />
            <Route path="/RegistrarTurno" element={<RegistrarTurno />} />
            <Route path="/RegistrarHorario" element={<RegistrarHorario />} />
            <Route path="/EmpleadoTurno" element={<EmpleadoTurno />} />

            {/* Rutas para solicitudes */}
            <Route path="/mis-solicitudes" element={<MisSolicitudes />} />
            <Route path="/CrearSolicitud" element={<CrearSolicitud />} />
            <Route path="/VistaJefatura" element={<VistaJefatura />} />
            <Route path="/SolicitudesRRHH" element={<SolicitudesRRHH />} />

            {/* Rutas para Administrador */}
            <Route path="/CrearUsuario" element={<CrearUsuario />} />
            <Route path="/ListaUsuarios" element={<ListaUsuarios />} />

            {/* Rutas para Administrador */}
            <Route path="/MisVacaciones" element={<MisVacaciones />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </>
      )}
    </Routes>
  );
}

export default AppRoutes;

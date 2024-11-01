// src/routes/AppRoutes.js
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Layout from '../components/layout/Layout';

// Páginas principales
import Dashboard from '../pages/Dashboard';
import Empleados from '../pages/empleados/Empleados';
import Nomina from '../pages/nomina/Nomina';
import Reportes from '../pages/Reportes';
import Login from '../components/Auth/Login';

// Solicitudes
import MisSolicitudes from '../pages/solicitudes/user/MisSolicitudes';
import CrearSolicitud from '../pages/solicitudes/CrearSolicitudes/CrearSolicitud';
import VistaJefatura from '../pages/solicitudes/jefatura/VistaJefatura';
import SolicitudesRRHH from '../pages/solicitudes/rrhh/SolicitudesRRHH';
import AsistenciasEmpleado from '../pages/asistencia/AsistenciasEmpleado';
import RegistroAsistencia from '../pages/empleados/RegistroAsistencia';
import RegistrarTurno from '../pages/asistencia/RegistrarTurno';

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
            <Route path="/RegistroAsistencia" element={<RegistroAsistencia />} />
            <Route path="/AsistenciasEmpleado" element={<AsistenciasEmpleado />} />
            <Route path="/RegistrarTurno" element={<RegistrarTurno />} />

            {/* Rutas para solicitudes */}
            <Route path="/mis-solicitudes" element={<MisSolicitudes />} />
            <Route path="/CrearSolicitud" element={<CrearSolicitud />} />
            <Route path="/VistaJefatura" element={<VistaJefatura />} />
            <Route path="/SolicitudesRRHH" element={<SolicitudesRRHH />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </>
      )}
    </Routes>
  );
}

export default AppRoutes;

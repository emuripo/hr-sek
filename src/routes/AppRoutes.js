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

            {/* Rutas para solicitudes */}
            <Route path="/mis-solicitudes" element={<MisSolicitudes />} />
            <Route path="/CrearSolicitud" element={<CrearSolicitud />} />
            <Route path="/VistaJefatura" element={<VistaJefatura />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </>
      )}
    </Routes>
  );
}

export default AppRoutes;

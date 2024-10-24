// src/routes/AppRoutes.js
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

// Importar el componente Layout
import Layout from '../components/layout/Layout';

// Importar las páginas
import Dashboard from '../pages/Dashboard';
import Empleados from '../pages/empleados/Empleados';
import Nomina from '../pages/nomina/Nomina';
import Solicitudes from '../pages/solicitudes/solicitudesDocumentacion/VerSolicitudesDoc';
import Reportes from '../pages/Reportes';
import Login from '../components/Auth/Login';

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
            <Route path="/solicitudes" element={<Solicitudes />} />
            <Route path="/reportes" element={<Reportes />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </>
      )}
    </Routes>
  );
}

export default AppRoutes;

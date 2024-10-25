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
import MisSolicitudes from '../pages/solicitudes/MisSolicitudes';
// import VerSolicitudesDoc from '../pages/solicitudes/solicitudesDocumentacion/VerSolicitudesDoc';
// import CrearSolicitudDoc from '../pages/solicitudes/solicitudesDocumentacion/CrearSolicitudDoc';
// import VerSolicitudesHoras from '../pages/solicitudes/solicitudesHorasExtra/VerSolicitudesHoras';
// import CrearSolicitudHoras from '../pages/solicitudes/solicitudesHorasExtra/CrearSolicitudHoras';
// import VerSolicitudesPersonales from '../pages/solicitudes/solicitudesPersonales/VerSolicitudesPersonales';
// import CrearSolicitudPersonal from '../pages/solicitudes/solicitudesPersonales/CrearSolicitudPersonal';
// import VerSolicitudesVacaciones from '../pages/solicitudes/solicitudesVacaciones/VerSolicitudesVacaciones';
// import CrearSolicitudVacaciones from '../pages/solicitudes/solicitudesVacaciones/CrearSolicitudVacaciones';

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
            {/* <Route path="/solicitudes/documentacion" element={<VerSolicitudesDoc />} />
            <Route path="/solicitudes/documentacion/crear" element={<CrearSolicitudDoc />} />
            <Route path="/solicitudes/horas-extra" element={<VerSolicitudesHoras />} />
            <Route path="/solicitudes/horas-extra/crear" element={<CrearSolicitudHoras />} />
            <Route path="/solicitudes/personales" element={<VerSolicitudesPersonales />} />
            <Route path="/solicitudes/personales/crear" element={<CrearSolicitudPersonal />} />
            <Route path="/solicitudes/vacaciones" element={<VerSolicitudesVacaciones />} />
            <Route path="/solicitudes/vacaciones/crear" element={<CrearSolicitudVacaciones />} /> */}

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </>
      )}
    </Routes>
  );
}

export default AppRoutes;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/SideBar/SideBar.js';
import './App.css';

// Componentes de las páginas
import Dashboard from './pages/Dashboard.js';
import Empleados from './pages/Empleados.js';  // Actualizamos a Empleados
import Nomina from './pages/Nomina';  // Actualizamos a Nómina
import Solicitudes from './pages/Solicitudes';  // Actualizamos a Solicitudes
import Reportes from './pages/Reportes';  // Actualizamos a Reportes

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/empleados" element={<Empleados />} />  {/* Nueva ruta */}
            <Route path="/nomina" element={<Nomina />} />  {/* Nueva ruta */}
            <Route path="/solicitudes" element={<Solicitudes />} />  {/* Nueva ruta */}
            <Route path="/reportes" element={<Reportes />} />  {/* Nueva ruta */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

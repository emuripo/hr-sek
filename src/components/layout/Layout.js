// src/components/Layout.js
import React from 'react';
import Sidebar from '../SideBar/SideBar';
import { Outlet } from 'react-router-dom';
import './Layout.css'; // Asegúrate de crear o ajustar este archivo para estilos

function Layout() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;

// src/pages/solicitudes/MisSolicitudes.js

import React, { useEffect, useState } from 'react';
import { getTodasSolicitudes } from '../../services/solicitudesService/solicitudesCombinadasService';
import { DataGrid } from '@mui/x-data-grid';

const MisSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const data = await getTodasSolicitudes();
        setSolicitudes(data);
      } catch (error) {
        console.error('Error al obtener solicitudes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitudes();
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'tipo', headerName: 'Tipo de Solicitud', width: 150 },
    { field: 'fechaSolicitud', headerName: 'Fecha de Creación', width: 180 },
    // Añade más columnas según los datos que necesites mostrar
  ];

  return (
    <div style={{ height: 400, width: '100%' }}>
      <h1>Mis Solicitudes</h1>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <DataGrid 
          rows={solicitudes} 
          columns={columns} 
          pageSize={5} 
          getRowId={(row) => `${row.tipo}-${row.idSolicitudDocumento || row.idSolicitudHoras || row.idSolicitudPersonal || row.idSolicitudVacaciones}`}
        />
      )}
    </div>
  );
};

export default MisSolicitudes;

import React, { useEffect, useState, useContext } from 'react';
import { getSolicitudesByEmpleado } from '../../../services/solicitudesService/solicitudesUsuarioService';
import { DataGrid } from '@mui/x-data-grid';
import { CircularProgress, Typography, Box, Paper, Tabs, Tab } from '@mui/material';
import AuthContext from '../../../context/AuthContext';

const MisSolicitudes = () => {
  const { idEmpleado } = useContext(AuthContext);
  const [solicitudes, setSolicitudes] = useState({
    documentos: [],
    personales: [],
    horasExtra: [],
    vacaciones: []
  });
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      if (!idEmpleado) return;

      try {
        const data = await getSolicitudesByEmpleado(idEmpleado);
        console.log("Datos obtenidos:", data);

        setSolicitudes({
          documentos: data.filter((sol) => sol.tipo === 'Documento'),
          personales: data.filter((sol) => sol.tipo === 'Personal'),
          horasExtra: data.filter((sol) => sol.tipo === 'Horas Extra'),
          vacaciones: data.filter((sol) => sol.tipo === 'Vacaciones')
        });

        console.log("Solicitudes clasificadas:", {
          documentos: data.filter((sol) => sol.tipo === 'Documento'),
          personales: data.filter((sol) => sol.tipo === 'Personal'),
          horasExtra: data.filter((sol) => sol.tipo === 'Horas Extra'),
          vacaciones: data.filter((sol) => sol.tipo === 'Vacaciones')
        });
      } catch (error) {
        console.error('Error al obtener solicitudes del empleado:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitudes();
  }, [idEmpleado]);

  const handleTabChange = (event, newValue) => setTabIndex(newValue);

  const columnsConfig = {
    documentos: [
      { field: 'tipoDocumento', headerName: 'Tipo de Documento', width: 200, headerAlign: 'center' },
      { field: 'descripcion', headerName: 'Descripción', width: 300, headerAlign: 'center' },
      { field: 'fechaSolicitud', headerName: 'Fecha de Solicitud', width: 200, headerAlign: 'center' },
      { field: 'estado', headerName: 'Estado', width: 150, headerAlign: 'center' },
    ],
    personales: [
      { field: 'motivo', headerName: 'Motivo', width: 300, headerAlign: 'center' },
      { field: 'fechaSolicitud', headerName: 'Fecha de Solicitud', width: 200, headerAlign: 'center' },
      { field: 'estado', headerName: 'Estado', width: 150, headerAlign: 'center' },
    ],
    horasExtra: [
      { field: 'cantidadHoras', headerName: 'Horas Solicitadas', width: 200, headerAlign: 'center' },
      { field: 'fechaTrabajo', headerName: 'Fecha de Trabajo', width: 200, headerAlign: 'center' },
      { field: 'estado', headerName: 'Estado', width: 150, headerAlign: 'center' },
    ],
    vacaciones: [
      { field: 'cantidadDias', headerName: 'Días Solicitados', width: 200, headerAlign: 'center' },
      { field: 'fechaInicio', headerName: 'Fecha de Inicio', width: 200, headerAlign: 'center' },
      { field: 'fechaFin', headerName: 'Fecha de Fin', width: 200, headerAlign: 'center' },
      { field: 'estado', headerName: 'Estado', width: 150, headerAlign: 'center' },
    ]
  };

  const tabNames = ['Documentación', 'Personal', 'Horas Extra', 'Vacaciones'];

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#263060', textAlign: 'center', mb: 2 }}>
        Mis Solicitudes
      </Typography>

      <Tabs value={tabIndex} onChange={handleTabChange} centered>
        {tabNames.map((name, index) => (
          <Tab key={index} label={name} />
        ))}
      </Tabs>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3} sx={{ height: '70vh', width: '100%', mt: 2 }}>
          <DataGrid
            rows={solicitudes[Object.keys(solicitudes)[tabIndex]]}
            columns={columnsConfig[Object.keys(solicitudes)[tabIndex]]}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            checkboxSelection
            disableSelectionOnClick
            getRowId={(row) => row.id || row.idSolicitudDocumento || row.idSolicitudHoras || row.idSolicitudPersonal || row.idSolicitudVacaciones}
            getCellClassName={(params) => {
              if (params.field === 'estado') {
                switch (params.value) {
                  case 'Pendiente':
                    return 'estadoPendiente';
                  case 'Aprobada':
                    return 'estadoAprobada';
                  case 'Rechazada':
                    return 'estadoRechazada';
                  default:
                    return '';
                }
              }
              return '';
            }}
            components={{
              NoRowsOverlay: () => (
                <Typography sx={{ padding: 2 }}>No se encontraron solicitudes.</Typography>
              ),
            }}
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#000000',
                color: '#000000',
                fontSize: '18px',
                fontWeight: 'bold',
                textAlign: 'center',
              },
              '& .MuiDataGrid-cell': {
                textAlign: 'center',
              },
              '& .estadoPendiente': {
                backgroundColor: '#FFF3E0', 
                color: '#FB8C00', // Texto 
                fontWeight: 'bold',
              },
              '& .estadoAprobada': {
                backgroundColor: '#E8F5E9', 
                color: '#388E3C', 
                fontWeight: 'bold',
              },
              '& .estadoRechazada': {
                backgroundColor: '#FFEBEE', 
                color: '#D32F2F', 
                fontWeight: 'bold',
              },
            }}
          />
        </Paper>
      )}
    </Box>
  );
};

export default MisSolicitudes;

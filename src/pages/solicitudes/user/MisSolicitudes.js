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
      { field: 'tipoDocumento', headerName: 'Tipo de Documento', width: 200 },
      { field: 'descripcion', headerName: 'Descripción', width: 300 },
      { field: 'fechaSolicitud', headerName: 'Fecha de Solicitud', width: 200 },
      { field: 'estado', headerName: 'Estado', width: 150 },
    ],
    personales: [
      { field: 'motivo', headerName: 'Motivo', width: 300 },
      { field: 'fechaSolicitud', headerName: 'Fecha de Solicitud', width: 200 },
      { field: 'estado', headerName: 'Estado', width: 150 },
    ],
    horasExtra: [
      { field: 'cantidadHoras', headerName: 'Horas Solicitadas', width: 200 },
      { field: 'fechaTrabajo', headerName: 'Fecha de Trabajo', width: 200 },
      { field: 'estado', headerName: 'Estado', width: 150 },
    ],
    vacaciones: [
      { field: 'cantidadDias', headerName: 'Días Solicitados', width: 200 },
      { field: 'fechaInicio', headerName: 'Fecha de Inicio', width: 200 },
      { field: 'fechaFin', headerName: 'Fecha de Fin', width: 200 },
      { field: 'estado', headerName: 'Estado', width: 150 },
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
            components={{
              NoRowsOverlay: () => (
                <Typography sx={{ padding: 2 }}>No se encontraron solicitudes.</Typography>
              ),
            }}
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#263060',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: 'bold',
                textAlign: 'center',
              },
              '& .MuiDataGrid-cell': {
                textAlign: 'center',
              },
            }}
          />
        </Paper>
      )}
    </Box>
  );
};

export default MisSolicitudes;

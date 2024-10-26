import React, { useEffect, useState } from 'react';
import { getTodasSolicitudes } from '../../../services/solicitudesService/solicitudesCombinadasService';
import { DataGrid } from '@mui/x-data-grid';
import { CircularProgress, Typography, Box, Paper, TextField, Chip } from '@mui/material';

const MisSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

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

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredSolicitudes = solicitudes.filter((solicitud) =>
    solicitud.tipo.toLowerCase().includes(filter.toLowerCase())
  );

  const columns = [
    { field: 'tipo', headerName: 'Tipo de Solicitud', width: 150 },
    { field: 'descripcion', headerName: 'Descripción', width: 200 }, // Cambiado a 'Descripción'
    { field: 'fechaSolicitud', headerName: 'Fecha de Creación', width: 200 },
    {
      field: 'estaAprobada',
      headerName: 'Estado',
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Aprobada' : 'Pendiente'}
          color={params.value ? 'success' : 'warning'}
        />
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#263060', textAlign: 'center', mb: 2 }}>
        Mis Solicitudes
      </Typography>

      <TextField
        label="Filtrar por tipo de solicitud"
        variant="outlined"
        value={filter}
        onChange={handleFilterChange}
        sx={{ marginBottom: 2 }}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3} sx={{ height: '70vh', width: '100%' }}>
          <DataGrid
            rows={filteredSolicitudes}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            checkboxSelection
            disableSelectionOnClick
            getRowId={(row) => {
              // Construye un identificador único usando todos los ID posibles y el tipo.
              const uniqueId =
                `${row.idSolicitudDocumento || ''}-${row.idSolicitudHoras || ''}-${row.idSolicitudPersonal || ''}-${row.idSolicitudVacaciones || ''}-${row.tipo || ''}-${row.id || Math.random().toString(36).substr(2, 9)}`;
              return uniqueId;
            }}
            components={{
              NoRowsOverlay: () => (
                <Typography sx={{ padding: 2 }}>No se encontraron solicitudes.</Typography>
              ),
            }}
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#263060',
                color: '#000000',
                fontSize: '16px',
                fontWeight: 'bold',
                textAlign: 'center',
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                color: '#000000',
              },
              '& .MuiDataGrid-columnSeparator': {
                display: 'none',
              },
              '& .MuiDataGrid-cell': {
                textAlign: 'center',
              },
              '& .MuiDataGrid-virtualScrollerRenderZone': {
                '& .MuiDataGrid-row': {
                  backgroundColor: 'white',
                },
              },
            }}
          />
        </Paper>
      )}
    </Box>
  );
};

export default MisSolicitudes;

import React, { useEffect, useState } from 'react';
import { getTodasSolicitudes } from '../../services/solicitudesService/solicitudesCombinadasService';
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
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'tipo', headerName: 'Tipo de Solicitud', width: 150 },
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
            getRowId={(row) =>
              `${row.tipo}-${row.idSolicitudDocumento || row.idSolicitudHoras || row.idSolicitudPersonal || row.idSolicitudVacaciones}`
            }
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#263060', // Color de fondo del encabezado
                color: '#ffffff', // Aseguramos que el color del texto sea blanco
                fontSize: '16px',
              },
              '& .MuiDataGrid-columnSeparator': {
                display: 'none', // Remover las líneas de separación entre los encabezados
              },
            }}
          />
        </Paper>
      )}
    </Box>
  );
};

export default MisSolicitudes;

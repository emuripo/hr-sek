import React, { useEffect, useState } from 'react';
import { getTodasSolicitudes, updateSolicitudEstado } from '../../../services/solicitudesService/solicitudesCombinadasService';
import { DataGrid } from '@mui/x-data-grid';
import { CircularProgress, Typography, Box, Paper, Chip, Button } from '@mui/material';

const JefaturaSolicitudes = () => {
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

  const handleAprobar = async (id, tipo) => {
    try {
      await updateSolicitudEstado(id, tipo, true);
      setSolicitudes((prevSolicitudes) =>
        prevSolicitudes.map((solicitud) =>
          solicitud.idSolicitudDocumento === id ||
          solicitud.idSolicitudHoras === id ||
          solicitud.idSolicitudPersonal === id ||
          solicitud.idSolicitudVacaciones === id
            ? { ...solicitud, estaAprobada: true }
            : solicitud
        )
      );
    } catch (error) {
      console.error('Error al aprobar la solicitud:', error);
    }
  };

  const handleRechazar = async (id, tipo) => {
    try {
      await updateSolicitudEstado(id, tipo, false);
      setSolicitudes((prevSolicitudes) =>
        prevSolicitudes.map((solicitud) =>
          solicitud.idSolicitudDocumento === id ||
          solicitud.idSolicitudHoras === id ||
          solicitud.idSolicitudPersonal === id ||
          solicitud.idSolicitudVacaciones === id
            ? { ...solicitud, estaAprobada: false }
            : solicitud
        )
      );
    } catch (error) {
      console.error('Error al rechazar la solicitud:', error);
    }
  };

  const columns = [
    { field: 'tipo', headerName: 'Tipo de Solicitud', width: 150 },
    { field: 'descripcion', headerName: 'Descripción', width: 250 },
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
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 250,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="success"
            onClick={() => handleAprobar(
              params.row.idSolicitudDocumento ||
              params.row.idSolicitudHoras ||
              params.row.idSolicitudPersonal ||
              params.row.idSolicitudVacaciones,
              params.row.tipo
            )}
            disabled={params.row.estaAprobada === true}
            sx={{ marginRight: 1 }}
          >
            Aprobar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleRechazar(
              params.row.idSolicitudDocumento ||
              params.row.idSolicitudHoras ||
              params.row.idSolicitudPersonal ||
              params.row.idSolicitudVacaciones,
              params.row.tipo
            )}
            disabled={params.row.estaAprobada === false}
          >
            Rechazar
          </Button>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#263060', textAlign: 'center', mb: 2 }}>
        Solicitudes de Jefatura
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3} sx={{ height: '70vh', width: '100%' }}>
          <DataGrid
            rows={solicitudes}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            checkboxSelection
            disableSelectionOnClick
            getRowId={(row) => {
              const uniqueId =
                `${row.idSolicitudDocumento || ''}-${row.idSolicitudHoras || ''}-${row.idSolicitudPersonal || ''}-${row.idSolicitudVacaciones || ''}-${row.tipo || ''}`;
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

export default JefaturaSolicitudes;

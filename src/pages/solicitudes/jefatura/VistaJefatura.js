import React, { useEffect, useState } from 'react';
import { getTodasSolicitudes, updateSolicitudEstado } from '../../../services/solicitudesService/solicitudesCombinadasService';
import { DataGrid } from '@mui/x-data-grid';
import { CircularProgress, Typography, Box, Paper, Chip, Button, Stack, Dialog, DialogContent, DialogActions, DialogTitle, TextField } from '@mui/material';

const VistaJefatura = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openRechazoDialog, setOpenRechazoDialog] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [motivoRechazo, setMotivoRechazo] = useState('');

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

  const handleAprobar = async (solicitud, tipo) => {
    const id = getIdSolicitud(solicitud, tipo);
    if (!id) {
      console.error(`ID inválido para el tipo de solicitud: ${tipo}`, solicitud);
      return;
    }

    try {
      await updateSolicitudEstado(id, tipo, true);
      setSolicitudes((prevSolicitudes) =>
        prevSolicitudes.map((s) =>
          getIdSolicitud(s, tipo) === id ? { ...s, estaAprobada: true, estado: 'Aprobada' } : s
        )
      );
    } catch (error) {
      console.error('Error al aprobar la solicitud:', error);
    }
  };

  const handleOpenRechazoDialog = (solicitud) => {
    setSelectedSolicitud(solicitud);
    setOpenRechazoDialog(true);
  };

  const handleRechazar = async () => {
    const { tipo } = selectedSolicitud;
    const id = getIdSolicitud(selectedSolicitud, tipo);
    if (!id) {
      console.error(`ID inválido para el tipo de solicitud: ${tipo}`, selectedSolicitud);
      return;
    }

    try {
      await updateSolicitudEstado(id, tipo, false, motivoRechazo);
      setSolicitudes((prevSolicitudes) =>
        prevSolicitudes.map((s) =>
          getIdSolicitud(s, tipo) === id ? { ...s, estaAprobada: false, estado: 'Rechazada' } : s
        )
      );
    } catch (error) {
      console.error('Error al rechazar la solicitud:', error);
    } finally {
      setOpenRechazoDialog(false);
      setMotivoRechazo('');
    }
  };

  const getIdSolicitud = (solicitud, tipo) => {
    switch (tipo) {
      case 'Documento':
        return solicitud.idSolicitudDocumento || solicitud.id; // Asegura obtener el ID correcto
      case 'Horas Extra':
        return solicitud.idSolicitudHorasExtra || solicitud.id;
      case 'Personal':
        return solicitud.idSolicitudPersonal || solicitud.id;
      case 'Vacaciones':
        return solicitud.idSolicitudVacaciones || solicitud.id;
      default:
        return null;
    }
  };

  const columns = [
    { field: 'tipo', headerName: 'Tipo de Solicitud', width: 150 },
    { field: 'descripcion', headerName: 'Descripción', width: 250 },
    { field: 'fechaSolicitud', headerName: 'Fecha de Creación', width: 200 },
    {
      field: 'estado',
      headerName: 'Estado',
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.row.estado === 'Aprobada' ? 'Aprobada' : params.row.estado === 'Rechazada' ? 'Rechazada' : 'Pendiente'}
          color={params.row.estado === 'Aprobada' ? 'success' : params.row.estado === 'Rechazada' ? 'error' : 'warning'}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 250,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            color="success"
            onClick={() => handleAprobar(params.row, params.row.tipo)}
            disabled={params.row.estado === 'Aprobada'}
          >
            Aprobar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleOpenRechazoDialog(params.row)}
            disabled={params.row.estado === 'Rechazada'}
          >
            Rechazar
          </Button>
        </Stack>
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
            getRowId={(row) => `${row.id}-${row.tipo}`}
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

      <Dialog open={openRechazoDialog} onClose={() => setOpenRechazoDialog(false)}>
        <DialogTitle>Motivo de Rechazo</DialogTitle>
        <DialogContent>
          <TextField
            label="Motivo de Rechazo"
            value={motivoRechazo}
            onChange={(e) => setMotivoRechazo(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRechazoDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleRechazar} color="secondary">
            Rechazar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VistaJefatura;

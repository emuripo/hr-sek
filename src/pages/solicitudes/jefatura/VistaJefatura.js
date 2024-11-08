import React, { useEffect, useState } from 'react';
import { getTodasSolicitudes, updateSolicitudEstado } from '../../../services/solicitudesService/solicitudesCombinadasService';
import { DataGrid } from '@mui/x-data-grid';
import { CircularProgress, Typography, Box, Paper, Tabs, Tab, Button, Dialog, DialogContent, DialogTitle, DialogActions, Stack, TextField, Chip } from '@mui/material';

const VistaJefatura = () => {
  const [solicitudes, setSolicitudes] = useState({
    documentos: [],
    personales: [],
    horasExtra: [],
    vacaciones: []
  });
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const [openRechazoDialog, setOpenRechazoDialog] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [motivoRechazo, setMotivoRechazo] = useState('');

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = async () => {
    setLoading(true);
    try {
      const data = await getTodasSolicitudes();
      setSolicitudes({
        documentos: data.filter((sol) => sol.tipo === 'Documento') || [],
        personales: data.filter((sol) => sol.tipo === 'Personal') || [],
        horasExtra: data.filter((sol) => sol.tipo === 'Horas Extra') || [],
        vacaciones: data.filter((sol) => sol.tipo === 'Vacaciones') || []
      });
    } catch (error) {
      console.error('Error al obtener solicitudes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => setTabIndex(newValue);

  const handleAprobar = async (solicitud) => {
    const tipo = capitalizeFirstLetter(solicitud.tipo);
    try {
      console.log(`Aprobando solicitud de tipo: ${tipo}, ID: ${solicitud.id}`);
      await updateSolicitudEstado(solicitud.id, tipo, true);
      fetchSolicitudes();
    } catch (error) {
      console.error('Error al aprobar la solicitud:', error);
    }
  };

  const handleOpenRechazoDialog = (solicitud) => {
    setSelectedSolicitud(solicitud);
    setOpenRechazoDialog(true);
  };

  const handleRechazar = async () => {
    const { id, tipo } = selectedSolicitud;
    const capitalizedTipo = capitalizeFirstLetter(tipo);
    try {
      console.log(`Rechazando solicitud de tipo: ${capitalizedTipo}, ID: ${id}`);
      await updateSolicitudEstado(id, capitalizedTipo, false, motivoRechazo);
      fetchSolicitudes();
    } catch (error) {
      console.error('Error al rechazar la solicitud:', error);
    } finally {
      setOpenRechazoDialog(false);
      setMotivoRechazo('');
    }
  };

  const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

  const renderEstadoCell = (params) => {
    const color =
      params.value === 'Aprobada' ? 'success' :
      params.value === 'Rechazada' ? 'error' :
      'warning'; // Para "Pendiente"
    
    return <Chip label={params.value} color={color} sx={{ fontWeight: 'bold' }} />;
  };

  const columnsConfig = {
    documentos: [
      { field: 'tipoDocumento', headerName: 'Tipo de Documento', width: 200 },
      { field: 'descripcion', headerName: 'Descripción', width: 300 },
      { field: 'fechaSolicitud', headerName: 'Fecha de Solicitud', width: 200 },
      { field: 'estado', headerName: 'Estado', width: 150, renderCell: renderEstadoCell },
      {
        field: 'acciones',
        headerName: 'Acciones',
        width: 250,
        renderCell: (params) => (
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              style={{ backgroundColor: '#4CAF50', color: '#FFF' }} // Verde para aprobar
              onClick={() => handleAprobar(params.row)}
              disabled={params.row.estado === 'Aprobada'}
            >
              Aprobar
            </Button>
            <Button
              variant="contained"
              style={{ backgroundColor: '#F44336', color: '#FFF' }} // Rojo para rechazar
              onClick={() => handleOpenRechazoDialog(params.row)}
              disabled={params.row.estado === 'Rechazada'}
            >
              Rechazar
            </Button>
          </Stack>
        ),
      },
    ],
    personales: [
      { field: 'motivo', headerName: 'Motivo', width: 300 },
      { field: 'fechaSolicitud', headerName: 'Fecha de Solicitud', width: 200 },
      { field: 'estado', headerName: 'Estado', width: 150, renderCell: renderEstadoCell },
      {
        field: 'acciones',
        headerName: 'Acciones',
        width: 250,
        renderCell: (params) => (
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              style={{ backgroundColor: '#4CAF50', color: '#FFF' }}
              onClick={() => handleAprobar(params.row)}
              disabled={params.row.estado === 'Aprobada'}
            >
              Aprobar
            </Button>
            <Button
              variant="contained"
              style={{ backgroundColor: '#F44336', color: '#FFF' }}
              onClick={() => handleOpenRechazoDialog(params.row)}
              disabled={params.row.estado === 'Rechazada'}
            >
              Rechazar
            </Button>
          </Stack>
        ),
      },
    ],
    horasExtra: [
      { field: 'cantidadHoras', headerName: 'Horas Solicitadas', width: 200 },
      { field: 'fechaTrabajo', headerName: 'Fecha de Trabajo', width: 200 },
      { field: 'estado', headerName: 'Estado', width: 150, renderCell: renderEstadoCell },
      {
        field: 'acciones',
        headerName: 'Acciones',
        width: 250,
        renderCell: (params) => (
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              style={{ backgroundColor: '#4CAF50', color: '#FFF' }}
              onClick={() => handleAprobar(params.row)}
              disabled={params.row.estado === 'Aprobada'}
            >
              Aprobar
            </Button>
            <Button
              variant="contained"
              style={{ backgroundColor: '#F44336', color: '#FFF' }}
              onClick={() => handleOpenRechazoDialog(params.row)}
              disabled={params.row.estado === 'Rechazada'}
            >
              Rechazar
            </Button>
          </Stack>
        ),
      },
    ],
    vacaciones: [
      { field: 'cantidadDias', headerName: 'Días Solicitados', width: 200 },
      { field: 'fechaInicio', headerName: 'Fecha de Inicio', width: 200 },
      { field: 'fechaFin', headerName: 'Fecha de Fin', width: 200 },
      { field: 'estado', headerName: 'Estado', width: 150, renderCell: renderEstadoCell },
      {
        field: 'acciones',
        headerName: 'Acciones',
        width: 250,
        renderCell: (params) => (
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              style={{ backgroundColor: '#4CAF50', color: '#FFF' }}
              onClick={() => handleAprobar(params.row)}
              disabled={params.row.estado === 'Aprobada'}
            >
              Aprobar
            </Button>
            <Button
              variant="contained"
              style={{ backgroundColor: '#F44336', color: '#FFF' }}
              onClick={() => handleOpenRechazoDialog(params.row)}
              disabled={params.row.estado === 'Rechazada'}
            >
              Rechazar
            </Button>
          </Stack>
        ),
      },
    ],
  };

  const tabNames = ['Documentación', 'Personal', 'Horas Extra', 'Vacaciones'];

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#263060', textAlign: 'center', mb: 2 }}>
        Solicitudes de Jefatura
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
            rows={solicitudes[Object.keys(solicitudes)[tabIndex]] || []}
            columns={columnsConfig[Object.keys(solicitudes)[tabIndex]] || []}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            checkboxSelection
            disableSelectionOnClick
            getRowId={(row) => row.id}
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
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VistaJefatura;

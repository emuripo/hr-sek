import React, { useEffect, useState, useContext } from 'react';
import { getSolicitudesByEmpleado } from '../../../services/solicitudesService/solicitudesUsuarioService';
import { DataGrid } from '@mui/x-data-grid';
import { CircularProgress, Typography, Box, Paper, Tabs, Tab, Button, Dialog, DialogContent, DialogTitle, DialogActions, Stack } from '@mui/material';
import AuthContext from '../../../context/AuthContext';
import ActualizarSolicitudDocumento from '../../../pages/solicitudes/ActualizarSolicitudes/ActualizarSolicitudDocumento';
import ActualizarSolicitudPersonal from '../../../pages/solicitudes/ActualizarSolicitudes/ActualizarSolicitudPersonal';
import ActualizarSolicitudHorasExtra from '../../../pages/solicitudes/ActualizarSolicitudes/ActualizarSolicitudHorasExtra';
import ActualizarSolicitudVacaciones from '../../../pages/solicitudes/ActualizarSolicitudes/ActualizarSolicitudVacaciones';
import { deleteSolicitudDocumento } from '../../../services/solicitudesService/SolicitudDocService';
import { deleteSolicitudPersonal } from '../../../services/solicitudesService/SolicitudPersonalService';
import { deleteSolicitudHorasExtra } from '../../../services/solicitudesService/SolicitudHorasService';
import { deleteSolicitudVacaciones } from '../../../services/solicitudesService/SolicitudVacacionesService';

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
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const fetchSolicitudes = async () => {
    if (!idEmpleado) return;

    try {
      const data = await getSolicitudesByEmpleado(idEmpleado);
      setSolicitudes({
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

  useEffect(() => {
    fetchSolicitudes();
  }, [idEmpleado]);

  const handleTabChange = (event, newValue) => setTabIndex(newValue);

  const handleEditClick = (solicitud) => {
    setSelectedSolicitud(solicitud);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedSolicitud(null);
  };

  const handleDeleteClick = (solicitud) => {
    setSelectedSolicitud(solicitud);
    setOpenConfirmDialog(true);
  };

  const confirmDelete = async () => {
    try {
      if (selectedSolicitud.tipo === 'Documento') {
        await deleteSolicitudDocumento(selectedSolicitud.id);
      } else if (selectedSolicitud.tipo === 'Personal') {
        await deleteSolicitudPersonal(selectedSolicitud.id);
      } else if (selectedSolicitud.tipo === 'Horas Extra') {
        await deleteSolicitudHorasExtra(selectedSolicitud.id);
      } else if (selectedSolicitud.tipo === 'Vacaciones') {
        await deleteSolicitudVacaciones(selectedSolicitud.id);
      }
      fetchSolicitudes();
    } catch (error) {
      console.error('Error al eliminar la solicitud:', error);
    } finally {
      setOpenConfirmDialog(false);
      setSelectedSolicitud(null);
    }
  };

  const columnsConfig = {
    documentos: [
      { field: 'tipoDocumento', headerName: 'Tipo de Documento', width: 200, headerAlign: 'center' },
      { field: 'descripcion', headerName: 'Descripción', width: 300, headerAlign: 'center' },
      { field: 'fechaSolicitud', headerName: 'Fecha de Solicitud', width: 200, headerAlign: 'center' },
      { field: 'estado', headerName: 'Estado', width: 150, headerAlign: 'center' },
      {
        field: 'acciones',
        headerName: 'Acciones',
        width: 250,
        renderCell: (params) => (
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleEditClick(params.row)}
              disabled={params.row.estado !== 'Pendiente'}
            >
              Editar
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleDeleteClick(params.row)}
              disabled={params.row.estado !== 'Pendiente'}
            >
              Eliminar
            </Button>
          </Stack>
        ),
      },
    ],
    personales: [
      { field: 'motivo', headerName: 'Motivo', width: 300, headerAlign: 'center' },
      { field: 'fechaSolicitud', headerName: 'Fecha de Solicitud', width: 200, headerAlign: 'center' },
      { field: 'estado', headerName: 'Estado', width: 150, headerAlign: 'center' },
      {
        field: 'acciones',
        headerName: 'Acciones',
        width: 250,
        renderCell: (params) => (
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleEditClick(params.row)}
              disabled={params.row.estado !== 'Pendiente'}
            >
              Editar
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleDeleteClick(params.row)}
              disabled={params.row.estado !== 'Pendiente'}
            >
              Eliminar
            </Button>
          </Stack>
        ),
      },
    ],
    horasExtra: [
      { field: 'cantidadHoras', headerName: 'Horas Solicitadas', width: 200, headerAlign: 'center' },
      { field: 'fechaTrabajo', headerName: 'Fecha de Trabajo', width: 200, headerAlign: 'center' },
      { field: 'estado', headerName: 'Estado', width: 150, headerAlign: 'center' },
      {
        field: 'acciones',
        headerName: 'Acciones',
        width: 250,
        renderCell: (params) => (
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleEditClick(params.row)}
              disabled={params.row.estado !== 'Pendiente'}
            >
              Editar
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleDeleteClick(params.row)}
              disabled={params.row.estado !== 'Pendiente'}
            >
              Eliminar
            </Button>
          </Stack>
        ),
      },
    ],
    vacaciones: [
      { field: 'cantidadDias', headerName: 'Días Solicitados', width: 200, headerAlign: 'center' },
      { field: 'fechaInicio', headerName: 'Fecha de Inicio', width: 200, headerAlign: 'center' },
      { field: 'fechaFin', headerName: 'Fecha de Fin', width: 200, headerAlign: 'center' },
      { field: 'estado', headerName: 'Estado', width: 150, headerAlign: 'center' },
      {
        field: 'acciones',
        headerName: 'Acciones',
        width: 250,
        renderCell: (params) => (
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleEditClick(params.row)}
              disabled={params.row.estado !== 'Pendiente'}
            >
              Editar
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleDeleteClick(params.row)}
              disabled={params.row.estado !== 'Pendiente'}
            >
              Eliminar
            </Button>
          </Stack>
        ),
      },
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
            getRowId={(row) => row.id}
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
                color: '#FB8C00',
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

      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>¿Está seguro de que desea eliminar esta solicitud?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={confirmDelete} color="secondary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {openModal && (
        <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
          <DialogTitle>Actualizar Solicitud</DialogTitle>
          <DialogContent>
            {selectedSolicitud.tipo === 'Documento' && (
              <ActualizarSolicitudDocumento solicitud={selectedSolicitud} onClose={handleCloseModal} onUpdate={fetchSolicitudes} />
            )}
            {selectedSolicitud.tipo === 'Personal' && (
              <ActualizarSolicitudPersonal solicitud={selectedSolicitud} onClose={handleCloseModal} onUpdate={fetchSolicitudes} />
            )}
            {selectedSolicitud.tipo === 'Horas Extra' && (
              <ActualizarSolicitudHorasExtra solicitud={selectedSolicitud} onClose={handleCloseModal} onUpdate={fetchSolicitudes} />
            )}
            {selectedSolicitud.tipo === 'Vacaciones' && (
              <ActualizarSolicitudVacaciones solicitud={selectedSolicitud} onClose={handleCloseModal} onUpdate={fetchSolicitudes} />
            )}
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default MisSolicitudes;

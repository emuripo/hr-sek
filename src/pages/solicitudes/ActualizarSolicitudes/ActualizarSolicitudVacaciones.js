import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Snackbar, Alert } from '@mui/material';
import { updateSolicitudVacaciones } from '../../../services/solicitudesService/SolicitudVacacionesService';

const ActualizarSolicitudVacaciones = ({ solicitud, onClose, onUpdate }) => {
  const [cantidadDias, setCantidadDias] = useState(solicitud.cantidadDias);
  const [fechaInicio, setFechaInicio] = useState(solicitud.fechaInicio || '');
  const [fechaFin, setFechaFin] = useState(solicitud.fechaFin || '');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  // Solo permite edición si el estado es "Pendiente"
  const isEditable = solicitud.estado === 'Pendiente';

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (cantidadDias <= 0) {
      setAlertMessage('La cantidad de días debe ser mayor a cero.');
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }

    if (new Date(fechaFin) <= new Date(fechaInicio)) {
      setAlertMessage('La fecha de fin debe ser posterior a la fecha de inicio.');
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }

    if ((new Date(fechaFin) - new Date(fechaInicio)) / (1000 * 60 * 60 * 24) + 1 !== cantidadDias) {
      setAlertMessage('La cantidad de días no coincide con el período seleccionado.');
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }

    try {
      const updatedSolicitud = {
        ...solicitud,
        cantidadDias,
        fechaInicio,
        fechaFin,
      };
      await updateSolicitudVacaciones(updatedSolicitud);
      setAlertMessage('Solicitud de vacaciones actualizada exitosamente');
      setAlertSeverity('success');
      setAlertOpen(true);
      onUpdate(); // Actualizar lista en "Mis Solicitudes"
      setTimeout(() => onClose(), 2000); // Cerrar el formulario después de un breve tiempo
    } catch (error) {
      setAlertMessage('Error al actualizar la solicitud de vacaciones');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6">Actualizar Solicitud de Vacaciones</Typography>

      <TextField
        label="Cantidad de Días"
        type="number"
        value={cantidadDias}
        onChange={(e) => setCantidadDias(Number(e.target.value))}
        required
        disabled={!isEditable}
        helperText="Ingrese la cantidad de días de vacaciones."
      />

      <TextField
        label="Fecha de Inicio"
        type="date"
        value={fechaInicio}
        onChange={(e) => setFechaInicio(e.target.value)}
        InputLabelProps={{ shrink: true }}
        required
        disabled={!isEditable}
      />

      <TextField
        label="Fecha de Fin"
        type="date"
        value={fechaFin}
        onChange={(e) => setFechaFin(e.target.value)}
        InputLabelProps={{ shrink: true }}
        required
        disabled={!isEditable}
      />

      <Button type="submit" variant="contained" color="primary" disabled={!isEditable}>
        Actualizar Solicitud
      </Button>

      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ActualizarSolicitudVacaciones;

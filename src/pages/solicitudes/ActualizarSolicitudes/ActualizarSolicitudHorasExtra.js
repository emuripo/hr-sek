import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Snackbar, Alert } from '@mui/material';
import { updateSolicitudHorasExtra } from '../../../services/solicitudesService/SolicitudHorasService';

const ActualizarSolicitudHorasExtra = ({ solicitud, onClose, onUpdate }) => {
  const [cantidadHoras, setCantidadHoras] = useState(solicitud.cantidadHoras);
  const [fechaTrabajo, setFechaTrabajo] = useState(solicitud.fechaTrabajo || '');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  // Solo permite edición si el estado es "Pendiente"
  const isEditable = solicitud.estado === 'Pendiente';

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (cantidadHoras <= 0 || cantidadHoras > 12) {
      setAlertMessage('La cantidad de horas debe estar entre 1 y 12.');
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }

    try {
      const updatedSolicitud = {
        ...solicitud,
        cantidadHoras,
        fechaTrabajo,
      };
      await updateSolicitudHorasExtra(updatedSolicitud);
      setAlertMessage('Solicitud de horas extra actualizada exitosamente');
      setAlertSeverity('success');
      setAlertOpen(true);
      onUpdate(); // Actualizar lista en "Mis Solicitudes"
      setTimeout(() => onClose(), 2000); // Cerrar el formulario después de un breve tiempo
    } catch (error) {
      setAlertMessage('Error al actualizar la solicitud de horas extra');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6">Actualizar Solicitud de Horas Extra</Typography>

      <TextField
        label="Cantidad de Horas"
        type="number"
        value={cantidadHoras}
        onChange={(e) => setCantidadHoras(e.target.value)}
        required
        disabled={!isEditable}
        helperText="Ingrese una cantidad de horas entre 1 y 12."
      />

      <TextField
        label="Fecha de Trabajo"
        type="date"
        value={fechaTrabajo}
        onChange={(e) => setFechaTrabajo(e.target.value)}
        InputLabelProps={{ shrink: true }}
        required
        disabled={!isEditable}
        helperText="Seleccione la fecha en que se trabajaron las horas extra."
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

export default ActualizarSolicitudHorasExtra;

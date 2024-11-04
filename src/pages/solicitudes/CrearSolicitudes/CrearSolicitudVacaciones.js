import React, { useContext, useState } from 'react';
import { TextField, Button, Box, Typography, Snackbar, Alert } from '@mui/material';
import AuthContext from '../../../context/AuthContext';
import { createSolicitudVacaciones } from '../../../services/solicitudesService/SolicitudVacacionesService';

const CrearSolicitudVacaciones = () => {
  const { idEmpleado } = useContext(AuthContext);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!idEmpleado) {
      setAlertMessage('No se encontró el IdEmpleado');
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }

    try {
      const nuevaSolicitudVacaciones = {
        idEmpleado,
        fechaInicio,
        fechaFin,
        fechaSolicitud: new Date().toISOString(),
      };

      await createSolicitudVacaciones(nuevaSolicitudVacaciones);
      setAlertMessage('Solicitud de vacaciones creada exitosamente');
      setAlertSeverity('success');
      setAlertOpen(true);

      // Limpiar el formulario después de la creación exitosa
      setFechaInicio('');
      setFechaFin('');
    } catch (error) {
      setAlertMessage('Error al crear la solicitud de vacaciones');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  const handleClose = () => {
    setAlertOpen(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6">Nueva Solicitud de Vacaciones</Typography>
      <TextField
        label="Fecha de Inicio"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={fechaInicio}
        onChange={(e) => setFechaInicio(e.target.value)}
        required
      />
      <TextField
        label="Fecha de Fin"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={fechaFin}
        onChange={(e) => setFechaFin(e.target.value)}
        required
      />
      <Button type="submit" variant="contained" color="primary">
        Enviar Solicitud
      </Button>

      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CrearSolicitudVacaciones;

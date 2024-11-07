import React, { useState, useContext } from 'react';
import { TextField, Button, Box, Typography, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createSolicitudHorasExtra } from '../../../services/solicitudesService/SolicitudHorasService';
import AuthContext from '../../../context/AuthContext';

const CrearSolicitudHoras = () => {
  const { idEmpleado, username } = useContext(AuthContext);
  const [cantidadHoras, setCantidadHoras] = useState('');
  const [fechaTrabajo, setFechaTrabajo] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validación de ID de Empleado
    if (!idEmpleado) {
      setAlertMessage('No se encontró el IdEmpleado');
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }

    // Validación de Cantidad de Horas
    if (!cantidadHoras || cantidadHoras <= 0 || cantidadHoras > 12) {
      setAlertMessage('La cantidad de horas debe estar entre 1 y 12.');
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }

    // Validación de Fecha de Trabajo
    const fechaTrabajoDate = new Date(fechaTrabajo);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Reseteamos las horas para comparar solo fechas

    if (!fechaTrabajo || fechaTrabajoDate > hoy) {
      setAlertMessage('La fecha de trabajo debe ser una fecha pasada o la fecha actual.');
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }

    const solicitudData = {
      idEmpleado,
      cantidadHoras: parseInt(cantidadHoras, 10),
      fechaTrabajo,
      modificadoPor: username
    };

    try {
      await createSolicitudHorasExtra(solicitudData);
      setAlertMessage('Solicitud de horas extra creada exitosamente');
      setAlertSeverity('success');
      setAlertOpen(true);

      // Redirigir a "Mis Solicitudes" después de un breve tiempo
      setTimeout(() => {
        navigate('/mis-solicitudes');
      }, 2000);
    } catch (error) {
      setAlertMessage('Error al crear la solicitud de horas extra');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  const handleClose = () => {
    setAlertOpen(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6">Nueva Solicitud de Horas Extra</Typography>

      <TextField
        label="Cantidad de Horas"
        type="number"
        value={cantidadHoras}
        onChange={(e) => setCantidadHoras(e.target.value)}
        inputProps={{ min: 1, max: 12 }}
        required
        helperText="Ingrese entre 1 y 12 horas."
      />

      <TextField
        label="Fecha de Trabajo"
        type="date"
        value={fechaTrabajo}
        onChange={(e) => setFechaTrabajo(e.target.value)}
        InputLabelProps={{ shrink: true }}
        required
        helperText="Seleccione una fecha actual o pasada."
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

export default CrearSolicitudHoras;

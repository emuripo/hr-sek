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

  // Validación de Cantidad de Horas
  const validarCantidadHoras = (horas) => {
    const horasNum = Number(horas);
    return !isNaN(horasNum) && horasNum > 0 && horasNum <= 12;
  };

  // Validación de Fecha de Trabajo
  const validarFechaTrabajo = (fecha) => {
    if (!fecha) return false;
    const fechaTrabajoDate = new Date(fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); 
    return fechaTrabajoDate <= hoy; 
  };

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
    if (!validarCantidadHoras(cantidadHoras)) {
      setAlertMessage('La cantidad de horas debe estar entre 1 y 12.');
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }

    // Validación de Fecha de Trabajo
    if (!validarFechaTrabajo(fechaTrabajo)) {
      setAlertMessage('La fecha de trabajo debe ser una fecha pasada o la fecha actual.');
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }

    const solicitudData = {
      idEmpleado,
      cantidadHoras: parseInt(cantidadHoras, 10),
      fechaTrabajo,
      modificadoPor: username,
    };

    try {
      await createSolicitudHorasExtra(solicitudData);
      setAlertMessage('Solicitud de horas extra creada exitosamente');
      setAlertSeverity('success');
      setAlertOpen(true);

      // Restablecer campos y redirigir a "Mis Solicitudes"
      setCantidadHoras('');
      setFechaTrabajo('');
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

      {/* Campo de cantidad de horas */}
      <TextField
        label="Cantidad de Horas"
        type="number"
        value={cantidadHoras}
        onChange={(e) => setCantidadHoras(e.target.value)}
        inputProps={{ min: 1, max: 12 }}
        required
        helperText="Ingrese entre 1 y 12 horas."
      />

      {/* Campo de fecha de trabajo */}
      <TextField
        label="Fecha de Trabajo"
        type="date"
        value={fechaTrabajo}
        onChange={(e) => setFechaTrabajo(e.target.value)}
        InputLabelProps={{ shrink: true }}
        required
        helperText="Seleccione una fecha actual o pasada."
      />

      {/* Botón de envío */}
      <Button type="submit" variant="contained" color="primary">
        Enviar Solicitud
      </Button>

      {/* Alerta de éxito o error */}
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CrearSolicitudHoras;

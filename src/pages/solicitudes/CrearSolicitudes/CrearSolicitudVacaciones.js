import React, { useState, useContext } from 'react';
import { TextField, Button, Box, Typography, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createSolicitudVacaciones } from '../../../services/solicitudesService/SolicitudVacacionesService';
import AuthContext from '../../../context/AuthContext';

const CrearSolicitudVacaciones = () => {
  const { idEmpleado, username } = useContext(AuthContext);
  const [cantidadDias, setCantidadDias] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validación de ID de Empleado
    if (!idEmpleado || idEmpleado <= 0) {
      setAlertMessage('Debe especificar un ID de empleado válido.');
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }

    // Validación de Cantidad de Días
    if (!cantidadDias || cantidadDias <= 0) {
      setAlertMessage('La cantidad de días debe ser mayor a cero.');
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }

    // Validación de Fechas
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Eliminar horas para comparar solo fechas
    inicio.setHours(0, 0, 0, 0); // Asegurarse de que inicio no tenga horas
    fin.setHours(0, 0, 0, 0); // Asegurarse de que fin no tenga horas

    if (!fechaInicio || !fechaFin) {
      setAlertMessage('Debe especificar fechas válidas para las vacaciones.');
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }

    if (inicio >= fin) {
      setAlertMessage('La fecha de fin debe ser posterior a la fecha de inicio.');
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }

    if (inicio < hoy) {
      setAlertMessage('La fecha de inicio de las vacaciones no puede ser en el pasado.');
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }

    const diferenciaDias = Math.floor((fin - inicio) / (1000 * 60 * 60 * 24)) + 1;
    if (diferenciaDias !== parseInt(cantidadDias, 10)) {
      setAlertMessage('La cantidad de días no coincide con el período seleccionado.');
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }

    const solicitudData = {
      idEmpleado,
      diasSolicitados: parseInt(cantidadDias, 10),
      fechaInicio,
      fechaFin,
      modificadoPor: username
    };

    try {
      await createSolicitudVacaciones(solicitudData);
      setAlertMessage('Solicitud de vacaciones creada exitosamente');
      setAlertSeverity('success');
      setAlertOpen(true);

      // Redirigir a "Mis Solicitudes" después de un breve tiempo
      setTimeout(() => {
        navigate('/mis-solicitudes');
      }, 2000);
    } catch (error) {
      // Manejo de errores con mensajes del backend
      if (error.response && error.response.data) {
        setAlertMessage(error.response.data.message || 'Error al crear la solicitud de vacaciones.');
      } else {
        setAlertMessage('Error al crear la solicitud de vacaciones. Inténtelo nuevamente.');
      }
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
        label="Cantidad de Días"
        type="number"
        value={cantidadDias}
        onChange={(e) => setCantidadDias(e.target.value)}
        required
        helperText="Ingrese la cantidad total de días de vacaciones."
      />

      <TextField
        label="Fecha de Inicio"
        type="date"
        value={fechaInicio}
        onChange={(e) => setFechaInicio(e.target.value)}
        InputLabelProps={{ shrink: true }}
        required
        helperText="Seleccione la fecha de inicio de las vacaciones."
      />

      <TextField
        label="Fecha de Fin"
        type="date"
        value={fechaFin}
        onChange={(e) => setFechaFin(e.target.value)}
        InputLabelProps={{ shrink: true }}
        required
        helperText="Seleccione la fecha de fin de las vacaciones."
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

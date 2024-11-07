import React, { useState, useContext } from 'react';
import { Button, Box, Typography, Snackbar, Alert, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createSolicitudPersonal } from '../../../services/solicitudesService/SolicitudPersonalService';
import AuthContext from '../../../context/AuthContext';

const CrearSolicitudPersonal = () => {
  const { idEmpleado, username } = useContext(AuthContext);
  const [motivo, setMotivo] = useState('');
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

    // Validación de Motivo
    if (!motivo) {
      setAlertMessage('El motivo de la solicitud es obligatorio.');
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }

    const solicitudData = {
      idEmpleado,
      motivo,
      modificadoPor: username
    };

    try {
      await createSolicitudPersonal(solicitudData);
      setAlertMessage('Solicitud personal creada exitosamente');
      setAlertSeverity('success');
      setAlertOpen(true);

      // Redirigir a "Mis Solicitudes" después de un breve tiempo
      setTimeout(() => {
        navigate('/mis-solicitudes');
      }, 2000);
    } catch (error) {
      setAlertMessage('Error al crear la solicitud personal. Inténtelo nuevamente.');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  const handleClose = () => {
    setAlertOpen(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6">Nueva Solicitud Personal</Typography>

      <FormControl fullWidth required>
        <InputLabel>Motivo</InputLabel>
        <Select
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          label="Motivo"
        >
          <MenuItem value="Permiso por Cita Médica">Permiso por Cita Médica</MenuItem>
          <MenuItem value="Licencia por Maternidad o Paternidad">Licencia por Maternidad o Paternidad</MenuItem>
          <MenuItem value="Permiso por Duelo">Permiso por Duelo</MenuItem>
          <MenuItem value="Cambio de Horario">Cambio de Horario</MenuItem>
          <MenuItem value="Anticipo de Salario">Anticipo de Salario</MenuItem>
        </Select>
      </FormControl>

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

export default CrearSolicitudPersonal;

import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Snackbar, Alert, MenuItem } from '@mui/material';
import { updateSolicitudPersonal } from '../../../services/solicitudesService/SolicitudPersonalService';

const ActualizarSolicitudPersonal = ({ solicitud, onClose, onUpdate }) => {
  const [motivo, setMotivo] = useState(solicitud.motivo);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  // Solo permite edición si el estado es "Pendiente"
  const isEditable = solicitud.estado === 'Pendiente';

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const updatedSolicitud = {
        ...solicitud,
        motivo,
      };
      await updateSolicitudPersonal(updatedSolicitud);
      setAlertMessage('Solicitud actualizada exitosamente');
      setAlertSeverity('success');
      setAlertOpen(true);
      onUpdate(); // Actualizar lista en "Mis Solicitudes"
      setTimeout(() => onClose(), 2000); // Cerrar el formulario después de un breve tiempo
    } catch (error) {
      setAlertMessage('Error al actualizar la solicitud');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6">Actualizar Solicitud Personal</Typography>
      
      <TextField
        label="Motivo"
        select
        value={motivo}
        onChange={(e) => setMotivo(e.target.value)}
        required
        disabled={!isEditable}
      >
        <MenuItem value="Permiso por Cita Médica">Permiso por Cita Médica</MenuItem>
        <MenuItem value="Licencia por Maternidad o Paternidad">Licencia por Maternidad o Paternidad</MenuItem>
        <MenuItem value="Permiso por Duelo">Permiso por Duelo</MenuItem>
        <MenuItem value="Cambio de Horario">Cambio de Horario</MenuItem>
        <MenuItem value="Anticipo de Salario">Anticipo de Salario</MenuItem>
      </TextField>

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

export default ActualizarSolicitudPersonal;

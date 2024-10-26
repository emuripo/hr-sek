import React, { useContext, useState } from 'react';
import { TextField, Button, Box, Typography, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../../context/AuthContext';  
import { createSolicitudHoras } from '../../../services/solicitudesService/SolicitudHorasService';

const CrearSolicitudHoras = () => {
  const { idEmpleado } = useContext(AuthContext);
  const [horasSolicitadas, setHorasSolicitadas] = useState('');
  const [motivo, setMotivo] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!idEmpleado) {
      setAlertMessage('No se encontró el IdEmpleado');
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }

    try {
      const nuevaSolicitudHoras = {
        idEmpleado,
        horasSolicitadas,
        motivo,
      };

      await createSolicitudHoras(nuevaSolicitudHoras);
      setAlertMessage('Solicitud de horas extra creada exitosamente');
      setAlertSeverity('success');
      setAlertOpen(true);

      // Redirigir a "Mis Solicitudes" después de un breve tiempo
      setTimeout(() => {
        navigate('/mis-solicitudes');
      }, 2000); // Espera 2 segundos antes de redirigir
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
        label="Horas Solicitadas"
        type="number"
        value={horasSolicitadas}
        onChange={(e) => setHorasSolicitadas(e.target.value)}
        required
      />
      <TextField
        label="Motivo"
        value={motivo}
        onChange={(e) => setMotivo(e.target.value)}
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

export default CrearSolicitudHoras;

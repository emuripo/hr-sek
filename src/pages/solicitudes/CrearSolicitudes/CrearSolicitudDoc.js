import React, { useState, useContext } from 'react';
import { TextField, Button, Box, Typography, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createSolicitudDocumento } from '../../../services/solicitudesService/SolicitudDocService';
import AuthContext from '../../../context/AuthContext';

const CrearSolicitudDoc = () => {
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const { idEmpleado } = useContext(AuthContext);
  const navigate = useNavigate(); // Hook para redirigir a otras rutas

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!idEmpleado) {
      setAlertMessage('No se encontró el IdEmpleado');
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }

    const solicitudData = {
      idEmpleado,
      tipoDocumento,
      descripcion,
      fechaSolicitud: new Date().toISOString(),
      estaAprobada: false,
    };

    try {
      const result = await createSolicitudDocumento(solicitudData);
      console.log('Solicitud creada exitosamente:', result);
      setAlertMessage('Solicitud creada exitosamente');
      setAlertSeverity('success');
      setAlertOpen(true);

      // Redirige a "Mis Solicitudes" después de un breve tiempo
      setTimeout(() => {
        navigate('/mis-solicitudes');
      }, 2000); // Espera 2 segundos antes de redirigir
    } catch (error) {
      console.error('Error al crear la solicitud:', error);
      setAlertMessage('Algo salió mal al crear la solicitud');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  const handleClose = () => {
    setAlertOpen(false);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Crear Solicitud de Documentación
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Tipo de Documento"
          value={tipoDocumento}
          onChange={(e) => setTipoDocumento(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          fullWidth
          multiline
          rows={4}
          required
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Enviar Solicitud
        </Button>
      </form>

      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CrearSolicitudDoc;

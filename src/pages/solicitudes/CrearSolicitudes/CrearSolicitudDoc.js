import React, { useState, useContext } from 'react';
import { TextField, Button, Box, Typography, Snackbar, Alert, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createSolicitudDocumento } from '../../../services/solicitudesService/SolicitudDocService';
import AuthContext from '../../../context/AuthContext';

const CrearSolicitudDoc = () => {
  const { idEmpleado, username } = useContext(AuthContext); // Accedemos a idEmpleado y username desde el contexto
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [descripcion, setDescripcion] = useState('');
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
      const solicitudData = {
        idEmpleado,
        tipoDocumento,
        descripcion,
        modificadoPor: username // Utilizamos el nombre de usuario desde el contexto
      };

      await createSolicitudDocumento(solicitudData);
      setAlertMessage('Solicitud de documento creada exitosamente');
      setAlertSeverity('success');
      setAlertOpen(true);

      // Redirigir a "Mis Solicitudes" después de un breve tiempo
      setTimeout(() => {
        navigate('/mis-solicitudes');
      }, 2000); // Espera 2 segundos antes de redirigir
    } catch (error) {
      setAlertMessage('Error al crear la solicitud de documento');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  const handleClose = () => {
    setAlertOpen(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6">Nueva Solicitud de Documento</Typography>
      
      <FormControl fullWidth required>
        <InputLabel>Tipo de Documento</InputLabel>
        <Select
          value={tipoDocumento}
          onChange={(e) => setTipoDocumento(e.target.value)}
          label="Tipo de Documento"
        >
          <MenuItem value="Certificación de Antigüedad">Certificación de Antigüedad</MenuItem>
          <MenuItem value="Carta de Recomendación">Carta de Recomendación</MenuItem>
          <MenuItem value="Certificación de Horas Extra">Certificación de Horas Extra</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        multiline
        rows={4}
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

export default CrearSolicitudDoc;

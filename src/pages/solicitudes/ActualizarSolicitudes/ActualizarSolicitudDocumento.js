import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Snackbar, Alert, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { updateSolicitudDocumento } from '../../../services/solicitudesService/SolicitudDocService';

const ActualizarSolicitudDocumento = ({ solicitud, onClose, onUpdate }) => {
  const [tipoDocumento, setTipoDocumento] = useState(solicitud.tipoDocumento || '');
  const [descripcion, setDescripcion] = useState(solicitud.descripcion || '');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  // Solo se permite actualizar si el estado es "Pendiente"
  const isEditable = solicitud.estado === 'Pendiente';

  const validarDescripcion = (descripcion) => {
    const minLength = 5;
    const maxLength = 200;
    const palabraRegex = /\b\w+\b/; // Al menos una palabra
    const caracteresValidosRegex = /^[a-zA-Z0-9\s.,!?]+$/; // Caracteres permitidos (letras, números y algunos signos de puntuación)

    return (
      descripcion.length >= minLength &&
      descripcion.length <= maxLength &&
      palabraRegex.test(descripcion) &&
      caracteresValidosRegex.test(descripcion)
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!tipoDocumento || !descripcion) {
      setAlertMessage('Por favor complete todos los campos.');
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }

    // Validación avanzada de la descripción
    if (!validarDescripcion(descripcion)) {
      setAlertMessage('La descripción debe tener entre 5 y 200 caracteres, contener al menos una palabra y solo caracteres válidos.');
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }

    try {
      const updatedSolicitud = {
        ...solicitud,
        tipoDocumento,
        descripcion,
      };

      await updateSolicitudDocumento(updatedSolicitud);

      setAlertMessage('Solicitud actualizada exitosamente');
      setAlertSeverity('success');
      setAlertOpen(true);
      onUpdate();
      setTimeout(() => onClose(), 2000);
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
      <Typography variant="h6">Actualizar Solicitud de Documento</Typography>

      {/* Selección del tipo de documento */}
      <FormControl fullWidth required disabled={!isEditable}>
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

      {/* Campo de descripción */}
      <TextField
        label="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        multiline
        rows={4}
        required
        disabled={!isEditable}
      />

      {/* Botón para actualizar la solicitud */}
      <Button type="submit" variant="contained" color="primary" disabled={!isEditable}>
        Actualizar Solicitud
      </Button>

      {/* Alerta de éxito o error */}
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ActualizarSolicitudDocumento;

import React, { useState, useContext } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { createSolicitudDocumento } from '../../../services/solicitudesService/SolicitudDocService';
import AuthContext from '../../../context/AuthContext'; 
const CrearSolicitudDoc = () => {
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const { idEmpleado } = useContext(AuthContext); // Usar AuthContext para obtener el IdEmpleado

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!idEmpleado) {
      console.error('No se encontró el IdEmpleado');
      return;
    }

    const solicitudData = {
      idEmpleado, // Usar el IdEmpleado del contexto
      tipoDocumento,
      descripcion,
      fechaSolicitud: new Date().toISOString(),
      estaAprobada: false, // Por defecto, no aprobada
    };

    try {
      const result = await createSolicitudDocumento(solicitudData);
      console.log('Solicitud creada exitosamente:', result);
      // Redirigir o mostrar un mensaje de éxito
    } catch (error) {
      console.error('Error al crear la solicitud:', error);
    }
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
    </Box>
  );
};

export default CrearSolicitudDoc;

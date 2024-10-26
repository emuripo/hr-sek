// src/pages/solicitudes/CrearSolicitudes/CrearSolicitudPersonal.js

import React, { useContext, useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import AuthContext from '../../../context/AuthContext';
import { createSolicitudPersonal } from '../../../services/solicitudesService/SolicitudPersonalService';

const CrearSolicitudPersonal = () => {
  const { idEmpleado } = useContext(AuthContext); // Obtener idEmpleado del contexto
  const [motivo, setMotivo] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!idEmpleado) {
      console.error('No se encontró el IdEmpleado');
      return;
    }

    try {
      const nuevaSolicitudPersonal = {
        idEmpleado,
        motivo,
        descripcion,
      };

      await createSolicitudPersonal(nuevaSolicitudPersonal);
      console.log('Solicitud personal creada exitosamente');
    } catch (error) {
      console.error('Error al crear la solicitud personal:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6">Nueva Solicitud Personal</Typography>
      <TextField
        label="Motivo de la Solicitud"
        value={motivo}
        onChange={(e) => setMotivo(e.target.value)}
        required
      />
      <TextField
        label="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        multiline
        rows={4}
        required
      />
      <Button type="submit" variant="contained" color="primary">
        Enviar Solicitud
      </Button>
    </Box>
  );
};

export default CrearSolicitudPersonal;

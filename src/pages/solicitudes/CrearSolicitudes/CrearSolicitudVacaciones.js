// src/pages/solicitudes/CrearSolicitudes/CrearSolicitudVacaciones.js

import React, { useContext, useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import AuthContext from '../../../context/AuthContext';
import { createSolicitudVacaciones } from '../../../services/solicitudesService/SolicitudVacacionesService';

const CrearSolicitudVacaciones = () => {
  const { idEmpleado } = useContext(AuthContext);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [motivo, setMotivo] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!idEmpleado) {
      console.error('No se encontró el IdEmpleado');
      return;
    }

    try {
      const nuevaSolicitudVacaciones = {
        idEmpleado,
        fechaInicio,
        fechaFin,
        motivo,
      };

      await createSolicitudVacaciones(nuevaSolicitudVacaciones);
      console.log('Solicitud de vacaciones creada exitosamente');
    } catch (error) {
      console.error('Error al crear la solicitud de vacaciones:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6">Nueva Solicitud de Vacaciones</Typography>
      <TextField
        label="Fecha de Inicio"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={fechaInicio}
        onChange={(e) => setFechaInicio(e.target.value)}
        required
      />
      <TextField
        label="Fecha de Fin"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={fechaFin}
        onChange={(e) => setFechaFin(e.target.value)}
        required
      />
      <TextField
        label="Motivo"
        value={motivo}
        onChange={(e) => setMotivo(e.target.value)}
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

export default CrearSolicitudVacaciones;

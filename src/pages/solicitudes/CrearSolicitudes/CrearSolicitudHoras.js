import React, { useContext, useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import AuthContext from '../../../context/AuthContext';  
import { createSolicitudHoras } from '../../../services/solicitudesService/SolicitudHorasService';

const CrearSolicitudHoras = () => {
  const { idEmpleado } = useContext(AuthContext); // Obtener idEmpleado del contexto
  const [horasSolicitadas, setHorasSolicitadas] = useState('');
  const [motivo, setMotivo] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!idEmpleado) {
      console.error('No se encontró el IdEmpleado');
      return;
    }

    try {
      const nuevaSolicitudHoras = {
        idEmpleado,
        horasSolicitadas,
        motivo,
        // Puedes agregar otros campos si es necesario
      };

      await createSolicitudHoras(nuevaSolicitudHoras);
      console.log('Solicitud de horas extra creada exitosamente');
    } catch (error) {
      console.error('Error al crear la solicitud de horas extra:', error);
    }
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
    </Box>
  );
};

export default CrearSolicitudHoras;

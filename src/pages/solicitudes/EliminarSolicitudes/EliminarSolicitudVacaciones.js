import React from 'react';
import { deleteSolicitudVacaciones } from '../../../services/solicitudesService/SolicitudVacacionesService';
import { Button } from '@mui/material';

const EliminarSolicitudVacaciones = ({ solicitudId, onEliminar }) => {
  const handleDelete = async () => {
    try {
      await deleteSolicitudVacaciones(solicitudId);
      onEliminar(solicitudId);
    } catch (error) {
      console.error('Error al eliminar la solicitud de vacaciones:', error);
    }
  };

  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={handleDelete}
    >
      Eliminar
    </Button>
  );
};

export default EliminarSolicitudVacaciones;

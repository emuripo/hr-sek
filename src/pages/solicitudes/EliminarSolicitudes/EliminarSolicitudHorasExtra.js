import React from 'react';
import { deleteSolicitudHorasExtra } from '../../../services/solicitudesService/SolicitudHorasExtraService';
import { Button } from '@mui/material';

const EliminarSolicitudHorasExtra = ({ solicitudId, onEliminar }) => {
  const handleDelete = async () => {
    try {
      await deleteSolicitudHorasExtra(solicitudId);
      onEliminar(solicitudId);
    } catch (error) {
      console.error('Error al eliminar la solicitud de horas extra:', error);
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

export default EliminarSolicitudHorasExtra;

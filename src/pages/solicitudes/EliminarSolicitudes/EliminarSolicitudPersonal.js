import React from 'react';
import { deleteSolicitudPersonal } from '../../../services/solicitudesService/SolicitudPersonalService';
import { Button } from '@mui/material';

const EliminarSolicitudPersonal = ({ solicitudId, onEliminar }) => {
  const handleDelete = async () => {
    try {
      await deleteSolicitudPersonal(solicitudId);
      onEliminar(solicitudId);
    } catch (error) {
      console.error('Error al eliminar la solicitud personal:', error);
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

export default EliminarSolicitudPersonal;

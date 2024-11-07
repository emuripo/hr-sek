import React from 'react';
import { deleteSolicitudDocumento } from '../../../services/solicitudesService/SolicitudDocService';
import { Button } from '@mui/material';

const EliminarSolicitudDocumento = ({ solicitudId, onEliminar }) => {
  const handleDelete = async () => {
    try {
      await deleteSolicitudDocumento(solicitudId);
      onEliminar(solicitudId); 
    } catch (error) {
      console.error('Error al eliminar la solicitud de documento:', error);
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

export default EliminarSolicitudDocumento;

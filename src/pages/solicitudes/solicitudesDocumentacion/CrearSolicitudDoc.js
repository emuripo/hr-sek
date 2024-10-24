import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { createSolicitudDocumento } from '../../../services/solicitudesService/SolicitudDocumento';

function CrearSolicitudDoc() {
  const [nombreSolicitante, setNombreSolicitante] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const newSolicitud = { nombreSolicitante, tipoDocumento };
      await createSolicitudDocumento(newSolicitud);
      alert('Solicitud creada con éxito');
    } catch (error) {
      console.error('Error al crear solicitud:', error);
      alert('Error al crear la solicitud');
    }
  };

  return (
    <Container>
      <Typography variant="h4">Crear Solicitud de Documento</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nombre Solicitante"
          value={nombreSolicitante}
          onChange={(e) => setNombreSolicitante(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Tipo de Documento"
          value={tipoDocumento}
          onChange={(e) => setTipoDocumento(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Crear Solicitud
        </Button>
      </form>
    </Container>
  );
}

export default CrearSolicitudDoc;

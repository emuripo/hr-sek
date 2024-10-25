import React, { useState } from 'react';
import { MenuItem, Select, Button, Box, Typography } from '@mui/material';
// Importar formularios específicos para cada tipo de solicitud
import CrearSolicitudDoc from './CrearSolicitudDoc';
import CrearSolicitudHoras from './CrearSolicitudHoras';
import CrearSolicitudPersonal from './CrearSolicitudPersonal';
import CrearSolicitudVacaciones from './CrearSolicitudVacaciones';

const CrearSolicitud = () => {
  const [tipoSolicitud, setTipoSolicitud] = useState('');

  const handleTipoChange = (event) => {
    setTipoSolicitud(event.target.value);
  };

  const renderFormulario = () => {
    switch (tipoSolicitud) {
      case 'documento':
        return <CrearSolicitudDoc />;
      case 'horas':
        return <CrearSolicitudHoras />;
      case 'personal':
        return <CrearSolicitudPersonal />;
      case 'vacaciones':
        return <CrearSolicitudVacaciones />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Crear Nueva Solicitud
      </Typography>
      <Select
        value={tipoSolicitud}
        onChange={handleTipoChange}
        displayEmpty
        fullWidth
        sx={{ marginBottom: 3 }}
      >
        <MenuItem value="" disabled>
          Selecciona el tipo de solicitud
        </MenuItem>
        <MenuItem value="documento">Solicitud de Documentación</MenuItem>
        <MenuItem value="horas">Solicitud de Horas Extra</MenuItem>
        <MenuItem value="personal">Solicitud Personal</MenuItem>
        <MenuItem value="vacaciones">Solicitud de Vacaciones</MenuItem>
      </Select>

      {renderFormulario()}

      {tipoSolicitud && (
        <Box sx={{ marginTop: 3 }}>
          <Button variant="contained" color="primary">
            Enviar Solicitud
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CrearSolicitud;

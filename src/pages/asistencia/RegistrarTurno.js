import React, { useState } from 'react';
import { TextField, Button, MenuItem, FormControl, InputLabel, Select, Typography } from '@mui/material';
import TurnoAPI from '../../services/asistencia/TurnoAPI';

const RegistrarTurno = () => {
  const [nombreTurno, setNombreTurno] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleRegistrarTurno = async () => {
    setError('');
    setMensaje('');

    if (!nombreTurno || !horaInicio || !horaFin) {
      setError('Por favor complete todos los campos.');
      return;
    }

    try {
      // Asegúrate de que `horaInicio` y `horaFin` estén en el formato esperado (HH:mm:ss)
      const turnoData = { 
        nombreTurno, 
        horaInicio: `${horaInicio}:00`, 
        horaFin: `${horaFin}:00` 
      };

      console.log("Datos que se enviarán:", turnoData); // Verifica la estructura de turnoData
      await TurnoAPI.crearTurno(turnoData);

      setMensaje('Turno registrado correctamente.');
      setNombreTurno('');
      setHoraInicio('');
      setHoraFin('');
    } catch (error) {
      console.error(error);
      setError('Error al registrar el turno. Intente de nuevo.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h5" gutterBottom>Registrar Turno</Typography>

      {mensaje && <Typography color="primary">{mensaje}</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      <FormControl fullWidth style={{ marginBottom: '20px' }}>
        <InputLabel>Nombre del Turno</InputLabel>
        <Select
          value={nombreTurno}
          onChange={(e) => setNombreTurno(e.target.value)}
          label="Nombre del Turno"
        >
          <MenuItem value="Turno Diurno">Turno Diurno</MenuItem>
          <MenuItem value="Turno Nocturno">Turno Nocturno</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Hora de Inicio"
        type="time"
        value={horaInicio}
        onChange={(e) => setHoraInicio(e.target.value)}
        style={{ marginBottom: '20px' }}
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        fullWidth
        label="Hora de Fin"
        type="time"
        value={horaFin}
        onChange={(e) => setHoraFin(e.target.value)}
        style={{ marginBottom: '20px' }}
        InputLabelProps={{ shrink: true }}
      />

      <Button variant="contained" color="primary" onClick={handleRegistrarTurno}>
        Registrar Turno
      </Button>
    </div>
  );
};

export default RegistrarTurno;

import React, { useState } from 'react';
import { TextField, Button, MenuItem, FormControl, InputLabel, Select, Typography } from '@mui/material';
import TurnoAPI from '../../services/asistencia/TurnoAPI';

const RegistrarTurno = () => {
  const [nombre, setNombre] = useState(''); // Nombre del turno, e.g., "Diurno" o "Nocturno"
  const [descripcion, setDescripcion] = useState(''); // Descripción del turno
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleRegistrarTurno = async () => {
    setError('');
    setMensaje('');

    if (!nombre || !horaInicio || !horaFin) {
      setError('Por favor complete todos los campos.');
      return;
    }

    const turnoData = {
      nombre,
      descripcion,
      horaInicio: `${horaInicio}:00`, // Formato "HH:mm:ss"
      horaFin: `${horaFin}:00`, // Formato "HH:mm:ss"
    };

    console.log("Datos que se enviarán:", turnoData); // Verifica la estructura de turnoData

    try {
      await TurnoAPI.crearTurno(turnoData);
      setMensaje('Turno registrado correctamente.');
      setNombre('');
      setDescripcion('');
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
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          label="Nombre del Turno"
        >
          <MenuItem value="Diurno">Turno Diurno</MenuItem>
          <MenuItem value="Nocturno">Turno Nocturno</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        style={{ marginBottom: '20px' }}
      />

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

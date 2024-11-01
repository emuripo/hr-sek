import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, FormControl, InputLabel, Select, Typography } from '@mui/material';
import HorarioAPI from '../../services/asistencia/HorarioAPI'; 
import TurnoAPI from '../../services/asistencia/TurnoAPI';

const diasSemana = [
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
  { value: 7, label: 'Domingo' },
];

const RegistrarHorario = () => {
  const [idTurno, setIdTurno] = useState('');
  const [diaInicio, setDiaInicio] = useState('');
  const [diaFin, setDiaFin] = useState('');
  const [horaEntrada, setHoraEntrada] = useState('');
  const [horaSalida, setHoraSalida] = useState('');
  const [turnos, setTurnos] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const turnosData = await TurnoAPI.obtenerTodosLosTurnos();
        setTurnos(turnosData);
      } catch (error) {
        setError('Error al cargar la lista de turnos');
      }
    };
    fetchTurnos();
  }, []);

  const handleRegistrarHorario = async () => {
    setError('');
    setMensaje('');

    if (!idTurno || !diaInicio || !diaFin || !horaEntrada || !horaSalida) {
      setError('Por favor complete todos los campos.');
      return;
    }

    try {
      const horarioData = { 
        idTurno, 
        diaInicio, 
        diaFin, 
        horaEntrada: `${horaEntrada}:00`, 
        horaSalida: `${horaSalida}:00` 
      };
      await HorarioAPI.crearHorario(horarioData);
      setMensaje('Horario registrado correctamente.');
      setIdTurno('');
      setDiaInicio('');
      setDiaFin('');
      setHoraEntrada('');
      setHoraSalida('');
    } catch (error) {
      setError('Error al registrar el horario. Intente de nuevo.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h5" gutterBottom>Registrar Horario</Typography>

      {mensaje && <Typography color="primary">{mensaje}</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      <FormControl fullWidth style={{ marginBottom: '20px' }}>
        <InputLabel>Turno</InputLabel>
        <Select
          value={idTurno}
          onChange={(e) => setIdTurno(e.target.value)}
          label="Turno"
        >
          {turnos.map(turno => (
            <MenuItem key={turno.idTurno} value={turno.idTurno}>
              {turno.nombreTurno}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth style={{ marginBottom: '20px' }}>
        <InputLabel>Día de Inicio</InputLabel>
        <Select
          value={diaInicio}
          onChange={(e) => setDiaInicio(e.target.value)}
          label="Día de Inicio"
        >
          {diasSemana.map(dia => (
            <MenuItem key={dia.value} value={dia.value}>
              {dia.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth style={{ marginBottom: '20px' }}>
        <InputLabel>Día de Fin</InputLabel>
        <Select
          value={diaFin}
          onChange={(e) => setDiaFin(e.target.value)}
          label="Día de Fin"
        >
          {diasSemana.map(dia => (
            <MenuItem key={dia.value} value={dia.value}>
              {dia.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Hora de Entrada"
        type="time"
        value={horaEntrada}
        onChange={(e) => setHoraEntrada(e.target.value)}
        style={{ marginBottom: '20px' }}
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        fullWidth
        label="Hora de Salida"
        type="time"
        value={horaSalida}
        onChange={(e) => setHoraSalida(e.target.value)}
        style={{ marginBottom: '20px' }}
        InputLabelProps={{ shrink: true }}
      />

      <Button variant="contained" color="primary" onClick={handleRegistrarHorario}>
        Registrar Horario
      </Button>
    </div>
  );
};

export default RegistrarHorario;

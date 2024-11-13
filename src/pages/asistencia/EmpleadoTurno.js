import React, { useState, useEffect } from 'react';
import { Button, FormControl, InputLabel, Select, MenuItem, Typography, TextField } from '@mui/material';
import EmpleadoTurnoAPI from '../../services/asistencia/EmpleadoTurnoAPI';
import { getEmpleados } from '../../services/FuncionarioAPI';
import TurnoAPI from '../../services/asistencia/TurnoAPI';

const EmpleadoTurno = () => {
  const [idEmpleado, setIdEmpleado] = useState('');
  const [idTurno, setIdTurno] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [empleados, setEmpleados] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const empleadosData = await getEmpleados();
        console.log('Empleados obtenidos:', empleadosData);
        setEmpleados(empleadosData);

        const turnosData = await TurnoAPI.obtenerTodosLosTurnos();
        console.log('Turnos obtenidos:', turnosData);
        setTurnos(turnosData);
      } catch (error) {
        setError('Error al cargar empleados o turnos.');
        console.error('Error al cargar empleados o turnos:', error);
      }
    };
    fetchData();
  }, []);

  const handleAsignarTurno = async () => {
    setError('');
    setMensaje('');

    // Verificación de que los campos requeridos estén completos
    if (!idEmpleado || !idTurno || !fechaInicio || !fechaFin) {
      setError('Por favor complete todos los campos.');
      return;
    }

    // Creación del objeto en el formato correcto
    const empleadoTurnoData = {
      turnoId: parseInt(idTurno, 10), // Asegurarse de que sea un número
      idEmpleado: parseInt(idEmpleado, 10), // Asegurarse de que sea un número
      fechaInicio: new Date(fechaInicio).toISOString(), // Convertir a formato ISO
      fechaFin: new Date(fechaFin).toISOString() // Convertir a formato ISO
    };

    console.log('Datos de asignación que se enviarán:', empleadoTurnoData);

    try {
      const response = await EmpleadoTurnoAPI.asignarTurno(empleadoTurnoData);
      setMensaje('Turno asignado correctamente.');
      setIdEmpleado('');
      setIdTurno('');
      setFechaInicio('');
      setFechaFin('');
      console.log('Respuesta de asignación de turno:', response);
    } catch (error) {
      setError('Error al asignar el turno. Intente de nuevo.');
      console.error('Error al asignar el turno:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h5" gutterBottom>Asignar Turno a Empleado</Typography>

      {mensaje && <Typography color="primary">{mensaje}</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      <FormControl fullWidth style={{ marginBottom: '20px' }}>
        <InputLabel>Empleado</InputLabel>
        <Select
          value={idEmpleado}
          onChange={(e) => setIdEmpleado(e.target.value)}
          label="Empleado"
        >
          {empleados.length > 0 ? empleados.map(empleado => (
            <MenuItem key={empleado.idEmpleado} value={empleado.idEmpleado}>
              {`${empleado.nombre} ${empleado.apellidoUno} ${empleado.apellidoDos || ''}`}
            </MenuItem>
          )) : (
            <MenuItem disabled>No hay empleados disponibles</MenuItem>
          )}
        </Select>
      </FormControl>

      <FormControl fullWidth style={{ marginBottom: '20px' }}>
        <InputLabel>Turno</InputLabel>
        <Select
          value={idTurno}
          onChange={(e) => setIdTurno(e.target.value)}
          label="Turno"
        >
          {turnos.length > 0 ? turnos.map(turno => (
            <MenuItem key={turno.idTurno} value={turno.idTurno}>
              {turno.nombre}
            </MenuItem>
          )) : (
            <MenuItem disabled>No hay turnos disponibles</MenuItem>
          )}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Fecha de Inicio"
        type="datetime-local"
        value={fechaInicio}
        onChange={(e) => setFechaInicio(e.target.value)}
        style={{ marginBottom: '20px' }}
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        fullWidth
        label="Fecha de Fin"
        type="datetime-local"
        value={fechaFin}
        onChange={(e) => setFechaFin(e.target.value)}
        style={{ marginBottom: '20px' }}
        InputLabelProps={{ shrink: true }}
      />

      <Button variant="contained" color="primary" onClick={handleAsignarTurno}>
        Asignar Turno
      </Button>
    </div>
  );
};

export default EmpleadoTurno;

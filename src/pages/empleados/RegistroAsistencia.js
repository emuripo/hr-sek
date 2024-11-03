import React, { useState, useContext } from 'react';
import { Button, Typography, Alert } from '@mui/material';
import AsistenciaAPI from '../../services/asistencia/AsistenciaAPI';
import EmpleadoTurnoAPI from '../../services/asistencia/EmpleadoTurnoAPI';
import AuthContext from '../../context/AuthContext';

const RegistroAsistencia = () => {
  const { idEmpleado } = useContext(AuthContext); // Obtén idEmpleado desde el contexto de autenticación
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // Función para registrar asistencia (entrada o salida)
  const registrarAsistencia = async (tipo) => {
    try {
      // Obtener el turno asignado
      const turnosAsignados = await EmpleadoTurnoAPI.obtenerTurnoPorEmpleado(idEmpleado);
      console.log('Turnos asignados obtenidos:', turnosAsignados);
  
      // Asegúrate de que haya al menos un turno asignado
      if (!turnosAsignados || turnosAsignados.length === 0) {
        setError('El empleado no tiene un turno asignado.');
        return;
      }
  
      // Selecciona el turno correcto y muestra su contenido
      const turnoAsignado = turnosAsignados[0];
      console.log('Turno asignado seleccionado:', turnoAsignado);
  
      // Verifica si el campo `idEmpleadoTurno` existe
      if (!turnoAsignado.idTurno || !turnoAsignado.idEmpleado) {
        console.error('Error: idTurno o idEmpleado no están definidos en turnoAsignado');
        setError('Error en los datos del turno asignado. Verifica la asignación de turnos.');
        return;
      }
  
      const asistenciaData = {
        idEmpleado: turnoAsignado.idEmpleado,
        idTurno: turnoAsignado.idTurno,
        fecha: new Date().toISOString(),
        tipo,
      };
  
      console.log('Datos de asistencia que se envían:', asistenciaData);
  
      // Intenta registrar la asistencia
      await AsistenciaAPI.registrarAsistencia(asistenciaData);
      setMensaje(`Asistencia de ${tipo} registrada correctamente.`);
      setError('');
    } catch (error) {
      console.error('Error al registrar la asistencia:', error);
      setError('Error al registrar la asistencia. Intente de nuevo.');
      setMensaje('');
    }
  };  

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h5" gutterBottom>Registro de Asistencia</Typography>

      {mensaje && <Alert severity="success">{mensaje}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      <Button
        variant="contained"
        color="primary"
        onClick={() => registrarAsistencia('Entrada')}
        style={{ marginRight: '10px', marginTop: '20px' }}
        disabled={!idEmpleado} // Deshabilita si no hay idEmpleado
      >
        Registrar Entrada
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => registrarAsistencia('Salida')}
        style={{ marginTop: '20px' }}
        disabled={!idEmpleado} // Deshabilita si no hay idEmpleado
      >
        Registrar Salida
      </Button>
    </div>
  );
};

export default RegistroAsistencia;

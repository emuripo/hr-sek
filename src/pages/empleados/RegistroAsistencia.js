import React, { useState, useContext } from 'react';
import { Button, Typography, Alert } from '@mui/material';
import AsistenciaAPI from '../../services/AsistenciaAPI';
import AuthContext from '../../context/AuthContext'; 

const RegistroAsistencia = () => {
  const { idEmpleado } = useContext(AuthContext); // Obtén idEmpleado desde el contexto de autenticación
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // Función para registrar asistencia (entrada o salida)
  const registrarAsistencia = async (tipo) => {
    try {
      const asistenciaData = {
        idEmpleado,
        fecha: new Date().toISOString(),
        tipo, // "Entrada" o "Salida"
      };

      // Llamada al API para registrar la asistencia
      await AsistenciaAPI.registrarAsistencia(asistenciaData);
      setMensaje(`Asistencia de ${tipo} registrada correctamente.`);
      setError('');
    } catch (error) {
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

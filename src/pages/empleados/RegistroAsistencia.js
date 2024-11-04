// src/components/asistencia/RegistroAsistencia.js
import React, { useState, useContext } from 'react';
import { Button, Typography, Alert } from '@mui/material';
import AsistenciaAPI from '../../services/asistencia/AsistenciaAPI';
import AuthContext from '../../context/AuthContext';

const RegistroAsistencia = () => {
  const { idEmpleado } = useContext(AuthContext);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const registrarAsistencia = async (esEntrada) => {
    setMensaje('');
    setError('');

    if (!idEmpleado) {
      setError('ID de empleado no disponible.');
      return;
    }

    const asistenciaData = {
      idEmpleado,
      fechaHora: new Date().toISOString(),
      esEntrada,
      estado: 'pendiente'
    };

    try {
      await AsistenciaAPI.registrarAsistencia(asistenciaData);
      setMensaje(`Asistencia de ${esEntrada ? 'entrada' : 'salida'} registrada correctamente.`);
    } catch (error) {
      setError('Error al registrar la asistencia. Intente de nuevo.');
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
        onClick={() => registrarAsistencia(true)}
        style={{ marginRight: '10px', marginTop: '20px' }}
      >
        Registrar Entrada
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => registrarAsistencia(false)}
        style={{ marginTop: '20px' }}
      >
        Registrar Salida
      </Button>
    </div>
  );
};

export default RegistroAsistencia;

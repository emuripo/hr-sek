import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  Snackbar,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import { getEmpleados } from '../../../services/FuncionarioAPI';
import { getLiquidacionesPorEmpleado } from '../../../services/nomina/LiquidacionAPI'; // Importar el servicio para obtener liquidaciones por empleado.

const ConsultarCesantias = () => {
  const [empleados, setEmpleados] = useState([]);
  const [idEmpleado, setIdEmpleado] = useState('');
  const [cesantias, setCesantias] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    fetchEmpleados();
  }, []);

  useEffect(() => {
    if (idEmpleado) {
      consultarCesantias();
    }
  }, [idEmpleado]);

  const fetchEmpleados = async () => {
    try {
      const data = await getEmpleados();
      setEmpleados(data);
    } catch (error) {
      mostrarErrorSnackbar('Error al cargar la lista de empleados.');
    }
  };

  const consultarCesantias = async () => {
    try {
      setLoading(true);
      const data = await getLiquidacionesPorEmpleado(idEmpleado);
      setCesantias(data);
    } catch (error) {
      mostrarErrorSnackbar('Error al consultar las cesantías del empleado.');
    } finally {
      setLoading(false);
    }
  };

  const mostrarErrorSnackbar = (mensaje) => {
    setSnackbarMessage(mensaje);
    setSnackbarSeverity('error');
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mx: 'auto', maxWidth: 800 }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Consultar Cesantías
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            select
            label="Seleccionar Empleado"
            value={idEmpleado}
            onChange={(e) => setIdEmpleado(e.target.value)}
            fullWidth
          >
            {empleados.map((empleado) => (
              <MenuItem key={empleado.idEmpleado} value={empleado.idEmpleado}>
                {`${empleado.nombre} ${empleado.apellidoUno} ${empleado.apellidoDos}`}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        {loading ? (
          <Grid item xs={12} textAlign="center">
            <CircularProgress />
          </Grid>
        ) : cesantias ? (
          <>
            {cesantias.length > 0 ? (
              cesantias.map((cesantia, index) => (
                <Grid item xs={12} key={index}>
                  <Box sx={{ border: '1px solid #ccc', padding: 2, borderRadius: 2 }}>
                    <Typography>
                      <strong>Fecha de Liquidación:</strong> {cesantia.fechaLiquidacion}
                    </Typography>
                    <Typography>
                      <strong>Monto Cesantías:</strong> {cesantia.montoCesantia} CRC
                    </Typography>
                    <Typography>
                      <strong>Observaciones:</strong> {cesantia.observaciones || 'Ninguna'}
                    </Typography>
                  </Box>
                </Grid>
              ))
            ) : (
              <Grid item xs={12} textAlign="center">
                <Typography>No hay cesantías registradas para este empleado.</Typography>
              </Grid>
            )}
          </>
        ) : (
          <Grid item xs={12} textAlign="center">
            <Typography>Selecciona un empleado para consultar las cesantías.</Typography>
          </Grid>
        )}
      </Grid>
      <Snackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        autoHideDuration={6000}
      >
        <Alert severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default ConsultarCesantias;

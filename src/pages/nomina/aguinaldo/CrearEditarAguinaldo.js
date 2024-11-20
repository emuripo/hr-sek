import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Button,
  Grid,
  Snackbar,
  TextField,
  Typography,
  Paper,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { getEmpleados } from '../../../services/FuncionarioAPI';
import { calcularAguinaldo } from '../../../services/nomina/AguinaldoAPI';

const CrearEditarAguinaldo = ({ onClose = () => {} }) => {
  const [empleados, setEmpleados] = useState([]);
  const [idEmpleado, setIdEmpleado] = useState('');
  const [resultadoAguinaldo, setResultadoAguinaldo] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const fetchEmpleados = async () => {
    try {
      const data = await getEmpleados();
      setEmpleados(data);
    } catch (error) {
      console.error('Error al obtener los empleados:', error);
      setSnackbarMessage('Error al cargar la lista de empleados.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleEmpleadoChange = (e) => {
    setIdEmpleado(e.target.value);
  };

  const handleCalcularAguinaldo = async () => {
    if (!idEmpleado) {
      setSnackbarMessage('Por favor, seleccione un empleado.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      const data = await calcularAguinaldo(idEmpleado);
      setResultadoAguinaldo(data);
      setSnackbarMessage('Aguinaldo calculado exitosamente.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error al calcular el aguinaldo:', error);
      setSnackbarMessage('Error al calcular el aguinaldo.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mx: 'auto', maxWidth: 600 }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Calcular Aguinaldo
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="empleado-label">Seleccionar Empleado</InputLabel>
            <Select
              labelId="empleado-label"
              value={idEmpleado}
              onChange={handleEmpleadoChange}
              variant="outlined"
              fullWidth
            >
              {empleados.map((empleado) => (
                <MenuItem key={empleado.idEmpleado} value={empleado.idEmpleado}>
                  {`${empleado.nombre} ${empleado.apellidoUno} ${empleado.apellidoDos}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} textAlign="center">
          <Button
            variant="contained"
            color="primary"
            onClick={handleCalcularAguinaldo}
            sx={{ mr: 2 }}
          >
            Calcular Aguinaldo
          </Button>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancelar
          </Button>
        </Grid>
      </Grid>
      {resultadoAguinaldo && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Resultado del Aguinaldo:
          </Typography>
          <Typography>
            <strong>Salario Bruto Acumulado:</strong> {resultadoAguinaldo.salarioBrutoAcumulado}
          </Typography>
          <Typography>
            <strong>Aguinaldo Bruto:</strong> {resultadoAguinaldo.aguinaldoBruto}
          </Typography>
          <Typography>
            <strong>Deducciones:</strong> {resultadoAguinaldo.deducciones}
          </Typography>
          <Typography>
            <strong>Aguinaldo Neto:</strong> {resultadoAguinaldo.aguinaldoNeto}
          </Typography>
          <Typography>
            <strong>Período:</strong> {`${resultadoAguinaldo.fechaInicioPeriodo} - ${resultadoAguinaldo.fechaFinPeriodo}`}
          </Typography>
        </Box>
      )}
      <Snackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default CrearEditarAguinaldo;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  Snackbar,
  Typography,
  Paper,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { getEmpleados } from '../../../services/FuncionarioAPI';
import { calcularYGuardarAguinaldo } from '../../../services/nomina/AguinaldoAPI';
import { getTodosPeriodosNomina } from '../../../services/nomina/PeriodoNominaAPI';

const CrearEditarAguinaldo = ({ onClose = () => {} }) => {
  const [empleados, setEmpleados] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [idEmpleado, setIdEmpleado] = useState('');
  const [idPeriodoNomina, setIdPeriodoNomina] = useState('');
  const [resultadoAguinaldo, setResultadoAguinaldo] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    fetchEmpleados();
    fetchPeriodos();
  }, []);

  const fetchEmpleados = async () => {
    try {
      const data = await getEmpleados();
      setEmpleados(data);
    } catch (error) {
      handleSnackbar(`Error al cargar la lista de empleados: ${error.message}`, 'error');
    }
  };

  const fetchPeriodos = async () => {
    try {
      const data = await getTodosPeriodosNomina();
      setPeriodos(data);
    } catch (error) {
      handleSnackbar(`Error al cargar los períodos de nómina: ${error.message}`, 'error');
    }
  };

  const handleEmpleadoChange = (e) => {
    setIdEmpleado(e.target.value);
  };

  const handlePeriodoChange = (e) => {
    setIdPeriodoNomina(e.target.value);
  };

  const handleCalcularYGuardarAguinaldo = async () => {
    if (!idEmpleado || !idPeriodoNomina) {
      handleSnackbar('Por favor, seleccione un empleado y un período de nómina.', 'error');
      return;
    }

    try {
      const generadoPor = 'admin'; // Cambia según el usuario autenticado
      const data = await calcularYGuardarAguinaldo(idEmpleado, idPeriodoNomina, generadoPor);
      setResultadoAguinaldo(data);
      handleSnackbar('Aguinaldo calculado y guardado exitosamente.', 'success');
    } catch (error) {
      console.error('Error al calcular y guardar el aguinaldo:', error.message);
      handleSnackbar(`Error al calcular y guardar el aguinaldo: ${error.message}`, 'error');
    }
  };

  const handleSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mx: 'auto', maxWidth: 600 }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Calcular y Guardar Aguinaldo
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
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="periodo-label">Seleccionar Período de Nómina</InputLabel>
            <Select
              labelId="periodo-label"
              value={idPeriodoNomina}
              onChange={handlePeriodoChange}
              variant="outlined"
              fullWidth
            >
              {periodos.map((periodo) => (
                <MenuItem key={periodo.idPeriodoNomina} value={periodo.idPeriodoNomina}>
                  {`${periodo.descripcion} (${periodo.fechaInicio} - ${periodo.fechaFin})`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} textAlign="center">
          <Button
            variant="contained"
            color="primary"
            onClick={handleCalcularYGuardarAguinaldo}
            sx={{ mr: 2 }}
          >
            Calcular y Guardar Aguinaldo
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

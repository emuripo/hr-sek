import React, { useState, useEffect } from 'react';
import {
  Paper,
  TextField,
  Button,
  Grid,
  Typography,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { createNomina } from '../../services/NominaAPI';
import { getEmpleados } from '../../services/FuncionarioAPI';
import { getTodasDeducciones } from '../../services/nomina/DeduccionAPI';
import { getTodasBonificaciones } from '../../services/nomina/BonificacionAPI';
import { getTodosPeriodosNomina } from '../../services/nomina/PeriodoNominaAPI';

const CrearEditarNomina = ({ onClose = () => {} }) => {
  const [formData, setFormData] = useState({
    idEmpleado: '',
    salarioBase: '',
    salarioBruto: '',
    salarioNeto: '',
    impuestos: '',
    fechaGeneracion: new Date().toISOString(),
    activa: true,
    pagada: true,
    idPeriodoNomina: '',
    deducciones: [],
    bonificaciones: [],
    horasExtras: [
      {
        salarioBase: 0,
        horasExtrasTrabajadasMes: 0,
        salarioPorHora: 0,
        tarifaHorasExtra: 0,
        totalPagarHorasExtra: 0,
      },
    ],
    modificadoPor: 'RRHH_USER',
    fechaUltimaModificacion: new Date().toISOString(),
  });

  const [empleados, setEmpleados] = useState([]);
  const [deducciones, setDeducciones] = useState([]);
  const [bonificaciones, setBonificaciones] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    fetchEmpleados();
    fetchDeducciones();
    fetchBonificaciones();
    fetchPeriodos();
  }, []);

  const fetchEmpleados = async () => {
    try {
      const data = await getEmpleados();
      setEmpleados(data);
    } catch (error) {
      console.error('Error al obtener empleados:', error);
    }
  };

  const fetchDeducciones = async () => {
    try {
      const data = await getTodasDeducciones();
      setDeducciones(data);
    } catch (error) {
      console.error('Error al obtener deducciones:', error);
    }
  };

  const fetchBonificaciones = async () => {
    try {
      const data = await getTodasBonificaciones();
      setBonificaciones(data);
    } catch (error) {
      console.error('Error al obtener bonificaciones:', error);
    }
  };

  const fetchPeriodos = async () => {
    try {
      const data = await getTodosPeriodosNomina();
      setPeriodos(data);
    } catch (error) {
      console.error('Error al obtener períodos:', error);
    }
  };

  const handleEmpleadoChange = (e) => {
    const selectedId = e.target.value;
    const empleado = empleados.find((emp) => emp.idEmpleado === selectedId);

    setFormData({
      ...formData,
      idEmpleado: selectedId,
      salarioBase: empleado ? empleado.infoContratoFuncionario.salarioBase : '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const calculateSalarios = () => {
    const totalBonificaciones = formData.bonificaciones.reduce((acc, curr) => acc + parseFloat(curr.monto || 0), 0);
    const totalDeducciones = formData.deducciones.reduce((acc, curr) => acc + parseFloat(curr.monto || 0), 0);
    const salarioBruto = parseFloat(formData.salarioBase || 0) + totalBonificaciones;
    const salarioNeto = salarioBruto - totalDeducciones;

    return { salarioBruto, salarioNeto };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { salarioBruto, salarioNeto } = calculateSalarios();

    const payload = {
      ...formData,
      salarioBruto,
      salarioNeto,
    };

    try {
      await createNomina(payload);
      setSnackbarMessage('Nómina creada exitosamente.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      onClose();
    } catch (error) {
      console.error('Error al guardar la nómina:', error);
      setSnackbarMessage('Error al guardar la nómina.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const { salarioBruto, salarioNeto } = calculateSalarios();

  return (
    <Paper elevation={3} sx={{ p: 4, mx: 'auto', maxWidth: 800 }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Crear Nómina
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Empleado</InputLabel>
              <Select
                name="idEmpleado"
                value={formData.idEmpleado}
                onChange={handleEmpleadoChange}
                required
              >
                {empleados.map((empleado) => (
                  <MenuItem key={empleado.idEmpleado} value={empleado.idEmpleado}>
                    {`${empleado.nombre} ${empleado.apellidoUno} ${empleado.apellidoDos}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Salario Base"
              name="salarioBase"
              value={formData.salarioBase}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Impuestos"
              name="impuestos"
              type="number"
              value={formData.impuestos}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Salario Bruto"
              name="salarioBruto"
              value={salarioBruto}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Salario Neto"
              name="salarioNeto"
              value={salarioNeto}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Período</InputLabel>
              <Select
                name="idPeriodoNomina"
                value={formData.idPeriodoNomina}
                onChange={handleChange}
                required
              >
                {periodos.map((periodo) => (
                  <MenuItem key={periodo.idPeriodoNomina} value={periodo.idPeriodoNomina}>
                    {`Del ${new Date(periodo.fechaInicio).toLocaleDateString()} al ${new Date(
                      periodo.fechaFin
                    ).toLocaleDateString()}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 4 }}>
          Guardar Nómina
        </Button>
      </form>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default CrearEditarNomina;

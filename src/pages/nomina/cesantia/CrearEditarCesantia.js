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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { getEmpleados } from '../../../services/FuncionarioAPI';
import { createCesantia } from '../../../services/nomina/CesantiaAPI';
import AuthContext from '../../../context/AuthContext';

const CrearEditarCesantia = ({ cesantiaId, onClose = () => {} }) => {
  const { username } = useContext(AuthContext);

  const [empleados, setEmpleados] = useState([]);
  const [formData, setFormData] = useState({
    idLiquidacion: 0,
    idEmpleado: '',
    fechaInicio: '',
    fechaFin: '',
    salariosBrutosUltimosSeisMeses: '',
    diasLaboradosUltimosSeisMeses: '',
    diasCesantia: '',
    salarioPromedioDiario: '',
    montoCesantia: '',
    fechaGeneracion: new Date().toISOString(),
    generadoPor: username,
  });
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
      console.error('Error al cargar los empleados:', error);
      setSnackbarMessage('Error al cargar la lista de empleados.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = { ...formData };
      await createCesantia(payload);
      setSnackbarMessage('Cesantía registrada exitosamente.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      onClose();
    } catch (error) {
      console.error('Error al registrar la cesantía:', error);
      setSnackbarMessage('Error al registrar la cesantía.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mx: 'auto', maxWidth: 800 }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        {cesantiaId ? 'Editar Cesantía' : 'Registrar Cesantía'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Empleado</InputLabel>
              <Select
                name="idEmpleado"
                value={formData.idEmpleado}
                onChange={handleChange}
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
          <Grid item xs={12} sm={6}>
            <TextField
              label="Fecha de Inicio"
              name="fechaInicio"
              type="date"
              value={formData.fechaInicio}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Fecha de Fin"
              name="fechaFin"
              type="date"
              value={formData.fechaFin}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Salarios Brutos Últimos 6 Meses"
              name="salariosBrutosUltimosSeisMeses"
              type="number"
              value={formData.salariosBrutosUltimosSeisMeses}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Días Laborados Últimos 6 Meses"
              name="diasLaboradosUltimosSeisMeses"
              type="number"
              value={formData.diasLaboradosUltimosSeisMeses}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Días de Cesantía"
              name="diasCesantia"
              type="number"
              value={formData.diasCesantia}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Salario Promedio Diario"
              name="salarioPromedioDiario"
              type="number"
              value={formData.salarioPromedioDiario}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Monto de Cesantía"
              name="montoCesantia"
              type="number"
              value={formData.montoCesantia}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
        </Grid>
        <Box mt={4} textAlign="center">
          <Button type="submit" variant="contained" color="primary" sx={{ mr: 2 }}>
            Guardar Cesantía
          </Button>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancelar
          </Button>
        </Box>
      </form>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
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

export default CrearEditarCesantia;

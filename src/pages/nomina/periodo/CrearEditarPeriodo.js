import React, { useState, useContext } from 'react';
import {
  Box,
  Button,
  Grid,
  Snackbar,
  TextField,
  Typography,
  Alert,
  Paper,
} from '@mui/material';
import AuthContext from '../../../context/AuthContext';
import { createPeriodoNomina } from '../../../services/nomina/PeriodoNominaAPI';

const CrearEditarPeriodo = () => {
  const { idEmpleado } = useContext(AuthContext); // Obtener idEmpleado del contexto

  const [formData, setFormData] = useState({
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    activo: true,
    creadoPor: idEmpleado,
    modificadoPor: idEmpleado,
  });

  const [errors, setErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({ ...errors, [name]: '' }); // Limpiar errores al cambiar el valor
  };

  const validateFields = () => {
    const newErrors = {};

    // Validación de descripción
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria.';
    } else if (formData.descripcion.length < 5) {
      newErrors.descripcion = 'La descripción debe tener al menos 5 caracteres.';
    }

    // Validación de fechas
    if (!formData.fechaInicio) {
      newErrors.fechaInicio = 'La fecha de inicio es obligatoria.';
    }
    if (!formData.fechaFin) {
      newErrors.fechaFin = 'La fecha de fin es obligatoria.';
    } else if (formData.fechaInicio && new Date(formData.fechaInicio) >= new Date(formData.fechaFin)) {
      newErrors.fechaFin = 'La fecha de fin debe ser posterior a la fecha de inicio.';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateFields();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSnackbarMessage('Por favor, corrija los errores en el formulario.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      const payload = {
        ...formData,
        fechaCreacion: new Date().toISOString(),
        fechaUltimaModificacion: new Date().toISOString(),
      };

      await createPeriodoNomina(payload);
      setSnackbarMessage('Período de nómina creado exitosamente.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      resetForm();
    } catch (error) {
      console.error('Error al crear el período de nómina:', error);
      setSnackbarMessage('Hubo un error al crear el período de nómina.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const resetForm = () => {
    setFormData({
      descripcion: '',
      fechaInicio: '',
      fechaFin: '',
      activo: true,
      creadoPor: idEmpleado,
      modificadoPor: idEmpleado,
    });
    setErrors({});
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Crear/Editar Período de Nómina
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Descripción"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              error={Boolean(errors.descripcion)}
              helperText={errors.descripcion}
              required
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Fecha de Inicio"
              name="fechaInicio"
              type="datetime-local"
              value={formData.fechaInicio}
              onChange={handleChange}
              error={Boolean(errors.fechaInicio)}
              helperText={errors.fechaInicio}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Fecha de Fin"
              name="fechaFin"
              type="datetime-local"
              value={formData.fechaFin}
              onChange={handleChange}
              error={Boolean(errors.fechaFin)}
              helperText={errors.fechaFin}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </Grid>
        </Grid>
        <Box mt={3} textAlign="center">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mr: 2 }}
          >
            Guardar
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={resetForm}
          >
            Limpiar
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

export default CrearEditarPeriodo;

import React, { useState, useContext, useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  Snackbar,
  TextField,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
import { createDeduccion, updateDeduccion, getDeduccionPorId } from '../../../services/nomina/DeduccionAPI';
import AuthContext from '../../../context/AuthContext';

const CrearEditarDeduccion = ({ deduccionId, onClose = () => {}, onSuccess = () => {} }) => {
  const { username } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    tipoDeduccion: '',
    monto: '',
    registradoPor: username,
  });
  const [isEditMode, setIsEditMode] = useState(!!deduccionId);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    if (isEditMode) {
      fetchDeduccionData();
    }
  }, [deduccionId]);

  const fetchDeduccionData = async () => {
    try {
      const data = await getDeduccionPorId(deduccionId);
      setFormData({
        tipoDeduccion: data.tipoDeduccion,
        monto: data.monto,
        registradoPor: data.registradoPor || username,
      });
    } catch (error) {
      console.error('Error al cargar la deducción:', error);
      setSnackbarMessage('Error al cargar los datos de la deducción.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validación en tiempo real
    if (name === 'monto') {
      const regex = /^[0-9]+(\.[0-9]{0,2})?$/;
      if (!regex.test(value) && value !== '') return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const validateFields = () => {
    const errors = {};
    if (!formData.tipoDeduccion.trim()) {
      errors.tipoDeduccion = 'El tipo de deducción es obligatorio.';
    }
    if (!formData.monto || parseFloat(formData.monto) <= 0) {
      errors.monto = 'El monto debe ser mayor a 0.';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setSnackbarMessage('Por favor, corrija los errores en el formulario.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      if (isEditMode) {
        await updateDeduccion(deduccionId, formData);
        setSnackbarMessage('Deducción actualizada exitosamente.');
      } else {
        await createDeduccion(formData);
        setSnackbarMessage('Deducción creada exitosamente.');
      }
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error al guardar la deducción:', error);
      setSnackbarMessage('Error al guardar la deducción.');
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
        {isEditMode ? 'Editar Deducción' : 'Crear Deducción'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Tipo de Deducción"
              name="tipoDeduccion"
              value={formData.tipoDeduccion}
              onChange={handleChange}
              fullWidth
              required
              error={!formData.tipoDeduccion}
              helperText={!formData.tipoDeduccion && 'El tipo de deducción es obligatorio.'}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Monto"
              name="monto"
              type="number"
              value={formData.monto}
              onChange={handleChange}
              fullWidth
              required
              error={!formData.monto || parseFloat(formData.monto) <= 0}
              helperText={
                (!formData.monto || parseFloat(formData.monto) <= 0) &&
                'El monto debe ser mayor a 0.'
              }
            />
          </Grid>
        </Grid>
        <Box mt={4} textAlign="center">
          <Button type="submit" variant="contained" color="primary" sx={{ mr: 2 }}>
            {isEditMode ? 'Actualizar' : 'Guardar'}
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

export default CrearEditarDeduccion;

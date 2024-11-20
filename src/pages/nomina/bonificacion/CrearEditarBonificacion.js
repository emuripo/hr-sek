import React, { useState, useContext, useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import AuthContext from '../../../context/AuthContext';
import {
  createBonificacion,
  getBonificacionPorId,
  updateBonificacion,
} from '../../../services/nomina/BonificacionAPI';

const CrearEditarBonificacion = ({ bonificacionId, onClose = () => {} }) => {
  const { idEmpleado } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    tipoBonificacion: '',
    monto: '',
    registradoPor: idEmpleado || 'Sistema',
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isEditMode, setIsEditMode] = useState(!!bonificacionId);

  useEffect(() => {
    if (bonificacionId) {
      fetchBonificacion();
    }
  }, [bonificacionId]);

  const fetchBonificacion = async () => {
    try {
      const data = await getBonificacionPorId(bonificacionId);
      setFormData({
        tipoBonificacion: data.tipoBonificacion,
        monto: data.monto,
        registradoPor: data.registradoPor || idEmpleado,
      });
    } catch (error) {
      console.error('Error al obtener la bonificación:', error);
      setSnackbarMessage('Error al cargar los datos de la bonificación.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'monto') {
      // Validar solo números positivos
      const regex = /^[0-9]+(\.[0-9]{1,2})?$/;
      if (!regex.test(value) && value !== '') return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const validateFields = () => {
    const errors = {};
    if (!formData.tipoBonificacion.trim()) {
      errors.tipoBonificacion = 'El tipo de bonificación es obligatorio.';
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
      const payload = {
        ...formData,
        fechaRegistro: new Date().toISOString(),
      };

      if (isEditMode) {
        await updateBonificacion(bonificacionId, payload);
        setSnackbarMessage('Bonificación actualizada exitosamente.');
      } else {
        await createBonificacion(payload);
        setSnackbarMessage('Bonificación creada exitosamente.');
      }
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      onClose(); // Llama a onClose para cerrar el modal o resetear el formulario
    } catch (error) {
      console.error('Error al guardar la bonificación:', error);
      setSnackbarMessage('Error al guardar la bonificación.');
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
        {isEditMode ? 'Editar Bonificación' : 'Crear Bonificación'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Tipo de Bonificación"
              name="tipoBonificacion"
              value={formData.tipoBonificacion}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              error={!formData.tipoBonificacion}
              helperText={!formData.tipoBonificacion && 'El tipo de bonificación es obligatorio.'}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Monto"
              name="monto"
              value={formData.monto}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              error={!formData.monto || parseFloat(formData.monto) <= 0}
              helperText={
                (!formData.monto || parseFloat(formData.monto) <= 0) &&
                'El monto debe ser mayor a 0.'
              }
            />
          </Grid>
        </Grid>
        <Box mt={3} textAlign="center">
          <Button type="submit" variant="contained" color="primary" sx={{ mr: 2 }}>
            Guardar
          </Button>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancelar
          </Button>
        </Box>
      </form>
      <Snackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default CrearEditarBonificacion;

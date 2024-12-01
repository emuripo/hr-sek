import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import { getTodasBonificaciones, deleteBonificacion } from '../../../services/nomina/BonificacionAPI';

const ConsultarBonificaciones = () => {
  const [bonificaciones, setBonificaciones] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    fetchBonificaciones();
  }, []);

  const fetchBonificaciones = async () => {
    try {
      const data = await getTodasBonificaciones();
      setBonificaciones(data);
    } catch (error) {
      console.error('Error al obtener las bonificaciones:', error);
      setSnackbarMessage('Error al cargar las bonificaciones.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async (idBonificacion) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta bonificación?')) {
      try {
        await deleteBonificacion(idBonificacion);
        setSnackbarMessage('Bonificación eliminada exitosamente.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        fetchBonificaciones(); // Actualiza la lista después de eliminar
      } catch (error) {
        console.error('Error al eliminar la bonificación:', error);
        setSnackbarMessage('Error al eliminar la bonificación.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mx: 'auto', mt: 4, maxWidth: 1000 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Consultar Bonificaciones
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Tipo de Bonificación</strong></TableCell>
              <TableCell><strong>Monto</strong></TableCell>
              <TableCell><strong>Fecha Registro</strong></TableCell>
              <TableCell><strong>Registrado Por</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bonificaciones.length > 0 ? (
              bonificaciones.map((bonificacion) => (
                <TableRow key={bonificacion.idBonificacion}>
                  <TableCell>{bonificacion.tipoBonificacion}</TableCell>
                  <TableCell>{bonificacion.monto.toLocaleString('es-CR', { style: 'currency', currency: 'CRC' })}</TableCell>
                  <TableCell>{new Date(bonificacion.fechaRegistro).toLocaleString()}</TableCell>
                  <TableCell>{bonificacion.registradoPor}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mr: 1 }}
                      onClick={() => console.log('Editar', bonificacion.idBonificacion)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(bonificacion.idBonificacion)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No hay bonificaciones disponibles.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
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

export default ConsultarBonificaciones;

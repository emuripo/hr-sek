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
  Box,
} from '@mui/material';
import { getTodasDeducciones, deleteDeduccion } from '../../../services/nomina/DeduccionAPI';

const ConsultarDeducciones = ({ onEdit = () => {} }) => {
  const [deducciones, setDeducciones] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    fetchDeducciones();
  }, []);

  const fetchDeducciones = async () => {
    try {
      const data = await getTodasDeducciones();
      setDeducciones(data);
    } catch (error) {
      console.error('Error al obtener las deducciones:', error);
      setSnackbarMessage('Error al cargar las deducciones.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async (idDeduccion) => {
    if (!window.confirm('¿Está seguro que desea eliminar esta deducción?')) return;

    try {
      await deleteDeduccion(idDeduccion);
      setSnackbarMessage('Deducción eliminada exitosamente.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      // Actualizar la tabla
      setDeducciones((prev) => prev.filter((deduccion) => deduccion.idDeduccion !== idDeduccion));
    } catch (error) {
      console.error('Error al eliminar la deducción:', error);
      setSnackbarMessage('Error al eliminar la deducción.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ p: 4, mx: 'auto', maxWidth: 1000 }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Consultar Deducciones
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Tipo de Deducción</strong></TableCell>
              <TableCell><strong>Monto</strong></TableCell>
              <TableCell><strong>Registrado Por</strong></TableCell>
              <TableCell><strong>Fecha de Registro</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deducciones.length > 0 ? (
              deducciones.map((deduccion) => (
                <TableRow key={deduccion.idDeduccion}>
                  <TableCell>{deduccion.tipoDeduccion}</TableCell>
                  <TableCell>{deduccion.monto}</TableCell>
                  <TableCell>{deduccion.registradoPor}</TableCell>
                  <TableCell>{new Date(deduccion.fechaRegistro).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mr: 1 }}
                      onClick={() => onEdit(deduccion)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(deduccion.idDeduccion)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No hay deducciones disponibles.
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
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ConsultarDeducciones;

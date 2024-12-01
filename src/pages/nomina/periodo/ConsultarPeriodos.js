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
import { getTodosPeriodosNomina, deletePeriodoNomina } from '../../../services/nomina/PeriodoNominaAPI';

const ConsultarPeriodos = () => {
  const [periodos, setPeriodos] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    fetchPeriodos();
  }, []);

  const fetchPeriodos = async () => {
    try {
      const data = await getTodosPeriodosNomina();
      setPeriodos(data);
    } catch (error) {
      console.error('Error al obtener los períodos:', error);
      setSnackbarMessage('Error al cargar los períodos de nómina.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async (idPeriodoNomina) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este período de nómina?')) {
      try {
        await deletePeriodoNomina(idPeriodoNomina);
        setSnackbarMessage('Período de nómina eliminado exitosamente.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        fetchPeriodos(); // Actualiza la lista después de eliminar
      } catch (error) {
        console.error('Error al eliminar el período:', error);
        setSnackbarMessage('Error al eliminar el período de nómina.');
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
        Consultar Períodos de Nómina
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Descripción</strong></TableCell>
              <TableCell><strong>Fecha Inicio</strong></TableCell>
              <TableCell><strong>Fecha Fin</strong></TableCell>
              <TableCell><strong>Activo</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {periodos.length > 0 ? (
              periodos.map((periodo) => (
                <TableRow key={periodo.idPeriodoNomina}>
                  <TableCell>{periodo.descripcion}</TableCell>
                  <TableCell>{new Date(periodo.fechaInicio).toLocaleString()}</TableCell>
                  <TableCell>{new Date(periodo.fechaFin).toLocaleString()}</TableCell>
                  <TableCell>{periodo.activo ? 'Sí' : 'No'}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mr: 1 }}
                      onClick={() => console.log('Editar', periodo.idPeriodoNomina)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(periodo.idPeriodoNomina)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No hay períodos de nómina disponibles.
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

export default ConsultarPeriodos;

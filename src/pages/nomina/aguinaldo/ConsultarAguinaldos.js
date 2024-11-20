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
import { getAguinaldoPorEmpleado } from '../../../services/nomina/AguinaldoAPI';
import { getEmpleados } from '../../../services/FuncionarioAPI';

const ConsultarAguinaldos = () => {
  const [empleados, setEmpleados] = useState([]);
  const [aguinaldos, setAguinaldos] = useState([]);
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

  const fetchAguinaldos = async (idEmpleado) => {
    try {
      const data = await getAguinaldoPorEmpleado(idEmpleado);
      setAguinaldos(data);
    } catch (error) {
      console.error('Error al obtener los aguinaldos:', error);
      setSnackbarMessage('Error al cargar los aguinaldos.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleVerAguinaldos = (idEmpleado) => {
    fetchAguinaldos(idEmpleado);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mx: 'auto', mt: 4, maxWidth: 1000 }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Consultar Aguinaldos
      </Typography>
      <Typography variant="h6" gutterBottom>
        Seleccione un empleado para ver sus aguinaldos:
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Nombre Completo</strong></TableCell>
              <TableCell><strong>ID Empleado</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {empleados.length > 0 ? (
              empleados.map((empleado) => (
                <TableRow key={empleado.idEmpleado}>
                  <TableCell>{`${empleado.nombre} ${empleado.apellidoUno} ${empleado.apellidoDos}`}</TableCell>
                  <TableCell>{empleado.idEmpleado}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleVerAguinaldos(empleado.idEmpleado)}
                    >
                      Ver Aguinaldos
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No hay empleados disponibles.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" gutterBottom>
        Aguinaldos:
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Salario Bruto Acumulado</strong></TableCell>
              <TableCell><strong>Aguinaldo Bruto</strong></TableCell>
              <TableCell><strong>Deducciones</strong></TableCell>
              <TableCell><strong>Aguinaldo Neto</strong></TableCell>
              <TableCell><strong>Período</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {aguinaldos.length > 0 ? (
              aguinaldos.map((aguinaldo, index) => (
                <TableRow key={index}>
                  <TableCell>{aguinaldo.salarioBrutoAcumulado}</TableCell>
                  <TableCell>{aguinaldo.aguinaldoBruto}</TableCell>
                  <TableCell>{aguinaldo.deducciones}</TableCell>
                  <TableCell>{aguinaldo.aguinaldoNeto}</TableCell>
                  <TableCell>
                    {`${new Date(aguinaldo.fechaInicioPeriodo).toLocaleDateString()} - ${new Date(aguinaldo.fechaFinPeriodo).toLocaleDateString()}`}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No hay aguinaldos disponibles para este empleado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

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

export default ConsultarAguinaldos;

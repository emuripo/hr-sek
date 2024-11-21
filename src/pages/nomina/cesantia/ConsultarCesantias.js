import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import { getCesantias, getCesantiaById } from '../../../services/nomina/CesantiaAPI';
import { getEmpleados } from '../../../services/FuncionarioAPI';

const ConsultarCesantias = () => {
  const [cesantias, setCesantias] = useState([]);
  const [empleadosMap, setEmpleadosMap] = useState({});
  const [selectedCesantia, setSelectedCesantia] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    fetchCesantias();
    fetchEmpleados();
  }, []);

  const fetchCesantias = async () => {
    try {
      const data = await getCesantias();
      setCesantias(data);
    } catch (error) {
      console.error('Error al obtener las cesantías:', error);
      setSnackbarMessage('Error al cargar las cesantías.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const fetchEmpleados = async () => {
    try {
      const empleados = await getEmpleados();
      const empleadosMap = empleados.reduce((map, empleado) => {
        map[empleado.idEmpleado] = `${empleado.nombre} ${empleado.apellidoUno} ${empleado.apellidoDos}`;
        return map;
      }, {});
      setEmpleadosMap(empleadosMap);
    } catch (error) {
      console.error('Error al obtener los empleados:', error);
      setSnackbarMessage('Error al cargar la lista de empleados.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleViewCesantia = async (idCesantia) => {
    try {
      const data = await getCesantiaById(idCesantia);
      setSelectedCesantia(data);
    } catch (error) {
      console.error(`Error al obtener la cesantía con ID ${idCesantia}:`, error);
      setSnackbarMessage('Error al obtener los detalles de la cesantía.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Consultar Cesantías
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Empleado</TableCell>
              <TableCell>Salario Promedio Diario</TableCell>
              <TableCell>Días Cesantía</TableCell>
              <TableCell>Monto Cesantía</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cesantias.map((cesantia) => (
              <TableRow key={cesantia.idLiquidacion}>
                <TableCell>{cesantia.idLiquidacion}</TableCell>
                <TableCell>{empleadosMap[cesantia.idEmpleado] || 'N/A'}</TableCell>
                <TableCell>{cesantia.salarioPromedioDiario}</TableCell>
                <TableCell>{cesantia.diasCesantia}</TableCell>
                <TableCell>{cesantia.montoCesantia}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleViewCesantia(cesantia.idLiquidacion)}
                  >
                    Ver Detalles
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedCesantia && (
        <div style={{ marginTop: '20px' }}>
          <Typography variant="h5">Detalles de Cesantía</Typography>
          <Typography>ID: {selectedCesantia.idLiquidacion}</Typography>
          <Typography>
            Empleado: {empleadosMap[selectedCesantia.idEmpleado] || 'N/A'}
          </Typography>
          <Typography>Fecha Inicio: {new Date(selectedCesantia.fechaInicio).toLocaleDateString()}</Typography>
          <Typography>Fecha Fin: {new Date(selectedCesantia.fechaFin).toLocaleDateString()}</Typography>
          <Typography>Salarios Brutos Últimos 6 Meses: {selectedCesantia.salariosBrutosUltimosSeisMeses}</Typography>
          <Typography>Días Laborados Últimos 6 Meses: {selectedCesantia.diasLaboradosUltimosSeisMeses}</Typography>
          <Typography>Días Cesantía: {selectedCesantia.diasCesantia}</Typography>
          <Typography>Salario Promedio Diario: {selectedCesantia.salarioPromedioDiario}</Typography>
          <Typography>Monto Cesantía: {selectedCesantia.montoCesantia}</Typography>
          <Typography>Fecha Generación: {new Date(selectedCesantia.fechaGeneracion).toLocaleDateString()}</Typography>
          <Typography>Generado Por: {selectedCesantia.generadoPor}</Typography>
        </div>
      )}

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
    </div>
  );
};

export default ConsultarCesantias;

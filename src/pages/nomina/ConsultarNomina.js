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
import { getNominas } from '../../services/NominaAPI';
import { getEmpleados } from '../../services/FuncionarioAPI'; // Importamos el servicio para obtener los empleados

const ConsultarNomina = () => {
  const [nominas, setNominas] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [selectedNomina, setSelectedNomina] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    fetchNominas();
    fetchEmpleados(); // Cargamos los datos de los empleados al inicio
  }, []);

  const fetchNominas = async () => {
    try {
      const data = await getNominas();
      setNominas(data);
    } catch (error) {
      console.error('Error al obtener las nóminas:', error);
      setSnackbarMessage('Error al cargar las nóminas.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const fetchEmpleados = async () => {
    try {
      const data = await getEmpleados();
      setEmpleados(data);
    } catch (error) {
      console.error('Error al obtener los empleados:', error);
      setSnackbarMessage('Error al cargar los empleados.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleViewNomina = (nomina) => {
    setSelectedNomina(nomina);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Obtener el nombre completo del empleado basado en el idEmpleado
  const getNombreEmpleado = (idEmpleado) => {
    const empleado = empleados.find((emp) => emp.idEmpleado === idEmpleado);
    return empleado
      ? `${empleado.nombre} ${empleado.apellidoUno} ${empleado.apellidoDos}`
      : 'Empleado no encontrado';
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Consultar Nóminas
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Empleado</TableCell>
              <TableCell>Salario Base</TableCell>
              <TableCell>Salario Bruto</TableCell>
              <TableCell>Salario Neto</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {nominas.map((nomina) => (
              <TableRow key={nomina.idNomina}>
                <TableCell>{nomina.idNomina}</TableCell>
                <TableCell>{getNombreEmpleado(nomina.idEmpleado)}</TableCell>
                <TableCell>{nomina.salarioBase}</TableCell>
                <TableCell>{nomina.salarioBruto}</TableCell>
                <TableCell>{nomina.salarioNeto}</TableCell>
                <TableCell>{nomina.activa ? 'Activa' : 'Inactiva'}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleViewNomina(nomina)}
                  >
                    Ver Detalles
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedNomina && (
        <div style={{ marginTop: '20px' }}>
          <Typography variant="h5">Detalles de Nómina</Typography>
          <Typography>ID: {selectedNomina.idNomina}</Typography>
          <Typography>Empleado: {getNombreEmpleado(selectedNomina.idEmpleado)}</Typography>
          <Typography>Salario Base: {selectedNomina.salarioBase}</Typography>
          <Typography>Salario Bruto: {selectedNomina.salarioBruto}</Typography>
          <Typography>Salario Neto: {selectedNomina.salarioNeto}</Typography>
          <Typography>Bonificaciones:</Typography>
          <ul>
            {selectedNomina.bonificaciones.map((b) => (
              <li key={b.idBonificacion}>{`${b.tipoBonificacion} - ${b.monto}`}</li>
            ))}
          </ul>
          <Typography>Deducciones:</Typography>
          <ul>
            {selectedNomina.deducciones.map((d) => (
              <li key={d.tipoDeduccion}>{`${d.tipoDeduccion} - ${d.monto}`}</li>
            ))}
          </ul>
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

export default ConsultarNomina;

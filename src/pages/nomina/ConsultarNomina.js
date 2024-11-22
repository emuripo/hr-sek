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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { getNominas } from '../../services/NominaAPI';
import { getEmpleados } from '../../services/FuncionarioAPI';
import { getTodosPeriodosNomina } from '../../services/nomina/PeriodoNominaAPI';

const ConsultarNomina = () => {
  const [nominas, setNominas] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [selectedPeriodo, setSelectedPeriodo] = useState('');
  const [filteredNominas, setFilteredNominas] = useState([]);
  const [selectedNomina, setSelectedNomina] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    fetchNominas();
    fetchEmpleados();
    fetchPeriodos();
  }, []);

  useEffect(() => {
    // Filtrar nóminas según el período seleccionado
    if (selectedPeriodo) {
      const filtered = nominas.filter((nomina) => nomina.idPeriodoNomina === selectedPeriodo);
      setFilteredNominas(filtered);
    } else {
      setFilteredNominas(nominas);
    }
  }, [selectedPeriodo, nominas]);

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

  const fetchPeriodos = async () => {
    try {
      const data = await getTodosPeriodosNomina();
      setPeriodos(data);
    } catch (error) {
      console.error('Error al obtener los períodos:', error);
      setSnackbarMessage('Error al cargar los períodos.');
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

      {/* Selector de Período */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="select-periodo-label">Seleccionar Período</InputLabel>
        <Select
          labelId="select-periodo-label"
          value={selectedPeriodo}
          onChange={(e) => setSelectedPeriodo(e.target.value)}
        >
          <MenuItem value="">
            <em>Todos los Períodos</em>
          </MenuItem>
          {periodos.map((periodo) => (
            <MenuItem key={periodo.idPeriodoNomina} value={periodo.idPeriodoNomina}>
              {`Del ${new Date(periodo.fechaInicio).toLocaleDateString()} al ${new Date(
                periodo.fechaFin
              ).toLocaleDateString()}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

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
            {filteredNominas.map((nomina) => (
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
            {selectedNomina?.bonificaciones?.length > 0 ? (
              selectedNomina.bonificaciones.map((b) => (
                <li key={b.idBonificacion}>{`${b.tipoBonificacion} - ${b.monto}`}</li>
              ))
            ) : (
              <li>No hay bonificaciones registradas</li>
            )}
          </ul>
          <Typography>Deducciones:</Typography>
          <ul>
            {selectedNomina?.deducciones?.length > 0 ? (
              selectedNomina.deducciones.map((d) => (
                <li key={d.tipoDeduccion}>{`${d.tipoDeduccion} - ${d.monto}`}</li>
              ))
            ) : (
              <li>No hay deducciones registradas</li>
            )}
          </ul>
          <Typography>Horas Extras:</Typography>
          <ul>
            {selectedNomina?.horasExtras?.length > 0 ? (
              selectedNomina.horasExtras.map((he, index) => (
                <li key={index}>{`Horas: ${he.horasExtrasTrabajadasMes}, Total: ${he.totalPagarHorasExtra}`}</li>
              ))
            ) : (
              <li>No hay horas extras registradas</li>
            )}
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

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
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { getNominas } from '../../services/NominaAPI';
import { getEmpleados } from '../../services/FuncionarioAPI';
import { getTodosPeriodosNomina } from '../../services/nomina/PeriodoNominaAPI';
import { getTodasDeducciones } from '../../services/nomina/DeduccionAPI';
import { getTodasBonificaciones } from '../../services/nomina/BonificacionAPI';

const ConsultarNomina = () => {
  const [nominas, setNominas] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [deducciones, setDeducciones] = useState([]);
  const [bonificaciones, setBonificaciones] = useState([]);
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
    fetchDeducciones();
    fetchBonificaciones();
  }, []);

  useEffect(() => {
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

  const fetchDeducciones = async () => {
    try {
      const data = await getTodasDeducciones();
      setDeducciones(data);
    } catch (error) {
      console.error('Error al obtener las deducciones:', error);
    }
  };

  const fetchBonificaciones = async () => {
    try {
      const data = await getTodasBonificaciones();
      setBonificaciones(data);
    } catch (error) {
      console.error('Error al obtener las bonificaciones:', error);
    }
  };

  const calcularDeduccionesAutomaticas = (salarioBase) => {
    return [
      { tipoDeduccion: 'Seguro Social (CCSS)', monto: salarioBase * 0.1067 },
      { tipoDeduccion: 'Banco Popular', monto: salarioBase * 0.01 },
    ];
  };

  const handleViewNomina = (nomina) => {
    const deduccionesAutomaticas = calcularDeduccionesAutomaticas(nomina.salarioBase);
    const otrasDeducciones = nomina.otrasDeducciones || [
      { descripcion: 'Préstamo Personal', monto: 12000 },
      { descripcion: 'Seguro Médico', monto: 8000 },
    ];

    setSelectedNomina({ ...nomina, deduccionesAutomaticas, otrasDeducciones });
  };

  const getNombreEmpleado = (idEmpleado) => {
    const empleado = empleados.find((emp) => emp.idEmpleado === idEmpleado);
    return empleado
      ? `${empleado.nombre} ${empleado.apellidoUno} ${empleado.apellidoDos}`
      : 'Empleado no encontrado';
  };

  const mapDeducciones = (deduccionesIds) =>
    deducciones.filter((deduccion) => deduccionesIds.includes(deduccion.idDeduccion));

  const mapBonificaciones = (bonificacionesIds) =>
    bonificaciones.filter((bonificacion) => bonificacionesIds.includes(bonificacion.idBonificacion));

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Consultar Nóminas
      </Typography>

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
                <TableCell>{nomina.salarioBase.toFixed(2)}</TableCell>
                <TableCell>{nomina.salarioBruto.toFixed(2)}</TableCell>
                <TableCell>{nomina.salarioNeto.toFixed(2)}</TableCell>
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
        <Card elevation={3} sx={{ p: 4, mt: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Detalles de Nómina
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>ID Nómina:</strong> {selectedNomina.idNomina}
                </Typography>
                <Typography variant="body1">
                  <strong>Empleado:</strong> {getNombreEmpleado(selectedNomina.idEmpleado)}
                </Typography>
                <Typography variant="body1">
                  <strong>Salario Base:</strong> {selectedNomina.salarioBase.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Salario Bruto:</strong> {selectedNomina.salarioBruto.toFixed(2)}
                </Typography>
                <Typography variant="body1">
                  <strong>Salario Neto:</strong> {selectedNomina.salarioNeto.toFixed(2)}
                </Typography>
              </Grid>
            </Grid>

            <Typography variant="h6" mt={3}>
              Horas Extras
            </Typography>
            {selectedNomina.horasExtras?.length > 0 ? (
              <ul>
                {selectedNomina.horasExtras.map((extra, index) => (
                  <li key={index}>
                    Horas Trabajadas: {extra.horasExtrasTrabajadasMes}, Tarifa Horas Extra: {extra.tarifaHorasExtra.toFixed(2)}, Total: {extra.totalPagarHorasExtra.toFixed(2)}
                  </li>
                ))}
              </ul>
            ) : (
              <Typography>No hay horas extras registradas</Typography>
            )}

            <Typography variant="h6" mt={3}>
              Bonificaciones
            </Typography>
            {mapBonificaciones(selectedNomina.bonificacionesIds).length > 0 ? (
              <ul>
                {mapBonificaciones(selectedNomina.bonificacionesIds).map((b) => (
                  <li key={b.idBonificacion}>
                    {b.tipoBonificacion}: {b.monto.toFixed(2)}
                  </li>
                ))}
              </ul>
            ) : (
              <Typography>No hay bonificaciones registradas</Typography>
            )}

            <Typography variant="h6" mt={3}>
              Deducciones
            </Typography>
            {mapDeducciones(selectedNomina.deduccionesIds).length > 0 ? (
              <ul>
                {mapDeducciones(selectedNomina.deduccionesIds).map((d) => (
                  <li key={d.idDeduccion}>
                    {d.tipoDeduccion}: {d.monto.toFixed(2)}
                  </li>
                ))}
              </ul>
            ) : (
              <Typography>No hay deducciones registradas</Typography>
            )}

            <Typography variant="h6" mt={3}>
              Deducciones Automáticas
            </Typography>
            {selectedNomina.deduccionesAutomaticas?.length > 0 ? (
              <ul>
                {selectedNomina.deduccionesAutomaticas.map((deduccion, index) => (
                  <li key={index}>
                    {deduccion.tipoDeduccion}: {deduccion.monto.toFixed(2)}
                  </li>
                ))}
              </ul>
            ) : (
              <Typography>No hay deducciones automáticas registradas</Typography>
            )}

            <Typography variant="h6" mt={3}>
              Otras Deducciones
            </Typography>
            {selectedNomina.otrasDeducciones?.length > 0 ? (
              <ul>
                {selectedNomina.otrasDeducciones.map((deduccion, index) => (
                  <li key={index}>
                    {deduccion.descripcion}: {deduccion.monto.toFixed(2)}
                  </li>
                ))}
              </ul>
            ) : (
              <Typography>No hay otras deducciones registradas</Typography>
            )}
          </CardContent>
        </Card>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ConsultarNomina;

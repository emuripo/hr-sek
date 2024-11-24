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
  TablePagination,
} from '@mui/material';
import { saveAs } from 'file-saver';
import { getNominas } from '../services/NominaAPI';
import { getEmpleados } from '../services/FuncionarioAPI';
import { getTodosPeriodosNomina } from '../services/nomina/PeriodoNominaAPI';
import { getTodasDeducciones } from '../services/nomina/DeduccionAPI';
import { getTodasBonificaciones } from '../services/nomina/BonificacionAPI';

const Reportes = () => {
  const [nominas, setNominas] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [selectedPeriodo, setSelectedPeriodo] = useState('');
  const [selectedEmpleado, setSelectedEmpleado] = useState('');
  const [filteredNominas, setFilteredNominas] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deducciones, setDeducciones] = useState([]);
  const [bonificaciones, setBonificaciones] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [nominasData, empleadosData, periodosData, deduccionesData, bonificacionesData] = await Promise.all([
          getNominas(),
          getEmpleados(),
          getTodosPeriodosNomina(),
          getTodasDeducciones(),
          getTodasBonificaciones(),
        ]);
        setNominas(nominasData);
        setEmpleados(empleadosData);
        setPeriodos(periodosData);
        setDeducciones(deduccionesData);
        setBonificaciones(bonificacionesData);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
        setSnackbarMessage('Error al cargar los datos.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = nominas.filter((nomina) => {
      const matchPeriodo = selectedPeriodo ? nomina.idPeriodoNomina === selectedPeriodo : true;
      const matchEmpleado = selectedEmpleado ? nomina.idEmpleado === selectedEmpleado : true;
      return matchPeriodo && matchEmpleado;
    });
    setFilteredNominas(filtered);
  }, [selectedPeriodo, selectedEmpleado, nominas]);

  const mapDeducciones = (deduccionesIds) =>
    deducciones.filter((deduccion) => deduccionesIds.includes(deduccion.idDeduccion));

  const mapBonificaciones = (bonificacionesIds) =>
    bonificaciones.filter((bonificacion) => bonificacionesIds.includes(bonificacion.idBonificacion));

  const handleGenerateReport = () => {
    const headers = [
      'Empleado',
      'Período',
      'Salario Base',
      'Salario Bruto',
      'Salario Neto',
      'Bonificaciones',
      'Deducciones',
      'Horas Extras',
      'Deducciones Automáticas',
      'Otras Deducciones',
    ];

    const csvContent = [
      headers.join(','),
      ...filteredNominas.map((nomina) => {
        const empleado = getNombreEmpleado(nomina.idEmpleado);
        const periodo = periodos.find((p) => p.idPeriodoNomina === nomina.idPeriodoNomina);
        const fechaPeriodo = periodo
          ? `Del ${new Date(periodo.fechaInicio).toLocaleDateString()} al ${new Date(periodo.fechaFin).toLocaleDateString()}`
          : 'Período no encontrado';

        const bonificacionesData = mapBonificaciones(nomina.bonificacionesIds || [])
          .map((b) => `${b.tipoBonificacion}: ${(b.monto || 0).toFixed(2)}`)
          .join('; ');

        const deduccionesData = mapDeducciones(nomina.deduccionesIds || [])
          .map((d) => `${d.tipoDeduccion}: ${(d.monto || 0).toFixed(2)}`)
          .join('; ');

        const horasExtrasData = nomina.horasExtras
          ? nomina.horasExtras
              .map(
                (extra) =>
                  `Horas: ${extra.horasExtrasTrabajadasMes || 0}, Tarifa: ${(extra.tarifaHorasExtra || 0).toFixed(
                    2
                  )}, Total: ${(extra.totalPagarHorasExtra || 0).toFixed(2)}`
              )
              .join('; ')
          : 'N/A';

        const deduccionesAutomaticasData = (nomina.deduccionesAutomaticas || [])
          .map((d) => `${d.tipoDeduccion}: ${(d.monto || 0).toFixed(2)}`)
          .join('; ');

        const otrasDeduccionesData = (nomina.otrasDeducciones || [])
          .map((d) => `${d.descripcion}: ${(d.monto || 0).toFixed(2)}`)
          .join('; ');

        return [
          `"${empleado}"`,
          `"${fechaPeriodo}"`,
          (nomina.salarioBase || 0).toFixed(2),
          (nomina.salarioBruto || 0).toFixed(2),
          (nomina.salarioNeto || 0).toFixed(2),
          bonificacionesData || 'N/A',
          deduccionesData || 'N/A',
          horasExtrasData,
          deduccionesAutomaticasData,
          otrasDeduccionesData,
        ].join(',');
      }),
    ].join('\n');

    const bom = '\uFEFF';
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, 'reporte_nominas.csv');
  };

  const getNombreEmpleado = (idEmpleado) => {
    const empleado = empleados.find((emp) => emp.idEmpleado === idEmpleado);
    return empleado
      ? `${empleado.nombre} ${empleado.apellidoUno} ${empleado.apellidoDos}`
      : 'Empleado no encontrado';
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Generar Reportes
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

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="select-empleado-label">Seleccionar Empleado</InputLabel>
        <Select
          labelId="select-empleado-label"
          value={selectedEmpleado}
          onChange={(e) => setSelectedEmpleado(e.target.value)}
        >
          <MenuItem value="">
            <em>Todos los Empleados</em>
          </MenuItem>
          {empleados.map((empleado) => (
            <MenuItem key={empleado.idEmpleado} value={empleado.idEmpleado}>
              {`${empleado.nombre} ${empleado.apellidoUno} ${empleado.apellidoDos}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 3 }}
        onClick={handleGenerateReport}
        disabled={filteredNominas.length === 0}
      >
        Generar Reporte CSV
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Nómina</TableCell>
              <TableCell>Empleado</TableCell>
              <TableCell>Salario Base</TableCell>
              <TableCell>Salario Bruto</TableCell>
              <TableCell>Salario Neto</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredNominas
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((nomina) => (
                <TableRow key={nomina.idNomina}>
                  <TableCell>{nomina.idNomina}</TableCell>
                  <TableCell>{getNombreEmpleado(nomina.idEmpleado)}</TableCell>
                  <TableCell>{(nomina.salarioBase || 0).toFixed(2)}</TableCell>
                  <TableCell>{(nomina.salarioBruto || 0).toFixed(2)}</TableCell>
                  <TableCell>{(nomina.salarioNeto || 0).toFixed(2)}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredNominas.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

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

export default Reportes;

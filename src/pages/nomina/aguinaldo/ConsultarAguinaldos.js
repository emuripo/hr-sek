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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  CircularProgress,
  TableFooter,
  TablePagination,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getPeriodoNominaConAguinaldos, getTodosPeriodosNomina } from '../../../services/nomina/PeriodoNominaAPI';
import { getEmpleados } from '../../../services/FuncionarioAPI';

const ConsultarAguinaldos = () => {
  const [periodos, setPeriodos] = useState([]);
  const [aguinaldos, setAguinaldos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [selectedPeriodo, setSelectedPeriodo] = useState('');
  const [selectedEmpleado, setSelectedEmpleado] = useState('');
  const [filteredAguinaldos, setFilteredAguinaldos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAguinaldo, setSelectedAguinaldo] = useState(null);

  useEffect(() => {
    fetchPeriodos();
    fetchEmpleados();
  }, []);

  useEffect(() => {
    if (selectedEmpleado) {
      filterAguinaldosByEmpleado();
    } else {
      setFilteredAguinaldos(aguinaldos);
    }
  }, [selectedEmpleado, aguinaldos]);

  const fetchPeriodos = async () => {
    try {
      const data = await getTodosPeriodosNomina();
      setPeriodos(data);
    } catch (error) {
      mostrarErrorSnackbar('Error al cargar los períodos de nómina.');
    }
  };

  const fetchEmpleados = async () => {
    try {
      const data = await getEmpleados();
      setEmpleados(data);
    } catch (error) {
      mostrarErrorSnackbar('Error al cargar los empleados.');
    }
  };

  const fetchAguinaldosPorPeriodo = async (idPeriodoNomina) => {
    setLoading(true);
    try {
      const data = await getPeriodoNominaConAguinaldos(idPeriodoNomina);
      const aguinaldosConNombres = data.aguinaldos.map((aguinaldo) => {
        const empleado = empleados.find((emp) => emp.idEmpleado === aguinaldo.idEmpleado);
        return {
          ...aguinaldo,
          nombreEmpleado: empleado ? empleado.nombre : 'Desconocido',
          apellidoEmpleado: empleado ? empleado.apellidoUno : 'Desconocido',
        };
      });
      setAguinaldos(aguinaldosConNombres);
      setFilteredAguinaldos(aguinaldosConNombres);
      setSelectedPeriodo(idPeriodoNomina);
      mostrarExitoSnackbar('Aguinaldos cargados correctamente.');
    } catch (error) {
      mostrarErrorSnackbar('Error al cargar los aguinaldos.');
    } finally {
      setLoading(false);
    }
  };

  const filterAguinaldosByEmpleado = () => {
    const filtered = aguinaldos.filter(
      (aguinaldo) => aguinaldo.idEmpleado === selectedEmpleado
    );
    setFilteredAguinaldos(filtered);
  };

  const mostrarErrorSnackbar = (mensaje) => {
    setSnackbarMessage(mensaje);
    setSnackbarSeverity('error');
    setSnackbarOpen(true);
  };

  const mostrarExitoSnackbar = (mensaje) => {
    setSnackbarMessage(mensaje);
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleDialogOpen = (aguinaldo) => {
    setSelectedAguinaldo(aguinaldo);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setSelectedAguinaldo(null);
    setOpenDialog(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mx: 'auto', mt: 4, maxWidth: 1200 }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Consultar Aguinaldos
      </Typography>

      <Box display="flex" gap={3} alignItems="center" mb={3}>
        <FormControl fullWidth>
          <InputLabel id="periodo-label">Seleccionar Período</InputLabel>
          <Select
            labelId="periodo-label"
            value={selectedPeriodo}
            onChange={(e) => fetchAguinaldosPorPeriodo(e.target.value)}
            fullWidth
          >
            {periodos.map((periodo) => (
              <MenuItem key={periodo.idPeriodoNomina} value={periodo.idPeriodoNomina}>
                {`${periodo.descripcion} (${new Date(periodo.fechaInicio).toLocaleDateString()} - ${new Date(periodo.fechaFin).toLocaleDateString()})`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth disabled={!empleados.length}>
          <InputLabel id="empleado-label">Filtrar por Empleado</InputLabel>
          <Select
            labelId="empleado-label"
            value={selectedEmpleado}
            onChange={(e) => setSelectedEmpleado(e.target.value)}
            fullWidth
          >
            <MenuItem value="">
              <em>Todos</em>
            </MenuItem>
            {empleados.map((empleado) => (
              <MenuItem key={empleado.idEmpleado} value={empleado.idEmpleado}>
                {`${empleado.nombre} ${empleado.apellidoUno}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" my={3}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Nombre Empleado</strong></TableCell>
                <TableCell><strong>Salario Bruto Acumulado</strong></TableCell>
                <TableCell><strong>Aguinaldo Neto</strong></TableCell>
                <TableCell><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAguinaldos
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((aguinaldo, index) => (
                  <TableRow key={index}>
                    <TableCell>{`${aguinaldo.nombreEmpleado} ${aguinaldo.apellidoEmpleado}`}</TableCell>
                    <TableCell>{aguinaldo.salarioBrutoAcumulado}</TableCell>
                    <TableCell>{aguinaldo.aguinaldoNeto}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleDialogOpen(aguinaldo)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 15]}
                  count={filteredAguinaldos.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Detalles del Aguinaldo</DialogTitle>
        <DialogContent>
          {selectedAguinaldo && (
            <>
              <Typography><strong>Salario Bruto Acumulado:</strong> {selectedAguinaldo.salarioBrutoAcumulado}</Typography>
              <Typography><strong>Aguinaldo Bruto:</strong> {selectedAguinaldo.aguinaldoBruto}</Typography>
              <Typography><strong>Deducciones:</strong> {selectedAguinaldo.deducciones}</Typography>
              <Typography><strong>Aguinaldo Neto:</strong> {selectedAguinaldo.aguinaldoNeto}</Typography>
              <Typography><strong>Período:</strong> {`${new Date(selectedAguinaldo.fechaInicioPeriodo).toLocaleDateString()} - ${new Date(selectedAguinaldo.fechaFinPeriodo).toLocaleDateString()}`}</Typography>
              <Typography><strong>Generado Por:</strong> {selectedAguinaldo.generadoPor}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">Cerrar</Button>
        </DialogActions>
      </Dialog>

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

import React, { useState, useEffect } from 'react';
import {
  Table,
  TablePagination,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  ListItemText,
  OutlinedInput,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { getNominas, updateNomina } from '../../services/NominaAPI';
import { getEmpleados } from '../../services/FuncionarioAPI';
import { getTodosPeriodosNomina } from '../../services/nomina/PeriodoNominaAPI';
import { getTodasDeducciones } from '../../services/nomina/DeduccionAPI';
import { getTodasBonificaciones } from '../../services/nomina/BonificacionAPI';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ConsultarNomina = () => {
  const [nominas, setNominas] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [deducciones, setDeducciones] = useState([]);
  const [bonificaciones, setBonificaciones] = useState([]);
  const [selectedPeriodo, setSelectedPeriodo] = useState('');
  const [filteredNominas, setFilteredNominas] = useState([]);
  const [selectedNomina, setSelectedNomina] = useState(null);
  const [editingNomina, setEditingNomina] = useState(null);
  const [editedNomina, setEditedNomina] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Estados añadidos para la funcionalidad de desactivar y mostrar nóminas desactivadas
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [nominaToDeactivate, setNominaToDeactivate] = useState(null);
  const [showInactive, setShowInactive] = useState(false);

  // Estados para paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchNominas();
    fetchEmpleados();
    fetchPeriodos();
    fetchDeducciones();
    fetchBonificaciones();
  }, []);

  useEffect(() => {
    // Actualización del filtrado para considerar nóminas activas/inactivas
    const filtered = nominas.filter((nomina) => {
      const matchesPeriodo = selectedPeriodo ? nomina.idPeriodoNomina === selectedPeriodo : true;
      const matchesActiva = showInactive ? true : nomina.activa;
      return matchesPeriodo && matchesActiva;
    });
    setFilteredNominas(filtered);
  }, [selectedPeriodo, nominas, showInactive]);

  useEffect(() => {
    if (editingNomina) {
      setEditedNomina({ ...editingNomina });
    }
  }, [editingNomina]);

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
    const deduccionesAutomaticas = calcularDeduccionesAutomaticas(Number(nomina.salarioBase));

    // Obtener las deducciones y bonificaciones mapeadas
    const deduccionesSeleccionadas = mapDeducciones(nomina.deduccionesIds || []);
    const bonificacionesSeleccionadas = mapBonificaciones(nomina.bonificacionesIds || []);

    // Simular horas extras y otras deducciones si no están disponibles
    const horasExtras = nomina.horasExtras || [];
    const otrasDeducciones = nomina.otrasDeducciones || [
      { descripcion: 'Préstamo Personal', monto: 12000 },
      { descripcion: 'Seguro Médico', monto: 8000 },
    ];

    setSelectedNomina({
      ...nomina,
      deduccionesAutomaticas,
      deduccionesSeleccionadas,
      bonificacionesSeleccionadas,
      horasExtras,
      otrasDeducciones,
    });
  };

  // Función para manejar la edición de una nómina
  const handleEditNomina = (nomina) => {
    setEditingNomina(nomina);
  };

  // Función para manejar la desactivación de una nómina
  const handleDeactivateNomina = (nomina) => {
    setNominaToDeactivate(nomina);
    setConfirmDialogOpen(true);
  };

  const confirmDeactivateNomina = async () => {
    try {
      const updatedNomina = { ...nominaToDeactivate, activa: false };
      await updateNomina(updatedNomina.idNomina, updatedNomina);
      setNominas((prevNominas) =>
        prevNominas.map((nomina) =>
          nomina.idNomina === updatedNomina.idNomina ? updatedNomina : nomina
        )
      );
      setSnackbarMessage('Nómina desactivada exitosamente.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error al desactivar la nómina:', error);
      setSnackbarMessage('Error al desactivar la nómina.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setConfirmDialogOpen(false);
      setNominaToDeactivate(null);
    }
  };

  // Modificación de esta función para convertir valores numéricos
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;

    // Convertir a número si es un campo numérico
    if (['salarioBase', 'salarioBruto', 'salarioNeto', 'impuestos'].includes(name)) {
      parsedValue = parseFloat(value) || 0;
    }

    setEditedNomina((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleSelectChange = (name, value) => {
    setEditedNomina((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveNomina = async () => {
    try {
      await updateNomina(editedNomina.idNomina, editedNomina);
      setNominas((prevNominas) =>
        prevNominas.map((nomina) =>
          nomina.idNomina === editedNomina.idNomina ? editedNomina : nomina
        )
      );
      setSnackbarMessage('Nómina actualizada exitosamente.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setEditingNomina(null);
    } catch (error) {
      console.error('Error al actualizar la nómina:', error);
      setSnackbarMessage('Error al actualizar la nómina.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
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

  // Funciones para paginación
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
        Consultar Nóminas
      </Typography>

      {/* Añadido Switch para mostrar nóminas desactivadas */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="select-periodo-label">Seleccionar Período</InputLabel>
            <Select
              labelId="select-periodo-label"
              value={selectedPeriodo}
              onChange={(e) => setSelectedPeriodo(e.target.value)}
              label="Seleccionar Período"
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
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                color="primary"
              />
            }
            label="Mostrar Nóminas Desactivadas"
          />
        </Grid>
      </Grid>

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
            {filteredNominas
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((nomina) => (
                <TableRow key={nomina.idNomina}>
                  <TableCell>{nomina.idNomina}</TableCell>
                  <TableCell>{getNombreEmpleado(nomina.idEmpleado)}</TableCell>
                  <TableCell>{Number(nomina.salarioBase).toFixed(2)}</TableCell>
                  <TableCell>{Number(nomina.salarioBruto).toFixed(2)}</TableCell>
                  <TableCell>{Number(nomina.salarioNeto).toFixed(2)}</TableCell>
                  <TableCell>{nomina.activa ? 'Activa' : 'Inactiva'}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleViewNomina(nomina)}
                    >
                      Ver Detalles
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleEditNomina(nomina)}
                      sx={{ ml: 1 }}
                    >
                      <EditIcon />
                    </Button>
                    {/* Añadido botón de desactivar */}
                    {nomina.activa && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeactivateNomina(nomina)}
                        sx={{ ml: 1 }}
                      >
                        <DeleteIcon />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredNominas.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          labelRowsPerPage="Filas por página:"
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Diálogo de confirmación para desactivar nómina */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Desactivar Nómina</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas desactivar la nómina seleccionada?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={confirmDeactivateNomina} color="error">
            Desactivar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Formulario de edición */}
      {editingNomina && editedNomina && (
        <Dialog open={true} onClose={() => setEditingNomina(null)} fullWidth>
          <DialogTitle>Editar Nómina</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="select-empleado-label">Empleado</InputLabel>
              <Select
                labelId="select-empleado-label"
                value={editedNomina.idEmpleado}
                name="idEmpleado"
                onChange={(e) => handleSelectChange('idEmpleado', e.target.value)}
              >
                {empleados.map((empleado) => (
                  <MenuItem key={empleado.idEmpleado} value={empleado.idEmpleado}>
                    {`${empleado.nombre} ${empleado.apellidoUno} ${empleado.apellidoDos}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              margin="dense"
              label="Salario Base"
              type="number"
              fullWidth
              name="salarioBase"
              value={editedNomina.salarioBase}
              onChange={handleInputChange}
            />

            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="select-deducciones-label">Deducciones</InputLabel>
              <Select
                labelId="select-deducciones-label"
                multiple
                value={editedNomina.deduccionesIds || []}
                onChange={(e) => handleSelectChange('deduccionesIds', e.target.value)}
                input={<OutlinedInput label="Deducciones" />}
                renderValue={(selected) =>
                  deducciones
                    .filter((d) => selected.includes(d.idDeduccion))
                    .map((d) => d.tipoDeduccion)
                    .join(', ')
                }
              >
                {deducciones.map((deduccion) => (
                  <MenuItem key={deduccion.idDeduccion} value={deduccion.idDeduccion}>
                    <Checkbox
                      checked={editedNomina.deduccionesIds?.includes(deduccion.idDeduccion)}
                    />
                    <ListItemText primary={deduccion.tipoDeduccion} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="select-bonificaciones-label">Bonificaciones</InputLabel>
              <Select
                labelId="select-bonificaciones-label"
                multiple
                value={editedNomina.bonificacionesIds || []}
                onChange={(e) => handleSelectChange('bonificacionesIds', e.target.value)}
                input={<OutlinedInput label="Bonificaciones" />}
                renderValue={(selected) =>
                  bonificaciones
                    .filter((b) => selected.includes(b.idBonificacion))
                    .map((b) => b.tipoBonificacion)
                    .join(', ')
                }
              >
                {bonificaciones.map((bonificacion) => (
                  <MenuItem key={bonificacion.idBonificacion} value={bonificacion.idBonificacion}>
                    <Checkbox
                      checked={editedNomina.bonificacionesIds?.includes(bonificacion.idBonificacion)}
                    />
                    <ListItemText primary={bonificacion.tipoBonificacion} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="select-periodo-label">Período de Nómina</InputLabel>
              <Select
                labelId="select-periodo-label"
                value={editedNomina.idPeriodoNomina}
                name="idPeriodoNomina"
                onChange={(e) => handleSelectChange('idPeriodoNomina', e.target.value)}
              >
                {periodos.map((periodo) => (
                  <MenuItem key={periodo.idPeriodoNomina} value={periodo.idPeriodoNomina}>
                    {`Del ${new Date(periodo.fechaInicio).toLocaleDateString()} al ${new Date(
                      periodo.fechaFin
                    ).toLocaleDateString()}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Puedes agregar más campos según sea necesario */}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditingNomina(null)} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleSaveNomina} color="primary">
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Detalles de Nómina */}
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
                  <strong>Salario Base:</strong> {Number(selectedNomina.salarioBase).toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Salario Bruto:</strong> {Number(selectedNomina.salarioBruto).toFixed(2)}
                </Typography>
                <Typography variant="body1">
                  <strong>Salario Neto:</strong> {Number(selectedNomina.salarioNeto).toFixed(2)}
                </Typography>
              </Grid>
            </Grid>

            {/* Horas Extras */}
            <Typography variant="h6" mt={3}>
              Horas Extras
            </Typography>
            {selectedNomina.horasExtras?.length > 0 ? (
              <ul>
                {selectedNomina.horasExtras.map((extra, index) => (
                  <li key={index}>
                    Horas Trabajadas: {extra.horasExtrasTrabajadasMes}, Tarifa Horas Extra:{' '}
                    {Number(extra.tarifaHorasExtra).toFixed(2)}, Total:{' '}
                    {Number(extra.totalPagarHorasExtra).toFixed(2)}
                  </li>
                ))}
              </ul>
            ) : (
              <Typography>No hay horas extras registradas</Typography>
            )}

            {/* Bonificaciones */}
            <Typography variant="h6" mt={3}>
              Bonificaciones
            </Typography>
            {selectedNomina.bonificacionesSeleccionadas?.length > 0 ? (
              <ul>
                {selectedNomina.bonificacionesSeleccionadas.map((b) => (
                  <li key={b.idBonificacion}>
                    {b.tipoBonificacion}: {Number(b.monto).toFixed(2)}
                  </li>
                ))}
              </ul>
            ) : (
              <Typography>No hay bonificaciones registradas</Typography>
            )}

            {/* Deducciones */}
            <Typography variant="h6" mt={3}>
              Deducciones
            </Typography>
            {selectedNomina.deduccionesSeleccionadas?.length > 0 ? (
              <ul>
                {selectedNomina.deduccionesSeleccionadas.map((d) => (
                  <li key={d.idDeduccion}>
                    {d.tipoDeduccion}: {Number(d.monto).toFixed(2)}
                  </li>
                ))}
              </ul>
            ) : (
              <Typography>No hay deducciones registradas</Typography>
            )}

            {/* Deducciones Automáticas */}
            <Typography variant="h6" mt={3}>
              Deducciones Automáticas
            </Typography>
            {selectedNomina.deduccionesAutomaticas?.length > 0 ? (
              <ul>
                {selectedNomina.deduccionesAutomaticas.map((deduccion, index) => (
                  <li key={index}>
                    {deduccion.tipoDeduccion}: {Number(deduccion.monto).toFixed(2)}
                  </li>
                ))}
              </ul>
            ) : (
              <Typography>No hay deducciones automáticas registradas</Typography>
            )}

            {/* Otras Deducciones */}
            <Typography variant="h6" mt={3}>
              Otras Deducciones
            </Typography>
            {selectedNomina.otrasDeducciones?.length > 0 ? (
              <ul>
                {selectedNomina.otrasDeducciones.map((deduccion, index) => (
                  <li key={index}>
                    {deduccion.descripcion}: {Number(deduccion.monto).toFixed(2)}
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

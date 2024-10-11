import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, CircularProgress, Typography,
  TablePagination, TextField, Button, Grid, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Fab
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add'; // Icono de añadir

function Empleados() {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filter, setFilter] = useState('');
  const [openDialog, setOpenDialog] = useState(false); // Para controlar el cuadro emergente

  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    cedula: '',
    nombre: '',
    apellidoUno: '',
    apellidoDos: '',
    correoElectronico: '',
    fechaNacimiento: '',
    numeroCelular: '',
    empleadoActivo: true,
    idGenero: '',
    provincia: '',
    canton: '',
    distrito: '',
    direccion: '',
    fechaInicioContrato: '',
    fechaFinContrato: null,
    salarioBase: ''
  });

  useEffect(() => {
    async function fetchEmpleados() {
      try {
        const response = await axios.get('http://localhost:8085/api/Empleado');
        console.log('Datos de empleados:', response.data);
        if (Array.isArray(response.data)) {
          setEmpleados(response.data);
        } else {
          console.error('Estructura de datos inesperada:', response.data);
        }
      } catch (error) {
        console.error('Error al obtener los empleados:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEmpleados();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoEmpleado({
      ...nuevoEmpleado,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8085/api/Empleado', nuevoEmpleado);
      console.log('Empleado creado:', response.data);
      setEmpleados([...empleados, response.data]);  // Añadir el nuevo empleado a la lista
      setOpenDialog(false);  // Cerrar el cuadro emergente
    } catch (error) {
      console.error('Error al crear el empleado:', error);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const filteredEmpleados = empleados.filter((empleado) =>
    empleado.nombre.toLowerCase().includes(filter.toLowerCase()) ||
    empleado.apellidoUno.toLowerCase().includes(filter.toLowerCase()) ||
    empleado.apellidoDos.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Gestión de Empleados
      </Typography>

      <TextField
        label="Filtrar por nombre o apellidos"
        variant="outlined"
        value={filter}
        onChange={handleFilterChange}
        sx={{ marginBottom: 2 }}
      />

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="Tabla de empleados">
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Cédula</TableCell>
                  <TableCell align="center" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Nombre Completo</TableCell>
                  <TableCell align="center" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Correo Electrónico</TableCell>
                  <TableCell align="center" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Teléfono</TableCell>
                  <TableCell align="center" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Provincia</TableCell>
                  <TableCell align="center" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Cantón</TableCell>
                  <TableCell align="center" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Distrito</TableCell>
                  <TableCell align="center" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Dirección Exacta</TableCell>
                  <TableCell align="center" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Salario Base</TableCell>
                  <TableCell align="center" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Fecha Inicio Contrato</TableCell>
                  <TableCell align="center" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Fecha Fin Contrato</TableCell>
                  <TableCell align="center" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEmpleados.length > 0 ? (
                  filteredEmpleados
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((empleado) => (
                      <TableRow key={empleado.idEmpleado}>
                        <TableCell align="center">{empleado.cedula}</TableCell>
                        <TableCell align="center">{`${empleado.nombre} ${empleado.apellidoUno} ${empleado.apellidoDos}`}</TableCell>
                        <TableCell align="center">{empleado.correoElectronico}</TableCell>
                        <TableCell align="center">{empleado.numeroCelular}</TableCell>
                        <TableCell align="center">{empleado.direccionFuncionario?.provincia || 'Sin provincia'}</TableCell>
                        <TableCell align="center">{empleado.direccionFuncionario?.canton || 'Sin cantón'}</TableCell>
                        <TableCell align="center">{empleado.direccionFuncionario?.distrito || 'Sin distrito'}</TableCell>
                        <TableCell align="center">{empleado.direccionFuncionario?.direccionExacta || 'Sin dirección exacta'}</TableCell>
                        <TableCell align="center">{empleado.infoContratoFuncionario?.salarioBase?.toFixed(2) || 'Sin salario'}</TableCell>
                        <TableCell align="center">{empleado.infoContratoFuncionario?.fechaContratacion || 'Sin fecha de inicio'}</TableCell>
                        <TableCell align="center">{empleado.infoContratoFuncionario?.fechaFinContrato || 'Indefinido'}</TableCell>
                        <TableCell align="center">{empleado.empleadoActivo ? 'Activo' : 'Inactivo'}</TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={12} align="center">No hay empleados disponibles.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredEmpleados.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por página"
          />
        </>
      )}

      {/* Botón flotante para añadir empleado */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleOpenDialog}
      >
        <AddIcon />
      </Fab>

      {/* Cuadro emergente para el formulario */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Añadir Nuevo Empleado</DialogTitle>
        <DialogContent>
          <form onSubmit={handleFormSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Cédula"
                  name="cedula"
                  fullWidth
                  value={nuevoEmpleado.cedula}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Nombre"
                  name="nombre"
                  fullWidth
                  value={nuevoEmpleado.nombre}
                  onChange={handleInputChange}
                />
              </Grid>
              {/* Añade los demás campos según tu estructura de datos */}
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Apellido Uno"
                  name="apellidoUno"
                  fullWidth
                  value={nuevoEmpleado.apellidoUno}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Apellido Dos"
                  name="apellidoDos"
                  fullWidth
                  value={nuevoEmpleado.apellidoDos}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Correo Electrónico"
                  name="correoElectronico"
                  fullWidth
                  value={nuevoEmpleado.correoElectronico}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Fecha de Nacimiento"
                  name="fechaNacimiento"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  value={nuevoEmpleado.fechaNacimiento}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Teléfono"
                  name="numeroCelular"
                  fullWidth
                  value={nuevoEmpleado.numeroCelular}
                  onChange={handleInputChange}
                />
              </Grid>
              {/* más campos para completar el formulario */}
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button type="submit" onClick={handleFormSubmit}>Añadir</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Empleados;

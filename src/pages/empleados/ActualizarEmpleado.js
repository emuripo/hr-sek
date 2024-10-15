import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, Select, MenuItem, InputLabel, FormControl, Snackbar, Alert } from '@mui/material';
import { updateEmpleado } from '../../services/FuncionarioAPI'; // Asume que tienes un servicio para actualizar el empleado

function ActualizarEmpleado({ open, onClose, empleadoSeleccionado, setEmpleados, empleados, refetchEmpleados }) { // Añadir refetchEmpleados
  const [empleado, setEmpleado] = useState({
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
    salarioBase: ''
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Cargar datos del empleado seleccionado cuando el diálogo esté abierto
  useEffect(() => {
    if (empleadoSeleccionado) {
      setEmpleado({ ...empleadoSeleccionado });
    }
  }, [empleadoSeleccionado]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmpleado({
      ...empleado,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const empleadoData = {
        ...empleado,
        fechaNacimiento: new Date(empleado.fechaNacimiento).toISOString(),
        fechaInicioContrato: new Date(empleado.fechaInicioContrato).toISOString(),
      };

      const updatedEmpleado = await updateEmpleado(empleado.idEmpleado, empleadoData); // Asume que tienes una función para actualizar

      // Actualiza el estado de empleados con los datos actualizados
      const updatedEmpleados = empleados.map(emp =>
        emp.idEmpleado === updatedEmpleado.idEmpleado ? updatedEmpleado : emp
      );
      setEmpleados(updatedEmpleados);

      setSnackbarMessage('Empleado actualizado con éxito');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      onClose(); // Cerrar el diálogo después de la actualización

      // Refrescar la tabla de empleados después de la actualización
      refetchEmpleados(); // Llamamos a la función pasada desde Empleados.js
    } catch (error) {
      console.error('Error al actualizar el empleado:', error);
      setSnackbarMessage('No se pudo actualizar el empleado');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Actualizar Empleado</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Cédula"
                  name="cedula"
                  fullWidth
                  value={empleado.cedula}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Nombre"
                  name="nombre"
                  fullWidth
                  value={empleado.nombre}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Apellido Uno"
                  name="apellidoUno"
                  fullWidth
                  value={empleado.apellidoUno}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Apellido Dos"
                  name="apellidoDos"
                  fullWidth
                  value={empleado.apellidoDos}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  label="Correo Electrónico"
                  name="correoElectronico"
                  fullWidth
                  value={empleado.correoElectronico}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Fecha de Nacimiento"
                  name="fechaNacimiento"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  value={empleado.fechaNacimiento}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Teléfono"
                  name="numeroCelular"
                  fullWidth
                  value={empleado.numeroCelular}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="select-genero-label">Género</InputLabel>
                  <Select
                    labelId="select-genero-label"
                    name="idGenero"
                    value={empleado.idGenero}
                    onChange={handleInputChange}
                    required
                  >
                    <MenuItem value={1}>Masculino</MenuItem>
                    <MenuItem value={2}>Femenino</MenuItem>
                    <MenuItem value={3}>Otro</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Provincia"
                  name="provincia"
                  fullWidth
                  value={empleado.provincia}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Cantón"
                  name="canton"
                  fullWidth
                  value={empleado.canton}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Distrito"
                  name="distrito"
                  fullWidth
                  value={empleado.distrito}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  label="Dirección Exacta"
                  name="direccion"
                  fullWidth
                  value={empleado.direccion}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Fecha de Inicio del Contrato"
                  name="fechaInicioContrato"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  value={empleado.fechaInicioContrato}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Salario Base"
                  name="salarioBase"
                  fullWidth
                  type="number"
                  value={empleado.salarioBase}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} type="submit">Actualizar</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for success or error message */}
      <Snackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default ActualizarEmpleado;

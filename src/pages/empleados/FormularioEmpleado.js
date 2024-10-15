import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, Select, MenuItem, InputLabel, FormControl, Snackbar, Alert } from '@mui/material';
import { createEmpleado } from '../../services/FuncionarioAPI';

function FormularioEmpleado({ open, onClose, setEmpleados, empleados }) {
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    cedula: '',
    nombre: '',
    apellidoUno: '',
    apellidoDos: '',
    correoElectronico: '',
    fechaNacimiento: '',
    numeroCelular: '',
    empleadoActivo: true,
    idGenero: '', // Select for gender
    provincia: '',
    canton: '',
    distrito: '',
    direccion: '',
    fechaInicioContrato: '',
    salarioBase: ''
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // success or error

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoEmpleado({
      ...nuevoEmpleado,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const empleadoData = {
        ...nuevoEmpleado,
        fechaNacimiento: new Date(nuevoEmpleado.fechaNacimiento).toISOString(),
        fechaInicioContrato: new Date(nuevoEmpleado.fechaInicioContrato).toISOString(),
        fechaFinContrato: null, // Always set to null
      };

      const createdEmpleado = await createEmpleado(empleadoData);
      setEmpleados([...empleados, createdEmpleado]);
      setSnackbarMessage('Empleado añadido con éxito');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      onClose(); // Cerrar el diálogo después de agregar
    } catch (error) {
      console.error('Error al crear el empleado:', error);
      setSnackbarMessage('No se pudo agregar el empleado');
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
        <DialogTitle>Añadir Nuevo Empleado</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
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
                  required
                  label="Apellido Dos"
                  name="apellidoDos"
                  fullWidth
                  value={nuevoEmpleado.apellidoDos}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  label="Correo Electrónico"
                  name="correoElectronico"
                  fullWidth
                  value={nuevoEmpleado.correoElectronico}
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
                  value={nuevoEmpleado.fechaNacimiento}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Teléfono"
                  name="numeroCelular"
                  fullWidth
                  value={nuevoEmpleado.numeroCelular}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="select-genero-label">Género</InputLabel>
                  <Select
                    labelId="select-genero-label"
                    name="idGenero"
                    value={nuevoEmpleado.idGenero}
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
                  value={nuevoEmpleado.provincia}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Cantón"
                  name="canton"
                  fullWidth
                  value={nuevoEmpleado.canton}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Distrito"
                  name="distrito"
                  fullWidth
                  value={nuevoEmpleado.distrito}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  label="Dirección Exacta"
                  name="direccion"
                  fullWidth
                  value={nuevoEmpleado.direccion}
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
                  value={nuevoEmpleado.fechaInicioContrato}
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
                  value={nuevoEmpleado.salarioBase}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} type="submit">Añadir</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for success or error message */}
      <Snackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        autoHideDuration={6000} // Aumenta la duración si es necesario
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Ubicación del Snackbar
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default FormularioEmpleado;

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const onlyLettersFields = ['nombre', 'apellidoUno', 'apellidoDos', 'provincia', 'canton', 'distrito'];
    if (onlyLettersFields.includes(name)) {
      const regex = /^[A-Za-zÀ-ÿ\s]+$/;
      if (!regex.test(value)) return;
    }

    if (name === 'cedula') {
      const regex = /^[0-9]{0,10}$/;
      if (regex.test(value)) setNuevoEmpleado({ ...nuevoEmpleado, [name]: value });
      return;
    }

    if (name === 'numeroCelular') {
      const regex = /^[0-9]{8}$/;
      if (regex.test(value)) setNuevoEmpleado({ ...nuevoEmpleado, [name]: value });
      return;
    }

    if (name === 'salarioBase') {
      const salary = parseInt(value, 10);
      if (!isNaN(salary) && salary <= 999999) {
        setNuevoEmpleado({ ...nuevoEmpleado, [name]: value });
      } else if (salary > 999999) {
        setSnackbarMessage('El salario base no puede superar las cifras de seis dígitos.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
      return;
    }

    setNuevoEmpleado({ ...nuevoEmpleado, [name]: value });
  };

  const isEmailValid = (email) => /^[a-zA-Z]+\.[a-zA-Z]+@sekcostarica\.com$/.test(email);

  const today = new Date();
  const eighteenYearsAgo = new Date(today.setFullYear(today.getFullYear() - 18)).toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nuevoEmpleado.cedula || nuevoEmpleado.cedula.length !== 10) {
      setSnackbarMessage('La cédula debe tener exactamente 10 dígitos.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (!nuevoEmpleado.nombre || nuevoEmpleado.nombre.length < 2) {
      setSnackbarMessage('El nombre debe tener al menos 2 caracteres.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (!nuevoEmpleado.apellidoUno || nuevoEmpleado.apellidoUno.length < 2) {
      setSnackbarMessage('El primer apellido debe tener al menos 2 caracteres.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (!nuevoEmpleado.apellidoDos || nuevoEmpleado.apellidoDos.length < 2) {
      setSnackbarMessage('El segundo apellido debe tener al menos 2 caracteres.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (!nuevoEmpleado.correoElectronico || !isEmailValid(nuevoEmpleado.correoElectronico)) {
      setSnackbarMessage('El correo debe tener el formato nombre.apellido@sekcostarica.com');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (!nuevoEmpleado.provincia || nuevoEmpleado.provincia.length < 2 || nuevoEmpleado.provincia.length > 50) {
      setSnackbarMessage('La provincia debe tener entre 2 y 50 caracteres.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (!nuevoEmpleado.canton || nuevoEmpleado.canton.length < 2 || nuevoEmpleado.canton.length > 50) {
      setSnackbarMessage('El cantón debe tener entre 2 y 50 caracteres.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (!nuevoEmpleado.distrito || nuevoEmpleado.distrito.length < 2 || nuevoEmpleado.distrito.length > 50) {
      setSnackbarMessage('El distrito debe tener entre 2 y 50 caracteres.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (!nuevoEmpleado.direccion || nuevoEmpleado.direccion.length < 5 || nuevoEmpleado.direccion.length > 200) {
      setSnackbarMessage('La dirección debe tener entre 5 y 200 caracteres.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (!nuevoEmpleado.fechaNacimiento) {
      setSnackbarMessage('La fecha de nacimiento es requerida.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (!nuevoEmpleado.numeroCelular || nuevoEmpleado.numeroCelular.length !== 8) {
      setSnackbarMessage('El número de celular debe tener exactamente 8 dígitos.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      const empleadoData = {
        ...nuevoEmpleado,
        cedula: nuevoEmpleado.cedula.toString(),
        fechaNacimiento: new Date(nuevoEmpleado.fechaNacimiento).toISOString(),
        fechaInicioContrato: new Date(nuevoEmpleado.fechaInicioContrato).toISOString(),
        fechaFinContrato: null
      };

      const createdEmpleado = await createEmpleado(empleadoData);
      setEmpleados([...empleados, createdEmpleado]);
      setSnackbarMessage('Empleado añadido con éxito');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      onClose();
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
                  inputProps={{ maxLength: 10 }}
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
                  error={!isEmailValid(nuevoEmpleado.correoElectronico) && nuevoEmpleado.correoElectronico !== ''}
                  helperText={
                    !isEmailValid(nuevoEmpleado.correoElectronico) && nuevoEmpleado.correoElectronico !== '' 
                      ? 'Correo electrónico inválido' 
                      : ''
                  }
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
                  inputProps={{ max: eighteenYearsAgo }}
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
                  inputProps={{ maxLength: 8 }}
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
                  inputProps={{ minLength: 2, maxLength: 50 }}
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
                  inputProps={{ minLength: 2, maxLength: 50 }}
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
                  inputProps={{ minLength: 2, maxLength: 50 }}
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
                  inputProps={{ minLength: 5, maxLength: 200 }}
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
                  inputProps={{ max: 999999 }}
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

export default FormularioEmpleado;

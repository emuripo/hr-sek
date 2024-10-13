import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { createEmpleado } from '../../services/api';

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
    idGenero: '',  // Select for gender
    provincia: '',
    canton: '',
    distrito: '',
    direccion: '',
    fechaInicioContrato: '',
    salarioBase: ''
  });

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
        fechaFinContrato: null, // This is always set to null as requested
      };

      const createdEmpleado = await createEmpleado(empleadoData);
      setEmpleados([...empleados, createdEmpleado]);
      onClose();
    } catch (error) {
      console.error('Error al crear el empleado:', error);
    }
  };

  return (
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
  );
}

export default FormularioEmpleado;

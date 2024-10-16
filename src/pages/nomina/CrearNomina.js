import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, Select, MenuItem, InputLabel,
  FormControl, Snackbar, Alert
} from '@mui/material';
import { createNomina } from '../../services/NominaAPI';
import { getEmpleados } from '../../services/FuncionarioAPI';

function CrearNomina({ open, onClose, setNominas, nominas, refetchDatos }) {
  const [nomina, setNomina] = useState({
    idEmpleado: '',
    salarioBase: '',
    deducciones: [],
    bonificaciones: [],
    horasExtras: [],
    vacaciones: []
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Obtener empleados para el select
  const [empleados, setEmpleadosLocal] = useState([]);

  React.useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const empleadosData = await getEmpleados();
        setEmpleadosLocal(empleadosData);
      } catch (error) {
        console.error('Error al obtener empleados:', error);
      }
    };
    fetchEmpleados();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNomina({
      ...nomina,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const nominaData = {
        ...nomina,
        salarioBase: parseFloat(nomina.salarioBase),
        salarioBruto: parseFloat(nomina.salarioBase) + 0, // Calcula según lógica
        salarioNeto: parseFloat(nomina.salarioBase) - 0, // Calcula según lógica
        fechaGeneracion: new Date().toISOString(),
        activa: true,
        idPeriodoNomina: 1, // Ajusta según lógica
        deducciones: nomina.deducciones, // Debes manejar cómo agregar deducciones
        bonificaciones: nomina.bonificaciones, // Debes manejar cómo agregar bonificaciones
        horasExtras: nomina.horasExtras, // Debes manejar cómo agregar horas extras
        vacaciones: nomina.vacaciones // Debes manejar cómo agregar vacaciones
      };

      const nuevaNomina = await createNomina(nominaData);
      setNominas([...nominas, nuevaNomina]);
      setSnackbarMessage('Nómina creada con éxito');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      onClose();
      refetchDatos();
    } catch (error) {
      console.error('Error al crear la nómina:', error);
      setSnackbarMessage('No se pudo crear la nómina');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Crear Nueva Nómina</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Seleccionar Empleado */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel id="select-empleado-label">Empleado</InputLabel>
                  <Select
                    labelId="select-empleado-label"
                    name="idEmpleado"
                    value={nomina.idEmpleado}
                    onChange={handleInputChange}
                    label="Empleado"
                  >
                    {empleados.map(emp => (
                      <MenuItem key={emp.idEmpleado} value={emp.idEmpleado}>
                        {`${emp.nombre} ${emp.apellidoUno} ${emp.apellidoDos}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Salario Base */}
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Salario Base"
                  name="salarioBase"
                  type="number"
                  fullWidth
                  value={nomina.salarioBase}
                  onChange={handleInputChange}
                />
              </Grid>

              {/* Aquí puedes agregar más campos para deducciones, bonificaciones, etc. */}
              {/* Por simplicidad, omitiremos estos campos, pero puedes expandirlos según tus necesidades */}
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} type="submit" variant="contained">Crear</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensajes */}
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

export default CrearNomina;

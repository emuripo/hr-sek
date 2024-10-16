import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, Select, MenuItem, InputLabel,
  FormControl, Snackbar, Alert, IconButton, Typography
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { createNomina } from '../../services/NominaAPI';
import { getEmpleados } from '../../services/FuncionarioAPI';

function CrearNomina({ open, onClose, setNominas, nominas, refetchDatos }) {
  const [nomina, setNomina] = useState({
    idEmpleado: '',
    salarioBase: 0,
    deducciones: [],
    bonificaciones: [],
    horasExtras: [],
    vacaciones: []
  });

  const [empleados, setEmpleadosLocal] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Obtener empleados para el select
  useEffect(() => {
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

  // Actualizar salarioBase cuando se selecciona un empleado
  useEffect(() => {
    if (nomina.idEmpleado) {
      const empleadoSeleccionado = empleados.find(emp => emp.idEmpleado === nomina.idEmpleado);
      if (empleadoSeleccionado) {
        setNomina(prevNomina => ({
          ...prevNomina,
          salarioBase: parseFloat(empleadoSeleccionado.infoContratoFuncionario.salarioBase) || 0
        }));
      }
    } else {
      setNomina(prevNomina => ({
        ...prevNomina,
        salarioBase: 0
      }));
    }
  }, [nomina.idEmpleado, empleados]);

  // Función para manejar cambios en campos de texto
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNomina({
      ...nomina,
      [name]: value,
    });
  };

  // Función para manejar cambios en deducciones
  const handleDeduccionChange = (index, e) => {
    const { name, value } = e.target;
    const updatedDeducciones = nomina.deducciones.map((deduccion, i) => (
      i === index ? { ...deduccion, [name]: value } : deduccion
    ));
    setNomina({
      ...nomina,
      deducciones: updatedDeducciones,
    });
  };

  // Función para agregar una deducción
  const addDeduccion = () => {
    setNomina({
      ...nomina,
      deducciones: [...nomina.deducciones, { tipoDeduccion: '', monto: 0 }],
    });
  };

  // Función para eliminar una deducción
  const removeDeduccion = (index) => {
    const updatedDeducciones = nomina.deducciones.filter((_, i) => i !== index);
    setNomina({
      ...nomina,
      deducciones: updatedDeducciones,
    });
  };

  // Función para manejar cambios en bonificaciones
  const handleBonificacionChange = (index, e) => {
    const { name, value } = e.target;
    const updatedBonificaciones = nomina.bonificaciones.map((bonificacion, i) => (
      i === index ? { ...bonificacion, [name]: value } : bonificacion
    ));
    setNomina({
      ...nomina,
      bonificaciones: updatedBonificaciones,
    });
  };

  // Función para agregar una bonificación
  const addBonificacion = () => {
    setNomina({
      ...nomina,
      bonificaciones: [...nomina.bonificaciones, { tipoBonificacion: '', monto: 0 }],
    });
  };

  // Función para eliminar una bonificación
  const removeBonificacion = (index) => {
    const updatedBonificaciones = nomina.bonificaciones.filter((_, i) => i !== index);
    setNomina({
      ...nomina,
      bonificaciones: updatedBonificaciones,
    });
  };

  // Función para manejar cambios en horas extras
  const handleHorasExtrasChange = (index, e) => {
    const { name, value } = e.target;
    const updatedHorasExtras = nomina.horasExtras.map((horaExtra, i) => (
      i === index ? { ...horaExtra, [name]: value } : horaExtra
    ));
    setNomina({
      ...nomina,
      horasExtras: updatedHorasExtras,
    });
  };

  // Función para agregar horas extras
  const addHorasExtras = () => {
    setNomina({
      ...nomina,
      horasExtras: [...nomina.horasExtras, { cantidadHoras: 0, montoHorasExtra: 0 }],
    });
  };

  // Función para eliminar horas extras
  const removeHorasExtras = (index) => {
    const updatedHorasExtras = nomina.horasExtras.filter((_, i) => i !== index);
    setNomina({
      ...nomina,
      horasExtras: updatedHorasExtras,
    });
  };

  // Cálculo automático de salarioBruto y salarioNeto
  const calcularSalarioBruto = () => {
    const totalBonificaciones = nomina.bonificaciones.reduce((acc, curr) => acc + parseFloat(curr.monto || 0), 0);
    const totalHorasExtras = nomina.horasExtras.reduce((acc, curr) => acc + parseFloat(curr.montoHorasExtra || 0), 0);
    return nomina.salarioBase + totalBonificaciones + totalHorasExtras;
  };

  const calcularSalarioNeto = (salarioBruto) => {
    const totalDeducciones = nomina.deducciones.reduce((acc, curr) => acc + parseFloat(curr.monto || 0), 0);
    return salarioBruto - totalDeducciones;
  };

  const salarioBruto = calcularSalarioBruto();
  const salarioNeto = calcularSalarioNeto(salarioBruto);

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const nominaData = {
        ...nomina,
        salarioBruto: parseFloat(salarioBruto),
        salarioNeto: parseFloat(salarioNeto),
        fechaGeneracion: new Date().toISOString(),
        activa: true,
        idPeriodoNomina: 1, // Ajusta según lógica
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
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
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

              {/* Salario Base (auto completado) */}
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Salario Base"
                  name="salarioBase"
                  type="number"
                  fullWidth
                  value={nomina.salarioBase}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>

              {/* Deducciones */}
              <Grid item xs={12}>
                <Typography variant="h6">Deducciones</Typography>
              </Grid>
              {nomina.deducciones.map((deduccion, index) => (
                <Grid container spacing={2} key={index}>
                  <Grid item xs={5} sm={5}>
                    <TextField
                      required
                      label="Tipo de Deducción"
                      name="tipoDeduccion"
                      fullWidth
                      value={deduccion.tipoDeduccion}
                      onChange={(e) => handleDeduccionChange(index, e)}
                    />
                  </Grid>
                  <Grid item xs={5} sm={5}>
                    <TextField
                      required
                      label="Monto"
                      name="monto"
                      type="number"
                      fullWidth
                      value={deduccion.monto}
                      onChange={(e) => handleDeduccionChange(index, e)}
                    />
                  </Grid>
                  <Grid item xs={2} sm={2}>
                    <IconButton onClick={() => removeDeduccion(index)} color="secondary">
                      <RemoveIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Grid item xs={12}>
                <Button variant="outlined" onClick={addDeduccion} startIcon={<AddIcon />}>
                  Agregar Deducción
                </Button>
              </Grid>

              {/* Bonificaciones */}
              <Grid item xs={12}>
                <Typography variant="h6">Bonificaciones</Typography>
              </Grid>
              {nomina.bonificaciones.map((bonificacion, index) => (
                <Grid container spacing={2} key={index}>
                  <Grid item xs={5} sm={5}>
                    <TextField
                      required
                      label="Tipo de Bonificación"
                      name="tipoBonificacion"
                      fullWidth
                      value={bonificacion.tipoBonificacion}
                      onChange={(e) => handleBonificacionChange(index, e)}
                    />
                  </Grid>
                  <Grid item xs={5} sm={5}>
                    <TextField
                      required
                      label="Monto"
                      name="monto"
                      type="number"
                      fullWidth
                      value={bonificacion.monto}
                      onChange={(e) => handleBonificacionChange(index, e)}
                    />
                  </Grid>
                  <Grid item xs={2} sm={2}>
                    <IconButton onClick={() => removeBonificacion(index)} color="secondary">
                      <RemoveIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Grid item xs={12}>
                <Button variant="outlined" onClick={addBonificacion} startIcon={<AddIcon />}>
                  Agregar Bonificación
                </Button>
              </Grid>

              {/* Horas Extras */}
              <Grid item xs={12}>
                <Typography variant="h6">Horas Extras</Typography>
              </Grid>
              {nomina.horasExtras.map((horaExtra, index) => (
                <Grid container spacing={2} key={index}>
                  <Grid item xs={5} sm={5}>
                    <TextField
                      required
                      label="Cantidad de Horas"
                      name="cantidadHoras"
                      type="number"
                      fullWidth
                      value={horaExtra.cantidadHoras}
                      onChange={(e) => handleHorasExtrasChange(index, e)}
                    />
                  </Grid>
                  <Grid item xs={5} sm={5}>
                    <TextField
                      required
                      label="Monto por Hora Extra"
                      name="montoHorasExtra"
                      type="number"
                      fullWidth
                      value={horaExtra.montoHorasExtra}
                      onChange={(e) => handleHorasExtrasChange(index, e)}
                    />
                  </Grid>
                  <Grid item xs={2} sm={2}>
                    <IconButton onClick={() => removeHorasExtras(index)} color="secondary">
                      <RemoveIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Grid item xs={12}>
                <Button variant="outlined" onClick={addHorasExtras} startIcon={<AddIcon />}>
                  Agregar Horas Extras
                </Button>
              </Grid>

              {/* Salario Bruto y Neto (auto calculado) */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Salario Bruto"
                  name="salarioBruto"
                  type="number"
                  fullWidth
                  value={salarioBruto.toFixed(2)}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Salario Neto"
                  name="salarioNeto"
                  type="number"
                  fullWidth
                  value={salarioNeto.toFixed(2)}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>

              {/* Vacaciones (opcional, se puede implementar de manera similar a deducciones y bonificaciones) */}
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

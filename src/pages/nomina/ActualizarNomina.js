// src/components/ActualizarNomina.js
import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, Select, MenuItem, InputLabel,
  FormControl, Snackbar, Alert, IconButton, Typography
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { updateNomina } from '../../services/NominaAPI';

function ActualizarNomina({
  open,
  onClose,
  nominaSeleccionada,
  setNominas,
  nominas,
  refetchDatos,
  empleados
}) {
  const [nomina, setNomina] = useState({
    idNomina: '', // Agregado idNomina
    idEmpleado: '',
    salarioBase: 0,
    deducciones: [],
    bonificaciones: [],
    horasExtras: [],
    vacaciones: []
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Cargar datos de la nómina seleccionada cuando el diálogo esté abierto
  useEffect(() => {
    if (nominaSeleccionada) {
      console.log('Nómina Seleccionada:', nominaSeleccionada); // Depuración
      setNomina({
        idNomina: nominaSeleccionada.idNomina, // Asignar idNomina
        idEmpleado: nominaSeleccionada.idEmpleado,
        salarioBase: 0, // Será actualizado automáticamente
        deducciones: nominaSeleccionada.deducciones || [],
        bonificaciones: nominaSeleccionada.bonificaciones || [],
        horasExtras: nominaSeleccionada.horasExtras || [],
        vacaciones: nominaSeleccionada.vacaciones || []
      });
    }
  }, [nominaSeleccionada]);

  // Actualizar salarioBase cuando se selecciona un empleado
  useEffect(() => {
    if (nomina.idEmpleado) {
      const empleadoSeleccionado = empleados.find(emp => emp.idEmpleado === nomina.idEmpleado);
      if (empleadoSeleccionado) {
        const salarioBase = parseFloat(empleadoSeleccionado.infoContratoFuncionario?.salarioBase) || 0;
        setNomina(prevNomina => ({
          ...prevNomina,
          salarioBase: salarioBase
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

  // Funciones para manejar deducciones
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

  const addDeduccion = () => {
    setNomina({
      ...nomina,
      deducciones: [...nomina.deducciones, { idDeduccion: 0, tipoDeduccion: '', monto: 0 }],
    });
  };

  const removeDeduccion = (index) => {
    const updatedDeducciones = nomina.deducciones.filter((_, i) => i !== index);
    setNomina({
      ...nomina,
      deducciones: updatedDeducciones,
    });
  };

  // Funciones para manejar bonificaciones
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

  const addBonificacion = () => {
    setNomina({
      ...nomina,
      bonificaciones: [...nomina.bonificaciones, { idBonificacion: 0, tipoBonificacion: '', monto: 0 }],
    });
  };

  const removeBonificacion = (index) => {
    const updatedBonificaciones = nomina.bonificaciones.filter((_, i) => i !== index);
    setNomina({
      ...nomina,
      bonificaciones: updatedBonificaciones,
    });
  };

  // Funciones para manejar horas extras
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

  const addHorasExtras = () => {
    setNomina({
      ...nomina,
      horasExtras: [...nomina.horasExtras, { idHorasExtra: 0, cantidadHoras: 0, montoHorasExtra: 0 }],
    });
  };

  const removeHorasExtras = (index) => {
    const updatedHorasExtras = nomina.horasExtras.filter((_, i) => i !== index);
    setNomina({
      ...nomina,
      horasExtras: updatedHorasExtras,
    });
  };

  // Funciones para manejar vacaciones
  const handleVacacionChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVacaciones = nomina.vacaciones.map((vacacion, i) => (
      i === index ? { ...vacacion, [name]: value } : vacacion
    ));
    setNomina({
      ...nomina,
      vacaciones: updatedVacaciones,
    });
  };

  const addVacacion = () => {
    setNomina({
      ...nomina,
      vacaciones: [...nomina.vacaciones, { idVacacion: 0, fechaInicio: '', fechaFin: '' }],
    });
  };

  const removeVacacion = (index) => {
    const updatedVacaciones = nomina.vacaciones.filter((_, i) => i !== index);
    setNomina({
      ...nomina,
      vacaciones: updatedVacaciones,
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

    // Obtener el ID correcto de la nómina
    const nominaId = nomina.idNomina;
    console.log('ID de Nómina a actualizar:', nominaId); // Depuración

    if (!nominaId) {
      console.error('ID de nómina no encontrado.');
      setSnackbarMessage('Error: ID de nómina no encontrado.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      const nominaData = {
        idNomina: nomina.idNomina, // Asegurarse de incluir idNomina
        idEmpleado: nomina.idEmpleado,
        salarioBase: nomina.salarioBase,
        salarioBruto: parseFloat(salarioBruto),
        salarioNeto: parseFloat(salarioNeto),
        fechaGeneracion: new Date().toISOString(),
        activa: true,
        idPeriodoNomina: nomina.idPeriodoNomina || 1, // Ajusta según lógica
        horasExtras: nomina.horasExtras.map((he, index) => ({
          idHorasExtra: he.idHorasExtra || index,
          cantidadHoras: he.cantidadHoras,
          montoHorasExtra: he.montoHorasExtra
        })),
        deducciones: nomina.deducciones.map((ded, index) => ({
          idDeduccion: ded.idDeduccion || index,
          tipoDeduccion: ded.tipoDeduccion,
          monto: ded.monto
        })),
        bonificaciones: nomina.bonificaciones.map((bon, index) => ({
          idBonificacion: bon.idBonificacion || index,
          tipoBonificacion: bon.tipoBonificacion,
          monto: bon.monto
        })),
        vacaciones: nomina.vacaciones.map((vac, index) => ({
          idVacacion: vac.idVacacion || index,
          fechaInicio: vac.fechaInicio,
          fechaFin: vac.fechaFin
        }))
      };

      console.log('Datos enviados para actualizar:', nominaData); // Depuración

      const updatedNomina = await updateNomina(nominaId, nominaData);
      console.log('Nómina actualizada:', updatedNomina); // Depuración

      // Actualizar la lista local de nóminas
      const updatedNominas = nominas.map(nom =>
        nom.idNomina === updatedNomina.idNomina ? updatedNomina : nom
      );
      setNominas(updatedNominas);

      setSnackbarMessage('Nómina actualizada con éxito');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      onClose();
      refetchDatos();
    } catch (error) {
      console.error('Error al actualizar la nómina:', error);
      setSnackbarMessage('No se pudo actualizar la nómina');
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
        <DialogTitle>Actualizar Nómina</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* ID Nómina (oculto o solo para depuración) */}
              <Grid item xs={12}>
                <TextField
                  label="ID Nómina"
                  name="idNomina"
                  type="number"
                  fullWidth
                  value={nomina.idNomina}
                  InputProps={{
                    readOnly: true,
                  }}
                  hidden // Opcional: ocultar el campo
                />
              </Grid>

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

              {/* Vacaciones */}
              <Grid item xs={12}>
                <Typography variant="h6">Vacaciones</Typography>
              </Grid>
              {nomina.vacaciones.map((vacacion, index) => (
                <Grid container spacing={2} key={index}>
                  <Grid item xs={5} sm={5}>
                    <TextField
                      required
                      label="Fecha Inicio"
                      name="fechaInicio"
                      type="date"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={vacacion.fechaInicio}
                      onChange={(e) => handleVacacionChange(index, e)}
                    />
                  </Grid>
                  <Grid item xs={5} sm={5}>
                    <TextField
                      required
                      label="Fecha Fin"
                      name="fechaFin"
                      type="date"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={vacacion.fechaFin}
                      onChange={(e) => handleVacacionChange(index, e)}
                    />
                  </Grid>
                  <Grid item xs={2} sm={2}>
                    <IconButton onClick={() => removeVacacion(index)} color="secondary">
                      <RemoveIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Grid item xs={12}>
                <Button variant="outlined" onClick={addVacacion} startIcon={<AddIcon />}>
                  Agregar Vacación
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

              {/* Puedes agregar más campos si es necesario */}
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} type="submit" variant="contained">Actualizar</Button>
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

export default ActualizarNomina;

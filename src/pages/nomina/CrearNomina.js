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
    deducciones: [
      { tipoDeduccion: 'CCSS', monto: 0, editable: false },
      { tipoDeduccion: 'Banco Popular', monto: 0, editable: false }
    ],
    bonificaciones: [],
    horasExtras: [],
    vacaciones: []
  });

  const [empleados, setEmpleadosLocal] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Formatear monto en colones
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 2
    }).format(amount);
  };

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

  useEffect(() => {
    const montoCCSS = nomina.salarioBase * 0.1067;
    const montoBancoPopular = calcularSalarioBruto() * 0.01;

    setNomina(prevNomina => ({
      ...prevNomina,
      deducciones: prevNomina.deducciones.map(deduccion => {
        if (deduccion.tipoDeduccion === 'CCSS') {
          return { ...deduccion, monto: montoCCSS };
        } else if (deduccion.tipoDeduccion === 'Banco Popular') {
          return { ...deduccion, monto: montoBancoPopular };
        }
        return deduccion;
      })
    }));
  }, [nomina.salarioBase, nomina.bonificaciones, nomina.horasExtras]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNomina({
      ...nomina,
      [name]: value,
    });
  };

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
      deducciones: [...nomina.deducciones, { tipoDeduccion: '', monto: 0, editable: true }],
    });
  };

  const removeDeduccion = (index) => {
    const updatedDeducciones = nomina.deducciones.filter((_, i) => i !== index);
    setNomina({
      ...nomina,
      deducciones: updatedDeducciones,
    });
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const nominaData = {
        ...nomina,
        salarioBruto: parseFloat(salarioBruto),
        salarioNeto: parseFloat(salarioNeto),
        fechaGeneracion: new Date().toISOString(),
        activa: true,
        idPeriodoNomina: 1,
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

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Salario Base"
                  name="salarioBase"
                  fullWidth
                  value={formatCurrency(nomina.salarioBase)}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6">Deducciones</Typography>
              </Grid>
              {nomina.deducciones.map((deduccion, index) => (
                <Grid container spacing={2} key={index} style={{ marginBottom: '10px' }}>
                  <Grid item xs={5} sm={5}>
                    <TextField
                      required
                      label="Tipo de Deducción"
                      name="tipoDeduccion"
                      fullWidth
                      value={deduccion.tipoDeduccion}
                      InputProps={{
                        readOnly: !deduccion.editable,
                      }}
                    />
                  </Grid>
                  <Grid item xs={5} sm={5}>
                    <TextField
                      required
                      label="Monto"
                      name="monto"
                      fullWidth
                      value={formatCurrency(deduccion.monto)}
                      InputProps={{
                        readOnly: !deduccion.editable,
                      }}
                    />
                  </Grid>
                  {deduccion.editable && (
                    <Grid item xs={2} sm={2}>
                      <IconButton onClick={() => removeDeduccion(index)} color="secondary">
                        <RemoveIcon />
                      </IconButton>
                    </Grid>
                  )}
                </Grid>
              ))}
              <Grid item xs={12}>
                <Button variant="outlined" onClick={addDeduccion} startIcon={<AddIcon />}>
                  Agregar Deducción
                </Button>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Salario Bruto"
                  name="salarioBruto"
                  fullWidth
                  value={formatCurrency(salarioBruto)}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Salario Neto"
                  name="salarioNeto"
                  fullWidth
                  value={formatCurrency(salarioNeto)}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} type="submit" variant="contained">Crear</Button>
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

export default CrearNomina;

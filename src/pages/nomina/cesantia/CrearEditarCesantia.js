import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  Snackbar,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import { getEmpleados } from '../../../services/FuncionarioAPI';
import { getAguinaldoPorEmpleado } from '../../../services/nomina/AguinaldoAPI';
import { crearLiquidacion } from '../../../services/nomina/LiquidacionAPI';
import { getSolicitudesVacacionesPorEmpleado } from '../../../services/solicitudesService/SolicitudVacacionesService';

const CrearEditarLiquidacion = ({ onClose = () => {}, isEditMode = false }) => {
  const [empleados, setEmpleados] = useState([]);
  const [idEmpleado, setIdEmpleado] = useState('');
  const [fechaIngreso, setFechaIngreso] = useState('');
  const [fechaSalida, setFechaSalida] = useState('');
  const [diasPreaviso, setDiasPreaviso] = useState('');
  const [diasTrabajadosPreaviso, setDiasTrabajadosPreaviso] = useState('');
  const [salariosSeisMeses, setSalariosSeisMeses] = useState(Array(6).fill(''));
  const [salarioPromedioDiario, setSalarioPromedioDiario] = useState(0);
  const [montoPreaviso, setMontoPreaviso] = useState(0);
  const [montoCesantia, setMontoCesantia] = useState(0);
  const [montoVacaciones, setMontoVacaciones] = useState(0);
  const [montoAguinaldo, setMontoAguinaldo] = useState(0);
  const [totalLiquidacion, setTotalLiquidacion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Estados para errores de validación
  const [idEmpleadoError, setIdEmpleadoError] = useState('');
  const [fechaSalidaError, setFechaSalidaError] = useState('');
  const [diasPreavisoError, setDiasPreavisoError] = useState('');
  const [diasTrabajadosPreavisoError, setDiasTrabajadosPreavisoError] = useState('');
  const [salariosSeisMesesErrors, setSalariosSeisMesesErrors] = useState(Array(6).fill(''));

  useEffect(() => {
    fetchEmpleados();
  }, []);

  useEffect(() => {
    if (idEmpleado) {
      autoFillFechaIngreso();
      calcularMontoAguinaldo();
      calcularMontoVacaciones();
    }
  }, [idEmpleado]);

  useEffect(() => {
    calcularSalarioPromedioDiario();
  }, [salariosSeisMeses]);

  useEffect(() => {
    calcularMontoPreaviso();
  }, [diasPreaviso, diasTrabajadosPreaviso, salarioPromedioDiario]);

  useEffect(() => {
    calcularMontoCesantia();
  }, [fechaIngreso, fechaSalida, salarioPromedioDiario]);

  useEffect(() => {
    calcularTotalLiquidacion();
  }, [montoPreaviso, montoCesantia, montoVacaciones, montoAguinaldo]);

  const fetchEmpleados = async () => {
    try {
      const data = await getEmpleados();
      setEmpleados(data);
    } catch (error) {
      mostrarErrorSnackbar('Error al cargar la lista de empleados.');
    }
  };

  const autoFillFechaIngreso = () => {
    const empleadoSeleccionado = empleados.find((emp) => emp.idEmpleado === idEmpleado);
    if (empleadoSeleccionado) {
      const fechaContratacion = empleadoSeleccionado.infoContratoFuncionario.fechaContratacion;
      setFechaIngreso(fechaContratacion.split('T')[0]);
    }
  };

  const calcularSalarioPromedioDiario = () => {
    const salariosValidos = salariosSeisMeses.map((salario) => parseFloat(salario) || 0);
    const totalSalarios = salariosValidos.reduce((acc, salario) => acc + salario, 0);
    const promedioMensual = totalSalarios / salariosValidos.length;
    setSalarioPromedioDiario((promedioMensual / 30).toFixed(2));
  };

  const calcularMontoPreaviso = () => {
    const diasPendientes = Math.max(diasPreaviso - diasTrabajadosPreaviso, 0);
    const monto = diasPendientes * salarioPromedioDiario;
    setMontoPreaviso(monto.toFixed(2));
  };

  const calcularMontoCesantia = () => {
    if (!fechaIngreso || !fechaSalida) return;

    const antiguedad = Math.floor(
      (new Date(fechaSalida) - new Date(fechaIngreso)) / (1000 * 60 * 60 * 24 * 365)
    );

    let diasCesantia = 0;
    if (antiguedad === 1) diasCesantia = 19;
    else if (antiguedad > 1 && antiguedad <= 8) diasCesantia = 20 * antiguedad;
    else if (antiguedad > 8) diasCesantia = 20 * 8;

    const monto = diasCesantia * salarioPromedioDiario;
    setMontoCesantia(monto.toFixed(2));
  };

  const calcularMontoVacaciones = async () => {
    try {
      const empleadoSeleccionado = empleados.find((emp) => emp.idEmpleado === idEmpleado);

      if (!empleadoSeleccionado || !empleadoSeleccionado.infoContratoFuncionario) {
        setMontoVacaciones(0);
        mostrarErrorSnackbar('No se pudo obtener el salario base del empleado.');
        return;
      }

      const salarioBase = parseFloat(empleadoSeleccionado.infoContratoFuncionario.salarioBase || 0);

      if (salarioBase <= 0) {
        setMontoVacaciones(0);
        mostrarErrorSnackbar('El salario base del empleado no es válido.');
        return;
      }

      const salarioDiario = salarioBase / 30;

      const data = await getSolicitudesVacacionesPorEmpleado(idEmpleado);
      const diasDisponibles = parseFloat(data?.diasDisponibles || 0);

      if (diasDisponibles > 0) {
        const monto = (diasDisponibles * salarioDiario).toFixed(2);
        setMontoVacaciones(monto);
      } else {
        setMontoVacaciones(0);
        mostrarErrorSnackbar('El empleado no tiene días disponibles de vacaciones.');
      }
    } catch (error) {
      console.error('Error al calcular el monto de vacaciones:', error);
      mostrarErrorSnackbar('Error al calcular el monto de vacaciones.');
    }
  };

  const calcularMontoAguinaldo = async () => {
    try {
      const data = await getAguinaldoPorEmpleado(idEmpleado);
      setMontoAguinaldo(data.aguinaldoNeto.toFixed(2));
    } catch (error) {
      mostrarErrorSnackbar('Error al calcular el aguinaldo.');
    }
  };

  const calcularTotalLiquidacion = () => {
    const total =
      parseFloat(montoPreaviso) +
      parseFloat(montoCesantia) +
      parseFloat(montoVacaciones) +
      parseFloat(montoAguinaldo);
    setTotalLiquidacion(total.toFixed(2));
  };

  const handleGuardarLiquidacion = async () => {
    let isValid = true;

    // Validación del empleado
    if (!idEmpleado) {
      setIdEmpleadoError('Debe seleccionar un empleado.');
      isValid = false;
    } else {
      setIdEmpleadoError('');
    }

    // Validación de fecha de salida
    if (!fechaSalida) {
      setFechaSalidaError('Debe ingresar la fecha de salida.');
      isValid = false;
    } else if (fechaIngreso && fechaSalida < fechaIngreso) {
      setFechaSalidaError('La fecha de salida no puede ser anterior a la fecha de ingreso.');
      isValid = false;
    } else {
      setFechaSalidaError('');
    }

    // Validación de días de preaviso
    if (diasPreaviso === '' || diasPreaviso === null) {
      setDiasPreavisoError('Debe ingresar los días de preaviso.');
      isValid = false;
    } else if (diasPreaviso < 0) {
      setDiasPreavisoError('Los días de preaviso no pueden ser negativos.');
      isValid = false;
    } else {
      setDiasPreavisoError('');
    }

    // Validación de días trabajados de preaviso
    if (diasTrabajadosPreaviso === '' || diasTrabajadosPreaviso === null) {
      setDiasTrabajadosPreavisoError('Debe ingresar los días trabajados de preaviso.');
      isValid = false;
    } else if (diasTrabajadosPreaviso < 0) {
      setDiasTrabajadosPreavisoError('Los días trabajados de preaviso no pueden ser negativos.');
      isValid = false;
    } else if (parseInt(diasTrabajadosPreaviso) > parseInt(diasPreaviso)) {
      setDiasTrabajadosPreavisoError(
        'Los días trabajados de preaviso no pueden ser mayores que los días de preaviso.'
      );
      isValid = false;
    } else {
      setDiasTrabajadosPreavisoError('');
    }

    // Validación de salarios de los seis meses
    const salariosErrors = salariosSeisMeses.map((salario, index) => {
      if (salario === '' || salario === null) {
        isValid = false;
        return 'Este campo es requerido.';
      } else if (parseFloat(salario) < 330000 || parseFloat(salario) > 950000) {
        isValid = false;
        return 'El salario debe estar entre 330,000 y 950,000.';
      } else {
        return '';
      }
    });
    setSalariosSeisMesesErrors(salariosErrors);

    if (!isValid) {
      mostrarErrorSnackbar('Por favor, corrija los errores antes de continuar.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        idEmpleado,
        fechaIngreso,
        fechaSalida,
        salarioPromedioSeisMeses: salariosSeisMeses.reduce(
          (acc, salario) => acc + parseFloat(salario || 0),
          0
        ),
        salarioPromedioDiario,
        diasPreaviso,
        diasTrabajadosPreaviso,
        montoPreaviso,
        montoCesantia,
        montoVacaciones,
        montoAguinaldo,
        totalLiquidacion,
      };

      await crearLiquidacion(payload);
      mostrarExitoSnackbar('Liquidación guardada exitosamente.');
      onClose();
    } catch (error) {
      mostrarErrorSnackbar('Error al guardar la liquidación.');
    } finally {
      setLoading(false);
    }
  };

  const mostrarErrorSnackbar = (mensaje) => {
    setSnackbarMessage(mensaje);
    setSnackbarSeverity('error');
    setSnackbarOpen(true);
  };

  const mostrarExitoSnackbar = (mensaje) => {
    setSnackbarMessage(mensaje);
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mx: 'auto', maxWidth: 800 }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        {isEditMode ? 'Editar Liquidación' : 'Crear Liquidación'}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            select
            label="Seleccionar Empleado"
            value={idEmpleado}
            onChange={(e) => {
              setIdEmpleado(e.target.value);
              if (e.target.value) {
                setIdEmpleadoError('');
              }
            }}
            fullWidth
            error={Boolean(idEmpleadoError)}
            helperText={idEmpleadoError}
          >
            {empleados.map((empleado) => (
              <MenuItem key={empleado.idEmpleado} value={empleado.idEmpleado}>
                {`${empleado.nombre} ${empleado.apellidoUno} ${empleado.apellidoDos}`}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Fecha de Ingreso"
            type="date"
            value={fechaIngreso}
            fullWidth
            disabled
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Fecha de Salida"
            type="date"
            value={fechaSalida}
            onChange={(e) => {
              setFechaSalida(e.target.value);
              if (e.target.value) {
                setFechaSalidaError('');
              }
            }}
            fullWidth
            InputLabelProps={{ shrink: true }}
            error={Boolean(fechaSalidaError)}
            helperText={fechaSalidaError}
          />
        </Grid>
        {salariosSeisMeses.map((salario, index) => (
          <Grid item xs={6} key={index}>
            <TextField
              label={`Salario Mes ${index + 1}`}
              type="number"
              value={salario}
              onChange={(e) => {
                const value = e.target.value;
                setSalariosSeisMeses((prev) => {
                  const updated = [...prev];
                  updated[index] = value;
                  return updated;
                });
                setSalariosSeisMesesErrors((prevErrors) => {
                  const updatedErrors = [...prevErrors];
                  updatedErrors[index] = '';
                  return updatedErrors;
                });
              }}
              fullWidth
              error={Boolean(salariosSeisMesesErrors[index])}
              helperText={salariosSeisMesesErrors[index]}
            />
          </Grid>
        ))}
        <Grid item xs={6}>
          <TextField
            label="Días de Preaviso"
            type="number"
            value={diasPreaviso}
            onChange={(e) => {
              const value = Math.max(0, parseInt(e.target.value, 10) || 0);
              setDiasPreaviso(value);
              if (value !== '' && value >= 0) {
                setDiasPreavisoError('');
              }
            }}
            fullWidth
            error={Boolean(diasPreavisoError)}
            helperText={diasPreavisoError}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Días Trabajados de Preaviso"
            type="number"
            value={diasTrabajadosPreaviso}
            onChange={(e) => {
              const value = Math.max(0, parseInt(e.target.value, 10) || 0);
              setDiasTrabajadosPreaviso(value);
              if (value !== '' && value >= 0 && value <= diasPreaviso) {
                setDiasTrabajadosPreavisoError('');
              }
            }}
            fullWidth
            error={Boolean(diasTrabajadosPreavisoError)}
            helperText={diasTrabajadosPreavisoError}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Monto del Preaviso"
            value={montoPreaviso}
            fullWidth
            disabled
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Monto de Cesantía"
            value={montoCesantia}
            fullWidth
            disabled
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Monto de Vacaciones"
            value={montoVacaciones}
            fullWidth
            disabled
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Monto del Aguinaldo"
            value={montoAguinaldo}
            fullWidth
            disabled
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Total de Liquidación"
            value={totalLiquidacion}
            fullWidth
            disabled
          />
        </Grid>
        <Grid item xs={12} textAlign="center">
          <Button
            variant="contained"
            color="primary"
            onClick={handleGuardarLiquidacion}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Guardar Liquidación'}
          </Button>
        </Grid>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        autoHideDuration={6000}
      >
        <Alert severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default CrearEditarLiquidacion;

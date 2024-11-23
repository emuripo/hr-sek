import React, { useState } from 'react';
import { Paper, Button, Grid, Typography, IconButton, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EmpleadoSelect from '../../components/planillaForm/EmpleadoSelect';
import ReadOnlyField from '../../components/planillaForm/ReadOnlyField';
import Dropdown from '../../components/planillaForm/Dropdown';
import SnackbarAlert from '../../components/planillaForm/SnackbarAlert';
import useNominaForm from '../../hooks/useNominaForm';

// Define la función personalizada para formatear números
const formatNumber = (number) => {
  const formatted = new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    minimumFractionDigits: 0,
    currencyDisplay: 'symbol',
    useGrouping: true,
  }).format(number);

  return formatted.replace(/\./g, ' ').replace(/,/g, ' ');
};

const CrearEditarNomina = ({ onClose = () => {} }) => {
  const {
    formData,
    setFormData,
    snackbar,
    setSnackbar,
    empleados,
    empleadosLoading,
    empleadosError,
    bonificaciones,
    deducciones,
    periodos,
    horasExtrasTrabajadasMes,
    totalPagarHorasExtra,
    handleEmpleadoChange,
    handleBonificacionesChange,
    handleDeduccionesChange,
    handleSubmit,
  } = useNominaForm(onClose);

  const [extraBonificaciones, setExtraBonificaciones] = useState([]);
  const [extraDeducciones, setExtraDeducciones] = useState([]);
  const [otrasDeducciones, setOtrasDeducciones] = useState([]);

  const handleAddDropdown = (type) => {
    if (type === 'bonificacion') {
      setExtraBonificaciones([...extraBonificaciones, null]);
    } else if (type === 'deduccion') {
      setExtraDeducciones([...extraDeducciones, null]);
    }
  };

  const handleDropdownChange = (type, index, value) => {
    if (type === 'bonificacion') {
      const updatedBonificaciones = [...extraBonificaciones];
      updatedBonificaciones[index] = value;
      setExtraBonificaciones(updatedBonificaciones);

      const validBonificaciones = updatedBonificaciones.filter((b) => b);
      const bonificacionesIds = validBonificaciones.map((b) => b.idBonificacion);

      handleBonificacionesChange(validBonificaciones);

      setFormData((prev) => ({
        ...prev,
        bonificacionesIds,
      }));
    } else if (type === 'deduccion') {
      const updatedDeducciones = [...extraDeducciones];
      updatedDeducciones[index] = value;
      setExtraDeducciones(updatedDeducciones);

      const validDeducciones = updatedDeducciones.filter((d) => d);
      const deduccionesIds = validDeducciones.map((d) => d.idDeduccion);

      handleDeduccionesChange(validDeducciones);

      setFormData((prev) => ({
        ...prev,
        deduccionesIds,
      }));
    }
  };

  const handleRemoveDropdown = (type, index) => {
    if (type === 'bonificacion') {
      const updatedBonificaciones = extraBonificaciones.filter((_, i) => i !== index);
      setExtraBonificaciones(updatedBonificaciones);

      const validBonificaciones = updatedBonificaciones.filter((b) => b);
      handleBonificacionesChange(validBonificaciones);

      setFormData((prev) => ({
        ...prev,
        bonificacionesIds: validBonificaciones.map((b) => b.idBonificacion),
      }));
    } else if (type === 'deduccion') {
      const updatedDeducciones = extraDeducciones.filter((_, i) => i !== index);
      setExtraDeducciones(updatedDeducciones);

      const validDeducciones = updatedDeducciones.filter((d) => d);
      handleDeduccionesChange(validDeducciones);

      setFormData((prev) => ({
        ...prev,
        deduccionesIds: validDeducciones.map((d) => d.idDeduccion),
      }));
    }
  };

  const handleAddDeduccion = () => {
    setOtrasDeducciones([...otrasDeducciones, { descripcion: '', monto: 0 }]);
  };

  const handleRemoveDeduccion = (index) => {
    const updatedDeducciones = otrasDeducciones.filter((_, i) => i !== index);
    setOtrasDeducciones(updatedDeducciones);
    updateSalarioNeto(updatedDeducciones);
  };

  const handleChangeDeduccion = (index, field, value) => {
    const updatedDeducciones = otrasDeducciones.map((deduccion, i) =>
        i === index
            ? {
                  ...deduccion,
                  [field]:
                      field === 'monto'
                          ? value === '' // Si el usuario borra todo, dejamos el input vacío
                              ? ''
                              : parseFloat(value) || 0 // Convertimos a número solo si es válido
                          : value,
              }
            : deduccion
    );
    setOtrasDeducciones(updatedDeducciones);
    updateSalarioNeto(updatedDeducciones);
};
    const updateSalarioNeto = (deducciones) => {
      // Validamos y calculamos correctamente asegurando que el monto siempre sea numérico
      const totalOtrasDeducciones = deducciones.reduce(
          (acc, curr) => acc + (parseFloat(curr.monto) || 0), // Convertimos a número solo si es válido
          0
      );
      const salarioNeto = formData.salarioBruto - totalOtrasDeducciones - (formData.totalDeducciones || 0);

      setFormData((prev) => ({
          ...prev,
          salarioNeto: isNaN(salarioNeto) ? 0 : salarioNeto, // Prevenimos NaN
      }));
    };

  if (empleadosLoading) {
    return <div>Cargando empleados...</div>;
  }

  if (empleadosError) {
    return <div>Error al cargar empleados: {empleadosError}</div>;
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, margin: 'auto' }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Crear Nómina
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Período y Empleado */}
          <Grid item xs={12}>
            <Dropdown
              label="Período de Nómina"
              options={periodos.map((p) => ({
                label: `Del ${new Date(p.fechaInicio).toLocaleDateString()} al ${new Date(
                  p.fechaFin
                ).toLocaleDateString()}`,
                value: p.idPeriodoNomina,
              }))}
              value={formData.idPeriodoNomina}
              onChange={(value) => setFormData({ ...formData, idPeriodoNomina: value })}
            />
          </Grid>

          <Grid item xs={12}>
            <EmpleadoSelect
              empleados={empleados}
              value={formData.idEmpleado}
              onChange={handleEmpleadoChange}
            />
          </Grid>

          <Grid item xs={6}>
            <ReadOnlyField label="Salario Base" value={formatNumber(formData.salarioBase)} />
          </Grid>

          {/* Horas Extras */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Horas Extras
            </Typography>
          </Grid>
          {formData.horasExtras.length > 0 ? (
            formData.horasExtras.map((extra, index) => (
              <Grid item xs={6} key={index}>
                <Typography variant="body1">
                  <strong>Horas Trabajadas:</strong> {extra.horasExtrasTrabajadasMes}
                </Typography>
                <Typography variant="body1">
                  <strong>Salario por Hora:</strong> {formatNumber(extra.salarioPorHora)}
                </Typography>
                <Typography variant="body1">
                  <strong>Tarifa Horas Extra:</strong> {formatNumber(extra.tarifaHorasExtra)}
                </Typography>
                <Typography variant="body1">
                  <strong>Total Horas Extra:</strong> {formatNumber(extra.totalPagarHorasExtra)}
                </Typography>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body2">No hay horas extras registradas</Typography>
            </Grid>
          )}

          {/* Deducciones Automáticas */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Deducciones Automáticas
            </Typography>
          </Grid>
          {formData.deduccionesAutomaticas.map((deduccion) => (
            <Grid item xs={6} key={deduccion.idDeduccion}>
              <ReadOnlyField
                label={deduccion.tipoDeduccion}
                value={formatNumber(deduccion.monto)}
              />
            </Grid>
          ))}

          {/* Bonificaciones dinámicas */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Bonificaciones
            </Typography>
          </Grid>
          {extraBonificaciones.map((_, index) => (
            <Grid item xs={6} key={`extra-bonificacion-${index}`} container alignItems="center">
              <Dropdown
                label={`Bonificación Extra ${index + 1}`}
                options={bonificaciones.map((b) => ({
                  label: `${b.tipoBonificacion} - ${formatNumber(b.monto)}`,
                  value: b,
                }))}
                value={extraBonificaciones[index]}
                onChange={(value) => handleDropdownChange('bonificacion', index, value)}
              />
              <IconButton
                color="secondary"
                onClick={() => handleRemoveDropdown('bonificacion', index)}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleAddDropdown('bonificacion')}
            >
              Agregar Bonificación
            </Button>
          </Grid>

          {/* Deducciones dinámicas */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Deducciones
            </Typography>
          </Grid>
          {extraDeducciones.map((_, index) => (
            <Grid item xs={6} key={`extra-deduccion-${index}`} container alignItems="center">
              <Dropdown
                label={`Deducción Extra ${index + 1}`}
                options={deducciones.map((d) => ({
                  label: `${d.tipoDeduccion} - ${formatNumber(d.monto)}`,
                  value: d,
                }))}
                value={extraDeducciones[index]}
                onChange={(value) => handleDropdownChange('deduccion', index, value)}
              />
              <IconButton
                color="secondary"
                onClick={() => handleRemoveDropdown('deduccion', index)}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleAddDropdown('deduccion')}
            >
              Agregar Deducción
            </Button>
          </Grid>

          {/* Otras Deducciones */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Otras Deducciones
            </Typography>
          </Grid>
          {otrasDeducciones.map((deduccion, index) => (
            <Grid item xs={12} container spacing={2} alignItems="center" key={`deduccion-${index}`}>
              <Grid item xs={6}>
                <TextField
                  label="Descripción"
                  variant="outlined"
                  fullWidth
                  value={deduccion.descripcion}
                  onChange={(e) =>
                    handleChangeDeduccion(index, 'descripcion', e.target.value)
                  }
                  error={!deduccion.descripcion}
                  helperText={!deduccion.descripcion ? 'Requerido' : ''}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Monto"
                  variant="outlined"
                  fullWidth
                  type="number"
                  value={deduccion.monto}
                  onChange={(e) =>
                    handleChangeDeduccion(index, 'monto', e.target.value)
                  }
                  error={deduccion.monto <= 0}
                  helperText={deduccion.monto <= 0 ? 'Debe ser mayor a 0' : ''}
                />
              </Grid>
              <Grid item xs={2}>
                <IconButton
                  color="secondary"
                  onClick={() => handleRemoveDeduccion(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleAddDeduccion}
            >
              Agregar Deducción
            </Button>
          </Grid>

          {/* Salarios */}
          <Grid item xs={6}>
            <ReadOnlyField label="Salario Bruto" value={formatNumber(formData.salarioBruto)} />
          </Grid>

          <Grid item xs={6}>
            <ReadOnlyField label="Salario Neto" value={formatNumber(formData.salarioNeto)} />
          </Grid>
        </Grid>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          disabled={!formData.idEmpleado || !formData.idPeriodoNomina}
        >
          Guardar Nómina
        </Button>
      </form>

      <SnackbarAlert
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Paper>
  );
};

export default CrearEditarNomina;

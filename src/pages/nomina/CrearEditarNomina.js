import React from 'react';
import { Paper, Button, Grid, Typography } from '@mui/material';
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

  if (empleadosLoading) {
    return <div>Cargando empleados...</div>;
  }

  if (empleadosError) {
    return <div>Error al cargar empleados: {empleadosError}</div>;
  }

  const selectedBonificaciones = bonificaciones.filter((b) =>
    formData.bonificacionesIds.includes(b.idBonificacion)
  );
  const selectedDeducciones = deducciones.filter((d) =>
    formData.deduccionesIds.includes(d.idDeduccion)
  );

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, margin: 'auto' }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Crear Nómina
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
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

          <Grid item xs={6}>
            <Dropdown
              label="Bonificaciones"
              options={bonificaciones.map((b) => ({
                label: `${b.tipoBonificacion} - ${formatNumber(b.monto)}`,
                value: b,
              }))}
              value={selectedBonificaciones}
              onChange={handleBonificacionesChange}
              multiple
            />
          </Grid>

          <Grid item xs={6}>
            <Dropdown
              label="Deducciones"
              options={deducciones.map((d) => ({
                label: `${d.tipoDeduccion} - ${formatNumber(d.monto)}`,
                value: d,
              }))}
              value={selectedDeducciones}
              onChange={handleDeduccionesChange}
              multiple
            />
          </Grid>

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

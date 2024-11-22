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

  // Reemplaza los separadores de miles por espacios
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

  // Verifica estado de carga o errores en empleados
  if (empleadosLoading) {
    return <div>Cargando empleados...</div>;
  }

  if (empleadosError) {
    return <div>Error al cargar empleados: {empleadosError}</div>;
  }

  // Mapea los IDs a los objetos seleccionados para deducciones y bonificaciones
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
          {/* Período de Nómina */}
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

          {/* Selección de Empleado */}
          <Grid item xs={12}>
            <EmpleadoSelect
              empleados={empleados}
              value={formData.idEmpleado}
              onChange={handleEmpleadoChange}
            />
          </Grid>

          {/* Salario Base */}
          <Grid item xs={6}>
            <ReadOnlyField label="Salario Base" value={formatNumber(formData.salarioBase)} />
          </Grid>

          {/* Horas Extras Trabajadas en el Mes */}
          <Grid item xs={6}>
            <ReadOnlyField
              label="Horas Extras Trabajadas en el Mes"
              value={horasExtrasTrabajadasMes}
            />
          </Grid>

          {/* Total a Pagar por Horas Extra */}
          <Grid item xs={6}>
            <ReadOnlyField
              label="Total a Pagar por Horas Extra"
              value={formatNumber(totalPagarHorasExtra)}
            />
          </Grid>

          {/* Deduciones Automáticas */}
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

          {/* Bonificaciones */}
          <Grid item xs={6}>
            <Dropdown
              label="Bonificaciones"
              options={bonificaciones.map((b) => ({
                label: `${b.tipoBonificacion} - ${formatNumber(b.monto)}`,
                value: b,
              }))}
              value={selectedBonificaciones} // Usamos los objetos seleccionados
              onChange={handleBonificacionesChange}
              multiple
            />
          </Grid>

          {/* Deducciones */}
          <Grid item xs={6}>
            <Dropdown
              label="Deducciones"
              options={deducciones.map((d) => ({
                label: `${d.tipoDeduccion} - ${formatNumber(d.monto)}`,
                value: d,
              }))}
              value={selectedDeducciones} // Usamos los objetos seleccionados
              onChange={handleDeduccionesChange}
              multiple
            />
          </Grid>

          {/* Salario Bruto */}
          <Grid item xs={6}>
            <ReadOnlyField label="Salario Bruto" value={formatNumber(formData.salarioBruto)} />
          </Grid>

          {/* Salario Neto */}
          <Grid item xs={6}>
            <ReadOnlyField label="Salario Neto" value={formatNumber(formData.salarioNeto)} />
          </Grid>
        </Grid>

        {/* Botón de Guardar Nómina */}
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

      {/* Snackbar para mensajes */}
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

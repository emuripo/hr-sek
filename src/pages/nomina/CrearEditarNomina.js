// CrearEditarNomina.js

import React from 'react';
import { Paper, Button, Grid, Typography } from '@mui/material';
import EmpleadoSelect from '../../components/planillaForm/EmpleadoSelect';
import ReadOnlyField from '../../components/planillaForm/ReadOnlyField';
import Dropdown from '../../components/planillaForm/Dropdown';
import SnackbarAlert from '../../components/planillaForm/SnackbarAlert'; 
import useNominaForm from '../../hooks/useNominaForm';

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
    horasExtrasTrabajadasMes, // Agregamos aquí
    totalPagarHorasExtra,     // Agregamos aquí
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
                label: `Del ${new Date(p.fechaInicio).toLocaleDateString()} al ${new Date(p.fechaFin).toLocaleDateString()}`,
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
            <ReadOnlyField label="Salario Base" value={`$${formData.salarioBase}`} />
          </Grid>

          {/* Agregamos aquí los nuevos campos */}
          <Grid item xs={6}>
            <ReadOnlyField label="Horas Extras Trabajadas en el Mes" value={horasExtrasTrabajadasMes} />
          </Grid>
          <Grid item xs={6}>
            <ReadOnlyField label="Total a Pagar por Horas Extra" value={`$${totalPagarHorasExtra.toFixed(2)}`} />
          </Grid>

          <Grid item xs={6}>
            <Dropdown
              label="Bonificaciones"
              options={bonificaciones.map((b) => ({
                label: `${b.tipoBonificacion} - $${b.monto}`,
                value: b,
              }))}
              value={formData.bonificaciones}
              onChange={handleBonificacionesChange}
              multiple
            />
          </Grid>
          <Grid item xs={6}>
            <Dropdown
              label="Deducciones"
              options={deducciones.map((d) => ({
                label: `${d.tipoDeduccion} - $${d.monto}`,
                value: d,
              }))}
              value={formData.deducciones}
              onChange={handleDeduccionesChange}
              multiple
            />
          </Grid>
          <Grid item xs={6}>
            <ReadOnlyField label="Salario Bruto" value={`$${formData.salarioBruto}`} />
          </Grid>
          <Grid item xs={6}>
            <ReadOnlyField label="Salario Neto" value={`$${formData.salarioNeto}`} />
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

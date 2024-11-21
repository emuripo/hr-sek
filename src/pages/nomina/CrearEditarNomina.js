import React, { useState } from 'react';
import { Paper, Button, Grid, Typography } from '@mui/material';
import EmpleadoSelect from '../../components/planillaForm/EmpleadoSelect';
import ReadOnlyField from '../../components/planillaForm/ReadOnlyField';
import Dropdown from '../../components/planillaForm/Dropdown';
import SnackbarAlert from '../../components/planillaForm/SnackbarAlert'; 
import { useFetchData } from '../../hooks/useFetchData';
import { getEmpleados } from '../../services/FuncionarioAPI';
import { getTodasBonificaciones } from '../../services/nomina/BonificacionAPI';
import { getTodasDeducciones } from '../../services/nomina/DeduccionAPI';
import { getTodosPeriodosNomina } from '../../services/nomina/PeriodoNominaAPI';
import { createNomina } from '../../services/NominaAPI';

const CrearEditarNomina = ({ onClose = () => {} }) => {
  const [formData, setFormData] = useState({
    idEmpleado: '',
    salarioBase: 0,
    bonificaciones: [],
    deducciones: [],
    salarioBruto: 0,
    salarioNeto: 100, // Fijo según requerimiento
    fechaGeneracion: new Date().toISOString(),
    activa: true,
    pagada: true,
    idPeriodoNomina: '',
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Usamos el hook mejorado para cargar datos
  const { data: empleados, isLoading: empleadosLoading, error: empleadosError } = useFetchData(getEmpleados);
  const { data: bonificaciones } = useFetchData(getTodasBonificaciones);
  const { data: deducciones } = useFetchData(getTodasDeducciones);
  const { data: periodos } = useFetchData(getTodosPeriodosNomina);

  // Maneja la selección de empleado
  const handleEmpleadoChange = (idEmpleado) => {
    const empleado = empleados.find((e) => e.idEmpleado === idEmpleado);
    if (empleado && empleado.infoContratoFuncionario) {
      setFormData({
        idEmpleado,
        salarioBase: empleado.infoContratoFuncionario.salarioBase || 0,
        bonificaciones: [],
        deducciones: [],
        salarioBruto: 0,
        salarioNeto: 100,
        idPeriodoNomina: formData.idPeriodoNomina,
        fechaGeneracion: formData.fechaGeneracion,
        activa: formData.activa,
        pagada: formData.pagada,
      });
    } else {
      setFormData({
        ...formData,
        idEmpleado,
        salarioBase: 0,
        bonificaciones: [],
        deducciones: [],
        salarioBruto: 0,
        salarioNeto: 100,
      });
    }
  };

  // Maneja la selección de bonificaciones
  const handleBonificacionesChange = (selectedBonificaciones) => {
    const totalBonificaciones = selectedBonificaciones.reduce((sum, b) => sum + b.monto, 0);
    setFormData({
      ...formData,
      bonificaciones: selectedBonificaciones,
      salarioBruto: formData.salarioBase + totalBonificaciones,
    });
  };

  // Maneja la selección de deducciones
  const handleDeduccionesChange = (selectedDeducciones) => {
    const totalDeducciones = selectedDeducciones.reduce((sum, d) => sum + d.monto, 0);
    setFormData({
      ...formData,
      deducciones: selectedDeducciones,
      salarioNeto: formData.salarioBruto - totalDeducciones,
    });
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createNomina(formData); // Crea la nómina usando la API
      setSnackbar({ open: true, message: 'Nómina creada con éxito', severity: 'success' });
      onClose(); // Cierra el formulario después de guardar
    } catch (error) {
      console.error('Error al crear la nómina:', error);
      setSnackbar({ open: true, message: 'Error al guardar la nómina', severity: 'error' });
    }
  };

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
            <ReadOnlyField label="Salario Base" value={formData.salarioBase} />
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
            <ReadOnlyField label="Salario Bruto" value={formData.salarioBruto} />
          </Grid>
          <Grid item xs={6}>
            <ReadOnlyField label="Salario Neto" value={formData.salarioNeto} />
          </Grid>
        </Grid>
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
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

// useNominaForm.js
import { useState } from 'react';
import { useFetchData } from '../hooks/useFetchData';
import { getEmpleados } from '../services/FuncionarioAPI';
import { getTodasBonificaciones } from '../services/nomina/BonificacionAPI';
import { getTodasDeducciones } from '../services/nomina/DeduccionAPI';
import { getTodosPeriodosNomina } from '../services/nomina/PeriodoNominaAPI';
import { createNomina } from '../services/NominaAPI';

const useNominaForm = (onClose) => {
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

  return {
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
    handleEmpleadoChange,
    handleBonificacionesChange,
    handleDeduccionesChange,
    handleSubmit,
  };
};

export default useNominaForm;

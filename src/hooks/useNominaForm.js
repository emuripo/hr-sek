// useNominaForm.js
import { useState } from 'react';
import { useFetchData } from '../hooks/useFetchData';
import { getEmpleados } from '../services/FuncionarioAPI';
import { getTodasBonificaciones } from '../services/nomina/BonificacionAPI';
import { getTodasDeducciones } from '../services/nomina/DeduccionAPI';
import { getTodosPeriodosNomina } from '../services/nomina/PeriodoNominaAPI';
import { createNomina, validarNominaPorPeriodo } from '../services/NominaAPI';
import { getSaldoHorasExtraPorEmpleado } from '../services/solicitudesService/SolicitudHorasService';

const useNominaForm = (onClose) => {
  const [formData, setFormData] = useState({
    idEmpleado: '',
    salarioBase: 0,
    bonificacionesIds: [], // Cambiado a IDs
    deduccionesIds: [],    // Cambiado a IDs
    salarioBruto: 0,
    salarioNeto: 100, // Fijo según requerimiento
    fechaGeneracion: new Date().toISOString(),
    activa: true,
    pagada: true,
    idPeriodoNomina: '',
    horasExtras: [],
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Estados para las horas extras
  const [horasExtrasTrabajadasMes, setHorasExtrasTrabajadasMes] = useState(0);
  const [totalPagarHorasExtra, setTotalPagarHorasExtra] = useState(0);

  // Carga de datos
  const { data: empleados, isLoading: empleadosLoading, error: empleadosError } = useFetchData(getEmpleados);
  const { data: bonificaciones } = useFetchData(getTodasBonificaciones);
  const { data: deducciones } = useFetchData(getTodasDeducciones);
  const { data: periodos } = useFetchData(getTodosPeriodosNomina);

  // Maneja la selección de empleado
  const handleEmpleadoChange = async (idEmpleado) => {
    const empleado = empleados.find((e) => e.idEmpleado === idEmpleado);
    let salarioBase = 0;

    if (empleado && empleado.infoContratoFuncionario) {
      salarioBase = empleado.infoContratoFuncionario.salarioBase || 0;
    }

    // Resetea el formData y los estados relacionados con horas extras
    setFormData({
      ...formData,
      idEmpleado,
      salarioBase,
      bonificacionesIds: [],
      deduccionesIds: [],
      salarioBruto: salarioBase,
      salarioNeto: salarioBase,
      horasExtras: [],
    });

    setHorasExtrasTrabajadasMes(0);
    setTotalPagarHorasExtra(0);

    // Obtener las horas extras y calcular el total a pagar
    try {
      const saldoHorasExtra = await getSaldoHorasExtraPorEmpleado(idEmpleado);
      const horasExtrasMes = saldoHorasExtra.horasExtrasTrabajadasMes || 0;
      setHorasExtrasTrabajadasMes(horasExtrasMes);

      // Realizar los cálculos
      const salarioPorHora = salarioBase / 160; // Suponiendo 160 horas laborales al mes
      const tarifaHorasExtra = salarioPorHora * 1.5;
      const totalPagar = tarifaHorasExtra * horasExtrasMes;
      setTotalPagarHorasExtra(totalPagar);

      // Actualizar el formData con los nuevos valores
      setFormData((prevFormData) => ({
        ...prevFormData,
        salarioBruto: prevFormData.salarioBruto + totalPagar,
        salarioNeto: prevFormData.salarioNeto + totalPagar,
        horasExtras: [
          {
            salarioBase,
            horasExtrasTrabajadasMes: horasExtrasMes,
            salarioPorHora,
            tarifaHorasExtra,
            totalPagarHorasExtra: totalPagar,
          },
        ],
      }));
    } catch (error) {
      console.error('Error al obtener las horas extras:', error);
      // Mantenemos las horas extras en cero si hay un error
    }
  };

  // Maneja la selección de bonificaciones
  const handleBonificacionesChange = (selectedBonificaciones) => {
    const totalBonificaciones = selectedBonificaciones.reduce((sum, b) => sum + b.monto, 0);
    const bonificacionesIds = selectedBonificaciones.map((b) => b.idBonificacion);

    setFormData((prevFormData) => ({
      ...prevFormData,
      bonificacionesIds, // Almacenamos los IDs
      salarioBruto: prevFormData.salarioBase + totalBonificaciones + totalPagarHorasExtra,
    }));
  };

  // Maneja la selección de deducciones
  const handleDeduccionesChange = (selectedDeducciones) => {
    const totalDeducciones = selectedDeducciones.reduce((sum, d) => sum + d.monto, 0);
    const deduccionesIds = selectedDeducciones.map((d) => d.idDeduccion);

    setFormData((prevFormData) => ({
      ...prevFormData,
      deduccionesIds, // Almacenamos los IDs
      salarioNeto: prevFormData.salarioBruto - totalDeducciones,
    }));
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validar si ya existe una nómina para el empleado en el período seleccionado
      const validacion = await validarNominaPorPeriodo(formData.idEmpleado, formData.idPeriodoNomina);

      if (validacion.existe) {
        // Si la nómina ya existe, mostramos el mensaje proporcionado por el endpoint y no continuamos
        setSnackbar({ open: true, message: validacion.mensaje, severity: 'error' });
        return;
      }

      // Preparar los datos para enviar, asegurando que coinciden con el NominaDTO
      const nominaData = {
        idNomina: 0,
        idEmpleado: formData.idEmpleado,
        salarioBase: formData.salarioBase,
        salarioBruto: formData.salarioBruto,
        salarioNeto: formData.salarioNeto,
        impuestos: null,
        fechaGeneracion: formData.fechaGeneracion,
        activa: formData.activa,
        pagada: formData.pagada,
        idPeriodoNomina: formData.idPeriodoNomina,
        deduccionesIds: formData.deduccionesIds,
        bonificacionesIds: formData.bonificacionesIds,
        horasExtras: formData.horasExtras,
        modificadoPor: '', // Puedes ajustar este valor según necesites
        fechaUltimaModificacion: new Date().toISOString(),
      };

      // Crear la nómina usando la API
      await createNomina(nominaData);
      setSnackbar({ open: true, message: 'Nómina creada con éxito', severity: 'success' });
      onClose(); // Cierra el formulario después de guardar
    } catch (error) {
      console.error('Error al crear la nómina:', error);
      const errorMessage = error.response?.data?.mensaje || 'Error al guardar la nómina';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
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
    horasExtrasTrabajadasMes,
    totalPagarHorasExtra,
    handleEmpleadoChange,
    handleBonificacionesChange,
    handleDeduccionesChange,
    handleSubmit,
  };
};

export default useNominaForm;

import { useState, useEffect } from 'react';
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
    bonificacionesIds: [],
    deduccionesIds: [],
    salarioBruto: 0,
    salarioNeto: 100, // Fijo según requerimiento
    fechaGeneracion: new Date().toISOString(),
    activa: true,
    pagada: true,
    idPeriodoNomina: '',
    horasExtras: [],
    deduccionesAutomaticas: [], // Nuevas deducciones calculadas
    otrasDeducciones: [], // Maneja "Otras Deducciones"
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [horasExtrasTrabajadasMes, setHorasExtrasTrabajadasMes] = useState(0);
  const [totalPagarHorasExtra, setTotalPagarHorasExtra] = useState(0);

  // Carga de datos
  const { data: empleados, isLoading: empleadosLoading, error: empleadosError } = useFetchData(getEmpleados);
  const { data: bonificaciones } = useFetchData(getTodasBonificaciones);
  const { data: deducciones } = useFetchData(getTodasDeducciones);
  const { data: periodos } = useFetchData(getTodosPeriodosNomina);

  // Función para calcular deducciones automáticas
  const calcularDeduccionesAutomaticas = (salarioBase) => {
    return [
      { idDeduccion: 'CCSS', tipoDeduccion: 'CCSS', monto: salarioBase * 0.1067 },
      { idDeduccion: 'BancoPopular', tipoDeduccion: 'Banco Popular', monto: salarioBase * 0.01 },
    ];
  };

  // Maneja la selección de empleado
  const handleEmpleadoChange = async (idEmpleado) => {
    const empleado = empleados.find((e) => e.idEmpleado === idEmpleado);
    let salarioBase = 0;

    if (empleado && empleado.infoContratoFuncionario) {
      salarioBase = empleado.infoContratoFuncionario.salarioBase || 0;
    }

    // Calcular deducciones automáticas
    const deduccionesAutomaticas = calcularDeduccionesAutomaticas(salarioBase);

    // Resetea el formData y los estados relacionados con horas extras
    setFormData({
      ...formData,
      idEmpleado,
      salarioBase,
      bonificacionesIds: [],
      deduccionesIds: [],
      deduccionesAutomaticas,
      salarioBruto: salarioBase,
      salarioNeto: salarioBase - deduccionesAutomaticas.reduce((sum, d) => sum + d.monto, 0),
      horasExtras: [],
      otrasDeducciones: [], // Reinicia "Otras Deducciones"
    });

    setHorasExtrasTrabajadasMes(0);
    setTotalPagarHorasExtra(0);

    // Obtener las horas extras y calcular el total a pagar
    try {
      const saldoHorasExtra = await getSaldoHorasExtraPorEmpleado(idEmpleado);
      const horasExtrasMes = saldoHorasExtra.horasExtrasTrabajadasMes || 0;
      setHorasExtrasTrabajadasMes(horasExtrasMes);

      // Realizar los cálculos
      const salarioPorHora = salarioBase / 160;
      const tarifaHorasExtra = salarioPorHora * 1.5;
      const totalPagar = tarifaHorasExtra * horasExtrasMes;
      setTotalPagarHorasExtra(totalPagar);

      // Actualizar el formData con los nuevos valores
      setFormData((prevFormData) => ({
        ...prevFormData,
        salarioBruto: prevFormData.salarioBruto + totalPagar,
        salarioNeto:
          prevFormData.salarioNeto + totalPagar - deduccionesAutomaticas.reduce((sum, d) => sum + d.monto, 0),
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
    }
  };

  // Maneja la selección de bonificaciones
  const handleBonificacionesChange = (selectedBonificaciones) => {
    const totalBonificaciones = selectedBonificaciones.reduce((sum, b) => sum + b.monto, 0);
    const bonificacionesIds = selectedBonificaciones.map((b) => b.idBonificacion);

    setFormData((prevFormData) => ({
      ...prevFormData,
      bonificacionesIds,
      salarioBruto: prevFormData.salarioBase + totalBonificaciones + totalPagarHorasExtra,
    }));
  };

  // Maneja la selección de deducciones
  const handleDeduccionesChange = (selectedDeducciones) => {
    const totalDeducciones = selectedDeducciones.reduce((sum, d) => sum + d.monto, 0);
    const deduccionesIds = selectedDeducciones.map((d) => d.idDeduccion);

    setFormData((prevFormData) => ({
      ...prevFormData,
      deduccionesIds,
      salarioNeto:
        prevFormData.salarioBruto - totalDeducciones -
        prevFormData.deduccionesAutomaticas.reduce((sum, d) => sum + d.monto, 0) -
        prevFormData.otrasDeducciones.reduce((sum, d) => sum + d.monto, 0), // Incluye "Otras Deducciones"
    }));
  };

  // Maneja "Otras Deducciones"
  const handleAddOtraDeduccion = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      otrasDeducciones: [...prevFormData.otrasDeducciones, { descripcion: '', monto: 0 }],
    }));
  };

  const handleUpdateOtraDeduccion = (index, field, value) => {
    const updatedDeducciones = formData.otrasDeducciones.map((deduccion, i) =>
      i === index
        ? { ...deduccion, [field]: field === 'monto' ? parseFloat(value) || 0 : value }
        : deduccion
    );
    setFormData((prevFormData) => ({
      ...prevFormData,
      otrasDeducciones: updatedDeducciones,
    }));
  };

  const handleRemoveOtraDeduccion = (index) => {
    const updatedDeducciones = formData.otrasDeducciones.filter((_, i) => i !== index);
    setFormData((prevFormData) => ({
      ...prevFormData,
      otrasDeducciones: updatedDeducciones,
    }));
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const validacion = await validarNominaPorPeriodo(formData.idEmpleado, formData.idPeriodoNomina);

      if (validacion.existe) {
        setSnackbar({ open: true, message: validacion.mensaje, severity: 'error' });
        return;
      }

      const nominaData = { ...formData };

      await createNomina(nominaData);
      setSnackbar({ open: true, message: 'Nómina creada con éxito', severity: 'success' });
      onClose();
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
    handleAddOtraDeduccion,
    handleUpdateOtraDeduccion,
    handleRemoveOtraDeduccion,
    handleSubmit,
  };
};

export default useNominaForm;

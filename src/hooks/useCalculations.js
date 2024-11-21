export const useCalculations = (formData) => {
    const calculateSalarios = () => {
      const totalBonificaciones = formData.bonificaciones.reduce((acc, curr) => acc + parseFloat(curr.monto || 0), 0);
      const totalDeducciones = formData.deducciones.reduce((acc, curr) => acc + parseFloat(curr.monto || 0), 0);
      const salarioBruto = parseFloat(formData.salarioBase || 0) + totalBonificaciones;
      const salarioNeto = salarioBruto - totalDeducciones;
  
      return { salarioBruto, salarioNeto };
    };
  
    return calculateSalarios;
  };
  
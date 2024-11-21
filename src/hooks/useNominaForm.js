import { useState } from 'react';

export const useNominaForm = () => {
  const [formData, setFormData] = useState({
    idEmpleado: '',
    salarioBase: '',
    salarioBruto: '',
    salarioNeto: '',
    impuestos: '',
    idPeriodoNomina: '',
    deducciones: [],
    bonificaciones: [],
    modificadoPor: 'RRHH_USER',
    fechaUltimaModificacion: new Date().toISOString(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return { formData, setFormData, handleChange };
};

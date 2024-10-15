import axios from 'axios';

const API_URL = 'http://localhost:8085/api/Empleado';

// Obtener empleados
export const getEmpleados = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los empleados:', error);
    throw error;
  }
};

// Crear empleado
export const createEmpleado = async (empleadoData) => {
  try {
    const response = await axios.post(API_URL, empleadoData);
    return response.data;
  } catch (error) {
    console.error('Error al crear el empleado:', error);
    throw error;
  }
};

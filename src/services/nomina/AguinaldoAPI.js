import axios from 'axios';

const API_URL = 'http://localhost:8086/api/Aguinaldo';

// Calcular aguinaldo por ID de empleado
export const calcularAguinaldo = async (idEmpleado) => {
  try {
    const response = await axios.post(`${API_URL}/calcular?idEmpleado=${idEmpleado}`);
    return response.data;
  } catch (error) {
    console.error(`Error al calcular el aguinaldo para el empleado ${idEmpleado}:`, error);
    throw error;
  }
};

// Obtener aguinaldo por empleado
export const getAguinaldoPorEmpleado = async (idEmpleado) => {
  try {
    const response = await axios.get(`${API_URL}/empleado/${idEmpleado}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el aguinaldo para el empleado ${idEmpleado}:`, error);
    throw error;
  }
};

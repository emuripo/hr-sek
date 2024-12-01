import axios from 'axios';

const API_URL = 'http://localhost:8086/api/Aguinaldo';

// Obtener todos los aguinaldos
export const getTodosAguinaldos = async () => {
  try {
    const response = await axios.get(`${API_URL}/todos`);
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Error al obtener todos los aguinaldos');
  }
};

// Calcular aguinaldo por ID de empleado
export const calcularAguinaldo = async (idEmpleado) => {
  try {
    const response = await axios.post(`${API_URL}/calcular?idEmpleado=${idEmpleado}`);
    return response.data;
  } catch (error) {
    handleAxiosError(error, `Error al calcular el aguinaldo para el empleado ${idEmpleado}`);
  }
};

// Obtener aguinaldo por empleado
export const getAguinaldoPorEmpleado = async (idEmpleado) => {
  try {
    const response = await axios.get(`${API_URL}/empleado/${idEmpleado}`);
    return response.data;
  } catch (error) {
    handleAxiosError(error, `Error al obtener el aguinaldo para el empleado ${idEmpleado}`);
  }
};

export const calcularYGuardarAguinaldo = async (idEmpleado, idPeriodoNomina, generadoPor) => {
  try {
    const response = await axios.post(`${API_URL}/calcularYGuardar`, null, {
      params: {
        idEmpleado,
        idPeriodoNomina,
        generadoPor,
      },
    });
    return response.data;
  } catch (error) {
    // Captura y manejo detallado de errores
    const backendMessage = error.response?.data?.message || error.response?.data || error.message;
    console.error('Error al calcular y guardar el aguinaldo:', backendMessage);
    throw new Error(backendMessage);
  }
};

// Manejo centralizado de errores
const handleAxiosError = (error, defaultMessage) => {
  if (error.response) {
    // Error del servidor con respuesta
    const backendMessage = error.response.data?.message || error.response.statusText || defaultMessage;
    console.error(backendMessage);
    throw new Error(backendMessage);
  } else if (error.request) {
    // Error de red o sin respuesta del servidor
    console.error('Error de red o sin respuesta del servidor:', error.message);
    throw new Error('Error de red o sin respuesta del servidor.');
  } else {
    // Otros errores
    console.error(defaultMessage, error.message);
    throw new Error(defaultMessage);
  }
};

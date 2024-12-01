import axios from 'axios';

// URL base de la API de deducciones
const API_URL = 'http://localhost:8086/api/Deduccion';

// Obtener todas las deducciones
export const getTodasDeducciones = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las deducciones:', error);
    throw error;
  }
};

// Obtener una deducción por ID
export const getDeduccionPorId = async (idDeduccion) => {
  try {
    const response = await axios.get(`${API_URL}/${idDeduccion}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener la deducción con ID ${idDeduccion}:`, error);
    throw error;
  }
};

// Crear una nueva deducción
export const createDeduccion = async (deduccionData) => {
  try {
    const payload = {
      ...deduccionData,
      fechaRegistro: new Date().toISOString(),
    };
    const response = await axios.post(API_URL, payload);
    return response.data;
  } catch (error) {
    console.error('Error al crear la deducción:', error);
    throw error;
  }
};

// Actualizar una deducción existente
export const updateDeduccion = async (idDeduccion, deduccionData) => {
  try {
    const payload = {
      ...deduccionData,
      fechaRegistro: new Date().toISOString(), // Aseguramos el formato de fecha
    };
    const response = await axios.put(`${API_URL}/${idDeduccion}`, payload);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar la deducción con ID ${idDeduccion}:`, error);
    throw error;
  }
};

// Eliminar una deducción
export const deleteDeduccion = async (idDeduccion) => {
  try {
    const response = await axios.delete(`${API_URL}/${idDeduccion}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar la deducción con ID ${idDeduccion}:`, error);
    throw error;
  }
};

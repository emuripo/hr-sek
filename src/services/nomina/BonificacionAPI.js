import axios from 'axios';

// URL base de la API
const API_URL = 'http://localhost:8086/api/Bonificacion';

// Obtener todas las bonificaciones
export const getTodasBonificaciones = async () => {
  try {
    const response = await axios.get(`${API_URL}/todas`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las bonificaciones:', error);
    throw error;
  }
};

// Obtener una bonificación por ID
export const getBonificacionPorId = async (idBonificacion) => {
  try {
    const response = await axios.get(`${API_URL}/${idBonificacion}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener la bonificación con ID ${idBonificacion}:`, error);
    throw error;
  }
};

// Crear una nueva bonificación
export const createBonificacion = async (bonificacionData) => {
  try {
    const response = await axios.post(`${API_URL}`, bonificacionData);
    return response.data;
  } catch (error) {
    console.error('Error al crear la bonificación:', error);
    throw error;
  }
};

// Actualizar una bonificación
export const updateBonificacion = async (idBonificacion, bonificacionData) => {
  try {
    const response = await axios.put(`${API_URL}/${idBonificacion}`, bonificacionData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar la bonificación con ID ${idBonificacion}:`, error);
    throw error;
  }
};

// Eliminar una bonificación
export const deleteBonificacion = async (idBonificacion) => {
  try {
    const response = await axios.delete(`${API_URL}/${idBonificacion}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar la bonificación con ID ${idBonificacion}:`, error);
    throw error;
  }
};

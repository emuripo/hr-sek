import axios from 'axios';

const API_URL_VACACIONES = 'http://localhost:8088/api/SolicitudVacaciones';

// Función para obtener todas las solicitudes de vacaciones
export const getAllSolicitudesVacaciones = async () => {
  try {
    const response = await axios.get(API_URL_VACACIONES);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las solicitudes de vacaciones:', error);
    throw error;
  }
};

// Función para obtener una solicitud de vacaciones por ID
export const getSolicitudVacacionesById = async (id) => {
  try {
    const response = await axios.get(`${API_URL_VACACIONES}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener la solicitud de vacaciones con ID ${id}:`, error);
    throw error;
  }
};

// Función para crear una nueva solicitud de vacaciones
export const createSolicitudVacaciones = async (solicitudData) => {
  try {
    const response = await axios.post(API_URL_VACACIONES, solicitudData);
    return response.data;
  } catch (error) {
    console.error('Error al crear la solicitud de vacaciones:', error);
    throw error;
  }
};

// Función para actualizar una solicitud de vacaciones
export const updateSolicitudVacaciones = async (id, solicitudData) => {
  try {
    const response = await axios.put(`${API_URL_VACACIONES}/${id}`, solicitudData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar la solicitud de vacaciones con ID ${id}:`, error);
    throw error;
  }
};

// Función para eliminar una solicitud de vacaciones
export const deleteSolicitudVacaciones = async (id) => {
  try {
    const response = await axios.delete(`${API_URL_VACACIONES}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar la solicitud de vacaciones con ID ${id}:`, error);
    throw error;
  }
};

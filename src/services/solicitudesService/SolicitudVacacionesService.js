import axios from 'axios';

const API_URL = 'http://localhost:8088/api/SolicitudVacaciones';

// Crear una nueva solicitud de vacaciones
export const createSolicitudVacaciones = async (solicitudData) => {
  try {
    const response = await axios.post(API_URL, solicitudData);
    return response.data;
  } catch (error) {
    console.error('Error al crear la solicitud de vacaciones:', error);
    const errorMessage = error.response?.data || 'Error al crear la solicitud de vacaciones.';
    throw new Error(errorMessage);
  }
};

// Obtener una solicitud de vacaciones por ID
export const getSolicitudVacacionesById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener la solicitud de vacaciones:', error);
    const errorMessage = error.response?.data || 'Error al obtener la solicitud de vacaciones.';
    throw new Error(errorMessage);
  }
};

// Obtener todas las solicitudes de vacaciones de un empleado
export const getSolicitudesVacacionesPorEmpleado = async (idEmpleado) => {
  try {
    const response = await axios.get(`${API_URL}/empleado/${idEmpleado}/vacaciones`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las solicitudes de vacaciones del empleado:', error);
    const errorMessage = error.response?.data || 'Error al obtener las solicitudes de vacaciones del empleado.';
    throw new Error(errorMessage);
  }
};

// Actualizar una solicitud de vacaciones
export const updateSolicitudVacaciones = async (solicitudData) => {
  try {
    const response = await axios.put(API_URL, solicitudData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar la solicitud de vacaciones:', error);
    const errorMessage = error.response?.data || 'Error al actualizar la solicitud de vacaciones.';
    throw new Error(errorMessage);
  }
};

// Eliminar una solicitud de vacaciones
export const deleteSolicitudVacaciones = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar la solicitud de vacaciones:', error);
    const errorMessage = error.response?.data || 'Error al eliminar la solicitud de vacaciones.';
    throw new Error(errorMessage);
  }
};

// Aprobar una solicitud de vacaciones
export const approveSolicitudVacaciones = async (id) => {
  try {
    const response = await axios.put(`${API_URL}/aprobar/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al aprobar la solicitud de vacaciones:', error);
    const errorMessage = error.response?.data || 'Error al aprobar la solicitud de vacaciones.';
    throw new Error(errorMessage);
  }
};

// Rechazar una solicitud de vacaciones con motivo de rechazo
export const rejectSolicitudVacaciones = async (id, motivoRechazo) => {
  try {
    const response = await axios.put(`${API_URL}/rechazar/${id}`, null, {
      params: { motivoRechazo }
    });
    return response.data;
  } catch (error) {
    console.error('Error al rechazar la solicitud de vacaciones:', error);
    const errorMessage = error.response?.data || 'Error al rechazar la solicitud de vacaciones.';
    throw new Error(errorMessage);
  }
};

// Obtener todas las solicitudes de vacaciones
export const getAllSolicitudesVacaciones = async () => {
  try {
    const response = await axios.get(`${API_URL}/todas`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener todas las solicitudes de vacaciones:', error);
    const errorMessage = error.response?.data || 'Error al obtener todas las solicitudes de vacaciones.';
    throw new Error(errorMessage);
  }
};

import axios from 'axios';

const API_URL = 'http://localhost:8088/api/SolicitudPersonal';

// Crear una nueva solicitud personal
export const createSolicitudPersonal = async (solicitudData) => {
  try {
    const response = await axios.post(API_URL, solicitudData);
    return response.data;
  } catch (error) {
    console.error('Error al crear la solicitud personal:', error);
    throw error;
  }
};

// Obtener una solicitud personal por ID
export const getSolicitudPersonalById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener la solicitud personal:', error);
    throw error;
  }
};

// Obtener todas las solicitudes personales de un empleado
export const getSolicitudesPersonalesPorEmpleado = async (idEmpleado) => {
  try {
    const response = await axios.get(`${API_URL}/empleado/${idEmpleado}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las solicitudes personales del empleado:', error);
    throw error;
  }
};

// Actualizar una solicitud personal
export const updateSolicitudPersonal = async (solicitudData) => {
  try {
    const response = await axios.put(API_URL, solicitudData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar la solicitud personal:', error);
    throw error;
  }
};

// Eliminar una solicitud personal
export const deleteSolicitudPersonal = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar la solicitud personal:', error);
    throw error;
  }
};

// Aprobar una solicitud personal
export const approveSolicitudPersonal = async (id) => {
  try {
    const response = await axios.put(`${API_URL}/aprobar/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al aprobar la solicitud personal:', error);
    throw error;
  }
};

// Rechazar una solicitud personal con motivo de rechazo
export const rejectSolicitudPersonal = async (id, motivoRechazo) => {
  try {
    const response = await axios.put(`${API_URL}/rechazar/${id}`, null, {
      params: { motivoRechazo }
    });
    return response.data;
  } catch (error) {
    console.error('Error al rechazar la solicitud personal:', error);
    throw error;
  }
};

// Obtener todas las solicitudes personales
export const getAllSolicitudesPersonales = async () => {
  try {
    const response = await axios.get(`${API_URL}/todas`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener todas las solicitudes personales:', error);
    throw error;
  }
};

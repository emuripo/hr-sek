import axios from 'axios';

const API_URL = 'http://localhost:8088/api/SolicitudDocumento';

// Crear una nueva solicitud de documento
export const createSolicitudDocumento = async (solicitudData) => {
  try {
    const response = await axios.post(API_URL, solicitudData);
    return response.data;
  } catch (error) {
    console.error('Error al crear la solicitud de documento:', error);
    throw error;
  }
};

// Obtener una solicitud de documento por ID
export const getSolicitudDocumentoById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener la solicitud de documento:', error);
    throw error;
  }
};

// Obtener todas las solicitudes de documentos de un empleado
export const getSolicitudesPorEmpleado = async (idEmpleado) => {
  try {
    const response = await axios.get(`${API_URL}/empleado/${idEmpleado}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las solicitudes del empleado:', error);
    throw error;
  }
};

// Actualizar una solicitud de documento
export const updateSolicitudDocumento = async (solicitudData) => {
  try {
    const response = await axios.put(API_URL, solicitudData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar la solicitud de documento:', error);
    throw error;
  }
};

// Eliminar una solicitud de documento
export const deleteSolicitudDocumento = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar la solicitud de documento:', error);
    throw error;
  }
};

// Aprobar una solicitud de documento
export const approveSolicitudDocumento = async (id) => {
  try {
    const response = await axios.put(`${API_URL}/aprobar/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al aprobar la solicitud de documento:', error);
    throw error;
  }
};

// Rechazar una solicitud de documento con motivo de rechazo
export const rejectSolicitudDocumento = async (id, motivoRechazo) => {
  try {
    const response = await axios.put(`${API_URL}/rechazar/${id}`, null, {
      params: { motivoRechazo }
    });
    return response.data;
  } catch (error) {
    console.error('Error al rechazar la solicitud de documento:', error);
    throw error;
  }
};

// Obtener todas las solicitudes de documentos
export const getAllSolicitudesDocumentos = async () => {
  try {
    const response = await axios.get(`${API_URL}/todas`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener todas las solicitudes de documentos:', error);
    throw error;
  }
};

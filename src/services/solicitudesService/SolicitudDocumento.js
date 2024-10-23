import axios from 'axios';

const API_URL = 'http://localhost:8088/api/SolicitudDocumento';

// Obtener todas las solicitudes de documentos
export const getSolicitudesDocumentos = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las solicitudes de documentos:', error);
    throw error;
  }
};

// Obtener una solicitud de documento por ID
export const getSolicitudDocumentoById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener la solicitud de documento con ID ${id}:`, error);
    throw error;
  }
};

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

// Actualizar una solicitud de documento
export const updateSolicitudDocumento = async (id, solicitudData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, solicitudData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar la solicitud de documento con ID ${id}:`, error);
    throw error;
  }
};

// Eliminar una solicitud de documento
export const deleteSolicitudDocumento = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar la solicitud de documento con ID ${id}:`, error);
    throw error;
  }
};

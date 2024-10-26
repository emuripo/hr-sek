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

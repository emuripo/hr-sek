// src/services/solicitudesService/SolicitudPersonalService.js

import axios from 'axios';

const API_URL_PERSONAL = 'http://localhost:8088/api/SolicitudPersonal';

// Función para crear una nueva solicitud personal
export const createSolicitudPersonal = async (solicitudData) => {
  try {
    const response = await axios.post(API_URL_PERSONAL, solicitudData);
    return response.data;
  } catch (error) {
    console.error('Error al crear la solicitud personal:', error);
    throw error;
  }
};

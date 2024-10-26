// src/services/solicitudesService/SolicitudVacacionesService.js

import axios from 'axios';

const API_URL_VACACIONES = 'http://localhost:8088/api/SolicitudVacaciones';

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


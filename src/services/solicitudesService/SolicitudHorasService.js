// src/services/solicitudesService/SolicitudHorasService.js

import axios from 'axios';

const API_URL_HORAS = 'http://localhost:8088/api/SolicitudHorasExtra';

// Crear una nueva solicitud de horas extra
export const createSolicitudHoras = async (solicitudData) => {
  try {
    const response = await axios.post(API_URL_HORAS, solicitudData);
    return response.data;
  } catch (error) {
    console.error('Error al crear la solicitud de horas extra:', error);
    throw error;
  }
};

// Obtener todas las solicitudes de horas extra
export const getSolicitudesHoras = async () => {
  try {
    const response = await axios.get(API_URL_HORAS);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las solicitudes de horas extra:', error);
    throw error;
  }
};

// Obtener una solicitud de horas extra por ID
export const getSolicitudHorasById = async (id) => {
  try {
    const response = await axios.get(`${API_URL_HORAS}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener la solicitud de horas extra con ID ${id}:`, error);
    throw error;
  }
};

// Actualizar una solicitud de horas extra
export const updateSolicitudHoras = async (id, solicitudData) => {
  try {
    const response = await axios.put(`${API_URL_HORAS}/${id}`, solicitudData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar la solicitud de horas extra con ID ${id}:`, error);
    throw error;
  }
};

// Eliminar una solicitud de horas extra
export const deleteSolicitudHoras = async (id) => {
  try {
    const response = await axios.delete(`${API_URL_HORAS}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar la solicitud de horas extra con ID ${id}:`, error);
    throw error;
  }
};

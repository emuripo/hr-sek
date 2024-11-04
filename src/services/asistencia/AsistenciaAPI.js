// src/services/asistencia/AsistenciaAPI.js
import axios from 'axios';

// Define la URL base para el API de Asistencia
const API_URL = 'http://localhost:8089/api/Asistencia';

const AsistenciaAPI = {
  // Registrar asistencia
  registrarAsistencia: async (asistenciaData) => {
    console.log('Datos de asistencia que se envían:', asistenciaData);
    try {
      const response = await axios.post(`${API_URL}`, asistenciaData);
      console.log('Respuesta del registro de asistencia:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al registrar asistencia:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al registrar asistencia');
    }
  },

  // Obtener asistencia por ID
  obtenerAsistenciaPorId: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener asistencia:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener asistencia');
    }
  },

  // Obtener todas las asistencias
  obtenerTodasAsistencias: async () => {
    try {
      const response = await axios.get(`${API_URL}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener asistencias:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener asistencias');
    }
  }
};

export default AsistenciaAPI;

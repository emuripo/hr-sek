// src/services/asistencia/EmpleadoTurnoAPI.js 

import axios from 'axios';

// Define la URL base para el API de AsignacionTurno
const API_URL = 'http://localhost:8089/api/AsignacionTurno';

const EmpleadoTurnoAPI = {
  // Obtener turnos asignados por empleado
  obtenerTurnoPorEmpleado: async (idEmpleado) => {
    console.log(`Obteniendo turnos para el empleado con ID: ${idEmpleado}`);
    try {
      const response = await axios.get(`${API_URL}/empleado/${idEmpleado}`);
      console.log('Turnos obtenidos:', response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('Error al obtener turnos (respuesta del servidor):', error.response.data);
        throw new Error(error.response.data.message || 'Error al obtener turnos.');
      } else if (error.request) {
        console.error('Error al obtener turnos (sin respuesta del servidor):', error.request);
        throw new Error('No se recibió respuesta del servidor. Intente de nuevo.');
      } else {
        console.error('Error al obtener turnos:', error.message);
        throw new Error('Error al obtener turnos. Intente de nuevo.');
      }
    }
  },

  // Asignar turno a un empleado
  asignarTurno: async (asignacionTurnoData) => {
    console.log('Asignando turno:', asignacionTurnoData);
    try {
      const response = await axios.post(`${API_URL}`, asignacionTurnoData); // POST a la raíz de AsignacionTurno
      console.log('Respuesta de asignación de turno:', response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('Error al asignar turno (respuesta del servidor):', error.response.data);
        throw new Error(error.response.data.message || 'Error al asignar turno.');
      } else if (error.request) {
        console.error('Error al asignar turno (sin respuesta del servidor):', error.request);
        throw new Error('No se recibió respuesta del servidor. Intente de nuevo.');
      } else {
        console.error('Error al asignar turno:', error.message);
        throw new Error('Error al asignar turno. Intente de nuevo.');
      }
    }
  }
};

export default EmpleadoTurnoAPI;

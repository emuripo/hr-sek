import axios from 'axios';

const API_URL = 'http://localhost:8089/api/turno';

const TurnoAPI = {
  // Crear turno
  crearTurno: async (turnoData) => {
    try {
      const response = await axios.post(API_URL, turnoData);
      return response.data;
    } catch (error) {
      console.error('Error al crear el turno:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al crear el turno');
    }
  },

  // Obtener un turno por ID
  obtenerTurnoPorId: async (idTurno) => {
    try {
      const response = await axios.get(`${API_URL}/${idTurno}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener el turno:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener el turno');
    }
  },

  // Obtener todos los turnos
  obtenerTodosLosTurnos: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error al obtener los turnos:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener los turnos');
    }
  },

  // Actualizar turno
  actualizarTurno: async (idTurno, turnoData) => {
    try {
      const response = await axios.put(`${API_URL}/${idTurno}`, turnoData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar el turno:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al actualizar el turno');
    }
  },

  // Eliminar turno
  eliminarTurno: async (idTurno) => {
    try {
      const response = await axios.delete(`${API_URL}/${idTurno}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar el turno:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al eliminar el turno');
    }
  }
};

export default TurnoAPI;

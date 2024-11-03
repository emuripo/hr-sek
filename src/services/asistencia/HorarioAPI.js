import axios from 'axios';

const API_URL = 'http://localhost:8089/api/horario';

const HorarioAPI = {
  // Método para crear un horario
  crearHorario: async (horarioData) => {
    try {
      const response = await axios.post(API_URL, horarioData);
      return response.data;
    } catch (error) {
      console.error('Error al crear el horario:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al crear el horario');
    }
  },

  // Método opcional para obtener todos los horarios (si es necesario)
  obtenerTodosLosHorarios: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error al obtener los horarios:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener los horarios');
    }
  }
};

export default HorarioAPI;

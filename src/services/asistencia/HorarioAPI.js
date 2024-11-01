import axios from 'axios';

const API_URL = 'http://localhost:8089/api/horario';

const HorarioAPI = {
  crearHorario: async (horarioData) => {
    try {
      const response = await axios.post(`${API_URL}`, horarioData);
      return response.data;
    } catch (error) {
      console.error('Error al crear el horario:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al crear el horario');
    }
  }
};

export default HorarioAPI;

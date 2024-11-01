import axios from 'axios';

// Define la URL base para el API de Asistencia
const API_URL = 'http://localhost:8089/api/asistencia';

const AsistenciaAPI = {
  // Registrar asistencia
  registrarAsistencia: async (asistenciaData) => {
    console.log('Datos de asistencia que se envían:', asistenciaData); // Verifica los datos
    try {
      const response = await axios.post(`${API_URL}`, asistenciaData);
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

  // Obtener asistencias por empleado
  obtenerAsistenciasPorEmpleado: async (idEmpleado) => {
    try {
      const response = await axios.get(`${API_URL}/empleado/${idEmpleado}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener asistencias por empleado:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener asistencias por empleado');
    }
  },

  // Actualizar asistencia
  actualizarAsistencia: async (id, asistenciaData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, asistenciaData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar asistencia:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al actualizar asistencia');
    }
  },

  // Eliminar asistencia
  eliminarAsistencia: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar asistencia:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al eliminar asistencia');
    }
  }
};

export default AsistenciaAPI;

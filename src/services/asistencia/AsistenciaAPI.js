import axios from 'axios';

// Define la URL base para el API de Asistencia
const API_URL = 'http://localhost:8089/api/Asistencia';

const AsistenciaAPI = {
  // Registrar asistencia
  registrarAsistencia: async (asistenciaData) => {
    console.log('Datos de asistencia que se envían:', asistenciaData); // Verifica los datos enviados

    // Verificar que asistenciaData contenga IdEmpleadoTurno
    if (!asistenciaData.idEmpleadoTurno) {
      console.error('Error: idEmpleadoTurno no está definido en asistenciaData');
      throw new Error('idEmpleadoTurno no está definido. Verifica los datos antes de enviar.');
    }

    try {
      const response = await axios.post(`${API_URL}`, asistenciaData);
      console.log('Respuesta del registro de asistencia:', response.data); // Log para verificar la respuesta de éxito
      return response.data;
    } catch (error) {
      console.error('Error al registrar asistencia:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al registrar asistencia');
    }
  },

  // Obtener asistencia por ID
  obtenerAsistenciaPorId: async (id) => {
    console.log(`Obteniendo asistencia con ID: ${id}`); // Verificación del ID solicitado
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      console.log('Datos de la asistencia obtenida:', response.data); // Log para mostrar los datos obtenidos
      return response.data;
    } catch (error) {
      console.error('Error al obtener asistencia:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener asistencia');
    }
  },

  // Obtener asistencias por empleado
  obtenerAsistenciasPorEmpleado: async (idEmpleado) => {
    console.log(`Obteniendo asistencias para el empleado con ID: ${idEmpleado}`); // Verificación del ID de empleado
    try {
      const response = await axios.get(`${API_URL}/empleado/${idEmpleado}`);
      console.log('Asistencias obtenidas para el empleado:', response.data); // Log para ver las asistencias obtenidas
      return response.data;
    } catch (error) {
      console.error('Error al obtener asistencias por empleado:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener asistencias por empleado');
    }
  },

  // Actualizar asistencia
  actualizarAsistencia: async (id, asistenciaData) => {
    console.log(`Actualizando asistencia con ID: ${id}`, asistenciaData); // Log para verificar datos enviados
    try {
      const response = await axios.put(`${API_URL}/${id}`, asistenciaData);
      console.log('Asistencia actualizada con éxito:', response.data); // Log para verificar la respuesta de éxito
      return response.data;
    } catch (error) {
      console.error('Error al actualizar asistencia:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al actualizar asistencia');
    }
  },

  // Eliminar asistencia
  eliminarAsistencia: async (id) => {
    console.log(`Eliminando asistencia con ID: ${id}`); // Verificación del ID que se está eliminando
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      console.log('Asistencia eliminada con éxito:', response.data); // Log para verificar la eliminación
      return response.data;
    } catch (error) {
      console.error('Error al eliminar asistencia:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al eliminar asistencia');
    }
  }
};

export default AsistenciaAPI;

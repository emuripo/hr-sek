import axios from 'axios';

const API_URL = 'http://localhost:8089/api/AsignacionTurno';

const EmpleadoTurnoAPI = {
  // Asignar un turno a un empleado
  asignarTurno: async (empleadoTurnoData) => {
    console.log('Datos de asignación de turno que se envían:', empleadoTurnoData);

    try {
      const response = await axios.post(API_URL, empleadoTurnoData);
      console.log('Respuesta de asignación de turno:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al asignar el turno:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al asignar el turno');
    }
  },

  // Obtener el turno asignado al empleado
  obtenerTurnoPorEmpleado: async (idEmpleado) => {
    console.log(`Obteniendo turno para el empleado con ID: ${idEmpleado}`);

    if (!idEmpleado) {
      console.error('Error: idEmpleado no está definido');
      throw new Error('idEmpleado no está definido. Proporcione un idEmpleado válido.');
    }

    try {
      const response = await axios.get(`${API_URL}/empleado/${idEmpleado}`);
      console.log('Turno obtenido para el empleado:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener el turno del empleado:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener el turno del empleado');
    }
  },

  // Eliminar una asignación de turno
  eliminarAsignacion: async (idEmpleadoTurno) => {
    console.log(`Eliminando asignación de turno con ID: ${idEmpleadoTurno}`);

    if (!idEmpleadoTurno) {
      console.error('Error: idEmpleadoTurno no está definido');
      throw new Error('idEmpleadoTurno no está definido. Proporcione un idEmpleadoTurno válido.');
    }

    try {
      const response = await axios.delete(`${API_URL}/${idEmpleadoTurno}`);
      console.log('Asignación de turno eliminada con éxito:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar la asignación de turno:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al eliminar la asignación de turno');
    }
  }
};

export default EmpleadoTurnoAPI;

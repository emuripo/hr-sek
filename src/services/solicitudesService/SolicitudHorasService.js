import axios from 'axios';

const API_URL = 'http://localhost:8088/api/SolicitudHorasExtra';

// Crear una nueva solicitud de horas extra
export const createSolicitudHorasExtra = async (solicitudData) => {
  try {
    const response = await axios.post(API_URL, solicitudData);
    return response.data;
  } catch (error) {
    console.error('Error al crear la solicitud de horas extra:', error);
    throw error;
  }
};

// Obtener el saldo de horas extras de un empleado
export const getSaldoHorasExtraPorEmpleado = async (idEmpleado) => {
  try {
    const response = await axios.get(`${API_URL}/empleado/${idEmpleado}/saldo`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener el saldo de horas extras del empleado:', error);
    throw error;
  }
};

// Obtener una solicitud de horas extra por ID
export const getSolicitudHorasExtraById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener la solicitud de horas extra:', error);
    throw error;
  }
};

// Obtener todas las solicitudes de horas extra de un empleado
export const getSolicitudesHorasExtraPorEmpleado = async (idEmpleado) => {
  try {
    const response = await axios.get(`${API_URL}/empleado/${idEmpleado}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las solicitudes de horas extra del empleado:', error);
    throw error;
  }
};

// Actualizar una solicitud de horas extra
export const updateSolicitudHorasExtra = async (solicitudData) => {
  try {
    const response = await axios.put(API_URL, solicitudData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar la solicitud de horas extra:', error);
    throw error;
  }
};

// Eliminar una solicitud de horas extra
export const deleteSolicitudHorasExtra = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar la solicitud de horas extra:', error);
    throw error;
  }
};

// Aprobar una solicitud de horas extra
export const approveSolicitudHorasExtra = async (id) => {
  try {
    const response = await axios.put(`${API_URL}/aprobar/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al aprobar la solicitud de horas extra:', error);
    throw error;
  }
};

// Rechazar una solicitud de horas extra con motivo de rechazo
export const rejectSolicitudHorasExtra = async (id, motivoRechazo) => {
  try {
    const response = await axios.put(`${API_URL}/rechazar/${id}`, null, {
      params: { motivoRechazo }
    });
    return response.data;
  } catch (error) {
    console.error('Error al rechazar la solicitud de horas extra:', error);
    throw error;
  }
};

// Obtener todas las solicitudes de horas extra
export const getAllSolicitudesHorasExtra = async () => {
  try {
    const response = await axios.get(`${API_URL}/todas`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener todas las solicitudes de horas extra:', error);
    throw error;
  }
};

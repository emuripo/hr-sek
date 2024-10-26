import axios from 'axios';

const API_URL_DOCS = 'http://localhost:8088/api/SolicitudDocumento';
const API_URL_HORAS = 'http://localhost:8088/api/SolicitudHorasExtra';
const API_URL_PERSONAL = 'http://localhost:8088/api/SolicitudPersonal';
const API_URL_VACACIONES = 'http://localhost:8088/api/SolicitudVacaciones';

// todas las solicitudes combinadas
export const getTodasSolicitudes = async () => {
  try {
    const [docs, horas, personales, vacaciones] = await Promise.all([
      axios.get(API_URL_DOCS),
      axios.get(API_URL_HORAS),
      axios.get(API_URL_PERSONAL),
      axios.get(API_URL_VACACIONES),
    ]);

    const solicitudes = [
      ...docs.data.map((solicitud) => ({ ...solicitud, tipo: 'Documento' })),
      ...horas.data.map((solicitud) => ({ ...solicitud, tipo: 'Horas Extra' })),
      ...personales.data.map((solicitud) => ({ ...solicitud, tipo: 'Personal' })),
      ...vacaciones.data.map((solicitud) => ({ ...solicitud, tipo: 'Vacaciones' })),
    ];

    return solicitudes;
  } catch (error) {
    console.error('Error al obtener todas las solicitudes:', error);
    throw error;
  }
};

// Actualizar estado solicitud
export const updateSolicitudEstado = async (id, tipo, estado) => {
  const url =
    tipo === 'Documento'
      ? `${API_URL_DOCS}/${id}`
      : tipo === 'Horas Extra'
      ? `${API_URL_HORAS}/${id}`
      : tipo === 'Personal'
      ? `${API_URL_PERSONAL}/${id}`
      : tipo === 'Vacaciones'
      ? `${API_URL_VACACIONES}/${id}`
      : null;

  if (!url) {
    console.error(`Tipo de solicitud desconocido: ${tipo}`);
    return;
  }

  try {
    const payload =
      tipo === 'Vacaciones'
        ? { estaAprobada: estado, idEmpleado: 1 } 
        : { estaAprobada: estado };

    const response = await axios.put(url, payload);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el estado de la solicitud ${tipo}:`, error);
    throw error;
  }
};

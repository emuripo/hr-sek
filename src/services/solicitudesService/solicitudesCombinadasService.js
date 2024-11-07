import axios from 'axios';

const API_URL_DOCS = 'http://localhost:8088/api/SolicitudDocumento';
const API_URL_HORAS = 'http://localhost:8088/api/SolicitudHorasExtra';
const API_URL_PERSONAL = 'http://localhost:8088/api/SolicitudPersonal';
const API_URL_VACACIONES = 'http://localhost:8088/api/SolicitudVacaciones';

// Función para manejar errores 404 y devolver una lista vacía en lugar de un error
const fetchOrEmpty = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.warn(`No se encontraron solicitudes en la ruta: ${url}`);
      return []; // Devolver una lista vacía si no hay datos
    } else {
      throw error; // Propagar otros errores
    }
  }
};

// Obtener todas las solicitudes combinadas
export const getTodasSolicitudes = async () => {
  try {
    const [docs, horas, personales, vacaciones] = await Promise.all([
      fetchOrEmpty(`${API_URL_DOCS}/todas`),
      fetchOrEmpty(`${API_URL_HORAS}/todas`),
      fetchOrEmpty(`${API_URL_PERSONAL}/todas`),
      fetchOrEmpty(`${API_URL_VACACIONES}/todas`),
    ]);

    const solicitudes = [
      ...docs.map((solicitud) => ({ ...solicitud, tipo: 'Documento' })),
      ...horas.map((solicitud) => ({ ...solicitud, tipo: 'Horas Extra' })),
      ...personales.map((solicitud) => ({ ...solicitud, tipo: 'Personal' })),
      ...vacaciones.map((solicitud) => ({ ...solicitud, tipo: 'Vacaciones' })),
    ];

    return solicitudes;
  } catch (error) {
    console.error('Error al obtener todas las solicitudes:', error);
    throw error;
  }
};

// Actualizar estado de solicitud (Aprobar o Rechazar)
export const updateSolicitudEstado = async (id, tipo, estado, motivoRechazo = '') => {
  const url =
    tipo === 'Documento'
      ? `${API_URL_DOCS}/${estado ? 'aprobar' : 'rechazar'}/${id}`
      : tipo === 'Horas Extra'
      ? `${API_URL_HORAS}/${estado ? 'aprobar' : 'rechazar'}/${id}`
      : tipo === 'Personal'
      ? `${API_URL_PERSONAL}/${estado ? 'aprobar' : 'rechazar'}/${id}`
      : tipo === 'Vacaciones'
      ? `${API_URL_VACACIONES}/${estado ? 'aprobar' : 'rechazar'}/${id}`
      : null;

  if (!url) {
    console.error(`Tipo de solicitud desconocido: ${tipo}`);
    return;
  }

  try {
    const payload = estado ? { estaAprobada: true } : { estaAprobada: false, motivoRechazo };
    const response = await axios.put(url, payload);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el estado de la solicitud ${tipo}:`, error);
    throw error;
  }
};

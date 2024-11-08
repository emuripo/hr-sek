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
  const baseUrl = 
    tipo === 'Documento'
      ? API_URL_DOCS
      : tipo === 'Horas Extra'
      ? API_URL_HORAS
      : tipo === 'Personal'
      ? API_URL_PERSONAL
      : tipo === 'Vacaciones'
      ? API_URL_VACACIONES
      : null;

  if (!baseUrl) {
    console.error(`Tipo de solicitud desconocido: ${tipo}`);
    return;
  }

  const url = estado
    ? `${baseUrl}/aprobar/${id}`
    : `${baseUrl}/rechazar/${id}?motivoRechazo=${encodeURIComponent(motivoRechazo)}`;

  try {
    console.log(`Enviando solicitud a URL: ${url}`); // URL de la solicitud
    const response = await axios.put(url);
    console.log('Respuesta del servidor:', response.data); // Respuesta del servidor en caso de éxito
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el estado de la solicitud ${tipo}:`, error);
    console.log('Código de estado:', error.response?.status);
    console.log('Datos de error:', error.response?.data);
    throw error;
  }
};

import axios from 'axios';

const API_URL_DOCS = 'http://localhost:8088/api/SolicitudDocumento';
const API_URL_HORAS = 'http://localhost:8088/api/SolicitudHorasExtra';
const API_URL_PERSONAL = 'http://localhost:8088/api/SolicitudPersonal';
const API_URL_VACACIONES = 'http://localhost:8088/api/SolicitudVacaciones';

// Obtener todas las solicitudes combinadas
export const getTodasSolicitudes = async () => {
  try {
    const [docs, horas, personales, vacaciones] = await Promise.all([
      axios.get(API_URL_DOCS),
      axios.get(API_URL_HORAS),
      axios.get(API_URL_PERSONAL),
      axios.get(API_URL_VACACIONES),
    ]);

    // Consolidar todos los datos en un solo array
    const solicitudes = [
      ...docs.data.map(solicitud => ({ ...solicitud, tipo: 'Documento' })),
      ...horas.data.map(solicitud => ({ ...solicitud, tipo: 'Horas Extra' })),
      ...personales.data.map(solicitud => ({ ...solicitud, tipo: 'Personal' })),
      ...vacaciones.data.map(solicitud => ({ ...solicitud, tipo: 'Vacaciones' })),
    ];

    return solicitudes;
  } catch (error) {
    console.error('Error al obtener todas las solicitudes:', error);
    throw error;
  }
};

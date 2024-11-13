import axios from 'axios';

const API_URL_DOCS = 'http://localhost:8088/api/SolicitudDocumento/empleado';
const API_URL_HORAS = 'http://localhost:8088/api/SolicitudHorasExtra/empleado';
const API_URL_PERSONAL = 'http://localhost:8088/api/SolicitudPersonal/empleado';
const API_URL_VACACIONES = 'http://localhost:8088/api/SolicitudVacaciones/empleado';

// Obtener todas las solicitudes del empleado por idEmpleado
export const getSolicitudesByEmpleado = async (idEmpleado) => {
  try {
    const [docs, horas, personales, vacaciones] = await Promise.all([
      axios.get(`${API_URL_DOCS}/${idEmpleado}`).catch((error) => {
        if (error.response && error.response.status === 404) {
          console.warn("No se encontraron solicitudes de Documentos.");
          return { data: [] };
        }
        console.error("Error de conexión para Documentos:", error.message);
        return { data: [] };
      }),
      axios.get(`${API_URL_HORAS}/${idEmpleado}`).catch((error) => {
        if (error.response && error.response.status === 404) {
          console.warn("No se encontraron solicitudes de Horas Extra.");
          return { data: [] };
        }
        console.error("Error de conexión para Horas Extra:", error.message);
        return { data: [] };
      }),
      axios.get(`${API_URL_PERSONAL}/${idEmpleado}`).catch((error) => {
        if (error.response && error.response.status === 404) {
          console.warn("No se encontraron solicitudes Personales.");
          return { data: [] };
        }
        console.error("Error de conexión para Personal:", error.message);
        return { data: [] };
      }),
      axios.get(`${API_URL_VACACIONES}/${idEmpleado}`).catch((error) => {
        if (error.response && error.response.status === 404) {
          console.warn("No se encontraron solicitudes de Vacaciones.");
          return { data: [] };
        }
        console.error("Error de conexión para Vacaciones:", error.message);
        return { data: [] };
      }),
    ]);

    const solicitudes = [
      ...docs.data.map((solicitud) => ({ ...solicitud, tipo: 'Documento' })),
      ...horas.data.map((solicitud) => ({ ...solicitud, tipo: 'Horas Extra' })),
      ...personales.data.map((solicitud) => ({ ...solicitud, tipo: 'Personal' })),
      ...vacaciones.data.map((solicitud) => ({ ...solicitud, tipo: 'Vacaciones' })),
    ];

    return solicitudes;
  } catch (error) {
    console.error('Error al obtener todas las solicitudes del empleado:', error);
    return [];
  }
};

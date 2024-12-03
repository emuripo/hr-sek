import axios from "axios";

const LOG_API_URL = "http://localhost:8087/api/Logs";

/**
 * Registra un evento en el sistema de logs.
 * @param {string} eventName - Nombre del evento.
 * @param {object} eventDetails - Detalles específicos del evento.
 */
export const logEvent = async (eventName, eventDetails = {}) => {
  try {
    // Obtener los datos del usuario desde el localStorage
    const userData = JSON.parse(localStorage.getItem("authData")) || {};

    // Construir el payload del log
    const logData = {
      eventName,
      eventDetails: JSON.stringify(eventDetails), // Serializar los detalles del evento
      username: userData.username || "Desconocido",
      userRole: userData.userRole || "Desconocido",
      idEmpleado: userData.idEmpleado || null,
      timestamp: new Date().toISOString(),
    };

    // Registro en consola para depuración
    console.log("Enviando log al servidor:", logData);

    // Enviar el log al backend
    await axios.post(LOG_API_URL, logData);

    // Confirmar en consola que el log fue registrado
    console.log(`Log registrado con éxito: ${eventName}`);
  } catch (error) {
    // Manejo de errores
    console.error("Error al registrar el log:", error);
  }
};

/**
 * Obtiene todos los logs del sistema.
 * @returns {Promise<Array>} Lista de logs obtenidos del backend.
 */
export const getLogs = async () => {
  try {
    // Realizar la solicitud GET para obtener los logs
    const response = await axios.get(LOG_API_URL);

    // Retornar los datos obtenidos
    return response.data;
  } catch (error) {
    // Manejo de errores
    console.error("Error al obtener los logs:", error);
    throw error;
  }
};

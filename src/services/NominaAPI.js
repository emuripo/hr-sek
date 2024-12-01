// src/services/NominaAPI.js
import axios from 'axios';

const NOMINA_API_URL = 'http://localhost:8086/api/NominaAPI';

export const validarNominaPorPeriodo = async (idEmpleado, idPeriodoNomina) => {
  try {
    const response = await axios.get(`${NOMINA_API_URL}/validar/${idEmpleado}/${idPeriodoNomina}`);
    return response.data; // Retorna el objeto con "existe" y "mensaje"
  } catch (error) {
    console.error(`Error al validar la nómina para idEmpleado ${idEmpleado} y idPeriodoNomina ${idPeriodoNomina}:`, error);
    throw error;
  }
}
// Obtener todas las nóminas
export const getNominas = async () => {
  try {
    const response = await axios.get(NOMINA_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las nóminas:', error);
    throw error;
  }
};

// Crear una nueva nómina
export const createNomina = async (nominaData) => {
  try {
    const response = await axios.post(NOMINA_API_URL, nominaData);
    return response.data;
  } catch (error) {
    console.error('Error al crear la nómina:', error);
    throw error;
  }
};

// Actualizar una nómina existente
export const updateNomina = async (idNomina, nominaData) => {
  try {
    const response = await axios.put(`${NOMINA_API_URL}/${idNomina}`, nominaData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar la nómina con idNomina ${idNomina}:`, error);
    throw error;
  }
};

// Desactivar una nómina
export const deleteNomina = async (idNomina) => {
  try {
    const response = await axios.delete(`${NOMINA_API_URL}/${idNomina}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar la nómina con idNomina ${idNomina}:`, error);
    throw error;
  }
};

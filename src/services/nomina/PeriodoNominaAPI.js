import axios from 'axios';

// URL base de la API
const API_URL = 'http://localhost:8086/api/PeriodoNomina';

// Obtener todos los períodos de nómina
export const getTodosPeriodosNomina = async () => {
  try {
    const response = await axios.get(`${API_URL}/todos`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los períodos de nómina:', error);
    throw error;
  }
};


// Obtener un período de nómina por ID
export const getPeriodoNominaPorId = async (idPeriodoNomina) => {
  try {
    const response = await axios.get(`${API_URL}/${idPeriodoNomina}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el período de nómina con ID ${idPeriodoNomina}:`, error);
    throw error;
  }
};

// Obtener un período de nómina junto con sus aguinaldos
export const getPeriodoNominaConAguinaldos = async (idPeriodoNomina) => {
  try {
    const response = await axios.get(`${API_URL}/${idPeriodoNomina}/aguinaldos`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el período de nómina con sus aguinaldos para el ID ${idPeriodoNomina}:`, error);
    throw error;
  }
};

// Crear un nuevo período de nómina
export const createPeriodoNomina = async (periodoData) => {
  try {
    const response = await axios.post(`${API_URL}/crear`, periodoData);
    return response.data;
  } catch (error) {
    console.error('Error al crear el período de nómina:', error);
    throw error;
  }
};

// Actualizar un período de nómina
export const updatePeriodoNomina = async (idPeriodoNomina, periodoData) => {
  try {
    const response = await axios.put(`${API_URL}/actualizar/${idPeriodoNomina}`, periodoData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el período de nómina con ID ${idPeriodoNomina}:`, error);
    throw error;
  }
};

// Eliminar un período de nómina
export const deletePeriodoNomina = async (idPeriodoNomina) => {
  try {
    const response = await axios.delete(`${API_URL}/eliminar/${idPeriodoNomina}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar el período de nómina con ID ${idPeriodoNomina}:`, error);
    throw error;
  }
};

// Obtener períodos de nómina activos
export const getPeriodosActivos = async () => {
  try {
    const response = await axios.get(`${API_URL}/activos`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los períodos de nómina activos:', error);
    throw error;
  }
};

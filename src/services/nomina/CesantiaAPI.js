import axios from 'axios';

const CESANTIA_API_URL = 'http://localhost:8086/api/liquidaciones';

// Obtener todas las cesantías
export const getCesantias = async () => {
  try {
    const response = await axios.get(`${CESANTIA_API_URL}/todas`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las cesantías:', error);
    throw error;
  }
};

// Obtener cesantía por ID
export const getCesantiaById = async (id) => {
  try {
    const response = await axios.get(`${CESANTIA_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener la cesantía con ID ${id}:`, error);
    throw error;
  }
};

// Obtener cesantías de un empleado específico
export const getCesantiasByEmpleado = async (idEmpleado) => {
  try {
    const response = await axios.get(`${CESANTIA_API_URL}/empleado/${idEmpleado}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener las cesantías del empleado con ID ${idEmpleado}:`, error);
    throw error;
  }
};

// Crear una nueva cesantía
export const createCesantia = async (cesantiaData) => {
  try {
    const response = await axios.post(`${CESANTIA_API_URL}/registrar`, cesantiaData);
    return response.data;
  } catch (error) {
    console.error('Error al crear la cesantía:', error);
    throw error;
  }
};

// Actualizar una cesantía existente
export const updateCesantia = async (idCesantia, cesantiaData) => {
  try {
    const response = await axios.put(`${CESANTIA_API_URL}/${idCesantia}`, cesantiaData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar la cesantía con ID ${idCesantia}:`, error);
    throw error;
  }
};

// Eliminar una cesantía
export const deleteCesantia = async (idCesantia) => {
  try {
    const response = await axios.delete(`${CESANTIA_API_URL}/${idCesantia}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar la cesantía con ID ${idCesantia}:`, error);
    throw error;
  }
};

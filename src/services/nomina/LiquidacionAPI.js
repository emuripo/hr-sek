import axios from 'axios';

const API_URL = 'http://localhost:8086/api/Liquidacion';

// Crear una liquidación
export const crearLiquidacion = async (liquidacionData) => {
  try {
    const response = await axios.post(`${API_URL}`, liquidacionData); // POST /api/Liquidacion
    return response.data;
  } catch (error) {
    console.error('Error al crear la liquidación:', error);
    throw error;
  }
};

// Obtener una liquidación por ID
export const getLiquidacionById = async (idLiquidacion) => {
  try {
    const response = await axios.get(`${API_URL}/${idLiquidacion}`); // GET /api/Liquidacion/{idLiquidacion}
    return response.data;
  } catch (error) {
    console.error(`Error al obtener la liquidación con ID ${idLiquidacion}:`, error);
    throw error;
  }
};

// Obtener liquidaciones por empleado
export const getLiquidacionesPorEmpleado = async (idEmpleado) => {
  try {
    const response = await axios.get(`${API_URL}/empleado/${idEmpleado}`); // GET /api/Liquidacion/empleado/{idEmpleado}
    return response.data;
  } catch (error) {
    console.error(`Error al obtener liquidaciones para el empleado con ID ${idEmpleado}:`, error);
    throw error;
  }
};

// Actualizar una liquidación
export const actualizarLiquidacion = async (idLiquidacion, liquidacionData) => {
  try {
    const response = await axios.put(`${API_URL}/${idLiquidacion}`, liquidacionData); // PUT /api/Liquidacion/{idLiquidacion}
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar la liquidación con ID ${idLiquidacion}:`, error);
    throw error;
  }
};

// Eliminar una liquidación
export const eliminarLiquidacion = async (idLiquidacion) => {
  try {
    const response = await axios.delete(`${API_URL}/${idLiquidacion}`); // DELETE /api/Liquidacion/{idLiquidacion}
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar la liquidación con ID ${idLiquidacion}:`, error);
    throw error;
  }
};

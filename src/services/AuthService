import axios from 'axios';

const API_URL = 'http://localhost:8087/api/Auth/Users'; // La URL base de tu API de autenticación

// Servicio para hacer login
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/Login`, {
      username,
      password,
    });

    // Si el login es exitoso, devolver el token
    return response.data;
  } catch (error) {
    console.error('Error durante el login:', error);
    throw error; // Propagar el error para manejarlo en el componente
  }
};


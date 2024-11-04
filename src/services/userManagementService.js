// src/services/userManagementService.js
import axios from 'axios';

const API_URL = 'http://localhost:8087/api/Auth';

// Servicio para registrar un nuevo usuario
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/Register`, userData);
    return response.data;
  } catch (error) {
    console.error('Error durante el registro de usuario:', error);
    throw error;
  }
};

// Servicio para obtener la lista de roles
export const getRoles = async () => {
  try {
    const response = await axios.get(`${API_URL}/Roles`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los roles:', error);
    throw error;
  }
};

// Servicio para obtener la lista de usuarios
export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/Users`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener la lista de usuarios:', error);
    throw error;
  }
};

// Servicio para obtener un usuario específico por ID
export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/Users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el usuario con ID ${userId}:`, error);
    throw error;
  }
};

// Servicio para actualizar un usuario por ID
export const updateUser = async (userId, userData) => {
  try {
    const response = await axios.put(`${API_URL}/Users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el usuario con ID ${userId}:`, error);
    throw error;
  }
};

// Servicio para eliminar un usuario por ID
export const deleteUser = async (userId) => {
  try {
    await axios.delete(`${API_URL}/Users/${userId}`);
  } catch (error) {
    console.error(`Error al eliminar el usuario con ID ${userId}:`, error);
    throw error;
  }
};

import axios from 'axios';

const API_URL = 'http://localhost:8088/api/SolicitudVacaciones';

export async function obtenerResumenVacaciones(idEmpleado) {
    try {
        const token = localStorage.getItem('token'); // Obtener el token de autenticación
        const response = await axios.get(`${API_URL}/empleado/${idEmpleado}/vacaciones`, {
            headers: {
                Authorization: `Bearer ${token}`, // Agregar el token al header si es necesario
            },
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data);
        } else {
            throw new Error("Error al obtener el resumen de vacaciones");
        }
    }
}

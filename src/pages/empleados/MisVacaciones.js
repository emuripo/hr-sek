import React, { useEffect, useState, useContext } from 'react';
import { obtenerResumenVacaciones } from '../../services/solicitudesService/MisVacacionesService';
import AuthContext from '../../context/AuthContext';

const MisVacaciones = () => {
    const { idEmpleado } = useContext(AuthContext); 
    const [vacationData, setVacationData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVacationData = async () => {
            if (!idEmpleado) {
                setError("Empleado no encontrado. Por favor, inicie sesión de nuevo.");
                return;
            }

            try {
                const data = await obtenerResumenVacaciones(idEmpleado);
                setVacationData(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchVacationData();
    }, [idEmpleado]);

    if (error) {
        return <p>{error}</p>;
    }

    if (!vacationData) {
        return <p>Cargando datos de vacaciones...</p>;
    }

    return (
        <div>
            <h2>Mis Vacaciones</h2>
            <p><strong>Días Disponibles:</strong> {vacationData.diasDisponibles}</p>
            <p><strong>Días Gozados:</strong> {vacationData.diasGozados}</p>
            <h3>Historial de Solicitudes</h3>
            {vacationData.solicitudes && vacationData.solicitudes.length > 0 ? (
                <ul>
                    {vacationData.solicitudes.map((solicitud) => (
                        <li key={solicitud.id}>
                            <p><strong>Fecha Solicitud:</strong> {new Date(solicitud.fechaSolicitud).toLocaleDateString()}</p>
                            <p><strong>Días Solicitados:</strong> {solicitud.diasSolicitados}</p>
                            <p><strong>Estado:</strong> {solicitud.estado}</p>
                            {solicitud.estado === "Rechazada" && (
                                <p><strong>Motivo Rechazo:</strong> {solicitud.motivoRechazo}</p>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay solicitudes de vacaciones registradas.</p>
            )}
        </div>
    );
};

export default MisVacaciones;

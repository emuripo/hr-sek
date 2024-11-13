import React, { useEffect, useState, useContext } from 'react';
import { obtenerResumenVacaciones } from '../../services/solicitudesService/MisVacacionesService';
import AuthContext from '../../context/AuthContext';

const MisVacaciones = () => {
    const { idEmpleado } = useContext(AuthContext);
    const [vacationData, setVacationData] = useState(null);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;  // Número de solicitudes por página

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

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    if (error) {
        return <p style={styles.error}>{error}</p>;
    }

    if (!vacationData) {
        return <p style={styles.loading}>Cargando datos de vacaciones...</p>;
    }

    // Calcular solicitudes a mostrar en la página actual
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentSolicitudes = vacationData.solicitudes.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(vacationData.solicitudes.length / itemsPerPage);

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Mis Vacaciones</h2>
            <div style={styles.vacationInfo}>
                <p><strong>Días Disponibles:</strong> {vacationData.diasDisponibles}</p>
                <p><strong>Días Gozados:</strong> {vacationData.diasGozados}</p>
            </div>
            <h3 style={styles.subtitle}>Historial de Solicitudes</h3>
            {currentSolicitudes && currentSolicitudes.length > 0 ? (
                <ul style={styles.solicitudesList}>
                    {currentSolicitudes.map((solicitud) => (
                        <li key={solicitud.id} style={styles.solicitudCard}>
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
                <p style={styles.noSolicitudes}>No hay solicitudes de vacaciones registradas.</p>
            )}

            {/* Controles de Paginación */}
            <div style={styles.pagination}>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        style={{
                            ...styles.pageButton,
                            ...(currentPage === index + 1 ? styles.pageButtonActive : styles.pageButtonInactive)
                        }}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '700px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif'
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: '20px'
    },
    subtitle: {
        fontSize: '20px',
        color: '#555',
        marginTop: '20px'
    },
    vacationInfo: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#e3f2fd',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '15px',
        fontSize: '16px',
        color: '#333'
    },
    solicitudesList: {
        listStyleType: 'none',
        padding: '0',
    },
    solicitudCard: {
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '10px',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)'
    },
    error: {
        color: 'red',
        textAlign: 'center',
        fontSize: '18px',
        padding: '10px'
    },
    loading: {
        color: '#777',
        textAlign: 'center',
        fontSize: '18px',
        padding: '10px'
    },
    noSolicitudes: {
        textAlign: 'center',
        fontSize: '16px',
        color: '#777'
    },
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '20px',
    },
    pageButton: {
        border: 'none',
        padding: '8px 12px',
        margin: '0 5px',
        cursor: 'pointer',
        borderRadius: '5px',
        fontSize: '14px',
    },
    pageButtonActive: {
        backgroundColor: '#F0AF00', // Botón activo en dorado
        color: '#fff',
    },
    pageButtonInactive: {
        backgroundColor: '#f0f0f0', // Botón inactivo en gris claro
        color: '#333',
    }
};

export default MisVacaciones;

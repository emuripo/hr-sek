import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import {
  getSaldoHorasExtraPorEmpleado,
  getSolicitudesHorasExtraPorEmpleado,
} from '../../services/solicitudesService/SolicitudHorasService';

const MisHorasExtra = () => {
  const { idEmpleado } = useContext(AuthContext);
  const [saldoHorasExtra, setSaldoHorasExtra] = useState(null);
  const [solicitudesHorasExtra, setSolicitudesHorasExtra] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Número de solicitudes por página

  useEffect(() => {
    const fetchHorasExtraData = async () => {
      if (!idEmpleado) {
        setError("Empleado no encontrado. Por favor, inicie sesión de nuevo.");
        return;
      }

      try {
        const saldo = await getSaldoHorasExtraPorEmpleado(idEmpleado);
        console.log("Saldo de Horas Extra:", saldo); // Para depuración
        setSaldoHorasExtra(saldo);

        const solicitudes = await getSolicitudesHorasExtraPorEmpleado(idEmpleado);
        setSolicitudesHorasExtra(solicitudes);
      } catch (err) {
        setError(err.response?.data || 'Error al cargar los datos de horas extra.');
      }
    };

    fetchHorasExtraData();
  }, [idEmpleado]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (error) {
    return <p style={styles.error}>{error}</p>;
  }

  if (saldoHorasExtra === null || solicitudesHorasExtra.length === 0) {
    return <p style={styles.loading}>Cargando datos de horas extra...</p>;
  }

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSolicitudes = solicitudesHorasExtra.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(solicitudesHorasExtra.length / itemsPerPage);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Mis Horas Extra</h2>
      <div style={styles.extraInfo}>
        <p><strong>Horas Trabajadas Hoy:</strong> {saldoHorasExtra.horasExtrasTrabajadasHoy}</p>
        <p><strong>Horas Trabajadas Semana:</strong> {saldoHorasExtra.horasExtrasTrabajadasSemana}</p>
        <p><strong>Horas Trabajadas Mes:</strong> {saldoHorasExtra.horasExtrasTrabajadasMes}</p>
      </div>
      <h3 style={styles.subtitle}>Historial de Solicitudes</h3>
      {currentSolicitudes.length > 0 ? (
        <ul style={styles.solicitudesList}>
          {currentSolicitudes.map((solicitud) => (
            <li key={solicitud.id} style={styles.solicitudCard}>
              <p><strong>Fecha Trabajo:</strong> {new Date(solicitud.fechaTrabajo).toLocaleDateString()}</p>
              <p><strong>Horas Solicitadas:</strong> {solicitud.cantidadHoras}</p>
              <p><strong>Estado:</strong> {solicitud.estado}</p>
              {solicitud.estado === "Rechazada" && (
                <p><strong>Motivo Rechazo:</strong> {solicitud.motivoRechazo}</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p style={styles.noSolicitudes}>No hay solicitudes de horas extra registradas.</p>
      )}

      {/* Controles de Paginación */}
      <div style={styles.pagination}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            style={{
              ...styles.pageButton,
              ...(currentPage === index + 1 ? styles.pageButtonActive : styles.pageButtonInactive),
            }}
            aria-label={`Página ${index + 1}`}
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
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: '20px',
  },
  subtitle: {
    fontSize: '20px',
    color: '#555',
    marginTop: '20px',
  },
  extraInfo: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#e3f2fd',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '15px',
    fontSize: '16px',
    color: '#333',
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
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    fontSize: '18px',
    padding: '10px',
  },
  loading: {
    color: '#777',
    textAlign: 'center',
    fontSize: '18px',
    padding: '10px',
  },
  noSolicitudes: {
    textAlign: 'center',
    fontSize: '16px',
    color: '#777',
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
    transition: 'background-color 0.3s, color 0.3s',
  },
  pageButtonActive: {
    backgroundColor: '#F0AF00',
    color: '#fff',
  },
  pageButtonInactive: {
    backgroundColor: '#f0f0f0',
    color: '#333',
  },
};

export default MisHorasExtra;

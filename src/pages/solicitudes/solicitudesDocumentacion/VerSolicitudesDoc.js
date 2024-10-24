import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography } from '@mui/material';
import { getSolicitudesDocumentos } from '../../../services/solicitudesService/SolicitudDocumento';

function VerSolicitudesDoc() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      setLoading(true);
      try {
        const data = await getSolicitudesDocumentos();
        setSolicitudes(data);
      } catch (error) {
        console.error('Error al cargar solicitudes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitudes();
  }, []);

  return (
    <div>
      <Typography variant="h4">Solicitudes de Documentos</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Solicitante</TableCell>
                <TableCell>Tipo de Documento</TableCell>
                <TableCell>Fecha de Solicitud</TableCell>
                <TableCell>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {solicitudes.map((solicitud) => (
                <TableRow key={solicitud.id}>
                  <TableCell>{solicitud.nombreSolicitante}</TableCell>
                  <TableCell>{solicitud.tipoDocumento}</TableCell>
                  <TableCell>{new Date(solicitud.fechaSolicitud).toLocaleDateString()}</TableCell>
                  <TableCell>{solicitud.estado ? 'Aprobada' : 'Pendiente'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}

export default VerSolicitudesDoc;

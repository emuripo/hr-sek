import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography, TablePagination, TextField, IconButton, Button, Dialog, DialogTitle, DialogContent } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getSolicitudesDocumentos } from '../../../services/solicitudes/SolicitudDocumento'; // Ajustar según tu ruta de servicios

function VerSolicitudesDoc() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filter, setFilter] = useState('');
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);

  // Función para obtener las solicitudes de documentación desde la API
  const fetchSolicitudes = async () => {
    setLoading(true);
    try {
      const solicitudesData = await getSolicitudesDocumentos();
      setSolicitudes(solicitudesData);
    } catch (error) {
      console.error('Error al obtener las solicitudes de documentación:', error);
    } finally {
      setLoading(false);
    }
  };

  // Llamar a fetchSolicitudes al montar el componente
  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleOpenViewDialog = (solicitud) => {
    setSelectedSolicitud(solicitud);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setSelectedSolicitud(null);
  };

  const filteredSolicitudes = solicitudes.filter((solicitud) =>
    solicitud.motivo.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Gestión de Solicitudes de Documentos
      </Typography>

      <TextField
        label="Filtrar por motivo"
        variant="outlined"
        value={filter}
        onChange={handleFilterChange}
        sx={{ marginBottom: 2 }}
      />

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="Tabla de solicitudes de documentos">
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ backgroundColor: '#263060', color: '#fff', fontWeight: 'bold' }}>ID Solicitud</TableCell>
                  <TableCell align="center" sx={{ backgroundColor: '#263060', color: '#fff', fontWeight: 'bold' }}>Motivo</TableCell>
                  <TableCell align="center" sx={{ backgroundColor: '#263060', color: '#fff', fontWeight: 'bold' }}>Fecha Solicitud</TableCell>
                  <TableCell align="center" sx={{ backgroundColor: '#263060', color: '#fff', fontWeight: 'bold' }}>Estado</TableCell>
                  <TableCell align="center" sx={{ backgroundColor: '#263060', color: '#fff', fontWeight: 'bold' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSolicitudes.length > 0 ? (
                  filteredSolicitudes
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((solicitud) => (
                      <TableRow key={solicitud.idSolicitudDocumento}>
                        <TableCell align="center">{solicitud.idSolicitudDocumento}</TableCell>
                        <TableCell align="center">{solicitud.motivo}</TableCell>
                        <TableCell align="center">{new Date(solicitud.fechaSolicitud).toLocaleDateString()}</TableCell>
                        <TableCell align="center">{solicitud.estaAprobada ? 'Aprobada' : 'Pendiente'}</TableCell>
                        <TableCell align="center">
                          <IconButton color="primary" onClick={() => handleOpenViewDialog(solicitud)}>
                            <VisibilityIcon sx={{ color: '#f0af00' }} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No hay solicitudes de documentos disponibles.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredSolicitudes.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por página"
          />
        </>
      )}

      {/* Diálogo para ver detalles de la solicitud */}
      <Dialog open={openViewDialog} onClose={handleCloseViewDialog}>
        <DialogTitle>Detalles de la Solicitud de Documento</DialogTitle>
        <DialogContent>
          {selectedSolicitud && (
            <div>
              <p><strong>ID Solicitud:</strong> {selectedSolicitud.idSolicitudDocumento}</p>
              <p><strong>Motivo:</strong> {selectedSolicitud.motivo}</p>
              <p><strong>Fecha de Solicitud:</strong> {new Date(selectedSolicitud.fechaSolicitud).toLocaleDateString()}</p>
              <p><strong>Estado:</strong> {selectedSolicitud.estaAprobada ? 'Aprobada' : 'Pendiente'}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default VerSolicitudesDoc;

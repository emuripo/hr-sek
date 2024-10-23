import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography, TablePagination, TextField, IconButton, Dialog, DialogTitle, DialogContent } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit'; 
import { getSolicitudesDocumentos } from '../../../services/solicitudesService/SolicitudDocumento';

function VerSolicitudesDoc() {
  const [solicitudes, setSolicitudes] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filter, setFilter] = useState('');
  const [selectedSolicitud, setSelectedSolicitud] = useState(null); 
  const [openViewDialog, setOpenViewDialog] = useState(false); 

  // Función para obtener las solicitudes de documentos desde la API
  const fetchSolicitudes = async () => {
    setLoading(true);
    try {
      const solicitudesData = await getSolicitudesDocumentos();
      
      // Aquí asignamos directamente las solicitudes ya que es un array
      setSolicitudes(solicitudesData);
      
      // Imprimir los datos que recibes para inspeccionar la estructura
      console.log('Datos recibidos de la API:', solicitudesData);
    } catch (error) {
      console.error('Error al obtener las solicitudes de documentos:', error);
      setSolicitudes([]); 
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

  // Filtrado de solicitudes con protección para campos indefinidos
  const filteredSolicitudes = solicitudes.filter((solicitud) => {
    const tipoDocumento = solicitud?.tipoDocumento || ''; 

    return (
      tipoDocumento.toLowerCase().includes(filter.toLowerCase())
    );
  });

  return (
    <div>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Solicitudes de Documentos
      </Typography>

      <TextField
        label="Filtrar por documento"
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
                  <TableCell align="center" sx={{ backgroundColor: '#263060', color: '#fff', fontWeight: 'bold' }}>Tipo de Documento</TableCell>
                  <TableCell align="center" sx={{ backgroundColor: '#263060', color: '#fff', fontWeight: 'bold' }}>Fecha de Solicitud</TableCell>
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
                        <TableCell align="center">{solicitud.tipoDocumento || 'No especificado'}</TableCell>
                        <TableCell align="center">{new Date(solicitud.fechaSolicitud).toLocaleDateString()}</TableCell>
                        <TableCell align="center">{solicitud.estaAprobada ? 'Aprobada' : 'No aprobada'}</TableCell>
                        <TableCell align="center">
                          <IconButton color="primary" onClick={() => handleOpenViewDialog(solicitud)}>
                            <VisibilityIcon sx={{ color: '#f0af00' }} />
                          </IconButton>
                          <IconButton color="primary">
                            <EditIcon sx={{ color: '#263060' }} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No hay solicitudes disponibles.</TableCell>
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
        <DialogTitle>Detalles de la Solicitud</DialogTitle>
        <DialogContent>
          {selectedSolicitud && (
            <div>
              <p><strong>ID Solicitud:</strong> {selectedSolicitud.idSolicitudDocumento}</p>
              <p><strong>Tipo de Documento:</strong> {selectedSolicitud.tipoDocumento || 'No especificado'}</p>
              <p><strong>Fecha de Solicitud:</strong> {new Date(selectedSolicitud.fechaSolicitud).toLocaleDateString()}</p>
              <p><strong>Estado:</strong> {selectedSolicitud.estaAprobada ? 'Aprobada' : 'No aprobada'}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default VerSolicitudesDoc;

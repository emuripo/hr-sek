import React, { useEffect, useState } from "react";
import { getLogs } from "../../services/LogService";
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Paper, Typography, CircularProgress, Box, TablePagination } from "@mui/material";

const LogsView = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Función para cargar los logs
  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLogs();
      setLogs(data);
    } catch (err) {
      console.error("Error al cargar los logs:", err);
      setError("Error al cargar los logs.");
    } finally {
      setLoading(false);
    }
  };

  // Cargar los logs al montar el componente
  useEffect(() => {
    fetchLogs();
  }, []);

  // Maneja el cambio de página
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Maneja el cambio de filas por página
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Descargar los logs en formato .txt
  const downloadLogs = () => {
    const logContent = logs
      .map(
        (log) =>
          `Evento: ${log.eventName}\nDetalles: ${log.eventDetails}\nUsuario: ${log.username}\nRol: ${log.userRole}\nFecha: ${new Date(log.timestamp).toLocaleString()}\n\n`
      )
      .join("\n");
    const blob = new Blob([logContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "logs.txt";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 1200, margin: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Logs del Sistema
      </Typography>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Button variant="contained" color="primary" onClick={fetchLogs} disabled={loading}>
          {loading ? "Cargando..." : "Recargar Logs"}
        </Button>
        <Button variant="contained" color="secondary" onClick={downloadLogs} disabled={logs.length === 0}>
          Descargar Logs
        </Button>
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" textAlign="center">
          {error}
        </Typography>
      ) : logs.length === 0 ? (
        <Typography textAlign="center">No hay logs registrados.</Typography>
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Evento</strong></TableCell>
                <TableCell><strong>Detalles</strong></TableCell>
                <TableCell><strong>Usuario</strong></TableCell>
                <TableCell><strong>Rol</strong></TableCell>
                <TableCell><strong>Fecha</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((log, index) => (
                  <TableRow key={index}>
                    <TableCell>{log.eventName}</TableCell>
                    <TableCell>{log.eventDetails}</TableCell>
                    <TableCell>{log.username}</TableCell>
                    <TableCell>{log.userRole}</TableCell>
                    <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={logs.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </>
      )}
    </Paper>
  );
};

export default LogsView;

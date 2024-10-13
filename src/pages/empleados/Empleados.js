import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography, TablePagination, TextField, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getEmpleados } from '../../services/api'; // Asegúrate de tener esta función en api.js
import FormularioEmpleado from './FormularioEmpleado';

function Empleados() {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filter, setFilter] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const empleadosData = await getEmpleados();
        setEmpleados(empleadosData);
      } catch (error) {
        console.error('Error al obtener los empleados:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
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

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const filteredEmpleados = empleados.filter((empleado) =>
    empleado.nombre.toLowerCase().includes(filter.toLowerCase()) ||
    empleado.apellidoUno.toLowerCase().includes(filter.toLowerCase()) ||
    empleado.apellidoDos.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Gestión de Empleados
      </Typography>

      <TextField
        label="Filtrar por nombre o apellidos"
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
            <Table sx={{ minWidth: 650 }} aria-label="Tabla de empleados">
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Cédula</TableCell>
                  <TableCell align="center" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Nombre Completo</TableCell>
                  <TableCell align="center" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Correo Electrónico</TableCell>
                  {/* Otras celdas */}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEmpleados.length > 0 ? (
                  filteredEmpleados
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((empleado) => (
                      <TableRow key={empleado.idEmpleado}>
                        <TableCell align="center">{empleado.cedula}</TableCell>
                        <TableCell align="center">{`${empleado.nombre} ${empleado.apellidoUno} ${empleado.apellidoDos}`}</TableCell>
                        <TableCell align="center">{empleado.correoElectronico}</TableCell>
                        {/* Otras celdas */}
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={12} align="center">No hay empleados disponibles.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredEmpleados.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por página"
          />
        </>
      )}

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleOpenDialog}
      >
        <AddIcon />
      </Fab>

      <FormularioEmpleado open={openDialog} onClose={handleCloseDialog} setEmpleados={setEmpleados} empleados={empleados} />
    </div>
  );
}

export default Empleados;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, CircularProgress, Typography,
  TablePagination, TextField
} from '@mui/material';  // Importamos componentes de Material UI

function Empleados() {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true); // Indicador de carga
  const [page, setPage] = useState(0); // Estado de la página actual
  const [rowsPerPage, setRowsPerPage] = useState(5); // Estado para filas por página
  const [filter, setFilter] = useState(''); // Estado del filtro

  useEffect(() => {
    async function fetchEmpleados() {
      try {
        const response = await axios.get('http://localhost:8085/api/Empleado');
        console.log('Datos de empleados:', response.data);  // Verificar estructura de los datos
        if (Array.isArray(response.data)) {
          setEmpleados(response.data);  // Asignar directamente la lista de empleados
        } else {
          console.error('Estructura de datos inesperada:', response.data);
        }
      } catch (error) {
        console.error('Error al obtener los empleados:', error);
      } finally {
        setLoading(false); // Dejar de cargar
      }
    }

    fetchEmpleados();
  }, []);

  // Controlador del cambio de página
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Controlador del cambio en el número de filas por página
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Controlador del cambio de filtro
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  // Filtrar empleados basado en el valor del filtro
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
        <CircularProgress />  // Indicador de carga
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="Tabla de empleados">
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Cédula</TableCell>
                  <TableCell align="center" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Nombre Completo</TableCell>
                  <TableCell align="center" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Correo Electrónico</TableCell>
                  <TableCell align="center" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Teléfono</TableCell>
                  <TableCell align="center" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Provincia</TableCell>
                  <TableCell align="center" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Cantón</TableCell>
                  <TableCell align="center" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Distrito</TableCell>
                  <TableCell align="center" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Dirección Exacta</TableCell>
                  <TableCell align="center" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Salario Base</TableCell>
                  <TableCell align="center" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Fecha Inicio Contrato</TableCell>
                  <TableCell align="center" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Fecha Fin Contrato</TableCell>
                  <TableCell align="center" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEmpleados.length > 0 ? (
                  filteredEmpleados
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Paginación
                    .map((empleado) => (
                      <TableRow key={empleado.idEmpleado}>
                        <TableCell align="center">{empleado.cedula}</TableCell>
                        <TableCell align="center">{`${empleado.nombre} ${empleado.apellidoUno} ${empleado.apellidoDos}`}</TableCell>
                        <TableCell align="center">{empleado.correoElectronico}</TableCell>
                        <TableCell align="center">{empleado.numeroCelular}</TableCell>
                        <TableCell align="center">{empleado.direccionFuncionario?.provincia || 'Sin provincia'}</TableCell>
                        <TableCell align="center">{empleado.direccionFuncionario?.canton || 'Sin cantón'}</TableCell>
                        <TableCell align="center">{empleado.direccionFuncionario?.distrito || 'Sin distrito'}</TableCell>
                        <TableCell align="center">{empleado.direccionFuncionario?.direccionExacta || 'Sin dirección exacta'}</TableCell>
                        <TableCell align="center">{empleado.infoContratoFuncionario?.salarioBase?.toFixed(2) || 'Sin salario'}</TableCell>
                        <TableCell align="center">{empleado.infoContratoFuncionario?.fechaContratacion || 'Sin fecha de inicio'}</TableCell>
                        <TableCell align="center">{empleado.infoContratoFuncionario?.fechaFinContrato || 'Indefinido'}</TableCell>
                        <TableCell align="center">{empleado.empleadoActivo ? 'Activo' : 'Inactivo'}</TableCell>
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

          {/* Paginación */}
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
    </div>
  );
}

export default Empleados;

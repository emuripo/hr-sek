import React, { useState, useEffect } from 'react';
import {
  getAllSolicitudesHorasExtra,
} from '../../services/solicitudesService/SolicitudHorasService';
import { getEmpleados } from '../../services/FuncionarioAPI'; // Asegúrate de tener esta función
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';

const HorasExtraEmpleados = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estados para paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Estados para filtrado
  const [searchEmpleado, setSearchEmpleado] = useState('');
  const [filterEstado, setFilterEstado] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [solicitudesData, empleadosData] = await Promise.all([
          getAllSolicitudesHorasExtra(),
          getEmpleados(),
        ]);
        setSolicitudes(solicitudesData);
        setEmpleados(empleadosData);
        setFilteredSolicitudes(solicitudesData);
      } catch (err) {
        setError(err.response?.data || 'Error al cargar los datos.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Manejo de cambios en la paginación
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Función para obtener el nombre completo del empleado
  const getNombreEmpleado = (idEmpleado) => {
    const empleado = empleados.find((emp) => emp.idEmpleado === idEmpleado);
    return empleado
      ? `${empleado.nombre} ${empleado.apellidoUno} ${empleado.apellidoDos}`
      : 'Empleado no encontrado';
  };

  // Manejo de filtrado
  const handleSearchEmpleado = (event) => {
    setSearchEmpleado(event.target.value);
    applyFilters(event.target.value, filterEstado);
  };

  const handleFilterEstado = (event) => {
    setFilterEstado(event.target.value);
    applyFilters(searchEmpleado, event.target.value);
  };

  const applyFilters = (nombreEmpleado, estado) => {
    let filtered = solicitudes;

    if (nombreEmpleado) {
      filtered = filtered.filter((solicitud) => {
        const nombreCompleto = getNombreEmpleado(solicitud.idEmpleado).toLowerCase();
        return nombreCompleto.includes(nombreEmpleado.toLowerCase());
      });
    }

    if (estado) {
      filtered = filtered.filter((solicitud) => solicitud.estado === estado);
    }

    setFilteredSolicitudes(filtered);
    setPage(0); // Reiniciar a la primera página después de filtrar
  };

  if (loading) {
    return <p style={styles.loading}>Cargando solicitudes de horas extra...</p>;
  }

  if (error) {
    return <p style={styles.error}>{error}</p>;
  }

  return (
    <div style={styles.container}>
      <Typography variant="h4" gutterBottom style={styles.title}>
        Solicitudes de Horas Extra de Empleados
      </Typography>

      {/* Controles de filtrado */}
      <div style={styles.filters}>
        <TextField
          label="Buscar por Nombre de Empleado"
          variant="outlined"
          value={searchEmpleado}
          onChange={handleSearchEmpleado}
          style={styles.filterItem}
        />

        <FormControl variant="outlined" style={styles.filterItem}>
          <InputLabel id="estado-label">Estado</InputLabel>
          <Select
            labelId="estado-label"
            value={filterEstado}
            onChange={handleFilterEstado}
            label="Estado"
          >
            <MenuItem value="">
              <em>Todos</em>
            </MenuItem>
            <MenuItem value="Pendiente">Pendiente</MenuItem>
            <MenuItem value="Aprobada">Aprobada</MenuItem>
            <MenuItem value="Rechazada">Rechazada</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Tabla de solicitudes */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Solicitud</TableCell>
              <TableCell>Empleado</TableCell>
              <TableCell>Fecha de Trabajo</TableCell>
              <TableCell>Horas Solicitadas</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha Solicitud</TableCell>
              <TableCell>Fecha Cambio Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSolicitudes
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((solicitud) => (
                <TableRow key={solicitud.id}>
                  <TableCell>{solicitud.id}</TableCell>
                  <TableCell>{getNombreEmpleado(solicitud.idEmpleado)}</TableCell>
                  <TableCell>
                    {new Date(solicitud.fechaTrabajo).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{solicitud.cantidadHoras}</TableCell>
                  <TableCell>{solicitud.estado}</TableCell>
                  <TableCell>
                    {new Date(solicitud.fechaSolicitud).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {solicitud.fechaCambioEstado
                      ? new Date(solicitud.fechaCambioEstado).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        {/* Paginación */}
        <TablePagination
          component="div"
          count={filteredSolicitudes.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          labelRowsPerPage="Filas por página:"
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  loading: {
    textAlign: 'center',
    fontSize: '18px',
    padding: '10px',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    fontSize: '18px',
    padding: '10px',
  },
  filters: {
    display: 'flex',
    marginBottom: '20px',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterItem: {
    margin: '0 10px',
    minWidth: '200px',
  },
};

export default HorasExtraEmpleados;

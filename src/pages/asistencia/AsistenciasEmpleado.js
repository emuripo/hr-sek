import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/lab';
import AsistenciaAPI from '../../services/asistencia/AsistenciaAPI';
import { getEmpleados } from '../../services/FuncionarioAPI';

const AsistenciasEmpleado = () => {
  const [idEmpleado, setIdEmpleado] = useState('');
  const [asistencias, setAsistencias] = useState([]);
  const [filteredAsistencias, setFilteredAsistencias] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const empleadosData = await getEmpleados();
        setEmpleados(empleadosData);
      } catch (error) {
        setError('Error al cargar la lista de empleados');
      }
    };

    fetchEmpleados();
  }, []);

  const handleBuscarAsistencias = async () => {
    setError('');
    if (!idEmpleado) {
      setError('Por favor seleccione un empleado');
      return;
    }

    try {
      const data = await AsistenciaAPI.obtenerAsistenciasPorEmpleado(idEmpleado);
      setAsistencias(data);
      setFilteredAsistencias(data);
    } catch (error) {
      setError('Error al obtener las asistencias. Verifique el empleado seleccionado.');
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const filtered = asistencias.filter((asistencia) => 
      new Date(asistencia.fecha).toLocaleDateString() === date.toLocaleDateString()
    );
    setFilteredAsistencias(filtered);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>Consultar Asistencias por Empleado</Typography>
      
      <FormControl fullWidth style={{ marginBottom: '20px' }}>
        <InputLabel>Seleccione un Empleado</InputLabel>
        <Select
          value={idEmpleado}
          onChange={(e) => setIdEmpleado(e.target.value)}
          label="Seleccione un Empleado"
        >
          {empleados.map((empleado) => (
            <MenuItem key={empleado.idEmpleado} value={empleado.idEmpleado}>
              {`${empleado.nombre} ${empleado.apellidoUno} ${empleado.apellidoDos || ''}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <DatePicker
        label="Filtrar por Fecha"
        value={selectedDate}
        onChange={handleDateChange}
        renderInput={(params) => <TextField {...params} fullWidth />}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleBuscarAsistencias}
        style={{ marginTop: '20px' }}
      >
        Buscar Asistencias
      </Button>

      {error && <Typography color="error">{error}</Typography>}

      <TableContainer style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Hora</TableCell>
              <TableCell>Tipo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAsistencias
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((asistencia) => (
                <TableRow key={asistencia.idAsistencia}>
                  <TableCell>{new Date(asistencia.fecha).toLocaleDateString()}</TableCell>
                  <TableCell>{asistencia.hora}</TableCell>
                  <TableCell>{asistencia.tipo}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredAsistencias.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {filteredAsistencias.length === 0 && !error && (
        <Typography variant="body1">No hay asistencias para mostrar.</Typography>
      )}
    </div>
  );
};

export default AsistenciasEmpleado;

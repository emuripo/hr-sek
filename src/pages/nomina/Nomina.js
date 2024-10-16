import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  CircularProgress, Typography, TablePagination, TextField, IconButton,
  Button, Dialog, DialogTitle, DialogContent
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getNominas, deleteNomina } from '../../services/NominaAPI';
import { getEmpleados } from '../../services/FuncionarioAPI';
import CrearNomina from './CrearNomina';
import ActualizarNomina from './ActualizarNomina';

function Nominas() {
  const [nominas, setNominas] = useState([]);
  const [empleados, setEmpleados] = useState([]); // Para mapear idEmpleado a nombre
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filter, setFilter] = useState('');
  const [openCrearDialog, setOpenCrearDialog] = useState(false);
  const [openVerDialog, setOpenVerDialog] = useState(false);
  const [selectedNomina, setSelectedNomina] = useState(null);
  const [openEditarDialog, setOpenEditarDialog] = useState(false);
  const [nominaParaEditar, setNominaParaEditar] = useState(null);

  // Función para obtener nóminas y empleados
  const fetchDatos = async () => {
    setLoading(true);
    try {
      const [nominasData, empleadosData] = await Promise.all([getNominas(), getEmpleados()]);
      setNominas(nominasData);
      setEmpleados(empleadosData);
    } catch (error) {
      console.error('Error al obtener datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Llamar a fetchDatos al montar el componente
  useEffect(() => {
    fetchDatos();
  }, []);

  // Funciones para manejar paginación
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Función para manejar el filtrado
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  // Funciones para manejar diálogos
  const handleOpenCrearDialog = () => {
    setOpenCrearDialog(true);
  };

  const handleCloseCrearDialog = () => {
    setOpenCrearDialog(false);
  };

  const handleOpenVerDialog = (nomina) => {
    setSelectedNomina(nomina);
    setOpenVerDialog(true);
  };

  const handleCloseVerDialog = () => {
    setOpenVerDialog(false);
    setSelectedNomina(null);
  };

  const handleOpenEditarDialog = (nomina) => {
    setNominaParaEditar(nomina);
    setOpenEditarDialog(true);
  };

  const handleCloseEditarDialog = () => {
    setOpenEditarDialog(false);
    setNominaParaEditar(null);
  };

  // Función para manejar la eliminación de una nómina
  const handleDeleteNomina = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta nómina?')) {
      try {
        await deleteNomina(id);
        // Refrescar datos después de la eliminación
        fetchDatos();
      } catch (error) {
        console.error('Error al eliminar la nómina:', error);
      }
    }
  };

  // Filtrar nóminas por nombre de empleado
  const filteredNominas = nominas.filter((nomina) => {
    const empleado = empleados.find(emp => emp.idEmpleado === nomina.idEmpleado);
    const nombreCompleto = empleado ? `${empleado.nombre} ${empleado.apellidoUno} ${empleado.apellidoDos}` : '';
    return nombreCompleto.toLowerCase().includes(filter.toLowerCase());
  });

  // Función para obtener el nombre del empleado por id
  const getNombreEmpleado = (idEmpleado) => {
    const empleado = empleados.find(emp => emp.idEmpleado === idEmpleado);
    return empleado ? `${empleado.nombre} ${empleado.apellidoUno} ${empleado.apellidoDos}` : 'Empleado Desconocido';
  };

  return (
    <div>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Gestión de Nóminas
      </Typography>

      <TextField
        label="Filtrar por nombre de empleado"
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
            <Table sx={{ minWidth: 650 }} aria-label="Tabla de nóminas">
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ backgroundColor: '#263060', color: '#fff', fontWeight: 'bold' }}>ID Nómina</TableCell>
                  <TableCell align="center" sx={{ backgroundColor: '#263060', color: '#fff', fontWeight: 'bold' }}>Empleado</TableCell>
                  <TableCell align="center" sx={{ backgroundColor: '#263060', color: '#fff', fontWeight: 'bold' }}>Salario Base</TableCell>
                  <TableCell align="center" sx={{ backgroundColor: '#263060', color: '#fff', fontWeight: 'bold' }}>Salario Bruto</TableCell>
                  <TableCell align="center" sx={{ backgroundColor: '#263060', color: '#fff', fontWeight: 'bold' }}>Salario Neto</TableCell>
                  <TableCell align="center" sx={{ backgroundColor: '#263060', color: '#fff', fontWeight: 'bold' }}>Fecha Generación</TableCell>
                  <TableCell align="center" sx={{ backgroundColor: '#263060', color: '#fff', fontWeight: 'bold' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredNominas.length > 0 ? (
                  filteredNominas
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((nomina) => (
                      <TableRow key={nomina.id}>
                        <TableCell align="center">{nomina.id}</TableCell>
                        <TableCell align="center">{getNombreEmpleado(nomina.idEmpleado)}</TableCell>
                        <TableCell align="center">${nomina.salarioBase.toFixed(2)}</TableCell>
                        <TableCell align="center">${nomina.salarioBruto.toFixed(2)}</TableCell>
                        <TableCell align="center">${nomina.salarioNeto.toFixed(2)}</TableCell>
                        <TableCell align="center">{new Date(nomina.fechaGeneracion).toLocaleDateString()}</TableCell>
                        <TableCell align="center">
                          <IconButton color="primary" onClick={() => handleOpenVerDialog(nomina)}>
                            <VisibilityIcon sx={{ color: '#f0af00' }} />
                          </IconButton>
                          <IconButton color="primary" onClick={() => handleOpenEditarDialog(nomina)}>
                            <EditIcon sx={{ color: '#263060' }} />
                          </IconButton>
                          <IconButton color="secondary" onClick={() => handleDeleteNomina(nomina.id)}>
                            <DeleteIcon sx={{ color: '#d32f2f' }} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">No hay nóminas disponibles.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredNominas.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por página"
          />
        </>
      )}

      <Button
        variant="contained"
        color="primary"
        sx={{
          backgroundColor: '#f0af00',
          color: '#fff',
          fontWeight: 'bold',
          borderRadius: '50px',
          position: 'fixed',
          bottom: 16,
          right: 16
        }}
        onClick={handleOpenCrearDialog}
        startIcon={<AddIcon />}
      >
        Agregar Nómina
      </Button>

      <CrearNomina
        open={openCrearDialog}
        onClose={handleCloseCrearDialog}
        setNominas={setNominas}
        nominas={nominas}
        refetchDatos={fetchDatos}
      />

      {/* Diálogo para ver detalles de la nómina */}
      <Dialog open={openVerDialog} onClose={handleCloseVerDialog}>
        <DialogTitle>Detalles de la Nómina</DialogTitle>
        <DialogContent>
          {selectedNomina && (
            <div>
              <p><strong>ID Nómina:</strong> {selectedNomina.id}</p>
              <p><strong>Empleado:</strong> {getNombreEmpleado(selectedNomina.idEmpleado)}</p>
              <p><strong>Salario Base:</strong> ${selectedNomina.salarioBase.toFixed(2)}</p>
              <p><strong>Salario Bruto:</strong> ${selectedNomina.salarioBruto.toFixed(2)}</p>
              <p><strong>Salario Neto:</strong> ${selectedNomina.salarioNeto.toFixed(2)}</p>
              <p><strong>Fecha Generación:</strong> {new Date(selectedNomina.fechaGeneracion).toLocaleDateString()}</p>
              <p><strong>Deducciones:</strong></p>
              <ul>
                {selectedNomina.deducciones.map((deduccion, index) => (
                  <li key={index}>{deduccion.tipoDeduccion}: ${deduccion.monto.toFixed(2)}</li>
                ))}
              </ul>
              <p><strong>Bonificaciones:</strong></p>
              <ul>
                {selectedNomina.bonificaciones.map((bonificacion, index) => (
                  <li key={index}>{bonificacion.tipoBonificacion}: ${bonificacion.monto.toFixed(2)}</li>
                ))}
              </ul>
              <p><strong>Horas Extras:</strong></p>
              <ul>
                {selectedNomina.horasExtras.map((horaExtra, index) => (
                  <li key={index}>{horaExtra.cantidadHoras} horas: ${horaExtra.montoHorasExtra.toFixed(2)}</li>
                ))}
              </ul>
              <p><strong>Vacaciones:</strong></p>
              <ul>
                {selectedNomina.vacaciones.map((vacacion, index) => (
                  <li key={index}>{new Date(vacacion.fechaInicio).toLocaleDateString()} - {new Date(vacacion.fechaFin).toLocaleDateString()}</li>
                ))}
              </ul>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo para editar nómina */}
      {nominaParaEditar && (
        <ActualizarNomina
          open={openEditarDialog}
          onClose={handleCloseEditarDialog}
          nominaSeleccionada={nominaParaEditar}
          setNominas={setNominas}
          nominas={nominas}
          refetchDatos={fetchDatos}
          empleados={empleados}
        />
      )}
    </div>
  );
}

export default Nominas;

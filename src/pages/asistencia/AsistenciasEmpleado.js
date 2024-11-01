import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, List, ListItem, ListItemText, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AsistenciaAPI from '../../services/AsistenciaAPI';
import { getEmpleados } from '../../services/FuncionarioAPI'; 

const AsistenciasEmpleado = () => {
  const [idEmpleado, setIdEmpleado] = useState('');
  const [asistencias, setAsistencias] = useState([]);
  const [error, setError] = useState('');
  const [empleados, setEmpleados] = useState([]); // Para la lista de empleados

  useEffect(() => {
    // Obtener la lista de empleados al montar el componente
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
    } catch (error) {
      setError('Error al obtener las asistencias. Verifique el empleado seleccionado.');
    }
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
      
      <Button
        variant="contained"
        color="primary"
        onClick={handleBuscarAsistencias}
        style={{ marginBottom: '20px' }}
      >
        Buscar Asistencias
      </Button>

      {error && <Typography color="error">{error}</Typography>}

      <List>
        {asistencias.map((asistencia) => (
          <ListItem key={asistencia.idAsistencia}>
            <ListItemText
              primary={`Fecha: ${new Date(asistencia.fecha).toLocaleDateString()} - Tipo: ${asistencia.tipo}`}
              secondary={`Hora: ${asistencia.hora}`}
            />
          </ListItem>
        ))}
      </List>
      
      {asistencias.length === 0 && !error && (
        <Typography variant="body1">No hay asistencias para mostrar.</Typography>
      )}
    </div>
  );
};

export default AsistenciasEmpleado;

import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const EmpleadoSelect = ({ empleados, value, onChange }) => {
  return (
    <FormControl fullWidth>
      <InputLabel>Empleado</InputLabel>
      <Select value={value} onChange={(e) => onChange(e.target.value)}>
        {empleados.map((empleado) => (
          <MenuItem key={empleado.idEmpleado} value={empleado.idEmpleado}>
            {`${empleado.nombre} ${empleado.apellidoUno} ${empleado.apellidoDos}`}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default EmpleadoSelect;

// src/pages/auth/CrearUsuario.js
import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Snackbar, Alert, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { registerUser, getRoles } from '../../services/userManagementService';
import { getEmpleados } from '../../services/FuncionarioAPI';

const CrearUsuario = () => {
  const [username, setUsername] = useState('');
  const [namePart, setNamePart] = useState('');
  const [password, setPassword] = useState('');
  const [roles, setRoles] = useState([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [selectedEmpleadoId, setSelectedEmpleadoId] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [errors, setErrors] = useState({});

  const emailDomain = "@sekcostarica.com";
  const email = `${namePart}${emailDomain}`;

  useEffect(() => {
    const fetchRolesAndEmpleados = async () => {
      try {
        const rolesData = await getRoles();
        setRoles(rolesData);

        const empleadosData = await getEmpleados();
        setEmpleados(empleadosData);
      } catch (error) {
        console.error("Error al obtener roles o empleados:", error);
      }
    };

    fetchRolesAndEmpleados();
  }, []);

  const validate = () => {
    const errors = {};

    // Validar nombre de usuario con longitud y patrón
    const usernamePattern = /^(?!([a-zA-Z0-9])\1{2,}$)[a-zA-Z0-9]{3,20}$/;
    if (!username) {
      errors.username = 'El nombre de usuario es obligatorio.';
    } else if (!usernamePattern.test(username)) {
      errors.username = 'Debe tener entre 3 y 20 caracteres, sin patrones repetitivos.';
    }

    if (!namePart) {
      errors.namePart = 'El correo electrónico es obligatorio.';
    } else if (!/^[a-zA-Z]+\.[a-zA-Z]+$/.test(namePart)) {
      errors.namePart = 'El correo debe tener el formato nombre.apellido';
    }

    if (!password) {
      errors.password = 'La contraseña es obligatoria.';
    } else if (password.length < 6 || password.length > 50) {
      errors.password = 'La contraseña debe tener entre 6 y 50 caracteres.';
    }

    if (!selectedEmpleadoId) {
      errors.selectedEmpleadoId = 'Debe seleccionar un empleado.';
    }

    if (selectedRoleIds.length === 0) {
      errors.selectedRoleIds = 'Debe seleccionar al menos un rol.';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRoleChange = (event) => {
    const { target: { value } } = event;
    setSelectedRoleIds(typeof value === 'string' ? value.split(',') : value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      await registerUser({
        username,
        email,
        passwordHash: password,
        isActive: true, // Enviar isActive como true por defecto
        roleIds: selectedRoleIds.map(roleId => parseInt(roleId)),
        idEmpleado: selectedEmpleadoId ? parseInt(selectedEmpleadoId) : null,
      });
      setAlertMessage('Usuario registrado exitosamente');
      setAlertSeverity('success');
      setAlertOpen(true);
      setUsername('');
      setNamePart('');
      setPassword('');
      setSelectedRoleIds([]);
      setSelectedEmpleadoId('');
      setErrors({});
    } catch (error) {
      setAlertMessage('Error al registrar usuario');
      setAlertSeverity('error');
      setAlertOpen(true);
      console.error("Error al registrar usuario:", error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      <Typography variant="h5">Registrar Usuario</Typography>

      <TextField
        label="Nombre de usuario"
        fullWidth
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        margin="normal"
        error={Boolean(errors.username)}
        helperText={errors.username}
      />

      <TextField
        label="Correo electrónico"
        fullWidth
        value={namePart}
        onChange={(e) => setNamePart(e.target.value)}
        required
        margin="normal"
        error={Boolean(errors.namePart)}
        helperText={errors.namePart}
        InputProps={{
          endAdornment: <Typography variant="body2">{emailDomain}</Typography>
        }}
      />

      <TextField
        label="Contraseña"
        type="password"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        margin="normal"
        error={Boolean(errors.password)}
        helperText={errors.password}
      />

      <FormControl fullWidth margin="normal" error={Boolean(errors.selectedEmpleadoId)}>
        <InputLabel>Nombre del Usuario</InputLabel>
        <Select
          value={selectedEmpleadoId}
          onChange={(e) => setSelectedEmpleadoId(e.target.value)}
          label="Nombre del Usuario"
        >
          <MenuItem value="">
            <em>Ninguno</em>
          </MenuItem>
          {empleados.map((empleado) => (
            <MenuItem key={empleado.idEmpleado} value={empleado.idEmpleado}>
              {`${empleado.nombre} ${empleado.apellidoUno} ${empleado.apellidoDos}`}
            </MenuItem>
          ))}
        </Select>
        {errors.selectedEmpleadoId && <Typography color="error">{errors.selectedEmpleadoId}</Typography>}
      </FormControl>

      <FormControl fullWidth margin="normal" error={Boolean(errors.selectedRoleIds)}>
        <InputLabel>Roles</InputLabel>
        <Select
          multiple
          value={selectedRoleIds}
          onChange={handleRoleChange}
          renderValue={(selected) => selected.map(roleId => {
            const role = roles.find(r => r.id === parseInt(roleId));
            return role ? role.roleName : '';
          }).join(', ')}
        >
          {roles.map((role) => (
            <MenuItem key={role.id} value={role.id}>
              {role.roleName}
            </MenuItem>
          ))}
        </Select>
        {errors.selectedRoleIds && <Typography color="error">{errors.selectedRoleIds}</Typography>}
      </FormControl>

      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
        Registrar 
      </Button>

      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={() => setAlertOpen(false)}>
        <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CrearUsuario;

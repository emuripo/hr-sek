// src/pages/auth/ListaUsuarios.js
import React, { useEffect, useState } from 'react';
import { getUsers } from '../../services/userManagementService';
import { DataGrid } from '@mui/x-data-grid';
import { CircularProgress, Typography, Box, Chip, Snackbar, Alert } from '@mui/material';

const ListaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsuarios(data);
      } catch (error) {
        console.error('Error al obtener la lista de usuarios:', error);
        setAlertMessage('Error al cargar usuarios');
        setAlertSeverity('error');
        setAlertOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const columns = [
    { field: 'username', headerName: 'Nombre de Usuario', width: 200 },
    { field: 'email', headerName: 'Correo Electrónico', width: 250 },
    {
      field: 'isActive',
      headerName: 'Estado',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Activo' : 'Inactivo'}
          color={params.value ? 'success' : 'default'}
        />
      ),
    },
    {
      field: 'roles',
      headerName: 'Roles',
      width: 300,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value.map((role) => role.roleName).join(', ')}
        </Typography>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#263060', textAlign: 'center', mb: 2 }}>
        Lista de Usuarios
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={usuarios}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            getRowId={(row) => row.id} // Usa el ID del usuario como clave única
            components={{
              NoRowsOverlay: () => (
                <Typography sx={{ padding: 2 }}>No se encontraron usuarios.</Typography>
              ),
            }}
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#263060',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: 'bold',
              },
              '& .MuiDataGrid-cell': {
                textAlign: 'center',
              },
            }}
          />
        </Box>
      )}

      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={() => setAlertOpen(false)}>
        <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ListaUsuarios;

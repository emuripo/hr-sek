import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';  // Importa el botón

// Importamos iconos de Material UI
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReportIcon from '@mui/icons-material/Assessment';

const drawerWidth = 240;

export default function Sidebar({ onLogout }) {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* AppBar para el header (barra superior) */}
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, backgroundColor: '#1976d2' }}  // Color de fondo del AppBar
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Gestión de Recursos Humanos
          </Typography>
          {/* Botón de Cerrar sesión */}
          <Button color="inherit" onClick={onLogout} style={{ marginLeft: 'auto' }}>
            Cerrar sesión
          </Button>
        </Toolbar>
      </AppBar>
      
      {/* Drawer - Sidebar */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        
        {/* Listado de opciones del Sidebar */}
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/">
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/empleados">
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Empleados" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/nomina">
              <ListItemIcon>
                <RequestQuoteIcon />
              </ListItemIcon>
              <ListItemText primary="Nómina" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/solicitudes">
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary="Solicitudes" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/reportes">
              <ListItemIcon>
                <ReportIcon />
              </ListItemIcon>
              <ListItemText primary="Reportes" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
}

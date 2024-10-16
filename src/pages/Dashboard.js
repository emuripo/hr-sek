// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import {
  Grid, Typography, CircularProgress, Paper
} from '@mui/material';
import { getNominas } from '../services/NominaAPI'; // Solo getNominas
import { getEmpleados as getEmpleadosFuncionario } from '../services/FuncionarioAPI';
import KPI from '../components/KPI/KPI'; // Asegúrate de que la ruta es correcta
import LineChartComponent from '../components/graficos/LineChartComponent';
import PieChartComponent from '../components/graficos/PieChartComponent';
import BarChartComponent from '../components/graficos/BarChartComponent';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

function Dashboard() {
  const [nominas, setNominas] = useState([]);
  const [empleadosNomina, setEmpleadosNomina] = useState([]);
  const [empleadosFuncionario, setEmpleadosFuncionario] = useState([]);
  const [loading, setLoading] = useState(true);
  const [costoTotal, setCostoTotal] = useState(0);
  const [salarioPromedio, setSalarioPromedio] = useState(0);
  const [bonificacionesTotal, setBonificacionesTotal] = useState(0);
  const [deduccionesTotal, setDeduccionesTotal] = useState(0);
  const [horasExtrasTotal, setHorasExtrasTotal] = useState(0);

  const fetchDatos = async () => {
    setLoading(true);
    try {
      const [nominasData, empleadosNominaData, empleadosFuncionarioData] = await Promise.all([
        getNominas(),
        getEmpleadosFuncionario()
      ]);
      setNominas(nominasData);
      setEmpleadosNomina(empleadosNominaData);
      setEmpleadosFuncionario(empleadosFuncionarioData);

      // Calcular métricas
      const costo = nominasData.reduce((acc, nom) => acc + nom.salarioBruto, 0);
      setCostoTotal(costo);

      const promedio = nominasData.length > 0 ? costo / nominasData.length : 0;
      setSalarioPromedio(promedio);

      const bonificaciones = nominasData.reduce((acc, nom) => {
        const totalBon = nom.bonificaciones.reduce((a, bon) => a + bon.monto, 0);
        return acc + totalBon;
      }, 0);
      setBonificacionesTotal(bonificaciones);

      const deducciones = nominasData.reduce((acc, nom) => {
        const totalDed = nom.deducciones.reduce((a, ded) => a + ded.monto, 0);
        return acc + totalDed;
      }, 0);
      setDeduccionesTotal(deducciones);

      const horasExtras = nominasData.reduce((acc, nom) => {
        const totalHE = nom.horasExtras.reduce((a, he) => a + he.montoHorasExtra, 0);
        return acc + totalHE;
      }, 0);
      setHorasExtrasTotal(horasExtras);
    } catch (error) {
      console.error('Error al obtener datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Dashboard de Nóminas
      </Typography>
      
      {/* Resumen de Métricas */}
      <Grid container spacing={2} sx={{ marginBottom: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPI 
            title="Total Nóminas" 
            value={nominas.length} 
            icon={<PeopleIcon fontSize="large" />} 
            color="#e3f2fd" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPI 
            title="Costo Total de Nómina" 
            value={`$${costoTotal.toFixed(2)}`} 
            icon={<AttachMoneyIcon fontSize="large" />} 
            color="#e8f5e9" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPI 
            title="Salario Promedio" 
            value={`$${salarioPromedio.toFixed(2)}`} 
            icon={<MonetizationOnIcon fontSize="large" />} 
            color="#fff3e0" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPI 
            title="Bonificaciones Totales" 
            value={`$${bonificacionesTotal.toFixed(2)}`} 
            icon={<EmojiEventsIcon fontSize="large" />} 
            color="#fce4ec" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPI 
            title="Deducciones Totales" 
            value={`$${deduccionesTotal.toFixed(2)}`} 
            icon={<MoneyOffIcon fontSize="large" />} 
            color="#ede7f6" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPI 
            title="Horas Extras Totales" 
            value={`${horasExtrasTotal} horas`} 
            icon={<AccessTimeIcon fontSize="large" />} 
            color="#f3e5f5" 
          />
        </Grid>
        {/* Añade más KPIs según sea necesario */}
      </Grid>
      
      {/* Visualizaciones */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Evolución de Costos de Nómina
            </Typography>
            <LineChartComponent nominas={nominas} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Distribución de Bonificaciones y Deducciones
            </Typography>
            <PieChartComponent nominas={nominas} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Comparación de Salarios Brutos vs. Netos
            </Typography>
            <BarChartComponent nominas={nominas} empleados={empleadosNomina} />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default Dashboard;

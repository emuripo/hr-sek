// src/components/Reportes.js
import React, { useState, useEffect } from 'react';
import {
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Grid
} from '@mui/material';
import { CSVLink } from 'react-csv';
import { getNominas } from '../services/NominaAPI';
import { getEmpleados } from '../services/FuncionarioAPI';

function Reportes() {
  const [nominas, setNominas] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reporteSeleccionado, setReporteSeleccionado] = useState('');
  const [datosReporte, setDatosReporte] = useState([]);
  const [headersReporte, setHeadersReporte] = useState([]);

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

  useEffect(() => {
    fetchDatos();
  }, []);

  const handleReporteChange = (event) => {
    const tipoReporte = event.target.value;
    setReporteSeleccionado(tipoReporte);
    generarReporte(tipoReporte);
  };

  const generarReporte = (tipo) => {
    let datos = [];
    let headers = [];

    switch (tipo) {
      case 'general':
        headers = [
          { label: 'ID Nómina', key: 'idNomina' },
          { label: 'Empleado', key: 'empleado' },
          { label: 'Salario Base', key: 'salarioBase' },
          { label: 'Bonificaciones Totales', key: 'bonificacionesTotales' },
          { label: 'Deducciones Totales', key: 'deduccionesTotales' },
          { label: 'Horas Extras Totales', key: 'horasExtrasTotales' },
          { label: 'Salario Bruto', key: 'salarioBruto' },
          { label: 'Salario Neto', key: 'salarioNeto' },
          { label: 'Fecha Generación', key: 'fechaGeneracion' },
          { label: 'Estado', key: 'estado' }
        ];

        datos = nominas.map(nomina => {
          const empleado = empleados.find(emp => emp.idEmpleado === nomina.idEmpleado);
          const nombreCompleto = empleado ? `${empleado.nombre} ${empleado.apellidoUno} ${empleado.apellidoDos}` : 'Empleado Desconocido';
          
          const bonificacionesTotales = nomina.bonificaciones.reduce((acc, bon) => acc + parseFloat(bon.monto || 0), 0);
          const deduccionesTotales = nomina.deducciones.reduce((acc, ded) => acc + parseFloat(ded.monto || 0), 0);
          const horasExtrasTotales = nomina.horasExtras.reduce((acc, he) => acc + parseFloat(he.montoHorasExtra || 0), 0);

          return {
            idNomina: nomina.idNomina,
            empleado: nombreCompleto,
            salarioBase: nomina.salarioBase,
            bonificacionesTotales: bonificacionesTotales.toFixed(2),
            deduccionesTotales: deduccionesTotales.toFixed(2),
            horasExtrasTotales: horasExtrasTotales.toFixed(2),
            salarioBruto: nomina.salarioBruto.toFixed(2),
            salarioNeto: nomina.salarioNeto.toFixed(2),
            fechaGeneracion: new Date(nomina.fechaGeneracion).toLocaleDateString(),
            estado: nomina.activa ? 'Activa' : 'Inactiva'
          };
        });
        break;

      case 'porEmpleado':
        headers = [
          { label: 'ID Nómina', key: 'idNomina' },
          { label: 'Empleado', key: 'empleado' },
          { label: 'Salario Base', key: 'salarioBase' },
          { label: 'Bonificaciones', key: 'bonificaciones' },
          { label: 'Deducciones', key: 'deducciones' },
          { label: 'Horas Extras', key: 'horasExtras' },
          { label: 'Salario Bruto', key: 'salarioBruto' },
          { label: 'Salario Neto', key: 'salarioNeto' },
          { label: 'Fecha Generación', key: 'fechaGeneracion' },
          { label: 'Periodo de Nómina', key: 'idPeriodoNomina' }
        ];

        datos = nominas.map(nomina => {
          const empleado = empleados.find(emp => emp.idEmpleado === nomina.idEmpleado);
          const nombreCompleto = empleado ? `${empleado.nombre} ${empleado.apellidoUno} ${empleado.apellidoDos}` : 'Empleado Desconocido';

          const bonificaciones = nomina.bonificaciones.map(bon => `${bon.tipoBonificacion}: $${bon.monto.toFixed(2)}`).join('; ');
          const deducciones = nomina.deducciones.map(ded => `${ded.tipoDeduccion}: $${ded.monto.toFixed(2)}`).join('; ');
          const horasExtras = nomina.horasExtras.map(he => `${he.cantidadHoras} horas: $${he.montoHorasExtra.toFixed(2)}`).join('; ');
          
          return {
            idNomina: nomina.idNomina,
            empleado: nombreCompleto,
            salarioBase: nomina.salarioBase,
            bonificaciones: bonificaciones,
            deducciones: deducciones,
            horasExtras: horasExtras,
            salarioBruto: nomina.salarioBruto.toFixed(2),
            salarioNeto: nomina.salarioNeto.toFixed(2),
            fechaGeneracion: new Date(nomina.fechaGeneracion).toLocaleDateString(),
            idPeriodoNomina: nomina.idPeriodoNomina
          };
        });
        break;

      // se puede agregar otros tipos de reportes

      default:
        datos = [];
        headers = [];
    }

    setDatosReporte(datos);
    setHeadersReporte(headers);
  };

  return (
    <div>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Reportes de Nóminas
      </Typography>

      <Grid container spacing={2} alignItems="center" sx={{ marginBottom: 2 }}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="select-reporte-label">Tipo de Reporte</InputLabel>
            <Select
              labelId="select-reporte-label"
              value={reporteSeleccionado}
              label="Tipo de Reporte"
              onChange={handleReporteChange}
            >
              <MenuItem value="general">Reporte General de Nóminas</MenuItem>
              <MenuItem value="porEmpleado">Reporte de Nómina por Empleado</MenuItem>
              {/* se Agregan más opciones según los tipos de reportes */}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          {reporteSeleccionado && datosReporte.length > 0 && (
            <CSVLink
              data={datosReporte}
              headers={headersReporte}
              filename={`reporte_${reporteSeleccionado}_${new Date().toISOString().slice(0,10)}.csv`}
              style={{ textDecoration: 'none' }}
            >
              <Button variant="contained" sx={{ backgroundColor: '#f0af00', color: '#fff', '&:hover': { backgroundColor: '#d18d00' } }}>
                Descargar Reporte CSV
              </Button>
            </CSVLink>
          )}
        </Grid>
      </Grid>

      {loading ? (
        <CircularProgress />
      ) : (
        reporteSeleccionado && datosReporte.length > 0 ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="Tabla de Reporte">
              <TableHead>
                <TableRow>
                  {headersReporte.map((header, index) => (
                    <TableCell key={index} align="center" sx={{ backgroundColor: '#263060', color: '#fff', fontWeight: 'bold' }}>
                      {header.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {datosReporte.map((fila, index) => (
                  <TableRow key={index}>
                    {headersReporte.map((header, idx) => (
                      <TableCell key={idx} align="center">
                        {fila[header.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          reporteSeleccionado && (
            <Typography variant="h6" align="center">
              No hay datos disponibles para el reporte seleccionado.
            </Typography>
          )
        )
      )}
    </div>
  );
}

export default Reportes;

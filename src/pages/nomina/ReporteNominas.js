import React from 'react';
import { Button, Grid } from '@mui/material';
import { saveAs } from 'file-saver';

const ReporteNominas = ({
  nominas,
  empleados,
  bonificaciones,
  deducciones,
  getNombreEmpleado,
  getBonificacionDescripcion,
  getDeduccionDescripcion,
}) => {
  const generateCSV = () => {
    const headers = [
      'Empleado',
      'Salario Base',
      'Salario Bruto',
      'Salario Neto',
      'Bonificaciones',
      'Deducciones',
      'Horas Extras',
      'Deducciones Automáticas',
      'Otras Deducciones',
    ];

    const csvData = nominas.map((nomina) => {
      const empleado = getNombreEmpleado(nomina.idEmpleado);

      const bonificacionesData = nomina.bonificacionesIds
        ? nomina.bonificacionesIds.map(getBonificacionDescripcion).join('; ')
        : 'N/A';

      const deduccionesData = nomina.deduccionesIds
        ? nomina.deduccionesIds.map(getDeduccionDescripcion).join('; ')
        : 'N/A';

      const horasExtrasData = nomina.horasExtras
        ? nomina.horasExtras
            .map(
              (extra) =>
                `Horas: ${extra.horasExtrasTrabajadasMes}, Tarifa: ${extra.tarifaHorasExtra.toFixed(
                  2
                )}, Total: ${extra.totalPagarHorasExtra.toFixed(2)}`
            )
            .join('; ')
        : 'N/A';

      const deduccionesAutomaticasData = nomina.deduccionesAutomaticas
        ? nomina.deduccionesAutomaticas
            .map(
              (deduccion) =>
                `${deduccion.tipoDeduccion}: ${deduccion.monto.toFixed(2)}`
            )
            .join('; ')
        : 'N/A';

      const otrasDeduccionesData = nomina.otrasDeducciones
        ? nomina.otrasDeducciones
            .map(
              (deduccion) =>
                `${deduccion.descripcion}: ${deduccion.monto.toFixed(2)}`
            )
            .join('; ')
        : 'N/A';

      return [
        empleado,
        nomina.salarioBase.toFixed(2),
        nomina.salarioBruto.toFixed(2),
        nomina.salarioNeto.toFixed(2),
        bonificacionesData,
        deduccionesData,
        horasExtrasData,
        deduccionesAutomaticasData,
        otrasDeduccionesData,
      ];
    });

    const csvContent = [headers.join(','), ...csvData.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'Reporte_Nominas.csv');
  };

  return (
    <Grid container justifyContent="flex-end" sx={{ mb: 2 }}>
      <Button variant="contained" color="primary" onClick={generateCSV}>
        Descargar Reporte CSV
      </Button>
    </Grid>
  );
};

export default ReporteNominas;

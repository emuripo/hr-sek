import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

function VerNomina({ open, onClose, nomina, getNombreEmpleado }) {
  if (!nomina) return null; // Si no hay nómina seleccionada, no mostrar nada

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Detalles de la Nómina</DialogTitle>
      <DialogContent>
        <p><strong>ID Nómina:</strong> {nomina.id}</p>
        <p><strong>Empleado:</strong> {getNombreEmpleado(nomina.idEmpleado)}</p>
        <p><strong>Salario Base:</strong> ${nomina.salarioBase.toFixed(2)}</p>
        <p><strong>Salario Bruto:</strong> ${nomina.salarioBruto.toFixed(2)}</p>
        <p><strong>Salario Neto:</strong> ${nomina.salarioNeto.toFixed(2)}</p>
        <p><strong>Fecha Generación:</strong> {new Date(nomina.fechaGeneracion).toLocaleDateString()}</p>

        <p><strong>Deducciones:</strong></p>
        <ul>
          {nomina.deducciones.map((deduccion, index) => (
            <li key={index}>{deduccion.tipoDeduccion}: ${deduccion.monto.toFixed(2)}</li>
          ))}
        </ul>

        <p><strong>Bonificaciones:</strong></p>
        <ul>
          {nomina.bonificaciones.map((bonificacion, index) => (
            <li key={index}>{bonificacion.tipoBonificacion}: ${bonificacion.monto.toFixed(2)}</li>
          ))}
        </ul>

        <p><strong>Horas Extras:</strong></p>
        <ul>
          {nomina.horasExtras.map((horaExtra, index) => (
            <li key={index}>{horaExtra.cantidadHoras} horas: ${horaExtra.montoHorasExtra.toFixed(2)}</li>
          ))}
        </ul>

        <p><strong>Vacaciones:</strong></p>
        <ul>
          {nomina.vacaciones.map((vacacion, index) => (
            <li key={index}>
              {new Date(vacacion.fechaInicio).toLocaleDateString()} - {new Date(vacacion.fechaFin).toLocaleDateString()}
            </li>
          ))}
        </ul>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}

export default VerNomina;

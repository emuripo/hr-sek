// src/components/charts/BarChartComponent.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function BarChartComponent({ nominas, empleados }) {
  // Preparar datos agrupados por empleado
  const datos = nominas.map(nomina => {
    const empleado = empleados.find(emp => emp.idEmpleado === nomina.idEmpleado);
    const nombreCompleto = empleado ? `${empleado.nombre} ${empleado.apellidoUno} ${empleado.apellidoDos}` : 'Empleado Desconocido';
    return {
      empleado: nombreCompleto,
      salarioBruto: nomina.salarioBruto,
      salarioNeto: nomina.salarioNeto
    };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={datos}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="empleado" />
        <YAxis />
        <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
        <Legend />
        <Bar dataKey="salarioBruto" fill="#8884d8" />
        <Bar dataKey="salarioNeto" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default BarChartComponent;

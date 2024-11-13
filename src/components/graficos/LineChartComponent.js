import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function LineChartComponent({ nominas }) {
  // Preparar datos agrupados por mes y año
  const datos = nominas.reduce((acc, nom) => {
    const fecha = new Date(nom.fechaGeneracion); 
    const mes = fecha.toLocaleString('default', { month: 'short' });
    const año = fecha.getFullYear();
    const key = `${mes} ${año}`;
    
    const existing = acc.find(item => item.mes === key);
    if (existing) {
      existing.costo += nom.salarioBruto;
    } else {
      acc.push({ mes: key, costo: nom.salarioBruto });
    }
    return acc;
  }, [])
  .sort((a, b) => new Date(`${a.mes} 1`) - new Date(`${b.mes} 1`)); // Ordenar correctamente por mes y año

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={datos}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="mes" />
        <YAxis />
        <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
        <Legend />
        <Line type="monotone" dataKey="costo" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default LineChartComponent;

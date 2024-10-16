// src/components/charts/PieChartComponent.js
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function PieChartComponent({ nominas }) {
  // Preparar datos para bonificaciones y deducciones
  const bonificaciones = nominas.reduce((acc, nom) => {
    nom.bonificaciones.forEach(bon => {
      const found = acc.find(item => item.name === bon.tipoBonificacion);
      if (found) {
        found.value += bon.monto;
      } else {
        acc.push({ name: bon.tipoBonificacion, value: bon.monto });
      }
    });
    return acc;
  }, []);

  const deducciones = nominas.reduce((acc, nom) => {
    nom.deducciones.forEach(ded => {
      const found = acc.find(item => item.name === ded.tipoDeduccion);
      if (found) {
        found.value += ded.monto;
      } else {
        acc.push({ name: ded.tipoDeduccion, value: ded.monto });
      }
    });
    return acc;
  }, []);

  const data = [
    ...bonificaciones.map(bon => ({ ...bon, category: 'Bonificaciones' })),
    ...deducciones.map(ded => ({ ...ded, category: 'Deducciones' }))
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560'];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          label={({ name, value }) => `${name}: $${value.toFixed(2)}`}
          outerRadius={100}
          fill="#8884d8"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default PieChartComponent;

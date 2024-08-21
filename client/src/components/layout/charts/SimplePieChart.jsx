import React from 'react';
import { PieChart, ResponsiveContainer, Pie, Tooltip, Cell, Legend } from 'recharts';

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const COLORS = ['#0CCD20', '#1E82DA', '#F0A128 '];

const SimplePieCharts = ({ title, description, data }) => {
  return (
    <div className='box containerGrid'>
        <section className="opcionesInfo">
          <div className="info">
            <h4>{title}</h4>
            <span>{description}</span>
          </div>
        </section>

        <div style={{ width: '100%', height: 250 }} className=''>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        dataKey="value" 
                        data={data}
                        label={renderCustomizedLabel}
                        labelLine={false}
                    >
                    {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    </Pie>
                    <Tooltip />
                    <Legend/>
                </PieChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
}

export default SimplePieCharts;

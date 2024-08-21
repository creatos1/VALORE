import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const SimpleBarCharts = ({title, description, data}) => {
  return (
    <div className='box containerGrid'>
        <section className="opcionesInfo">
          <div className="info">
            <h4>{title}</h4>
            <span>{description}</span>
          </div>
        </section>
    
      <div style={{ width: '100%', height: 250}} className=''>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 30, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="4 1 2" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            
            <Bar dataKey="ventas" fill="#6b48ff" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

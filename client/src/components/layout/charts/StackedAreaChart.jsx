import { AreaChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Area, Tooltip } from 'recharts';

export default function StackedAreaCharts({ title, description, data }) {
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
            <AreaChart data={data} margin={{ top: 30, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid />
                <YAxis />
                <Tooltip />
                <Area dataKey="ventas" type="monotone" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
    </div>
  );
}
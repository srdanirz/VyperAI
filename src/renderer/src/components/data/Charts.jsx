// src/renderer/src/components/data/Charts.jsx
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const defaultTooltipStyle = {
  backgroundColor: '#2A2A40',
  border: 'none',
  borderRadius: '8px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  color: 'white',
  padding: '12px'
};

export const LineChartComponent = ({ data, dataKey, stroke = '#38ff9b', ...props }) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#2A2A40" />
      <XAxis dataKey="name" stroke="#9A9AB6" />
      <YAxis stroke="#9A9AB6" />
      <Tooltip contentStyle={defaultTooltipStyle} />
      <Line 
        type="monotone" 
        dataKey={dataKey} 
        stroke={stroke}
        strokeWidth={2}
        dot={false}
        {...props}
      />
    </LineChart>
  </ResponsiveContainer>
);

export const BarChartComponent = ({ data, dataKey, fill = '#38ff9b', ...props }) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#2A2A40" />
      <XAxis dataKey="name" stroke="#9A9AB6" />
      <YAxis stroke="#9A9AB6" />
      <Tooltip contentStyle={defaultTooltipStyle} />
      <Bar dataKey={dataKey} fill={fill} radius={[4, 4, 0, 0]} {...props} />
    </BarChart>
  </ResponsiveContainer>
);

export const AreaChartComponent = ({ data, dataKey, fill = '#38ff9b', ...props }) => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#2A2A40" />
      <XAxis dataKey="name" stroke="#9A9AB6" />
      <YAxis stroke="#9A9AB6" />
      <Tooltip contentStyle={defaultTooltipStyle} />
      <Area 
        type="monotone" 
        dataKey={dataKey} 
        fill={fill}
        fillOpacity={0.1}
        stroke={fill}
        {...props}
      />
    </AreaChart>
  </ResponsiveContainer>
);

export { Charts };
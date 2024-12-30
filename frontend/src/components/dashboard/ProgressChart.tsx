import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

interface ProgressData {
  day: string;
  hours: number;
}

interface ProgressChartProps {
  data: ProgressData[];
}

export const ProgressChart = ({ data }: ProgressChartProps) => (
  <div className="h-64">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="hours" stroke="#3B82F6" />
      </LineChart>
    </ResponsiveContainer>
  </div>
);
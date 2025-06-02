
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { time: "00:00", temperature: 20, pressure: 10, flow: 100 },
  { time: "01:00", temperature: 22, pressure: 12, flow: 110 },
  { time: "02:00", temperature: 25, pressure: 15, flow: 120 },
  { time: "03:00", temperature: 28, pressure: 14, flow: 115 },
  { time: "04:00", temperature: 30, pressure: 16, flow: 125 },
  { time: "05:00", temperature: 32, pressure: 18, flow: 130 },
  { time: "06:00", temperature: 35, pressure: 20, flow: 135 },
];

export const TrendChart = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Process Trends</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="temperature" 
              stroke="#ef4444" 
              strokeWidth={2}
              name="Temperature (°C)"
            />
            <Line 
              type="monotone" 
              dataKey="pressure" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Pressure (Bar)"
            />
            <Line 
              type="monotone" 
              dataKey="flow" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Flow (L/min)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

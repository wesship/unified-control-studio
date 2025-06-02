
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export const RealtimeChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString();
      
      setData(prevData => {
        const newPoint = {
          time: timeStr,
          temperature: 20 + Math.random() * 20,
          pressure: 10 + Math.random() * 10,
          flow: 100 + Math.random() * 50,
        };
        
        const newData = [...prevData, newPoint];
        return newData.slice(-20); // Keep last 20 points
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="temperature" 
            stroke="#ef4444" 
            strokeWidth={2}
            dot={false}
            name="Temperature"
          />
          <Line 
            type="monotone" 
            dataKey="pressure" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={false}
            name="Pressure"
          />
          <Line 
            type="monotone" 
            dataKey="flow" 
            stroke="#10b981" 
            strokeWidth={2}
            dot={false}
            name="Flow"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

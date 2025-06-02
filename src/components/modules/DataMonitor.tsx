
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RealtimeChart } from "@/components/charts/RealtimeChart";

const tags = [
  { name: "Motor_Speed", value: 1750, unit: "RPM", status: "Good" },
  { name: "Temperature", value: 42.5, unit: "°C", status: "Good" },
  { name: "Pressure", value: 15.2, unit: "Bar", status: "Good" },
  { name: "Flow_Rate", value: 125.8, unit: "L/min", status: "Good" },
  { name: "Level_Tank_A", value: 75.3, unit: "%", status: "Good" },
  { name: "Vibration", value: 2.1, unit: "mm/s", status: "Warning" },
];

export const DataMonitor = () => {
  return (
    <div className="space-y-6">
      {/* Real-time Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Real-time Data Trends</h3>
        <RealtimeChart />
      </Card>

      {/* Tag Values */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Tag Values</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tags.map((tag) => (
            <div key={tag.name} className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-slate-800">{tag.name}</h4>
                <Badge 
                  variant={tag.status === "Good" ? "default" : "destructive"}
                  className="text-xs"
                >
                  {tag.status}
                </Badge>
              </div>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-bold text-slate-900">{tag.value}</span>
                <span className="text-sm text-slate-500">{tag.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

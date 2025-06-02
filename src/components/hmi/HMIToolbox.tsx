
import { Card } from "@/components/ui/card";
import { Circle, Square, Gauge, BarChart3, ToggleLeft, Thermometer } from "lucide-react";

const toolboxItems = [
  { id: "button", name: "Button", icon: Square, category: "Controls" },
  { id: "indicator", name: "Indicator", icon: Circle, category: "Display" },
  { id: "gauge", name: "Gauge", icon: Gauge, category: "Display" },
  { id: "chart", name: "Chart", icon: BarChart3, category: "Display" },
  { id: "toggle", name: "Toggle", icon: ToggleLeft, category: "Controls" },
  { id: "sensor", name: "Sensor", icon: Thermometer, category: "Display" },
];

export const HMIToolbox = () => {
  return (
    <Card className="p-4 h-full">
      <h3 className="text-lg font-semibold mb-4">HMI Components</h3>
      
      <div className="space-y-4">
        {["Controls", "Display"].map((category) => (
          <div key={category}>
            <h4 className="text-sm font-semibold text-slate-600 mb-2">{category}</h4>
            <div className="grid grid-cols-2 gap-2">
              {toolboxItems
                .filter(item => item.category === category)
                .map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-grab border border-slate-200 text-center transition-colors"
                      draggable
                    >
                      <Icon className="w-6 h-6 mx-auto mb-1 text-slate-600" />
                      <span className="text-xs font-medium text-slate-700">{item.name}</span>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

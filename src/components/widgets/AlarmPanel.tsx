
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";

const alarms = [
  {
    id: 1,
    message: "High Temperature in Zone 1",
    severity: "Critical",
    time: "2 mins ago",
    icon: AlertTriangle,
    color: "text-red-600",
  },
  {
    id: 2,
    message: "Motor vibration above threshold",
    severity: "Warning",
    time: "5 mins ago",
    icon: AlertCircle,
    color: "text-orange-600",
  },
  {
    id: 3,
    message: "Maintenance due in 24 hours",
    severity: "Info",
    time: "1 hour ago",
    icon: Info,
    color: "text-blue-600",
  },
];

export const AlarmPanel = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Active Alarms</h3>
      <div className="space-y-3">
        {alarms.map((alarm) => {
          const Icon = alarm.icon;
          return (
            <div key={alarm.id} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
              <Icon className={`w-5 h-5 mt-0.5 ${alarm.color}`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">{alarm.message}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-slate-500">{alarm.time}</span>
                  <Badge 
                    variant={alarm.severity === "Critical" ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {alarm.severity}
                  </Badge>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

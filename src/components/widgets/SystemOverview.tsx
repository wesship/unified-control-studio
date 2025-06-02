
import { Card } from "@/components/ui/card";
import { Activity, Cpu, Network, AlertTriangle } from "lucide-react";

const stats = [
  {
    title: "System Status",
    value: "Online",
    icon: Activity,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "CPU Usage",
    value: "23%",
    icon: Cpu,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Connected Devices",
    value: "4/4",
    icon: Network,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    title: "Active Alarms",
    value: "2",
    icon: AlertTriangle,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
];

export const SystemOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.bgColor} mr-4`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

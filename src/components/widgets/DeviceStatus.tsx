
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";

const devices = [
  { name: "PLC-001", status: "Connected", ip: "192.168.1.100" },
  { name: "HMI-001", status: "Connected", ip: "192.168.1.101" },
  { name: "VFD-001", status: "Disconnected", ip: "192.168.1.102" },
  { name: "SENSOR-001", status: "Connected", ip: "COM1" },
];

export const DeviceStatus = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Device Status</h3>
      <div className="space-y-3">
        {devices.map((device) => (
          <div key={device.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center space-x-3">
              {device.status === "Connected" ? (
                <Wifi className="w-4 h-4 text-green-600" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-600" />
              )}
              <div>
                <p className="text-sm font-medium">{device.name}</p>
                <p className="text-xs text-slate-500">{device.ip}</p>
              </div>
            </div>
            <Badge 
              variant={device.status === "Connected" ? "default" : "destructive"}
              className="text-xs"
            >
              {device.status}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
};

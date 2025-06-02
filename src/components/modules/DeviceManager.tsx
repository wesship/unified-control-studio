
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NetworkIcon, Wifi, WifiOff, Settings } from "lucide-react";

const devices = [
  { id: 1, name: "PLC-001", type: "Modbus TCP", ip: "192.168.1.100", status: "Connected" },
  { id: 2, name: "HMI-001", type: "OPC UA", ip: "192.168.1.101", status: "Connected" },
  { id: 3, name: "VFD-001", type: "EtherNet/IP", ip: "192.168.1.102", status: "Disconnected" },
  { id: 4, name: "SENSOR-001", type: "Modbus RTU", ip: "COM1", status: "Connected" },
];

export const DeviceManager = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Connected Devices</h3>
        <Button>Add Device</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices.map((device) => (
          <Card key={device.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <NetworkIcon className="w-8 h-8 text-blue-600" />
                <div>
                  <h4 className="font-semibold">{device.name}</h4>
                  <p className="text-sm text-slate-500">{device.type}</p>
                </div>
              </div>
              <Badge 
                variant={device.status === "Connected" ? "default" : "destructive"}
                className="flex items-center space-x-1"
              >
                {device.status === "Connected" ? (
                  <Wifi className="w-3 h-3" />
                ) : (
                  <WifiOff className="w-3 h-3" />
                )}
                <span>{device.status}</span>
              </Badge>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Address:</span>
                <span className="font-mono">{device.ip}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Protocol:</span>
                <span>{device.type}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button size="sm" variant="outline" className="flex-1">
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </Button>
              <Button size="sm" variant="outline">
                Test
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

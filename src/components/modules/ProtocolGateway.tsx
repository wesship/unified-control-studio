
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NetworkIcon, Wifi, WifiOff, Settings, Plus, RefreshCw } from "lucide-react";

interface Device {
  id: string;
  name: string;
  protocol: 'Modbus TCP' | 'OPC UA' | 'EtherNet/IP' | 'Modbus RTU';
  address: string;
  status: 'Connected' | 'Disconnected' | 'Error';
  lastSeen?: Date;
  tags: DeviceTag[];
}

interface DeviceTag {
  id: string;
  name: string;
  address: string;
  dataType: 'Bool' | 'Int' | 'Float' | 'String';
  value?: any;
  quality: 'Good' | 'Bad' | 'Uncertain';
}

interface VirtualTag {
  id: string;
  name: string;
  deviceId: string;
  deviceTagId: string;
  conversion?: {
    read?: string;
    write?: string;
  };
}

export const ProtocolGateway = () => {
  const [devices, setDevices] = useState<Device[]>([
    {
      id: 'plc1',
      name: 'PLC-001',
      protocol: 'Modbus TCP',
      address: '192.168.1.100:502',
      status: 'Connected',
      lastSeen: new Date(),
      tags: [
        { id: 'motor_speed', name: 'Motor Speed', address: '40001', dataType: 'Int', value: 1750, quality: 'Good' },
        { id: 'temp_sensor', name: 'Temperature', address: '40002', dataType: 'Float', value: 42.5, quality: 'Good' }
      ]
    },
    {
      id: 'scada1',
      name: 'SCADA-001',
      protocol: 'OPC UA',
      address: 'opc.tcp://192.168.1.200:4840',
      status: 'Connected',
      lastSeen: new Date(),
      tags: [
        { id: 'valve_pos', name: 'Valve Position', address: 'ns=2;s=ValvePosition', dataType: 'Float', value: 75.0, quality: 'Good' }
      ]
    },
    {
      id: 'vfd1',
      name: 'VFD-001',
      protocol: 'EtherNet/IP',
      address: '192.168.1.102',
      status: 'Disconnected',
      tags: []
    }
  ]);

  const [virtualTags, setVirtualTags] = useState<VirtualTag[]>([
    {
      id: 'tank1_temp',
      name: 'Tank 1 Temperature',
      deviceId: 'plc1',
      deviceTagId: 'temp_sensor',
      conversion: {
        read: 'x * 1.0',
        write: 'x * 1.0'
      }
    }
  ]);

  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [newDevice, setNewDevice] = useState({
    name: '',
    protocol: 'Modbus TCP' as Device['protocol'],
    address: ''
  });

  const connectDevice = async (deviceId: string) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, status: 'Connected' as const, lastSeen: new Date() }
        : device
    ));
    
    // Simulate some delay
    setTimeout(() => {
      console.log(`Connected to device ${deviceId}`);
    }, 1000);
  };

  const disconnectDevice = async (deviceId: string) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, status: 'Disconnected' as const }
        : device
    ));
  };

  const addDevice = () => {
    if (!newDevice.name || !newDevice.address) return;
    
    const device: Device = {
      id: `device_${Date.now()}`,
      name: newDevice.name,
      protocol: newDevice.protocol,
      address: newDevice.address,
      status: 'Disconnected',
      tags: []
    };
    
    setDevices(prev => [...prev, device]);
    setNewDevice({ name: '', protocol: 'Modbus TCP', address: '' });
    setShowAddDevice(false);
  };

  const scanDeviceTags = async (deviceId: string) => {
    // Simulate tag discovery
    const mockTags: DeviceTag[] = [
      { id: 'tag1', name: 'Digital Input 1', address: '10001', dataType: 'Bool', value: true, quality: 'Good' },
      { id: 'tag2', name: 'Analog Input 1', address: '30001', dataType: 'Float', value: 123.45, quality: 'Good' },
      { id: 'tag3', name: 'Holding Register 1', address: '40001', dataType: 'Int', value: 1000, quality: 'Good' }
    ];
    
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, tags: mockTags }
        : device
    ));
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Protocol Gateway</h2>
        <Button onClick={() => setShowAddDevice(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Device
        </Button>
      </div>

      <Tabs defaultValue="devices" className="flex-1">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="mapping">Tag Mapping</TabsTrigger>
          <TabsTrigger value="monitoring">Live Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="devices" className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {devices.map(device => (
              <Card key={device.id} className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <NetworkIcon className="w-8 h-8 text-blue-600" />
                    <div>
                      <h4 className="font-semibold">{device.name}</h4>
                      <p className="text-sm text-slate-500">{device.protocol}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={device.status === 'Connected' ? 'default' : 'destructive'}
                    className="flex items-center space-x-1"
                  >
                    {device.status === 'Connected' ? (
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
                    <span className="font-mono text-xs">{device.address}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tags:</span>
                    <span>{device.tags.length}</span>
                  </div>
                  {device.lastSeen && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Last Seen:</span>
                      <span className="text-xs">{device.lastSeen.toLocaleTimeString()}</span>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  {device.status === 'Connected' ? (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => disconnectDevice(device.id)}
                      className="flex-1"
                    >
                      Disconnect
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      onClick={() => connectDevice(device.id)}
                      className="flex-1"
                    >
                      Connect
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => scanDeviceTags(device.id)}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setSelectedDevice(device.id)}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="mapping" className="flex-1">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Virtual Tag Mapping</h3>
            <div className="space-y-4">
              {virtualTags.map(tag => (
                <div key={tag.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{tag.name}</h4>
                    <p className="text-sm text-slate-500">
                      {devices.find(d => d.id === tag.deviceId)?.name} → {tag.deviceTagId}
                    </p>
                  </div>
                  <Badge variant="secondary">Mapped</Badge>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="monitoring" className="flex-1">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Live Tag Values</h3>
            <div className="space-y-4">
              {devices.flatMap(device => 
                device.tags.map(tag => (
                  <div key={`${device.id}-${tag.id}`} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{device.name} - {tag.name}</h4>
                      <p className="text-sm text-slate-500">{tag.address} ({tag.dataType})</p>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-semibold">{tag.value}</div>
                      <Badge 
                        variant={tag.quality === 'Good' ? 'default' : 'destructive'} 
                        className="text-xs"
                      >
                        {tag.quality}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Device Dialog */}
      {showAddDevice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Add New Device</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Device Name</label>
                <Input 
                  value={newDevice.name}
                  onChange={(e) => setNewDevice(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter device name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Protocol</label>
                <Select value={newDevice.protocol} onValueChange={(value) => setNewDevice(prev => ({ ...prev, protocol: value as Device['protocol'] }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Modbus TCP">Modbus TCP</SelectItem>
                    <SelectItem value="OPC UA">OPC UA</SelectItem>
                    <SelectItem value="EtherNet/IP">EtherNet/IP</SelectItem>
                    <SelectItem value="Modbus RTU">Modbus RTU</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Address</label>
                <Input 
                  value={newDevice.address}
                  onChange={(e) => setNewDevice(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="IP:Port or Serial Port"
                />
              </div>
            </div>
            <div className="flex space-x-2 mt-6">
              <Button onClick={addDevice} className="flex-1">Add Device</Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAddDevice(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

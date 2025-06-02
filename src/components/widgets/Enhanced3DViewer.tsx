
import { useRef, useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, ZoomIn, ZoomOut, Home } from "lucide-react";

export const Enhanced3DViewer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [equipmentData, setEquipmentData] = useState({
    motor: { speed: 1750, temperature: 42.5, vibration: 2.1 },
    pump: { pressure: 15.2, flow: 125.8, efficiency: 87.5 },
    tank: { level: 75.3, temperature: 38.2, pressure: 1.2 }
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Initialize 2D visualization (placeholder for 3D)
    const drawEquipment = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background grid
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw motor (circle)
      const motorX = 150;
      const motorY = 150;
      const motorRadius = 40;
      
      ctx.fillStyle = equipmentData.motor.temperature > 45 ? '#ef4444' : '#10b981';
      ctx.beginPath();
      ctx.arc(motorX, motorY, motorRadius, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.strokeStyle = '#1f2937';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Motor label
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('MOTOR', motorX, motorY - 5);
      ctx.fillText(`${equipmentData.motor.speed} RPM`, motorX, motorY + 8);

      // Draw tank (rectangle)
      const tankX = 300;
      const tankY = 100;
      const tankWidth = 80;
      const tankHeight = 100;
      
      // Tank outline
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(tankX, tankY, tankWidth, tankHeight);
      
      // Tank level
      const fillHeight = (equipmentData.tank.level / 100) * tankHeight;
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(tankX, tankY + tankHeight - fillHeight, tankWidth, fillHeight);
      
      ctx.strokeStyle = '#1f2937';
      ctx.lineWidth = 2;
      ctx.strokeRect(tankX, tankY, tankWidth, tankHeight);
      
      // Tank label
      ctx.fillStyle = '#1f2937';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('TANK', tankX + tankWidth/2, tankY - 10);
      ctx.fillText(`${equipmentData.tank.level.toFixed(1)}%`, tankX + tankWidth/2, tankY + tankHeight + 20);

      // Draw pump (triangle)
      const pumpX = 450;
      const pumpY = 150;
      const pumpSize = 30;
      
      ctx.fillStyle = equipmentData.pump.pressure > 20 ? '#f59e0b' : '#10b981';
      ctx.beginPath();
      ctx.moveTo(pumpX, pumpY - pumpSize);
      ctx.lineTo(pumpX - pumpSize, pumpY + pumpSize);
      ctx.lineTo(pumpX + pumpSize, pumpY + pumpSize);
      ctx.closePath();
      ctx.fill();
      
      ctx.strokeStyle = '#1f2937';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Pump label
      ctx.fillStyle = '#1f2937';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('PUMP', pumpX, pumpY + pumpSize + 20);
      ctx.fillText(`${equipmentData.pump.flow.toFixed(1)} L/min`, pumpX, pumpY + pumpSize + 35);

      // Draw connections
      ctx.strokeStyle = '#6b7280';
      ctx.lineWidth = 3;
      
      // Motor to pump
      ctx.beginPath();
      ctx.moveTo(motorX + motorRadius, motorY);
      ctx.lineTo(pumpX - pumpSize, pumpY);
      ctx.stroke();
      
      // Tank to pump
      ctx.beginPath();
      ctx.moveTo(tankX + tankWidth/2, tankY + tankHeight);
      ctx.lineTo(pumpX, pumpY + pumpSize);
      ctx.stroke();
    };

    drawEquipment();
    setIsInitialized(true);

    // Simulate data updates
    const interval = setInterval(() => {
      setEquipmentData(prev => ({
        motor: {
          speed: prev.motor.speed + (Math.random() - 0.5) * 50,
          temperature: Math.max(20, Math.min(60, prev.motor.temperature + (Math.random() - 0.5) * 2)),
          vibration: Math.max(0, prev.motor.vibration + (Math.random() - 0.5) * 0.5)
        },
        pump: {
          pressure: Math.max(0, Math.min(25, prev.pump.pressure + (Math.random() - 0.5) * 1)),
          flow: Math.max(0, prev.pump.flow + (Math.random() - 0.5) * 5),
          efficiency: Math.max(70, Math.min(95, prev.pump.efficiency + (Math.random() - 0.5) * 2))
        },
        tank: {
          level: Math.max(0, Math.min(100, prev.tank.level + (Math.random() - 0.5) * 1)),
          temperature: Math.max(20, Math.min(50, prev.tank.temperature + (Math.random() - 0.5) * 1)),
          pressure: Math.max(0, prev.tank.pressure + (Math.random() - 0.5) * 0.1)
        }
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [equipmentData]);

  const resetView = () => {
    // Reset view implementation
    console.log('Reset view');
  };

  const zoomIn = () => {
    // Zoom in implementation
    console.log('Zoom in');
  };

  const zoomOut = () => {
    // Zoom out implementation
    console.log('Zoom out');
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">3D Equipment Viewer</h3>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={resetView}>
            <Home className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={zoomIn}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={zoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={resetView}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="relative">
        <canvas 
          ref={canvasRef}
          className="w-full h-80 bg-slate-100 rounded-lg border"
          style={{ maxHeight: '320px' }}
        />
        
        {/* Equipment Status Overlay */}
        <div className="absolute top-4 left-4 space-y-2">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
            <h4 className="font-semibold text-sm mb-2">Equipment Status</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span>Motor:</span>
                <Badge variant={equipmentData.motor.temperature > 45 ? "destructive" : "default"}>
                  {equipmentData.motor.temperature.toFixed(1)}°C
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Pump:</span>
                <Badge variant={equipmentData.pump.pressure > 20 ? "destructive" : "default"}>
                  {equipmentData.pump.pressure.toFixed(1)} Bar
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Tank:</span>
                <Badge variant="secondary">
                  {equipmentData.tank.level.toFixed(1)}%
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!isInitialized && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-slate-600">Loading 3D Scene...</p>
          </div>
        </div>
      )}
    </Card>
  );
};

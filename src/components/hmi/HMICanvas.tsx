
import { useState } from "react";

interface HMICanvasProps {
  elements: any[];
  setElements: (elements: any[]) => void;
  selectedElement: any;
  setSelectedElement: (element: any) => void;
}

export const HMICanvas = ({ elements, setElements, selectedElement, setSelectedElement }: HMICanvasProps) => {
  return (
    <div className="h-full bg-slate-100 rounded-lg relative overflow-hidden">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e2e8f0 1px, transparent 1px),
            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />

      {/* Canvas Content */}
      <div className="relative h-full p-4">
        <div className="text-center text-slate-400 mt-20">
          <h3 className="text-lg font-semibold mb-2">HMI Canvas</h3>
          <p>Drag components from the toolbox to start designing your HMI</p>
        </div>

        {/* Demo HMI Elements */}
        <div className="absolute top-10 left-10 bg-white rounded-lg shadow-lg p-4 border-2 border-blue-300">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-white font-bold">ON</span>
            </div>
            <span className="text-sm font-semibold">Motor Status</span>
          </div>
        </div>

        <div className="absolute top-10 right-10 bg-white rounded-lg shadow-lg p-4 border-2 border-orange-300">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">42.5°C</div>
            <span className="text-sm font-semibold">Temperature</span>
          </div>
        </div>
      </div>
    </div>
  );
};


import { useState } from "react";
import { Card } from "@/components/ui/card";
import { HMICanvas } from "@/components/hmi/HMICanvas";
import { HMIToolbox } from "@/components/hmi/HMIToolbox";
import { HMIProperties } from "@/components/hmi/HMIProperties";

export const HMIDesigner = () => {
  const [selectedElement, setSelectedElement] = useState(null);
  const [elements, setElements] = useState([]);

  return (
    <div className="h-full flex space-x-4">
      {/* Toolbox */}
      <div className="w-64 flex-shrink-0">
        <HMIToolbox />
      </div>

      {/* Canvas */}
      <div className="flex-1">
        <Card className="h-full p-4">
          <HMICanvas 
            elements={elements}
            setElements={setElements}
            selectedElement={selectedElement}
            setSelectedElement={setSelectedElement}
          />
        </Card>
      </div>

      {/* Properties Panel */}
      <div className="w-80 flex-shrink-0">
        <HMIProperties 
          selectedElement={selectedElement}
          setSelectedElement={setSelectedElement}
        />
      </div>
    </div>
  );
};

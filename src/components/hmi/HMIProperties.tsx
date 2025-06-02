
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface HMIPropertiesProps {
  selectedElement: any;
  setSelectedElement: (element: any) => void;
}

export const HMIProperties = ({ selectedElement }: HMIPropertiesProps) => {
  return (
    <Card className="p-4 h-full">
      <h3 className="text-lg font-semibold mb-4">Properties</h3>
      
      {selectedElement ? (
        <div className="space-y-4">
          <div>
            <Label htmlFor="element-name">Name</Label>
            <Input id="element-name" value={selectedElement.name || ""} />
          </div>
          
          <div>
            <Label htmlFor="element-type">Type</Label>
            <Select value={selectedElement.type || ""}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="button">Button</SelectItem>
                <SelectItem value="indicator">Indicator</SelectItem>
                <SelectItem value="gauge">Gauge</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="element-tag">Data Tag</Label>
            <Input id="element-tag" placeholder="Select tag..." />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="element-x">X Position</Label>
              <Input id="element-x" type="number" value={selectedElement.x || 0} />
            </div>
            <div>
              <Label htmlFor="element-y">Y Position</Label>
              <Input id="element-y" type="number" value={selectedElement.y || 0} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="element-width">Width</Label>
              <Input id="element-width" type="number" value={selectedElement.width || 100} />
            </div>
            <div>
              <Label htmlFor="element-height">Height</Label>
              <Input id="element-height" type="number" value={selectedElement.height || 50} />
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-slate-500 mt-8">
          <p>Select an element to edit its properties</p>
        </div>
      )}
    </Card>
  );
};

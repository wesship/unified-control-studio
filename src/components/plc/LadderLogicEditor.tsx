
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const LadderLogicEditor = () => {
  const [rungs, setRungs] = useState([
    { id: 1, contacts: ["I0.0"], coils: ["Q0.0"], comment: "Start Button -> Motor" },
    { id: 2, contacts: ["I0.1"], coils: ["Q0.1"], comment: "Stop Button -> Alarm" },
  ]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Ladder Logic Program</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">Add Rung</Button>
          <Button variant="outline" size="sm">Insert Contact</Button>
          <Button variant="outline" size="sm">Insert Coil</Button>
        </div>
      </div>

      <Card className="flex-1 p-6 bg-slate-50">
        <div className="space-y-6">
          {rungs.map((rung) => (
            <div key={rung.id} className="bg-white rounded-lg p-4 border-2 border-slate-200">
              <div className="flex items-center space-x-4 mb-2">
                <span className="text-sm font-mono text-slate-500">Rung {rung.id}:</span>
                <span className="text-sm text-slate-600">{rung.comment}</span>
              </div>
              
              {/* Ladder Logic Visual Representation */}
              <div className="flex items-center space-x-6 font-mono text-sm">
                <div className="flex items-center">
                  <span className="text-slate-400">|</span>
                  <div className="mx-2 px-3 py-1 bg-blue-100 border-2 border-blue-300 rounded">
                    {rung.contacts[0]}
                  </div>
                  <span className="text-slate-400">——</span>
                </div>
                
                <div className="flex items-center">
                  <div className="mx-2 px-3 py-1 bg-green-100 border-2 border-green-300 rounded">
                    ( {rung.coils[0]} )
                  </div>
                  <span className="text-slate-400">|</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

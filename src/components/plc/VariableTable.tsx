
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const variables = [
  { name: "StartButton", type: "BOOL", address: "I0.0", value: "FALSE", comment: "Start button input" },
  { name: "StopButton", type: "BOOL", address: "I0.1", value: "FALSE", comment: "Stop button input" },
  { name: "Motor", type: "BOOL", address: "Q0.0", value: "FALSE", comment: "Motor output" },
  { name: "Temperature", type: "REAL", address: "IW0", value: "23.5", comment: "Temperature sensor" },
  { name: "Speed", type: "INT", address: "QW0", value: "1750", comment: "Motor speed setpoint" },
];

export const VariableTable = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Variable Table</h3>
        <Button variant="outline" size="sm">Add Variable</Button>
      </div>

      <Card className="flex-1 p-6">
        <div className="overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left p-3 font-semibold">Name</th>
                <th className="text-left p-3 font-semibold">Type</th>
                <th className="text-left p-3 font-semibold">Address</th>
                <th className="text-left p-3 font-semibold">Value</th>
                <th className="text-left p-3 font-semibold">Comment</th>
              </tr>
            </thead>
            <tbody>
              {variables.map((variable) => (
                <tr key={variable.name} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-3 font-mono font-semibold text-blue-600">{variable.name}</td>
                  <td className="p-3">
                    <Badge variant="secondary" className="text-xs">
                      {variable.type}
                    </Badge>
                  </td>
                  <td className="p-3 font-mono text-sm">{variable.address}</td>
                  <td className="p-3 font-mono font-semibold">{variable.value}</td>
                  <td className="p-3 text-slate-600 text-sm">{variable.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};


import { Card } from "@/components/ui/card";

export const StructuredTextEditor = () => {
  const code = `PROGRAM Main
VAR
  StartButton : BOOL;
  StopButton : BOOL;
  Motor : BOOL;
  Timer1 : TON;
END_VAR

// Motor control logic
IF StartButton AND NOT StopButton THEN
  Motor := TRUE;
ELSIF StopButton THEN
  Motor := FALSE;
END_IF;

// Timer example
Timer1(IN := StartButton, PT := T#5s);

END_PROGRAM`;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Structured Text Editor</h3>
      </div>

      <Card className="flex-1 p-0 overflow-hidden">
        <div className="h-full">
          <pre className="h-full p-6 bg-slate-900 text-green-400 font-mono text-sm overflow-auto">
            <code>{code}</code>
          </pre>
        </div>
      </Card>
    </div>
  );
};

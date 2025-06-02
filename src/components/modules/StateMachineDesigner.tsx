
import { useState, useCallback } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Square, Plus, Download } from "lucide-react";

interface State {
  id: string;
  name: string;
  entryActions: string[];
  exitActions: string[];
  doActions: string[];
  position: { x: number; y: number };
}

interface Transition {
  id: string;
  from: string;
  to: string;
  condition: string;
}

interface StateMachine {
  name: string;
  states: State[];
  transitions: Transition[];
  initialState: string;
}

export const StateMachineDesigner = () => {
  const [stateMachine, setStateMachine] = useState<StateMachine>({
    name: 'ConveyorSystem',
    states: [
      {
        id: 'stopped',
        name: 'STOPPED',
        entryActions: ['Motor := FALSE', 'StatusLight := RED'],
        exitActions: ['PreStartAlarm := TRUE'],
        doActions: ['CheckSafety()'],
        position: { x: 100, y: 100 }
      },
      {
        id: 'running',
        name: 'RUNNING',
        entryActions: ['Motor := TRUE', 'StatusLight := GREEN'],
        exitActions: ['PartCount := PartCount + BatchCount'],
        doActions: ['MonitorCurrent()', 'CountParts()'],
        position: { x: 300, y: 100 }
      }
    ],
    transitions: [
      {
        id: 'start',
        from: 'stopped',
        to: 'running',
        condition: 'StartButton AND Safety'
      },
      {
        id: 'stop',
        from: 'running',
        to: 'stopped',
        condition: 'StopButton OR (AutoMode AND BatchComplete)'
      }
    ],
    initialState: 'stopped'
  });

  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentState, setCurrentState] = useState('stopped');

  const generateStructuredText = useCallback(() => {
    let code = `// State Machine: ${stateMachine.name}\n`;
    code += `// Generated on: ${new Date().toISOString()}\n\n`;
    
    // Variables
    code += `VAR\n`;
    code += `  ${stateMachine.name}_State : STRING := '${stateMachine.initialState}';\n`;
    code += `  ${stateMachine.name}_PrevState : STRING := '';\n`;
    code += `  ${stateMachine.name}_TransitionTriggered : BOOL := FALSE;\n`;
    code += `END_VAR\n\n`;
    
    // Main state machine logic
    code += `// Main state machine logic\n`;
    code += `CASE ${stateMachine.name}_State OF\n\n`;
    
    // Generate code for each state
    stateMachine.states.forEach(state => {
      code += `  '${state.name}':\n`;
      
      // Entry actions
      if (state.entryActions.length > 0) {
        code += `    // Entry actions\n`;
        code += `    IF ${stateMachine.name}_PrevState <> '${state.name}' THEN\n`;
        state.entryActions.forEach(action => {
          code += `      ${action};\n`;
        });
        code += `    END_IF;\n`;
      }
      
      // Do actions
      if (state.doActions.length > 0) {
        code += `    // Do actions\n`;
        state.doActions.forEach(action => {
          code += `    ${action};\n`;
        });
        code += `\n`;
      }
      
      // Check transitions
      const stateTransitions = stateMachine.transitions.filter(t => t.from === state.id);
      if (stateTransitions.length > 0) {
        code += `    // Check transitions\n`;
        code += `    ${stateMachine.name}_TransitionTriggered := FALSE;\n`;
        
        stateTransitions.forEach(transition => {
          code += `    IF NOT ${stateMachine.name}_TransitionTriggered AND (${transition.condition}) THEN\n`;
          
          // Exit actions
          if (state.exitActions.length > 0) {
            state.exitActions.forEach(action => {
              code += `      ${action};\n`;
            });
          }
          
          code += `      ${stateMachine.name}_PrevState := ${stateMachine.name}_State;\n`;
          code += `      ${stateMachine.name}_State := '${transition.to.toUpperCase()}';\n`;
          code += `      ${stateMachine.name}_TransitionTriggered := TRUE;\n`;
          code += `    END_IF;\n`;
        });
      }
      
      code += `\n`;
    });
    
    code += `  ELSE:\n`;
    code += `    // Unknown state - reset to initial\n`;
    code += `    ${stateMachine.name}_State := '${stateMachine.initialState.toUpperCase()}';\n`;
    code += `    ${stateMachine.name}_PrevState := '';\n`;
    code += `END_CASE;\n\n`;
    
    code += `// Update previous state reference\n`;
    code += `IF NOT ${stateMachine.name}_TransitionTriggered THEN\n`;
    code += `  ${stateMachine.name}_PrevState := ${stateMachine.name}_State;\n`;
    code += `END_IF;\n`;
    
    return code;
  }, [stateMachine]);

  const downloadCode = () => {
    const code = generateStructuredText();
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${stateMachine.name}_StateMachine.st`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const addState = () => {
    const newState: State = {
      id: `state_${Date.now()}`,
      name: `NEW_STATE_${stateMachine.states.length + 1}`,
      entryActions: [],
      exitActions: [],
      doActions: [],
      position: { x: 200 + stateMachine.states.length * 150, y: 100 }
    };
    
    setStateMachine(prev => ({
      ...prev,
      states: [...prev.states, newState]
    }));
  };

  const toggleSimulation = () => {
    setIsRunning(!isRunning);
    if (!isRunning) {
      setCurrentState(stateMachine.initialState);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">State Machine Designer</h2>
        <div className="flex space-x-2">
          <Button onClick={toggleSimulation} variant={isRunning ? "destructive" : "default"}>
            {isRunning ? <Square className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isRunning ? 'Stop' : 'Simulate'}
          </Button>
          <Button onClick={downloadCode} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export ST
          </Button>
        </div>
      </div>

      <Tabs defaultValue="designer" className="flex-1">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="designer">Visual Designer</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="code">Generated Code</TabsTrigger>
        </TabsList>
        
        <TabsContent value="designer" className="flex-1">
          <Card className="h-full p-6">
            <div className="flex items-center justify-between mb-4">
              <Input 
                value={stateMachine.name}
                onChange={(e) => setStateMachine(prev => ({ ...prev, name: e.target.value }))}
                className="w-48 font-semibold"
              />
              <Button onClick={addState} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add State
              </Button>
            </div>
            
            {/* State Machine Canvas */}
            <div className="relative h-96 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 overflow-auto">
              {stateMachine.states.map(state => (
                <div
                  key={state.id}
                  className={`absolute p-4 bg-white rounded-lg border-2 cursor-pointer transition-all ${
                    selectedState === state.id 
                      ? 'border-blue-500 shadow-lg' 
                      : currentState === state.id && isRunning
                        ? 'border-green-500 bg-green-50'
                        : 'border-slate-300 hover:border-slate-400'
                  }`}
                  style={{ left: state.position.x, top: state.position.y }}
                  onClick={() => setSelectedState(state.id)}
                >
                  <div className="text-center">
                    <div className="font-semibold text-sm mb-2">{state.name}</div>
                    {state.id === stateMachine.initialState && (
                      <Badge variant="secondary" className="text-xs">Initial</Badge>
                    )}
                    {currentState === state.id && isRunning && (
                      <Badge variant="default" className="text-xs ml-1">Active</Badge>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Draw transitions */}
              <svg className="absolute inset-0 pointer-events-none">
                {stateMachine.transitions.map(transition => {
                  const fromState = stateMachine.states.find(s => s.id === transition.from);
                  const toState = stateMachine.states.find(s => s.id === transition.to);
                  
                  if (!fromState || !toState) return null;
                  
                  return (
                    <g key={transition.id}>
                      <line
                        x1={fromState.position.x + 60}
                        y1={fromState.position.y + 30}
                        x2={toState.position.x + 60}
                        y2={toState.position.y + 30}
                        stroke="#6b7280"
                        strokeWidth="2"
                        markerEnd="url(#arrowhead)"
                      />
                      <text
                        x={(fromState.position.x + toState.position.x) / 2 + 60}
                        y={(fromState.position.y + toState.position.y) / 2 + 20}
                        textAnchor="middle"
                        className="text-xs fill-slate-600"
                      >
                        {transition.condition}
                      </text>
                    </g>
                  );
                })}
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3.5, 0 7"
                      fill="#6b7280"
                    />
                  </marker>
                </defs>
              </svg>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="properties" className="flex-1">
          <Card className="h-full p-6">
            {selectedState ? (
              <div className="space-y-4">
                <h3 className="font-semibold">State Properties</h3>
                {/* State properties editor would go here */}
                <div>
                  <label className="text-sm font-medium">State Name</label>
                  <Input 
                    value={stateMachine.states.find(s => s.id === selectedState)?.name || ''}
                    onChange={(e) => {
                      setStateMachine(prev => ({
                        ...prev,
                        states: prev.states.map(s => 
                          s.id === selectedState ? { ...s, name: e.target.value } : s
                        )
                      }));
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-500 mt-8">
                <p>Select a state to edit its properties</p>
              </div>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="code" className="flex-1">
          <Card className="h-full p-6">
            <pre className="h-full p-4 bg-slate-900 text-green-400 font-mono text-sm overflow-auto rounded">
              <code>{generateStructuredText()}</code>
            </pre>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

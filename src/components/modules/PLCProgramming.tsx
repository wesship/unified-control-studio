
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LadderLogicEditor } from "@/components/plc/LadderLogicEditor";
import { StructuredTextEditor } from "@/components/plc/StructuredTextEditor";
import { VariableTable } from "@/components/plc/VariableTable";

export const PLCProgramming = () => {
  return (
    <div className="h-full flex flex-col space-y-4">
      <Card className="flex-1 p-6">
        <Tabs defaultValue="ladder" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ladder">Ladder Logic</TabsTrigger>
            <TabsTrigger value="structured">Structured Text</TabsTrigger>
            <TabsTrigger value="variables">Variables</TabsTrigger>
            <TabsTrigger value="simulation">Simulation</TabsTrigger>
          </TabsList>
          
          <div className="flex-1 mt-4">
            <TabsContent value="ladder" className="h-full">
              <LadderLogicEditor />
            </TabsContent>
            
            <TabsContent value="structured" className="h-full">
              <StructuredTextEditor />
            </TabsContent>
            
            <TabsContent value="variables" className="h-full">
              <VariableTable />
            </TabsContent>
            
            <TabsContent value="simulation" className="h-full">
              <div className="flex items-center justify-center h-full bg-slate-50 rounded-lg">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-slate-600 mb-2">PLC Simulation</h3>
                  <p className="text-slate-500">Real-time PLC execution and debugging tools</p>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
};

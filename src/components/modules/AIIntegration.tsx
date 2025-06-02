
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAPIConnections } from "@/hooks/useAPIConnections";
import { Bot, Plus, Wifi, WifiOff, Settings, Send, Zap, RefreshCw } from "lucide-react";

export const AIIntegration = () => {
  const {
    connections,
    loading,
    addDevonConnection,
    testConnection,
    initializeMCP,
    removeConnection,
    sendDevonTask,
    getAvailableTools,
    callTool
  } = useAPIConnections();

  const [showAddConnection, setShowAddConnection] = useState(false);
  const [newConnection, setNewConnection] = useState({
    apiKey: '',
    serverUrl: ''
  });
  const [taskInput, setTaskInput] = useState('');
  const [selectedConnection, setSelectedConnection] = useState<string>('');
  const [availableTools, setAvailableTools] = useState<any[]>([]);
  const [selectedTool, setSelectedTool] = useState<string>('');
  const [toolArguments, setToolArguments] = useState('{}');

  useEffect(() => {
    if (selectedConnection) {
      loadAvailableTools(selectedConnection);
    }
  }, [selectedConnection]);

  const loadAvailableTools = async (connectionId: string) => {
    try {
      const tools = await getAvailableTools(connectionId);
      setAvailableTools(tools);
    } catch (error) {
      console.error('Failed to load tools:', error);
    }
  };

  const handleAddDevonConnection = async () => {
    if (!newConnection.apiKey) {
      return;
    }

    try {
      await addDevonConnection(newConnection.apiKey, newConnection.serverUrl || undefined);
      setNewConnection({ apiKey: '', serverUrl: '' });
      setShowAddConnection(false);
    } catch (error) {
      console.error('Failed to add connection:', error);
    }
  };

  const handleSendTask = async () => {
    if (!selectedConnection || !taskInput.trim()) {
      return;
    }

    try {
      const context = {
        source: 'industrial_automation_platform',
        timestamp: new Date().toISOString(),
        user_role: 'engineer'
      };

      await sendDevonTask(selectedConnection, taskInput, context);
      setTaskInput('');
    } catch (error) {
      console.error('Failed to send task:', error);
    }
  };

  const handleToolCall = async () => {
    if (!selectedConnection || !selectedTool) {
      return;
    }

    try {
      const args = JSON.parse(toolArguments);
      await callTool(selectedConnection, selectedTool, args);
    } catch (error) {
      console.error('Failed to call tool:', error);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">AI Integration</h2>
        <Button onClick={() => setShowAddConnection(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add AI Connection
        </Button>
      </div>

      <Tabs defaultValue="connections" className="flex-1">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="devon">Devon.ai Tasks</TabsTrigger>
          <TabsTrigger value="mcp">MCP Tools</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="connections" className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connections.map(connection => (
              <Card key={connection.id} className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Bot className="w-8 h-8 text-blue-600" />
                    <div>
                      <h4 className="font-semibold">{connection.name}</h4>
                      <p className="text-sm text-slate-500">{connection.type}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={connection.status === 'connected' ? 'default' : 'destructive'}
                    className="flex items-center space-x-1"
                  >
                    {connection.status === 'connected' ? (
                      <Wifi className="w-3 h-3" />
                    ) : (
                      <WifiOff className="w-3 h-3" />
                    )}
                    <span>{connection.status}</span>
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">URL:</span>
                    <span className="font-mono text-xs truncate max-w-32">{connection.url}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Capabilities:</span>
                    <span>{connection.capabilities.length}</span>
                  </div>
                  {connection.lastUsed && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Last Used:</span>
                      <span className="text-xs">{connection.lastUsed.toLocaleTimeString()}</span>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => testConnection(connection.id)}
                    disabled={loading}
                    className="flex-1"
                  >
                    Test
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => initializeMCP(connection.id)}
                    disabled={loading}
                  >
                    <Zap className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => removeConnection(connection.id)}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="devon" className="flex-1">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Send Task to Devon.ai</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Select Devon.ai Connection</label>
                <Select value={selectedConnection} onValueChange={setSelectedConnection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a Devon.ai connection" />
                  </SelectTrigger>
                  <SelectContent>
                    {connections
                      .filter(conn => conn.type === 'devon' && conn.status === 'connected')
                      .map(conn => (
                        <SelectItem key={conn.id} value={conn.id}>
                          {conn.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Task Description</label>
                <Textarea
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  placeholder="Describe the task you want Devon.ai to perform..."
                  className="min-h-32"
                />
              </div>

              <Button 
                onClick={handleSendTask}
                disabled={!selectedConnection || !taskInput.trim() || loading}
                className="w-full"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Task
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="mcp" className="flex-1">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">MCP Tool Execution</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => selectedConnection && loadAvailableTools(selectedConnection)}
                disabled={!selectedConnection}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Select Connection</label>
                <Select value={selectedConnection} onValueChange={setSelectedConnection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a connection" />
                  </SelectTrigger>
                  <SelectContent>
                    {connections
                      .filter(conn => conn.status === 'connected')
                      .map(conn => (
                        <SelectItem key={conn.id} value={conn.id}>
                          {conn.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Available Tools</label>
                <Select value={selectedTool} onValueChange={setSelectedTool}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a tool" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTools.map(tool => (
                      <SelectItem key={tool.name} value={tool.name}>
                        {tool.name} - {tool.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Tool Arguments (JSON)</label>
                <Textarea
                  value={toolArguments}
                  onChange={(e) => setToolArguments(e.target.value)}
                  placeholder='{"key": "value"}'
                  className="font-mono text-sm"
                />
              </div>

              <Button 
                onClick={handleToolCall}
                disabled={!selectedConnection || !selectedTool || loading}
                className="w-full"
              >
                <Zap className="w-4 h-4 mr-2" />
                Execute Tool
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="flex-1">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Automation Rules</h3>
            <div className="text-center py-8">
              <Bot className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500">
                Configure automated workflows and AI-driven processes here.
              </p>
              <p className="text-sm text-slate-400 mt-2">
                Connect triggers from your industrial systems to AI agent actions.
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Connection Dialog */}
      {showAddConnection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Add Devon.ai Connection</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">API Key</label>
                <Input 
                  type="password"
                  value={newConnection.apiKey}
                  onChange={(e) => setNewConnection(prev => ({ ...prev, apiKey: e.target.value }))}
                  placeholder="Enter Devon.ai API key"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Server URL (optional)</label>
                <Input 
                  value={newConnection.serverUrl}
                  onChange={(e) => setNewConnection(prev => ({ ...prev, serverUrl: e.target.value }))}
                  placeholder="https://api.devon.ai"
                />
              </div>
            </div>
            <div className="flex space-x-2 mt-6">
              <Button 
                onClick={handleAddDevonConnection}
                disabled={!newConnection.apiKey || loading}
                className="flex-1"
              >
                Add Connection
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAddConnection(false)}
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

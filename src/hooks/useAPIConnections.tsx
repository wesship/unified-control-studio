
import { useState, useEffect, useCallback } from 'react';
import { apiService, APIConnection } from '@/services/apiService';
import { useToast } from '@/components/ui/use-toast';

export const useAPIConnections = () => {
  const [connections, setConnections] = useState<APIConnection[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const refreshConnections = useCallback(() => {
    setConnections(apiService.getConnections());
  }, []);

  useEffect(() => {
    refreshConnections();
  }, [refreshConnections]);

  const addDevonConnection = useCallback(async (apiKey: string, serverUrl?: string) => {
    setLoading(true);
    try {
      const connectionId = await apiService.connectToDevon(apiKey, serverUrl);
      refreshConnections();
      toast({
        title: "Devon.ai Connected",
        description: "Successfully connected to Devon.ai agent",
      });
      return connectionId;
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: `Failed to connect to Devon.ai: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [refreshConnections, toast]);

  const testConnection = useCallback(async (connectionId: string) => {
    setLoading(true);
    try {
      const success = await apiService.testConnection(connectionId);
      refreshConnections();
      
      if (success) {
        toast({
          title: "Connection Test Passed",
          description: "API connection is working correctly",
        });
      } else {
        toast({
          title: "Connection Test Failed",
          description: "Unable to reach the API endpoint",
          variant: "destructive",
        });
      }
      
      return success;
    } catch (error) {
      toast({
        title: "Test Failed",
        description: `Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshConnections, toast]);

  const initializeMCP = useCallback(async (connectionId: string) => {
    setLoading(true);
    try {
      await apiService.initializeMCP(connectionId);
      refreshConnections();
      toast({
        title: "MCP Initialized",
        description: "Model Context Protocol session established",
      });
    } catch (error) {
      toast({
        title: "MCP Initialization Failed",
        description: `Failed to initialize MCP: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [refreshConnections, toast]);

  const removeConnection = useCallback((connectionId: string) => {
    const success = apiService.removeConnection(connectionId);
    if (success) {
      refreshConnections();
      toast({
        title: "Connection Removed",
        description: "API connection has been removed",
      });
    }
    return success;
  }, [refreshConnections, toast]);

  const sendDevonTask = useCallback(async (connectionId: string, task: string, context?: any) => {
    setLoading(true);
    try {
      const result = await apiService.sendToDevon(connectionId, task, context);
      toast({
        title: "Task Sent to Devon.ai",
        description: "Task has been submitted successfully",
      });
      return result;
    } catch (error) {
      toast({
        title: "Task Submission Failed",
        description: `Failed to send task: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getAvailableTools = useCallback(async (connectionId: string) => {
    try {
      return await apiService.getAvailableTools(connectionId);
    } catch (error) {
      toast({
        title: "Failed to Get Tools",
        description: `Unable to retrieve available tools: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
      return [];
    }
  }, [toast]);

  const callTool = useCallback(async (connectionId: string, toolName: string, arguments_: any) => {
    setLoading(true);
    try {
      const result = await apiService.callTool(connectionId, toolName, arguments_);
      toast({
        title: "Tool Executed",
        description: `Successfully executed ${toolName}`,
      });
      return result;
    } catch (error) {
      toast({
        title: "Tool Execution Failed",
        description: `Failed to execute ${toolName}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    connections,
    loading,
    addDevonConnection,
    testConnection,
    initializeMCP,
    removeConnection,
    sendDevonTask,
    getAvailableTools,
    callTool,
    refreshConnections
  };
};

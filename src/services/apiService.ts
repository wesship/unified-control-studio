
export interface APIConnection {
  id: string;
  name: string;
  type: 'devon' | 'openai' | 'anthropic' | 'custom';
  url: string;
  apiKey?: string;
  status: 'connected' | 'disconnected' | 'error';
  lastUsed?: Date;
  capabilities: string[];
}

export interface MCPMessage {
  id: string;
  method: string;
  params: any;
  timestamp: Date;
}

export interface MCPResponse {
  id: string;
  result?: any;
  error?: {
    code: number;
    message: string;
  };
}

class APIService {
  private connections: Map<string, APIConnection> = new Map();
  private mcpSessions: Map<string, WebSocket> = new Map();

  // API Connection Management
  addConnection(connection: Omit<APIConnection, 'id' | 'status' | 'lastUsed'>): string {
    const id = `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newConnection: APIConnection = {
      ...connection,
      id,
      status: 'disconnected'
    };
    
    this.connections.set(id, newConnection);
    return id;
  }

  async testConnection(connectionId: string): Promise<boolean> {
    const connection = this.connections.get(connectionId);
    if (!connection) {
      throw new Error('Connection not found');
    }

    try {
      const response = await fetch(`${connection.url}/health`, {
        method: 'GET',
        headers: {
          'Authorization': connection.apiKey ? `Bearer ${connection.apiKey}` : '',
          'Content-Type': 'application/json'
        }
      });

      const isConnected = response.ok;
      this.updateConnectionStatus(connectionId, isConnected ? 'connected' : 'error');
      return isConnected;
    } catch (error) {
      console.error('Connection test failed:', error);
      this.updateConnectionStatus(connectionId, 'error');
      return false;
    }
  }

  private updateConnectionStatus(connectionId: string, status: APIConnection['status']) {
    const connection = this.connections.get(connectionId);
    if (connection) {
      connection.status = status;
      connection.lastUsed = new Date();
      this.connections.set(connectionId, connection);
    }
  }

  // Devon.ai specific integration
  async connectToDevon(apiKey: string, serverUrl?: string): Promise<string> {
    const devonConnection = {
      name: 'Devon.ai Agent',
      type: 'devon' as const,
      url: serverUrl || 'https://api.devon.ai',
      apiKey,
      capabilities: ['code_generation', 'task_automation', 'file_operations', 'terminal_access']
    };

    const connectionId = this.addConnection(devonConnection);
    await this.testConnection(connectionId);
    return connectionId;
  }

  async sendToDevon(connectionId: string, task: string, context?: any): Promise<any> {
    const connection = this.connections.get(connectionId);
    if (!connection || connection.type !== 'devon') {
      throw new Error('Invalid Devon.ai connection');
    }

    const payload = {
      task,
      context: {
        platform: 'industrial_automation',
        timestamp: new Date().toISOString(),
        ...context
      }
    };

    try {
      const response = await fetch(`${connection.url}/v1/tasks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${connection.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Devon.ai API error: ${response.statusText}`);
      }

      const result = await response.json();
      this.updateConnectionStatus(connectionId, 'connected');
      return result;
    } catch (error) {
      console.error('Devon.ai request failed:', error);
      this.updateConnectionStatus(connectionId, 'error');
      throw error;
    }
  }

  // MCP Protocol Implementation
  async initializeMCP(connectionId: string): Promise<void> {
    const connection = this.connections.get(connectionId);
    if (!connection) {
      throw new Error('Connection not found');
    }

    const wsUrl = connection.url.replace('http', 'ws') + '/mcp';
    const ws = new WebSocket(wsUrl);

    return new Promise((resolve, reject) => {
      ws.onopen = () => {
        console.log(`MCP session initialized for ${connection.name}`);
        
        // Send initialization message
        const initMessage: MCPMessage = {
          id: `init_${Date.now()}`,
          method: 'initialize',
          params: {
            protocolVersion: '2024-11-05',
            capabilities: {
              roots: { listChanged: true },
              sampling: {},
              resources: { subscribe: true, listChanged: true },
              tools: { listChanged: true },
              prompts: { listChanged: true }
            },
            clientInfo: {
              name: 'IndustrialAutomationPlatform',
              version: '1.0.0'
            }
          },
          timestamp: new Date()
        };

        ws.send(JSON.stringify(initMessage));
        this.mcpSessions.set(connectionId, ws);
        resolve();
      };

      ws.onerror = (error) => {
        console.error('MCP WebSocket error:', error);
        reject(error);
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.handleMCPMessage(connectionId, message);
        } catch (error) {
          console.error('Error parsing MCP message:', error);
        }
      };

      ws.onclose = () => {
        console.log(`MCP session closed for ${connection.name}`);
        this.mcpSessions.delete(connectionId);
        this.updateConnectionStatus(connectionId, 'disconnected');
      };
    });
  }

  private handleMCPMessage(connectionId: string, message: any) {
    console.log(`MCP message from ${connectionId}:`, message);
    
    // Handle different MCP message types
    switch (message.method) {
      case 'initialized':
        this.updateConnectionStatus(connectionId, 'connected');
        break;
      case 'notifications/tools/list_changed':
        // Handle tool list changes
        this.refreshToolsList(connectionId);
        break;
      case 'notifications/resources/list_changed':
        // Handle resource list changes
        this.refreshResourcesList(connectionId);
        break;
      default:
        console.log('Unhandled MCP message type:', message.method);
    }
  }

  async sendMCPRequest(connectionId: string, method: string, params: any): Promise<any> {
    const ws = this.mcpSessions.get(connectionId);
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      throw new Error('MCP session not available');
    }

    const messageId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const message: MCPMessage = {
      id: messageId,
      method,
      params,
      timestamp: new Date()
    };

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('MCP request timeout'));
      }, 30000);

      const messageHandler = (event: MessageEvent) => {
        try {
          const response = JSON.parse(event.data);
          if (response.id === messageId) {
            clearTimeout(timeout);
            ws.removeEventListener('message', messageHandler);
            
            if (response.error) {
              reject(new Error(response.error.message));
            } else {
              resolve(response.result);
            }
          }
        } catch (error) {
          console.error('Error parsing MCP response:', error);
        }
      };

      ws.addEventListener('message', messageHandler);
      ws.send(JSON.stringify(message));
    });
  }

  async getAvailableTools(connectionId: string): Promise<any[]> {
    try {
      const result = await this.sendMCPRequest(connectionId, 'tools/list', {});
      return result.tools || [];
    } catch (error) {
      console.error('Failed to get available tools:', error);
      return [];
    }
  }

  async callTool(connectionId: string, toolName: string, arguments_: any): Promise<any> {
    try {
      return await this.sendMCPRequest(connectionId, 'tools/call', {
        name: toolName,
        arguments: arguments_
      });
    } catch (error) {
      console.error('Tool call failed:', error);
      throw error;
    }
  }

  private async refreshToolsList(connectionId: string) {
    // Implementation for refreshing tools list
    console.log(`Refreshing tools list for connection ${connectionId}`);
  }

  private async refreshResourcesList(connectionId: string) {
    // Implementation for refreshing resources list
    console.log(`Refreshing resources list for connection ${connectionId}`);
  }

  // Public getters
  getConnections(): APIConnection[] {
    return Array.from(this.connections.values());
  }

  getConnection(connectionId: string): APIConnection | undefined {
    return this.connections.get(connectionId);
  }

  removeConnection(connectionId: string): boolean {
    const ws = this.mcpSessions.get(connectionId);
    if (ws) {
      ws.close();
      this.mcpSessions.delete(connectionId);
    }
    return this.connections.delete(connectionId);
  }
}

export const apiService = new APIService();

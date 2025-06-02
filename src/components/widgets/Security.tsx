
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Key, AlertTriangle, CheckCircle } from "lucide-react";

interface SecurityEvent {
  id: string;
  type: 'login' | 'access_denied' | 'permission_changed' | 'device_access';
  user: string;
  timestamp: Date;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

interface User {
  id: string;
  username: string;
  name: string;
  role: string;
  lastLogin: Date;
  status: 'active' | 'locked' | 'disabled';
}

export const Security = () => {
  const [securityEvents] = useState<SecurityEvent[]>([
    {
      id: '1',
      type: 'login',
      user: 'operator1',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      description: 'User logged in successfully',
      severity: 'low'
    },
    {
      id: '2',
      type: 'access_denied',
      user: 'maintenance_user',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      description: 'Attempted to access PLC configuration without permission',
      severity: 'high'
    },
    {
      id: '3',
      type: 'device_access',
      user: 'engineer1',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      description: 'Connected to PLC-001 for programming',
      severity: 'medium'
    }
  ]);

  const [users] = useState<User[]>([
    {
      id: '1',
      username: 'operator1',
      name: 'John Operator',
      role: 'Operator',
      lastLogin: new Date(Date.now() - 5 * 60 * 1000),
      status: 'active'
    },
    {
      id: '2',
      username: 'engineer1',
      name: 'Jane Engineer',
      role: 'Engineer',
      lastLogin: new Date(Date.now() - 30 * 60 * 1000),
      status: 'active'
    },
    {
      id: '3',
      username: 'maintenance_user',
      name: 'Bob Maintenance',
      role: 'Maintenance',
      lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'locked'
    }
  ]);

  const getEventIcon = (type: SecurityEvent['type']) => {
    switch (type) {
      case 'login':
        return <Key className="w-4 h-4" />;
      case 'access_denied':
        return <AlertTriangle className="w-4 h-4" />;
      case 'permission_changed':
        return <Users className="w-4 h-4" />;
      case 'device_access':
        return <Shield className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: SecurityEvent['severity']) => {
    switch (severity) {
      case 'low':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'high':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: User['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'locked':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'disabled':
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
      default:
        return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Security Events */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Security Events
        </h3>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {securityEvents.map(event => (
            <div key={event.id} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
              <div className={getSeverityColor(event.severity)}>
                {getEventIcon(event.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{event.user}</span>
                  <span className="text-xs text-slate-500">
                    {event.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-1">{event.description}</p>
                <Badge 
                  variant={event.severity === 'high' ? 'destructive' : 'secondary'}
                  className="text-xs mt-1"
                >
                  {event.severity}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Active Users */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Active Users
        </h3>
        <div className="space-y-3">
          {users.map(user => (
            <div key={user.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(user.status)}
                <div>
                  <h4 className="font-medium text-sm">{user.name}</h4>
                  <p className="text-xs text-slate-500">@{user.username}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="text-xs mb-1">
                  {user.role}
                </Badge>
                <p className="text-xs text-slate-500">
                  {user.lastLogin.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" size="sm" className="w-full">
            Manage Users & Permissions
          </Button>
        </div>
      </Card>
    </div>
  );
};

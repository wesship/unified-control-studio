
import { useState } from "react";
import { 
  Cpu, 
  Monitor, 
  Network, 
  BarChart3, 
  Home,
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "plc", label: "PLC Programming", icon: Cpu },
  { id: "hmi", label: "HMI Designer", icon: Monitor },
  { id: "devices", label: "Device Manager", icon: Network },
  { id: "monitor", label: "Data Monitor", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

export const Sidebar = ({ activeModule, setActiveModule, collapsed, setCollapsed }: SidebarProps) => {
  return (
    <div className={cn(
      "fixed left-0 top-0 h-full bg-slate-900 text-white transition-all duration-300 z-30",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-blue-400">AutoStudio</h1>
              <p className="text-xs text-slate-400">Industrial Platform</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 hover:bg-slate-700 rounded"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={cn(
                "w-full flex items-center p-3 hover:bg-slate-700 transition-colors",
                activeModule === item.id && "bg-blue-600 border-r-2 border-blue-400"
              )}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!collapsed && (
                <span className="ml-3 text-sm font-medium">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Status Indicator */}
      <div className="absolute bottom-4 left-4 right-4">
        {!collapsed && (
          <div className="bg-slate-800 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">System Status</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">Online</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

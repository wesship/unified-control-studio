
import { Bell, User, Save, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  activeModule: string;
  toggleSidebar: () => void;
}

export const TopBar = ({ activeModule }: TopBarProps) => {
  const getModuleTitle = () => {
    switch (activeModule) {
      case "dashboard": return "Dashboard";
      case "plc": return "PLC Programming";
      case "hmi": return "HMI Designer";
      case "devices": return "Device Manager";
      case "monitor": return "Data Monitor";
      default: return "AutoStudio";
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{getModuleTitle()}</h2>
          <p className="text-sm text-slate-500">Industrial Automation Platform</p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Control Buttons */}
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
              <Play className="w-4 h-4 mr-2" />
              Run
            </Button>
            <Button variant="outline" size="sm">
              <Square className="w-4 h-4 mr-2" />
              Stop
            </Button>
          </div>

          {/* Notifications */}
          <button className="relative p-2 hover:bg-slate-100 rounded-full">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
          </button>

          {/* User Menu */}
          <button className="flex items-center space-x-2 p-2 hover:bg-slate-100 rounded-lg">
            <User className="w-5 h-5 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};

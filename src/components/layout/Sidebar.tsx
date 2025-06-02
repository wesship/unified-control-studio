
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Cpu, 
  Monitor, 
  Network, 
  BarChart3, 
  Settings,
  GitBranch,
  Shield
} from "lucide-react";

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
  { id: "state-machine", label: "State Machine", icon: GitBranch },
  { id: "devices", label: "Device Manager", icon: Network },
  { id: "gateway", label: "Protocol Gateway", icon: Shield },
  { id: "monitor", label: "Data Monitor", icon: BarChart3 },
];

export const Sidebar = ({ activeModule, setActiveModule, collapsed }: SidebarProps) => {
  return (
    <div className={cn(
      "fixed left-0 top-0 h-full bg-slate-900 text-white transition-all duration-300 z-40",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Cpu className="w-4 h-4" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-lg">AutomationStudio</h1>
              <p className="text-xs text-slate-400">Industrial Control Platform</p>
            </div>
          )}
        </div>
      </div>

      <nav className="mt-8">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeModule === item.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start text-left h-12 rounded-none",
                collapsed ? "px-4" : "px-6",
                activeModule === item.id && "bg-blue-600 hover:bg-blue-700"
              )}
              onClick={() => setActiveModule(item.id)}
            >
              <Icon className="w-5 h-5" />
              {!collapsed && <span className="ml-3">{item.label}</span>}
            </Button>
          );
        })}
      </nav>

      <div className="absolute bottom-4 left-0 right-0 px-4">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-left h-12",
            collapsed ? "px-4" : "px-6"
          )}
        >
          <Settings className="w-5 h-5" />
          {!collapsed && <span className="ml-3">Settings</span>}
        </Button>
      </div>
    </div>
  );
};

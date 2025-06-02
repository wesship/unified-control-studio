
import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { PLCProgramming } from "@/components/modules/PLCProgramming";
import { HMIDesigner } from "@/components/modules/HMIDesigner";
import { DeviceManager } from "@/components/modules/DeviceManager";
import { DataMonitor } from "@/components/modules/DataMonitor";
import { Dashboard } from "@/components/modules/Dashboard";

const Index = () => {
  const [activeModule, setActiveModule] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderActiveModule = () => {
    switch (activeModule) {
      case "dashboard":
        return <Dashboard />;
      case "plc":
        return <PLCProgramming />;
      case "hmi":
        return <HMIDesigner />;
      case "devices":
        return <DeviceManager />;
      case "monitor":
        return <DataMonitor />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar 
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        <TopBar 
          activeModule={activeModule}
          toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <main className="flex-1 p-6 overflow-auto">
          {renderActiveModule()}
        </main>
      </div>
    </div>
  );
};

export default Index;

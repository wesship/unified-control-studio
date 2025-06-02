
import { Card } from "@/components/ui/card";
import { SystemOverview } from "@/components/widgets/SystemOverview";
import { AlarmPanel } from "@/components/widgets/AlarmPanel";
import { TrendChart } from "@/components/widgets/TrendChart";
import { DeviceStatus } from "@/components/widgets/DeviceStatus";
import { Security } from "@/components/widgets/Security";
import { Enhanced3DViewer } from "@/components/widgets/Enhanced3DViewer";

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* System Overview Cards */}
      <SystemOverview />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Trends and 3D Viewer */}
        <div className="lg:col-span-2 space-y-6">
          <TrendChart />
          <Enhanced3DViewer />
        </div>

        {/* Right Column - Status & Alarms */}
        <div className="space-y-6">
          <DeviceStatus />
          <AlarmPanel />
        </div>
      </div>

      {/* Security Section */}
      <Security />
    </div>
  );
};

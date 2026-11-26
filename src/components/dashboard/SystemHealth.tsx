import React from "react";
import { systemHealthMetrics } from "@/lib/mock-data";

export function SystemHealth() {
  return (
    <div className="system-health-bar bg-[#111A28] border border-[#1F293D] rounded-xl px-5 py-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-200">
      {/* Left side: System status indicator */}
      <div className="flex items-center gap-3.5 sm:gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="system-health-pulse-ring w-5 h-5 rounded-full border flex items-center justify-center">
            <span className="system-health-pulse-dot w-2 h-2 rounded-full" />
          </div>
          <span className="system-health-title text-xs font-bold tracking-wide">
            System Status
          </span>
        </div>

        <div className="system-health-status-badge inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full">
          <span className="system-health-pulse-dot w-1.5 h-1.5 rounded-full" />
          <span>All Systems Operational</span>
        </div>
      </div>

      {/* Right side: Component health metrics */}
      <div className="flex items-center gap-2.5 sm:gap-4 flex-wrap text-xs font-medium">
        {systemHealthMetrics.map((item) => (
          <div
            key={item.name}
            className="system-health-metric-chip flex items-center gap-2 px-2.5 py-1 rounded-lg"
          >
            <span className="system-health-metric-dot w-1.5 h-1.5 rounded-full flex-shrink-0" />
            <span className="system-health-metric-name">
              {item.name}
            </span>
            <span className="system-health-metric-val">
              {item.uptimePercentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

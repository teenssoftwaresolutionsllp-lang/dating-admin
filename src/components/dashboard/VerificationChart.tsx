"use client";

import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { verificationStatusData } from "@/lib/mock-data";

interface TooltipPayloadItem {
  name: string;
  value: number;
  payload: {
    percentage: number;
    color: string;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div className="bg-[#090E1A] border border-[#1F293D] p-2.5 rounded-xl shadow-2xl text-xs space-y-1">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: item.payload.color }}
          />
          <span className="font-semibold text-white">{item.name}</span>
        </div>
        <p className="text-slate-300">
          Count: <span className="font-bold text-white">{item.value.toLocaleString()}</span>
        </p>
        <p className="text-slate-400">Share: {item.payload.percentage}%</p>
      </div>
    );
  }
  return null;
};

export function VerificationChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const total = 2482;

  return (
    <div className="bg-[#111A28] border border-[#1F293D] rounded-xl p-5 flex flex-col justify-between h-full min-h-[330px]">
      <h3 className="text-sm font-bold text-white tracking-tight mb-2">
        User Verification Status
      </h3>

      <div className="flex-1 flex flex-row items-center justify-between gap-2">
        {/* Donut Chart with Center Text */}
        <div className="relative w-44 h-44 flex-shrink-0">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={verificationStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="count"
                  nameKey="status"
                  stroke="#111A28"
                  strokeWidth={2}
                >
                  {verificationStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
              Loading...
            </div>
          )}

          {/* Centered Total */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold text-white tracking-tight">
              {total.toLocaleString()}
            </span>
            <span className="text-[10px] text-[#718096] font-medium">
              Total Pending
            </span>
          </div>
        </div>

        {/* Legend Rows */}
        <div className="flex-1 space-y-3 pl-1 pr-1">
          {verificationStatusData.map((item) => (
            <div
              key={item.status}
              className="flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-300 text-[11px] font-medium">{item.status}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="font-semibold text-white text-[11px]">
                  {item.count.toLocaleString()}
                </span>
                <span className="text-[#718096] text-[11px] w-9 text-right font-mono">
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

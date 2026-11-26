"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { userGrowthData } from "@/lib/mock-data";

interface TooltipPayloadItem {
  value: number;
  dataKey: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#090E1A] border border-[#1F293D] p-2.5 rounded-xl shadow-2xl text-xs space-y-1">
        <p className="font-semibold text-slate-300">{label}</p>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#EC4899]" />
          <span className="text-slate-400">New Users:</span>
          <span className="font-bold text-white">
            {payload[0]?.value?.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
          <span className="text-slate-400">Active Users:</span>
          <span className="font-bold text-white">
            {payload[1]?.value?.toLocaleString()}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export function UserGrowthChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="bg-[#111A28] border border-[#1F293D] rounded-xl p-5 flex flex-col justify-between h-full min-h-[330px]">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-white tracking-tight">
          User Growth
        </h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#EC4899]" />
            <span className="text-slate-300 text-[11px] font-medium">New Users</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
            <span className="text-slate-300 text-[11px] font-medium">Active Users</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="flex-1 w-full h-full min-h-[220px]">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={userGrowthData}
              margin={{ top: 15, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="growthBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="growthPink" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EC4899" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#EC4899" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="2 2"
                stroke="#1B2537"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke="#64748B"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: "#1B2537" }}
              />
              <YAxis
                stroke="#64748B"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => (val === 0 ? "0" : `${val / 1000}K`)}
                domain={[0, 20000]}
                ticks={[0, 5000, 10000, 15000, 20000]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="newUsers"
                stroke="#EC4899"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#growthPink)"
                dot={{ r: 3.5, fill: "#EC4899", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#EC4899" }}
              />
              <Area
                type="monotone"
                dataKey="activeUsers"
                stroke="#38BDF8"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#growthBlue)"
                dot={{ r: 3.5, fill: "#38BDF8", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#38BDF8" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
            Loading chart...
          </div>
        )}
      </div>
    </div>
  );
}

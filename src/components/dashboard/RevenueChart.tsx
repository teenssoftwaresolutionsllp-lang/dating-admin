"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { revenueOverviewData } from "@/lib/mock-data";
import { formatINR } from "@/lib/utils";

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
          <span className="text-slate-400">Gross:</span>
          <span className="font-bold text-white">
            {formatINR(payload[0]?.value || 0)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#6366F1]" />
          <span className="text-slate-400">Net:</span>
          <span className="font-bold text-white">
            {formatINR(payload[1]?.value || 0)}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export function RevenueChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatYAxis = (val: number) => {
    if (val === 0) return "₹ 0";
    const lakhs = val / 100000;
    return `₹ ${lakhs}L`;
  };

  return (
    <div className="bg-[#111A28] border border-[#1F293D] rounded-xl p-5 flex flex-col justify-between h-[330px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-white tracking-tight">
          Revenue Overview
        </h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#EC4899]" />
            <span className="text-slate-300 text-[11px] font-medium">Gross Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#6366F1]" />
            <span className="text-slate-300 text-[11px] font-medium">Net Revenue</span>
          </div>
        </div>
      </div>

      {/* Bar Chart Canvas */}
      <div className="flex-1 w-full h-full min-h-[220px]">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={revenueOverviewData}
              margin={{ top: 15, right: 10, left: -10, bottom: 0 }}
              barGap={3}
            >
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
                tickFormatter={formatYAxis}
                ticks={[0, 200000, 400000, 600000, 800000]}
                domain={[0, 900000]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="grossRevenue"
                fill="#EC4899"
                radius={[3, 3, 0, 0]}
                maxBarSize={11}
              />
              <Bar
                dataKey="netRevenue"
                fill="#6366F1"
                radius={[3, 3, 0, 0]}
                maxBarSize={11}
              />
            </BarChart>
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

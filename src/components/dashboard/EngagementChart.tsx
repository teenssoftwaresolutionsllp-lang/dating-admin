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
import { engagementTrendData } from "@/lib/mock-data";

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
      <div className="bg-[#090E1A] border border-[#1F293D] p-3 rounded-xl shadow-2xl text-xs space-y-1.5 min-w-[160px]">
        <p className="font-semibold text-slate-300 border-b border-[#1F293D] pb-1">{label}</p>
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-[#EC4899]" />
            Likes:
          </span>
          <span className="font-bold text-white">
            {payload.find((p) => p.dataKey === "likes")?.value?.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-[#A855F7]" />
            Matches:
          </span>
          <span className="font-bold text-white">
            {payload.find((p) => p.dataKey === "matches")?.value?.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
            Views:
          </span>
          <span className="font-bold text-white">
            {payload.find((p) => p.dataKey === "profileViews")?.value?.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
            Messages:
          </span>
          <span className="font-bold text-white">
            {payload.find((p) => p.dataKey === "messages")?.value?.toLocaleString()}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export function EngagementChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="bg-[#111A28] border border-[#1F293D] rounded-xl p-5 flex flex-col justify-between h-full min-h-[330px]">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
        <h3 className="text-sm font-bold text-white tracking-tight">
          Engagement Overview
        </h3>
        <div className="flex items-center gap-3 text-xs flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#EC4899]" />
            <span className="text-slate-300 text-[11px] font-medium">Likes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#A855F7]" />
            <span className="text-slate-300 text-[11px] font-medium">Matches</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
            <span className="text-slate-300 text-[11px] font-medium">Views</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
            <span className="text-slate-300 text-[11px] font-medium">Messages</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="flex-1 w-full h-full min-h-[220px]">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={engagementTrendData}
              margin={{ top: 15, right: 10, left: -15, bottom: 0 }}
            >
              <defs>
                <linearGradient id="engPink" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EC4899" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#EC4899" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="engPurple" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#A855F7" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="engBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="engAmber" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
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
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="messages"
                stroke="#F59E0B"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#engAmber)"
              />
              <Area
                type="monotone"
                dataKey="profileViews"
                stroke="#38BDF8"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#engBlue)"
              />
              <Area
                type="monotone"
                dataKey="likes"
                stroke="#EC4899"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#engPink)"
              />
              <Area
                type="monotone"
                dataKey="matches"
                stroke="#A855F7"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#engPurple)"
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

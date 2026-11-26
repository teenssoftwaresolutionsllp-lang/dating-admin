"use client";

import React from "react";
import {
  User,
  Users,
  UserPlus,
  Heart,
  MessageSquare,
  ShieldAlert,
  FileText,
  Crown,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { MetricCardData } from "@/types/dashboard";

interface MetricCardProps {
  data: MetricCardData;
}

export function MetricCard({ data }: MetricCardProps) {
  // Generate SVG path for the sparkline
  const width = 100;
  const height = 36;
  const points = data.sparklineData;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const coords = points.map((val, idx) => {
    const x = (idx / (points.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 8) - 4;
    return { x, y };
  });

  const linePath = coords.reduce((acc, curr, idx) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    const prev = coords[idx - 1];
    const cpX = (prev.x + curr.x) / 2;
    return `${acc} C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
  }, "");

  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

  // Custom Icon Rendering to match reference screenshot exactly
  const renderIcon = () => {
    switch (data.id) {
      case "dau":
        return <User size={19} className="text-[#10B981]" />;
      case "wau":
        return <Users size={19} className="text-[#3B82F6]" />;
      case "mau":
        return <User size={19} className="text-[#A855F7]" />;
      case "new_users":
        return <UserPlus size={19} className="text-[#F59E0B]" />;
      case "matches":
        return <Heart size={19} className="text-[#EC4899] stroke-[2.2]" />;
      case "messages":
        return <MessageSquare size={19} className="text-[#38BDF8]" />;
      case "reports":
        return <ShieldAlert size={19} className="text-[#EF4444]" />;
      case "verification_queue":
        return <FileText size={19} className="text-[#A855F7]" />;
      case "premium_users":
        return <Crown size={19} className="text-[#F59E0B] fill-[#F59E0B]/20" />;
      case "gross_revenue":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 7c0-2-2.5-3-7-3S5 5 5 7" />
            <path d="M5 7c0 2 2 3.5 3.5 4.5l-1.5 8.5h10l-1.5-8.5C17 10.5 19 9 19 7Z" />
            <path d="M12 11v5" />
            <path d="M10 13h4" />
          </svg>
        );
      case "total_users":
        return <Users size={19} className="text-[#8B5CF6]" />;
      case "net_revenue":
        return <TrendingUp size={19} className="text-[#3B82F6]" />;
      default:
        return <TrendingUp size={19} />;
    }
  };

  return (
    <div className="bg-[#111A28] border border-[#1F293D] hover:border-slate-600/70 rounded-xl p-4 flex flex-col justify-between transition-all duration-150">
      {/* Top Header: Icon & Title */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            backgroundColor: data.iconBg,
          }}
        >
          {renderIcon()}
        </div>

        <div className="flex flex-col overflow-hidden">
          {data.badgeLabel ? (
            <>
              <span className="text-xs font-bold text-white tracking-tight leading-tight">
                {data.badgeLabel}
              </span>
              <span className="text-[11px] text-[#718096] font-medium leading-tight mt-0.5 truncate">
                {data.title}
              </span>
            </>
          ) : (
            <span className="text-xs font-medium text-white tracking-tight truncate">
              {data.title}
            </span>
          )}
        </div>
      </div>

      {/* Main Stat Value */}
      <div className="my-2.5">
        <div className="text-2xl font-bold text-white tracking-tight">
          {data.value}
        </div>
      </div>

      {/* Footer: Trend & Sparkline */}
      <div className="flex items-end justify-between gap-1 mt-auto">
        <div className="flex flex-col text-[11px] leading-tight">
          <span
            className={`font-semibold text-xs flex items-center gap-0.5 ${
              data.isPositive ? "text-[#10B981]" : "text-[#EF4444]"
            }`}
          >
            {data.change}
          </span>
          <span className="text-[#718096] text-[10px] mt-0.5 whitespace-nowrap">
            {data.comparisonPeriod}
          </span>
        </div>

        {/* Sparkline */}
        <div className="w-[90px] h-[34px] flex-shrink-0">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full overflow-visible"
          >
            <defs>
              <linearGradient
                id={`grad-${data.id}`}
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stopColor={data.sparklineColor}
                  stopOpacity="0.45"
                />
                <stop
                  offset="100%"
                  stopColor={data.sparklineColor}
                  stopOpacity="0.0"
                />
              </linearGradient>
            </defs>
            <path
              d={areaPath}
              fill={`url(#grad-${data.id})`}
            />
            <path
              d={linePath}
              fill="none"
              stroke={data.sparklineColor}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

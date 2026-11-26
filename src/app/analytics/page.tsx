"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { UserGrowthChart } from "@/components/dashboard/UserGrowthChart";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("Last 7 days");

  const ageGroups = [
    { range: "18 - 21 yrs", percent: 22, count: "41,400 users" },
    { range: "22 - 26 yrs", percent: 46, count: "86,670 users" },
    { range: "27 - 32 yrs", percent: 21, count: "39,560 users" },
    { range: "33 - 40 yrs", percent: 8, count: "15,070 users" },
    { range: "40+ yrs", percent: 3, count: "5,720 users" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Platform Analytics"
          description="Consolidated intelligence portal for daily active cohorts, demographics, retention, and user growth metrics."
          actions={
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-[#151F30] border border-[#263247] text-xs text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-pink-500 cursor-pointer"
            >
              <option value="Today">Today</option>
              <option value="Last 7 days">Last 7 days</option>
              <option value="Last 30 days">Last 30 days</option>
              <option value="Year to Date">Year to Date</option>
            </select>
          }
        />

        {/* Top Stat Row: DAU, WAU, MAU, Retention, Growth, Ratios */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">Daily Active (DAU)</span>
            <p className="text-xl font-bold text-emerald-400 mt-1">8,432</p>
            <span className="text-[10px] text-emerald-400">↑ 12.5% vs 7d</span>
          </div>
          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">Weekly Active (WAU)</span>
            <p className="text-xl font-bold text-blue-400 mt-1">52,781</p>
            <span className="text-[10px] text-emerald-400">↑ 8.3% vs 7d</span>
          </div>
          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">Monthly Active (MAU)</span>
            <p className="text-xl font-bold text-purple-400 mt-1">188,420</p>
            <span className="text-[10px] text-emerald-400">↑ 6.7% MoM</span>
          </div>
          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">New Registrations</span>
            <p className="text-xl font-bold text-amber-400 mt-1">12,693</p>
            <span className="text-[10px] text-emerald-400">↑ 15.2% rate</span>
          </div>
          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">30-Day Retention</span>
            <p className="text-xl font-bold text-cyan-400 mt-1">78.4%</p>
            <span className="text-[10px] text-emerald-400">Top 5% dating SaaS</span>
          </div>
          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">Gender Ratio (M/F)</span>
            <p className="text-xl font-bold text-pink-400 mt-1">58% / 42%</p>
            <span className="text-[10px] text-slate-400">Balanced network</span>
          </div>
        </div>

        {/* User Growth Chart & Age Demographics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7">
            <UserGrowthChart />
          </div>

          <div className="lg:col-span-5 p-5 rounded-2xl bg-[#151F30] border border-[#263247] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">
                Age Demographic Spread
              </h3>
              <span className="text-xs text-slate-400 font-mono">188K verified</span>
            </div>
            <div className="space-y-3 pt-1">
              {ageGroups.map((g) => (
                <div key={g.range} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{g.range}</span>
                    <span className="text-slate-400 font-mono">
                      {g.count} ({g.percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#0D1424] h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-pink-500 h-full rounded-full"
                      style={{ width: `${g.percent * 2}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#263247] text-xs text-slate-400 flex items-center justify-between">
              <span>Median User Age</span>
              <span className="text-white font-bold">25.4 years (Gen Z & Millennial)</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

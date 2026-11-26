"use client";

import React from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { TrendingUp, DollarSign, ArrowUpRight, Zap, Gift, Heart, Shield } from "lucide-react";

export default function RevenuePage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Revenue & Financial Analytics"
          description="Gross earnings, net settlements, tax deductions, and recurring stream health."
        />

        {/* Financial Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">Gross Revenue (7D)</span>
            <p className="text-xl font-bold text-emerald-400 mt-1">₹4,82,630</p>
            <span className="text-[10px] text-emerald-400 font-medium">↑ 13.6% vs last week</span>
          </div>
          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">Net Settled Revenue</span>
            <p className="text-xl font-bold text-white mt-1">₹3,95,750</p>
            <span className="text-[10px] text-slate-400">After GST & gateway fees</span>
          </div>
          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">Average Revenue Per User</span>
            <p className="text-xl font-bold text-amber-400 mt-1">₹620</p>
            <span className="text-[10px] text-emerald-400 font-medium">↑ 4.2% MoM</span>
          </div>
          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">Refund Claims Paid</span>
            <p className="text-xl font-bold text-rose-400 mt-1">₹12,400</p>
            <span className="text-[10px] text-slate-400">0.25% of gross</span>
          </div>
        </div>

        {/* Revenue Chart */}
        <div>
          <RevenueChart />
        </div>

        {/* Revenue Sources Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#151F30] border border-[#263247] space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-semibold text-slate-200">
                <Shield size={14} className="text-indigo-400" />
                Memberships
              </span>
              <span>65%</span>
            </div>
            <p className="text-lg font-bold text-white">₹3,13,700</p>
            <div className="w-full bg-[#0D1424] h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full w-[65%]" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#151F30] border border-[#263247] space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-semibold text-slate-200">
                <Zap size={14} className="text-amber-400" />
                Profile Boosts
              </span>
              <span>18%</span>
            </div>
            <p className="text-lg font-bold text-white">₹86,870</p>
            <div className="w-full bg-[#0D1424] h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full w-[18%]" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#151F30] border border-[#263247] space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-semibold text-slate-200">
                <Heart size={14} className="text-pink-400" />
                SuperLikes
              </span>
              <span>12%</span>
            </div>
            <p className="text-lg font-bold text-white">₹57,910</p>
            <div className="w-full bg-[#0D1424] h-2 rounded-full overflow-hidden">
              <div className="bg-pink-500 h-full w-[12%]" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#151F30] border border-[#263247] space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-semibold text-slate-200">
                <Gift size={14} className="text-cyan-400" />
                In-Chat Gifts
              </span>
              <span>5%</span>
            </div>
            <p className="text-lg font-bold text-white">₹24,150</p>
            <div className="w-full bg-[#0D1424] h-2 rounded-full overflow-hidden">
              <div className="bg-cyan-500 h-full w-[5%]" />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}


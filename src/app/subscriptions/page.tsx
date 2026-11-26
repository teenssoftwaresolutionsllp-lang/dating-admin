"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { Crown, Sparkles, Check, CreditCard, Shield, Edit3, TrendingUp, Users } from "lucide-react";

interface Subscription {
  id: string;
  userId: string;
  userName: string;
  plan: "Gold" | "Platinum" | "VIP Diamond" | "Plus";
  billingCycle: "Monthly" | "Quarterly" | "Annual";
  amount: string;
  renewsOn: string;
  status: "Active" | "Pending" | "Cancelled";
}

const mockSubs: Subscription[] = [
  { id: "s1", userId: "#10482", userName: "Aarav Sharma", plan: "Platinum", billingCycle: "Monthly", amount: "₹999", renewsOn: "Nov 28, 2026", status: "Active" },
  { id: "s2", userId: "#10481", userName: "Sneha Reddy", plan: "Gold", billingCycle: "Annual", amount: "₹4,999", renewsOn: "Oct 28, 2027", status: "Active" },
  { id: "s3", userId: "#10479", userName: "Pooja Verma", plan: "VIP Diamond", billingCycle: "Quarterly", amount: "₹4,499", renewsOn: "Jan 27, 2027", status: "Active" },
  { id: "s4", userId: "#10477", userName: "Arjun Kapoor", plan: "Plus", billingCycle: "Monthly", amount: "₹299", renewsOn: "Nov 26, 2026", status: "Active" },
  { id: "s5", userId: "#10475", userName: "Kabir Mehta", plan: "Gold", billingCycle: "Monthly", amount: "₹599", renewsOn: "Nov 25, 2026", status: "Cancelled" },
  { id: "s6", userId: "#10473", userName: "Rohan Khanna", plan: "Platinum", billingCycle: "Quarterly", amount: "₹2,699", renewsOn: "Dec 14, 2026", status: "Active" },
];

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState<Subscription[]>(mockSubs);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const columns: Column<Subscription>[] = [
    {
      key: "userId",
      header: "User ID",
      render: (row) => <span className="font-mono text-slate-300 font-medium">{row.userId}</span>,
    },
    {
      key: "userName",
      header: "Member Name",
      render: (row) => <span className="font-semibold text-white">{row.userName}</span>,
    },
    {
      key: "plan",
      header: "Tier / Plan",
      render: (row) => (
        <span className="font-semibold flex items-center gap-1.5 text-amber-300">
          <Crown size={14} className="text-amber-400" />
          {row.plan}
        </span>
      ),
    },
    {
      key: "billingCycle",
      header: "Cycle",
      render: (row) => <span className="text-slate-400 font-mono text-xs">{row.billingCycle}</span>,
    },
    {
      key: "amount",
      header: "Billing Amount",
      render: (row) => <span className="font-mono font-bold text-slate-100">{row.amount}</span>,
    },
    {
      key: "renewsOn",
      header: "Next Renewal",
      render: (row) => <span className="text-slate-400 font-mono text-xs">{row.renewsOn}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge status={row.status} size="sm" dot />,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Subscriptions & Plans"
          description="Manage monetization tiers, recurring membership plans, subscriber cohorts, and billing cycles."
        />

        {toast && (
          <div className="p-3 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs flex items-center justify-between">
            <span>{toast}</span>
            <button onClick={() => setToast(null)}>✕</button>
          </div>
        )}

        {/* Financial KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">Total Premium Users</span>
            <p className="text-xl font-bold text-white mt-1">18,732</p>
            <span className="text-[10px] text-emerald-400">9.9% of user base</span>
          </div>
          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">Monthly Recurring (MRR)</span>
            <p className="text-xl font-bold text-emerald-400 mt-1">₹28,40,000</p>
            <span className="text-[10px] text-emerald-400">↑ 14.2% MoM growth</span>
          </div>
          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">Subscription Churn</span>
            <p className="text-xl font-bold text-cyan-400 mt-1">2.4%</p>
            <span className="text-[10px] text-slate-400">Industry benchmark 4.8%</span>
          </div>
          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">ARPU (Per Paying User)</span>
            <p className="text-xl font-bold text-amber-400 mt-1">₹152</p>
            <span className="text-[10px] text-emerald-400">↑ ₹18 vs Q2</span>
          </div>
        </div>

        {/* Plan Configuration Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">
              Configured Tier Packages & Benefits
            </h3>
            <span className="text-xs text-slate-400 font-mono">4 live offerings</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#151F30] border border-[#263247] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Plus Tier</span>
                  <span className="text-xs text-slate-400 font-mono">4,120 active</span>
                </div>
                <p className="text-2xl font-bold text-white mt-2">₹299<span className="text-xs text-slate-400">/mo</span></p>
                <ul className="text-xs text-slate-300 mt-3 space-y-1.5">
                  <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-400" /> Unlimited right swipes</li>
                  <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-400" /> 1 free Boost / week</li>
                  <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-400" /> Rewind last pass</li>
                </ul>
              </div>
              <button
                onClick={() => showToast("Opened Plus Tier pricing editor (Demo)")}
                className="mt-4 w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-[#263247]"
              >
                Configure Tier
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-[#151F30] border border-amber-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Gold Tier</span>
                  <span className="text-xs text-slate-400 font-mono">8,940 active</span>
                </div>
                <p className="text-2xl font-bold text-white mt-2">₹599<span className="text-xs text-slate-400">/mo</span></p>
                <ul className="text-xs text-slate-300 mt-3 space-y-1.5">
                  <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-400" /> See who likes you</li>
                  <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-400" /> Passport worldwide</li>
                  <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-400" /> 5 Super Likes / day</li>
                </ul>
              </div>
              <button
                onClick={() => showToast("Opened Gold Tier pricing editor (Demo)")}
                className="mt-4 w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-[#263247]"
              >
                Configure Tier
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-[#151F30] border border-purple-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Platinum Tier</span>
                  <span className="text-xs text-slate-400 font-mono">4,310 active</span>
                </div>
                <p className="text-2xl font-bold text-white mt-2">₹999<span className="text-xs text-slate-400">/mo</span></p>
                <ul className="text-xs text-slate-300 mt-3 space-y-1.5">
                  <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-400" /> Message before match</li>
                  <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-400" /> Priority Likes queue</li>
                  <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-400" /> Read receipts enabled</li>
                </ul>
              </div>
              <button
                onClick={() => showToast("Opened Platinum Tier pricing editor (Demo)")}
                className="mt-4 w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-[#263247]"
              >
                Configure Tier
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-[#151F30] border border-pink-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">VIP Diamond</span>
                  <span className="text-xs text-slate-400 font-mono">1,362 active</span>
                </div>
                <p className="text-2xl font-bold text-white mt-2">₹1,999<span className="text-xs text-slate-400">/mo</span></p>
                <ul className="text-xs text-slate-300 mt-3 space-y-1.5">
                  <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-400" /> Curated concierge matches</li>
                  <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-400" /> Incognito browsing mode</li>
                  <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-400" /> Dedicated priority support</li>
                </ul>
              </div>
              <button
                onClick={() => showToast("Opened VIP Diamond pricing editor (Demo)")}
                className="mt-4 w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-[#263247]"
              >
                Configure Tier
              </button>
            </div>
          </div>
        </div>

        {/* Subscriptions Table */}
        <DataTable
          data={subs}
          columns={columns}
          searchPlaceholder="Search subscribers by name, plan, or user ID..."
          searchKey={(s) => `${s.userName} ${s.userId} ${s.plan}`}
          filterOptions={{
            label: "Plan",
            key: "plan",
            values: ["Gold", "Platinum", "VIP Diamond", "Plus"],
          }}
        />
      </div>
    </AdminLayout>
  );
}

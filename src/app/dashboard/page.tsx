"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Shield,
  CreditCard,
  LifeBuoy,
  CheckCircle2,
  Lock,
  ArrowRight,
  FileText,
  Settings,
  AlertCircle,
} from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { UserGrowthChart } from "@/components/dashboard/UserGrowthChart";
import { VerificationChart } from "@/components/dashboard/VerificationChart";
import { RecentUsers } from "@/components/dashboard/RecentUsers";
import { VerificationQueue } from "@/components/dashboard/VerificationQueue";
import { RecentReports } from "@/components/dashboard/RecentReports";
import { RecentPayments } from "@/components/dashboard/RecentPayments";
import { SystemHealth } from "@/components/dashboard/SystemHealth";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { metricCardsData } from "@/lib/mock-data";
import {
  AdminAccount,
  DEFAULT_ADMIN_USERS,
  DEFAULT_ROLE_PERMISSIONS,
  PERMISSION_LIST,
  PermissionKey,
  RolePermissionsMap,
  getCurrentAdmin,
  getRolePermissions,
  hasPermission,
} from "@/lib/auth-rbac";

const supportPreviewTickets = [
  { id: "TCK-8091", user: "Aarav Sharma", subject: "Charged twice for Platinum renewal via UPI", priority: "High", status: "Open", date: "Today 10:15" },
  { id: "TCK-8090", user: "Vikram Singh", subject: "Selfie verification taking longer than 24h", priority: "Medium", status: "Open", date: "Today 09:30" },
  { id: "TCK-8089", user: "Ananya Deshmukh", subject: "Cannot update profile photos in iOS app", priority: "Low", status: "Under Review", date: "Yesterday 21:00" },
  { id: "TCK-8088", user: "Tanvi Saxena", subject: "Requesting account deletion and data removal", priority: "Low", status: "Resolved", date: "Yesterday 16:40" },
];

export default function DashboardPage() {
  const [currentAdmin, setCurrentAdmin] = useState<AdminAccount>(DEFAULT_ADMIN_USERS[0]);
  const [rolePerms, setRolePerms] = useState<RolePermissionsMap>(DEFAULT_ROLE_PERMISSIONS);

  useEffect(() => {
    const syncAuth = () => {
      const admin = getCurrentAdmin();
      if (admin) setCurrentAdmin(admin);
      setRolePerms(getRolePermissions());
    };
    syncAuth();
    window.addEventListener("admin_session_changed", syncAuth);
    window.addEventListener("admin_roles_updated", syncAuth);
    return () => {
      window.removeEventListener("admin_session_changed", syncAuth);
      window.removeEventListener("admin_roles_updated", syncAuth);
    };
  }, []);

  // Only the 6 requested metrics: Total Users, DAU, WAU, MAU, New Users, Total Matches
  const displayedMetrics = metricCardsData.slice(0, 6);

  // Super Admin keeps the full original dashboard
  if (currentAdmin.role === "Super Admin") {
    return (
      <AdminLayout>
        <div className="space-y-5">
          {/* Dashboard Title & Subtitle */}
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Dashboard
            </h1>
            <p className="text-xs text-[#718096] mt-1">
              Overview of your dating platform&apos;s performance and key metrics.
            </p>
          </div>

          {/* 6 Statistics Cards (Single clean row on wide screens) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
            {displayedMetrics.map((metric) => (
              <MetricCard key={metric.id} data={metric} />
            ))}
          </div>

          {/* Charts: User Growth & User Verification Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <UserGrowthChart />
            <VerificationChart />
          </div>

          {/* 4 Dashboard Tables (2x2 Grid) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <RecentUsers />
            <VerificationQueue />
            <RecentReports />
            <RecentPayments />
          </div>

          {/* System Health Status Bar */}
          <div>
            <SystemHealth />
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Sub-admin dynamic role & privilege checks
  const canUsers = hasPermission(currentAdmin.role, "Users Read / Write", rolePerms);
  const canVerification = hasPermission(currentAdmin.role, "Verification Actions", rolePerms);
  const canModeration = hasPermission(currentAdmin.role, "Moderation & Bans", rolePerms);
  const canBilling = hasPermission(currentAdmin.role, "Billing & Refunds", rolePerms);
  const canCms = hasPermission(currentAdmin.role, "CMS Publishing", rolePerms);
  const canSettings = hasPermission(currentAdmin.role, "System Settings", rolePerms);

  const activePrivileges = PERMISSION_LIST.filter((p) =>
    hasPermission(currentAdmin.role, p, rolePerms)
  );

  const roleConfig = {
    "Safety Moderator": {
      title: "Safety Moderator Dashboard",
      subtitle: "Monitor verification queues, user reports, and community safety operations.",
      icon: <Shield size={20} className="text-pink-400" />,
      kpis: [
        { label: "Pending Reports", value: "124", note: "Requires moderation", color: "text-rose-400" },
        { label: "Verification Queue", value: "38", note: "ID & selfie checks", color: "text-amber-400" },
        { label: "Active Users (24h)", value: "8,432", note: "Monitored accounts", color: "text-emerald-400" },
        { label: "Resolved Reports", value: "44", note: "This week", color: "text-cyan-400" },
      ],
    },
    "Billing Lead": {
      title: "Billing Lead Dashboard",
      subtitle: "Track payment volumes, gateway health, and manage refund & transaction records.",
      icon: <CreditCard size={20} className="text-emerald-400" />,
      kpis: [
        { label: "Gross Volume (24h)", value: "₹4,82,630", note: "↑ 13.6% vs yesterday", color: "text-emerald-400" },
        { label: "Gateway Success Rate", value: "98.6%", note: "Razorpay + PhonePe normal", color: "text-white" },
        { label: "UPI Payments Share", value: "74.2%", note: "Primary Indian method", color: "text-cyan-400" },
        { label: "Refund Requests", value: "0.2% (12)", note: "Low dispute frequency", color: "text-amber-400" },
      ],
    },
    "Support Specialist": {
      title: "Support Specialist Dashboard",
      subtitle: "Review user helpdesk tickets, billing inquiries, and customer support requests.",
      icon: <LifeBuoy size={20} className="text-cyan-400" />,
      kpis: [
        { label: "Open Tickets", value: "2", note: "Awaiting response", color: "text-amber-400" },
        { label: "In Progress", value: "1", note: "Being investigated", color: "text-cyan-400" },
        { label: "High Priority", value: "1", note: "Urgent billing issue", color: "text-rose-400" },
        { label: "Resolved Today", value: "2", note: "Avg. response 18m", color: "text-emerald-400" },
      ],
    },
  }[currentAdmin.role];

  return (
    <AdminLayout>
      <div className="space-y-5">
        {/* Role & Privileges Banner */}
        <div className="p-5 rounded-2xl bg-[#151F30] border border-[#263247] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#0D1424] border border-[#263247] flex items-center justify-center flex-shrink-0">
              {roleConfig.icon}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-bold text-white tracking-tight">
                  {roleConfig.title}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-pink-500/15 text-pink-400 border border-pink-500/30 text-[11px] font-semibold">
                  {currentAdmin.role}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Welcome back, <span className="text-white font-medium">{currentAdmin.name}</span>. {roleConfig.subtitle}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Lock size={11} className="text-pink-400" />
              Assigned Privileges ({activePrivileges.length} / {PERMISSION_LIST.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {activePrivileges.length > 0 ? (
                activePrivileges.map((perm: PermissionKey) => (
                  <span
                    key={perm}
                    className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-medium flex items-center gap-1"
                  >
                    <CheckCircle2 size={11} />
                    {perm}
                  </span>
                ))
              ) : (
                <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-[#263247] text-[11px]">
                  Standard Support Queue Only (0 Matrix Privileges)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Role-Specific KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {roleConfig.kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="p-4 rounded-xl bg-[#151F30] border border-[#263247]"
            >
              <span className="text-xs text-slate-400">{kpi.label}</span>
              <p className={`text-xl font-bold mt-1 ${kpi.color}`}>{kpi.value}</p>
              <span className="text-[10px] text-slate-400">{kpi.note}</span>
            </div>
          ))}
        </div>

        {/* Support Specialist Core Workspace */}
        {currentAdmin.role === "Support Specialist" && (
          <div className="bg-[#151F30] border border-[#263247] rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-[#263247] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Active Support Helpdesk Queue
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Recent user inquiries assigned to Support Specialists
                </p>
              </div>
              <Link
                href="/support"
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-xs font-semibold text-white flex items-center gap-1.5 hover:opacity-90 transition-opacity"
              >
                Open Helpdesk
                <ArrowRight size={13} />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="border-b border-[#263247] text-slate-400 bg-[#0D1424]/40">
                    <th className="py-3 px-4">Ticket ID</th>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#263247]/50">
                  {supportPreviewTickets.map((tk) => (
                    <tr key={tk.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-slate-200">{tk.id}</td>
                      <td className="py-3 px-4 text-white font-medium">{tk.user}</td>
                      <td className="py-3 px-4 text-slate-300">{tk.subject}</td>
                      <td className="py-3 px-4"><StatusBadge status={tk.priority} dot size="sm" /></td>
                      <td className="py-3 px-4"><StatusBadge status={tk.status} size="sm" /></td>
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{tk.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Privilege-Gated Charts */}
        {(canUsers || canVerification) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {canUsers && <UserGrowthChart />}
            {canVerification && <VerificationChart />}
          </div>
        )}

        {/* Privilege-Gated Operational Widgets */}
        {(canUsers || canVerification || canModeration || canBilling) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {canUsers && <RecentUsers />}
            {canVerification && <VerificationQueue />}
            {canModeration && <RecentReports />}
            {canBilling && <RecentPayments />}
          </div>
        )}

        {/* Privilege-Gated Quick Actions for CMS / Billing / Settings */}
        {(canBilling || canCms || canSettings) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {canBilling && (
              <Link
                href="/payments"
                className="p-4 rounded-xl bg-[#151F30] border border-[#263247] hover:border-emerald-500/40 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Payments & Transactions</p>
                    <p className="text-[11px] text-slate-400">View, add, edit &amp; manage refunds</p>
                  </div>
                </div>
                <ArrowRight size={15} className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </Link>
            )}

            {canCms && (
              <Link
                href="/cms"
                className="p-4 rounded-xl bg-[#151F30] border border-[#263247] hover:border-pink-500/40 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-pink-500/15 text-pink-400 flex items-center justify-center">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">CMS &amp; Content</p>
                    <p className="text-[11px] text-slate-400">Manage banners &amp; announcements</p>
                  </div>
                </div>
                <ArrowRight size={15} className="text-slate-500 group-hover:text-pink-400 transition-colors" />
              </Link>
            )}

            {canSettings && (
              <Link
                href="/settings"
                className="p-4 rounded-xl bg-[#151F30] border border-[#263247] hover:border-cyan-500/40 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
                    <Settings size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">System Settings</p>
                    <p className="text-[11px] text-slate-400">Configure platform preferences</p>
                  </div>
                </div>
                <ArrowRight size={15} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </Link>
            )}
          </div>
        )}

        {/* Privilege-Gated System Health */}
        {canSettings && (
          <div>
            <SystemHealth />
          </div>
        )}

        {/* Info Banner when no Matrix Privileges are assigned (except Support which has Helpdesk) */}
        {activePrivileges.length === 0 && currentAdmin.role !== "Support Specialist" && (
          <div className="p-5 rounded-2xl bg-[#151F30] border border-amber-500/30 flex items-center gap-3 text-xs text-amber-300">
            <AlertCircle size={18} className="flex-shrink-0 text-amber-400" />
            <span>
              No module privileges are currently enabled for your role ({currentAdmin.role}). Ask the Super Admin to grant privileges in the Granular Permission Matrix.
            </span>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

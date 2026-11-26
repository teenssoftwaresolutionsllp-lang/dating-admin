"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataTable, Column } from "@/components/ui/DataTable";
import { ClipboardList, ShieldAlert, Key, UserCheck, RefreshCw } from "lucide-react";

interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  ipAddress: string;
  status: "Success" | "Warning" | "Flagged";
}

const mockAuditLogs: AuditLog[] = [
  { id: "log-1", timestamp: "Oct 28, 11:45:12", actor: "Admin (Super Admin)", action: "Approved Verification", target: "User #10317 (Selfie)", ipAddress: "103.24.120.4", status: "Success" },
  { id: "log-2", timestamp: "Oct 28, 11:32:05", actor: "Priya Menon (Moderator)", action: "Suspended Account", target: "User #10478 (Harassment)", ipAddress: "49.36.88.190", status: "Warning" },
  { id: "log-3", timestamp: "Oct 28, 10:14:40", actor: "Dev Sharma (Billing)", action: "Processed Refund", target: "TXN_982138 (₹999)", ipAddress: "103.24.120.8", status: "Success" },
  { id: "log-4", timestamp: "Oct 28, 09:12:18", actor: "System Daemon", action: "Automated Rate Limit Ban", target: "IP 185.220.101.44 (Bot scraper)", ipAddress: "185.220.101.44", status: "Flagged" },
  { id: "log-5", timestamp: "Oct 28, 08:30:00", actor: "Admin (Super Admin)", action: "Updated Matching Radius", target: "Max Distance: 50km -> 25km", ipAddress: "103.24.120.4", status: "Success" },
  { id: "log-6", timestamp: "Oct 27, 22:15:33", actor: "Kavita Roy (Support)", action: "Closed Ticket", target: "TCK-8088", ipAddress: "49.36.88.212", status: "Success" },
  { id: "log-7", timestamp: "Oct 27, 18:40:11", actor: "System Daemon", action: "Automated Photo Blur", target: "User #10469 (NSFW Filter)", ipAddress: "Internal", status: "Warning" },
];

export default function AuditLogsPage() {
  const [logs] = useState<AuditLog[]>(mockAuditLogs);

  const columns: Column<AuditLog>[] = [
    {
      key: "timestamp",
      header: "Timestamp (IST)",
      render: (row) => <span className="font-mono text-slate-400 text-[11px]">{row.timestamp}</span>,
    },
    {
      key: "actor",
      header: "Admin Actor",
      render: (row) => <span className="font-semibold text-white">{row.actor}</span>,
    },
    {
      key: "action",
      header: "Action Logged",
      render: (row) => (
        <span className="font-medium text-pink-400">{row.action}</span>
      ),
    },
    {
      key: "target",
      header: "Target Entity",
      render: (row) => <span className="text-slate-300 font-mono text-[11px]">{row.target}</span>,
    },
    {
      key: "ipAddress",
      header: "Origin IP",
      render: (row) => <span className="font-mono text-slate-500 text-[11px]">{row.ipAddress}</span>,
    },
    {
      key: "status",
      header: "Audit Result",
      render: (row) => (
        <StatusBadge
          status={row.status === "Success" ? "Active" : row.status === "Warning" ? "Pending" : "Banned"}
          dot
        />
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Security & Audit Logs"
          description="Immutable security audit trail of privileged administrative operations, user bans, and role modifications."
          actions={
            <button
              onClick={() => alert("Audit log export downloaded (Frontend Demo).")}
              className="px-3.5 py-2 rounded-xl bg-[#151F30] border border-[#263247] text-xs font-medium text-slate-300 hover:text-white"
            >
              Export Audit Trail
            </button>
          }
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">Total Audits Logged</span>
            <p className="text-xl font-bold text-white mt-1">48,920</p>
          </div>
          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">Admin Actions (24h)</span>
            <p className="text-xl font-bold text-emerald-400 mt-1">142</p>
          </div>
          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">Suspicious Anomalies</span>
            <p className="text-xl font-bold text-rose-400 mt-1">1 Flagged</p>
          </div>
          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">Retention Period</span>
            <p className="text-xl font-bold text-cyan-400 mt-1">365 Days</p>
          </div>
        </div>

        <DataTable
          data={logs}
          columns={columns}
          searchPlaceholder="Search audit events by actor, action, target..."
          searchKey={(l) => `${l.actor} ${l.action} ${l.target} ${l.ipAddress}`}
          filterOptions={{
            label: "Result",
            key: "status",
            values: ["Success", "Warning", "Flagged"],
          }}
        />
      </div>
    </AdminLayout>
  );
}


"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { RecentReport } from "@/types/dashboard";
import { recentReportsData } from "@/lib/mock-data";
import {
  ShieldAlert,
  UserX,
  CheckCircle,
  AlertTriangle,
  Eye,
  XCircle,
  AlertOctagon,
  History,
  MessageSquare,
  Shield,
  Clock,
} from "lucide-react";

const extendedReports: RecentReport[] = [
  ...recentReportsData,
  {
    id: "r6",
    userId: "#10462",
    reportedUser: "Vikram Seth (#10080)",
    reason: "Underage suspected",
    status: "Open",
    date: "Oct 27, 14:10",
    severity: "High",
    description: "Bio mentions school grade indicating user may be below 18.",
  },
  {
    id: "r7",
    userId: "#10460",
    reportedUser: "Varun Bajaj (#10145)",
    reason: "Offensive Bio",
    status: "Under Review",
    date: "Oct 27, 12:45",
    severity: "Medium",
    description: "Profile description includes hate speech and derogatory slurs.",
  },
  {
    id: "r8",
    userId: "#10458",
    reportedUser: "Maya Kapoor (#10290)",
    reason: "Commercial Solicitation",
    status: "Resolved",
    date: "Oct 27, 10:15",
    severity: "Low",
    description: "Promoting paid astrology / modeling services via bio.",
  },
  {
    id: "r9",
    userId: "#10452",
    reportedUser: "Anil Grover (#10034)",
    reason: "Unresponsive match",
    status: "Dismissed",
    date: "Oct 26, 19:40",
    severity: "Low",
    description: "Reporter felt offended because match did not reply to messages. No policy breach.",
  },
];

export default function ModerationPage() {
  const [reports, setReports] = useState<RecentReport[]>(extendedReports);
  const [selectedReport, setSelectedReport] = useState<RecentReport | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: "warn" | "suspend" | "ban" | "dismiss";
    title: string;
    message: string;
  } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const executeAction = (actionType: "resolve" | "warn" | "suspend" | "ban" | "dismiss") => {
    if (!selectedReport) return;
    const targetId = selectedReport.id;
    const targetUser = selectedReport.reportedUser || selectedReport.userId;

    let newStatus: RecentReport["status"] = "Resolved";
    if (actionType === "dismiss") newStatus = "Dismissed";

    setReports((prev) =>
      prev.map((r) => (r.id === targetId ? { ...r, status: newStatus } : r))
    );

    setConfirmAction(null);
    setSelectedReport(null);

    const msgs = {
      resolve: `Report ${targetId} marked as Resolved.`,
      warn: `Formal community policy warning delivered to ${targetUser}.`,
      suspend: `Account ${targetUser} suspended for 7 days.`,
      ban: `Permanent ban enforced for ${targetUser}.`,
      dismiss: `Report ${targetId} dismissed as non-violating.`,
    };
    showToast(msgs[actionType]);
  };

  const columns: Column<RecentReport>[] = [
    {
      key: "userId",
      header: "Reporter ID",
      render: (row) => (
        <span className="font-mono text-slate-300 font-medium">{row.userId}</span>
      ),
    },
    {
      key: "reportedUser",
      header: "Reported Account",
      render: (row) => (
        <span className="font-semibold text-rose-300 font-mono">
          {row.reportedUser || "Target Profile"}
        </span>
      ),
    },
    {
      key: "reason",
      header: "Violation Allegation",
      render: (row) => (
        <span className="text-slate-100 font-medium">{row.reason}</span>
      ),
    },
    {
      key: "severity",
      header: "Severity",
      render: (row) => <StatusBadge status={row.severity || "Medium"} dot size="sm" />,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      key: "date",
      header: "Timestamp",
      render: (row) => <span className="text-slate-400 font-mono text-xs">{row.date}</span>,
    },
    {
      key: "action",
      header: "Action",
      align: "right",
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedReport(row);
          }}
          className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-[#263247] text-xs font-medium transition-colors"
        >
          Review Report
        </button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Moderation & Reports"
          description="Investigate community abuse reports, manage account violations, issue official warnings, and enforce disciplinary bans."
        />

        {toast && (
          <div className="p-3 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs flex items-center justify-between">
            <span>{toast}</span>
            <button onClick={() => setToast(null)}>✕</button>
          </div>
        )}

        {/* 4 Status Breakdown Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">Pending Reports</span>
            <p className="text-xl font-bold text-rose-400 mt-1">
              {reports.filter((r) => r.status === "Open").length}
            </p>
            <span className="text-[10px] text-rose-400">Unreviewed incidents</span>
          </div>

          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">Under Review</span>
            <p className="text-xl font-bold text-amber-400 mt-1">
              {reports.filter((r) => r.status === "Under Review").length}
            </p>
            <span className="text-[10px] text-amber-400">Active investigations</span>
          </div>

          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">Resolved Reports</span>
            <p className="text-xl font-bold text-emerald-400 mt-1">
              {reports.filter((r) => r.status === "Resolved").length}
            </p>
            <span className="text-[10px] text-emerald-400">Actions enforced</span>
          </div>

          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">Dismissed Reports</span>
            <p className="text-xl font-bold text-slate-400 mt-1">
              {reports.filter((r) => r.status === "Dismissed").length}
            </p>
            <span className="text-[10px] text-slate-400">Non-violating claims</span>
          </div>
        </div>

        {/* Reports Table with Dismissed filter */}
        <DataTable
          data={reports}
          columns={columns}
          searchPlaceholder="Search by reported user, reporter, violation reason..."
          searchKey={(r) => `${r.userId} ${r.reportedUser} ${r.reason} ${r.description || ""}`}
          filterOptions={{
            label: "Status",
            key: "status",
            values: ["Open", "Under Review", "Resolved", "Dismissed"],
          }}
          onRowClick={(row) => setSelectedReport(row)}
        />

        {/* Detailed Investigation Modal */}
        {selectedReport && !confirmAction && (
          <Modal
            isOpen={!!selectedReport}
            onClose={() => setSelectedReport(null)}
            title="Community Report Investigation & Action"
            description={`Case Reference: #${selectedReport.id} • Registered Incident`}
            maxWidth="lg"
            footer={
              <div className="flex items-center justify-between w-full flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setConfirmAction({
                        type: "dismiss",
                        title: "Dismiss Community Report",
                        message: `Are you sure you want to dismiss report #${selectedReport.id}? No disciplinary penalty will be applied.`,
                      })
                    }
                    className="px-3.5 py-1.5 text-xs rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-[#263247] transition-colors"
                  >
                    Dismiss Report
                  </button>
                  <button
                    onClick={() =>
                      setConfirmAction({
                        type: "warn",
                        title: "Issue Policy Warning",
                        message: `Issue an official written safety warning to ${selectedReport.reportedUser}? This violation will be recorded in their trust score.`,
                      })
                    }
                    className="px-3.5 py-1.5 text-xs rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 transition-colors flex items-center gap-1.5"
                  >
                    <AlertTriangle size={14} />
                    Warn User
                  </button>
                  <button
                    onClick={() =>
                      setConfirmAction({
                        type: "suspend",
                        title: "Suspend Account (7 Days)",
                        message: `Suspend ${selectedReport.reportedUser} from accessing chats and discovery for 7 days?`,
                      })
                    }
                    className="px-3.5 py-1.5 text-xs rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30 transition-colors flex items-center gap-1.5"
                  >
                    <UserX size={14} />
                    Suspend User
                  </button>
                  <button
                    onClick={() =>
                      setConfirmAction({
                        type: "ban",
                        title: "Permanent Disciplinary Ban",
                        message: `Permanently terminate account ${selectedReport.reportedUser}? This action is irreversible and blocks device hardware ID.`,
                      })
                    }
                    className="px-3.5 py-1.5 text-xs rounded-xl bg-red-600/30 text-red-300 border border-red-500/40 hover:bg-red-600/50 transition-colors flex items-center gap-1.5 font-semibold"
                  >
                    <AlertOctagon size={14} />
                    Ban User
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => executeAction("resolve")}
                    className="px-4 py-1.5 text-xs rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5"
                  >
                    <CheckCircle size={14} />
                    Resolve Case
                  </button>
                </div>
              </div>
            }
          >
            <div className="space-y-4">
              {/* Incident Header */}
              <div className="p-4 rounded-xl bg-[#0D1424] border border-[#263247] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Violation Category
                  </span>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={selectedReport.severity || "Medium"} dot size="sm" />
                    <StatusBadge status={selectedReport.status} size="sm" />
                  </div>
                </div>
                <h4 className="text-base font-bold text-white">
                  {selectedReport.reason}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-[#151F30] p-3 rounded-xl border border-[#263247]/60">
                  {selectedReport.description}
                </p>
              </div>

              {/* Reported Accounts Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[#0D1424] border border-[#263247]">
                  <span className="text-slate-400 block text-[11px]">Reporting User</span>
                  <span className="font-semibold text-slate-200 mt-1 block">
                    {selectedReport.userId} (Verified Member)
                  </span>
                  <span className="text-slate-500 text-[10px] block mt-0.5">Trust Score: 98/100</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0D1424] border border-[#263247]">
                  <span className="text-slate-400 block text-[11px]">Accused Account</span>
                  <span className="font-semibold text-rose-300 font-mono mt-1 block">
                    {selectedReport.reportedUser}
                  </span>
                  <span className="text-slate-500 text-[10px] block mt-0.5">Prior Warnings: 1 on file</span>
                </div>
              </div>

              {/* Evidence Snippet / Reported Content Excerpt */}
              <div className="p-3.5 rounded-xl bg-[#0D1424] border border-[#263247] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <MessageSquare size={13} className="text-pink-400" />
                    Flagged Message Excerpt / Evidence
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Chat Log #94821</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono leading-relaxed">
                  &gt; [Oct 28 10:14:22] [Target]: &quot;Hey check out my private telegram channel @vip_models or send cash for photos.&quot;
                </div>
              </div>

              {/* Admin Review History Log */}
              <div className="p-3.5 rounded-xl bg-[#0D1424] border border-[#263247] space-y-2">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <History size={13} className="text-indigo-400" />
                  Admin Review History & Timeline
                </span>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                    <div>
                      <span className="text-slate-400 text-[11px] font-mono">Oct 28, 10:24</span> — Report filed by user with high severity rating.
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                    <div>
                      <span className="text-slate-400 text-[11px] font-mono">Oct 28, 10:30</span> — Auto-scanned by NLP safety classifier (Commercial Solicitation flag).
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                    <div>
                      <span className="text-slate-400 text-[11px] font-mono">Oct 28, 10:45</span> — Assigned to Safety Moderator for manual human review.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        )}

        {/* Confirmation Dialog Before Critical Actions */}
        {confirmAction && (
          <Modal
            isOpen={!!confirmAction}
            onClose={() => setConfirmAction(null)}
            title={confirmAction.title}
            description="Confirmation Required"
            footer={
              <div className="flex items-center justify-end gap-3 w-full">
                <button
                  onClick={() => setConfirmAction(null)}
                  className="px-4 py-2 text-xs rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => executeAction(confirmAction.type)}
                  className={`px-4 py-2 text-xs rounded-xl font-bold text-white transition-opacity ${
                    confirmAction.type === "ban"
                      ? "bg-red-600 hover:bg-red-700"
                      : confirmAction.type === "suspend"
                      ? "bg-rose-600 hover:bg-rose-700"
                      : confirmAction.type === "warn"
                      ? "bg-amber-600 hover:bg-amber-700"
                      : "bg-slate-700 hover:bg-slate-600"
                  }`}
                >
                  Confirm & Enforce Action
                </button>
              </div>
            }
          >
            <div className="space-y-3 py-2">
              <div className="p-4 rounded-xl bg-[#0D1424] border border-[#263247] flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    Please Confirm Action
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    {confirmAction.message}
                  </p>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </AdminLayout>
  );
}

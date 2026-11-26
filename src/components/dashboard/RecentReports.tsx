"use client";

import React, { useState } from "react";
import Link from "next/link";
import { recentReportsData } from "@/lib/mock-data";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Modal } from "@/components/ui/Modal";
import { RecentReport } from "@/types/dashboard";
import { CheckCircle2, UserX } from "lucide-react";

export function RecentReports() {
  const [reports, setReports] = useState<RecentReport[]>(recentReportsData);
  const [selectedReport, setSelectedReport] = useState<RecentReport | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleResolve = (report: RecentReport) => {
    setReports((prev) =>
      prev.map((r) => (r.id === report.id ? { ...r, status: "Resolved" } : r))
    );
    setSelectedReport(null);
    setToastMessage(`Report for ${report.userId} marked as Resolved.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleBan = (report: RecentReport) => {
    setReports((prev) =>
      prev.map((r) => (r.id === report.id ? { ...r, status: "Resolved" } : r))
    );
    setSelectedReport(null);
    setToastMessage(`Reported user ${report.userId} has been suspended.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <>
      <div className="bg-[#111A28] border border-[#1F293D] rounded-xl p-5 flex flex-col justify-between">
        {/* Table Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white tracking-tight">
            Recent Reports
          </h3>
          <Link
            href="/moderation"
            className="text-xs font-semibold text-[#38BDF8] hover:text-[#0284C7] transition-colors"
          >
            View All
          </Link>
        </div>

        {toastMessage && (
          <div className="mb-2.5 px-3 py-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs flex items-center justify-between">
            <span>{toastMessage}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="text-indigo-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* Responsive Table */}
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#1B2537] text-[#64748B] text-[11px] font-medium">
                <th className="pb-2.5 pl-1">User ID</th>
                <th className="pb-2.5">Reason</th>
                <th className="pb-2.5">Status</th>
                <th className="pb-2.5 pr-1 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B2537]/60">
              {reports.map((report) => (
                <tr
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className="hover:bg-[#1A263A]/40 transition-colors cursor-pointer group"
                >
                  <td className="py-2.5 pl-1 font-mono text-[#718096] text-[11px]">
                    {report.userId}
                  </td>
                  <td className="py-2.5 text-slate-200 text-xs">
                    {report.reason}
                  </td>
                  <td className="py-2.5">
                    <StatusBadge status={report.status} />
                  </td>
                  <td className="py-2.5 pr-1 text-right text-[#718096] text-[11px]">
                    {report.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Details Modal */}
      {selectedReport && (
        <Modal
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          title="Community Report Investigation"
          description={`Report ID: ${selectedReport.id} • Filed by ${selectedReport.userId}`}
          footer={
            <>
              <button
                onClick={() => handleBan(selectedReport)}
                className="px-4 py-2 text-xs rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30 transition-colors flex items-center gap-1.5"
              >
                <UserX size={14} />
                Ban Reported User
              </button>
              <button
                onClick={() => handleResolve(selectedReport)}
                className="px-4 py-2 text-xs rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5"
              >
                <CheckCircle2 size={14} />
                Mark as Resolved
              </button>
            </>
          }
        >
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-[#090E1A] border border-[#1F293D] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Report Category</span>
                <StatusBadge status={selectedReport.status} />
              </div>
              <p className="text-sm font-semibold text-white">
                {selectedReport.reason}
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedReport.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#090E1A] border border-[#1F293D]">
                <span className="text-slate-400 block text-[11px]">
                  Target User
                </span>
                <span className="font-semibold text-slate-200 mt-1 block">
                  {selectedReport.reportedUser || "Reported Profile"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#090E1A] border border-[#1F293D]">
                <span className="text-slate-400 block text-[11px]">Timestamp</span>
                <span className="font-semibold text-slate-200 mt-1 block">
                  {selectedReport.date}
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

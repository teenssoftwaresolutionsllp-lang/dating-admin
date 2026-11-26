"use client";

import React, { useState } from "react";
import Link from "next/link";
import { verificationQueueData } from "@/lib/mock-data";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Modal } from "@/components/ui/Modal";
import { VerificationQueueItem } from "@/types/dashboard";
import { FileText, CheckCircle2, XCircle } from "lucide-react";

export function VerificationQueue() {
  const [queue, setQueue] = useState<VerificationQueueItem[]>(verificationQueueData);
  const [reviewItem, setReviewItem] = useState<VerificationQueueItem | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleAction = (item: VerificationQueueItem, action: "Approved" | "Rejected") => {
    setQueue((prev) => prev.filter((q) => q.id !== item.id));
    setReviewItem(null);
    setActionNotice(`User ${item.userId} verification marked as ${action}.`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  return (
    <>
      <div className="bg-[#111A28] border border-[#1F293D] rounded-xl p-5 flex flex-col justify-between">
        {/* Table Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white tracking-tight">
            Verification Queue
          </h3>
          <Link
            href="/verification"
            className="text-xs font-semibold text-[#38BDF8] hover:text-[#0284C7] transition-colors"
          >
            View All
          </Link>
        </div>

        {actionNotice && (
          <div className="mb-2.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between">
            <span>{actionNotice}</span>
            <button
              onClick={() => setActionNotice(null)}
              className="text-emerald-400 hover:text-white"
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
                <th className="pb-2.5">Document Type</th>
                <th className="pb-2.5">Risk Score</th>
                <th className="pb-2.5 pr-1 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B2537]/60">
              {queue.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-[#1A263A]/40 transition-colors"
                >
                  <td className="py-2.5 pl-1 font-mono text-[#718096] text-[11px]">
                    {item.userId}
                  </td>
                  <td className="py-2.5 text-slate-200 text-xs">
                    {item.documentType}
                  </td>
                  <td className="py-2.5">
                    <StatusBadge status={item.riskScore} />
                  </td>
                  <td className="py-2.5 pr-1 text-right">
                    <button
                      onClick={() => setReviewItem(item)}
                      className="px-3.5 py-1 rounded-md bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#1D4ED8] text-white font-medium text-[11px] shadow-sm transition-all hover:scale-105"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Verification Modal */}
      {reviewItem && (
        <Modal
          isOpen={!!reviewItem}
          onClose={() => setReviewItem(null)}
          title="Review Identification Document"
          description={`Verification request for ${reviewItem.userId}`}
          footer={
            <>
              <button
                onClick={() => handleAction(reviewItem, "Rejected")}
                className="px-4 py-2 text-xs rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30 transition-colors flex items-center gap-1.5"
              >
                <XCircle size={14} />
                Reject Document
              </button>
              <button
                onClick={() => handleAction(reviewItem, "Approved")}
                className="px-4 py-2 text-xs rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5"
              >
                <CheckCircle2 size={14} />
                Approve Verification
              </button>
            </>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#090E1A] border border-[#1F293D]">
              <div>
                <span className="text-[11px] text-slate-400">Document Type</span>
                <p className="text-sm font-semibold text-white">
                  {reviewItem.documentType} Verification
                </p>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400">Risk Assessment</span>
                <div className="mt-0.5">
                  <StatusBadge status={reviewItem.riskScore} />
                </div>
              </div>
            </div>

            <div className="p-8 rounded-xl bg-[#090E1A] border border-dashed border-[#1F293D] flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
                <FileText size={32} />
              </div>
              <p className="text-sm font-medium text-slate-200">
                Government ID Card Image Preview
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                AI Face Matching Confidence:{" "}
                <span className="text-emerald-400 font-semibold">96.4%</span>.
                OCR matches applicant name and date of birth.
              </p>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

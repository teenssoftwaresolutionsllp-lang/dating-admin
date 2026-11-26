"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { VerificationQueueItem } from "@/types/dashboard";
import { verificationQueueData } from "@/lib/mock-data";
import {
  BadgeCheck,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Camera,
  CreditCard,
} from "lucide-react";

const extendedVerification: VerificationQueueItem[] = [
  ...verificationQueueData,
  {
    id: "v6",
    userId: "#10316",
    userName: "Tara Sharma",
    documentType: "Passport",
    riskScore: "Low",
    submittedAt: "Oct 28, 08:20",
  },
  {
    id: "v7",
    userId: "#10315",
    userName: "Armaan Malik",
    documentType: "Aadhaar",
    riskScore: "High",
    submittedAt: "Oct 28, 07:50",
  },
  {
    id: "v8",
    userId: "#10314",
    userName: "Nisha Singhania",
    documentType: "Driving License",
    riskScore: "Medium",
    submittedAt: "Oct 28, 07:15",
  },
];

export default function VerificationPage() {
  const [queue, setQueue] = useState<VerificationQueueItem[]>(extendedVerification);
  const [reviewItem, setReviewItem] = useState<VerificationQueueItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleReviewAction = (item: VerificationQueueItem, action: "Approved" | "Rejected") => {
    setQueue((prev) => prev.filter((q) => q.id !== item.id));
    setReviewItem(null);
    setToast(`Document for ${item.userId} (${item.userName}) has been ${action}.`);
    setTimeout(() => setToast(null), 3500);
  };

  const columns: Column<VerificationQueueItem>[] = [
    {
      key: "userId",
      header: "User ID",
      render: (row) => (
        <span className="font-mono font-medium text-slate-200">
          {row.userId}
        </span>
      ),
    },
    {
      key: "userName",
      header: "User Name",
      render: (row) => (
        <span className="font-semibold text-slate-100">
          {row.userName || "Applicant"}
        </span>
      ),
    },
    {
      key: "documentType",
      header: "Document Submitted",
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.documentType === "Selfie" ? (
            <Camera size={14} className="text-cyan-400" />
          ) : row.documentType === "Aadhaar" ? (
            <CreditCard size={14} className="text-amber-400" />
          ) : (
            <FileText size={14} className="text-indigo-400" />
          )}
          <span>{row.documentType}</span>
        </div>
      ),
    },
    {
      key: "riskScore",
      header: "Risk Assessment",
      render: (row) => <StatusBadge status={row.riskScore} dot />,
    },
    {
      key: "submittedAt",
      header: "Submission Time",
      render: (row) => (
        <span className="text-slate-400">{row.submittedAt || "Recent"}</span>
      ),
    },
    {
      key: "action",
      header: "Action",
      align: "right",
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setReviewItem(row);
          }}
          className="px-3 py-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium text-xs hover:scale-105 transition-all shadow-md shadow-blue-500/20"
        >
          Review
        </button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Identity Verification Queue"
          description="Authenticate government identities, Aadhaar credentials, and facial live selfies."
        />

        {toast && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between">
            <span>{toast}</span>
            <button onClick={() => setToast(null)}>✕</button>
          </div>
        )}

        {/* Verification Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">Total in Queue</span>
            <p className="text-xl font-bold text-white mt-1">{queue.length}</p>
          </div>
          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">High Risk Flagged</span>
            <p className="text-xl font-bold text-rose-400 mt-1">
              {queue.filter((q) => q.riskScore === "High").length}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">Medium Risk</span>
            <p className="text-xl font-bold text-amber-400 mt-1">
              {queue.filter((q) => q.riskScore === "Medium").length}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">Low Risk Fast-track</span>
            <p className="text-xl font-bold text-emerald-400 mt-1">
              {queue.filter((q) => q.riskScore === "Low").length}
            </p>
          </div>
        </div>

        {/* Queue Table */}
        <DataTable
          data={queue}
          columns={columns}
          searchPlaceholder="Search by user ID, applicant name..."
          searchKey={(q) => `${q.userId} ${q.userName || ""} ${q.documentType}`}
          filterOptions={{
            label: "Risk Score",
            key: "riskScore",
            values: ["High", "Medium", "Low"],
          }}
          onRowClick={(row) => setReviewItem(row)}
        />

        {/* Review Modal */}
        {reviewItem && (
          <Modal
            isOpen={!!reviewItem}
            onClose={() => setReviewItem(null)}
            title="Inspect Verification Document"
            description={`Applicant ${reviewItem.userName} (${reviewItem.userId}) • ${reviewItem.documentType}`}
            footer={
              <>
                <button
                  onClick={() => handleReviewAction(reviewItem, "Rejected")}
                  className="px-4 py-2 text-xs rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30 transition-colors flex items-center gap-1.5"
                >
                  <XCircle size={14} />
                  Reject Verification
                </button>
                <button
                  onClick={() => handleReviewAction(reviewItem, "Approved")}
                  className="px-4 py-2 text-xs rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5"
                >
                  <CheckCircle2 size={14} />
                  Approve Verification
                </button>
              </>
            }
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#0D1424] border border-[#263247]">
                  <span className="text-slate-400 block">Document Submitted</span>
                  <p className="font-semibold text-white mt-1">
                    {reviewItem.documentType}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#0D1424] border border-[#263247]">
                  <span className="text-slate-400 block">Risk Evaluation</span>
                  <div className="mt-1">
                    <StatusBadge status={reviewItem.riskScore} />
                  </div>
                </div>
              </div>

              {/* Simulated ID Card Display */}
              <div className="p-6 rounded-xl bg-[#0D1424] border border-[#263247] flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3">
                  <BadgeCheck size={36} />
                </div>
                <h5 className="text-sm font-semibold text-white">
                  Facial Match: 98.2% Similarity
                </h5>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Liveness detection passed. Hologram security watermark detected.
                  No duplicate photo registered across dating network.
                </p>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </AdminLayout>
  );
}


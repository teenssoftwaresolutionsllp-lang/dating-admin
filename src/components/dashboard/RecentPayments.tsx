"use client";

import React, { useState } from "react";
import Link from "next/link";
import { recentPaymentsData } from "@/lib/mock-data";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Modal } from "@/components/ui/Modal";
import { PaymentTransaction } from "@/types/dashboard";
import { Receipt, Smartphone, CreditCard } from "lucide-react";

export function RecentPayments() {
  const [selectedTx, setSelectedTx] = useState<PaymentTransaction | null>(null);

  return (
    <>
      <div className="bg-[#111A28] border border-[#1F293D] rounded-xl p-5 flex flex-col justify-between">
        {/* Table Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white tracking-tight">
            Recent Payments
          </h3>
          <Link
            href="/payments"
            className="text-xs font-semibold text-[#38BDF8] hover:text-[#0284C7] transition-colors"
          >
            View All
          </Link>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#1B2537] text-[#64748B] text-[11px] font-medium">
                <th className="pb-2.5 pl-1">Tx ID</th>
                <th className="pb-2.5">User</th>
                <th className="pb-2.5">Amount</th>
                <th className="pb-2.5">Method</th>
                <th className="pb-2.5">Status</th>
                <th className="pb-2.5 pr-1 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B2537]/60">
              {recentPaymentsData.map((tx) => (
                <tr
                  key={tx.id}
                  onClick={() => setSelectedTx(tx)}
                  className="hover:bg-[#1A263A]/40 transition-colors cursor-pointer group"
                >
                  <td className="py-2.5 pl-1 font-mono text-slate-300 font-medium text-[11px]">
                    {tx.txId}
                  </td>
                  <td className="py-2.5 font-medium text-slate-200 group-hover:text-pink-400 transition-colors text-xs">
                    {tx.userName}
                  </td>
                  <td className="py-2.5 font-mono font-bold text-emerald-400 text-xs">
                    {tx.amount}
                  </td>
                  <td className="py-2.5 text-slate-400 text-[11px]">
                    {tx.method}
                  </td>
                  <td className="py-2.5">
                    <StatusBadge status={tx.status === "Success" ? "Active" : "Pending"} dot />
                  </td>
                  <td className="py-2.5 pr-1 text-right text-[#718096] text-[11px]">
                    {tx.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTx && (
        <Modal
          isOpen={!!selectedTx}
          onClose={() => setSelectedTx(null)}
          title="Payment Transaction Details"
          description={`Reference ID: ${selectedTx.txId}`}
          footer={
            <button
              onClick={() => setSelectedTx(null)}
              className="px-4 py-2 text-xs rounded-xl bg-slate-800 text-slate-200 hover:text-white"
            >
              Close
            </button>
          }
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#090E1A] border border-[#1F293D] flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Total Billed</span>
                <p className="text-2xl font-bold text-emerald-400 mt-0.5">{selectedTx.amount}</p>
              </div>
              <StatusBadge status={selectedTx.status === "Success" ? "Active" : "Pending"} dot />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#090E1A] border border-[#1F293D]">
                <span className="text-slate-400 block text-[11px]">User Account</span>
                <span className="font-semibold text-slate-100 mt-1 block">{selectedTx.userName}</span>
                <span className="font-mono text-slate-400 text-[10px]">{selectedTx.userId}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#090E1A] border border-[#1F293D]">
                <span className="text-slate-400 block text-[11px]">Plan Purchased</span>
                <span className="font-semibold text-slate-100 mt-1 block">{selectedTx.plan || "Subscription"}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#090E1A] border border-[#1F293D]">
                <span className="text-slate-400 block text-[11px]">Gateway & Method</span>
                <span className="font-medium text-slate-200 mt-1 block">{selectedTx.method} via {selectedTx.gateway}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#090E1A] border border-[#1F293D]">
                <span className="text-slate-400 block text-[11px]">Timestamp</span>
                <span className="font-medium text-slate-200 mt-1 block">{selectedTx.date}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

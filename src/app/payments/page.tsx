"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import {
  Receipt,
  CheckCircle,
  Smartphone,
  CreditCard,
  ArrowUpRight,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  Plus,
  Edit2,
} from "lucide-react";

interface Transaction {
  id: string;
  txId: string;
  userId: string;
  userName: string;
  amount: string;
  method: "UPI" | "Credit Card" | "Debit Card" | "NetBanking";
  gateway: "Razorpay" | "PhonePe" | "Stripe";
  status: "Success" | "Pending" | "Failed" | "Refunded" | "RefundedApproved" | "RefundRejected";
  date: string;
}

const mockTransactions: Transaction[] = [
  { id: "t1", txId: "TXN_982144", userId: "#10482", userName: "Aarav Sharma", amount: "₹999", method: "UPI", gateway: "PhonePe", status: "Success", date: "Oct 28, 11:42" },
  { id: "t2", txId: "TXN_982143", userId: "#10481", userName: "Sneha Reddy", amount: "₹4,999", method: "Credit Card", gateway: "Razorpay", status: "Success", date: "Oct 28, 11:30" },
  { id: "t3", txId: "TXN_982142", userId: "#10477", userName: "Arjun Kapoor", amount: "₹299", method: "UPI", gateway: "PhonePe", status: "Success", date: "Oct 28, 10:14" },
  { id: "t4", txId: "TXN_982141", userId: "#10476", userName: "Ananya Deshmukh", amount: "₹149", method: "UPI", gateway: "Razorpay", status: "Pending", date: "Oct 28, 09:50" },
  { id: "t5", txId: "TXN_982140", userId: "#10473", userName: "Rohan Khanna", amount: "₹599", method: "Debit Card", gateway: "Razorpay", status: "Failed", date: "Oct 28, 09:12" },
  { id: "t6", txId: "TXN_982139", userId: "#10479", userName: "Pooja Verma", amount: "₹4,499", method: "Credit Card", gateway: "Stripe", status: "Success", date: "Oct 27, 23:10" },
  { id: "t7", txId: "TXN_982138", userId: "#10468", userName: "Deepak Choudhary", amount: "₹999", method: "UPI", gateway: "PhonePe", status: "Refunded", date: "Oct 27, 18:22" },
];

function mapTxStatusToBadge(status: Transaction["status"]) {
  if (status === "Success") return "Active";
  if (status === "Pending") return "Pending";
  if (status === "Refunded") return "Under Review";
  if (status === "RefundedApproved") return "Refund Approved";
  if (status === "RefundRejected") return "Refund Rejected";
  return "Banned";
}

export default function PaymentsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [txFormOpen, setTxFormOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [formCustomer, setFormCustomer] = useState("");
  const [formUserId, setFormUserId] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formMethod, setFormMethod] = useState<Transaction["method"]>("UPI");
  const [formGateway, setFormGateway] = useState<Transaction["gateway"]>("Razorpay");
  const [formStatus, setFormStatus] = useState<Transaction["status"]>("Success");

  const openAddTxModal = () => {
    setEditingTx(null);
    setFormCustomer("");
    setFormUserId("#10490");
    setFormAmount("₹999");
    setFormMethod("UPI");
    setFormGateway("Razorpay");
    setFormStatus("Success");
    setTxFormOpen(true);
  };

  const openEditTxModal = (tx: Transaction) => {
    setEditingTx(tx);
    setFormCustomer(tx.userName);
    setFormUserId(tx.userId);
    setFormAmount(tx.amount);
    setFormMethod(tx.method);
    setFormGateway(tx.gateway);
    setFormStatus(tx.status);
    setTxFormOpen(true);
  };

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCustomer.trim() || !formAmount.trim()) return;

    if (editingTx) {
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === editingTx.id
            ? {
                ...t,
                userName: formCustomer.trim(),
                userId: formUserId.trim() || t.userId,
                amount: formAmount.trim(),
                method: formMethod,
                gateway: formGateway,
                status: formStatus,
              }
            : t
        )
      );
      showToast(`Transaction ${editingTx.txId} updated.`);
    } else {
      const newTx: Transaction = {
        id: `t_${Date.now()}`,
        txId: `TXN_${Math.floor(982200 + Math.random() * 9000)}`,
        userId: formUserId.trim() || "#10490",
        userName: formCustomer.trim(),
        amount: formAmount.trim().startsWith("₹") ? formAmount.trim() : `₹${formAmount.trim()}`,
        method: formMethod,
        gateway: formGateway,
        status: formStatus,
        date: "Just now",
      };
      setTransactions((prev) => [newTx, ...prev]);
      showToast(`Transaction ${newTx.txId} added.`);
    }
    setTxFormOpen(false);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleRefund = (tx: Transaction) => {
    // Move to Under Review state first
    setTransactions((prev) =>
      prev.map((t) => (t.id === tx.id ? { ...t, status: "Refunded" } : t))
    );
    setSelectedTx((prev) => (prev ? { ...prev, status: "Refunded" } : null));
    showToast(`Refund requested for ${tx.txId} (${tx.amount}).`);
  };

  const handleRefundDecision = (tx: Transaction, decision: "Approved" | "Rejected") => {
    const newStatus = decision === "Approved" ? "RefundedApproved" : "RefundRejected";
    setTransactions((prev) =>
      prev.map((t) => (t.id === tx.id ? { ...t, status: newStatus } : t))
    );
    setSelectedTx((prev) => (prev ? { ...prev, status: newStatus } : null));
    showToast(`Refund ${decision.toLowerCase()} for ${tx.txId}.`);
  };


  const columns: Column<Transaction>[] = [
    {
      key: "txId",
      header: "Transaction ID",
      render: (row) => <span className="font-mono text-slate-300 font-semibold">{row.txId}</span>,
    },
    {
      key: "userName",
      header: "Customer",
      render: (row) => (
        <div>
          <span className="font-semibold text-white block">{row.userName}</span>
          <span className="text-[11px] font-mono text-slate-400">{row.userId}</span>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      render: (row) => <span className="font-mono font-bold text-emerald-400">{row.amount}</span>,
    },
    {
      key: "method",
      header: "Payment Method",
      render: (row) => (
        <span className="text-slate-300 flex items-center gap-1.5 text-xs">
          {row.method === "UPI" ? (
            <Smartphone size={13} className="text-cyan-400" />
          ) : (
            <CreditCard size={13} className="text-purple-400" />
          )}
          {row.method} ({row.gateway})
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <StatusBadge
          status={
            row.status === "Success"
              ? "Active"
              : row.status === "Pending"
              ? "Pending"
              : row.status === "Refunded"
              ? "Under Review"
              : row.status === "RefundedApproved"
              ? "Refund Approved"
              : row.status === "RefundRejected"
              ? "Refund Rejected"
              : "Banned"
          }
          dot
          size="sm"
        />
      ),
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
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEditTxModal(row);
            }}
            className="px-2 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-[#263247] transition-colors flex items-center gap-1"
            title="Edit Transaction"
          >
            <Edit2 size={11} />
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedTx(row);
            }}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-[#263247] transition-colors"
          >
            Receipt
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Payments & Transactions"
          description="Live audit trail of micro-transactions, subscription renewals, super-likes, in-app wallet topups, and refund claims."
          actions={
            <button
              onClick={openAddTxModal}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-xs font-semibold text-white flex items-center gap-2 shadow-md shadow-pink-500/20 hover:opacity-90 transition-opacity"
            >
              <Plus size={15} />
              Add Transaction
            </button>
          }
        />

        {toast && (
          <div className="p-3 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs flex items-center justify-between">
            <span>{toast}</span>
            <button onClick={() => setToast(null)}>✕</button>
          </div>
        )}

        {/* Financial Overview Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">Gross Volume (24h)</span>
            <p className="text-xl font-bold text-emerald-400 mt-1">₹4,82,630</p>
            <span className="text-[10px] text-emerald-400">↑ 13.6% vs yesterday</span>
          </div>
          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">Gateway Success Rate</span>
            <p className="text-xl font-bold text-white mt-1">98.6%</p>
            <span className="text-[10px] text-emerald-400">Razorpay + PhonePe normal</span>
          </div>
          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">UPI Payments Share</span>
            <p className="text-xl font-bold text-cyan-400 mt-1">74.2%</p>
            <span className="text-[10px] text-slate-400">Primary Indian method</span>
          </div>
          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">Refund Requests</span>
            <p className="text-xl font-bold text-slate-300 mt-1">0.2% (12)</p>
            <span className="text-[10px] text-emerald-400">Low dispute frequency</span>
          </div>
        </div>

        {/* Transactions Table */}
        <DataTable
          data={transactions}
          columns={columns}
          searchPlaceholder="Search by transaction ID, customer, gateway, or method..."
          searchKey={(t) => `${t.txId} ${t.userName} ${t.userId} ${t.method} ${t.gateway}`}
          filterOptions={{
            label: "Method",
            key: "method",
            values: ["UPI", "Credit Card", "Debit Card"],
          }}
          onRowClick={(row) => setSelectedTx(row)}
        />

        {/* Transaction Receipt Modal */}
        {selectedTx && (
          <Modal
            isOpen={!!selectedTx}
            onClose={() => setSelectedTx(null)}
            title="Transaction Receipt & Audit"
            description={`Reference: ${selectedTx.txId}`}
            footer={
              <div className="flex flex-col gap-2">
  {selectedTx.status === "Success" && (
    <button
      onClick={() => handleRefund(selectedTx)}
      className="px-3.5 py-2 text-xs rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30 transition-colors flex items-center gap-1.5"
    >
      <RefreshCw size={13} />
      Issue Full Refund
    </button>
  )}
  {selectedTx.status === "Refunded" && (
    <div className="flex gap-2">
      <button
        onClick={() => handleRefundDecision(selectedTx, "Approved")}
        className="px-3.5 py-2 text-xs rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors flex items-center gap-1.5"
      >
        Approve Refund
      </button>
      <button
        onClick={() => handleRefundDecision(selectedTx, "Rejected")}
        className="px-3.5 py-2 text-xs rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30 transition-colors flex items-center gap-1.5"
      >
        Reject Refund
      </button>
    </div>
  )}
  <button
    onClick={() => setSelectedTx(null)}
    className="px-4 py-2 text-xs rounded-xl bg-slate-800 text-slate-300 hover:text-white ml-auto"
  >
    Close Receipt
  </button>
</div>
            }
          >
            <div className="p-4 rounded-xl bg-[#0D1424] border border-[#263247] space-y-3 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#263247]">
                <div>
                  <span className="text-slate-400">Billed Amount</span>
                  <p className="text-2xl font-bold text-emerald-400 mt-0.5">{selectedTx.amount}</p>
                </div>
                <StatusBadge
                  status={mapTxStatusToBadge(selectedTx.status)}
                  dot
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-slate-300">
                <div className="p-2.5 rounded-lg bg-[#151F30] border border-[#263247]">
                  <span className="text-slate-500 block text-[11px]">Customer Account</span>
                  <span className="font-semibold text-white mt-0.5 block">{selectedTx.userName}</span>
                  <span className="font-mono text-slate-400 text-[10px]">{selectedTx.userId}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#151F30] border border-[#263247]">
                  <span className="text-slate-500 block text-[11px]">Payment Gateway</span>
                  <span className="font-semibold text-white mt-0.5 block">{selectedTx.gateway}</span>
                  <span className="text-slate-400 text-[10px]">{selectedTx.method} rail</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#151F30] border border-[#263247]">
                  <span className="text-slate-500 block text-[11px]">Processed Timestamp</span>
                  <span className="font-mono text-slate-200 mt-0.5 block">{selectedTx.date}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#151F30] border border-[#263247]">
                  <span className="text-slate-500 block text-[11px]">Settlement Status</span>
                  <span className="font-semibold text-emerald-400 mt-0.5 block">T+1 Settled to Bank</span>
                </div>
              </div>
            </div>
          </Modal>
        )}

        {/* Add / Edit Transaction Modal */}
        {txFormOpen && (
          <Modal
            isOpen={txFormOpen}
            onClose={() => setTxFormOpen(false)}
            title={editingTx ? `Edit Transaction (${editingTx.txId})` : "Add New Transaction"}
            description={
              editingTx
                ? "Update payment record details and status."
                : "Record a new payment or manual transaction entry."
            }
            footer={
              <>
                <button
                  type="button"
                  onClick={() => setTxFormOpen(false)}
                  className="px-4 py-2 text-xs rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSaveTransaction(e as unknown as React.FormEvent)}
                  disabled={!formCustomer.trim() || !formAmount.trim()}
                  className="px-4 py-2 text-xs rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium hover:opacity-90 disabled:opacity-40"
                >
                  {editingTx ? "Save Changes" : "Create Transaction"}
                </button>
              </>
            }
          >
            <form onSubmit={handleSaveTransaction} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Customer Name</label>
                  <input
                    type="text"
                    required
                    value={formCustomer}
                    onChange={(e) => setFormCustomer(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full px-3 py-2 bg-[#0D1424] border border-[#263247] rounded-xl text-slate-100 outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">User ID</label>
                  <input
                    type="text"
                    value={formUserId}
                    onChange={(e) => setFormUserId(e.target.value)}
                    placeholder="#10490"
                    className="w-full px-3 py-2 bg-[#0D1424] border border-[#263247] rounded-xl text-slate-100 outline-none focus:border-pink-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Amount</label>
                  <input
                    type="text"
                    required
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    placeholder="₹999"
                    className="w-full px-3 py-2 bg-[#0D1424] border border-[#263247] rounded-xl text-slate-100 outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as Transaction["status"])}
                    className="w-full px-3 py-2 bg-[#0D1424] border border-[#263247] rounded-xl text-slate-100 outline-none focus:border-pink-500"
                  >
                    <option value="Success">Success (Active)</option>
                    <option value="Pending">Pending</option>
                    <option value="Failed">Failed</option>
                    <option value="Refunded">Under Review</option>
                    <option value="RefundedApproved">Refund Approved</option>
                    <option value="RefundRejected">Refund Rejected</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Payment Method</label>
                  <select
                    value={formMethod}
                    onChange={(e) => setFormMethod(e.target.value as Transaction["method"])}
                    className="w-full px-3 py-2 bg-[#0D1424] border border-[#263247] rounded-xl text-slate-100 outline-none focus:border-pink-500"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="NetBanking">NetBanking</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Gateway</label>
                  <select
                    value={formGateway}
                    onChange={(e) => setFormGateway(e.target.value as Transaction["gateway"])}
                    className="w-full px-3 py-2 bg-[#0D1424] border border-[#263247] rounded-xl text-slate-100 outline-none focus:border-pink-500"
                  >
                    <option value="Razorpay">Razorpay</option>
                    <option value="PhonePe">PhonePe</option>
                    <option value="Stripe">Stripe</option>
                  </select>
                </div>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </AdminLayout>
  );
}

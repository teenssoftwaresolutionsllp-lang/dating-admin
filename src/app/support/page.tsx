"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { LifeBuoy, MessageSquare, CheckCircle, Clock } from "lucide-react";

interface Ticket {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  subject: string;
  category: "Billing" | "Verification" | "Account" | "Bug Report";
  priority: "High" | "Medium" | "Low";
  status: "Open" | "In Progress" | "Resolved";
  date: string;
  message: string;
}

const mockTickets: Ticket[] = [
  { id: "tk1", ticketId: "TCK-8091", userId: "#10482", userName: "Aarav Sharma", subject: "Charged twice for Platinum renewal via UPI", category: "Billing", priority: "High", status: "Open", date: "Today 10:15", message: "My bank debited ₹999 two times but only 1 month was credited to my profile." },
  { id: "tk2", ticketId: "TCK-8090", userId: "#10480", userName: "Vikram Singh", subject: "Selfie verification taking longer than 24h", category: "Verification", priority: "Medium", status: "Open", date: "Today 09:30", message: "I submitted my selfie yesterday evening, it still shows pending verification." },
  { id: "tk3", ticketId: "TCK-8089", userId: "#10476", userName: "Ananya Deshmukh", subject: "Cannot update profile photos in iOS app", category: "Bug Report", priority: "Low", status: "In Progress", date: "Yesterday 21:00", message: "Tapping the '+' icon crashes on iOS 18.1 build." },
  { id: "tk4", ticketId: "TCK-8088", userId: "#10474", userName: "Tanvi Saxena", subject: "Requesting account deletion and data removal", category: "Account", priority: "Low", status: "Resolved", date: "Yesterday 16:40", message: "Found my match on the app! Please delete my account and photos permanently." },
  { id: "tk5", ticketId: "TCK-8087", userId: "#10473", userName: "Rohan Khanna", subject: "In-chat message delivery delayed", category: "Bug Report", priority: "Medium", status: "Resolved", date: "Oct 26", message: "Push notifications arriving but chats take 10 seconds to load." },
];

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [replyText, setReplyText] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const handleResolve = (ticket: Ticket) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticket.id ? { ...t, status: "Resolved" } : t))
    );
    setActiveTicket(null);
    setReplyText("");
    setToast(`Ticket ${ticket.ticketId} marked as Resolved.`);
    setTimeout(() => setToast(null), 3500);
  };

  const columns: Column<Ticket>[] = [
    {
      key: "ticketId",
      header: "Ticket ID",
      render: (row) => <span className="font-mono font-semibold text-slate-200">{row.ticketId}</span>,
    },
    {
      key: "userName",
      header: "User",
      render: (row) => (
        <div>
          <span className="font-medium text-white block">{row.userName}</span>
          <span className="text-[11px] font-mono text-slate-400">{row.userId}</span>
        </div>
      ),
    },
    {
      key: "subject",
      header: "Subject / Issue",
      render: (row) => <span className="font-medium text-slate-100">{row.subject}</span>,
    },
    {
      key: "category",
      header: "Category",
      render: (row) => (
        <span className="px-2 py-0.5 rounded-md bg-[#0D1424] text-slate-300 border border-[#263247] text-[11px]">
          {row.category}
        </span>
      ),
    },
    {
      key: "priority",
      header: "Priority",
      render: (row) => <StatusBadge status={row.priority} dot />,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <StatusBadge
          status={row.status === "Resolved" ? "Resolved" : row.status === "Open" ? "Open" : "Under Review"}
        />
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
            setActiveTicket(row);
          }}
          className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-[#263247]"
        >
          View / Reply
        </button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Support & User Helpdesk"
          description="Resolve billing inquiries, account queries, and technical troubleshooting tickets."
        />

        {toast && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between">
            <span>{toast}</span>
            <button onClick={() => setToast(null)}>✕</button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">Open Tickets</span>
            <p className="text-xl font-bold text-rose-400 mt-1">
              {tickets.filter((t) => t.status === "Open").length}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">Avg First Response</span>
            <p className="text-xl font-bold text-cyan-400 mt-1">18 mins</p>
          </div>
          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">Resolved Today</span>
            <p className="text-xl font-bold text-emerald-400 mt-1">42</p>
          </div>
          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">Satisfaction Score (CSAT)</span>
            <p className="text-xl font-bold text-white mt-1">94.2%</p>
          </div>
        </div>

        {/* Table */}
        <DataTable
          data={tickets}
          columns={columns}
          searchPlaceholder="Search tickets by ID, user, subject..."
          searchKey={(t) => `${t.ticketId} ${t.userName} ${t.subject} ${t.category}`}
          filterOptions={{
            label: "Priority",
            key: "priority",
            values: ["High", "Medium", "Low"],
          }}
          onRowClick={(row) => setActiveTicket(row)}
        />

        {/* Ticket Modal */}
        {activeTicket && (
          <Modal
            isOpen={!!activeTicket}
            onClose={() => setActiveTicket(null)}
            title={`Ticket ${activeTicket.ticketId}`}
            description={`Submitted by ${activeTicket.userName} (${activeTicket.userId})`}
            footer={
              <>
                <button
                  type="button"
                  onClick={() => setActiveTicket(null)}
                  className="px-4 py-2 text-xs rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => handleResolve(activeTicket)}
                  className="px-4 py-2 text-xs rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium hover:opacity-90"
                >
                  Send Reply & Resolve
                </button>
              </>
            }
          >
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#0D1424] border border-[#263247] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-sm">
                    {activeTicket.subject}
                  </span>
                  <StatusBadge status={activeTicket.priority} dot />
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {activeTicket.message}
                </p>
                <span className="text-[11px] text-slate-500 block">
                  Logged: {activeTicket.date}
                </span>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Agent Response Message
                </label>
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type support response to member..."
                  className="w-full px-3 py-2 bg-[#0D1424] border border-[#263247] rounded-xl text-slate-100 outline-none focus:border-pink-500"
                />
              </div>
            </div>
          </Modal>
        )}
      </div>
    </AdminLayout>
  );
}


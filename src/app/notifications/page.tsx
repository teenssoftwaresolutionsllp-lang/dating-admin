"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Modal } from "@/components/ui/Modal";
import { Bell, Send, CheckCircle2, Users, Sparkles } from "lucide-react";

interface PushNotification {
  id: string;
  title: string;
  body: string;
  audience: string;
  sentAt: string;
  delivered: string;
  openRate: string;
  status: "Sent" | "Scheduled" | "Draft";
}

const mockPushList: PushNotification[] = [
  { id: "pn1", title: "Weekend Match Boost is LIVE! ⚡", body: "Check out new profiles looking to connect in your area tonight.", audience: "All Active Users", sentAt: "Oct 28, 18:00", delivered: "172,400", openRate: "42.8%", status: "Sent" },
  { id: "pn2", title: "Someone liked your profile! 👀", body: "Don't leave them waiting. Open DatingApp to see who matched with you.", audience: "Single & Unmatched", sentAt: "Oct 27, 20:30", delivered: "84,200", openRate: "58.4%", status: "Sent" },
  { id: "pn3", title: "Complete your ID verification badge 🛡️", body: "Profiles with the blue checkmark receive 3x more matches.", audience: "Unverified Users", sentAt: "Oct 26, 14:00", delivered: "12,900", openRate: "34.1%", status: "Sent" },
  { id: "pn4", title: "Special Diwali Gold Membership Offer 🪔", body: "Unlock 50% discount on 6-month memberships for the next 24 hours.", audience: "Free Tier Users", sentAt: "Oct 25, 10:00", delivered: "145,000", openRate: "39.6%", status: "Sent" },
];

export default function NotificationsPage() {
  const [list, setList] = useState<PushNotification[]>(mockPushList);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState("All Active Users");
  const [toast, setToast] = useState<string | null>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    const newItem: PushNotification = {
      id: `pn_${Date.now()}`,
      title,
      body,
      audience,
      sentAt: "Just now",
      delivered: "188,420",
      openRate: "0.0%",
      status: "Sent",
    };

    setList([newItem, ...list]);
    setShowModal(false);
    setTitle("");
    setBody("");
    setToast("Broadcast notification delivered to user devices (Demo)!");
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Push Notifications & Announcements"
          description="Broadcast engagement messages, promote seasonal events, and send safety alerts."
          actions={
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-xs font-semibold text-white flex items-center gap-2 shadow-md shadow-pink-500/20 hover:opacity-90 transition-opacity"
            >
              <Send size={14} />
              Broadcast Notification
            </button>
          }
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
            <span className="text-xs text-slate-400">Total Sent This Month</span>
            <p className="text-xl font-bold text-white mt-1">28</p>
          </div>
          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">Avg Delivery Rate</span>
            <p className="text-xl font-bold text-emerald-400 mt-1">98.9%</p>
          </div>
          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">Avg Push Open Rate</span>
            <p className="text-xl font-bold text-pink-400 mt-1">44.6%</p>
          </div>
          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">Active FCM Tokens</span>
            <p className="text-xl font-bold text-cyan-400 mt-1">182,300</p>
          </div>
        </div>

        {/* List of Sent Notifications */}
        <div className="bg-[#151F30] border border-[#263247] rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-[#263247]">
            <h3 className="text-sm font-semibold text-white">
              Notification History & Campaign Delivery
            </h3>
          </div>
          <div className="divide-y divide-[#263247]/50">
            {list.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white">
                      {item.title}
                    </span>
                    <StatusBadge status={item.status === "Sent" ? "Active" : "Pending"} />
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.body}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                    <span>Target: <strong className="text-slate-200">{item.audience}</strong></span>
                    <span>•</span>
                    <span>Sent: {item.sentAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs text-right self-end sm:self-center">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Delivered</span>
                    <span className="font-mono font-semibold text-slate-200">{item.delivered}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Open Rate</span>
                    <span className="font-mono font-bold text-emerald-400">{item.openRate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compose Modal */}
        {showModal && (
          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title="Create Push Broadcast"
            description="Send a real-time push notification to dating app users."
            footer={
              <>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSend}
                  className="px-4 py-2 text-xs rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium hover:opacity-90"
                >
                  Send Broadcast
                </button>
              </>
            }
          >
            <form onSubmit={handleSend} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Target Audience
                </label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0D1424] border border-[#263247] rounded-xl text-slate-100 outline-none focus:border-pink-500"
                >
                  <option value="All Active Users">All Active Users</option>
                  <option value="Single & Unmatched">Single & Unmatched Users</option>
                  <option value="Unverified Users">Unverified Users</option>
                  <option value="Free Tier Users">Free Tier Users</option>
                  <option value="Premium VIP Members">Premium VIP Members</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Notification Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. New matches in your city tonight!"
                  className="w-full px-3 py-2 bg-[#0D1424] border border-[#263247] rounded-xl text-slate-100 outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Message Body
                </label>
                <textarea
                  rows={3}
                  required
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Type message content..."
                  className="w-full px-3 py-2 bg-[#0D1424] border border-[#263247] rounded-xl text-slate-100 outline-none focus:border-pink-500"
                />
              </div>
            </form>
          </Modal>
        )}
      </div>
    </AdminLayout>
  );
}


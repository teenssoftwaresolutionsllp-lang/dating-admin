"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { RecentUser, PrivacyRequest } from "@/types/dashboard";
import { recentUsersData, privacyRequestsData } from "@/lib/mock-data";
import {
  Mail,
  Phone,
  Calendar,
  Heart,
  ShieldAlert,
  UserCheck,
  MapPin,
  Download,
  Shield,
  Trash2,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Lock,
} from "lucide-react";

const extendedUsers: RecentUser[] = [
  ...recentUsersData,
  {
    id: "6",
    userId: "#10477",
    name: "Arjun Kapoor",
    phone: "+91 93****8821",
    status: "Active",
    joinDate: "Oct 26, 2025",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=faces",
    email: "arjun.k@example.com",
    gender: "Male",
    location: "Kolkata, WB",
    matchesCount: 18,
  },
  {
    id: "7",
    userId: "#10476",
    name: "Ananya Deshmukh",
    phone: "+91 92****4412",
    status: "Active",
    joinDate: "Oct 26, 2025",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces",
    email: "ananya.d@example.com",
    gender: "Female",
    location: "Chennai, TN",
    matchesCount: 44,
  },
  {
    id: "8",
    userId: "#10475",
    name: "Kabir Mehta",
    phone: "+91 91****9988",
    status: "Inactive",
    joinDate: "Oct 25, 2025",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces",
    email: "kabir.m@example.com",
    gender: "Male",
    location: "Ahmedabad, GJ",
    matchesCount: 8,
  },
  {
    id: "9",
    userId: "#10474",
    name: "Tanvi Saxena",
    phone: "+91 90****1234",
    status: "Banned",
    joinDate: "Oct 25, 2025",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop&crop=faces",
    email: "tanvi.s@example.com",
    gender: "Female",
    location: "Jaipur, RJ",
    matchesCount: 5,
  },
  {
    id: "10",
    userId: "#10473",
    name: "Rohan Khanna",
    phone: "+91 89****5678",
    status: "Active",
    joinDate: "Oct 24, 2025",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop&crop=faces",
    email: "rohan.k@example.com",
    gender: "Male",
    location: "Chandigarh, CH",
    matchesCount: 31,
  },
];

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState<"users" | "privacy">("users");
  const [users, setUsers] = useState<RecentUser[]>(extendedUsers);
  const [selectedUser, setSelectedUser] = useState<RecentUser | null>(null);

  // Privacy requests state
  const [privacyRequests] = useState<PrivacyRequest[]>(privacyRequestsData);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggleStatus = (user: RecentUser) => {
    const nextStatus = user.status === "Banned" ? "Active" : "Banned";
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
    );
    setSelectedUser((prev) => (prev ? { ...prev, status: nextStatus } : null));
    showToast(`Account status for ${user.name} updated to ${nextStatus}.`);
  };

  const userColumns: Column<RecentUser>[] = [
    {
      key: "userId",
      header: "User ID",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-700 flex-shrink-0 border border-slate-600">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={row.avatar}
              alt={row.name}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-mono text-slate-300 font-medium">
            {row.userId}
          </span>
        </div>
      ),
    },
    {
      key: "name",
      header: "Full Name",
      render: (row) => (
        <span className="font-semibold text-slate-100 hover:text-pink-400 transition-colors">
          {row.name}
        </span>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      render: (row) => (
        <span className="font-mono text-slate-400">{row.phone}</span>
      ),
    },
    {
      key: "gender",
      header: "Gender / Location",
      render: (row) => (
        <span className="text-slate-400">
          {row.gender || "Male"} • {row.location || "Mumbai, MH"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "joinDate",
      header: "Join Date",
      render: (row) => <span className="text-slate-400">{row.joinDate}</span>,
    },
    {
      key: "action",
      header: "Actions",
      align: "right",
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedUser(row);
          }}
          className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-[#263247] transition-colors"
        >
          View Profile
        </button>
      ),
    },
  ];

  const privacyColumns: Column<PrivacyRequest>[] = [
    {
      key: "id",
      header: "Request ID",
      render: (row) => <span className="font-mono text-slate-300 font-semibold">{row.id}</span>,
    },
    {
      key: "userName",
      header: "User Account",
      render: (row) => (
        <div>
          <span className="font-semibold text-white block">{row.userName}</span>
          <span className="font-mono text-slate-400 text-[11px]">{row.userId}</span>
        </div>
      ),
    },
    {
      key: "requestType",
      header: "Request Category",
      render: (row) => (
        <span className="font-semibold text-slate-200 flex items-center gap-1.5">
          {row.requestType === "Account Deletion" ? (
            <Trash2 size={13} className="text-rose-400" />
          ) : row.requestType === "Data Export" ? (
            <Download size={13} className="text-blue-400" />
          ) : (
            <Shield size={13} className="text-amber-400" />
          )}
          {row.requestType}
        </span>
      ),
    },
    {
      key: "submittedAt",
      header: "Submitted",
      render: (row) => <span className="text-slate-400 font-mono text-xs">{row.submittedAt}</span>,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Users Management"
          description="View, search, filter registered dating profiles across India, and handle GDPR/privacy compliance requests."
          actions={
            <div className="flex bg-[#0D1424] p-1 rounded-xl border border-[#263247]">
              <button
                onClick={() => setActiveTab("users")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "users"
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                All Users
              </button>
              <button
                onClick={() => setActiveTab("privacy")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "privacy"
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Privacy & Account Requests
              </button>
            </div>
          }
        />

        {toast && (
          <div className="p-3 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs flex items-center justify-between">
            <span>{toast}</span>
            <button onClick={() => setToast(null)}>✕</button>
          </div>
        )}

        {/* Tab 1: All Users */}
        {activeTab === "users" && (
          <div className="space-y-6">
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
                <span className="text-xs text-slate-400">Total Registered</span>
                <p className="text-xl font-bold text-white mt-1">188,420</p>
              </div>
              <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
                <span className="text-xs text-slate-400">Active Today</span>
                <p className="text-xl font-bold text-emerald-400 mt-1">8,432</p>
              </div>
              <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
                <span className="text-xs text-slate-400">Inactive Accounts</span>
                <p className="text-xl font-bold text-amber-400 mt-1">412</p>
              </div>
              <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
                <span className="text-xs text-slate-400">Banned Accounts</span>
                <p className="text-xl font-bold text-rose-400 mt-1">64</p>
              </div>
            </div>

            {/* Users Table */}
            <DataTable
              data={users}
              columns={userColumns}
              searchPlaceholder="Search by name, ID, phone, location..."
              searchKey={(u) => `${u.name} ${u.userId} ${u.phone} ${u.location || ""}`}
              filterOptions={{
                label: "Status",
                key: "status",
                values: ["Active", "Inactive", "Banned"],
              }}
              onRowClick={(row) => setSelectedUser(row)}
            />
          </div>
        )}

        {/* Tab 2: Privacy & Account Requests */}
        {activeTab === "privacy" && (
          <div className="space-y-6">
            {/* Privacy Request Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Deleted Accounts</span>
                  <Trash2 size={16} className="text-rose-400" />
                </div>
                <p className="text-xl font-bold text-rose-400 mt-1">24</p>
                <span className="text-[10px] text-slate-400">Right to be forgotten</span>
              </div>
              <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Deactivated Accounts</span>
                  <Lock size={16} className="text-amber-400" />
                </div>
                <p className="text-xl font-bold text-amber-400 mt-1">156</p>
                <span className="text-[10px] text-slate-400">Temporary snooze</span>
              </div>
              <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Reactivation Pending</span>
                  <CheckCircle size={16} className="text-emerald-400" />
                </div>
                <p className="text-xl font-bold text-emerald-400 mt-1">8</p>
                <span className="text-[10px] text-slate-400">Identity verification ok</span>
              </div>
              <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Privacy Inquiries</span>
                  <Shield size={16} className="text-cyan-400" />
                </div>
                <p className="text-xl font-bold text-cyan-400 mt-1">12</p>
                <span className="text-[10px] text-slate-400">Data protection officer</span>
              </div>
            </div>

            {/* Privacy Requests Table */}
            <DataTable
              data={privacyRequests}
              columns={privacyColumns}
              searchPlaceholder="Search by user, ID, request type..."
              searchKey={(r) => `${r.id} ${r.userId} ${r.userName} ${r.requestType}`}
              filterOptions={{
                label: "Request",
                key: "requestType",
                values: ["Account Deletion", "Data Export", "Deactivation", "Reactivation", "Privacy Inquiry"],
              }}
            />
          </div>
        )}

        {/* User Details Modal */}
        {selectedUser && (
          <Modal
            isOpen={!!selectedUser}
            onClose={() => setSelectedUser(null)}
            title="User Profile Details"
            description={`Account ID: ${selectedUser.userId}`}
            footer={
              <>
                <button
                  onClick={() => handleToggleStatus(selectedUser)}
                  className={`px-4 py-2 text-xs rounded-xl font-medium transition-colors ${
                    selectedUser.status === "Banned"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
                      : "bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30"
                  }`}
                >
                  {selectedUser.status === "Banned"
                    ? "Unban User"
                    : "Ban Account"}
                </button>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 text-xs rounded-xl bg-slate-800 text-slate-200 hover:text-white"
                >
                  Close
                </button>
              </>
            }
          >
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0D1424] border border-[#263247]">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-pink-500/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">
                    {selectedUser.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={selectedUser.status} />
                    <span className="text-xs text-slate-400">
                      Joined {selectedUser.joinDate}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#0D1424] border border-[#263247]">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Mail size={13} className="text-slate-500" /> Email Address
                  </span>
                  <p className="font-medium text-slate-200 mt-1">
                    {selectedUser.email || "user@example.com"}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#0D1424] border border-[#263247]">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Phone size={13} className="text-slate-500" /> Contact Number
                  </span>
                  <p className="font-medium text-slate-200 font-mono mt-1">
                    {selectedUser.phone}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#0D1424] border border-[#263247]">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <MapPin size={13} className="text-slate-500" /> Registered City
                  </span>
                  <p className="font-medium text-slate-200 mt-1">
                    {selectedUser.location || "Mumbai, MH"}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#0D1424] border border-[#263247]">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Heart size={13} className="text-pink-500" /> Total Matches
                  </span>
                  <p className="font-medium text-slate-200 mt-1">
                    {selectedUser.matchesCount || 24} mutual matches
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

"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Modal } from "@/components/ui/Modal";
import {
  UserPlus,
  Shield,
  Check,
  X,
  History,
  Lock,
  Edit2,
  Trash2,
  UserCheck,
  Activity,
  AlertTriangle,
} from "lucide-react";
import {
  getRegisteredAdmins,
  saveRegisteredAdmins,
  getRolePermissions,
  saveRolePermissions,
  AdminAccount,
  AdminRole,
  PermissionKey,
  RolePermissionsMap,
} from "@/lib/auth-rbac";

type AdminUser = AdminAccount;

interface RoleDef {
  name: string;
  description: string;
  usersAssigned: number;
  permissions: Record<string, boolean>;
}

const initialAdmins: AdminUser[] = [
  {
    id: "adm1",
    name: "Admin User",
    email: "admin@datingapp.internal",
    role: "Super Admin",
    lastLogin: "Just now",
    status: "Active",
    avatar: "A",
    recentActivity: [
      "Configured RBAC permissions for Safety Moderator on Oct 28",
      "Exported quarterly revenue financial reports",
      "Approved system microservices health check",
    ],
  },
  {
    id: "adm2",
    name: "Priya Menon",
    email: "priya.m@datingapp.internal",
    role: "Safety Moderator",
    lastLogin: "2 hours ago",
    status: "Active",
    avatar: "P",
    recentActivity: [
      "Resolved harassment report #r2 on Oct 28",
      "Approved 18 government ID documents in verification queue",
      "Issued warning notice to account #10478",
    ],
  },
  {
    id: "adm3",
    name: "Dev Sharma",
    email: "dev.s@datingapp.internal",
    role: "Billing Lead",
    lastLogin: "Yesterday 18:20",
    status: "Active",
    avatar: "D",
    recentActivity: [
      "Reviewed UPI payment webhook anomalies",
      "Updated VIP Diamond annual discount promo banner",
      "Processed refund for transaction TXN_982140",
    ],
  },
  {
    id: "adm4",
    name: "Kavita Roy",
    email: "kavita.r@datingapp.internal",
    role: "Support Specialist",
    lastLogin: "3 days ago",
    status: "Active",
    avatar: "K",
    recentActivity: [
      "Answered 24 support tickets in customer queue",
      "Escalated account reactivation request #pr_4",
    ],
  },
];

const initialRoles: RoleDef[] = [
  {
    name: "Super Admin",
    description: "Unrestricted access across all portal modules, databases, and billing operations.",
    usersAssigned: 1,
    permissions: {
      "Users Read / Write": true,
      "Verification Actions": true,
      "Moderation & Bans": true,
      "Billing & Refunds": true,
      "CMS Publishing": true,
      "System Settings": true,
    },
  },
  {
    name: "Safety Moderator",
    description: "Handle verification queue, content reports, user bans, and profile safety checks.",
    usersAssigned: 2,
    permissions: {
      "Users Read / Write": true,
      "Verification Actions": true,
      "Moderation & Bans": true,
      "Billing & Refunds": false,
      "CMS Publishing": false,
      "System Settings": false,
    },
  },
  {
    name: "Billing Lead",
    description: "Manage subscription tiers, payment gateway transactions, and process refund tickets.",
    usersAssigned: 1,
    permissions: {
      "Users Read / Write": false,
      "Verification Actions": false,
      "Moderation & Bans": false,
      "Billing & Refunds": true,
      "CMS Publishing": false,
      "System Settings": false,
    },
  },
  {
    name: "Support Specialist",
    description: "Review user helpdesk tickets, view basic user profile details, and assist customer inquiries.",
    usersAssigned: 3,
    permissions: {
      "Users Read / Write": false,
      "Verification Actions": false,
      "Moderation & Bans": false,
      "Billing & Refunds": false,
      "CMS Publishing": false,
      "System Settings": false,
    },
  },
];

const permissionList = [
  "Users Read / Write",
  "Verification Actions",
  "Moderation & Bans",
  "Billing & Refunds",
  "CMS Publishing",
  "System Settings",
];

export default function AdminUsersPermissionsPage() {
  const [activeTab, setActiveTab] = useState<"team" | "roles">("team");
  const [admins, setAdmins] = useState<AdminUser[]>(initialAdmins);
  const [roles, setRoles] = useState<RoleDef[]>(initialRoles);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedAdminActivity, setSelectedAdminActivity] = useState<AdminUser | null>(null);

  useEffect(() => {
    const storedAdmins = getRegisteredAdmins();
    setAdmins(storedAdmins);
    const storedPerms = getRolePermissions();
    setRoles((prev) =>
      prev.map((r) => ({
        ...r,
        usersAssigned: storedAdmins.filter((a) => a.role === r.name).length,
        permissions: storedPerms[r.name as AdminRole] || r.permissions,
      }))
    );
  }, []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<AdminUser["role"]>("Safety Moderator");
  const [toast, setToast] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"info" | "success" | "error">("info");
  const [createStep, setCreateStep] = useState<"form" | "created">("form");

  const showToast = (msg: string, type: "info" | "success" | "error" = "info") => {
    setToast(msg);
    setToastType(type);
    setTimeout(() => setToast(null), 4000);
  };

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) return;

    const cleanEmail = email.trim();
    if (admins.some((a) => a.email.toLowerCase() === cleanEmail.toLowerCase())) {
      showToast(`An administrator with email ${cleanEmail} already exists.`, "error");
      return;
    }

    const newAdmin: AdminUser = {
      id: `adm_${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      password,
      role,
      lastLogin: "Never",
      status: "Active",
      avatar: name.trim().charAt(0).toUpperCase(),
      recentActivity: [`Account created by Super Admin on ${new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric" })}`],
    };

    const updatedAdmins = [...admins, newAdmin];
    setAdmins(updatedAdmins);
    saveRegisteredAdmins(updatedAdmins);
    setRoles((prev) =>
      prev.map((r) => ({
        ...r,
        usersAssigned: updatedAdmins.filter((a) => a.role === r.name).length,
      }))
    );
    setCreateStep("created");
    setTimeout(() => {
      setShowInviteModal(false);
      setCreateStep("form");
      setName("");
      setEmail("");
      setPassword("");
      showToast(`✅ Administrator ${newAdmin.name} created successfully!`, "success");
    }, 2000);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    handleCreateAdmin(e);
  };

  const handleResendInvite = (adm: AdminUser) => {
    showToast(`✉️ Login credentials resent to ${adm.email}!`, "success");
  };

  const handleToggleAdminStatus = (adminId: string) => {
    const target = admins.find((a) => a.id === adminId);
    if (!target) return;
    if (target.role === "Super Admin") {
      showToast("Primary Super Admin account cannot be deactivated.");
      return;
    }
    const nextStatus: AdminUser["status"] = target.status === "Active" ? "Inactive" : "Active";
    const updated = admins.map((adm) =>
      adm.id === adminId ? { ...adm, status: nextStatus } : adm
    );
    setAdmins(updated);
    saveRegisteredAdmins(updated);
    showToast(`Admin ${target.name} set to ${nextStatus}.`);
  };

  const togglePermission = (roleName: string, permKey: string) => {
    if (roleName === "Super Admin") {
      showToast("Super Admin permissions cannot be downgraded.");
      return;
    }

    const updated = roles.map((r) => {
      if (r.name !== roleName) return r;
      return {
        ...r,
        permissions: {
          ...r.permissions,
          [permKey]: !r.permissions[permKey],
        },
      };
    });

    const permsMap = updated.reduce((acc, r) => {
      acc[r.name as AdminRole] = r.permissions as Record<PermissionKey, boolean>;
      return acc;
    }, {} as RolePermissionsMap);

    setRoles(updated);
    saveRolePermissions(permsMap);
    showToast(`Updated ${permKey} for ${roleName}.`, "success");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Admin Users & Permissions"
          description="Manage administrative staff access, inspect security audit logs, configure RBAC policies, and grant granular privileges."
          actions={
            <div className="flex items-center gap-3">
              <div className="flex bg-[#0D1424] p-1 rounded-xl border border-[#263247]">
                <button
                  onClick={() => setActiveTab("team")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === "team"
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Authorized Team
                </button>
                <button
                  onClick={() => setActiveTab("roles")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === "roles"
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Roles & Permissions Matrix
                </button>
              </div>

              {activeTab === "team" && (
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-xs font-semibold text-white flex items-center gap-2 shadow-md shadow-pink-500/20 hover:opacity-90 transition-opacity"
                >
                  <UserPlus size={15} />
                  Create Admin
                </button>
              )}
            </div>
          }
        />

        {toast && (
          <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
            toastType === "success"
              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
              : toastType === "error"
              ? "bg-rose-500/15 border-rose-500/30 text-rose-300"
              : "bg-indigo-500/15 border-indigo-500/30 text-indigo-300"
          }`}>
            <span>{toast}</span>
            <button onClick={() => setToast(null)}>✕</button>
          </div>
        )}

        {/* Tab 1: Authorized Team */}
        {activeTab === "team" && (
          <div className="space-y-6">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
                <span className="text-xs text-slate-400">Total Staff</span>
                <p className="text-xl font-bold text-white mt-1">{admins.length}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
                <span className="text-xs text-slate-400">Active Today</span>
                <p className="text-xl font-bold text-emerald-400 mt-1">
                  {admins.filter((a) => a.status === "Active").length}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
                <span className="text-xs text-slate-400">Roles Configured</span>
                <p className="text-xl font-bold text-purple-400 mt-1">{roles.length}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
                <span className="text-xs text-slate-400">Security Audit State</span>
                <p className="text-xl font-bold text-cyan-400 mt-1">Compliant</p>
              </div>
            </div>

            {/* Admin Users Table */}
            <div className="bg-[#151F30] border border-[#263247] rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-[#263247]">
                <h3 className="text-sm font-semibold text-white">
                  Authorized Portal Team Members
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-[#263247] text-slate-400 font-medium bg-[#0D1424]/40">
                      <th className="py-3.5 px-4">Admin Member</th>
                      <th className="py-3.5 px-4">Email</th>
                      <th className="py-3.5 px-4">Role Assigned</th>
                      <th className="py-3.5 px-4">Last Active</th>
                      <th className="py-3.5 px-4">Account Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#263247]/50">
                    {admins.map((adm) => (
                      <tr key={adm.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                              {adm.avatar}
                            </div>
                            <span className="font-semibold text-white">{adm.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                          {adm.email}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-400 font-semibold text-[11px]">
                            {adm.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">{adm.lastLogin}</td>
                        <td className="py-3.5 px-4">
                          <StatusBadge status={adm.status === "Inactive" ? "Banned" : adm.status} dot size="sm" />
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            onClick={() => setSelectedAdminActivity(adm)}
                            className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-[#263247] transition-colors"
                          >
                            View Activity
                          </button>
                          {adm.status === "Pending" && (
                            <button
                              onClick={() => handleResendInvite(adm)}
                              className="px-2.5 py-1 text-xs rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors"
                            >
                              Resend Invite
                            </button>
                          )}
                          {adm.role !== "Super Admin" && (
                            <button
                              onClick={() => handleToggleAdminStatus(adm.id)}
                              className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${
                                adm.status === "Active"
                                  ? "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20"
                                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                              }`}
                            >
                              {adm.status === "Active" ? "Deactivate" : "Activate"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Roles & Permissions (Merged from roles/page.tsx) */}
        {activeTab === "roles" && (
          <div className="space-y-6">
            {/* Roles Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {roles.map((role) => (
                <div
                  key={role.name}
                  className="p-5 rounded-2xl bg-[#151F30] border border-[#263247] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Shield size={16} className="text-pink-400" />
                        {role.name}
                      </h4>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {role.usersAssigned} staff
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      {role.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#263247]/60 text-xs font-semibold text-pink-400">
                    {Object.values(role.permissions).filter(Boolean).length} Active Permissions
                  </div>
                </div>
              ))}
            </div>

            {/* Permissions Matrix Table */}
            <div className="bg-[#151F30] border border-[#263247] rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-[#263247]">
                <h3 className="text-sm font-semibold text-white">
                  Granular Permission Matrix
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-[#263247] text-slate-400 font-medium bg-[#0D1424]/40">
                      <th className="py-3.5 px-4">Capability / Scope</th>
                      {roles.map((r) => (
                        <th key={r.name} className="py-3.5 px-4 text-center">
                          {r.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#263247]/50">
                    {permissionList.map((perm) => (
                      <tr key={perm} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-medium text-slate-200">
                          {perm}
                        </td>
                        {roles.map((r) => {
                          const enabled = r.permissions[perm];
                          return (
                            <td key={r.name} className="py-3.5 px-4 text-center">
                              <button
                                onClick={() => togglePermission(r.name, perm)}
                                className={`p-1.5 rounded-lg border transition-all ${
                                  enabled
                                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30"
                                    : "bg-slate-800 text-slate-500 border-slate-700 hover:text-slate-300"
                                }`}
                                title={`Click to toggle ${perm} for ${r.name}`}
                              >
                                {enabled ? <Check size={14} /> : <X size={14} />}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Create Admin Modal */}
        {showInviteModal && (
          <Modal
            isOpen={showInviteModal}
            onClose={() => { setShowInviteModal(false); setCreateStep("form"); setName(""); setEmail(""); setPassword(""); }}
            title={createStep === "created" ? "Administrator Created!" : "Create Administrator"}
            description={
              createStep === "form"
                ? "Set up login credentials and assign a role for the new admin."
                : `${name}'s account is now active and ready to use.`
            }
            footer={
              createStep === "form" ? (
                <>
                  <button
                    type="button"
                    onClick={() => { setShowInviteModal(false); setCreateStep("form"); setName(""); setEmail(""); setPassword(""); }}
                    className="px-4 py-2 text-xs rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleCreateAdmin(e as unknown as React.FormEvent)}
                    disabled={!name.trim() || !email.trim() || !password.trim()}
                    className="px-4 py-2 text-xs rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <UserCheck size={13} />
                    Create Administrator
                  </button>
                </>
              ) : null
            }
          >
            {createStep === "form" && (
              <form onSubmit={handleCreateAdmin} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Verma"
                    className="w-full px-3 py-2 bg-[#0D1424] border border-[#263247] rounded-xl text-slate-100 outline-none focus:border-pink-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rahul@datingapp.internal"
                    className="w-full px-3 py-2 bg-[#0D1424] border border-[#263247] rounded-xl text-slate-100 outline-none focus:border-pink-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Set a secure password"
                      className="w-full px-3 py-2 pr-10 bg-[#0D1424] border border-[#263247] rounded-xl text-slate-100 outline-none focus:border-pink-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      )}
                    </button>
                  </div>
                  <p className="mt-1 text-slate-500 text-[11px]">These credentials will be shared with the administrator to log in.</p>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Role Assignment</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as AdminUser["role"])}
                    className="w-full px-3 py-2 bg-[#0D1424] border border-[#263247] rounded-xl text-slate-100 outline-none focus:border-pink-500 transition-colors"
                  >
                    <option value="Safety Moderator">Safety Moderator</option>
                    <option value="Billing Lead">Billing Lead</option>
                    <option value="Support Specialist">Support Specialist</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>

                {/* Credentials summary box */}
                {name && email && password && (
                  <div className="p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/20 text-emerald-300 space-y-1.5">
                    <p className="font-semibold text-[11px] text-emerald-400 flex items-center gap-1.5">
                      <Lock size={11} /> Login Credentials Summary
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      <span className="text-slate-300">Email:</span> {email}
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      <span className="text-slate-300">Password:</span> {"•".repeat(password.length)}
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      <span className="text-slate-300">Role:</span> {role}
                    </p>
                  </div>
                )}
              </form>
            )}

            {createStep === "created" && (
              <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center text-2xl">
                  ✅
                </div>
                <p className="text-sm font-semibold text-white">Account Created!</p>
                <div className="p-3 rounded-xl bg-[#0D1424] border border-[#263247] text-left w-full space-y-2 text-xs">
                  <p className="text-slate-400"><span className="text-slate-200 font-semibold">Name:</span> {name}</p>
                  <p className="text-slate-400"><span className="text-slate-200 font-semibold">Email:</span> <span className="font-mono text-cyan-400">{email}</span></p>
                  <p className="text-slate-400"><span className="text-slate-200 font-semibold">Role:</span> <span className="text-pink-400">{role}</span></p>
                  <p className="text-slate-400"><span className="text-slate-200 font-semibold">Status:</span> <span className="text-emerald-400">Active</span></p>
                </div>
                <p className="text-xs text-slate-500">Share the email and password with the new administrator to log in.</p>
              </div>
            )}
          </Modal>
        )}

        {/* View Activity Log Modal */}
        {selectedAdminActivity && (
          <Modal
            isOpen={!!selectedAdminActivity}
            onClose={() => setSelectedAdminActivity(null)}
            title="Administrator Activity Log"
            description={`Audit record for ${selectedAdminActivity.name} (${selectedAdminActivity.email})`}
            footer={
              <button
                onClick={() => setSelectedAdminActivity(null)}
                className="px-4 py-2 text-xs rounded-xl bg-slate-800 text-slate-300 hover:text-white"
              >
                Close Audit Log
              </button>
            }
          >
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#0D1424] border border-[#263247] flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">{selectedAdminActivity.name}</span>
                  <span className="text-slate-400 text-[11px] font-mono">{selectedAdminActivity.role}</span>
                </div>
                <StatusBadge status={selectedAdminActivity.status} size="sm" dot />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Activity size={14} className="text-pink-400" />
                  Recent Actions Recorded
                </span>
                <div className="space-y-2">
                  {selectedAdminActivity.recentActivity.map((act, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-[#0D1424] border border-[#263247] flex items-center gap-2.5 text-slate-300"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </AdminLayout>
  );
}

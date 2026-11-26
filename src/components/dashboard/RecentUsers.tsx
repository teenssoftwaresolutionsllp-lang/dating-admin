"use client";

import React, { useState } from "react";
import Link from "next/link";
import { recentUsersData } from "@/lib/mock-data";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Modal } from "@/components/ui/Modal";
import { RecentUser } from "@/types/dashboard";
import { Mail, Phone, Heart, MapPin } from "lucide-react";

export function RecentUsers() {
  const [selectedUser, setSelectedUser] = useState<RecentUser | null>(null);

  return (
    <>
      <div className="bg-[#111A28] border border-[#1F293D] rounded-xl p-5 flex flex-col justify-between">
        {/* Table Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white tracking-tight">
            Recent Users
          </h3>
          <Link
            href="/users"
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
                <th className="pb-2.5 pl-1">User</th>
                <th className="pb-2.5">Name</th>
                <th className="pb-2.5">Phone</th>
                <th className="pb-2.5">Status</th>
                <th className="pb-2.5 pr-1 text-right">Join Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B2537]/60">
              {recentUsersData.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className="hover:bg-[#1A263A]/40 transition-colors cursor-pointer group"
                >
                  <td className="py-2.5 pl-1">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-700 flex-shrink-0 border border-slate-600/50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-mono text-[#718096] text-[11px]">
                        {user.userId}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 font-medium text-slate-200 group-hover:text-pink-400 transition-colors text-xs">
                    {user.name}
                  </td>
                  <td className="py-2.5 text-[#718096] font-mono text-[11px]">
                    {user.phone}
                  </td>
                  <td className="py-2.5">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="py-2.5 pr-1 text-right text-[#718096] text-[11px]">
                    {user.joinDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <Modal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          title="User Profile Details"
          description={`ID: ${selectedUser.userId} • Registered Member`}
          footer={
            <>
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 text-xs rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors"
              >
                Close
              </button>
              <Link
                href="/users"
                className="px-4 py-2 text-xs rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity"
              >
                Full Profile
              </Link>
            </>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#090E1A] border border-[#1F293D]">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-pink-500/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-white">
                    {selectedUser.name}
                  </h4>
                  <StatusBadge status={selectedUser.status} />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Member since {selectedUser.joinDate}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#090E1A] border border-[#1F293D] space-y-1">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Mail size={13} className="text-slate-500" />
                  Email
                </span>
                <p className="font-medium text-slate-200">
                  {selectedUser.email || "user@example.com"}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#090E1A] border border-[#1F293D] space-y-1">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Phone size={13} className="text-slate-500" />
                  Phone Number
                </span>
                <p className="font-medium text-slate-200 font-mono">
                  {selectedUser.phone}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#090E1A] border border-[#1F293D] space-y-1">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <MapPin size={13} className="text-slate-500" />
                  Location
                </span>
                <p className="font-medium text-slate-200">
                  {selectedUser.location || "Mumbai, MH"}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#090E1A] border border-[#1F293D] space-y-1">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Heart size={13} className="text-pink-500" />
                  Matches Made
                </span>
                <p className="font-medium text-slate-200">
                  {selectedUser.matchesCount || 24} matches
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { ProfileData } from "@/types/dashboard";
import { profilesData } from "@/lib/mock-data";
import {
  User,
  CheckCircle2,
  XCircle,
  Flag,
  AlertTriangle,
  Sparkles,
  Camera,
  Briefcase,
  GraduationCap,
  MapPin,
  Heart,
  Eye,
} from "lucide-react";

export default function ProfileManagementPage() {
  const [profiles, setProfiles] = useState<ProfileData[]>(profilesData);
  const [selectedProfile, setSelectedProfile] = useState<ProfileData | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handlePhotoAction = (profileId: string, action: "Approved" | "Rejected") => {
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === profileId
          ? {
              ...p,
              photoStatus: action,
              profileStatus: action === "Rejected" ? "Flagged" : p.profileStatus,
            }
          : p
      )
    );
    if (selectedProfile && selectedProfile.id === profileId) {
      setSelectedProfile((prev) =>
        prev
          ? {
              ...prev,
              photoStatus: action,
              profileStatus: action === "Rejected" ? "Flagged" : prev.profileStatus,
            }
          : null
      );
    }
    showToast(`Photos marked as ${action} for profile #${profileId}.`);
  };

  const handleFlagContent = (profileId: string) => {
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === profileId ? { ...p, profileStatus: "Flagged" } : p
      )
    );
    if (selectedProfile && selectedProfile.id === profileId) {
      setSelectedProfile((prev) =>
        prev ? { ...prev, profileStatus: "Flagged" } : null
      );
    }
    showToast(`Profile flagged for manual safety review.`);
  };

  const columns: Column<ProfileData>[] = [
    {
      key: "userId",
      header: "Profile",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-800 flex-shrink-0 border border-slate-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={row.avatar}
              alt={row.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="font-semibold text-white block hover:text-pink-400 transition-colors">
              {row.name}, {row.age}
            </span>
            <span className="font-mono text-slate-400 text-[11px]">
              {row.userId}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "location",
      header: "Location",
      render: (row) => (
        <span className="text-slate-300 text-xs flex items-center gap-1.5">
          <MapPin size={12} className="text-pink-400" />
          {row.location}
        </span>
      ),
    },
    {
      key: "completionPercent",
      header: "Completion",
      render: (row) => (
        <div className="w-28 space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-300 font-mono">{row.completionPercent}%</span>
            <span className={`text-[10px] font-semibold ${row.completionPercent >= 80 ? "text-emerald-400" : row.completionPercent >= 50 ? "text-amber-400" : "text-rose-400"}`}>
              {row.completionPercent >= 80 ? "High" : row.completionPercent >= 50 ? "Medium" : "Incomplete"}
            </span>
          </div>
          <div className="w-full bg-[#0D1424] h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                row.completionPercent >= 80
                  ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                  : row.completionPercent >= 50
                  ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                  : "bg-rose-500"
              }`}
              style={{ width: `${row.completionPercent}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: "photoStatus",
      header: "Photos",
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="text-slate-300 text-xs font-mono flex items-center gap-1">
            <Camera size={13} className="text-cyan-400" />
            {row.photoCount}
          </span>
          <StatusBadge status={row.photoStatus} size="sm" dot />
        </div>
      ),
    },
    {
      key: "profileStatus",
      header: "Status",
      render: (row) => <StatusBadge status={row.profileStatus} size="sm" />,
    },
    {
      key: "action",
      header: "Action",
      align: "right",
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedProfile(row);
          }}
          className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-[#263247] text-xs font-medium transition-colors"
        >
          View Profile
        </button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Profile Management"
          description="Audit dating profiles, inspect biographical content and interests, review uploaded photos, and moderate violations."
        />

        {toastMessage && (
          <div className="p-3 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs flex items-center justify-between">
            <span>{toastMessage}</span>
            <button onClick={() => setToastMessage(null)}>✕</button>
          </div>
        )}

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">Total Profiles</span>
            <p className="text-xl font-bold text-white mt-1">188,420</p>
            <span className="text-[10px] text-emerald-400">92% active in last 30d</span>
          </div>
          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">Complete Profiles</span>
            <p className="text-xl font-bold text-emerald-400 mt-1">152,800</p>
            <span className="text-[10px] text-slate-400">81.1% completion rate</span>
          </div>
          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">Flagged Profiles</span>
            <p className="text-xl font-bold text-rose-400 mt-1">
              {profiles.filter((p) => p.profileStatus === "Flagged").length}
            </p>
            <span className="text-[10px] text-rose-400">Requires safety review</span>
          </div>
          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">Photos Pending Review</span>
            <p className="text-xl font-bold text-amber-400 mt-1">
              {profiles.filter((p) => p.photoStatus === "Pending").length}
            </p>
            <span className="text-[10px] text-slate-400">AI moderation queue</span>
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          data={profiles}
          columns={columns}
          searchPlaceholder="Search by name, user ID, occupation, city..."
          searchKey={(p) => `${p.name} ${p.userId} ${p.location} ${p.occupation} ${p.education}`}
          filterOptions={{
            label: "Status",
            key: "profileStatus",
            values: ["Complete", "Incomplete", "Flagged", "Under Review"],
          }}
          onRowClick={(row) => setSelectedProfile(row)}
        />

        {/* Detailed Profile Review Modal */}
        {selectedProfile && (
          <Modal
            isOpen={!!selectedProfile}
            onClose={() => setSelectedProfile(null)}
            title="Dating Profile Review & Moderation"
            description={`Account: ${selectedProfile.name} • ${selectedProfile.userId}`}
            maxWidth="lg"
            footer={
              <div className="flex items-center justify-between w-full flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePhotoAction(selectedProfile.id, "Rejected")}
                    className="px-3.5 py-1.5 text-xs rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30 transition-colors flex items-center gap-1.5"
                  >
                    <XCircle size={14} />
                    Reject Photos
                  </button>
                  <button
                    onClick={() => handlePhotoAction(selectedProfile.id, "Approved")}
                    className="px-3.5 py-1.5 text-xs rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={14} />
                    Approve Photos
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleFlagContent(selectedProfile.id)}
                    className="px-3.5 py-1.5 text-xs rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 transition-colors flex items-center gap-1.5"
                  >
                    <Flag size={14} />
                    Flag Profile
                  </button>
                  <button
                    onClick={() => setSelectedProfile(null)}
                    className="px-4 py-1.5 text-xs rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            }
          >
            <div className="space-y-4">
              {/* Profile Card Header */}
              <div className="p-4 rounded-xl bg-[#0D1424] border border-[#263247] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-pink-500/40 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedProfile.avatar}
                      alt={selectedProfile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-white">
                        {selectedProfile.name}, {selectedProfile.age}
                      </h4>
                      <StatusBadge status={selectedProfile.profileStatus} size="sm" />
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                      <MapPin size={12} className="text-pink-400" />
                      {selectedProfile.location} • Member since {selectedProfile.joinDate}
                    </p>
                  </div>
                </div>

                <div className="text-right sm:self-center">
                  <span className="text-[11px] text-slate-400 block">Profile Completion</span>
                  <div className="text-lg font-bold text-white font-mono mt-0.5">
                    {selectedProfile.completionPercent}%
                  </div>
                </div>
              </div>

              {/* Bio & About Section */}
              <div className="p-4 rounded-xl bg-[#0D1424] border border-[#263247] space-y-2">
                <span className="text-xs font-semibold text-slate-300 block">About / Bio</span>
                <p className="text-xs text-slate-200 leading-relaxed bg-[#151F30] p-3 rounded-xl border border-[#263247]/60 italic">
                  &quot;{selectedProfile.bio}&quot;
                </p>
              </div>

              {/* Career & Education */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#0D1424] border border-[#263247] space-y-1">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Briefcase size={13} className="text-slate-500" />
                    Occupation / Career
                  </span>
                  <p className="font-semibold text-slate-200">
                    {selectedProfile.occupation}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#0D1424] border border-[#263247] space-y-1">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <GraduationCap size={13} className="text-slate-500" />
                    Education / College
                  </span>
                  <p className="font-semibold text-slate-200">
                    {selectedProfile.education}
                  </p>
                </div>
              </div>

              {/* Interests & Hobbies Tags */}
              <div className="p-4 rounded-xl bg-[#0D1424] border border-[#263247] space-y-2">
                <span className="text-xs font-semibold text-slate-300 block">
                  Declared Interests & Tags ({selectedProfile.interests.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProfile.interests.map((interest) => (
                    <span
                      key={interest}
                      className="px-2.5 py-1 rounded-lg bg-[#151F30] text-slate-200 border border-[#263247] text-xs font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Photos Gallery Review Mock */}
              <div className="p-4 rounded-xl bg-[#0D1424] border border-[#263247] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Camera size={14} className="text-pink-400" />
                    Uploaded Photos Gallery ({selectedProfile.photoCount})
                  </span>
                  <StatusBadge status={selectedProfile.photoStatus} size="sm" dot />
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {Array.from({ length: selectedProfile.photoCount }).map((_, idx) => (
                    <div
                      key={idx}
                      className="aspect-square rounded-xl overflow-hidden bg-slate-800 border border-[#263247] relative group"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedProfile.avatar}
                        alt={`Photo ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-mono text-white">
                        #{idx + 1}
                      </div>
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

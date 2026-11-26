"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Settings, Shield, Sliders, Bell, Save, Check } from "lucide-react";

export default function SettingsPage() {
  const [matchRadius, setMatchRadius] = useState(25);
  const [dailyLikes, setDailyLikes] = useState(50);
  const [safetyFilter, setSafetyFilter] = useState("Strict");
  const [requireVerification, setRequireVerification] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        <PageHeader
          title="Platform Settings"
          description="Configure matching distance parameters, AI safety thresholds, and system-wide defaults."
        />

        {saved && (
          <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <Check size={16} />
            <span>Platform settings saved successfully to configuration store!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Matching Algorithm Config */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#151F30] border border-[#263247] space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders size={16} className="text-pink-400" />
              Matching Algorithm Defaults
            </h3>

            <div className="space-y-4 text-xs pt-2">
              <div>
                <div className="flex items-center justify-between mb-1.5 text-slate-300">
                  <label className="font-medium">
                    Default Search Radius for New Users
                  </label>
                  <span className="font-mono text-pink-400 font-bold">
                    {matchRadius} km
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={matchRadius}
                  onChange={(e) => setMatchRadius(Number(e.target.value))}
                  className="w-full accent-pink-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Daily Free Swipe Limit (Free Tier)
                </label>
                <input
                  type="number"
                  value={dailyLikes}
                  onChange={(e) => setDailyLikes(Number(e.target.value))}
                  className="w-full sm:w-48 px-3 py-2 bg-[#0D1424] border border-[#263247] rounded-xl text-slate-100 outline-none focus:border-pink-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Trust & Safety Settings */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#151F30] border border-[#263247] space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield size={16} className="text-cyan-400" />
              Trust & Safety Automations
            </h3>

            <div className="space-y-4 text-xs pt-2">
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Computer Vision Photo Moderation Sensitivity
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["Lenient", "Moderate", "Strict"].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setSafetyFilter(level)}
                      className={`py-2 px-3 rounded-xl border text-center font-medium transition-colors ${
                        safetyFilter === level
                          ? "bg-pink-500/20 text-pink-400 border-pink-500/40"
                          : "bg-[#0D1424] text-slate-400 border-[#263247] hover:text-white"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0D1424] border border-[#263247]">
                <div>
                  <span className="font-semibold text-white block">
                    Require ID Verification Before Swiping
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Prompt users to upload Aadhaar or live selfie before discovery feed
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={requireVerification}
                  onChange={(e) => setRequireVerification(e.target.checked)}
                  className="w-4 h-4 accent-pink-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Maintenance & Emergency Controls */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#151F30] border border-[#263247] space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Bell size={16} className="text-amber-400" />
              Platform Maintenance Mode
            </h3>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0D1424] border border-[#263247] text-xs">
              <div>
                <span className="font-semibold text-white block">
                  Activate Maintenance Splash Screen
                </span>
                <span className="text-[11px] text-slate-400">
                  Temporarily pause mobile client traffic for scheduled database migrations
                </span>
              </div>
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="w-4 h-4 accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-xs font-semibold text-white flex items-center gap-2 shadow-lg shadow-pink-500/20 hover:opacity-90 transition-opacity"
            >
              <Save size={15} />
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}


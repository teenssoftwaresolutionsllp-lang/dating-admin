"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Activity, Server, Database, Cpu, Wifi, RefreshCw } from "lucide-react";

interface ServiceHealth {
  name: string;
  type: string;
  status: "Operational" | "Degraded" | "Maintenance";
  uptime: string;
  latency: string;
  region: string;
}

const services: ServiceHealth[] = [
  { name: "Public Mobile API Gateway", type: "Reverse Proxy / Envoy", status: "Operational", uptime: "99.95%", latency: "24ms", region: "ap-south-1 (Mumbai)" },
  { name: "Primary Database Cluster", type: "PostgreSQL Replica Set", status: "Operational", uptime: "99.99%", latency: "8ms", region: "ap-south-1 (Mumbai)" },
  { name: "Chat & Matching Message Queue", type: "Kafka / Redis Streams", status: "Operational", uptime: "99.85%", latency: "15ms", region: "ap-south-1 (Mumbai)" },
  { name: "Payment Webhook Dispatcher", type: "Serverless Workers", status: "Operational", uptime: "99.92%", latency: "120ms", region: "ap-south-1 (Mumbai)" },
  { name: "Redis In-Memory Session Cache", type: "Cluster (12 nodes)", status: "Operational", uptime: "99.99%", latency: "2ms", region: "ap-south-1 (Mumbai)" },
  { name: "AI Vision Photo NSFW Moderation", type: "GPU Inference Pods", status: "Operational", uptime: "99.78%", latency: "185ms", region: "ap-south-1 (Mumbai)" },
  { name: "FCM Push Notification Hub", type: "Google Cloud Messaging", status: "Operational", uptime: "99.90%", latency: "65ms", region: "Global CDN" },
];

export default function SystemHealthPage() {
  const [refreshing, setRefreshing] = useState(false);
  const [pingTime, setPingTime] = useState("Just now");

  const handlePing = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setPingTime("Just now");
    }, 600);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="System Health & Infrastructure"
          description="Live heartbeat monitoring for API gateways, PostgreSQL clusters, Redis caches, and ML vision pipelines."
          actions={
            <button
              onClick={handlePing}
              disabled={refreshing}
              className="px-3.5 py-2 rounded-xl bg-[#151F30] border border-[#263247] text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-2"
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin text-pink-400" : ""} />
              Ping All Services
            </button>
          }
        />

        {/* Global Banner */}
        <div className="system-health-page-banner p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#151F30] to-[#151F30] border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="system-health-page-banner-icon w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Activity size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                All Core Services Operational
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                No active service degradations or outages detected across ap-south-1 region. Last verified {pingTime}.
              </p>
            </div>
          </div>
          <span className="system-health-page-banner-uptime px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            99.94% Total Uptime
          </span>
        </div>

        {/* Infrastructure Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">API Gateway Average Latency</span>
            <p className="text-xl font-bold text-emerald-400 mt-1">24ms</p>
          </div>
          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">DB CPU Utilization</span>
            <p className="text-xl font-bold text-white mt-1">28.4%</p>
          </div>
          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">Queue Processing Velocity</span>
            <p className="text-xl font-bold text-cyan-400 mt-1">12,400 msg/s</p>
          </div>
          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <span className="text-xs text-slate-400">Memory Cache Hit Ratio</span>
            <p className="text-xl font-bold text-pink-400 mt-1">99.1%</p>
          </div>
        </div>

        {/* Services Table */}
        <div className="bg-[#151F30] border border-[#263247] rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-[#263247]">
            <h3 className="text-sm font-semibold text-white">
              Service Component Status
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="border-b border-[#263247] text-slate-400 font-medium bg-[#0D1424]/40">
                  <th className="py-3.5 px-4">Microservice / Subsystem</th>
                  <th className="py-3.5 px-4">Architecture Type</th>
                  <th className="py-3.5 px-4">Health Status</th>
                  <th className="py-3.5 px-4">30-Day Uptime</th>
                  <th className="py-3.5 px-4">Average Latency</th>
                  <th className="py-3.5 px-4 text-right">Datacenter Region</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#263247]/50">
                {services.map((srv) => (
                  <tr key={srv.name} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {srv.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{srv.type}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={srv.status} dot />
                    </td>
                    <td className="py-3.5 px-4 font-mono text-emerald-400 font-semibold">
                      {srv.uptime}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {srv.latency}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-400 font-mono text-[11px]">
                      {srv.region}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}


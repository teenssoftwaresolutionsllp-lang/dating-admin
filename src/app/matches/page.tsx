"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  Heart,
  MessageCircle,
  Sparkles,
  Search,
  TrendingUp,
  ThumbsUp,
  XCircle,
  Eye,
  Calendar,
  MessageSquare,
  Flame,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { engagementTrendData } from "@/lib/mock-data";

const mockMatches = [
  {
    id: "m1",
    userA: { name: "Aarav Sharma", age: 26, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" },
    userB: { name: "Sneha Reddy", age: 24, avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop" },
    compatibility: 96,
    city: "Mumbai",
    tags: ["Coffee", "Indie Music", "Dog Lover"],
    status: "Active Conversation",
    matchedAt: "12 mins ago",
    messagesCount: 18,
  },
  {
    id: "m2",
    userA: { name: "Vikram Singh", age: 28, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
    userB: { name: "Pooja Verma", age: 25, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
    compatibility: 89,
    city: "Bengaluru",
    tags: ["Tech", "Hiking", "Anime"],
    status: "Active Conversation",
    matchedAt: "45 mins ago",
    messagesCount: 32,
  },
  {
    id: "m3",
    userA: { name: "Kabir Mehta", age: 27, avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop" },
    userB: { name: "Diya Patel", age: 24, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" },
    compatibility: 92,
    city: "Delhi NCR",
    tags: ["Foodie", "Travel", "Art"],
    status: "First Move Pending",
    matchedAt: "2 hours ago",
    messagesCount: 0,
  },
  {
    id: "m4",
    userA: { name: "Rohan Khanna", age: 29, avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop" },
    userB: { name: "Tanvi Saxena", age: 26, avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop" },
    compatibility: 84,
    city: "Hyderabad",
    tags: ["Fitness", "Startups", "Reading"],
    status: "Active Conversation",
    matchedAt: "4 hours ago",
    messagesCount: 45,
  },
];

export default function MatchesPage() {
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("Last 7 days");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredMatches = mockMatches.filter(
    (m) =>
      m.userA.name.toLowerCase().includes(search.toLowerCase()) ||
      m.userB.name.toLowerCase().includes(search.toLowerCase()) ||
      m.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Matches & Engagement"
          description="Monitor platform mutual matches, likes vs passes velocity, active conversations, and messaging trends."
          actions={
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="bg-[#151F30] border border-[#263247] text-xs text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-pink-500 cursor-pointer"
                >
                  <option value="Today">Today</option>
                  <option value="Last 7 days">Last 7 days</option>
                  <option value="Last 30 days">Last 30 days</option>
                  <option value="This Year">This Year</option>
                </select>
              </div>
            </div>
          }
        />

        {/* 8 Detailed Engagement Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Total Matches</span>
              <Heart size={16} className="text-pink-400 fill-pink-400/20" />
            </div>
            <p className="text-2xl font-bold text-white mt-1">2,34,500</p>
            <span className="text-[10px] text-emerald-400 font-medium">↑ 11.4% vs last period</span>
          </div>

          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Daily Matches</span>
              <Flame size={16} className="text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-pink-400 mt-1">8,927</p>
            <span className="text-[10px] text-emerald-400 font-medium">↑ 8.2% today</span>
          </div>

          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Monthly Matches</span>
              <Calendar size={16} className="text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-white mt-1">68,400</p>
            <span className="text-[10px] text-emerald-400 font-medium">↑ 12.1% MoM</span>
          </div>

          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Total Likes Sent</span>
              <ThumbsUp size={16} className="text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-blue-400 mt-1">12,45,000</p>
            <span className="text-[10px] text-emerald-400 font-medium">↑ 15.8% swiped right</span>
          </div>

          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Likes Received</span>
              <Heart size={16} className="text-rose-400" />
            </div>
            <p className="text-2xl font-bold text-white mt-1">8,92,000</p>
            <span className="text-[10px] text-emerald-400 font-medium">71.6% mutual overlap</span>
          </div>

          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Total Passes</span>
              <XCircle size={16} className="text-slate-400" />
            </div>
            <p className="text-2xl font-bold text-slate-300 mt-1">4,56,000</p>
            <span className="text-[10px] text-slate-400 font-medium">26.8% swipe left rate</span>
          </div>

          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Profile Views</span>
              <Eye size={16} className="text-cyan-400" />
            </div>
            <p className="text-2xl font-bold text-cyan-400 mt-1">18,50,000</p>
            <span className="text-[10px] text-emerald-400 font-medium">↑ 22.4% view impressions</span>
          </div>

          <div className="p-4 rounded-xl bg-[#151F30] border border-[#263247]">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Active Conversations</span>
              <MessageSquare size={16} className="text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-emerald-400 mt-1">45,200</p>
            <span className="text-[10px] text-emerald-400 font-medium">64,392 messages today</span>
          </div>
        </div>

        {/* Engagement Trend Chart */}
        <div className="p-5 rounded-2xl bg-[#151F30] border border-[#263247] space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-sm font-semibold text-white">
                Engagement Velocity & Match Trends
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Comparison of daily right swipes, mutual matches, profile views, and message exchanges.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs flex-wrap">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EC4899]" /> Likes
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A855F7]" /> Matches
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]" /> Views
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" /> Messages
              </span>
            </div>
          </div>

          <div className="h-[280px] w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={engagementTrendData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="mPink" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#EC4899" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="mPurple" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#A855F7" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 2" stroke="#263247" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#64748B"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `${val / 1000}K`}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#090E1A", borderColor: "#263247", borderRadius: "12px", fontSize: "12px" }}
                  />
                  <Area type="monotone" dataKey="profileViews" stroke="#38BDF8" fillOpacity={0.1} fill="#38BDF8" strokeWidth={2} />
                  <Area type="monotone" dataKey="messages" stroke="#F59E0B" fillOpacity={0.1} fill="#F59E0B" strokeWidth={2} />
                  <Area type="monotone" dataKey="likes" stroke="#EC4899" fillOpacity={1} fill="url(#mPink)" strokeWidth={2.5} />
                  <Area type="monotone" dataKey="matches" stroke="#A855F7" fillOpacity={1} fill="url(#mPurple)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                Loading engagement chart...
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3">
          <div className="relative max-w-sm w-full">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search matches by user name or city..."
              className="w-full pl-9 pr-3 py-2 bg-[#151F30] border border-[#263247] rounded-xl text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-pink-500"
            />
          </div>
        </div>

        {/* Matches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMatches.map((m) => (
            <div
              key={m.id}
              className="p-5 rounded-2xl bg-[#151F30] border border-[#263247] hover:border-slate-600 transition-all space-y-4"
            >
              {/* Couple Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.userA.avatar}
                      alt={m.userA.name}
                      className="inline-block h-12 w-12 rounded-full ring-2 ring-[#151F30] object-cover"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.userB.avatar}
                      alt={m.userB.name}
                      className="inline-block h-12 w-12 rounded-full ring-2 ring-[#151F30] object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{m.userA.name}</span>
                      <Heart size={14} className="text-pink-500 fill-pink-500" />
                      <span>{m.userB.name}</span>
                    </h4>
                    <span className="text-xs text-slate-400">
                      {m.city} • Matched {m.matchedAt}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold flex items-center gap-1">
                    <Sparkles size={12} />
                    {m.compatibility}% Match
                  </span>
                </div>
              </div>

              {/* Tags & Status */}
              <div className="flex items-center justify-between pt-2 border-t border-[#263247]/60 flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {m.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-[#0D1424] text-slate-300 border border-[#263247] text-[11px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <MessageCircle size={14} className="text-cyan-400" />
                  <span>{m.messagesCount} messages exchanged</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

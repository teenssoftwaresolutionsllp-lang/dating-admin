"use client";

import React, { useState, useEffect, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Bell,
  ChevronDown,
  Menu,
  CheckCircle2,
  LogOut,
  User,
  Settings,
  ShieldAlert,
  Moon,
  Sun,
} from "lucide-react";
import { sampleNotifications } from "@/lib/mock-data";
import {
  getServerThemeSnapshot,
  getThemeSnapshot,
  initializeAdminTheme,
  setAdminTheme,
  subscribeToTheme,
} from "@/lib/theme";
import {
  AdminAccount,
  DEFAULT_ADMIN_USERS,
  DEFAULT_ROLE_PERMISSIONS,
  RolePermissionsMap,
  getCurrentAdmin,
  getRolePermissions,
  isRouteAllowedForRole,
  setCurrentAdmin,
} from "@/lib/auth-rbac";

interface AdminHeaderProps {
  onOpenMobileMenu: () => void;
  collapsed: boolean;
}

export function AdminHeader({
  onOpenMobileMenu,
  collapsed,
}: AdminHeaderProps) {
  const router = useRouter();
  const [selectedRange, setSelectedRange] = useState("Last 7 days");
  const [isRangeOpen, setIsRangeOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [currentAdmin, setCurrentAdminState] = useState<AdminAccount>(DEFAULT_ADMIN_USERS[0]);
  const [rolePerms, setRolePerms] = useState<RolePermissionsMap>(DEFAULT_ROLE_PERMISSIONS);
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot
  );

  const rangeRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    initializeAdminTheme();
    const syncAuth = () => {
      const admin = getCurrentAdmin();
      if (admin) setCurrentAdminState(admin);
      setRolePerms(getRolePermissions());
    };
    syncAuth();
    window.addEventListener("admin_session_changed", syncAuth);
    window.addEventListener("admin_roles_updated", syncAuth);
    return () => {
      window.removeEventListener("admin_session_changed", syncAuth);
      window.removeEventListener("admin_roles_updated", syncAuth);
    };
  }, []);

  const dateRanges = [
    "Today",
    "Yesterday",
    "Last 7 days",
    "Last 14 days",
    "Last 30 days",
    "This Month",
    "All Time",
  ];

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (rangeRef.current && !rangeRef.current.contains(e.target as Node)) {
        setIsRangeOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <header
      className={`sticky top-0 z-20 h-[72px] bg-[#0B1120] border-b border-[#1B2537] px-6 lg:px-8 flex items-center justify-between transition-all duration-300`}
    >
      {/* Left: Mobile hamburger */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#111A28] transition-colors"
          aria-label="Open mobile menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3 sm:gap-5">
        <button
          type="button"
          onClick={() => {
            setAdminTheme(theme === "dark" ? "light" : "dark");
          }}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          aria-pressed={theme === "light"}
          className="admin-theme-toggle"
        >
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          <span className="hidden sm:inline">
            {theme === "dark" ? "Light" : "Dark"}
          </span>
        </button>

        {/* Date Range Dropdown */}
        <div className="relative" ref={rangeRef}>
          <button
            onClick={() => setIsRangeOpen(!isRangeOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#111A28] border border-[#1F293D] text-xs font-medium text-slate-200 hover:border-slate-500 transition-colors"
          >
            <Calendar size={14} className="text-[#64748B] flex-shrink-0" />
            <span className="hidden sm:inline">{selectedRange}</span>
            <ChevronDown size={13} className="text-[#64748B]" />
          </button>

          {isRangeOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-[#111A28] border border-[#1F293D] rounded-xl shadow-2xl py-1 z-50 animate-in fade-in">
              <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Date Range
              </div>
              {dateRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => {
                    setSelectedRange(range);
                    setIsRangeOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center justify-between ${
                    selectedRange === range
                      ? "text-pink-400 bg-pink-500/10 font-semibold"
                      : "text-slate-300 hover:bg-[#1A263A]"
                  }`}
                >
                  <span>{range}</span>
                  {selectedRange === range && (
                    <CheckCircle2 size={13} className="text-pink-400" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 rounded-xl text-slate-300 hover:text-white transition-colors"
            aria-label="View notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#EF4444] text-white text-[10px] font-bold flex items-center justify-center shadow-md">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#111A28] border border-[#1F293D] rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in">
              <div className="p-3.5 border-b border-[#1F293D] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">
                    Notifications
                  </span>
                  <span className="text-xs bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full font-medium">
                    {unreadCount} new
                  </span>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-pink-400 hover:text-pink-300 font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#1F293D]/50">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3.5 hover:bg-[#1A263A] transition-colors text-left flex gap-3 ${
                      notif.unread ? "bg-slate-800/20" : ""
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-[#EF4444] mt-1.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-100">
                        {notif.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                        {notif.description}
                      </p>
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        {notif.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2.5 border-t border-[#1F293D] bg-[#090E1A] text-center">
                <Link
                  href="/notifications"
                  onClick={() => setIsNotificationsOpen(false)}
                  className="text-xs font-medium text-pink-400 hover:text-pink-300"
                >
                  View all alerts →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1 rounded-xl hover:opacity-90 transition-opacity"
          >
            <div className="w-9 h-9 rounded-full bg-[#3B82F6] text-white font-bold text-sm flex items-center justify-center shadow-md">
              {currentAdmin.avatar || currentAdmin.name.charAt(0).toUpperCase()}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-white tracking-tight leading-tight">
                {currentAdmin.name}
              </span>
              <span className="text-[10px] text-[#718096] font-medium leading-tight">
                {currentAdmin.role}
              </span>
            </div>
            <ChevronDown size={13} className="text-[#64748B] hidden sm:block" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-[#111A28] border border-[#1F293D] rounded-xl shadow-2xl py-1 z-50 animate-in fade-in">
              <div className="px-3.5 py-2.5 border-b border-[#1F293D]">
                <p className="text-xs font-semibold text-white">{currentAdmin.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{currentAdmin.email}</p>
              </div>

              <div className="py-1">
                {isRouteAllowedForRole(currentAdmin.role, "/admin-users", rolePerms) && (
                  <Link
                    href="/admin-users"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-300 hover:bg-[#1A263A] hover:text-white"
                  >
                    <User size={14} className="text-slate-400" />
                    <span>Admin Users</span>
                  </Link>
                )}
                {isRouteAllowedForRole(currentAdmin.role, "/settings", rolePerms) && (
                  <Link
                    href="/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-300 hover:bg-[#1A263A] hover:text-white"
                  >
                    <Settings size={14} className="text-slate-400" />
                    <span>Settings</span>
                  </Link>
                )}
                {isRouteAllowedForRole(currentAdmin.role, "/audit-logs", rolePerms) && (
                  <Link
                    href="/audit-logs"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-300 hover:bg-[#1A263A] hover:text-white"
                  >
                    <ShieldAlert size={14} className="text-slate-400" />
                    <span>Security Logs</span>
                  </Link>
                )}
              </div>

              <div className="border-t border-[#1F293D] pt-1">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setCurrentAdmin(null);
                    router.push("/login");
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

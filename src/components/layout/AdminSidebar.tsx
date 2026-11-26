"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  User,
  CheckCircle2,
  Shield,
  Heart,
  CreditCard,
  Receipt,
  TrendingUp,
  Send,
  BarChart2,
  Bell,
  FileText,
  HelpCircle,
  UserCheck,
  Users2,
  Settings,
  ClipboardList,
  Activity,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { navSections } from "@/lib/mock-data";
import {
  AdminAccount,
  DEFAULT_ADMIN_USERS,
  DEFAULT_ROLE_PERMISSIONS,
  RolePermissionsMap,
  filterNavSectionsForRole,
  getCurrentAdmin,
  getRolePermissions,
} from "@/lib/auth-rbac";

interface AdminSidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <Home size={17} />,
  Users: <User size={17} />,
  UserCheck: <UserCheck size={17} />,
  BadgeCheck: <CheckCircle2 size={17} />,
  ShieldAlert: <Shield size={17} />,
  HeartHandshake: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  ),
  CreditCard: <CreditCard size={17} />,
  Receipt: <Receipt size={17} />,
  TrendingUp: <TrendingUp size={17} />,
  Compass: <Send size={17} />,
  BarChart3: <BarChart2 size={17} />,
  Bell: <Bell size={17} />,
  FileText: <FileText size={17} />,
  LifeBuoy: <HelpCircle size={17} />,
  Shield: <Users2 size={17} />,
  Settings: <Settings size={17} />,
  ClipboardList: <ClipboardList size={17} />,
  Activity: <Activity size={17} />,
};

export function AdminSidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [currentAdmin, setCurrentAdminState] = useState<AdminAccount>(DEFAULT_ADMIN_USERS[0]);
  const [rolePerms, setRolePerms] = useState<RolePermissionsMap>(DEFAULT_ROLE_PERMISSIONS);

  useEffect(() => {
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

  const visibleSections = filterNavSectionsForRole(
    navSections,
    currentAdmin.role,
    rolePerms
  );

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#090E1A] text-slate-300 border-r border-[#1B2537] select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 py-4 h-[72px]">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex-shrink-0 flex items-center justify-center">
            <Heart
              size={28}
              className="text-[#FF2D55] fill-[#FF2D55] drop-shadow-[0_0_10px_rgba(255,45,85,0.4)]"
            />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-lg text-white tracking-tight leading-tight">
                DatingApp
              </span>
              <span className="text-[11px] text-[#718096] font-medium tracking-wide">
                Admin Portal
              </span>
            </div>
          )}
        </Link>

        {/* Mobile Close Button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
          aria-label="Close navigation"
        >
          <X size={18} />
        </button>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center w-6 h-6 rounded-md text-slate-500 hover:text-slate-200 transition-colors ml-auto"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* Navigation List grouped by Section */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4 scrollbar-thin">
        {visibleSections.map((section, sIdx) => (
          <div key={section.title || sIdx} className="space-y-1">
            {!collapsed && (
              <div className="px-3 pt-2 pb-1 text-[10px] font-bold tracking-wider text-[#64748B] uppercase select-none">
                {section.title}
              </div>
            )}
            {collapsed && sIdx > 0 && (
              <div className="my-2 border-t border-[#1B2537]/80" />
            )}

            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all duration-150 group relative ${
                      isActive
                        ? "bg-gradient-to-r from-[#be185d] via-[#a21caf] to-[#6b21a8] text-white shadow-[0_2px_12px_rgba(217,70,239,0.25)] border border-pink-500/30"
                        : "text-[#8896AB] hover:text-white hover:bg-[#111A28]/80"
                    }`}
                    title={collapsed ? item.title : undefined}
                  >
                    <div
                      className={`flex-shrink-0 transition-colors ${
                        isActive ? "text-white" : "text-[#7B8B9E] group-hover:text-white"
                      }`}
                    >
                      {iconMap[item.iconName] || <Home size={17} />}
                    </div>

                    {!collapsed && (
                      <span className="truncate flex-1 tracking-tight">
                        {item.title}
                      </span>
                    )}

                    {!collapsed && item.badge !== undefined && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EF4444] text-white flex-shrink-0 shadow-sm">
                        {item.badge}
                      </span>
                    )}

                    {collapsed && item.badge !== undefined && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#EF4444]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Info / Profile at Bottom */}
      <div className="p-4 border-t border-[#1B2537]/80">
        <div
          className={`flex items-center gap-3 py-1 cursor-pointer hover:opacity-90 transition-opacity ${
            collapsed ? "justify-center" : "justify-between"
          }`}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-[#3B82F6] text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-md">
              {currentAdmin.avatar || currentAdmin.name.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="flex flex-col overflow-hidden text-left">
                <span className="text-xs font-semibold text-white tracking-tight truncate">
                  {currentAdmin.name}
                </span>
                <span className="text-[10px] text-[#718096] font-medium truncate">
                  {currentAdmin.role}
                </span>
              </div>
            )}
          </div>
          {!collapsed && (
            <ChevronDown size={14} className="text-[#718096] flex-shrink-0" />
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block fixed top-0 left-0 bottom-0 z-30 transition-all duration-300 ease-in-out ${
          collapsed ? "w-20" : "w-[240px]"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-72 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}

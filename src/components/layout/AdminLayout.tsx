"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import {
  AdminAccount,
  RolePermissionsMap,
  DEFAULT_ROLE_PERMISSIONS,
  getCurrentAdmin,
  getRolePermissions,
  isRouteAllowedForRole,
} from "@/lib/auth-rbac";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<AdminAccount | null>(null);
  const [rolePerms, setRolePerms] = useState<RolePermissionsMap>(DEFAULT_ROLE_PERMISSIONS);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const syncAuth = () => {
      const admin = getCurrentAdmin();
      const perms = getRolePermissions();
      setCurrentAdmin(admin);
      setRolePerms(perms);
      setAuthChecked(true);
      if (!admin) {
        router.replace("/login");
      }
    };
    syncAuth();
    window.addEventListener("admin_session_changed", syncAuth);
    window.addEventListener("admin_roles_updated", syncAuth);
    return () => {
      window.removeEventListener("admin_session_changed", syncAuth);
      window.removeEventListener("admin_roles_updated", syncAuth);
    };
  }, [router]);

  const isAuthorized =
    !authChecked ||
    !currentAdmin ||
    isRouteAllowedForRole(currentAdmin.role, pathname, rolePerms);

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col font-sans">
      <AdminSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          collapsed ? "lg:pl-20" : "lg:pl-[240px]"
        }`}
      >
        <AdminHeader
          onOpenMobileMenu={() => setMobileOpen(true)}
          collapsed={collapsed}
        />

        <main className="flex-1 p-5 sm:p-6 lg:p-7 max-w-[1650px] w-full mx-auto">
          {!isAuthorized && currentAdmin ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <ShieldAlert size={32} />
              </div>
              <div className="space-y-1.5 max-w-md">
                <h2 className="text-xl font-bold text-white">Access Restricted</h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your current role (<span className="text-pink-400 font-semibold">{currentAdmin.role}</span>) does not have the required privileges to access{" "}
                  <span className="font-mono text-slate-300">{pathname}</span>. Contact the Super Admin if you need access.
                </p>
              </div>
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-xs font-semibold text-white flex items-center gap-2 hover:opacity-90 transition-opacity"
              >
                <ArrowLeft size={14} />
                Back to My Dashboard
              </Link>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}

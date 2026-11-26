"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Heart,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  AlertCircle,
  Users,
} from "lucide-react";
import {
  getRegisteredAdmins,
  setCurrentAdmin,
  AdminAccount,
} from "@/lib/auth-rbac";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [quickAccounts, setQuickAccounts] = useState<AdminAccount[]>([]);

  useEffect(() => {
    const admins = getRegisteredAdmins();
    setQuickAccounts(admins);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);

    const admins = getRegisteredAdmins();
    const cleanEmail = email.trim().toLowerCase();

    const matchedAdmin = admins.find(
      (a) => a.email.toLowerCase() === cleanEmail
    );

    if (!matchedAdmin) {
      setErrorMsg("No administrator account found with this email address.");
      return;
    }

    if (matchedAdmin.status === "Inactive") {
      setErrorMsg("This administrator account has been deactivated. Please contact Super Admin.");
      return;
    }

    const expectedPassword = matchedAdmin.password || "password123";
    if (password !== expectedPassword) {
      setErrorMsg("Invalid password. Please check your credentials.");
      return;
    }

    // Update last login
    const updated = admins.map((a) =>
      a.id === matchedAdmin.id
        ? {
            ...a,
            lastLogin: "Just now",
            status: "Active" as const,
          }
        : a
    );
    if (typeof window !== "undefined") {
      localStorage.setItem("dating_admin_accounts", JSON.stringify(updated));
    }

    const activeUser: AdminAccount = {
      ...matchedAdmin,
      lastLogin: "Just now",
      status: "Active" as const,
    };
    setCurrentAdmin(activeUser);

    // Redirect all roles to their role- & privilege-based dashboard
    router.push("/dashboard");
  };

  const handleSelectQuickAccount = (admin: AdminAccount) => {
    setEmail(admin.email);
    setPassword(admin.password || "password123");
    setErrorMsg(null);
  };

  return (
    <main className="login-page">
      <div className="login-glow login-glow-one" />
      <div className="login-glow login-glow-two" />

      <section className="login-card">
        <div className="login-logo">
          <Heart size={28} fill="currentColor" />
        </div>

        <p className="login-brand">DATING APP</p>

        <h1>Admin Portal</h1>

        <p className="login-subtitle">
          Welcome back! Sign in with your administrator credentials.
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle size={15} className="flex-shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email Address</label>

          <div className="login-input">
            <Mail size={18} />

            <input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <label htmlFor="password">Password</label>

          <div className="login-input">
            <LockKeyhole size={18} />

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          <div className="login-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>

            <span className="text-[11px] text-slate-400">
              Role: Auto-detected
            </span>
          </div>

          <button className="login-button" type="submit">
            Sign In to Admin Portal
          </button>
        </form>

        {/* Quick Account Switcher for Demo / Testing */}
        {quickAccounts.length > 0 && (
          <div className="mt-5 pt-4 border-t border-[#1F293D] text-left">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Users size={12} className="text-pink-400" /> Quick Login Accounts:
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {quickAccounts.slice(0, 4).map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => handleSelectQuickAccount(acc)}
                  className={`text-left p-2 rounded-lg border text-[11px] transition-all ${
                    email.toLowerCase() === acc.email.toLowerCase()
                      ? "bg-pink-500/15 border-pink-500/40 text-white font-medium"
                      : "bg-[#0D1424] border-[#1F293D] text-slate-300 hover:border-slate-500"
                  }`}
                >
                  <span className="font-semibold block truncate">{acc.name}</span>
                  <span className="text-[10px] text-pink-400 block truncate">{acc.role}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="login-security">
          <ShieldCheck size={17} />
          <span>Role-Based Access Control Protected</span>
        </div>

        <p className="login-footer">
          © 2026 Dating App. All rights reserved.
        </p>
      </section>
    </main>
  );
}

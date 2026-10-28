"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, ShieldCheck, GraduationCap, UsersRound, AlertCircle, LogOut } from "lucide-react";
import { UserRole, User } from "@/lib/types";
import { getStoredUsers } from "@/lib/userStore";
import { loginSession, getCurrentSession, logoutSession } from "@/lib/authStore";
import { UserAvatar } from "@/components/UserAvatar";

export default function LoginPage() {
  const router = useRouter();

  type RoleOption = "INTERN" | "MENTOR" | "ADMIN";

  const roleCredentials: Record<
    RoleOption,
    { email: string; name: string; destination: string; roleLabel: string; desc: string }
  > = {
    INTERN: {
      email: "aarav.mehta@veda.internal",
      name: "Aarav Mehta",
      destination: "/intern",
      roleLabel: "Intern",
      desc: "Task submissions & mentor feedback",
    },
    MENTOR: {
      email: "anish.sharma@veda.internal",
      name: "Dr. Anish Sharma",
      destination: "/mentor",
      roleLabel: "Mentor",
      desc: "Submission reviews & corrections",
    },
    ADMIN: {
      email: "admin@veda.internal",
      name: "Admin",
      destination: "/admin",
      roleLabel: "Administrator",
      desc: "Programme oversight & dashboard",
    },
  };

  const [selectedRole, setSelectedRole] = useState<RoleOption>("INTERN");
  const [email, setEmail] = useState(roleCredentials.INTERN.email);
  const [password, setPassword] = useState("••••••••••••");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<User | null>(null);

  useEffect(() => {
    const session = getCurrentSession();
    setActiveSession(session);
  }, []);

  const handleSelectRole = (role: RoleOption) => {
    setSelectedRole(role);
    setError(null);
    const stored = getStoredUsers();
    const roleUser = stored.find((u) => u.role === role);
    if (roleUser) {
      setEmail(roleUser.email);
    } else {
      setEmail(roleCredentials[role].email);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = loginSession(email, password);
    setLoading(false);

    if (!result.success || !result.user) {
      setError(result.error || "Authentication failed.");
      return;
    }

    const user = result.user;
    let dest = "/intern";
    if (user.role === "ADMIN") dest = "/admin";
    else if (user.role === "MENTOR") dest = "/mentor";
    else if (user.role === "INTERN") dest = "/intern";

    router.push(dest);
  };

  const handleSignOutCurrent = () => {
    logoutSession();
    setActiveSession(null);
    setEmail(roleCredentials[selectedRole].email);
  };

  const handleContinueExisting = () => {
    if (!activeSession) return;
    if (activeSession.role === "ADMIN") router.push("/admin");
    else if (activeSession.role === "MENTOR") router.push("/mentor");
    else router.push("/intern");
  };

  return (
    <main className="min-h-screen bg-[#F8F6F0] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[#EAE5DA] bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-6">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-3xl font-black tracking-tight text-[#E2BD62]">VEDA</span>
            <span className="text-[10px] font-bold tracking-widest text-[#0F2E22] uppercase bg-[#8CE6B6] px-2 py-0.5 rounded">
              PORTAL
            </span>
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-[#162520]">
            Portal Authentication
          </h1>
          <p className="mt-1 text-xs text-[#586B63]">
            Sign in with your verified credentials to enter your role workspace.
          </p>
        </div>

        {/* Existing Active Session Banner (if any) */}
        {activeSession && (
          <div className="p-3.5 rounded-xl bg-[#FAF8F3] border border-[#EAE5DA] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Current Active Session:
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                {activeSession.role}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <UserAvatar name={activeSession.fullName} role={activeSession.role} size="sm" />
              <div className="grow">
                <p className="font-bold text-xs text-slate-900 leading-tight">{activeSession.fullName}</p>
                <p className="text-[11px] text-slate-500 font-mono leading-tight">{activeSession.email}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-[#F0ECE2] flex items-center gap-2">
              <button
                type="button"
                onClick={handleContinueExisting}
                className="grow px-3 py-1.5 rounded-lg bg-[#0F2E22] text-[#8EE2B7] text-xs font-semibold hover:bg-[#0A2218] transition-colors cursor-pointer"
              >
                Continue to Workspace →
              </button>
              <button
                type="button"
                onClick={handleSignOutCurrent}
                title="Sign out this account to switch user"
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:text-rose-600 hover:bg-rose-50 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Role Quick Selection Tabs */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Choose Role to Sign In:
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleSelectRole("INTERN")}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                selectedRole === "INTERN"
                  ? "bg-[#E6F8EE] border-[#8EE2B7] text-[#136C40] ring-2 ring-[#8EE2B7]/50 font-bold"
                  : "bg-[#FAF8F3] border-[#EAE5DA] text-slate-600 hover:bg-slate-50 font-medium"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span className="text-xs">Intern</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectRole("MENTOR")}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                selectedRole === "MENTOR"
                  ? "bg-[#EEF2FF] border-[#A5B4FC] text-[#4338CA] ring-2 ring-[#A5B4FC]/50 font-bold"
                  : "bg-[#FAF8F3] border-[#EAE5DA] text-slate-600 hover:bg-slate-50 font-medium"
              }`}
            >
              <UsersRound className="w-4 h-4" />
              <span className="text-xs">Mentor</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectRole("ADMIN")}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                selectedRole === "ADMIN"
                  ? "bg-[#0F2E22] border-[#0F2E22] text-[#8EE2B7] ring-2 ring-[#0F2E22]/30 font-bold"
                  : "bg-[#FAF8F3] border-[#EAE5DA] text-slate-600 hover:bg-slate-50 font-medium"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs">Admin</span>
            </button>
          </div>
        </div>

        {/* Selected Role Description Banner */}
        <div className="p-3.5 rounded-xl bg-[#FAF8F3] border border-[#EAE5DA] flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-[#182622]">
              {roleCredentials[selectedRole].roleLabel} Account
            </span>
            <p className="text-[11px] text-[#586B63]">
              {roleCredentials[selectedRole].desc}
            </p>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-slate-600 border border-[#EAE5DA]">
            {roleCredentials[selectedRole].destination}
          </span>
        </div>

        {/* Error alert */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Account Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 pl-3.5 pr-9 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#8EE2B7] focus:border-transparent transition-all shadow-2xs"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8EE2B7] focus:border-transparent transition-all shadow-2xs"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-xl px-4 py-3 font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
              selectedRole === "INTERN"
                ? "bg-[#136C40] text-white hover:bg-[#0E5431]"
                : selectedRole === "MENTOR"
                ? "bg-indigo-700 text-white hover:bg-indigo-800"
                : "bg-[#0F2E22] text-[#8EE2B7] hover:bg-[#0A2218]"
            }`}
          >
            {loading
              ? "Authenticating..."
              : `Sign in as ${roleCredentials[selectedRole].roleLabel}`}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[11px] text-center text-slate-400">
          Role-protected portal. Direct role switching is restricted without authentication.
        </p>
      </div>
    </main>
  );
}

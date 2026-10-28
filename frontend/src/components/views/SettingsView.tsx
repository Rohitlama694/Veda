"use client";

import React, { useState } from "react";
import { KeyRound, Shield, Server, CheckCircle2, Bell, AlertTriangle } from "lucide-react";
import { MOCK_ADMIN_USER } from "@/lib/mockData";
import { ChangePasswordModal } from "../ChangePasswordModal";
import { ApiStatusModal } from "../ApiStatusModal";
import { UserAvatar } from "../UserAvatar";

export const SettingsView: React.FC = () => {
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [apiModalOpen, setApiModalOpen] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [strictRepoCheck, setStrictRepoCheck] = useState(true);
  const [autoAssignReviews, setAutoAssignReviews] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-[#182622]">Administrator Settings</h2>
        <p className="text-xs text-[#586B63] mt-0.5">
          Manage administrator profile credentials, security policies, and API integration targets.
        </p>
      </div>

      {/* Account Info Card */}
      <div className="bg-white rounded-2xl border border-[#EAE5DA] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-4">
        <h3 className="text-base font-bold text-[#182622]">Administrator Profile</h3>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#FAF8F3] border border-[#EAE5DA]">
          <div className="flex items-center gap-4">
            <UserAvatar name={MOCK_ADMIN_USER.fullName} role="ADMIN" size="xl" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-[#182622]">{MOCK_ADMIN_USER.fullName}</span>
                <span className="bg-[#0F2E22] text-[#8EE2B7] text-[10px] font-bold px-2 py-0.5 rounded">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{MOCK_ADMIN_USER.email}</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Access Level: Full Portal & Review Oversight
              </p>
            </div>
          </div>

          <button
            onClick={() => setPasswordModalOpen(true)}
            className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-white hover:text-slate-900 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-600" />
            <span>Change Password</span>
          </button>
        </div>
      </div>

      {/* Security & Data Boundaries Notice */}
      <div className="bg-white rounded-2xl border border-[#EAE5DA] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-3">
        <div className="flex items-center gap-2 text-emerald-900">
          <Shield className="w-5 h-5 text-emerald-700" />
          <h3 className="text-base font-bold text-[#182622]">Security & Role Boundaries</h3>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          The admin UI is strictly for an authenticated administrator. In the eventual full-stack implementation, the <strong>Django REST Framework backend and SQLite database</strong> must enforce administrator permissions on all protected APIs. Frontend route visibility alone is not security.
        </p>

        <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
          <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-mono border border-emerald-200">
            Backend: Django + DRF + SimpleJWT
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-mono border border-slate-200">
            Database: SQLite (local dev)
          </span>
          <button
            onClick={() => setApiModalOpen(true)}
            className="px-2.5 py-1 rounded-md bg-[#0F2E22] text-[#8EE2B7] font-semibold hover:bg-[#0A2218] transition-colors cursor-pointer"
          >
            View API Contract →
          </button>
        </div>
      </div>

      {/* Portal Settings & Toggles */}
      <div className="bg-white rounded-2xl border border-[#EAE5DA] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-4">
        <h3 className="text-base font-bold text-[#182622]">Portal Automation Rules</h3>

        <div className="divide-y divide-slate-100 text-xs">
          <div className="py-3 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-slate-800">Email Submission Notifications</p>
              <p className="text-slate-400">
                Notify supervising mentors immediately when an intern submits a new task attempt.
              </p>
            </div>
            <button
              onClick={() => setEmailAlerts(!emailAlerts)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                emailAlerts ? "bg-[#0F2E22]" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  emailAlerts ? "translate-x-5 bg-[#8EE2B7]" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="py-3 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-slate-800">Strict Repository Format Validation</p>
              <p className="text-slate-400">
                Ensure submitted repository URLs conform to standard GitHub repository paths.
              </p>
            </div>
            <button
              onClick={() => setStrictRepoCheck(!strictRepoCheck)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                strictRepoCheck ? "bg-[#0F2E22]" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  strictRepoCheck ? "translate-x-5 bg-[#8EE2B7]" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="py-3 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-slate-800">Automatic Resubmission Routing</p>
              <p className="text-slate-400">
                Automatically route subsequent attempt versions back to the original reviewing mentor.
              </p>
            </div>
            <button
              onClick={() => setAutoAssignReviews(!autoAssignReviews)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                autoAssignReviews ? "bg-[#0F2E22]" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  autoAssignReviews ? "translate-x-5 bg-[#8EE2B7]" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ChangePasswordModal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      />

      <ApiStatusModal
        isOpen={apiModalOpen}
        onClose={() => setApiModalOpen(false)}
      />
    </div>
  );
};

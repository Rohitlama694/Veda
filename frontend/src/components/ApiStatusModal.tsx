"use client";

import React from "react";
import { X, Server, Database, ShieldAlert, CheckCircle2, Lock } from "lucide-react";

interface ApiStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiStatusModal: React.FC<ApiStatusModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const endpoints = [
    { method: "POST", path: "/api/auth/token/", desc: "JWT Obtain Pair (Admin authentication)" },
    { method: "GET", path: "/api/accounts/users/", desc: "User list with role filtering (Admin only)" },
    { method: "GET", path: "/api/groups/", desc: "Internship groups, mentors & membership" },
    { method: "GET", path: "/api/projects/", desc: "Projects and task deliverables" },
    { method: "GET", path: "/api/submissions/", desc: "Submission attempts & version history" },
    { method: "POST", path: "/api/submissions/{id}/reviews/", desc: "Mentor review & written feedback" },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        <div className="relative w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-2xl transition-all border border-[#EAE5DA]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Server className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#182622]">Backend Integration Architecture</h3>
                <p className="text-xs text-slate-500">Django REST Framework & SQLite Target</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 space-y-4 text-xs">
            {/* Status notice */}
            <div className="p-3.5 rounded-xl bg-[#F6FAF7] border border-emerald-200/80 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-950">Frontend Ready for API Connection</p>
                <p className="text-emerald-800/80 mt-0.5 leading-relaxed">
                  The UI uses typed interfaces matching Django models (`User`, `Group`, `Project`, `Task`, `SubmissionAttempt`, `Review`). Target endpoint configured at{" "}
                  <code className="bg-white/80 px-1 py-0.5 rounded font-mono text-[11px] text-emerald-900">
                    http://127.0.0.1:8000/api
                  </code>.
                </p>
              </div>
            </div>

            {/* Security boundary callout */}
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-950">Security & Data Boundaries</p>
                <p className="text-amber-900/80 mt-0.5 leading-relaxed">
                  Frontend route visibility alone is not security. In the full-stack setup, Django REST Framework enforces role permissions (e.g., `IsAdminUser`, `IsMentorOrAdmin`) and JWT tokens on all protected endpoints.
                </p>
              </div>
            </div>

            {/* Endpoints specification */}
            <div>
              <p className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
                DRF Endpoint Mapping
              </p>
              <div className="rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                {endpoints.map((ep) => (
                  <div key={ep.path} className="px-3.5 py-2 flex items-center justify-between font-mono text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-700 w-12">{ep.method}</span>
                      <span className="text-slate-800">{ep.path}</span>
                    </div>
                    <span className="font-sans text-slate-500 text-[10px] hidden sm:block">
                      {ep.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#0F2E22] text-[#8EE2B7] text-xs font-semibold hover:bg-[#0A2218] transition-colors"
            >
              Understood
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

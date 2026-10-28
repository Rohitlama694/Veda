"use client";

import React, { useState } from "react";
import { X, UsersRound, CheckCircle2, AlertCircle } from "lucide-react";
import { assignMentorToGroup } from "@/lib/projectStore";
import { getStoredUsers } from "@/lib/userStore";
import { Group } from "@/lib/types";
import { UserAvatar } from "../UserAvatar";

interface ReassignMentorModalProps {
  group: Group | null;
  isOpen: boolean;
  onClose: () => void;
  onMentorReassigned: () => void;
}

export const ReassignMentorModal: React.FC<ReassignMentorModalProps> = ({
  group,
  isOpen,
  onClose,
  onMentorReassigned,
}) => {
  const allUsers = getStoredUsers();
  const mentors = allUsers.filter((u) => u.role === "MENTOR");

  const [mentorId, setMentorId] = useState<number>(group?.mentorId || mentors[0]?.id || 2);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !group) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = assignMentorToGroup(group.id, Number(mentorId));
    setLoading(false);

    if (!result.success) {
      setError(result.error || "Failed to reassign mentor.");
      return;
    }

    onMentorReassigned();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        {/* Modal Dialog */}
        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-2xl transition-all border border-[#EAE5DA]">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE2]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#4338CA] flex items-center justify-center border border-[#C7D2FE]">
                <UsersRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#182622]">Reassign Supervising Mentor</h3>
                <p className="text-xs text-[#586B63]">
                  Cohort <span className="font-bold text-slate-800">{group.code}</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <div className="p-3 rounded-xl bg-[#FAF8F3] border border-[#EAE5DA]">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Current Assigned Mentor:
              </p>
              <div className="flex items-center gap-2.5">
                <UserAvatar name={group.mentor.fullName} role="MENTOR" size="sm" />
                <div>
                  <p className="font-bold text-slate-900">{group.mentor.fullName}</p>
                  <p className="text-[11px] text-slate-500 font-mono">{group.mentor.email}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#0F2E22] uppercase tracking-wider text-[11px] mb-1.5">
                Select New Supervising Mentor:
              </label>
              <select
                value={mentorId}
                onChange={(e) => setMentorId(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-[#8EE2B7]"
              >
                {mentors.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.fullName} ({m.email}) — {m.department}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-3 border-t border-[#F0ECE2] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-[#0F2E22] text-[#8EE2B7] font-semibold hover:bg-[#0A2218] transition-colors shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{loading ? "Reassigning..." : "Reassign Mentor"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

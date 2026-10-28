"use client";

import React, { useState, useEffect } from "react";
import { X, Mail, ShieldCheck, GraduationCap, UsersRound, AlertCircle, Save } from "lucide-react";
import { User, UserRole } from "@/lib/types";
import { updatePortalUser } from "@/lib/userStore";
import { UserAvatar } from "../UserAvatar";

interface EditUserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: (user: User) => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  user,
  isOpen,
  onClose,
  onUserUpdated,
}) => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<UserRole>("INTERN");
  const [department, setDepartment] = useState("");
  const [assignedGroupCode, setAssignedGroupCode] = useState<string>("NONE");
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setFullName(user.fullName);
      setRole(user.role);
      setDepartment(user.department || "");
      setAssignedGroupCode(user.assignedGroupCode || "NONE");
      setIsActive(user.isActive);
      setError(null);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!fullName.trim()) {
      setError("Full name cannot be empty.");
      return;
    }

    setLoading(true);

    const result = updatePortalUser(user.id, {
      email: trimmedEmail,
      fullName: fullName.trim(),
      role,
      department: department.trim(),
      assignedGroupCode: assignedGroupCode === "NONE" ? undefined : assignedGroupCode,
      isActive,
    });

    setLoading(false);

    if (!result.success || !result.user) {
      setError(result.error || "Failed to update user.");
      return;
    }

    onUserUpdated(result.user);
    onClose();
  };

  const isRootAdmin = user.id === 1 || user.email === "admin@veda.internal";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        {/* Modal Dialog */}
        <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-2xl transition-all border border-[#EAE5DA]">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#F0ECE2]">
            <div className="flex items-center gap-3">
              <UserAvatar name={user.fullName} role={user.role} size="lg" />
              <div>
                <h3 className="text-base font-bold text-[#182622]">Edit User & Change Email</h3>
                <p className="text-xs text-[#586B63]">
                  Managing credentials for <span className="font-semibold text-slate-800">{user.fullName}</span>
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Change Email Field (Prominent) */}
            <div className="p-3.5 rounded-xl bg-[#FAF8F3] border border-[#EAE5DA] space-y-1.5">
              <label className="block font-bold text-[#0F2E22] uppercase tracking-wider text-[11px]">
                Account Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@veda.internal"
                  required
                  className="w-full rounded-xl border border-slate-300 pl-3.5 pr-9 py-2 text-xs text-slate-900 font-mono bg-white focus:outline-none focus:ring-2 focus:ring-[#8EE2B7] focus:border-transparent transition-all"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              </div>
              <p className="text-[11px] text-[#586B63]">
                Updating this email modifies the login identifier the user uses to sign in.
              </p>
            </div>

            {/* Full Name */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8EE2B7] focus:border-transparent transition-all"
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Role Authorization
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  disabled={isRootAdmin}
                  onClick={() => setRole("INTERN")}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    role === "INTERN"
                      ? "bg-[#E6F8EE] border-[#8EE2B7] text-[#136C40] font-bold ring-2 ring-[#8EE2B7]/50"
                      : "bg-[#FAF8F3] border-[#EAE5DA] text-slate-600 hover:bg-slate-50"
                  } ${isRootAdmin ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Intern</span>
                </button>

                <button
                  type="button"
                  disabled={isRootAdmin}
                  onClick={() => setRole("MENTOR")}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    role === "MENTOR"
                      ? "bg-[#EEF2FF] border-[#A5B4FC] text-[#4338CA] font-bold ring-2 ring-[#A5B4FC]/50"
                      : "bg-[#FAF8F3] border-[#EAE5DA] text-slate-600 hover:bg-slate-50"
                  } ${isRootAdmin ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  <UsersRound className="w-3.5 h-3.5" />
                  <span>Mentor</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("ADMIN")}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    role === "ADMIN"
                      ? "bg-[#0F2E22] border-[#0F2E22] text-[#8EE2B7] font-bold ring-2 ring-[#0F2E22]/30"
                      : "bg-[#FAF8F3] border-[#EAE5DA] text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>
              </div>
            </div>

            {/* Department / Track */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Department / Engineering Track
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Applied AI Track"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8EE2B7] focus:border-transparent transition-all"
              />
            </div>

            {/* Assigned Cohort Group */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Assigned Cohort Group
              </label>
              <select
                value={assignedGroupCode}
                onChange={(e) => setAssignedGroupCode(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#8EE2B7] focus:border-transparent transition-all"
              >
                <option value="NONE">Not Assigned (General Oversight)</option>
                <option value="VEDA-01">VEDA-01 (Machine Learning & AI Track)</option>
                <option value="VEDA-02">VEDA-02 (Data Engineering & NLP Track)</option>
              </select>
            </div>

            {/* Account Status */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <p className="font-semibold text-slate-800">Account Active</p>
                <p className="text-[11px] text-slate-500">Allow this user to sign in</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  disabled={isRootAdmin}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0F2E22]"></div>
              </label>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[#F0ECE2] flex items-center justify-end gap-2.5">
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
                <Save className="w-4 h-4" />
                <span>{loading ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

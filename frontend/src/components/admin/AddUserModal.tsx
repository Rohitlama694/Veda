"use client";

import React, { useState } from "react";
import { X, UserPlus, Mail, Lock, Eye, EyeOff, ShieldCheck, GraduationCap, UsersRound, AlertCircle } from "lucide-react";
import { UserRole } from "@/lib/types";
import { addPortalUser } from "@/lib/userStore";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: (userName: string) => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onUserAdded }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("INTERN");
  const [department, setDepartment] = useState("Applied AI Track");
  const [assignedGroupCode, setAssignedGroupCode] = useState<string>("VEDA-01");
  const [password, setPassword] = useState("Veda@2026");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError("Please provide the user's full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please provide a valid email address.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Initial password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const result = addPortalUser({
      fullName: fullName.trim(),
      email: email.trim(),
      role,
      department: department.trim(),
      assignedGroupCode: assignedGroupCode === "NONE" ? undefined : assignedGroupCode,
      password,
    });

    setLoading(false);

    if (!result.success) {
      setError(result.error || "Failed to create user.");
      return;
    }

    onUserAdded(result.user?.fullName || fullName);
    handleClose();
  };

  const handleClose = () => {
    setError(null);
    setFullName("");
    setEmail("");
    setRole("INTERN");
    setDepartment("Applied AI Track");
    setAssignedGroupCode("VEDA-01");
    setPassword("Veda@2026");
    setShowPassword(false);
    onClose();
  };

  const departmentPresets = [
    "Applied AI Track",
    "Machine Learning & AI",
    "Data Engineering",
    "NLP Track",
    "Internship Operations",
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          onClick={handleClose}
        />

        {/* Modal Dialog */}
        <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-2xl transition-all border border-[#EAE5DA]">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#F0ECE2]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E6F8EE] text-[#136C40] flex items-center justify-center border border-[#B7ECCF]">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#182622]">Add New Portal User</h3>
                <p className="text-xs text-[#586B63]">Provision user credentials and permissions</p>
              </div>
            </div>
            <button
              onClick={handleClose}
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

            {/* Role Selection */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Portal Role:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRole("INTERN");
                    setDepartment("Applied AI Track");
                    setAssignedGroupCode("VEDA-01");
                  }}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    role === "INTERN"
                      ? "bg-[#E6F8EE] border-[#8EE2B7] text-[#136C40] ring-2 ring-[#8EE2B7]/50 font-bold"
                      : "bg-[#FAF8F3] border-[#EAE5DA] text-slate-600 hover:bg-slate-50 font-medium"
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span className="text-xs">Intern</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole("MENTOR");
                    setDepartment("Machine Learning & AI");
                    setAssignedGroupCode("VEDA-01");
                  }}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    role === "MENTOR"
                      ? "bg-[#EEF2FF] border-[#A5B4FC] text-[#4338CA] ring-2 ring-[#A5B4FC]/50 font-bold"
                      : "bg-[#FAF8F3] border-[#EAE5DA] text-slate-600 hover:bg-slate-50 font-medium"
                  }`}
                >
                  <UsersRound className="w-4 h-4" />
                  <span className="text-xs">Mentor</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole("ADMIN");
                    setDepartment("Internship Operations");
                    setAssignedGroupCode("NONE");
                  }}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    role === "ADMIN"
                      ? "bg-[#0F2E22] border-[#0F2E22] text-[#8EE2B7] ring-2 ring-[#0F2E22]/30 font-bold"
                      : "bg-[#FAF8F3] border-[#EAE5DA] text-slate-600 hover:bg-slate-50 font-medium"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-xs">Administrator</span>
                </button>
              </div>
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
                placeholder="e.g. Vikram Sen"
                required
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8EE2B7] focus:border-transparent transition-all"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. vikram.sen@veda.internal"
                  required
                  className="w-full rounded-xl border border-slate-300 pl-3.5 pr-9 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#8EE2B7] focus:border-transparent transition-all"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              </div>
            </div>

            {/* Initial Password */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Initial Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  className="w-full rounded-xl border border-slate-300 pl-3.5 pr-9 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#8EE2B7] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                The user can use this password to sign into their portal dashboard.
              </p>
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
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {departmentPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setDepartment(preset)}
                    className={`px-2 py-0.5 rounded-md text-[10px] border transition-colors cursor-pointer ${
                      department === preset
                        ? "bg-[#FAF6EE] text-[#0F2E22] font-semibold border-[#DCD3BE]"
                        : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Assigned Cohort Group */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Assigned Cohort Group
              </label>
              <select
                value={assignedGroupCode}
                onChange={(e) => setAssignedGroupCode(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#8EE2B7] focus:border-transparent transition-all"
              >
                <option value="NONE">Not Assigned (General Oversight)</option>
                <option value="VEDA-01">VEDA-01 (Machine Learning & AI Track)</option>
                <option value="VEDA-02">VEDA-02 (Data Engineering & NLP Track)</option>
              </select>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[#F0ECE2] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-[#0F2E22] text-[#8EE2B7] font-semibold hover:bg-[#0A2218] transition-colors shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>{loading ? "Creating..." : "Create User Account"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
